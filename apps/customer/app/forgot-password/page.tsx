'use client';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitted(true);
      setMessage('Check your email for the password reset link.');
    } catch (error) {
      setSubmitted(false);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm border rounded-lg shadow-sm px-6 py-8">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <h1 className="text-xl font-semibold text-orange-500">ReTrade</h1>
        </div>

        <h2 className="text-gray-800 font-semibold mb-1">Reset your password</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter your email and we'll send you a link to reset your password.
        </p>
        {message && (
          <div
            className={`p-3 mb-4 text-sm rounded flex items-start gap-2 ${
              submitted ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}
          >
            {submitted && <CheckCircle className="w-5 h-5 mt-0.5 text-green-600" />}
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              required
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-900 transition"
          >
            Reset your password
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <a
            href="#"
            className="font-semibold text-orange-500 inline-flex items-center hover:underline"
          >
            Get access <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
