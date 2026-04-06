
'use server';
/**
 * @fileOverview An AI agent that analyzes a resume for ATS compatibility, scores it, identifies issues, and suggests improvements.
 *
 * - analyzeResumeForImprovement - A function that handles the resume analysis process.
 * - AnalyzeResumeForImprovementInput - The input type for the resume analysis.
 * - AnalyzeResumeForImprovementOutput - The return type for the resume analysis.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeResumeForImprovementInputSchema = z.object({
  resumeText: z.string().describe('The extracted text content of the user\'s resume.'),
});
export type AnalyzeResumeForImprovementInput = z.infer<typeof AnalyzeResumeForImprovementInputSchema>;

const AnalyzeResumeForImprovementOutputSchema = z.object({
  atsScore: z.number().min(0).max(100).describe('An ATS compatibility score from 0 to 100.'),
  confidenceLevel: z.enum(["Low", "Medium", "High"]).describe("Confidence level of this parsing operation based on resume readability and completeness."),
  missingKeywords: z.array(z.string()).describe('A list of keywords that are commonly expected for the user\'s implied career path but are missing from the resume.'),
  formattingIssues: z.array(z.string()).describe('A list of formatting issues found in the resume that might hinder ATS parsing.'),
  suggestions: z.array(z.string()).describe('A list of specific suggestions with examples to improve the resume\'s ATS compatibility and overall quality.'),
});
export type AnalyzeResumeForImprovementOutput = z.infer<typeof AnalyzeResumeForImprovementOutputSchema>;

export async function analyzeResumeForImprovement(input: AnalyzeResumeForImprovementInput): Promise<AnalyzeResumeForImprovementOutput> {
  return analyzeResumeForImprovementFlow(input);
}

const analyzeResumePrompt = ai.definePrompt({
  name: 'analyzeResumePrompt',
  input: { schema: AnalyzeResumeForImprovementInputSchema },
  output: { schema: AnalyzeResumeForImprovementOutputSchema },
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_CIVIC_INTEGRITY',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
  prompt: `You are an expert resume analyst specializing in Applicant Tracking System (ATS) compatibility.
Your task is to analyze the provided resume text for its ATS compatibility, identify areas for improvement, and provide actionable feedback.

Analyze the following resume text:
Resume Text: """{{resumeText}}"""

CRITICAL INSTRUCTION: You MUST calculate a completely fresh and unique ATS score based solely on the extracted resume text above. Do NOT use fake fallback data. Evaluate the resume's exact use of action verbs, numerical metrics, industry keyword density, and structural clarity.

Based on your rigorous dynamic analysis, provide:
1. An ATS compatibility score from 0 to 100.
2. Your confidence level ("Low", "Medium", "High") indicating how well the text could be parsed.
3. A list of missing keywords relevant to typical job roles a candidate with this resume might apply for.
4. A list of specific formatting issues that could negatively impact ATS parsing.
5. Detailed suggestions with clear examples to improve the resume for better ATS compatibility.

Ensure the output is strictly valid JSON matching the specified schema.`,
});

const analyzeResumeForImprovementFlow = ai.defineFlow(
  {
    name: 'analyzeResumeForImprovementFlow',
    inputSchema: AnalyzeResumeForImprovementInputSchema,
    outputSchema: AnalyzeResumeForImprovementOutputSchema,
  },
  async (input) => {
    if (!input.resumeText || input.resumeText.trim().length === 0) {
      console.error("Resume analysis failed: Empty text provided.");
      throw new Error('Resume text is empty. Please provide valid text content.');
    }
    
    console.log(`[Resume Analyzer] Starting analysis. Input length: ${input.resumeText.length} characters.`);
    
    const hasApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!hasApiKey) {
      console.error("[Resume Analyzer] FATAL: API key not configured in environment variables.");
      throw new Error('API key not configured. Please add GOOGLE_GENAI_API_KEY to your .env file and restart your terminal.');
    }

    // Truncate resume text if it's excessively long to avoid prompt limits
    const cleanedText = input.resumeText.slice(0, 10000);
    
    try {
      console.log(`[Resume Analyzer] Requesting AI scoring from Gemini...`);
      const { output } = await analyzeResumePrompt({ resumeText: cleanedText });
      
      if (!output) {
        console.error("[Resume Analyzer] AI returned null or empty output.");
        throw new Error('AI failed to generate analysis output. Please try again.');
      }
      
      console.log(`[Resume Analyzer] Success! AI output generated with confidence: ${output.confidenceLevel}`);
      return output;
    } catch (e: any) {
      console.error('[Resume Analyzer] Genkit Execution Error:', e);
      throw new Error(`AI processing failed: ${e.message || 'Unknown backend error occurred.'}`);
    }
  }
);
