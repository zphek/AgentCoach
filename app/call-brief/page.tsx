"use client";

import { Suspense } from "react";
import { MobileContainer } from "@/components/layout/mobile-container";
import { CallBriefScreen } from "@/features/call-brief/components/call-brief-screen";

function CallBriefContent() {
  return <CallBriefScreen />;
}

export default function CallBriefPage() {
  return (
    <MobileContainer>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-dvh">
            <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        }
      >
        <CallBriefContent />
      </Suspense>
    </MobileContainer>
  );
}
