import { Brain, Building2, Users, ShieldCheck, Target, MapPinned } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description:
      "CityPulse AI uses intelligent classification to understand citizen complaints and route them to the correct municipal department.",
  },
  {
    icon: MapPinned,
    title: "Location-Based Reporting",
    description:
      "Citizens can provide issue locations manually or use current coordinates to make infrastructure problems easier to identify.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Tracking",
    description:
      "Every complaint receives a complaint ID so citizens can follow its progress from submission to resolution.",
  },
  {
    icon: Users,
    title: "Citizen Participation",
    description:
      "The platform gives citizens a direct way to participate in improving infrastructure and public services around them.",
  },
];

function About() {
  return (
    <section className="min-h-[calc(100vh-80px)] bg-slate-50">
      <div className="bg-navy px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange">About CityPulse AI</p>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Building Smarter Cities
            <span className="block text-blue-400">Together</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            CityPulse AI connects citizens with municipal services through intelligent complaint management, location awareness, and transparent tracking.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
              <Target size={27} className="text-blue-600" />
            </div>
            <h2 className="mt-6 text-2xl font-extrabold text-navy">Our Mission</h2>
            <p className="mt-4 leading-7 text-slate-500">
              Our mission is to make civic issue reporting simpler, faster, and more transparent. Instead of citizens struggling to determine where or how to report an issue, CityPulse AI provides one centralized platform.
            </p>
            <p className="mt-4 leading-7 text-slate-500">
              By combining citizen participation, location data, visualization, and AI-assisted complaint classification, the platform supports responsive and data-driven municipal services.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm sm:p-10">
            <Building2 size={34} className="text-blue-600" />
            <h2 className="mt-6 text-3xl font-extrabold leading-tight text-navy">
              One Platform.
              <br />
              Better Civic Services.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-500">
              From identifying an infrastructure problem to tracking its resolution, CityPulse AI brings the complete complaint journey into one digital platform.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-extrabold text-navy">AI</p>
                <p className="mt-1 text-sm text-slate-500">Assisted Classification</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-navy">24/7</p>
                <p className="mt-1 text-sm text-slate-500">Digital Reporting</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange">What We Offer</p>
            <h2 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">Designed Around Citizens</h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-500">
              Technology should make civic services easier to access, not more complicated.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                    <Icon size={23} className="text-blue-600" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold leading-7 text-navy">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
