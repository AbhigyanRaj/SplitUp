import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { auth, db, googleProvider } from '../../services/firebase/firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

function LoginPage({ user, setUser }) {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setIsSignup(true);
    }
  }, [searchParams]);

  // Google sign-in handler (popup)
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        const userData = {
          uid: user.uid,
          name: user.displayName || '',
          email: user.email || '',
          phone: user.phoneNumber || '',
          photoURL: user.photoURL || '',
          provider: user.providerData && user.providerData[0] ? user.providerData[0].providerId : 'google',
          createdAt: serverTimestamp(),
        };
        console.log('Writing user to Firestore:', userData);
        await setDoc(userRef, userData);
        console.log('User written to Firestore');
      }
      if (setUser) setUser(user);
      navigate('/');
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, redirect to home
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  if (user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-slate-900">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h2>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            className="w-full flex justify-center items-center py-3 px-4 border border-slate-300 rounded-lg shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <img className="h-5 w-5 mr-3" src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google logo" />
            {isSignup ? 'Sign up with Google' : 'Continue with Google'}
          </button>
          {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
        </div>

        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-slate-200" />
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-slate-50 text-slate-500">
              or
            </span>
          </div>
        </div>

        <form className="space-y-4" action="#" method="POST">
          <div className="space-y-4 rounded-md">
            <div>
              <label htmlFor="phone" className="sr-only">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Phone Number"
                disabled
              />
            </div>
            <div>
              <label htmlFor="otp" className="sr-only">OTP</label>
              <input
                id="otp"
                name="otp"
                type="text"
                autoComplete="one-time-code"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="OTP"
                disabled
              />
            </div>
          </div>

          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg px-4 py-3 text-sm text-center">
            Phone number and OTP {isSignup ? 'sign up' : 'login'} is <span className="font-semibold">under development</span>.<br />
            Please use Google {isSignup ? 'sign up' : 'login'} for now.
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-300 cursor-not-allowed"
              disabled
            >
              {isSignup ? 'Sign up with OTP (Coming Soon)' : 'Log in with OTP (Coming Soon)'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-slate-600">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <button type="button" className="font-medium text-blue-600 hover:text-blue-500 underline" onClick={() => setIsSignup(false)}>
                Log in
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button type="button" className="font-medium text-blue-600 hover:text-blue-500 underline" onClick={() => setIsSignup(true)}>
                Sign up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default LoginPage; 