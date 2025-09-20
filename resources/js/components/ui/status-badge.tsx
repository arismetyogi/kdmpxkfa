import React from "react";

const statusColor: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  Accepted: "bg-green-100 text-green-700 border border-green-300",
  Rejected: "bg-red-100 text-red-700 border border-red-300",
  Arrived: "bg-green-100 text-green-700 border border-green-300",
  "On Delivery": "bg-purple-100 text-purple-700 border border-purple-300",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        statusColor[status] || "bg-gray-100 text-gray-600 border border-gray-300"
      }`}
    >
      {status}
    </span>
  );
}
