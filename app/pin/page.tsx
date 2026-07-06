"use client";

import { MobileContainer } from "@/components/layout/mobile-container";
import { PinScreen } from "@/features/pin/components/pin-screen";

export default function PinPage() {
  return (
    <MobileContainer variant="splash" className="bg-[#F8F8F6]">
      <PinScreen />
    </MobileContainer>
  );
}
