import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { auth, db, googleProvider } from '../../services/firebase/firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

function LoginPage({ user, setUser }) {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
      // Redirect to /plans if booking flow is in progress
      if (sessionStorage.getItem('splitup_redirect_plan') !== null) {
        navigate('/plans');
      } else {
      navigate('/');
      }
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Email/password sign up or login handler
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let userCredential;
      if (isSignup) {
        if (!name) throw new Error('Name is required');
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          name: name,
          email: user.email,
          phone: user.phoneNumber || '',
          photoURL: user.photoURL || '',
          provider: 'password',
          createdAt: serverTimestamp(),
        });
        if (setUser) setUser(user);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (setUser) setUser(userCredential.user);
      }
      // Redirect to /plans if booking flow is in progress
      if (sessionStorage.getItem('splitup_redirect_plan') !== null) {
        navigate('/plans');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
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

        <form className="space-y-4" action="#" method="POST" onSubmit={handleEmailAuth}>
          <div className="space-y-4 rounded-md">
            {isSignup && (
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required={isSignup}
                  className="appearance-none relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Full Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-12"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-700 focus:outline-none"
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m1.664-2.13A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.403 3.22-1.125 4.575m-1.664 2.13A9.956 9.956 0 0112 21c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.642 1.624-1.09 2.354M15.54 15.54A5.978 5.978 0 0112 17c-3.314 0-6-2.686-6-6 0-.828.167-1.617.46-2.354" /></svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (isSignup ? 'Signing up...' : 'Logging in...') : (isSignup ? 'Sign up with Email' : 'Log in with Email')}
          </button>
          {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
        </form>

        <div className="relative flex items-center justify-center mt-6">
          <div className="w-full border-t border-slate-200" />
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-slate-50 text-slate-500">
              or (Phone/OTP Coming Soon)
            </span>
          </div>
        </div>
        <form className="space-y-4" action="#" method="POST" onSubmit={e => e.preventDefault()}>
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
            Please use Google or Email {isSignup ? 'sign up' : 'login'} for now.
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