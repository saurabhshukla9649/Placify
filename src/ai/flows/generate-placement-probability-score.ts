'use server';
/**
 * @fileOverview A Genkit flow that calculates a student's placement probability score.
 *
 * - generatePlacementProbabilityScore - A function that handles the placement probability score generation.
 * - GeneratePlacementProbabilityScoreInput - The input type for the generatePlacementProbabilityScore function.
 * - GeneratePlacementProbabilityScoreOutput - The return type for the generatePlacementProbabilityScore function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePlacementProbabilityScoreInputSchema = z.object({
  resumeText: z.string().describe('The extracted text content of the student\'s resume.'),
  cgpa: z.number().min(0).max(10).describe('The student\'s current CGPA (Cumulative Grade Point Average) on a 10-point scale.'),
  certifications: z.array(z.string()).describe('A list of certifications obtained by the student.'),
  jobRoleDemandDescription: z.string().optional().describe('An optional textual description of current job market demand for specific skills or roles relevant to the student\'s profile. If not provided, the AI will use its general knowledge.'),
});
export type GeneratePlacementProbabilityScoreInput = z.infer<typeof GeneratePlacementProbabilityScoreInputSchema>;

const GeneratePlacementProbabilityScoreOutputSchema = z.object({
  placementProbabilityScore: z.number().min(0).max(100).describe('A placement probability score (0-100%) indicating the student\'s likelihood of securing a placement.'),
  feedback: z.string().describe('Detailed feedback and suggestions to improve the placement chances, based on resume quality, skills demand, CGPA, and certifications.'),
});
export type GeneratePlacementProbabilityScoreOutput = z.infer<typeof GeneratePlacementProbabilityScoreOutputSchema>;

export async function generatePlacementProbabilityScore(
  input: GeneratePlacementProbabilityScoreInput
):
  Promise<GeneratePlacementProbabilityScoreOutput> {
  return generatePlacementProbabilityScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'placementProbabilityScorePrompt',
  input: { schema: GeneratePlacementProbabilityScoreInputSchema },
  output: { schema: GeneratePlacementProbabilityScoreOutputSchema },
  prompt: `You are an expert career counselor and placement probability predictor. Your task is to analyze a student's profile and provide a "Placement Probability Score" (0-100%) and detailed feedback.\n\nConsider the following factors in your assessment:\n1.  **Resume Quality**: Evaluate the skills, projects, and experience mentioned in the resume. Assume a good resume structure and ATS compatibility for the text provided.\n2.  **Skills Demand**: Assess the demand for the skills identified in the resume within the current job market. If a 'jobRoleDemandDescription' is provided, use that context; otherwise, rely on your general knowledge of high-demand skills.\n3.  **CGPA**: The academic performance indicated by the CGPA.\n4.  **Certifications**: The relevance and value of the listed certifications.\n\nBased on these factors, generate a single numerical score between 0 and 100, where 0 is very low probability and 100 is very high probability. Also, provide comprehensive feedback and actionable suggestions for improvement across all areas (resume, skills, academics, certifications) to enhance their placement chances.\n\nStudent Profile:\nResume Text: {{{resumeText}}}\nCGPA: {{{cgpa}}}\nCertifications: {{#each certifications}}- {{{this}}}\n{{/each}}\n{{#if jobRoleDemandDescription}}\nJob Role Demand Context: {{{jobRoleDemandDescription}}}\n{{/if}}\n`,
});

const generatePlacementProbabilityScoreFlow = ai.defineFlow(
  {
    name: 'generatePlacementProbabilityScoreFlow',
    inputSchema: GeneratePlacementProbabilityScoreInputSchema,
    outputSchema: GeneratePlacementProbabilityScoreOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate placement probability score.');
    }
    return output;
  }
);
