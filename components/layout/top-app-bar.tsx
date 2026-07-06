"use client";

import { Bell } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import type { ReactNode } from "react";

interface TopAppBarProps {
  title?: string;
  rightAction?: ReactNode;
}

export function TopAppBar({
  title = "AgentCoach",
  rightAction,
}: TopAppBarProps) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <header className="fixed top-0 w-full max-w-[430px] z-50 backdrop-blur-xl bg-surface/80">
      <div className="flex justify-between items-center px-edge py-4">
        <h1 className="text-[24px] leading-[32px] tracking-[-0.01em] font-bold text-primary">
          {title}
        </h1>
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="px-2.5 py-1 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors active:scale-95 text-[13px] font-semibold text-primary border border-surface-container-high"
            aria-label={`Switch to ${language === "en" ? "Spanish" : "English"}`}
          >
            {language === "en" ? "🇪🇸 ES" : "🇺🇸 EN"}
          </button>

          {rightAction ?? (
            <button
              type="button"
              className="hover:opacity-80 transition-opacity active:scale-95 duration-200"
              aria-label="Notifications"
            >
              <Bell size={24} className="text-primary" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
