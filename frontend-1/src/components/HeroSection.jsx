import {
  FilePenLine,
  Search,
  Phone,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    title: "Report an Issue",
    description: "Submit a new infrastructure complaint",
    icon: FilePenLine,
    path: "/report",
    iconBg: "#2563eb",
  },
  {
    title: "Track Complaint",
    description: "Track the status of your complaint",
    icon: Search,
    path: "/track",
    iconBg: "#10b981",
  },
  {
    title: "Emergency Contact",
    description: "Contact emergency support services",
    icon: Phone,
    path: "/contact",
    iconBg: "#f97316",
  },
  {
    title: "Infrastructure Status",
    description: "View real-time infrastructure health",
    icon: BarChart3,
    path: "/dashboard",
    iconBg: "#8b5cf6",
  },
];

function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src="/cityv1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="absolute inset-0 bg-[rgba(5,23,48,0.58)]" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(3,7,18,0.82), rgba(15,23,42,0.45), rgba(15,23,42,0.18))",
        }}
      />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <div className="mb-7 inline-flex w-fit items-center rounded-full border border-cyan-300/30 bg-slate-950/35 px-5 py-2 text-xs font-semibold tracking-[0.18em] text-white backdrop-blur-md">
            AI POWERED
            <span className="mx-2 text-orange-400">•</span>
            REAL TIME
            <span className="mx-2 text-orange-400">•</span>
            SMART CITY
          </div>

          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
            CITYPULSE <span className="text-orange-400">AI</span>
          </h1>

          <h2 className="mt-5 max-w-3xl text-xl font-semibold leading-tight text-white sm:text-2xl lg:text-[28px]">
            Smart Urban Infrastructure Monitoring
            <span className="block">& Municipal Response Platform</span>
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-slate-100 sm:text-base">
            Report infrastructure issues, track their status, and help us build
            better and smarter cities with the power of AI.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/report"
              className="group inline-flex min-h-[58px] items-center justify-center gap-3 rounded-2xl border border-white/40 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-cyan-300/70 hover:bg-white/15"
            >
              <FilePenLine size={20} />
              <span>Report Complaint</span>
              <ArrowRight
                size={19}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/track"
              className="group inline-flex min-h-[58px] items-center justify-center gap-3 rounded-2xl border border-white/40 bg-white/10 px-6 py-4 text-base font-bold text-white backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-cyan-300/70 hover:bg-white/15"
            >
              <Search size={20} />
              <span>Track Complaint</span>
            </Link>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-1 gap-6 border-t border-white/20 pt-8 sm:grid-cols-3">
            <div>
              <p className="font-semibold text-white">AI Powered</p>
              <p className="mt-1 text-sm text-slate-200">Smart issue analysis</p>
            </div>

            <div>
              <p className="font-semibold text-white">24 × 7</p>
              <p className="mt-1 text-sm text-slate-200">Complaint portal</p>
            </div>

            <div>
              <p className="font-semibold text-white">Smart</p>
              <p className="mt-1 text-sm text-slate-200">
                Infrastructure monitoring
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="hero-services-panel w-full rounded-[28px] border p-5 shadow-2xl backdrop-blur-xl sm:p-7">
            <div className="mb-7">
              <h3 className="hero-services-heading text-2xl font-extrabold lg:text-[28px]">
                Infrastructure Services
              </h3>

              <div className="hero-services-line mt-4 h-1 w-20 rounded-full" />
            </div>

            <div className="space-y-4">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <Link
                    key={service.title}
                    to={service.path}
                    className="hero-service-card group flex items-center gap-4 rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
                      style={{ backgroundColor: service.iconBg }}
                    >
                      <Icon size={24} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="hero-service-title text-base font-extrabold transition">
                        {service.title}
                      </h4>

                      <p className="hero-service-description mt-1 text-sm leading-6">
                        {service.description}
                      </p>
                    </div>

                    <ArrowRight
                      size={19}
                      className="hero-service-arrow shrink-0 transition-all duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;