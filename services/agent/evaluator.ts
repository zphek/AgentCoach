import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  EVALUATION_SYSTEM_PROMPT,
  EVALUATION_USER_PROMPT,
} from "./evaluation-prompts";
import type { CallEvaluation } from "@/types/evaluation";

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.3, // Lower temp for consistent evaluation
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", EVALUATION_SYSTEM_PROMPT],
  ["human", EVALUATION_USER_PROMPT],
]);

const chain = prompt.pipe(model);

interface EvaluationInput {
  transcript: string;
  issueTitle: string;
  customerName: string;
  personality: string;
  difficulty: string;
}

export async function evaluateCall(
  input: EvaluationInput
): Promise<CallEvaluation> {
  const response = await chain.invoke({
    transcript: input.transcript,
    issueTitle: input.issueTitle,
    customerName: input.customerName,
    personality: input.personality,
    difficulty: input.difficulty,
  });

  const content =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  const cleaned = content
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  const parsed: CallEvaluation = JSON.parse(cleaned);
  return parsed;
}
