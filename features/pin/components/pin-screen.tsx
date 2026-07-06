"use client";

import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { PinDots } from "./pin-dots";
import { PinKeypad } from "./pin-keypad";
import { usePinInput } from "../hooks/use-pin-input";

export function PinScreen() {
  const { digits, error, isLoading, addDigit, removeDigit } = usePinInput();

  return (
    <div className="flex-1 flex flex-col items-center justify-between px-edge py-12 relative z-10">
      {/* Top Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
        className="flex flex-col items-center pt-8"
      >
        {/* Logo */}
        <div className="w-20 h-20 bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] flex items-center justify-center mb-6">
          <Logo size={40} />
        </div>

        {/* Welcome Text */}
        <h1 className="text-[28px] leading-[34px] tracking-[-0.02em] font-bold text-primary mb-2">
          Welcome back
        </h1>
        <p className="text-[16px] leading-[24px] text-secondary mb-10">
          Enter your PIN to continue
        </p>

        {/* PIN Dots */}
        <PinDots length={4} filled={digits.length} error={error} />

        {/* Error message */}
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: error ? 1 : 0,
            height: error ? "auto" : 0,
          }}
          className="text-error text-[14px] font-medium mt-3"
        >
          Incorrect PIN
        </motion.p>
      </motion.div>

      {/* Keypad */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
        }}
        className="pb-4"
      >
        <PinKeypad
          onDigit={addDigit}
          onDelete={removeDigit}
          disabled={isLoading}
        />
      </motion.div>
    </div>
  );
}
