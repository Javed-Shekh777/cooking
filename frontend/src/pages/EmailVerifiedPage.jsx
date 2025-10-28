import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Verified page component
// Tailwind CSS assumed. Default export a React component so you can drop this in your routes (e.g. /verify-success)

export default function EmailVerifiedPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(8); // seconds before auto-redirect
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    if (countdown === 0) {
      // auto-redirect to login after countdown
      navigate("/sign-in", { replace: true });
    }
  }, [countdown, navigate]);

  const handleGoLogin = () => {
    navigate("/sign-in");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      setResendMsg("");
      // TODO: call your resend verification API here
      // example:
      // await fetch('/api/auth/resend-verify', { method: 'POST', body: JSON.stringify({ email }) })
      await new Promise((r) => setTimeout(r, 900)); // fake network
      setResendMsg("Verification email resent. Check your inbox (or spam).");
    } catch (err) {
      setResendMsg("Could not resend. Try again later.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-amber-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        className="max-w-xl w-full bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-8"
      >
        <div className="flex items-center gap-4">
          <div className="flex-none">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center ring-2 ring-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-800">Email Verified</h1>
            <p className="mt-1 text-gray-500">Your email has been successfully verified. You can now securely login to your account.</p>

            <div className="mt-3 text-sm text-gray-500">
              <span>Automatic redirect to login in </span>
              <span className="font-medium text-gray-700">{countdown}s</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleGoLogin}
            className="w-full inline-flex items-center cursor-pointer justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
            aria-label="Go to login"
          >
            Go to Login
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 opacity-90" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h8V7l5 3-5 3v-2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            onClick={handleGoHome}
            className="w-full inline-flex items-center cursor-pointer justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition"
            aria-label="Back to home"
          >
            Back to Home
          </button>
        </div>

        <div className="mt-5 border-t pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-gray-600">Didn't get the email?</div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="inline-flex items-center gap-2 text-sm text-amber-700 hover:underline"
            >
              {resendLoading ? 'Resending...' : 'Resend verification email'}
            </button>

            {resendMsg && (
              <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded">{resendMsg}</div>
            )}
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-400">
          By continuing you agree to our terms and privacy policy.
        </div>
      </motion.div>
    </div>
  );
}
