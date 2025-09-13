import React from 'react';

const PricingPlans = ({ onPlanSelect }) => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      queries: '5/day',
      model: 'gpt-4o-mini',
      features: [
        'Basic answers',
        'Limited queries',
        'No file uploads'
      ],
      popular: false,
      description: 'Perfect for trying out MOE'
    },
    {
      name: 'Hobbyist',
      price: '$9',
      queries: '100/month',
      model: 'gpt-4o',
      features: [
        'Pro answers with Mozaik menu paths',
        'Joinery and CNC checks',
        'Install notes',
        'File parsing (.cab, .cabx, .mzb, .xml)',
        'Enhanced RAG'
      ],
      popular: false,
      description: 'Great for small projects'
    },
    {
      name: 'Occasional',
      price: '$20',
      queries: '300/month',
      model: 'gpt-4o',
      features: [
        'All Hobbyist features',
        'More queries per month',
        'Priority support'
      ],
      popular: true,
      description: 'Most popular choice'
    },
    {
      name: 'Professional',
      price: '$29',
      queries: '600/month',
      model: 'gpt-4o',
      features: [
        'All Occasional features',
        'Advanced diagnostics',
        'Custom workflows'
      ],
      popular: false,
      description: 'For serious professionals'
    },
    {
      name: 'Enterprise',
      price: '$149',
      queries: '5,000/month',
      model: 'gpt-4o',
      features: [
        'All Professional features',
        'Custom integrations',
        'Dedicated support',
        'Custom overage rates'
      ],
      popular: false,
      description: 'For large teams'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Start free and upgrade as you grow. All paid plans include file parsing and enhanced features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular 
                  ? 'border-primary-600 shadow-xl scale-105' 
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Card Content */}
              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {plan.description}
                  </p>
                  
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      {plan.price !== '$0' && (
                        <span className="text-gray-500 ml-2">/month</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {plan.queries} queries • {plan.model}
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div className="mb-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <svg 
                            className="h-5 w-5 text-green-500" 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                        </div>
                        <span className="ml-3 text-sm text-gray-700 leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => onPlanSelect(plan)}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl'
                      : plan.name === 'Free'
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                      : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg'
                  }`}
                >
                  {plan.name === 'Free' ? 'Get Started Free' : 'Start Free Trial'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-100 p-12 max-w-6xl mx-auto">
            <div className="mb-12">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                All Plans Include
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Every plan comes with these essential features to help you succeed
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Secure & Private</h4>
                <p className="text-base text-gray-600 leading-relaxed max-w-xs">
                  Enterprise-grade security with end-to-end encryption and data protection
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">24/7 Support</h4>
                <p className="text-base text-gray-600 leading-relaxed max-w-xs">
                  Round-the-clock expert support when you need it most
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Cancel Anytime</h4>
                <p className="text-base text-gray-600 leading-relaxed max-w-xs">
                  No long-term contracts, cancel whenever you want
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Quality Guarantee</h4>
                <p className="text-base text-gray-600 leading-relaxed max-w-xs">
                  Expert-level accuracy with industry-specific knowledge
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900 mb-1">Overage Charges</p>
                  <p className="text-base text-gray-600">$0.05 per query above plan limit (except Enterprise)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
