import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  SCENARIO_GENERATOR_SYSTEM_PROMPT,
  SCENARIO_GENERATOR_USER_PROMPT,
} from "./prompts";
import type { GeneratedScenario, ScenarioRequest } from "@/types/scenario";

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.9, // High temperature for variety
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", SCENARIO_GENERATOR_SYSTEM_PROMPT],
  ["human", SCENARIO_GENERATOR_USER_PROMPT],
]);

const chain = prompt.pipe(model);

export async function generateScenario(
  config: ScenarioRequest
): Promise<GeneratedScenario> {
  const response = await chain.invoke({
    scenario: config.scenario,
    personality: config.personality,
    difficulty: config.difficulty,
    accent: config.accent,
    duration: config.duration.toString(),
    language: config.language || "en",
  });

  // Extract the text content from the response
  const content =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  // Parse JSON, stripping any markdown code blocks if present
  const cleaned = content
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  const parsed: GeneratedScenario = JSON.parse(cleaned);

  return parsed;
}
