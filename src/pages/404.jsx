import React from "react";
import { AlertTriangle, ChevronLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-6">
      <div className="max-w-xl w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 text-blue-600 p-4 rounded-xl shadow-sm">
            <AlertTriangle className="w-10 h-10" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-slate-800 mb-3">404</h1>

        {/* Subtitle */}
        <h2 className="text-lg text-slate-600 mb-2 font-medium">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-700 text-white rounded-lg shadow-sm hover:bg-blue-800 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Footer hint */}
        <p className="text-xs text-slate-400 mt-10">
          Error code: 404 | Resource not found
        </p>
      </div>
    </div>
  );
}
