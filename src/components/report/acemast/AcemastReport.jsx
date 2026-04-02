import React, { lazy, Suspense } from "react";
import "../../../styles/page.css";

const AcemastPages = lazy(() => import("./AcemastPages"));

export default function AcemastReport({
  cover,
  condition,
  structuralDesign,
  results,
  resultsDo,
  resultsOhw,
}) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[60vh] text-sm text-gray-500">
          Loading report pages...
        </div>
      }
    >
      <AcemastPages
        cover={cover}
        condition={condition}
        results={results}
        resultsOhw={resultsOhw}
        resultsDo={resultsDo}
        structuralDesign={structuralDesign}
      />
    </Suspense>
  );
}
