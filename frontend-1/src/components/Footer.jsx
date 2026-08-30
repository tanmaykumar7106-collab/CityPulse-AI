import { Link } from "react-router-dom";
import {
  Brain,
  MapPin,
  Mail,
  Phone,
  ArrowUpRight,
} from "lucide-react";

function Footer() {
  return (
    <footer className="bg-navy text-white">

      {/* Main Footer */}

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}

          <div className="lg:col-span-2">

            <Link
              to="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600">
                <Brain size={23} />
              </div>

              <div>
                <h2 className="text-xl font-extrabold">
                  CityPulse AI
                </h2>

                <p className="text-xs text-slate-400">
                  Smarter Cities. Better Civic Services.
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-6 text-slate-300">
              A smart civic platform that connects citizens with
              municipal services through AI-assisted complaint
              management, location-based reporting, and transparent
              tracking.
            </p>

            <p className="mt-5 text-sm font-semibold text-orange">
              One Platform. Better Civic Services.
            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <Link
                to="/"
                className="text-sm text-slate-300 transition hover:text-white"
              >
                Home
              </Link>

              <Link
                to="/report"
                className="text-sm text-slate-300 transition hover:text-white"
              >
                Report Complaint
              </Link>

              <Link
                to="/track"
                className="text-sm text-slate-300 transition hover:text-white"
              >
                Track Complaint
              </Link>

              <Link
                to="/dashboard"
                className="text-sm text-slate-300 transition hover:text-white"
              >
                Dashboard
              </Link>

            </div>

          </div>

          {/* Information */}

          <div>

            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Information
            </h3>

            <div className="mt-5 flex flex-col gap-3">

              <Link
                to="/about"
                className="flex items-center gap-1 text-sm text-slate-300 transition hover:text-white"
              >
                About Us
                <ArrowUpRight size={14} />
              </Link>

              <Link
                to="/contact"
                className="flex items-center gap-1 text-sm text-slate-300 transition hover:text-white"
              >
                Contact Us
                <ArrowUpRight size={14} />
              </Link>

              <Link
                to="/login"
                className="flex items-center gap-1 text-sm text-slate-300 transition hover:text-white"
              >
                Login
                <ArrowUpRight size={14} />
              </Link>

            </div>

          </div>

        </div>

        {/* Contact Strip */}

        <div className="mt-10 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <MapPin size={17} className="text-blue-400" />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Location
              </p>

              <p className="text-sm font-medium text-slate-200">
                Prayagraj, India
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <Mail size={17} className="text-blue-400" />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Email
              </p>

              <p className="text-sm font-medium text-slate-200">
                support@citypulse.ai
              </p>
            </div>

          </div>

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <Phone size={17} className="text-blue-400" />
            </div>

            <div>
              <p className="text-xs text-slate-400">
                Support
              </p>

              <p className="text-sm font-medium text-slate-200">
                Citizen Support
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Copyright */}

      <div className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-center sm:flex-row sm:px-6 lg:px-8 sm:text-left">

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} CityPulse AI. All rights reserved.
          </p>

          <p className="text-xs text-slate-500">
            Empowering citizens. Improving communities.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;