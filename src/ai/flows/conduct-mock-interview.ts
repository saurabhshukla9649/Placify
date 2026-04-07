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
    const userMessages = input.history?.filter((msg) => msg.role === 'user') || [];
    
    // Optimized First-Question Bypass (Saves API Quota & Prevents immediate 429s on start)
    if (!input.history || input.history.length === 0) {
      return {
        response: `Welcome! Let's start the interview for the ${input.jobRole} role. Can you tell me a little bit about your background and relevant experience?`,
        isEnd: false
      };
    }

    // If the conversation exceeds 6 messages (3 full turns) from the user, force end it.
    if (userMessages.length >= 6) {
      return {
        response: `Thank you for your time. Your technical responses were evaluated and we have reached the end of this mock interview for the ${input.jobRole} role. We will review your answers and get back to you!`,
        isEnd: true
      };
    }

    const result = await conductMockInterviewFlow(input);
    return result;
  } catch (error: any) {
    console.error("CONDUCT_MOCK_INTERVIEW_ERROR:", error);
    throw new Error(`Interview AI Service Error: ${error.message}`);
  }
}

const prompt = ai.definePrompt({
  name: 'conductMockInterviewPrompt',
  input: { schema: MockInterviewInputSchema },
  output: { schema: MockInterviewOutputSchema },
  prompt: `You are an elite Senior Technical Recruiter conducting a rigorous mock interview for the role of {{{jobRole}}}.

Your objective is to deeply evaluate the candidate's technical competence, problem-solving skills, and clarity. 

Instructions:
1. First Turn: If the conversation history is empty, introduce yourself professionally and ask the candidate an opening technical/behavioral question relevant to the {{{jobRole}}}.
2. Analysis: For every subsequent turn, explicitly dissect the candidate's LAST answer in 1 to 2 detailed sentences. Point out specifically what they explained well, or exactly what technical/architectural nuances they missed. DO NOT use generic phrases like "Good job" or "Great!" - be highly analytical and critical.
3. Next Question: After the short feedback, ask exactly ONE challenging, scenario-based or deep architectural/technical follow-up question related to the {{{jobRole}}}.
4. Conclusion: If the candidate has successfully answered multiple rigorous technical questions and the interview feels complete, set isEnd to true and provide a final comprehensive summary of their performance rather than asking another question.

Conversation history:
{{#if history}}
{{#each history}}
{{role}}: {{{content}}}
{{/each}}
{{else}}
(No history. This is the very first message. Start the interview.)
{{/if}}

{{#if isVoiceUsed}}
The candidate answered using voice input at {{wpm}} words per minute (WPM).
Factor their speaking pace (Normal is 130-150 WPM) into your assessment if they were too fast or excessively slow.
{{/if}}`,
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
