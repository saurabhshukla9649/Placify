import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-resume-for-improvement.ts';
import '@/ai/flows/analyze-communication-skills.ts';
import '@/ai/flows/identify-skill-gaps-and-recommend-paths.ts';
import '@/ai/flows/generate-placement-probability-score.ts';
import '@/ai/flows/conduct-mock-interview.ts';
import '@/ai/flows/build-resume.ts';
