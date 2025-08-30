import React from "react";

export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 flex items-center">
      <div className="mr-4 text-indigo-500">{icon}</div>
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );
}
