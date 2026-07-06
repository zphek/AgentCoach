export interface GeneratedScenario {
  customerName: string;
  issueTitle: string;
  issueDescription: string;
  backgroundContext: string;
  emotionalState: string;
  keyPhrases: string[];
  objectives: string[];
  tips: string[];
  customerOpener: string;
  agentExpectation: string;
}

export interface ScenarioRequest {
  scenario: string;
  personality: string;
  difficulty: string;
  accent: string;
  duration: number;
  language: string;
}
