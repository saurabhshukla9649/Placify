import { AnalyzeResumeForImprovementOutput } from '@/ai/flows/analyze-resume-for-improvement';
import { AnalyzeCommunicationSkillsOutput } from '@/ai/flows/analyze-communication-skills';
import { IdentifySkillGapsAndRecommendPathsOutput } from '@/ai/flows/identify-skill-gaps-and-recommend-paths';
import { GeneratePlacementProbabilityScoreOutput } from '@/ai/flows/generate-placement-probability-score';

export interface UserProfile {
  resumeText: string;
  cgpa: number;
  certifications: string[];
  targetRole: string;
}

export interface PlacifyData {
  resumeAnalysis?: AnalyzeResumeForImprovementOutput;
  communicationAnalysis?: AnalyzeCommunicationSkillsOutput;
  skillGapAnalysis?: IdentifySkillGapsAndRecommendPathsOutput;
  placementScore?: GeneratePlacementProbabilityScoreOutput;
}