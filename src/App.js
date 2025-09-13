import React, { useState } from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface';
import FileUpload from './components/FileUpload';
import PricingPlans from './components/PricingPlans';
import PaymentInterface from './components/PaymentInterface';
import LoginInterface from './components/LoginInterface';
import SignupInterface from './components/SignupInterface';
import ForgotPasswordInterface from './components/ForgotPasswordInterface';
import PlanSwitcher from './components/PlanSwitcher';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';


const stripePromise = loadStripe("pk_test_51RwMz05JNHcvuz94sjCN54asKUd4bCLag0loJmElJLyWJwwmgUFlr9J3llxb5GtXV97C3O7sCXty8Tc4M0s3iVi400KRiZl9GM");

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [userPlan, setUserPlan] = useState('free');
  const [query, setQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setCurrentPage('chat');
    }
  };

  const handlePlanSelect = (plan) => {
    if (plan.name === 'Free') {
      setUserPlan('free');
      setCurrentPage('chat');
    } else {
      setSelectedPlan(plan);
      setCurrentPage('payment');
    }
  };

  const handlePaymentSuccess = (plan) => {
    setUserPlan(plan.name.toLowerCase());
    setCurrentPage('chat');
  };

  const handleLogin = (loginData) => {
    setIsLoggedIn(true);
    setCurrentPage('home');
    console.log('Login successful:', loginData);
  };

  const handleSignup = (signupData) => {
    setIsLoggedIn(true);
    setCurrentPage('home');
    console.log('Signup successful:', signupData);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return (
          <LoginInterface
            onLogin={handleLogin}
            onSwitchToSignup={() => setCurrentPage('signup')}
            onSwitchToForgotPassword={() => setCurrentPage('forgot-password')}
          />
        );
      case 'signup':
        return (
          <SignupInterface
            onSignup={handleSignup}
            onSwitchToLogin={() => setCurrentPage('login')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordInterface
            onResetPassword={() => console.log('Password reset requested')}
            onSwitchToLogin={() => setCurrentPage('login')}
          />
        );
      case 'chat':
        return <ChatInterface userPlan={userPlan} onUpgradeClick={() => setCurrentPage('pricing')} />;
      case 'upload':
        return <FileUpload userPlan={userPlan} onUpgradeClick={() => setCurrentPage('pricing')} />;
      case 'pricing':
        return <PricingPlans onPlanSelect={handlePlanSelect} />;
      case 'payment':
        return (
          <Elements stripe={stripePromise}>
            <PaymentInterface
              selectedPlan={selectedPlan}
              onPaymentSuccess={handlePaymentSuccess}
              onBackToPricing={() => setCurrentPage('pricing')}
            />
          </Elements>
        );
      default:
        return (
          <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Moe – Your Mozaik Expert
              </h1>
              <p className="text-xl text-gray-600 mb-12">
                Expert answers for Mozaik, VCarve, Fusion 360, and more.
              </p>
              <form onSubmit={handleSubmit} className="mb-8">
                <div className="relative max-w-xl mx-auto">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask Moe anything about your millwork project..."
                    className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bg-primary-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    Ask Moe
                  </button>
                </div>
              </form>
              <div className="mb-12">
                <p className="text-sm text-gray-500 mb-4">Supported Systems</p>
                <div className="flex justify-center items-center space-x-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-gray-600 font-semibold text-sm">M</span>
                    </div>
                    <span className="text-xs text-gray-500">Mozaik</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-gray-600 font-semibold text-sm">V</span>
                    </div>
                    <span className="text-xs text-gray-500">VCarve</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                      <span className="text-gray-600 font-semibold text-sm">F</span>
                    </div>
                    <span className="text-xs text-gray-500">Fusion 360</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Get Started with Moe
                </h3>
                <p className="text-gray-600 mb-4">
                  Free tier includes 5 queries per day. Upgrade to Pro for unlimited access and advanced features.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setCurrentPage('chat')}
                    className="bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors"
                  >
                    Start Free Trial
                  </button>
                  <button
                    onClick={() => setCurrentPage('pricing')}
                    className="bg-gray-600 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-700 transition-colors"
                  >
                    View Plans
                  </button>
                </div>
              </div>
            </div>
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <PlanSwitcher currentPlan={userPlan} onPlanChange={setUserPlan} />
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setCurrentPage('home')}
                className="text-xl font-semibold text-gray-900 hover:text-primary-600 cursor-pointer"
              >
                MOE
              </button>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button
                  onClick={() => setCurrentPage('pricing')}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                >
                  Plans & Pricing
                </button>
                <button
                  onClick={() => setCurrentPage('chat')}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                >
                  Chat
                </button>
                <button
                  onClick={() => setCurrentPage('upload')}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                >
                  File Upload
                </button>
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700"
                  >
                    Logout
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentPage('login')}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      {renderPage()}
    </div>
  );
}

export default App;
