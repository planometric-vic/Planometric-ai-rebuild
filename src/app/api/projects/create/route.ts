import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { uploadToS3 } from '@/lib/s3';
import { processWithRhinoCompute } from '@/lib/rhino-compute';

const PLAN_GENERATION_PRICE = parseInt(
  process.env.PLAN_GENERATION_PRICE || '2900'
); // Price in cents

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const projectNumber = formData.get('projectNumber') as string;
    const projectName = formData.get('projectName') as string;
    const northOrientation = parseFloat(
      formData.get('northOrientation') as string
    );
    const localCouncil = formData.get('localCouncil') as string;
    const planningZone = formData.get('planningZone') as string;

    if (!file || !projectNumber || !projectName || !localCouncil || !planningZone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user has valid payment method
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user?.hasValidPayment) {
      return NextResponse.json(
        { error: 'Valid payment method required. Please add payment details in settings.' },
        { status: 400 }
      );
    }

    // Create payment intent with Stripe
    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.create({
        amount: PLAN_GENERATION_PRICE,
        currency: 'aud',
        customer: user.stripeCustomerId || undefined,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          userId: session.user.id,
          projectName,
          projectNumber,
        },
      });
    } catch (error) {
      console.error('Stripe payment error:', error);
      return NextResponse.json(
        { error: 'Payment processing failed' },
        { status: 500 }
      );
    }

    // Upload original file to S3
    const fileExtension = file.name.split('.').pop();
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const s3Key = `uploads/${session.user.id}/${Date.now()}-${file.name}`;
    const fileUrl = await uploadToS3(
      s3Key,
      fileBuffer,
      file.type || 'application/octet-stream'
    );

    // Create project in database
    const project = await prisma.project.create({
      data: {
        userId: session.user.id,
        projectNumber,
        projectName,
        northOrientation,
        localCouncil,
        planningZone,
        originalFileName: file.name,
        originalFileUrl: fileUrl,
        originalFileType: fileExtension || 'unknown',
        status: 'PROCESSING',
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        projectId: project.id,
        stripePaymentIntentId: paymentIntent.id,
        amount: PLAN_GENERATION_PRICE,
        currency: 'aud',
        status: 'PENDING',
      },
    });

    // Process with Rhino Compute in the background
    // In production, this should be done via a queue/worker
    processProject(project.id, fileBuffer, file.name, {
      projectNumber,
      projectName,
      northOrientation,
      localCouncil,
      planningZone,
    }).catch(async (error) => {
      console.error('Project processing error:', error);
      // Update project status to failed
      await prisma.project.update({
        where: { id: project.id },
        data: { status: 'FAILED' },
      });
    });

    return NextResponse.json({
      projectId: project.id,
      message: 'Project created successfully',
    });
  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

async function processProject(
  projectId: string,
  fileBuffer: Buffer,
  fileName: string,
  inputs: {
    projectNumber: string;
    projectName: string;
    northOrientation: number;
    localCouncil: string;
    planningZone: string;
  }
) {
  try {
    // Process with Rhino Compute
    const result = await processWithRhinoCompute(fileBuffer, fileName, inputs);

    // Get the project and user
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { user: true },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Upload PDFs to S3
    const plansKey = `plans/${project.userId}/${projectId}/plans.pdf`;
    const invoiceKey = `plans/${project.userId}/${projectId}/invoice.pdf`;

    const plansPdfUrl = await uploadToS3(
      plansKey,
      result.plansPdf,
      'application/pdf'
    );
    const invoicePdfUrl = await uploadToS3(
      invoiceKey,
      result.invoicePdf,
      'application/pdf'
    );

    // Update project with PDF URLs
    await prisma.project.update({
      where: { id: projectId },
      data: {
        status: 'COMPLETED',
        plansPdfUrl,
        invoicePdfUrl,
      },
    });

    // Confirm payment
    const payment = await prisma.payment.findUnique({
      where: { projectId },
    });

    if (payment) {
      await stripe.paymentIntents.confirm(payment.stripePaymentIntentId);
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'SUCCEEDED' },
      });
    }
  } catch (error) {
    console.error('Processing error:', error);
    throw error;
  }
}
