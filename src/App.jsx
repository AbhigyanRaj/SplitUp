import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import Plans from "./pages/Plans";
import LoginPage from "./pages/auth/LoginPage";
import Orders from "./pages/Orders";
import PageTracker from "./components/analytics/PageTracker";
import { auth } from './services/firebase/firebase';
import AdminPortal from './pages/AdminPortal';

const DummyPage = ({title}) => (
    <div className="bg-white min-h-screen pt-40 pb-16 text-center px-4">
        <h1 className="text-4xl font-bold text-slate-800">{title}</h1>
        <p className="mt-4 text-slate-600">This is a placeholder page. The actual content will be built later.</p>
    </div>
);

// Admin portal protection
function AdminRoute({ user, children }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    }
  }, [user, navigate]);
  if (!user || !user.isAdmin) return null;
  return children;
}

function AdminRedirector({ user }) {
  const location = useLocation();
  useEffect(() => {
    if (!user) return; // Wait for user state
    if (user.isAdmin && location.pathname !== '/admin' && location.pathname !== '/login') {
      window.location.replace('/admin');
    }
  }, [user, location]);
  return null;
}

function App() {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Check for admin session first
    const adminSession = localStorage.getItem('splitup_admin');
    if (adminSession) {
      setUser(JSON.parse(adminSession));
      setChecked(true);
      return; // Do NOT subscribe to Firebase auth if admin session exists
    }
    // Otherwise, use Firebase auth
    const unsubscribe = auth.onAuthStateChanged(u => {
      setUser(u);
      setChecked(true);
    });
    return unsubscribe;
  }, []);

  // Top-level admin redirect (no flicker)
  if (user && user.isAdmin && window.location.pathname !== '/admin') {
    window.location.replace('/admin');
    return null;
  }
  if (!checked) return null; // Wait for user state

  return (
    <BrowserRouter>
      <PageTracker />
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/plans" element={<Plans user={user} setUser={setUser} />} />
        <Route path="/reviews" element={<DummyPage title="Reviews" />} />
        <Route path="/blog" element={<DummyPage title="Blog" />} />
        <Route path="/login" element={<LoginPage user={user} setUser={setUser} />} />
        <Route path="/signup" element={<DummyPage title="Sign Up" />} />
        <Route path="/orders" element={<Orders user={user} setUser={setUser} />} />
        <Route path="/account" element={<DummyPage title="My Account" />} />
        <Route path="/admin" element={
          <AdminRoute user={user}>
            <AdminPortal user={user} setUser={setUser} />
          </AdminRoute>
        } />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
