import { AlertCircle, X } from "lucide-react";
import { CoverInput } from "./CoverInput";

// ====================================================
// INITIAL CONFIRM MODAL
// ====================================================
export const ConfirmDisableComponentModal = ({ data, onClose, onConfirm }) => {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
        {/* Icon */}
        <div className="mx-auto mb-4 flex items-center justify-center w-14 h-14 bg-red-100 rounded-full">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>

        {/* Title */}
        <h2 className="text-center font-bold text-base text-gray-900 mb-2">
          Disable Components?
        </h2>

        {/* Description */}
        <p className="text-center text-gray-600 text-sm mb-6">
          You are about to disable:
          <div className="flex flex-wrap justify-center gap-2 my-3">
            {data.map((item) => (
              <span
                key={item}
                className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-600 rounded-full"
              >
                {item}
              </span>
            ))}
          </div>
          All related data will be permanently deleted.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 font-bold text-sm bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-3 font-bold text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Yes, Disable
          </button>
        </div>
      </div>
    </div>
  );
};

// ====================================================
// COVER INPUT MODAL
// ====================================================
export const CoverInputModal = ({
  open,
  onClose,
  cover,
  onUpdateCover,
  onMakeReport,
  coverErrors,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden animate-fadeIn hp:rounded-xl hp:shadow-xl">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#0d3b66] to-[#3399cc] p-4 flex items-center justify-between hp:px-2 hp:py-[8px]">
          <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
            <h2 className="text-white font-bold text-[16px] hp:text-xs hp:font-semibold">
              Cover Information
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition"
          >
            <X className="w-6 h-6 hp:w-5 hp:h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 max-h-[75vh] overflow-y-auto hp:p-2">
          <CoverInput
            cover={cover}
            onUpdate={onUpdateCover}
            onMake={onMakeReport}
            errors={coverErrors}
          />
        </div>
      </div>
    </div>
  );
};

// ====================================================
// CONFIRM SAVE DRAFT MODAL
// ====================================================
export const ConfirmSaveDraftModal = ({
  confirmSaveDraft,
  onClose,
  onSaveDraft,
  onDiscard,
}) => {
  if (!confirmSaveDraft) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div
        className="
          w-full max-w-xs
          bg-white border border-gray-200
          rounded-xl shadow-xl
          p-4
          sm:max-w-md sm:p-8 sm:rounded-2xl
        "
      >
        {/* Icon */}
        <div
          className="
            mx-auto mb-3
            flex items-center justify-center
            w-10 h-10 sm:w-16 sm:h-16
            bg-yellow-100 rounded-full
          "
        >
          <AlertCircle className="w-5 h-5 sm:w-8 sm:h-8 text-yellow-500" />
        </div>

        {/* Title */}
        <h2
          className="
            text-center font-bold
            text-sm sm:text-base
            text-gray-900
            mb-1 sm:mb-2
          "
        >
          Unsaved Changes
        </h2>

        {/* Description */}
        <p
          className="
            text-center text-gray-600
            text-xs sm:text-sm
            mb-4 sm:mb-6
            leading-relaxed
          "
        >
          You have unsaved calculation data. Do you want to save this
          configuration as a draft before leaving?
        </p>

        {/* Buttons */}
        <div className="flex gap-2 sm:gap-3">
          {/* Cancel */}
          <button
            onClick={onClose}
            className="
              flex-1
              py-2 sm:py-3 font-bold
              text-xs sm:text-sm
              bg-slate-100 text-slate-600
              rounded-md sm:rounded-lg
              hover:bg-slate-200 transition
            "
          >
            Cancel
          </button>

          {/* Discard */}
          <button
            onClick={() => {
              onDiscard();
              onClose();
            }}
            className="
              flex-1
              py-2 sm:py-3 font-bold
              text-xs sm:text-sm
              bg-red-500 text-white
              rounded-md sm:rounded-lg
              hover:bg-red-600 transition
            "
          >
            Discard
          </button>

          {/* Save Draft */}
          <button
            onClick={() => {
              onSaveDraft();
              onClose();
            }}
            className="
              flex-1
              py-2 sm:py-3 font-bold
              text-xs sm:text-sm
              bg-green-600 text-white
              rounded-md sm:rounded-lg
              hover:bg-green-700 transition
            "
          >
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
};

