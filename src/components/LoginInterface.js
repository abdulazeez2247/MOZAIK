import React, { useState } from 'react';
import { authAPI, setAuthToken } from '../services/api';

const LoginInterface = ({ onLogin, onSwitchToSignup, onSwitchToForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authAPI.login({
        email: formData.email,
        password: formData.password
      });
      
      setAuthToken(response.data.accessToken);
      onLogin(response.data.user);
      
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else {
        setErrors({ submit: 'Login failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            Welcome Back
          </h1>
          <p className="text-lg text-gray-600">
            Sign in to your MOE account
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
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className="w-full px-8 py-5 text-xl border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
                required
              />
            </div>

            <div>
              <label className="block text-xl font-semibold text-gray-900 mb-4">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full px-8 py-5 text-xl border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <p className="text-red-600 text-center">{errors.submit}</p>
              </div>
            )}

            <div className="text-right pt-2">
              <button
                type="button"
                onClick={onSwitchToForgotPassword}
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors text-lg"
              >
                Forgot your password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-6 px-8 rounded-2xl font-bold text-xl transition-all duration-300 ${
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
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="my-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Don't have an account?</span>
              </div>
            </div>
          </div>

          <button
            onClick={onSwitchToSignup}
            className="w-full py-5 px-6 rounded-2xl font-semibold text-xl border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-300"
          >
            Create Account
          </button>
        </div>

        <div className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-blue-900 mb-1">Secure Login</p>
              <p className="text-blue-800 text-sm">Your credentials are encrypted and secure. We use industry-standard SSL encryption to protect your data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginInterface;