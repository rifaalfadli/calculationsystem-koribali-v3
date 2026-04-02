import React, {
  useRef,
  useMemo,
  useState,
  useLayoutEffect,
  lazy,
  Suspense,
} from "react";
import { createBlocks } from "./MultipleBlock";
import { paginateA4LightingPole } from "../hooks/useReportPagination";
import "../../../styles/page.css";
const MultiplePages = lazy(() => import("./MultiplePages"));

export default function MultipleReport({
  cover,
  condition,
  structuralDesign,
  results,
  resultsDo,
  resultsOhw,
}) {
  // 1. blocks memo
  const blocks = useMemo(
    () => createBlocks(results, resultsDo, structuralDesign),
    [results, resultsDo, structuralDesign],
  );

  // 2. ref untuk measurement
  const measureRef = useRef(null);

  // 3. pages = null dulu (belum render final)
  const [pages, setPages] = useState(null);

  // 4. HITUNG PAGINATION SEKALI, SEBELUM PAINT
  useLayoutEffect(() => {
    if (!measureRef.current) return;

    // Tunggu font siap agar pengukuran offsetHeight akurat
    document.fonts.ready.then(() => {
      const paginatedPages = paginateA4LightingPole({
        blocks,
        measureRef,
      });
      setPages(paginatedPages);
    });
  }, [blocks]);

  // 5. FASE 1 — measurement ONLY (user TIDAK LIHAT)
  if (!pages) {
    return (
      <div ref={measureRef} className="measure-container">
        {blocks.map((b) => (
          <div key={b.id} data-id={b.id} className="measure-block">
            {b.node}
          </div>
        ))}
      </div>
    );
  }

  // 6. FASE 2 — FINAL RENDER (HANYA SEKALI)
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[60vh] text-sm text-gray-500">
          Loading report pages...
        </div>
      }
    >
      <MultiplePages
        cover={cover}
        condition={condition}
        results={results}
        pages={pages}
      />
    </Suspense>
  );
}
