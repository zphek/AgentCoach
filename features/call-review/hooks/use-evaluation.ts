"use client";

import { useState, useEffect, useRef } from "react";
import type { CallEvaluation } from "@/types/evaluation";

interface ReviewData {
  transcript: string;
  issueTitle: string;
  customerName: string;
  personality: string;
  difficulty: string;
  endReason: string | null;
  duration: number;
}

interface UseEvaluationReturn {
  evaluation: CallEvaluation | null;
  reviewData: ReviewData | null;
  isLoading: boolean;
  error: string | null;
}

export function useEvaluation(): UseEvaluationReturn {
  const [evaluation, setEvaluation] = useState<CallEvaluation | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const stored = sessionStorage.getItem("agentcoach-review");
    if (!stored) {
      setError("No call data found");
      setIsLoading(false);
      return;
    }

    const data: ReviewData = JSON.parse(stored);
    setReviewData(data);

    if (!data.transcript || data.transcript.length < 20) {
      setError("Not enough conversation data to evaluate");
      setIsLoading(false);
      return;
    }

    // Call the evaluation API
    fetch("/api/evaluation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript: data.transcript,
        issueTitle: data.issueTitle,
        customerName: data.customerName,
        personality: data.personality,
        difficulty: data.difficulty,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setEvaluation(res.evaluation);
        } else {
          setError(res.error || "Evaluation failed");
        }
      })
      .catch(() => setError("Failed to evaluate call"))
      .finally(() => setIsLoading(false));
  }, []);

  return { evaluation, reviewData, isLoading, error };
}
