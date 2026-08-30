import { useEffect, useState } from "react";
import StatCard from "./StatCard";
import { getMyComplaints } from "../services/complaintService";
import { isAuthenticated } from "../services/authService";

function Statistics() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) return;

    getMyComplaints()
      .then(setComplaints)
      .catch(() => setComplaints([]));
  }, []);

  const totalComplaints = complaints.length;

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "Resolved"
  ).length;

  const criticalComplaints = complaints.filter(
    (complaint) => complaint.priority === "Critical"
  ).length;

  const statistics = [
    {
      type: "complaints",
      value: totalComplaints || "12K+",
      title: "Total Complaints",
      description: totalComplaints
        ? "Your submitted reports"
        : "Demo city reports",
    },
    {
      type: "resolved",
      value: resolvedComplaints || "9K+",
      title: "Resolved Complaints",
      description: resolvedComplaints
        ? "Successfully resolved"
        : "Demo resolved issues",
    },
    {
      type: "critical",
      value: criticalComplaints || "256",
      title: "Critical Issues",
      description: criticalComplaints
        ? "Require immediate action"
        : "Demo critical alerts",
    },
  ];

  return (
    <section
      style={{
        backgroundColor: "#041C4A",
        color: "white",
      }}
      className="px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
        {statistics.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}

export default Statistics;