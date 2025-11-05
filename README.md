# Planometric - AI-Powered Landscape Plans SaaS

A modern SaaS application that generates compliant landscape plans from CAD files (.dwg/.rvt) using Rhino Compute and Grasshopper. Built specifically for Metropolitan Melbourne planning requirements.

## Features

- **Instant Plan Generation**: Upload CAD files and receive landscape plans in minutes
- **Council-Compliant**: Tailored to each Metropolitan Melbourne council's requirements
- **Secure Authentication**: User accounts with NextAuth.js
- **Payment Integration**: Stripe-powered pay-per-generation model
- **Document Management**: Store and access previously generated plans
- **Professional Output**: A3 landscape plans + A4 portrait invoices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **File Storage**: AWS S3
- **CAD Processing**: Rhino Compute + Grasshopper

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- PostgreSQL database
- AWS account with S3 bucket configured
- Stripe account for payments
- Rhino Compute server running
- Grasshopper definition file

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd Planometric-ai-rebuild
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/planometric?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-with: openssl rand -base64 32>"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# AWS S3
AWS_REGION="ap-southeast-2"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
S3_BUCKET_NAME="planometric-files"

# Rhino Compute
RHINO_COMPUTE_URL="http://localhost:8081"
RHINO_COMPUTE_API_KEY="your-rhino-compute-api-key"
GRASSHOPPER_DEFINITION_PATH="/path/to/your/definition.gh"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
PLAN_GENERATION_PRICE=2900  # Price in cents ($29.00)
```

### 4. Set up the database

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Grasshopper Definition Requirements

Your Grasshopper definition should:

1. **Accept inputs via GET components** with these names:
   - `projectNumber` (Text)
   - `projectName` (Text)
   - `northOrientation` (Number, degrees)
   - `localCouncil` (Text)
   - `planningZone` (Text)

2. **Process CAD file linework** from specific layer names

3. **Output two PDFs**:
   - **Plans PDF**: 2-page A3 landscape format with landscape plans
   - **Invoice PDF**: 1-page A4 portrait format with invoice/receipt

4. **Return results** as base64-encoded PDFs via Rhino Compute API

## Rhino Compute Setup

Ensure your Rhino Compute server is:

1. Running and accessible at the URL specified in `RHINO_COMPUTE_URL`
2. Configured with your Grasshopper definition
3. Has proper API key authentication set up (if required)

For Rhino Compute setup, refer to: https://www.rhino3d.com/compute/

## Stripe Configuration

### Set up Stripe webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/payment/webhook`
3. Select events:
   - `setup_intent.succeeded`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.deleted`
4. Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### Test locally with Stripe CLI

```bash
stripe listen --forward-to localhost:3000/api/payment/webhook
```

## AWS S3 Configuration

1. Create an S3 bucket (e.g., `planometric-files`)
2. Configure CORS for the bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

3. Create IAM user with S3 permissions and generate access keys

## Project Structure

```
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API routes
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # Dashboard pages
│   │   └── page.tsx          # Landing page
│   ├── components/           # React components
│   ├── lib/                  # Utility functions
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── prisma.ts        # Prisma client
│   │   ├── stripe.ts        # Stripe client
│   │   ├── s3.ts            # S3 utilities
│   │   └── rhino-compute.ts # Rhino Compute integration
│   └── types/               # TypeScript types
├── .env.example             # Environment variables template
├── package.json
└── README.md
```

## Key Features Implementation

### Authentication
- Sign up / Sign in with email and password
- Protected routes with NextAuth.js
- Session management

### Payment Processing
- Stripe Checkout for payment method setup
- Pay-per-generation model (no subscriptions)
- Payment validation before plan generation
- Webhook handling for payment events

### File Upload & Processing
1. User uploads .dwg or .rvt file
2. File is validated and uploaded to S3
3. Project is created with status "PROCESSING"
4. File is sent to Rhino Compute with project inputs
5. Grasshopper processes the file
6. Generated PDFs are saved to S3
7. Project status updated to "COMPLETED"
8. User can download plans and invoice

### Dashboard Features
- View all projects
- Project status tracking (Pending, Processing, Completed, Failed)
- Download generated plans and invoices
- Payment method management
- Project history

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Docker

```bash
docker build -t planometric .
docker run -p 3000:3000 planometric
```

### Environment-specific notes

- Set `NODE_ENV=production` in production
- Use production Stripe keys
- Ensure NEXTAUTH_URL matches your domain
- Configure proper CORS for S3 bucket

## Melbourne Councils Supported

The application includes support for all 31 Metropolitan Melbourne councils:

- Banyule, Bayside, Boroondara, Brimbank, Cardinia
- Casey, Darebin, Frankston, Glen Eira, Greater Dandenong
- Hobsons Bay, Hume, Kingston, Knox, Manningham
- Maribyrnong, Maroondah, Melbourne, Melton, Monash
- Moonee Valley, Moreland, Mornington Peninsula, Nillumbik
- Port Phillip, Stonnington, Whitehorse, Whittlesea, Wyndham
- Yarra, Yarra Ranges

## Planning Zones Supported

- Residential Growth Zone (RGZ)
- General Residential Zone (GRZ)
- Neighbourhood Residential Zone (NRZ)
- Mixed Use Zone (MUZ)
- Township Zone (TZ)
- Low Density Residential Zone (LDRZ)

## Troubleshooting

### Database issues
```bash
npx prisma db push --force-reset
```

### Stripe webhook not working
- Check webhook secret is correct
- Verify webhook URL is accessible
- Use Stripe CLI for local testing

### Rhino Compute connection fails
- Verify Rhino Compute server is running
- Check firewall/network settings
- Confirm API key is correct

### File upload errors
- Check S3 credentials and permissions
- Verify bucket CORS configuration
- Ensure file size limits are appropriate

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/[...nextauth]` - NextAuth.js handler

### Projects
- `POST /api/projects/create` - Create new project and generate plans
- `GET /api/projects/[id]/download/plans` - Download plans PDF
- `GET /api/projects/[id]/download/invoice` - Download invoice PDF

### Payments
- `GET /api/payment/status` - Check payment status
- `POST /api/payment/setup` - Setup payment method
- `POST /api/payment/webhook` - Stripe webhook handler

## License

Proprietary - All rights reserved

## Support

For support, email support@planometric.com or create an issue in the repository.
