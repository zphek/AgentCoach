import { AppShell } from "@/components/layout/app-shell";
import { PracticeSetupScreen } from "@/features/practice/components/practice-setup-screen";

export default function PracticePage() {
  return (
    <AppShell hideBottomNav>
      <PracticeSetupScreen />
    </AppShell>
  );
}
