import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { CreditCard, FileText, Upload } from 'lucide-react';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      projects: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  const projectCount = await prisma.project.count({
    where: { userId: session.user.id },
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name || 'User'}
          </p>
        </div>

        {/* Payment Warning */}
        {!user?.hasValidPayment && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CreditCard className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You need to add payment details before generating plans.{' '}
                  <Link
                    href="/dashboard/settings"
                    className="font-medium underline hover:text-yellow-600"
                  >
                    Add payment method
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/dashboard/new-project"
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Upload className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Generate New Plans
                </h3>
                <p className="text-gray-600">Upload a CAD file to get started</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/projects"
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  View All Projects
                </h3>
                <p className="text-gray-600">
                  {projectCount} {projectCount === 1 ? 'project' : 'projects'} total
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Projects
            </h2>
          </div>
          <div className="p-6">
            {user?.projects && user.projects.length > 0 ? (
              <div className="space-y-4">
                {user.projects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects/${project.id}`}
                    className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {project.projectName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {project.projectNumber} • {project.localCouncil}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No projects yet</p>
                <Link
                  href="/dashboard/new-project"
                  className="mt-4 inline-block text-primary-600 font-semibold hover:text-primary-700"
                >
                  Create your first project
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
