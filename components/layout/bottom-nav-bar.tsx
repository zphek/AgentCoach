"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Dumbbell, History, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/practice", label: "Practice", icon: Dumbbell },
  { href: "/history", label: "History", icon: History },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full max-w-[430px] z-50 pb-safe backdrop-blur-xl bg-surface/80 shadow-sm">
      <div className="flex justify-around items-center h-16 px-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-14 rounded-xl",
                "transition-colors active:scale-95 duration-200",
                isActive
                  ? "text-primary font-bold"
                  : "text-outline hover:bg-surface-container-low"
              )}
            >
              <Icon
                size={24}
                fill={isActive ? "currentColor" : "none"}
                strokeWidth={isActive ? 0 : 2}
              />
              <span className="text-[12px] leading-[16px] font-semibold mt-1">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
