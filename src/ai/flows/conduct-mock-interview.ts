'use server';
/**
 * @fileOverview A mock interview AI agent that simulates a recruiter.
 *
 * - conductMockInterview - A function that handles the interview conversation turns.
 * - MockInterviewInput - The input type for the conductMockInterview function.
 * - MockInterviewOutput - The return type for the conductMockInterview function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MockInterviewInputSchema = z.object({
  jobRole: z.string().describe('The job role the student is interviewing for.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The conversation history.'),
  wpm: z.number().optional().describe('Words per minute spoken by the user in their last answer, for communication evaluation.'),
  isVoiceUsed: z.boolean().optional().describe('Whether the user used voice input for the last answer.'),
});
export type MockInterviewInput = z.infer<typeof MockInterviewInputSchema>;

const MockInterviewOutputSchema = z.object({
  response: z.string().describe('The interviewer\'s next question or response.'),
  isEnd: z.boolean().describe('Whether the interview has concluded.'),
});
export type MockInterviewOutput = z.infer<typeof MockInterviewOutputSchema>;

export async function conductMockInterview(input: MockInterviewInput): Promise<MockInterviewOutput> {
  try {
    const result = await conductMockInterviewFlow(input);
    return result;
  } catch (error) {
    console.error("CONDUCT_MOCK_INTERVIEW_ERROR:", error);
    throw error;
  }
}

const prompt = ai.definePrompt({
  name: 'conductMockInterviewPrompt',
  input: { schema: MockInterviewInputSchema },
  output: { schema: MockInterviewOutputSchema },
  prompt: `You are an expert technical recruiter conducting a mock interview for the role of {{{jobRole}}}.

The frontend UI already provides conversational transitions and encouragement based on their emotion.
Your ONLY job is to provide specific, professional TECHNICAL feedback (1-2 sentences max) on their previous response (if any), and then ask exactly one relevant follow-up question. 
DO NOT use conversational transitions like "Great," "Moving on," or "Next question." Just provide the technical assessment and ask the question directly.

Conversation history:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

{{#if isVoiceUsed}}
The candidate answered using voice input at {{wpm}} words per minute (WPM).
Add a brief comment on their communication pace (Normal is 130-150 WPM) to your feedback.
{{/if}}

If the interview has reached a natural conclusion (typically after 5-6 questions), set isEnd to true and provide a final summary of their performance without asking another question.`,
});

const conductMockInterviewFlow = ai.defineFlow(
  {
    name: 'conductMockInterviewFlow',
    inputSchema: MockInterviewInputSchema,
    outputSchema: MockInterviewOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate interview response.');
    }
    return output;
  }
);
