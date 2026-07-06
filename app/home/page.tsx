import { AppShell } from "@/components/layout/app-shell";
import { HomeScreen } from "@/features/home/components/home-screen";

export default function HomePage() {
  return (
    <AppShell hideBottomNav>
      <HomeScreen />
    </AppShell>
  );
}
