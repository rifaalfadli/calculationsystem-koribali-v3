import React from "react";

export function OpeningTypeInput({ opType, onUpdate, errors }) {
  // Function to helper class input
  const inputClass = (hasError) =>
    `w-full px-4 py-2.5 rounded-lg outline-none transition-all border text-sm
  ${
    hasError
      ? "border border-red-500 bg-[#fff5f5] ring-1 ring-red-200 focus:border-red-500 focus:ring-1 focus:ring-red-200"
      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  } hp:py-2 hp:pl-2 hp:pr-10 hp:rounded-md hp:text-xs`;

  // Function to helper text error
  const ErrorText = ({ show, text }) =>
    show ? (
      <div className="absolute left-0 -bottom-5 flex items-center gap-1 text-[11px] text-red-500 hp:text-[9px] hp:-bottom-4">
        <span>*{text}</span>
      </div>
    ) : null;

  return (
    <div className="bg-white border border-gray-200 p-5 shadow-sm rounded-b-2xl hp:rounded-b-lg hp:px-4 hp:py-6">
      {/* HEADER */}
      <div>
        {/* CARD */}
        <div className="relative">
          <select
            value={opType.type}
            onChange={(e) => onUpdate({ type: e.target.value })}
            className={`${inputClass(errors.type)} min-h-[42px]`}
          >
            <option value="" disabled>
              Select Opening Part Type
            </option>

            <option value="box">Box Type</option>
            <option value="r">R Type</option>
          </select>
          <ErrorText show={errors.type} text="Required field" />
        </div>
      </div>
    </div>
  );
}
