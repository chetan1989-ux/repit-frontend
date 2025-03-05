
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(30);
  const [otpSent, setOtpSent] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Retrieve email from signup data
    const signupData = localStorage.getItem('signupData');
    if (signupData) {
      try {
        const { email: userEmail } = JSON.parse(signupData);
        setEmail(userEmail);
      } catch (error) {
        console.error('Error parsing signup data:', error);
        navigate('/signup');
      }
    } else {
      // If no signup data, redirect to signup
      navigate('/signup');
    }

    // Set up countdown timer
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown, navigate]);

  const handleResendOtp = () => {
    // In a real app, this would call an API to resend the OTP
    console.log('Resending OTP to', email);
    setCountdown(30);
    setOtpSent(true);
    setError('');
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError('');

    // Simulate OTP verification with a mock
    // In a real app, replace this with an actual API call
    setTimeout(() => {
      // For demo purposes, any 6-digit OTP is accepted
      if (otp.length === 6) {
        // Mark email as verified
        localStorage.setItem('emailVerified', 'true');
        // Navigate to onboarding
        navigate('/onboarding');
      } else {
        setError('Invalid OTP. Please try again.');
      }
      setIsVerifying(false);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="bg-indigo-600 px-6 py-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
            <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="mt-4 text-3xl font-bold text-white">Verify your email</h2>
          <p className="mt-2 text-indigo-200">We've sent a verification code to:</p>
          <p className="mt-1 text-white font-medium">{email}</p>
        </div>
        
        <div className="px-6 py-8">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <div className="mt-1">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  className="block w-full rounded-md border-gray-300 py-3 px-4 text-center text-lg tracking-widest shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isVerifying || otp.length !== 6}
                className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isVerifying ? 'Verifying...' : 'Verify Email'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive a code?{' '}
              {countdown > 0 ? (
                <span className="font-medium text-gray-500">
                  Resend in {countdown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Resend code
                </button>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
