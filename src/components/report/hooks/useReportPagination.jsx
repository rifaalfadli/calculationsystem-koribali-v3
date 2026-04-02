import { mmToPx } from "../../../utils/report-handlers/unitConventer";

// A4 Pagination for lighting pole block
export function paginateA4LightingPole({ blocks, measureRef }) {
  if (!measureRef.current) return [];

  const children = Array.from(measureRef.current.children);
  const blockMap = new Map(blocks.map((b) => [b.id, b]));

  const measureRect = measureRef.current.getBoundingClientRect();
  const pageHeight = measureRect.height;

  const ptValue = 20;
  const paddingBottomPx = mmToPx(15);
  const pageHeader = 22.53;
  const paddingTopMargin = mmToPx(15);

  const pageLimit =
    pageHeight - paddingTopMargin - paddingBottomPx - pageHeader;

  const pages = [];
  let currentPage = [];
  let currentHeight = 0;
  let pageNum = 1;

  console.log(
    `%c START PAGINATION | Limit: ${pageLimit.toFixed(2)}px `,
    "background: #222; color: #bada55; font-weight: bold;",
  );

  const heights = children.map((child) => child.getBoundingClientRect().height);

  children.forEach((child, index) => {
    let h = heights[index];
    const block = blockMap.get(child.dataset.id);
    if (!block) return;

    let effectiveHeight = h;
    const isFirstBlockInPage = currentPage.length === 0;

    // Logika diskon ptValue
    if (isFirstBlockInPage) {
      effectiveHeight = h - ptValue;
    }

    // Cek apakah muat di halaman ini
    if (currentHeight + effectiveHeight > pageLimit + 0.5) {
      console.log(
        `%c ---- PAGE ${pageNum} FULL (Break) ---- `,
        "color: #ff4500; font-weight: bold;",
      );
      pages.push(currentPage);
      currentPage = [];
      currentHeight = 0;
      pageNum++;

      // Hitung ulang diskon karena jadi elemen pertama di hal baru
      effectiveHeight = h - ptValue;
    }

    currentPage.push(block.node);
    currentHeight += effectiveHeight;

    // Log detail per blok
    console.log(
      `[P${pageNum}] ID: %c${child.dataset.id.padEnd(8)}%c | ` +
        `H-Asli: ${h.toFixed(2)}px | ` +
        `H-Efektif: %c${effectiveHeight.toFixed(2)}px%c | ` +
        `Total: %c${currentHeight.toFixed(2)}px%c / ${pageLimit.toFixed(2)}px`,
      "color: #2196F3; font-weight: bold;",
      "color: inherit;",
      "color: #4CAF50; font-weight: bold;",
      "color: inherit;",
      "color: #E91E63; font-weight: bold;",
      "color: inherit;",
    );
  });

  if (currentPage.length) {
    pages.push(currentPage);
    console.log(
      `%c END PAGINATION | Total Pages: ${pageNum} `,
      "background: #222; color: #bada55; font-weight: bold;",
    );
  }

  return pages;
}

// A4 pagination for signboard block
export function paginateA4Signboard({ blocks, measureRef }) {
  if (!measureRef.current) return [];

  const children = Array.from(measureRef.current.children);
  const blockMap = new Map(blocks.map((b) => [b.id, b]));

  const measureRect = measureRef.current.getBoundingClientRect();
  const pageHeight = measureRect.height;

  const ptValue = 15;
  const paddingBottomPx = mmToPx(15);
  const pageHeader = 21.53;
  const paddingTopMargin = mmToPx(15);

  const pageLimit =
    pageHeight - paddingTopMargin - paddingBottomPx - pageHeader;

  const pages = [];
  let currentPage = [];
  let currentHeight = 0;
  let pageNum = 1;

  console.log(
    `%c START PAGINATION | Limit: ${pageLimit.toFixed(2)}px `,
    "background: #222; color: #bada55; font-weight: bold;",
  );

  const heights = children.map((child) => child.getBoundingClientRect().height);

  children.forEach((child, index) => {
    let h = heights[index];
    const block = blockMap.get(child.dataset.id);
    if (!block) return;

    let effectiveHeight = h;
    const isFirstBlockInPage = currentPage.length === 0;

    // Logika diskon ptValue
    if (isFirstBlockInPage) {
      effectiveHeight = h - ptValue;
    }

    // Cek apakah muat di halaman ini
    if (currentHeight + effectiveHeight > pageLimit + 0.5) {
      console.log(
        `%c ---- PAGE ${pageNum} FULL (Break) ---- `,
        "color: #ff4500; font-weight: bold;",
      );
      pages.push(currentPage);
      currentPage = [];
      currentHeight = 0;
      pageNum++;

      // Hitung ulang diskon karena jadi elemen pertama di hal baru
      effectiveHeight = h - ptValue;
    }

    currentPage.push(block.node);
    currentHeight += effectiveHeight;

    // Log detail per blok
    console.log(
      `[P${pageNum}] ID: %c${child.dataset.id.padEnd(8)}%c | ` +
        `H-Asli: ${h.toFixed(2)}px | ` +
        `H-Efektif: %c${effectiveHeight.toFixed(2)}px%c | ` +
        `Total: %c${currentHeight.toFixed(2)}px%c / ${pageLimit.toFixed(2)}px`,
      "color: #2196F3; font-weight: bold;",
      "color: inherit;",
      "color: #4CAF50; font-weight: bold;",
      "color: inherit;",
      "color: #E91E63; font-weight: bold;",
      "color: inherit;",
    );
  });

  if (currentPage.length) {
    pages.push(currentPage);
    console.log(
      `%c END PAGINATION | Total Pages: ${pageNum} `,
      "background: #222; color: #bada55; font-weight: bold;",
    );
  }

  return pages;
}
