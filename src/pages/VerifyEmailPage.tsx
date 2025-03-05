
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get email from localStorage
    const signupData = localStorage.getItem('signupData');
    if (!signupData) {
      navigate('/signup');
      return;
    }
    
    const { email } = JSON.parse(signupData);
    setUserEmail(email);
    
    // Start countdown for resend button
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [navigate]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtp(value);
      setError('');
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsVerifying(true);
    
    // Mock verification - in a real app, this would validate with a backend
    setTimeout(() => {
      // For demo, we'll assume the code "123456" is valid
      if (otp === '123456') {
        // Store verification status
        localStorage.setItem('emailVerified', 'true');
        navigate('/onboarding');
      } else {
        setError('Invalid OTP. Please try again.');
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleResendOtp = () => {
    setCountdown(30);
    setIsResendDisabled(true);
    
    // Start countdown again
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Mock sending an OTP
    setTimeout(() => {
      // In a real app, this would trigger an API call to send a new OTP
      console.log('Resending OTP to', userEmail);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a 6-digit code to<br />
            <span className="font-medium text-indigo-600">{userEmail}</span>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleVerify}>
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              Enter Verification Code
            </label>
            <div className="mt-1">
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                value={otp}
                onChange={handleOtpChange}
                maxLength={6}
                className={`appearance-none block w-full px-3 py-2 border ${
                  error ? 'border-red-300' : 'border-gray-300'
                } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-center tracking-widest`}
                placeholder="123456"
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isVerifying || otp.length !== 6}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResendDisabled}
                className={`font-medium ${
                  isResendDisabled 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-indigo-600 hover:text-indigo-500'
                }`}
              >
                {isResendDisabled 
                  ? `Resend in ${countdown}s` 
                  : 'Resend Code'}
              </button>
            </p>
          </div>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-gray-500">
            Note: For this demo, use the code "123456"
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
