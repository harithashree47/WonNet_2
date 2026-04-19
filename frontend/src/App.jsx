import { Routes, Route, useLocation } from "react-router-dom";
import AOSProvider from "./components/AOSProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Banner from "./components/Banner";
import PopularJobCategories from "./components/PopularJobCategories";
import TopHiringCompanies from "./components/TopHiringCompanies";
import JobListing from "./components/JobListing";
import JobDetail from "./pages/JobDetail";
import JobStats from "./components/StatsCounters";
import AboutUs from "./pages/AboutUs";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// pages that should NOT show header/footer
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
          {/* Home */}
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

          {/* Jobs */}
          <Route path="/jobs" element={<Jobs />} />

          {/* Job Detail */}
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* About */}
          <Route path="/about" element={<AboutUs />} />

          {/* Auth – no header/footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Layout>
    </AOSProvider>
  );
}

export default App;