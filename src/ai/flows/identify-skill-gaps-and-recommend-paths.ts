'use server';
/**
 * @fileOverview A Genkit flow for identifying skill gaps and recommending learning paths based on user skills and a target job role.
 *
 * - identifySkillGapsAndRecommendPaths - A function that handles the skill gap analysis and learning path recommendation process.
 * - IdentifySkillGapsAndRecommendPathsInput - The input type for the identifySkillGapsAndRecommendPaths function.
 * - IdentifySkillGapsAndRecommendPathsOutput - The return type for the identifySkillGapsAndRecommendPaths function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifySkillGapsAndRecommendPathsInputSchema = z.object({
  userSkills: z
    .array(z.string())
    .describe('A list of skills extracted from the user\'s resume.'),
  jobRole: z.string().describe('The target job role for which to identify skill gaps and recommend learning paths.'),
});
export type IdentifySkillGapsAndRecommendPathsInput = z.infer<
  typeof IdentifySkillGapsAndRecommendPathsInputSchema
>;

const RecommendedResourceSchema = z.object({
  type: z.string().describe('The type of resource, e.g., "Course", "Book", "Tutorial", "Project".'),
  name: z.string().describe('The name of the resource.'),
  link: z.string().url().optional().describe('An optional URL to the resource.'),
});

const LearningPathSchema = z.object({
  skill: z.string().describe('The skill to be learned.'),
  importance: z.string().describe('A brief explanation of why this skill is important for the job role.'),
  resources: z
    .array(RecommendedResourceSchema)
    .describe('A list of recommended resources to learn this skill.'),
});

const IdentifySkillGapsAndRecommendPathsOutputSchema = z.object({
  skillGaps: z
    .array(z.string())
    .describe('A list of essential skills required for the job role that the user is currently missing.'),
  recommendedLearningPaths: z
    .array(LearningPathSchema)
    .describe('A structured list of learning paths for each identified skill gap.'),
});
export type IdentifySkillGapsAndRecommendPathsOutput = z.infer<
  typeof IdentifySkillGapsAndRecommendPathsOutputSchema
>;

function generateHeuristicSkillGaps(role: string, currentSkills: string[]): IdentifySkillGapsAndRecommendPathsOutput {
    const normalizedRole = role.toLowerCase();
    let essentialSkills = ["Communication", "Problem Solving", "Git"];
    
    if (normalizedRole.includes("ai") || normalizedRole.includes("machine") || normalizedRole.includes("data")) {
        essentialSkills = ["Python", "TensorFlow", "PyTorch", "SQL", "Mathematics", "Machine Learning"];
    } else if (normalizedRole.includes("front") || normalizedRole.includes("web") || normalizedRole.includes("ui") || normalizedRole.includes("react")) {
        essentialSkills = ["JavaScript", "TypeScript", "React", "CSS", "HTML", "Accessibility"];
    } else if (normalizedRole.includes("back") || normalizedRole.includes("api") || normalizedRole.includes("node")) {
        essentialSkills = ["Node.js", "Python", "Java", "SQL", "Docker", "AWS"];
    } else if (normalizedRole.includes("product") || normalizedRole.includes("manager")) {
        essentialSkills = ["Agile", "Jira", "Product Strategy", "User Research", "Data Analysis"];
    } else if (normalizedRole.includes("design") || normalizedRole.includes("ux")) {
        essentialSkills = ["Figma", "User Research", "Prototyping", "UI Design"];
    }

    const currentNormalized = currentSkills.map(s => s.toLowerCase());
    const missing = essentialSkills.filter(s => !currentNormalized.some(c => c.includes(s.toLowerCase()) || s.toLowerCase().includes(c)));

    if (missing.length === 0) {
        missing.push("System Architecture", "Leadership");
    }

    const paths = missing.map(skill => {
        let type = "Course";
        if (skill === "Mathematics" || skill === "Leadership") type = "Book";
        if (skill === "React" || skill === "Docker") type = "Tutorial";

        return {
            skill: skill,
            importance: `Essential core competency required for modern ${role} roles.`,
            resources: [
                { type, name: `Mastering ${skill}`, link: `https://example.com/learn` },
                { type: "Project", name: `Build a ${skill} application`, link: "" }
            ]
        };
    });

    return {
        skillGaps: missing,
        recommendedLearningPaths: paths
    };
}

export async function identifySkillGapsAndRecommendPaths(
  input: IdentifySkillGapsAndRecommendPathsInput
): Promise<IdentifySkillGapsAndRecommendPathsOutput | { error: string }> {
  try {
    return await identifySkillGapsAndRecommendPathsFlow(input);
  } catch (e: any) {
    const errMsg = e.message || String(e);
    if (errMsg.includes('403') || errMsg.includes('429') || errMsg.includes('leaked') || errMsg.includes('Quota') || errMsg.includes('Too Many Requests') || errMsg.includes('configured')) {
        console.warn("AI API unavailable. Falling back to heuristic learning path generator...");
        return generateHeuristicSkillGaps(input.jobRole, input.userSkills);
    }
    return { error: `Analysis processing failed: ${errMsg}` };
  }
}

const prompt = ai.definePrompt({
  name: 'identifySkillGapsAndRecommendPathsPrompt',
  input: { schema: IdentifySkillGapsAndRecommendPathsInputSchema },
  output: { schema: IdentifySkillGapsAndRecommendPathsOutputSchema },
  prompt: `You are a highly experienced career counselor specializing in technical roles. Your task is to analyze a student's current skill set against the requirements of a specific target job role.\n\nBased on the provided information, perform the following steps:\n1.  **Identify Skill Gaps**: Determine which essential skills for the specified job role are missing from the student's current skill set.\n2.  **Recommend Learning Paths**: For each identified skill gap, provide a concrete learning path. Each learning path should include:\n    -   The specific skill to learn.\n    -   A brief explanation of its importance for the target job role.\n    -   At least 2-3 specific, actionable resources (e.g., names of popular online courses, books, or types of projects) to acquire that skill. If possible, provide links to these resources. If no direct link is available, suggest a common platform or type of resource.\n\nStudent's Current Skills:\n{{{userSkills}}}\n\nTarget Job Role:\n{{{jobRole}}}\n\nEnsure your output strictly adheres to the JSON schema provided in the output section.`,
});

const identifySkillGapsAndRecommendPathsFlow = ai.defineFlow(
  {
    name: 'identifySkillGapsAndRecommendPathsFlow',
    inputSchema: IdentifySkillGapsAndRecommendPathsInputSchema,
    outputSchema: IdentifySkillGapsAndRecommendPathsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate skill gap analysis and recommendations.');
    }
    return output;
  }
);
