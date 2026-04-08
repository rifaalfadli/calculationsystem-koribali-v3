import React from "react";
import { getNumericError } from "../../utils/pole-analyzer";

export function ArmInput({ arm, onUpdate, armError }) {
  // Function to helper class input
  const inputClass = (hasError) =>
    `w-full px-4 py-2.5 rounded-lg outline-none transition-all border text-sm
  ${
    hasError
      ? "border border-red-500 bg-[#fff5f5] ring-1 ring-red-200 focus:border-red-500 focus:ring-1 focus:ring-red-200"
      : "border-gray-300 bg-white focus:border-[#3399cc] focus:ring-1 focus:ring-[#3399cc]"
  } hp:pl-2 hp:py-2  hp:rounded-md hp:text-xs`;

  // Function to helper text error
  const ErrorText = ({ show, text }) =>
    show ? (
      <div className="absolute left-0 -bottom-5 flex items-center gap-1 text-[11px] text-red-500 hp:text-[9px] hp:-bottom-4">
        <span>*{text}</span>
      </div>
    ) : null;

  return (
    <div>
      <div
        className="
          grid
          grid-cols-12
          gap-2

          xl:grid-cols-12
          lg:grid-cols-4
          md:grid-cols-3
          sm:grid-cols-2
          grid-cols-1
        "
      >
        {/* Arm Name Input */}
        <div className="relative col-span-2">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Arm Name
          </label>
          <input
            type="text"
            value={arm.nameArm}
            onChange={(e) => onUpdate({ nameArm: e.target.value })}
            placeholder="e.g., 感知器アーム"
            className={inputClass(armError.nameArm)}
          />
          <ErrorText show={armError.nameArm} text="Required field" />
        </div>

        {/* Material Arm Selector */}
        <div className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Material
          </label>
          <select
            value={arm.materialArm}
            onChange={(e) => onUpdate({ materialArm: e.target.value })}
            className={`
              ${inputClass(armError.materialArm)}
              pr-4
              h-[42px]
            `}
          >
            <option value="STK400">STK400</option>
            <option value="STK490">STK490</option>
            <option value="STK500">STK500</option>
            <option value="STK540">STK540</option>
            <option value="STKR400">STKR400</option>
          </select>
          <ErrorText show={armError.materialArm} text="Required field" />
        </div>

        {/* Diameter Arm Input */}
        <div className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Diameter
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={arm.diameterArm}
              onChange={(e) =>
                onUpdate({
                  diameterArm: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputClass(armError.diameterArm)} pr-7 hp:py-[9.5px] hp:pr-6`}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
              mm
            </span>
          </div>
          <ErrorText
            show={armError.diameterArm}
            text={getNumericError(arm.diameterArm)}
          />
        </div>

        {/* Thickness Arm Input */}
        <div className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Thickness
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={arm.thicknessArm}
              onChange={(e) =>
                onUpdate({
                  thicknessArm: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputClass(armError.thicknessArm)} pr-7 hp:pr-6`}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
              mm
            </span>
          </div>
          <ErrorText
            show={armError.thicknessArm}
            text={getNumericError(arm.thicknessArm)}
          />
        </div>

        {/* Length Arm Input */}
        <div className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Length
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={arm.lengthArm}
              onChange={(e) =>
                onUpdate({
                  lengthArm: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputClass(armError.lengthArm)} pr-7 hp:pr-6`}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
              mm
            </span>
          </div>
          <ErrorText
            show={armError.lengthArm}
            text={getNumericError(arm.lengthArm)}
          />
        </div>

        {/* Exp.Length Arm Input */}
        <div className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            exp.Length
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={arm.expLengthArm}
              onChange={(e) =>
                onUpdate({
                  expLengthArm: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputClass(armError.expLengthArm)} pr-7 hp:pr-7`}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
              mm
            </span>
          </div>
          <ErrorText
            show={armError.expLengthArm}
            text={getNumericError(arm.expLengthArm)}
          />
        </div>

        {/* Height Arm Input */}
        <div className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Z (H)
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={arm.heightArm}
              onChange={(e) =>
                onUpdate({
                  heightArm: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputClass(armError.heightArm)} pr-7 hp:pr-7`}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
              mm
            </span>
          </div>
          <ErrorText
            show={armError.heightArm}
            text={getNumericError(arm.heightArm)}
          />
        </div>

        {/* H-Distance Arm Input */}
        <div className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            H-Distance
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={arm.hDistanceArm}
              onChange={(e) =>
                onUpdate({
                  hDistanceArm: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputClass(armError.hDistanceArm)} pr-7 hp:pr-7`}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
              mm
            </span>
          </div>
          <ErrorText
            show={armError.hDistanceArm}
            text={getNumericError(arm.hDistanceArm)}
          />
        </div>

        {/* Fix Angle Arm Input */}
        <div className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Fix Angle
          </label>
          <div className="relative">
            <input
              type="number"
              value={arm.fixAngleArm}
              onChange={(e) =>
                onUpdate({
                  fixAngleArm: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputClass(armError.fixAngleArm)} pr-7 hp:pr-7`}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
              deg
            </span>
          </div>
          <ErrorText show={armError.fixAngleArm} text="Required field" />
        </div>

        {/* nnC Arm Input */}
        <div className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            nnC
          </label>
          <input
            type="number"
            min={0}
            value={arm.nncArm}
            onChange={(e) =>
              onUpdate({
                nncArm: e.target.value,
              })
            }
            onWheel={(e) => e.target.blur()}
            className={`${inputClass(armError.nncArm)}`}
          />
          <ErrorText
            show={armError.nncArm}
            text={getNumericError(arm.nncArm)}
          />
        </div>

        {/* Quantity Arm Input */}
        <div className="relative w-full">
          <label className="block text-sm text-gray-700 mb-2 hp:text-xs hp:mb-1">
            Quantity
          </label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={arm.qtyArm}
              onChange={(e) =>
                onUpdate({
                  qtyArm: e.target.value,
                })
              }
              onWheel={(e) => e.target.blur()}
              className={`${inputClass(armError.qtyArm)} pr-7 hp:pr-7`}
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-black-400">
              pcs
            </span>
          </div>
          <ErrorText
            show={armError.qtyArm}
            text={getNumericError(arm.qtyArm)}
          />
        </div>
      </div>
    </div>
  );
}
