import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaShieldAlt, FaEnvelope, FaKey, FaArrowLeft } from 'react-icons/fa';

const AdminLogin = () => {
  const [step, setStep] = useState(1); // 1: Login, 2: OTP Verification
  const [form, setForm] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [tempToken, setTempToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/executive-assistant');
    }
  }, [navigate]);

  // Resend timer effect
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/login`, form);

      if (res.data.tempToken) {
        setTempToken(res.data.tempToken);
        setStep(2);
        setResendTimer(30); // 30 seconds cooldown
        toast.success('OTP sent to your email!');
      } else {
        toast.error('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setOtpLoading(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/verify-otp`, {
        tempToken,
        otp
      });

      if (res.data.token) {
        localStorage.setItem('adminToken', res.data.token);
        toast.success('Two-factor authentication successful!');
        navigate('/executive-assistant');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (err) {
      const message = err?.response?.data?.message || 'OTP verification failed.';
      toast.error(message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    
    setOtpLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/resend-otp`, {
        tempToken
      });
      setResendTimer(30);
      toast.success('OTP resent to your email!');
    } catch (err) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const goBackToLogin = () => {
    setStep(1);
    setOtp('');
    setTempToken('');
    setResendTimer(0);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 animate-fadeIn">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <FaShieldAlt className="text-3xl text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">
              Executive Assistant Login
            </h2>
          </div>
          <p className="text-gray-600 text-sm">
            {step === 1 ? 'Enter your credentials to continue' : 'Enter the OTP sent to your email'}
          </p>
        </div>

        {/* Step 1: Login Form */}
        {step === 1 && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <FaKey className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending OTP...
                </div>
              ) : (
                'Continue to 2FA'
              )}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleOtpVerification} className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <FaEnvelope className="text-blue-600 mr-2" />
                <span className="text-sm text-blue-800">
                  OTP sent to <strong>{form.email}</strong>
                </span>
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-center text-lg font-mono tracking-widest"
              />
            </div>

            <button
              type="submit"
              disabled={otpLoading || otp.length !== 6}
              className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
                otpLoading || otp.length !== 6
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 transform hover:scale-105'
              }`}
            >
              {otpLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify OTP'
              )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendTimer > 0 || otpLoading}
                className={`text-sm ${
                  resendTimer > 0 || otpLoading
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:text-blue-700'
                }`}
              >
                {resendTimer > 0 
                  ? `Resend OTP in ${resendTimer}s` 
                  : 'Resend OTP'
                }
              </button>
            </div>

            {/* Back to Login */}
            <button
              type="button"
              onClick={goBackToLogin}
              className="w-full flex items-center justify-center py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Login
            </button>
          </form>
        )}

        {/* Security Notice */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start">
            <FaShieldAlt className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-600">
              <strong>Security Notice:</strong> This login is protected with two-factor authentication. 
              A one-time code has been sent to your registered email address.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
