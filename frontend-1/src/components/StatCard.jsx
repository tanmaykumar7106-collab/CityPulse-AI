import { AlertTriangle, CheckCircle2, FileText } from "lucide-react";

const icons = {
  complaints: FileText,
  resolved: CheckCircle2,
  critical: AlertTriangle,
};

function StatCard({ type, value, title, description }) {
  const Icon = icons[type];

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
        <Icon size={23} className="text-white" />
      </div>

      <div>
        <p className="text-2xl font-bold text-white">
          {value}
        </p>

        <p className="text-sm font-medium text-blue-100">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-blue-200/70">
          {description}
        </p>
      </div>
    </div>
  );
}

export default StatCard;