import Link from 'next/link';
import { CheckCircle, Clock, DollarSign, FileCheck, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">Planometric</h1>
          </div>
          <div className="flex gap-4">
            <Link
              href="/auth/signin"
              className="text-gray-700 hover:text-primary-600 font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Generate Compliant Landscape Plans
          <br />
          <span className="text-primary-600">In Minutes, Not Days</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Upload your DWG or RVT file and instantly receive council-compliant
          landscape plans tailored to Metropolitan Melbourne requirements.
        </p>
        <Link
          href="/auth/signup"
          className="inline-block bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition"
        >
          Start Generating Plans Now
        </Link>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Planometric?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Time Savings */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Save Time
              </h4>
              <p className="text-gray-600">
                Generate plans in minutes instead of spending hours or days on
                manual drafting. Get instant results as soon as you upload.
              </p>
            </div>

            {/* Cost Savings */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <DollarSign className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Save Money
              </h4>
              <p className="text-gray-600">
                Reduce drafting costs dramatically. Pay only when you generate
                plans - no subscriptions or hidden fees.
              </p>
            </div>

            {/* Instant Results */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Zap className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Instant Generation
              </h4>
              <p className="text-gray-600">
                Upload your CAD file and receive completed landscape plans
                immediately. No waiting, no delays.
              </p>
            </div>

            {/* Compliance */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Fully Compliant
              </h4>
              <p className="text-gray-600">
                Plans generated according to the new Res Code and planning
                scheme requirements for Metropolitan Melbourne.
              </p>
            </div>

            {/* Council Specific */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <FileCheck className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Council-Tailored
              </h4>
              <p className="text-gray-600">
                Plans customized for each local council area to ensure full
                compliance with specific requirements.
              </p>
            </div>

            {/* Professional Output */}
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-primary-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Professional Quality
              </h4>
              <p className="text-gray-600">
                Receive A3 landscape plans and A4 portrait invoice documents,
                all professionally formatted and ready to submit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h3>
        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-full font-bold text-xl mb-4">
              1
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Create Account</h4>
            <p className="text-gray-600">Sign up and link your payment details</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-full font-bold text-xl mb-4">
              2
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Upload File</h4>
            <p className="text-gray-600">Upload your DWG or RVT CAD file</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-full font-bold text-xl mb-4">
              3
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Enter Details</h4>
            <p className="text-gray-600">
              Provide project info and council details
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 text-white rounded-full font-bold text-xl mb-4">
              4
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Get Plans</h4>
            <p className="text-gray-600">
              Download your compliant landscape plans
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Workflow?
          </h3>
          <p className="text-xl text-primary-100 mb-8">
            Join professionals who are saving time and money with Planometric
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            &copy; 2025 Planometric. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
