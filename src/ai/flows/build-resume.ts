'use server';
/**
 * @fileOverview A Genkit flow that generates a professional resume based on user-provided details.
 *
 * - generateProfessionalResume - A function that handles the resume generation process.
 * - BuildResumeInput - The input type for the resume generation.
 * - BuildResumeOutput - The return type containing the generated resume text.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExperienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  duration: z.string(),
  description: z.string(),
});

const EducationSchema = z.object({
  institution: z.string(),
  degree: z.string(),
  year: z.string(),
});

const BuildResumeInputSchema = z.object({
  fullName: z.string().describe('The full name of the user.'),
  email: z.string().email().describe('The email address of the user.'),
  summary: z.string().describe('A brief professional summary or objective.'),
  skills: z.array(z.string()).describe('A list of technical and soft skills.'),
  experience: z.array(ExperienceSchema).describe('Work experience history.'),
  education: z.array(EducationSchema).describe('Educational background.'),
});
export type BuildResumeInput = z.infer<typeof BuildResumeInputSchema>;

const BuildResumeOutputSchema = z.object({
  resumeMarkdown: z.string().describe('The generated professional resume in Markdown format.'),
  resumeText: z.string().describe('The generated professional resume in plain text format for easy copying.'),
});
export type BuildResumeOutput = z.infer<typeof BuildResumeOutputSchema>;

export async function generateProfessionalResume(input: BuildResumeInput): Promise<BuildResumeOutput> {
  return buildResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'buildResumePrompt',
  input: { schema: BuildResumeInputSchema },
  output: { schema: BuildResumeOutputSchema },
  prompt: `You are an expert professional resume writer. Your goal is to create a high-impact, ATS-optimized resume based on the following student details.

### User Information
- Name: {{{fullName}}}
- Email: {{{email}}}
- Summary: {{{summary}}}

### Skills
{{#each skills}}
- {{{this}}}
{{/each}}

### Experience
{{#each experience}}
- Role: {{{role}}} at {{{company}}} ({{{duration}}})
  Description: {{{description}}}
{{/each}}

### Education
{{#each education}}
- {{{degree}}} from {{{institution}}} ({{{year}}})
{{/each}}

Instructions:
1. Use professional, action-oriented language (e.g., "Spearheaded", "Optimized", "Developed").
2. Ensure the structure is clean and logical.
3. In the markdown version, use appropriate headings and bullet points.
4. In the plain text version, ensure it is easy to copy and paste into an ATS system.
5. Highlight the skills naturally within the experience descriptions if possible.`,
});

const buildResumeFlow = ai.defineFlow(
  {
    name: 'buildResumeFlow',
    inputSchema: BuildResumeInputSchema,
    outputSchema: BuildResumeOutputSchema,
  },
  async (input) => {
    // Check if API key is present for actual AI generation
    const hasApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!hasApiKey) {
      console.warn("No Gemini API Key found. Returning mock generated resume data for UI testing.");
      // Small simulation delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return {
        resumeMarkdown: `# ${input.fullName || 'John Doe'}\n\n**Email**: ${input.email || 'john@example.com'}\n\n## Professional Summary\n${input.summary || 'An experienced developer looking for new opportunities.'}\n\n## Skills\n${input.skills?.map(s => `- ${s}`).join('\\n') || '- React\\n- Node.js'}\n\n## Experience\n*Mocked Experience Section*\n\n## Education\n*Mocked Education Section*`,
        resumeText: `${input.fullName || 'JOHN DOE'}\n${input.email || 'john@example.com'}\n\nSUMMARY\n${input.summary || 'Passionate and results-driven professional.'}\n\nSKILLS\n${input.skills?.join(', ') || 'React, TypeScript, Node.js'}\n\nEXPERIENCE\n1. Software Engineer at Tech Corp\n- Engineered a high-throughput backend system utilizing Node.js, increasing processing speed by 40%.\n- Spearheaded the complete UI overhaul utilizing React and TailwindCSS.\n\nEDUCATION\nBachelor of Science in Computer Science, University of Technology\n\n(Note: This is a mock response because no Gemini API key was provided.)`
      };
    }

    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate resume.');
    }
    return output;
  }
);
