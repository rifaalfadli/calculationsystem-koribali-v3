import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";

export default function Entry() {
  const navigate = useNavigate();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const handleGuest = () => {
    localStorage.setItem(
      "user_session",
      JSON.stringify({
        name: "Guest User",
        email: "",
        role: "guest",
      }),
    );

    navigate("/calculation");
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden"
    >
      {/* Background Gradient Motion */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) =>
              `radial-gradient(500px circle at ${x}px ${y}px, rgba(13,59,102,0.12), transparent 70%)`,
          ),
        }}
      />

      {/* CARD (TIDAK DIUBAH) */}
      <div className="relative z-10 bg-white p-10 rounded-2xl shadow-lg w-[420px] text-center">
        <img
          src="/images/koribali-logo.webp"
          alt="koribali icon"
          width={64}
          height={64}
          className="w-16 mx-auto mb-4"
        />

        <h1 className="text-2xl font-bold text-slate-800">KORI BALI</h1>

        <p className="text-sm text-slate-500 mb-8">
          Pole Structure Calculation System
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/login")}
            className="bg-[#0d3b66] text-white py-3 rounded-lg font-semibold hover:bg-[#0b3154]"
          >
            Login to Account
          </button>

          <button
            onClick={handleGuest}
            className="border border-slate-200 py-3 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}
