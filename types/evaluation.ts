export interface PerformanceBreakdown {
  communication: number;
  confidence: number;
  empathy: number;
  problemSolving: number;
}

export interface CoachingNote {
  whatYouDidWell: string;
  betterWaysToSayIt: string;
}

export interface CallEvaluation {
  overallScore: number;
  scoreLabel: string;
  performanceBreakdown: PerformanceBreakdown;
  coachingNotes: CoachingNote;
  nextChallenge: {
    title: string;
    description: string;
  };
}
