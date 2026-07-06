import { AppShell } from "@/components/layout/app-shell";
import { CallReviewScreen } from "@/features/call-review/components/call-review-screen";

export default function CallReviewPage() {
  return (
    <AppShell hideBottomNav>
      <CallReviewScreen />
    </AppShell>
  );
}
