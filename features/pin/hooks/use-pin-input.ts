"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface UsePinInputReturn {
  digits: string[];
  error: boolean;
  isLoading: boolean;
  addDigit: (digit: string) => void;
  removeDigit: () => void;
}

export function usePinInput(): UsePinInputReturn {
  const [digits, setDigits] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const submitPin = useCallback(
    async (pin: string) => {
      setIsLoading(true);
      setError(false);

      try {
        const res = await fetch("/api/auth/pin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pin }),
        });

        const data = await res.json();

        if (data.success) {
          // Small delay for success animation
          setTimeout(() => {
            router.push("/home");
          }, 300);
        } else {
          setError(true);
          setIsLoading(false);
          // Clear digits after error animation
          setTimeout(() => {
            setDigits([]);
            setError(false);
          }, 600);
        }
      } catch {
        setError(true);
        setIsLoading(false);
        setTimeout(() => {
          setDigits([]);
          setError(false);
        }, 600);
      }
    },
    [router]
  );

  const addDigit = useCallback(
    (digit: string) => {
      if (isLoading || digits.length >= 4) return;

      const newDigits = [...digits, digit];
      setDigits(newDigits);

      if (newDigits.length === 4) {
        submitPin(newDigits.join(""));
      }
    },
    [digits, isLoading, submitPin]
  );

  const removeDigit = useCallback(() => {
    if (isLoading) return;
    setDigits((prev) => prev.slice(0, -1));
    setError(false);
  }, [isLoading]);

  return { digits, error, isLoading, addDigit, removeDigit };
}
