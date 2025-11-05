import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Download, FileText, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const project = await prisma.project.findUnique({
    where: {
      id: params.id,
      userId: session.user.id, // Ensure user owns this project
    },
    include: {
      payment: true,
    },
  });

  if (!project) {
    redirect('/dashboard/projects');
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <Link
            href="/dashboard/projects"
            className="text-primary-600 hover:text-primary-700 font-medium mb-4 inline-block"
          >
            ← Back to Projects
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {project.projectName}
          </h1>
          <p className="text-gray-600 mt-2">Project #{project.projectNumber}</p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {project.status === 'PROCESSING' && (
                <>
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Generating Your Plans Now
                    </h3>
                    <p className="text-gray-600">
                      This usually takes 2-5 minutes. Please wait...
                    </p>
                  </div>
                </>
              )}
              {project.status === 'COMPLETED' && (
                <>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Your Plans Are Ready!
                    </h3>
                    <p className="text-gray-600">
                      Download your landscape plans and invoice below
                    </p>
                  </div>
                </>
              )}
              {project.status === 'FAILED' && (
                <>
                  <AlertCircle className="w-8 h-8 text-red-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Generation Failed
                    </h3>
                    <p className="text-gray-600">
                      There was an error generating your plans. Please contact
                      support.
                    </p>
                  </div>
                </>
              )}
              {project.status === 'PENDING' && (
                <>
                  <FileText className="w-8 h-8 text-gray-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Pending
                    </h3>
                    <p className="text-gray-600">
                      Your project is queued for processing
                    </p>
                  </div>
                </>
              )}
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                project.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-700'
                  : project.status === 'PROCESSING'
                  ? 'bg-blue-100 text-blue-700'
                  : project.status === 'FAILED'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {project.status}
            </span>
          </div>
        </div>

        {/* Downloads */}
        {project.status === 'COMPLETED' && project.plansPdfUrl && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Downloads
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <a
                href={`/api/projects/${project.id}/download/plans`}
                className="flex items-center justify-between p-4 bg-primary-50 border-2 border-primary-200 rounded-lg hover:bg-primary-100 transition"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-primary-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      Landscape Plans
                    </p>
                    <p className="text-sm text-gray-600">
                      A3 Landscape (2 pages)
                    </p>
                  </div>
                </div>
                <Download className="w-5 h-5 text-primary-600" />
              </a>

              {project.invoicePdfUrl && (
                <a
                  href={`/api/projects/${project.id}/download/invoice`}
                  className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:bg-green-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Invoice</p>
                      <p className="text-sm text-gray-600">A4 Portrait</p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-green-600" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Project Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Project Details
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Project Number</p>
              <p className="font-medium text-gray-900">
                {project.projectNumber}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Project Name</p>
              <p className="font-medium text-gray-900">{project.projectName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Local Council</p>
              <p className="font-medium text-gray-900">{project.localCouncil}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Planning Zone</p>
              <p className="font-medium text-gray-900">{project.planningZone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">North Orientation</p>
              <p className="font-medium text-gray-900">
                {project.northOrientation}°
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Original File</p>
              <p className="font-medium text-gray-900">
                {project.originalFileName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Created</p>
              <p className="font-medium text-gray-900">
                {new Date(project.createdAt).toLocaleString()}
              </p>
            </div>
            {project.payment && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment</p>
                <p className="font-medium text-gray-900">
                  ${(project.payment.amount / 100).toFixed(2)}{' '}
                  <span className="text-sm text-gray-600">
                    ({project.payment.status})
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