// ====================================================
// RESET ALL CONFIRMATION MODAL
// ====================================================
export const ConfirmResetAllModal = ({
  confirmResetAll,
  onClose,
  handleDeleteReport,
}) => {
  if (!confirmResetAll) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div
        className="
          w-full max-w-xs
          bg-white border border-gray-200
          rounded-xl shadow-xl
          p-4
          sm:max-w-md sm:p-8 sm:rounded-2xl
        "
      >
        {/* Icon */}
        <div
          className="
            mx-auto mb-3
            flex items-center justify-center
            w-10 h-10 sm:w-16 sm:h-16
            bg-red-100 rounded-full
          "
        >
          <AlertCircle className="w-5 h-5 sm:w-8 sm:h-8 text-red-500" />
        </div>

        {/* Title */}
        <h2
          className="
            text-center font-bold
            text-sm sm:text-base
            text-gray-900
            mb-1 sm:mb-2
          "
        >
          Reset All Data?
        </h2>

        {/* Description */}
        <p
          className="
            text-center text-gray-600
            text-xs sm:text-sm
            mb-4 sm:mb-6
            leading-relaxed
          "
        >
          This will remove all form inputs and calculation results. This action
          cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="
              flex-1
              py-2 sm:py-3 font-bold
              text-xs sm:text-sm
              bg-slate-100 text-slate-600
              rounded-md sm:rounded-lg
              hover:bg-slate-200 transition
            "
          >
            Cancel
          </button>

          <button
            onClick={() => {
              handleDeleteReport();
              onClose();
            }}
            className="
              flex-1
              py-2 sm:py-3 font-bold
              text-xs sm:text-sm
              bg-red-500 text-white
              rounded-md sm:rounded-lg
              hover:bg-red-600 transition
            "
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

// ====================================================
// DELETE CONFIRMATION MODAL
// ====================================================
export const ConfirmDeleteModal = ({
  open,
  onClose,
  onConfirm,
  itemName = "",
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-xs sm:max-w-md bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8"
      >
        {/* Icon */}
        <div className="mx-auto mb-3 flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-red-100 rounded-full">
          <AlertCircle className="w-5 h-5 sm:w-8 sm:h-8 text-red-500" />
        </div>

        {/* Title */}
        <h2
          id="modal-title"
          className="text-center font-bold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2"
        >
          Delete {itemName}?
        </h2>

        {/* Description */}
        <p className="text-center text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
          Are you sure you want to delete this {itemName}? This action cannot be
          undone.
        </p>

        {/* Buttons */}
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 sm:py-3 font-bold text-xs sm:text-sm bg-slate-100 text-slate-600 rounded-md sm:rounded-lg hover:bg-slate-200"
          >
            Cancel
          </button>

          <button
            onClick={async () => {
              await onConfirm();
              onClose();
            }}
            className="flex-1 py-2 sm:py-3 font-bold text-xs sm:text-sm bg-red-500 text-white rounded-md sm:rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ====================================================
// REDUCE CONFIRMATION MODAL
// ====================================================
export const ConfirmReduceModal = ({
  open,
  onClose,
  onConfirm,
  itemName = "",
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-xs sm:max-w-md bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8"
      >
        {/* Icon */}
        <div className="mx-auto mb-3 flex items-center justify-center w-10 h-10 sm:w-16 sm:h-16 bg-red-100 rounded-full">
          <AlertCircle className="w-5 h-5 sm:w-8 sm:h-8 text-red-500" />
        </div>

        {/* Title */}
        <h2
          id="modal-title"
          className="text-center font-bold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2"
        >
          Reduce {itemName}?
        </h2>

        {/* Description */}
        <p className="text-center text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6">
          You are about to reduce {itemName} from <strong>{open.from}</strong>{" "}
          to <strong>{open.to}</strong>. The last {itemName} will be permanently
          removed.
        </p>

        {/* Buttons */}
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 sm:py-3 font-bold text-xs sm:text-sm bg-slate-100 text-slate-600 rounded-md sm:rounded-lg hover:bg-slate-200"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 py-2 sm:py-3 font-bold text-xs sm:text-sm bg-red-500 text-white rounded-md sm:rounded-lg hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// ====================================================
// TOAST MODAL
// ====================================================
export const ToastModal = ({ toast, onClose }) => {
  if (!toast) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4 transition-opacity duration-300">
      <div
        className="
          bg-white
          w-full max-w-xs
          sm:max-w-fit
          rounded-2xl sm:rounded-3xl
          shadow-[0_10px_40px_rgba(0,0,0,0.15)]
          p-4 sm:p-7
          transform transition-all duration-300
          scale-100 sm:scale-95
          animate-fadeIn
        "
      >
        {/* Content */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          {/* Icon */}
          <div
            className="
              flex-shrink-0
              flex items-center justify-center
              w-9 h-9 sm:w-12 sm:h-12
              rounded-lg sm:rounded-xl
              bg-yellow-50 text-yellow-500
              border border-yellow-300
            "
          >
            <AlertCircle className="w-5 h-5 sm:w-7 sm:h-7" />
          </div>

          {/* Message */}
          <p
            className="
              text-gray-700
              text-xs sm:text-[16px]
              font-semibold
              leading-snug
            "
          >
            {toast.message}
          </p>
        </div>

        {/* Button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="
              px-4 py-2 sm:px-6 sm:py-3
              rounded-md sm:rounded-lg
              bg-blue-50 border border-blue-500
              text-blue-700
              text-xs sm:text-sm
              font-semibold
              hover:bg-blue-100
              transition-all
              shadow-sm
              active:scale-95
            "
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
