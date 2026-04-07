'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MentorInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The conversation history between the user and the mentor.'),
});
export type MentorInput = z.infer<typeof MentorInputSchema>;

const MentorOutputSchema = z.object({
  response: z.string().describe("The mentor's response to the user query."),
});
export type MentorOutput = z.infer<typeof MentorOutputSchema>;

export async function chatMentor(input: MentorInput): Promise<MentorOutput> {
  try {
    const result = await chatMentorFlow(input);
    return result;
  } catch (error) {
    console.error("CHAT_MENTOR_ERROR:", error);
    throw error;
  }
}

const prompt = ai.definePrompt({
  name: 'chatMentorPrompt',
  input: { schema: MentorInputSchema },
  output: { schema: MentorOutputSchema },
  prompt: `You are Placify AI Mentor, a professional career coach.

Your job is to provide highly personalized, context-aware career guidance.

STRICT RULES:
1. Memory & Context: You MUST read the entire conversation history. If the user previously mentioned their major, target role, weaknesses, or specific interests, actively synthesize that context into your advice. DO NOT treat each query in isolation.
2. Direct & Professional: Give clear, structured, and practical answers.
3. Keep answers clean and readable. Max 5–8 bullet points total.
4. DO NOT use markdown bold text asterisks (**text**).

FORMAT:

🎯 Main Answer:
(2–3 lines. Synthesize their history into a highly personalized, direct response to their latest query.)

📌 Key Points:
- Point 1 (Tailored to their specific context)
- Point 2
- Point 3

🚀 Action Steps:
- Step 1 (Actionable next step based on their goals)
- Step 2

Conversation history:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

Respond properly in the format above. Remember everything they've told you.`,
});

const chatMentorFlow = ai.defineFlow(
  {
    name: 'chatMentorFlow',
    inputSchema: MentorInputSchema,
    outputSchema: MentorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate mentor response.');
    }
    return output;
  }
);
