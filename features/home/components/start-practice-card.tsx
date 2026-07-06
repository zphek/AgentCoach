"use client";

import { useRouter } from "next/navigation";
import { Mic } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/providers/language-provider";

export function StartPracticeCard() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <motion.section
      whileTap={{ scale: 0.98 }}
      onClick={() => router.push("/practice")}
      className="cursor-pointer"
    >
      <div className="bg-surface-container-lowest rounded-[24px] p-edge shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-surface-container-high flex flex-col justify-between h-[200px] relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-container-lowest opacity-50 z-10" />
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-tertiary-fixed-dim/20 rounded-full blur-3xl group-hover:bg-tertiary-fixed-dim/30 transition-colors duration-500" />
        <div className="z-20">
          <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center mb-stack-md shadow-md">
            <Mic size={20} />
          </div>
          <h3 className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-primary">
            {t("home.startPractice")}
          </h3>
          <p className="text-[16px] leading-[24px] text-secondary mt-1">
            {t("home.startPracticeDesc")}
          </p>
        </div>
      </div>
    </motion.section>
  );
}
