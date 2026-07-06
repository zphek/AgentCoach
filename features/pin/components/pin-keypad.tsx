"use client";

import { Delete } from "lucide-react";
import { motion } from "framer-motion";

interface PinKeypadProps {
  onDigit: (digit: string) => void;
  onDelete: () => void;
  disabled?: boolean;
}

const KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["", "0", "delete"],
] as const;

export function PinKeypad({ onDigit, onDelete, disabled }: PinKeypadProps) {
  return (
    <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto">
      {KEYS.flat().map((key, index) => {
        if (key === "") {
          return <div key={index} />;
        }

        if (key === "delete") {
          return (
            <motion.button
              key="delete"
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={onDelete}
              disabled={disabled}
              className="w-[76px] h-[76px] rounded-full flex items-center justify-center mx-auto text-primary hover:bg-surface-container-high active:bg-surface-container-highest transition-colors disabled:opacity-40"
              aria-label="Delete"
            >
              <Delete size={24} />
            </motion.button>
          );
        }

        return (
          <motion.button
            key={key}
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => onDigit(key)}
            disabled={disabled}
            className="w-[76px] h-[76px] rounded-full flex items-center justify-center mx-auto text-primary text-[28px] font-semibold hover:bg-surface-container-high active:bg-surface-container-highest transition-colors disabled:opacity-40"
          >
            {key}
          </motion.button>
        );
      })}
    </div>
  );
}
