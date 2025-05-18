import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCheck, FaTimes, FaUserMd, FaHospital } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Subscriptions = () => {
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly or annually
  const [userType, setUserType] = useState("personal"); // personal or organization
  const navigate = useNavigate();

  const handleSubscribe = (plan) => {
    navigate('/payments/new', {
      state: {
        subscription: {
          planName: plan.name,
          billingCycle,
          userType,
          price: plan.price[billingCycle]
        }
      }
    });
  };

  const personalPlans = [
    {
      name: "Free",
      price: { monthly: 0, annually: 0 },
      features: [
        { name: "Messages", included: true },
        { name: "Normal Posts", included: true },
        { name: "Voice Calls", included: false },
        { name: "Video Calls", included: false },
        { name: "Post Ads", included: false },
      ],
      highlight: false,
    },
    {
      name: "Silver",
      price: { monthly: 1.40, annually: 16.80 },
      features: [
        { name: "Messages", included: true },
        { name: "Normal Posts", included: true },
        { name: "Voice Calls", included: true },
        { name: "Video Calls", included: false },
        { name: "Post Ads (6/month)", included: true },
      ],
      highlight: false,
    },
    {
      name: "Gold",
      price: { monthly: 14.00, annually: 168.00 },
      features: [
        { name: "Messages", included: true },
        { name: "Normal Posts", included: true },
        { name: "Voice Calls", included: true },
        { name: "Video Calls", included: true },
        { name: "Post Ads (20/month)", included: true },
      ],
      highlight: true,
    },
    {
      name: "Premium",
      price: { monthly: 29.99, annually: 359.88 },
      features: [
        { name: "Messages", included: true },
        { name: "Normal Posts", included: true },
        { name: "Voice Calls", included: true },
        { name: "Video Calls", included: true },
        { name: "Unlimited Post Ads", included: true },
      ],
      highlight: false,
    },
  ];

  const organizationPlans = [
    {
      name: "Basic",
      price: { monthly: 49.99, annually: 499.99 },
      features: [
        { name: "Messages", included: true },
        { name: "Normal Posts", included: true },
        { name: "Voice Calls (5 users)", included: true },
        { name: "Video Calls", included: false },
        { name: "Post Ads (20/month)", included: true },
      ],
      highlight: false,
    },
    {
      name: "Standard",
      price: { monthly: 99.99, annually: 999.99 },
      features: [
        { name: "Messages", included: true },
        { name: "Normal Posts", included: true },
        { name: "Voice Calls (15 users)", included: true },
        { name: "Video Calls (10 users)", included: true },
        { name: "Post Ads (50/month)", included: true },
      ],
      highlight: true,
    },
    {
      name: "Enterprise",
      price: { monthly: 199.99, annually: 1999.99 },
      features: [
        { name: "Messages", included: true },
        { name: "Normal Posts", included: true },
        { name: "Voice Calls (Unlimited)", included: true },
        { name: "Video Calls (Unlimited)", included: true },
        { name: "Unlimited Post Ads", included: true },
      ],
      highlight: false,
    },
  ];

  const plans = userType === "personal" ? personalPlans : organizationPlans;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            PulsePal Subscription Plans
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Choose the perfect plan for your healthcare needs
          </p>
        </div>

        <div className="mt-12 flex justify-center">
          <div className="bg-white rounded-lg p-1 flex">
            <button
              onClick={() => setUserType("personal")}
              className={`flex items-center px-4 py-2 rounded-md ${
                userType === "personal"
                  ? "bg-violet-600 text-white"
                  : "text-gray-700"
              }`}
            >
              <FaUserMd className="mr-2" />
              Personal
            </button>
            <button
              onClick={() => setUserType("organization")}
              className={`flex items-center px-4 py-2 rounded-md ${
                userType === "organization"
                  ? "bg-violet-600 text-white"
                  : "text-gray-700"
              }`}
            >
              <FaHospital className="mr-2" />
              Organization
            </button>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="relative bg-white rounded-lg p-1 flex">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                billingCycle === "monthly"
                  ? "bg-violet-600 text-white"
                  : "text-gray-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annually")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                billingCycle === "annually"
                  ? "bg-violet-600 text-white"
                  : "text-gray-700"
              }`}
            >
              Annually <span className="text-xs">(Save 15%)</span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-4 md:grid-cols-2">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className={`bg-white rounded-xl overflow-hidden shadow-lg ${
                plan.highlight ? "ring-2 ring-violet-600" : ""
              }`}
            >
              {plan.highlight && (
                <div className="bg-violet-600 text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {plan.name}
                </h2>
                <div className="mt-4 flex items-baseline text-6xl font-extrabold text-gray-900">
                  ${plan.price[billingCycle]}
                  <span className="ml-1 text-xl font-medium text-gray-500">
                    /{billingCycle === "monthly" ? "mo" : "yr"}
                  </span>
                </div>

                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li
                      key={feature.name}
                      className="flex items-start"
                    >
                      <div className="flex-shrink-0">
                        {feature.included ? (
                          <FaCheck className="h-6 w-6 text-green-500" />
                        ) : (
                          <FaTimes className="h-6 w-6 text-red-500" />
                        )}
                      </div>
                      <p className="ml-3 text-base text-gray-700">
                        {feature.name}
                      </p>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <button 
                    onClick={() => plan.name !== "Free" ? handleSubscribe(plan) : undefined} 
                    className={`w-full py-3 px-6 rounded-lg font-medium ${
                      plan.highlight
                        ? "bg-violet-600 text-white hover:bg-violet-700"
                        : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                    }`}>
                    {plan.name === "Free" ? "Get Started" : "Subscribe Now"}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-700">
          <p>All plans include customer support and regular updates.</p>
          <p className="mt-2">
            Need a custom plan? <a href="#" className="text-violet-600 font-medium">Contact us</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;