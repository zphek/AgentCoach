"use client";

import { History, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/ui/section-title";
import { useLanguage } from "@/providers/language-provider";

export function RecentSession() {
  const { t } = useLanguage();

  return (
    <section>
      <SectionTitle>{t("home.recent")}</SectionTitle>
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="bg-surface-container-lowest rounded-[24px] p-edge shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-surface-container-high flex items-center justify-between cursor-pointer hover:bg-surface-container-low transition-colors duration-200"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
            <History size={20} />
          </div>
          <div>
            <h4 className="text-[14px] leading-[20px] tracking-[0.01em] font-medium text-primary">
              {t("home.continueSession")}
            </h4>
            <p className="text-[12px] leading-[16px] font-semibold text-secondary">
              {t("home.angryScenario")}
            </p>
          </div>
        </div>
        <ChevronRight size={24} className="text-secondary" />
      </motion.div>
    </section>
  );
}
