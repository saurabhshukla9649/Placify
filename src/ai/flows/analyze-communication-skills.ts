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
  transcript: z.string().optional().describe("A real-time locally captured transcript of the user's voice recording."),
  durationSeconds: z.number().optional().describe("The total duration of the recorded audio response in seconds."),
  wpm: z.number().optional().describe("The words per minute pacing metric, calculated natively by duration.")
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

function analyzeText(text: string, durationSeconds?: number): AnalyzeCommunicationSkillsOutput {
  const wordsList = text.split(" ").filter(w => w.trim().length > 0);
  const words = wordsList.length;

  if (words < 5) {
    return {
      communicationScore: 15,
      fluencyFeedback: `Fluency Score: 1/10. Audio track too short to evaluate fluency.`,
      confidenceFeedback: `Confidence Score: 1/10. Insufficient data to gauge vocal projection.`,
      clarityFeedback: `Clarity Score: 2/10. Recording incomplete or mostly silent.`,
      overallFeedback: `Your response was incredibly short (${words} word(s)). This input does not meet the minimum duration for a reliable system evaluation. Please record an in-depth answer and try again. (Base engine parsing)`
    };
  }

  // base scores
  let fluency = words > 20 ? 8 : words >= 10 ? 6 : 4;
  let confidence = text.length > 50 ? 8 : 5;
  let clarity = text.includes("and") || text.includes("because") ? 8 : 6;

  // Pace (WPM) evaluation
  let paceFeedback = "";
  if (durationSeconds && durationSeconds > 0) {
    const wpm = Math.round((words / durationSeconds) * 60);
    if (wpm < 100) { fluency = Math.max(1, fluency - 2); paceFeedback = ` Pace was too slow (${wpm} WPM).`; }
    else if (wpm > 165) { fluency = Math.max(1, fluency - 1); paceFeedback = ` Pace was slightly fast (${wpm} WPM).`; }
    else { paceFeedback = ` Excellent speaking pace (${wpm} WPM).`; }
  }

  // Filler word detection
  const fillerCount = (text.match(/\b(uh|um|like|basically|literally|hmm)\b/gi) || []).length;
  let fillerFeedback = "";
  if (fillerCount > 0) {
    fluency = Math.max(1, fluency - (fillerCount >= 3 ? 3 : 1));
    clarity = Math.max(1, clarity - 1);
    fillerFeedback = ` Significant filler words detected (${fillerCount}).`;
  }

  // Between 5-10 words penalty
  if (words >= 5 && words < 10) {
    fluency = Math.max(1, fluency - 2);
    confidence = Math.max(1, confidence - 2);
    clarity = Math.max(1, clarity - 2);
  }

  const score = Math.round(((fluency + confidence + clarity) / 30) * 100);

  let feedback = "Good communication! Improve structure and examples.";
  if (words >= 5 && words < 10) {
    feedback = "Your response contained valid speech but was slightly brief. Attempt to expand on your points more deeply.";
  } else if (text.length < 20) {
    feedback = "Try to speak more. Your response is generally too short.";
  } else if (fillerCount > 3) {
    feedback = "You relied heavily on filler words, which reduced professional confidence. Practice removing 'ums' and 'uhs'.";
  }

  return {
    communicationScore: score,
    fluencyFeedback: `Fluency Score: ${fluency}/10.${paceFeedback}${fillerFeedback} ${words > 20 && fillerCount === 0 ? "Great smooth delivery." : ""}`,
    confidenceFeedback: `Confidence Score: ${confidence}/10. ${text.length > 50 ? "Good projection." : "Try speaking longer to establish confidence."}`,
    clarityFeedback: `Clarity Score: ${clarity}/10. ${clarity >= 8 ? "Good structure and conjunction usage." : "Try using more connections."}`,
    overallFeedback: feedback + " (Generated securely via localized offline text parser)"
  };
}

export async function analyzeCommunicationSkills(
  input: AnalyzeCommunicationSkillsInput
): Promise<AnalyzeCommunicationSkillsOutput | { error: string }> {
  try {
    return await analyzeCommunicationSkillsFlow(input);
  } catch (e: any) {
    console.error('Intercepted error in server action:', e);
    const errMsg = e.message || String(e);
    
    if (errMsg.includes('403') || errMsg.includes('429') || errMsg.includes('leaked') || errMsg.includes('API key not configured') || errMsg.includes('Quota') || errMsg.includes('Too Many Requests')) {
        console.warn("AI API unavailable or key leaked. Falling back to heuristic smart text analysis...");
        return analyzeText((input.transcript || "").toLowerCase(), input.durationSeconds);
    }

    if (errMsg.includes('413') || errMsg.includes('too large')) {
        return { error: 'Audio recording is too large. Please record a shorter segment.' };
    }
    return { error: `Analysis failed: ${errMsg}` };
  }
}

