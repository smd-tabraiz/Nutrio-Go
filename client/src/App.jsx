import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NutriGoProvider } from './context/NutriGoContext';
import DemoBar from './components/DemoBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';

import HomePage from './pages/HomePage';
import PackagesPage from './pages/PackagesPage';
import TrialPage from './pages/TrialPage';
import MyNutriGoPage from './pages/MyNutriGoPage';
import FeedbackPage from './pages/FeedbackPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <NutriGoProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1C241D] antialiased">
          <DemoBar />
          <Navbar />
          <main className="flex-1 pb-16 md:pb-0">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/trial" element={<TrialPage />} />
              <Route path="/my-nutrigo" element={<MyNutriGoPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
          <MobileBottomNav />
        </div>
      </Router>
    </NutriGoProvider>
  );
}
