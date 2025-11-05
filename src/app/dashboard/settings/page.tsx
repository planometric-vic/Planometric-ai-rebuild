'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [hasPayment, setHasPayment] = useState(false);

  useEffect(() => {
    // Check payment status
    fetchPaymentStatus();
  }, []);

  const fetchPaymentStatus = async () => {
    try {
      const response = await fetch('/api/payment/status');
      if (response.ok) {
        const data = await response.json();
        setHasPayment(data.hasValidPayment);
      }
    } catch (error) {
      console.error('Failed to fetch payment status:', error);
    }
  };

  const handleAddPaymentMethod = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Create Stripe Checkout session
      const response = await fetch('/api/payment/setup', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create payment setup session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to setup payment method. Please try again.',
      });
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account and payment details</p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg border flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </div>
        )}

        {/* Account Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Account Information
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="font-medium text-gray-900">
                {session?.user?.name || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="font-medium text-gray-900">{session?.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Payment Method
            </h2>
            {hasPayment && (
              <span className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" />
                Active
              </span>
            )}
          </div>

          {hasPayment ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <CreditCard className="w-6 h-6 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    Payment method on file
                  </p>
                  <p className="text-sm text-gray-600">
                    You can generate plans with your current payment method
                  </p>
                </div>
              </div>
              <button
                onClick={handleAddPaymentMethod}
                disabled={loading}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Update payment method
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  You need to add a payment method before you can generate landscape
                  plans. Plans cost ${(parseInt(process.env.NEXT_PUBLIC_PLAN_GENERATION_PRICE || '2900') / 100).toFixed(2)} per generation.
                </p>
              </div>
              <button
                onClick={handleAddPaymentMethod}
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Add Payment Method
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Pricing Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Plan Generation</span>
              <span className="font-semibold text-gray-900">
                ${(parseInt(process.env.NEXT_PUBLIC_PLAN_GENERATION_PRICE || '2900') / 100).toFixed(2)} AUD
              </span>
            </div>
            <p className="text-sm text-gray-600">
              You are only charged when you generate a new set of landscape plans.
              No subscriptions, no hidden fees.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
