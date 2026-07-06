"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/providers/language-provider";

export function useTimeGreeting(): string {
  const { t } = useLanguage();
  const [key, setKey] = useState("greeting.afternoon");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setKey("greeting.morning");
    } else if (hour < 18) {
      setKey("greeting.afternoon");
    } else {
      setKey("greeting.evening");
    }
  }, []);

  return t(key);
}
