import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { getCategories, getCategoryById } from "./api/category";
import { getJobs, getPublishedJobs, getJobById, searchJobs, getJobsByCompany, getJobsByCategory, getJobsByLocation } from "./api/job";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import AOSProvider from "./components/AOSProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Banner from "./components/Banner";
import PopularJobCategories from "./components/PopularJobCategories";
import TopHiringCompanies from "./components/TopHiringCompanies";
import JobListing from "./components/JobListing";
import JobStats from "./components/StatsCounters";

import JobDetail from "./pages/JobDetail";
import AboutUs from "./pages/AboutUs";
import Jobs from "./pages/Jobs";
import ApplyPage from "./pages/ApplyPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import MyApplications from "./pages/MyApplications";
import MyWishlist from "./pages/MyWishlist";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { AuthModal } from "./components/AuthModal";
import { AuthModalProvider, useAuthModal } from "./contexts/AuthModalContext";

const authRoutes = ["/login", "/signup"];

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const isAuth = authRoutes.includes(pathname);

  return (
    <>
      {!isAuth && <Header />}
      <main>{children}</main>
      {!isAuth && <Footer />}
      {!isAuth && <ScrollToTop />}
    </>
  );
};

function AppContent() {
  const { authModalOpen, setAuthModalOpen } = useAuthModal();

  return (
    <AOSProvider>
      <Layout>
        <AuthModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Banner />
                <TopHiringCompanies />
                <PopularJobCategories />
                <JobListing />
                <JobStats />
              </>
            }
          />

          <Route
            path="/jobs"
            element={
              <Jobs />
            }
          />

          <Route
            path="/jobs/:id"
            element={
              <JobDetail />
            }
          />

          <Route
            path="/about"
            element={
              <AboutUs />
            }
          />

          <Route
            path="/apply/:id"
            element={
              <ProtectedRoute>
                <ApplyPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-applications"
            element={
              <ProtectedRoute>
                <MyApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-wishlist"
            element={
              <ProtectedRoute>
                <MyWishlist />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Catch-all 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        
        {/* 👈 ADD ToastContainer HERE */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="!z-[10000]"
        />
      </Layout>
    </AOSProvider>
  );
}

function App() {
  return (
    <AuthModalProvider>
      <AppContent />
    </AuthModalProvider>
  );
}

export default App;
