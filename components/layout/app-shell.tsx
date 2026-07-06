import { MobileContainer } from "./mobile-container";
import { TopAppBar } from "./top-app-bar";
import { BottomNavBar } from "./bottom-nav-bar";
import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  rightAction?: ReactNode;
  hideBottomNav?: boolean;
}

export function AppShell({ children, rightAction, hideBottomNav }: AppShellProps) {
  return (
    <MobileContainer>
      <TopAppBar rightAction={rightAction} />
      <main className={`pt-24 px-edge ${hideBottomNav ? "pb-8" : "pb-32"}`}>{children}</main>
      {!hideBottomNav && <BottomNavBar />}
    </MobileContainer>
  );
}
