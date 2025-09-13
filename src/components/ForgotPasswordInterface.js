import React, { useState } from 'react';
import { authAPI } from '../services/api';

const ForgotPasswordInterface = ({ onResetPassword, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await authAPI.forgotPassword({ email });
      setIsSubmitted(true);
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16">
        <div className="w-4/5 max-w-2xl mx-auto px-8">
          <div className="text-center mb-8">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h1>
            <p className="text-lg text-gray-600">
              We've sent you a password reset link
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Reset Link Sent!
              </h2>
              
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to <span className="font-semibold text-gray-900">{email}</span>. 
                Please check your email and click the link to reset your password.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Didn't receive the email?</strong> Check your spam folder or try again with a different email address.
                </p>
              </div>
              
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className="w-full py-4 px-6 rounded-2xl font-semibold text-lg border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-300 mb-4"
              >
                Try Another Email
              </button>
              
              <button
                onClick={onSwitchToLogin}
                className="w-full py-4 px-6 rounded-2xl font-semibold text-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white py-16">
      <div className="w-4/5 max-w-2xl mx-auto px-8">
        <div className="text-center mb-8">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-lg text-gray-600">
            Enter your email to receive a reset link
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-xl font-semibold text-gray-900 mb-4">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                className={`w-full px-8 py-5 text-xl border rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 ${
                  error ? 'border-red-300' : 'border-gray-300'
                }`}
                required
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-5 px-8 rounded-2xl font-bold text-xl transition-all duration-300 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-xl hover:shadow-2xl transform hover:-translate-y-1'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Reset Link...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <div className="my-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Remember your password?</span>
              </div>
            </div>
          </div>

          <button
            onClick={onSwitchToLogin}
            className="w-full py-4 px-6 rounded-2xl font-semibold text-lg border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-300"
          >
            Back to Sign In
          </button>
        </div>

        <div className="mt-10 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-8">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-orange-900 mb-1">Need Help?</p>
              <p className="text-orange-800 text-sm">If you're still having trouble, contact our support team and we'll help you regain access to your account.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordInterface;