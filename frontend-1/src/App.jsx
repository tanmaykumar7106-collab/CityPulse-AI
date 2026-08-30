import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

import HeroSection from "./components/HeroSection";
import Statistics from "./components/Statistics";
import HowItWorks from "./components/HowItWorks";

import ReportComplaint from "./pages/ReportComplaint";
import TrackComplaint from "./pages/TrackComplaint";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Home() {
  return (
    <>
      <HeroSection />
      <Statistics />
      <HowItWorks />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />

          <Route
            path="/report"
            element={<ReportComplaint />}
          />

          <Route
            path="/track"
            element={<TrackComplaint />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/contact"
            element={<Contact />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;