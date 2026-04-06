'use server';
/**
 * @fileOverview This file implements a Genkit flow for analyzing communication skills from recorded speech.
 *
 * - analyzeCommunicationSkills - A function that handles the communication analysis process.
 * - AnalyzeCommunicationSkillsInput - The input type for the analyzeCommunicationSkills function.
 * - AnalyzeCommunicationSkillsOutput - The return type for the analyzeCommunicationSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCommunicationSkillsInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A recording of the user's speech, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeCommunicationSkillsInput = z.infer<
  typeof AnalyzeCommunicationSkillsInputSchema
>;

const AnalyzeCommunicationSkillsOutputSchema = z.object({
  communicationScore: z
    .number()
    .min(0)
    .max(100)
    .describe('An overall score for communication skills (0-100).'),
  fluencyFeedback: z
    .string()
    .describe('Detailed feedback on the user\u0027s fluency.'),
  confidenceFeedback: z
    .string()
    .describe('Detailed feedback on the user\u0027s confidence.'),
  clarityFeedback: z
    .string()
    .describe('Detailed feedback on the user\u0027s clarity.'),
  overallFeedback: z
    .string()
    .describe('Comprehensive overall feedback and suggestions for improvement.'),
});
export type AnalyzeCommunicationSkillsOutput = z.infer<
  typeof AnalyzeCommunicationSkillsOutputSchema
>;

export async function analyzeCommunicationSkills(
  input: AnalyzeCommunicationSkillsInput
): Promise<AnalyzeCommunicationSkillsOutput> {
  return analyzeCommunicationSkillsFlow(input);
}

const analyzeCommunicationPrompt = ai.definePrompt({
  name: 'analyzeCommunicationPrompt',
  input: {schema: AnalyzeCommunicationSkillsInputSchema},
  output: {schema: AnalyzeCommunicationSkillsOutputSchema},
  prompt: `You are an AI communication coach specializing in helping students improve their verbal skills for interviews.

Your task is to analyze the provided audio recording of a student's speech and evaluate the following aspects:
- Fluency: How smoothly and effortlessly the student speaks, including pace, pauses, and filler words.
- Confidence: The student's vocal projection, tone, and delivery that convey self-assurance.
- Clarity: How clear and understandable the student's articulation and pronunciation are.

Based on your analysis, provide a communication score out of 100. Then, offer detailed, constructive feedback for each of the three aspects (fluency, confidence, clarity) and a comprehensive overall feedback summary with actionable suggestions for improvement.

CRITICAL INSTRUCTION:
Listen carefully to the audio. You must reliably differentiate between a normal conversational speaking voice and a musical singing voice. If the user is singing, aggressively utilizing a musical tone, or performing instead of giving a professional verbal speech, you MUST:
1. Give a very low communication score (under 30).
2. In the overallFeedback, explicitly and prominently tell the user that they appear to be singing rather than speaking normally. Remind them that this tracking system only evaluates spoken interview communication.
3. Your fluency and clarity feedback should reflect that the cadence and pronunciation were musical rather than professional speech.

Audio for analysis: {{media url=audioDataUri}}`,
});

const analyzeCommunicationSkillsFlow = ai.defineFlow(
  {
    name: 'analyzeCommunicationSkillsFlow',
    inputSchema: AnalyzeCommunicationSkillsInputSchema,
    outputSchema: AnalyzeCommunicationSkillsOutputSchema,
  },
  async input => {
    // Check if API key is present for actual AI analysis
    const hasApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!hasApiKey) {
      console.warn("No Gemini API Key found. Returning mock communication analysis data for UI testing.");
      // Small simulation delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return {
        communicationScore: 85,
        fluencyFeedback: "Your fluency is quite good. You maintained a steady pace throughout the recording, with minimal use of filler words.",
        confidenceFeedback: "You spoke with a clear and confident tone. Your voice projection was excellent and conveyed strong self-assurance.",
        clarityFeedback: "Your articulation was very clear and pronunciation was highly understandable. No significant mumbling was detected.",
        overallFeedback: "Great job on your elevator pitch! You communicated your professional background effectively. Try to incorporate slightly more varied vocal inflection to sound even more engaging."
      };
    }

    try {
      const {output} = await analyzeCommunicationPrompt(input);
      if (!output) {
        throw new Error('AI failed to generate analysis output.');
      }
      return output;
    } catch (e: any) {
      console.error('Genkit Error in analyzeCommunicationSkillsFlow:', e);
      throw new Error(`Analysis Error: ${e.message || 'Could not process your recording.'}`);
    }
  }
);
