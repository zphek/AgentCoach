"use client";

import { Timer, BarChart3, PhoneCall } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { SectionTitle } from "@/components/ui/section-title";
import { useLanguage } from "@/providers/language-provider";

export function QuickStats() {
  const { t } = useLanguage();

  return (
    <section>
      <SectionTitle>{t("stats.quickStats")}</SectionTitle>
      <div className="grid grid-cols-2 gap-gutter">
        <StatCard
          icon={Timer}
          label={t("stats.practiceTime")}
          value="0"
          unit={t("stats.hrs")}
        />
        <StatCard
          icon={BarChart3}
          label={t("stats.avgScore")}
          value="—"
        />
        <div className="col-span-2 bg-surface-container-lowest rounded-[24px] p-4 shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-surface-container-high flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <PhoneCall size={20} />
            </div>
            <div>
              <span className="text-[12px] leading-[16px] font-semibold text-secondary uppercase tracking-wider block">
                {t("stats.callsCompleted")}
              </span>
              <span className="text-[24px] leading-[32px] tracking-[-0.01em] font-semibold text-primary">
                0{" "}
                <span className="text-[16px] leading-[24px] text-secondary font-normal">
                  {t("stats.thisWeek")}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
