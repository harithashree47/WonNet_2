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
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyApplications from "./pages/MyApplications";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

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

function App() {
  return (
    <AOSProvider>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <>
                  <Banner />
                  <TopHiringCompanies />
                  <PopularJobCategories />
                  <JobListing />
                  <JobStats />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute>
                <JobDetail />
              </ProtectedRoute>
            }
          />

          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <AboutUs />
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
        />
      </Layout>
    </AOSProvider>
  );
}

export default App;