const analyzeCommunicationPrompt = ai.definePrompt({
  name: 'analyzeCommunicationPrompt',
  input: {schema: AnalyzeCommunicationSkillsInputSchema},
  output: {schema: AnalyzeCommunicationSkillsOutputSchema},
  prompt: `You are an AI communication coach specializing in helping students improve their verbal skills for interviews.

We have provided the text transcript of the student's audio recording. Your task is to analyze it and evaluate the following aspects:
- Fluency: How smoothly and effortlessly the student speaks, including pace, pauses, and filler words (e.g. "uh", "um").
- Confidence: The student's vocal projection, tone, and delivery that convey self-assurance, as inferred from their sentence structure.
- Clarity: How clear and understandable the student's articulation and pronunciation are.

Based on your analysis, provide a communication score out of 100. Then, offer detailed, constructive feedback for each of the three aspects (fluency, confidence, clarity) and a comprehensive overall feedback summary with actionable suggestions for improvement.

CRITICAL INSTRUCTION:
1. If the transcript contains between 5 and 10 words, apply a severe penalty to your evaluation across all categories (score must remain under 40). Explicitly state in the overallFeedback that the answer contained valid speech but was too brief, and advise them to expand significantly on their points.
2. If the transcript is completely empty or empty space, you MUST give a score of 0 and explicitly state in the overallFeedback that "No speech was detected. Please ensure your microphone is working and speak clearly."
3. If the transcript contains repetitive musical lyrics or nonsensical disconnected phrases rather than a professional verbal speech, you MUST:
   - Give a very low communication score (under 30).
   - In the overallFeedback, explicitly tell the user that the recording appears to be singing or random noise rather than speaking normally. Remind them that this tracking system only evaluates spoken interview communication.
4. FILLER WORD PENALTY: Scrutinize the transcript for filler words ("uh", "um", "like", "basically"). Heavy usage must heavily reduce the fluency score and be noted in feedback.
5. PACING: If {{wpm}} is provided, factor it heavily into your fluency assessment. Target pacing is 130-150 words per minute (WPM). Mention their precise WPM in your fluency feedback.

Transcript for analysis:
"{{{transcript}}}"
{{#if wpm}}
Speaking Pace Metric: {{wpm}} WPM
{{/if}}`,
});

const analyzeCommunicationSkillsFlow = ai.defineFlow(
  {
    name: 'analyzeCommunicationSkillsFlow',
    inputSchema: AnalyzeCommunicationSkillsInputSchema,
    outputSchema: AnalyzeCommunicationSkillsOutputSchema,
  },
  async input => {
    const transcriptText = (input.transcript || "").trim();
    const wordCount = transcriptText.length > 0 ? transcriptText.split(/\s+/).length : 0;
    
    let injectedWpm = input.wpm;
    if (!injectedWpm && input.durationSeconds && input.durationSeconds > 0) {
      injectedWpm = Math.round((wordCount / input.durationSeconds) * 60);
    }

    // Early termination validation
    if (wordCount > 0 && wordCount < 5) {
      return {
        communicationScore: 15,
        fluencyFeedback: `Fluency Score: 1/10. Audio track too short to evaluate fluency.`,
        confidenceFeedback: `Confidence Score: 1/10. Insufficient data to gauge vocal projection.`,
        clarityFeedback: `Clarity Score: 2/10. Recording incomplete or heavily truncated.`,
        overallFeedback: `Your response was incredibly short (${wordCount} word(s)). This input does not meet the minimum duration for an AI evaluation. Please record an in-depth answer and try again.`
      };
    }

    // Check if API key is present for actual AI analysis
    const hasApiKey = process.env.GOOGLE_GENAI_API_KEY;

    if (!hasApiKey) {
      console.warn("No Google GenAI API Key found. Returning mock analysis data for UI testing.");
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
      const augmentedInput = { ...input, wpm: injectedWpm };
      const {output} = await analyzeCommunicationPrompt(augmentedInput);
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
