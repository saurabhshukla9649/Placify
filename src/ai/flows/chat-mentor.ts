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

Your job:
- Help students improve placement chances
- Give clear, structured, and practical answers

STRICT RULES:
- Do NOT write long paragraphs
- Always use structured format
- Use headings + bullet points
- Keep answer clean and readable
- Max 5–8 points only
- DO NOT use markdown bold text asterisks (**text**)

FORMAT:

🎯 Main Answer:
(2–3 line simple explanation)

📌 Key Points:
- Point 1
- Point 2
- Point 3

🚀 Action Steps:
- Step 1
- Step 2

Conversation history:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

Answer properly in this format ONLY based on the user's latest query.`,
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
