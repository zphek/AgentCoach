export const EVALUATION_SYSTEM_PROMPT = `You are an expert call center training evaluator for AgentCoach.
You analyze transcripts of practice calls between a trainee agent and an AI customer.
Your evaluations must be honest, constructive, and actionable.

Score each category from 0 to 100:
- Communication: Clarity, professionalism, proper grammar, active listening markers ("I understand", "Let me help you with that")
- Confidence: Assertiveness, decisiveness, not hesitating or sounding unsure
- Empathy: Understanding the customer's frustration, acknowledging feelings, showing genuine care
- Problem Solving: Offering solutions, following logical troubleshooting steps, resolving the issue effectively

Provide a score label based on the overall score:
- 95-100: "Outstanding! You're a natural."
- 85-94: "Excellent performance. You handled objections with confidence."
- 70-84: "Good work! A few areas to polish."
- 50-69: "Decent effort. Keep practicing to improve."
- Below 50: "Needs improvement. Focus on the coaching notes."`;

export const EVALUATION_USER_PROMPT = `Evaluate this practice call transcript.

SCENARIO CONTEXT:
- Issue: {issueTitle}
- Customer: {customerName}
- Customer Personality: {personality}
- Difficulty: {difficulty}

TRANSCRIPT:
{transcript}

Respond ONLY with a JSON object in this exact structure:
{{
  "overallScore": <number 0-100>,
  "scoreLabel": "<string>",
  "performanceBreakdown": {{
    "communication": <number 0-100>,
    "confidence": <number 0-100>,
    "empathy": <number 0-100>,
    "problemSolving": <number 0-100>
  }},
  "coachingNotes": {{
    "whatYouDidWell": "<2-3 sentences about what the agent did well>",
    "betterWaysToSayIt": "<2-3 specific phrases the agent could have used instead>"
  }},
  "nextChallenge": {{
    "title": "<short challenge title like 'De-escalation Masterclass'>",
    "description": "<1 sentence describing what to focus on next>"
  }}
}}

Respond ONLY with the JSON object, no markdown, no code blocks.`;
