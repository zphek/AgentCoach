"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Star, ThumbsUp, MessageCircle, Loader2, RefreshCw } from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";
import { PrimaryButton } from "@/components/ui/primary-button";
import { useEvaluation } from "../hooks/use-evaluation";
import { formatDuration } from "@/lib/format";

/* ─── Score Bar ─── */
function ScoreBar({ label, value }: { label: string; value: number }) {
  const getBarColor = (v: number) => {
    if (v >= 90) return "bg-[#1a1a1a]";
    if (v >= 70) return "bg-[#333]";
    return "bg-tertiary-fixed-dim";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[14px] leading-[20px] text-primary font-medium">{label}</span>
        <span className="text-[14px] leading-[20px] text-secondary font-semibold tabular-nums">
          {value}%
        </span>
      </div>
      <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className={`h-full rounded-full ${getBarColor(value)}`}
        />
      </div>
    </div>
  );
}

/* ─── Loading Skeleton ─── */
function ReviewSkeleton() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-edge">
      <Loader2 size={40} className="text-tertiary-fixed-dim animate-spin mb-4" />
      <p className="text-[16px] leading-[24px] text-secondary font-medium">
        Analyzing your performance...
      </p>
      <p className="text-[13px] leading-[18px] text-secondary/60 mt-1">
        Our AI coach is reviewing your call
      </p>
    </div>
  );
}

/* ─── Main Component ─── */
export function CallReviewScreen() {
  const router = useRouter();
  const { evaluation, reviewData, isLoading, error } = useEvaluation();

  if (isLoading) return <ReviewSkeleton />;

  if (error || !evaluation) {
    return (
      <div className="px-edge pt-8">
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-6"
        >
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <p className="text-primary text-[18px] font-medium mb-4">
          {error || "No evaluation available"}
        </p>
        <PrimaryButton onClick={() => router.push("/home")} icon={ArrowLeft}>
          Back to Home
        </PrimaryButton>
      </div>
    );
  }

  const animProps = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
  });

  return (
    <div className="px-edge pb-32">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors active:scale-95"
        >
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <h1 className="text-[22px] leading-[28px] font-bold text-primary">
          Call Review
        </h1>
      </div>

      {/* Overall Score */}
      <motion.div {...animProps(0)}>
        <PremiumCard className="p-8 flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-tertiary-fixed-dim/20 flex items-center justify-center mb-3">
            <Star size={28} className="text-tertiary-fixed-dim" />
          </div>
          <p className="text-[11px] leading-[14px] font-semibold text-secondary uppercase tracking-widest mb-1">
            Overall Score
          </p>
          <p className="text-[56px] leading-[64px] font-bold text-primary tracking-tight">
            {evaluation.overallScore}
            <span className="text-[24px] text-secondary font-normal">%</span>
          </p>
          <p className="text-[14px] leading-[20px] text-secondary mt-1 max-w-[280px]">
            {evaluation.scoreLabel}
          </p>
          {reviewData && (
            <p className="text-[12px] leading-[16px] text-secondary/50 mt-3">
              Call duration: {formatDuration(reviewData.duration)}
            </p>
          )}
        </PremiumCard>
      </motion.div>

      {/* Performance Breakdown */}
      <motion.div {...animProps(0.15)}>
        <h2 className="text-[20px] leading-[28px] font-bold text-primary mb-4">
          Performance Breakdown
        </h2>
        <PremiumCard className="p-6 space-y-5 mb-6">
          <ScoreBar label="Communication" value={evaluation.performanceBreakdown.communication} />
          <ScoreBar label="Confidence" value={evaluation.performanceBreakdown.confidence} />
          <ScoreBar label="Empathy" value={evaluation.performanceBreakdown.empathy} />
          <ScoreBar label="Problem Solving" value={evaluation.performanceBreakdown.problemSolving} />
        </PremiumCard>
      </motion.div>

      {/* Coaching Notes */}
      <motion.div {...animProps(0.3)}>
        <h2 className="text-[20px] leading-[28px] font-bold text-primary mb-4">
          AI Coaching Notes
        </h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* What you did well */}
          <PremiumCard className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <ThumbsUp size={16} className="text-green-600" />
              <p className="text-[12px] leading-[16px] font-semibold text-green-700">
                What you did well
              </p>
            </div>
            <p className="text-[13px] leading-[18px] text-secondary">
              {evaluation.coachingNotes.whatYouDidWell}
            </p>
          </PremiumCard>

          {/* Better ways to say it */}
          <PremiumCard className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle size={16} className="text-primary" />
              <p className="text-[12px] leading-[16px] font-semibold text-primary">
                Better ways to say it
              </p>
            </div>
            <p className="text-[13px] leading-[18px] text-secondary italic">
              {evaluation.coachingNotes.betterWaysToSayIt}
            </p>
          </PremiumCard>
        </div>
      </motion.div>

      {/* Next Challenge */}
      <motion.div {...animProps(0.45)}>
        <PremiumCard className="p-6 bg-gradient-to-br from-primary-container to-[#1a1a1a] border-0 mb-6">
          <p className="text-[11px] leading-[14px] font-semibold text-tertiary-fixed-dim uppercase tracking-widest mb-2">
            Next Challenge
          </p>
          <h3 className="text-[20px] leading-[28px] font-bold text-on-primary mb-2">
            {evaluation.nextChallenge.title}
          </h3>
          <p className="text-[14px] leading-[20px] text-on-primary/60 mb-4">
            {evaluation.nextChallenge.description}
          </p>
          <button
            type="button"
            onClick={() => router.push("/practice")}
            className="px-5 py-2.5 bg-white rounded-xl text-primary font-semibold text-[14px] hover:bg-white/90 transition-colors active:scale-95"
          >
            Start Challenge
          </button>
        </PremiumCard>
      </motion.div>

      {/* Bottom Actions */}
      <motion.div {...animProps(0.55)} className="space-y-3">
        <PrimaryButton onClick={() => router.push("/practice")} icon={RefreshCw}>
          Practice Again
        </PrimaryButton>
      </motion.div>
    </div>
  );
}
