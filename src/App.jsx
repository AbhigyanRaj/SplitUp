import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import Plans from "./pages/Plans";
import LoginPage from "./pages/auth/LoginPage";
import Orders from "./pages/Orders";
import { auth } from './services/firebase/firebase';

const DummyPage = ({title}) => (
    <div className="bg-white min-h-screen pt-40 pb-16 text-center px-4">
        <h1 className="text-4xl font-bold text-slate-800">{title}</h1>
        <p className="mt-4 text-slate-600">This is a placeholder page. The actual content will be built later.</p>
    </div>
);

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;
  }, []);

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/reviews" element={<DummyPage title="Reviews" />} />
        <Route path="/blog" element={<DummyPage title="Blog" />} />
        <Route path="/login" element={<LoginPage user={user} setUser={setUser} />} />
        <Route path="/signup" element={<DummyPage title="Sign Up" />} />
        <Route path="/orders" element={<Orders user={user} setUser={setUser} />} />
        <Route path="/account" element={<DummyPage title="My Account" />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
