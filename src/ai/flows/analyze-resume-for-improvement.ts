
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

function generateHeuristicAnalysis(text: string): AnalyzeResumeForImprovementOutput {
  const lowerText = text.toLowerCase();
  let score = 40; // Base score
  const missingKeywords: string[] = [];
  const formattingIssues: string[] = [];
  const suggestions: string[] = [];

  if (text.length > 500) score += 10;
  if (text.length > 1500) score += 10;

  const techKeywords = ['leadership', 'management', 'javascript', 'typescript', 'react', 'node', 'sql', 'python', 'project', 'agile', 'api', 'data'];
  const foundKeywords = techKeywords.filter(kw => lowerText.includes(kw));
  missingKeywords.push(...techKeywords.filter(kw => !lowerText.includes(kw)).slice(0, 4));

  if (foundKeywords.length > 2) score += 10;
  if (foundKeywords.length > 5) score += 15;

  const actionVerbs = ['developed', 'managed', 'led', 'designed', 'created', 'implemented', 'optimized', 'improved', 'achieved'];
  const verbsFound = actionVerbs.filter(verb => lowerText.includes(verb));
  
  if (verbsFound.length >= 3) {
    score += 15;
  } else {
    formattingIssues.push("Lacks strong action verbs (e.g., 'developed', 'led', 'optimized').");
    suggestions.push("Begin bullet points with strong action verbs to emphasize impact and achievements.");
  }

  if (!lowerText.includes('education') && !lowerText.includes('university') && !lowerText.includes('degree')) {
    formattingIssues.push("Could not clearly identify an 'Education' or 'Academic' section.");
  }
  
  if (!lowerText.includes('experience') && !lowerText.includes('employment') && !lowerText.includes('work')) {
    formattingIssues.push("Could not clearly identify a 'Work Experience' section.");
  }

  if (formattingIssues.length === 0) {
    score += 10;
    suggestions.push("Your resume structure looks solid. Ensure you consistently tailor the action verbs for the target job description.");
  }
  
  if (suggestions.length === 0) {
    suggestions.push("Consider removing older irrelevant experience to keep the resume concise.");
    suggestions.push("Ensure contact information (email, phone, LinkedIn) is highly visible at the top.");
  }

  return {
    atsScore: Math.min(99, Math.max(15, score)),
    confidenceLevel: text.length > 800 ? "Medium" : "Low",
    missingKeywords,
    formattingIssues,
    suggestions
  };
}

export async function analyzeResumeForImprovement(
  input: AnalyzeResumeForImprovementInput
): Promise<AnalyzeResumeForImprovementOutput | { error: string }> {
  try {
    return await analyzeResumeForImprovementFlow(input);
  } catch (e: any) {
    console.error('Intercepted error in server action:', e);
    const errMsg = e.message || String(e);
    
    // Fallback to local heuristic analyzer if API is revoked, leaked, or rate-limited
    if (errMsg.includes('403') || errMsg.includes('429') || errMsg.includes('leaked') || errMsg.includes('API key not configured') || errMsg.includes('Quota')) {
        console.warn("AI API unavailable or key leaked. Falling back to heuristic robust text parser...");
        return generateHeuristicAnalysis(input.resumeText);
    }
    
    return { error: `Analysis failed: ${errMsg}` };
  }
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
    
    const hasApiKey = process.env.OPENAI_API_KEY;

    if (!hasApiKey) {
      console.warn("No OpenAI API Key found. Returning mock analysis data for UI testing.");
      // Small simulation delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return {
        atsScore: 50,
        confidenceLevel: "Medium" as const,
        missingKeywords: ["leadership", "management"],
        formattingIssues: ["Missing measurable achievements", "Formatting is inconsistent"],
        suggestions: ["Quantify your experience (e.g., 'increased sales by 20%')", "Use strong action verbs like 'Spearheaded' or 'Engineered'"],
      };
    }

    // Truncate resume text if it's excessively long to avoid prompt limits
    const cleanedText = input.resumeText.slice(0, 10000);
    
    try {
      console.log(`[Resume Analyzer] Requesting AI scoring from OpenAI...`);
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
