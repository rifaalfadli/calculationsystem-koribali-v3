import React from "react";
import { getRowsForStepPlusArm } from "../../../utils/report-handlers/textFormatter";

export const createBlocks = (
  results = [],
  resultsDo = [],
  structuralDesign = {},
) => {
  const blocks = [];
  let sectionCounter = 0;

  results?.forEach((r, index) => {
    const rows = getRowsForStepPlusArm(
      index,
      results,
      resultsDo,
      structuralDesign,
    );

    const suffix = index + 1; // biar id unik: c1-1, c1-2, dst

    //  c1 = (Consideration of pillars) and 荷重計算 (Load calculation)
    blocks.push({
      id: `c1-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Main-section: (Consideration of pillars) + material specifications */}
          <h2 className="page1-title">
            <span className="page1-number">{4 + sectionCounter++}.</span>
            <span className="page1-text tracking-[0.05em] jp">
              柱の検討【直風時A】
            </span>
            <span className="page1-text ml-[18px] jp">φ</span>
            <span className="page1-text">{r?.diaLower?.toFixed(1) ?? ""}</span>
            <span className="page1-text px-[2px] text-[10.5pt]">×</span>
            <span className="page1-text">
              t{r?.thickLower?.toFixed(1) ?? ""}
            </span>
            <span className="page1-text ml-1.5">
              <span className="jp">(</span>
              {r?.material ?? ""}
              <span className="jp">)</span>
            </span>
            <span className="page1-text ml-1.5">
              Z = {r?.SecMdl?.toFixed(2) ?? ""} cm<sup>3</sup>
            </span>
          </h2>

          <div className="flex flex-col">
            {/* Sub-section: 1) 荷重計算 (Load calculation) */}
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                1<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">荷重計算</span>
            </div>

            <div className="ml-[25px]">
              {/*
              Load table:
              - Dead load (固定荷重)
              - Wind load (風荷重)
              - Used to find:
              N = vertical force
              Pmax = maximum horizontal force
            */}
              <table className="tables-pages">
                <thead>
                  {/* Header Line 1 */}
                  <tr className="tracking-[0.05em]">
                    <th className="col-num" rowspan={2}></th>
                    <th className="jp" rowspan={2}>
                      名 称
                    </th>
                    <th className="col-left jp" colspan={1}>
                      単位重量
                    </th>
                    <th className="col-left jp" rowspan={2}>
                      個 数
                    </th>
                    <th className="col-left jp" rowspan={1}>
                      重 量
                    </th>
                    <th className="col-gap"></th>
                    <th className="col-right jp" colspan={1}>
                      受風圧面積
                    </th>
                    <th className="col-right jp" colspan={1}>
                      風力係数
                    </th>
                    <th className="col-right jp" colspan={1}>
                      単位風荷重
                    </th>
                    <th className="col-right jp" colspan={1}>
                      個 数
                    </th>
                    <th className="col-right" colspan={1}>
                      <span className="jp">風荷重 (</span>N
                      <span className="jp">)</span>
                    </th>
                  </tr>

                  {/* Header line 2 (unit) */}
                  <tr>
                    <th className="col-left">
                      W<span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                    <th className="col-left">
                      {" "}
                      <span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                    <th className="col-gap"></th>
                    <th className="col-right">
                      <span className="jp">(</span>m<sup>2</sup>
                      <span className="jp">)</span>
                    </th>
                    <th className="col-right">C</th>
                    <th className="col-right">
                      P<span className="jp">(</span>N
                      <span className="jp">)</span>
                    </th>
                    <th className="tracking-[0.05em] jp">(受風物)</th>
                    <th className="col-right">
                      X-
                      <span className="jp">軸</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      <td className="col-num">{String.fromCharCode(65 + i)}</td>

                      {row.type === "do" && (
                        <>
                          <td className="col-1 tracking-[0.05em] jp">
                            {row.data.nameDo ?? ""}
                          </td>
                          <td className="col-left">
                            {row.data.flDo?.toFixed(1) ?? ""}
                          </td>
                          <td className="col-left">{row.data.qtyDo ?? ""}</td>
                          <td className="col-left">
                            {row.data.flDo?.toFixed(1) ?? ""}
                          </td>
                          <td className="col-gap"></td>
                          <td className="col-right">
                            {row.data.frontAreaDo?.toFixed(1) ?? ""}
                          </td>
                          <td className="col-right">
                            {row.data.cfDo?.toFixed(1) ?? ""}
                          </td>
                          <td className="col-right">
                            {row.data.wlafDo?.toFixed(1) ?? ""}
                          </td>
                          <td className="col-right">{row.data.qtyDo ?? ""}</td>
                          <td className="col-right">
                            {row.data.wlafDo?.toFixed(1) ?? ""}
                          </td>
                        </>
                      )}

                      {row.type === "arm" && (
                        <>
                          <td className="col-1 tracking-[0.05em] jp">
                            {row.data.name}
                          </td>
                          <td className="col-left">{row.data.weight}</td>
                          <td className="col-left">{row.data.qty}</td>
                          <td className="col-left">{row.data.weight}</td>
                          <td className="col-gap"></td>
                          <td className="col-right">{row.data.frontArea}</td>
                          <td className="col-right">{row.data.cf}</td>
                          <td className="col-right">{row.data.wlaf}</td>
                          <td className="col-right">{row.data.qty}</td>
                          <td className="col-right">{row.data.wlaf}</td>
                        </>
                      )}

                      {row.type === "pole" && (
                        <>
                          <td className="col-1 tracking-[0.05em] jp">
                            {row.data.description ?? ""}
                          </td>
                          <td className="col-left">1102.1</td>
                          <td className="col-left">{row.data.qty ?? ""}</td>
                          <td className="col-left">1102.1</td>
                          <td className="col-gap"></td>
                          <td className="col-right">1.050</td>
                          <td className="col-right">0.7</td>
                          <td className="col-right">1627.3</td>
                          <td className="col-right">{row.data.qty ?? ""}</td>
                          <td className="col-right">1627.3</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>

                {/* Total N(vertical force) dan Pmax(horizontal force) */}
                <tfoot>
                  <tr>
                    <td className="col-num"></td>
                    <td className="col-1-tf"></td>
                    <td colspan={2} className="tfoot-title col-left">
                      <span className="tracking-[0.05em] jp">鉛直力 </span>N=
                    </td>
                    <td className="tfoot-value col-left">1660.3</td>
                    <td className="col-gap"></td>
                    <td colspan={4} className="tfoot-title col-right">
                      <span className="tracking-[0.05em] jp">水平力 </span>
                      Pmax=
                    </td>
                    <td colspan={1} className="tfoot-value col-right">
                      3177.0
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>
      ),
    });

    // c2 = 固定時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c2-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 2) 固定時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                2<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                固定時曲げモーメント
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px] gap-1">
              <div className="flex flex-col">
                <div>Mwx'</div>
                <div>Mwy'</div>
              </div>
              <div className="flex flex-col">
                <div>=</div>
                <div>=</div>
              </div>
              <div className="flex flex-col">
                <div>127.0 N・m</div>
                <div>127.0 N・m</div>
              </div>
            </div>
          </div>
        </section>
      ),
    });

    // c3 = 風時曲げモーメント (Bending Moment due to Wind)
    blocks.push({
      id: `c3-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 3) 風時曲げモーメント (Bending Moment due to Wind) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">
                3<span className="jp">)</span>.
              </span>
              <span className="page1-text tracking-[0.05em] jp">
                風時曲げモーメント
              </span>
            </div>

            {/* Moment formula */}
            <div className="flex justify-start ml-[44px] gap-1">
              <div className="flex flex-col">
                <div>Mpx</div>
                <div>Mpy</div>
              </div>
              <div className="flex flex-col">
                <div>=</div>
                <div>=</div>
              </div>
              <div className="flex flex-col">
                <div>
                  PA・H1<span className="mx-0.5">+</span>PB・H2
                  <span className="mx-0.5">+</span>PC・H2
                  <span className="mx-0.5">+</span>PD・H1'
                  <span className="mx-1">=</span>12975.1 N・m
                </div>
                <div>0.0 N・m</div>
              </div>
            </div>
          </div>
        </section>
      ),
    });

    // c4 = 曲げ応力度 (Bending Stress)
    blocks.push({
      id: `c4-${suffix}`,
      node: (
        <section className="pt-[20px]">
          {/* Sub-section: 4) 曲げ応力度 (Bending Stress) */}
          <div className="flex flex-col">
            <div className="flex justify-start ml-[22px] mb-0">
              <span className="page1-number">4).</span>
              <span className="page1-text tracking-[0.05em] jp">
                曲げ応力度
              </span>
            </div>

            {/* Bending stress calculation */}
            <div className="flex justify-start ml-[44px]">
              <span className="mr-[8px] tracking-[0.05em]">cσb =</span>
              <span className="mr-[8px]">Mp{index + 1}/Z =</span>
              <span>
                39.7 N/mm<sup>2</sup>
              </span>
            </div>

            {/* Checking the ratio to allowable stress */}
            <div className="ml-[68px] leading-none inline-block">
              <div className="inline-block">
                <div className="flex items-center whitespace-nowrap">
                  <div className="flex flex-col items-center">
                    <div className="border-b border-black pb-[3px] tracking-[0.05em] px-1.5">
                      cσb
                    </div>
                    <div className="mt-[3px] tracking-[0.05em]">sfb</div>
                  </div>
                  <div className="mx-2">=</div>
                  <div className="flex flex-col items-center">
                    <div className="border-b border-black pb-[3px] px-1.5">
                      39.7
                    </div>
                    <div className="mt-[3px]">235</div>
                  </div>
                  <div className="mx-2">=</div>
                  <div className="flex items-center">
                    <span>0.169</span>
                    <span className="mx-3.5">&lt;</span>
                    <span className="pr-4">1.0・・・O.K</span>
                  </div>
                </div>
                <div className="border-t border-black mt-[3px] w-full"></div>
              </div>
            </div>
          </div>
        </section>
      ),
    });
  });

  // c5 = 基礎部に加わる応力 (Stress applied to the foundation)
  blocks.push({
    id: "c5",
    node: (
      <section className="pt-[20px]">
        {/* Main-section: 基礎部に加わる応力 (Stress applied to the foundation) */}
        <h2 className="page1-title">
          <span className="page1-number">{4 + sectionCounter++}.</span>
          <span className="page1-text tracking-[0.05em] jp">
            基礎部に加わる応力
          </span>
        </h2>

        <div className="flex justify-start ml-[22px]">
          <div className="flex flex-col mb-0 mr-8">
            <div className="page1-text tracking-[0.05em] jp">・鉛直力</div>
            <div className="page1-text tracking-[0.05em] jp">・水平力</div>
            <div className="page1-text tracking-[0.05em] jp">
              ・曲げモーメント
            </div>
          </div>
          <div className="flex flex-col mb-0 mr-1">
            <div className="page1-text">N</div>
            <div className="page1-text">P</div>
            <div className="page1-text">M</div>
          </div>
          <div className="flex flex-col mb-0 mr-1">
            <div className="page1-text">=</div>
            <div className="page1-text">=</div>
            <div className="page1-text">=</div>
          </div>
          <div className="flex flex-col mb-0">
            <div className="page1-text">353.1 N</div>
            <div className="page1-text">1596.0 N</div>
            <div className="page1-text">1596.0 N・m</div>
          </div>
        </div>
      </section>
    ),
  });

  return blocks;
};
