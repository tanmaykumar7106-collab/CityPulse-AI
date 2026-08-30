import {
  FilePenLine,
  BrainCircuit,
  Building2,
  Settings,
  CircleCheck,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Report",
    description: "Citizen submits an infrastructure complaint with location and photo.",
    icon: FilePenLine,
  },
  {
    number: "02",
    title: "AI Analysis",
    description: "AI analyzes the complaint and identifies its category and severity.",
    icon: BrainCircuit,
  },
  {
    number: "03",
    title: "Department",
    description: "The complaint is automatically routed to the responsible department.",
    icon: Building2,
  },
  {
    number: "04",
    title: "Resolution",
    description: "Municipal teams investigate and resolve the reported issue.",
    icon: Settings,
  },
  {
    number: "05",
    title: "Verified",
    description: "Resolution is verified and the citizen receives an update.",
    icon: CircleCheck,
  },
];

function HowItWorks() {
  return (
    <section className="bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange">
            Simple • Smart • Transparent
          </p>

          <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
            How It Works
          </h2>

          <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-orange" />

          <p className="mt-5 text-slate-600">
            From reporting an issue to verified resolution,
            CityPulse AI makes municipal response faster and
            more transparent.
          </p>
        </div>

        {/* Steps */}
        <div className="mt-14 grid gap-8 md:grid-cols-5">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="relative text-center"
              >
                {/* Connector */}
                {index !== steps.length - 1 && (
                  <ArrowRight
                    className="absolute -right-6 top-9 hidden text-slate-300 md:block"
                    size={24}
                  />
                )}

                {/* Icon */}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-8 border-white bg-blue-50 shadow-card">
                  <Icon
                    size={30}
                    className="text-blue-700"
                  />
                </div>

                {/* Number */}
                <p className="mt-5 text-xs font-bold tracking-widest text-orange">
                  STEP {step.number}
                </p>

                {/* Title */}
                <h3 className="mt-2 text-lg font-bold text-navy">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;