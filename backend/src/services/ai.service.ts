import { GoogleGenerativeAI } from '@google/generative-ai';
import { AppError } from '../utils/AppError';
import { z } from 'zod';

type TranscriptSegment = {
  timestamp: string;
  speaker: string;
  text: string;
};

const citationSchema = z.object({
  timestamp: z.string().min(1),
  speaker: z.string().min(1).optional()
});

const insightSchema = z.object({
  text: z.string().trim().min(1),
  citations: z.array(citationSchema).min(1)
});

const actionItemSchema = insightSchema.extend({
  assignee: z.string().trim().min(1).nullable().optional(),
  dueDate: z.string().datetime().nullable().optional()
});

export const analysisResultSchema = z.object({
  summary: z.array(insightSchema),
  decisions: z.array(insightSchema),
  actionItems: z.array(actionItemSchema),
  followUps: z.array(insightSchema)
}).strict();

export type AnalysisResult = z.infer<typeof analysisResultSchema>;

export const validateAnalysisResult = (
  value: unknown,
  transcripts: TranscriptSegment[]
): AnalysisResult => {
  const result = analysisResultSchema.parse(value);
  const transcriptCitations = new Set(
    transcripts.map(segment => `${segment.timestamp}\u0000${segment.speaker.toLowerCase()}`)
  );
  const transcriptTimestamps = new Set(transcripts.map(segment => segment.timestamp));
  const insights = [
    ...result.summary,
    ...result.decisions,
    ...result.actionItems,
    ...result.followUps
  ];

  for (const insight of insights) {
    for (const citation of insight.citations) {
      const citationExists = citation.speaker
        ? transcriptCitations.has(`${citation.timestamp}\u0000${citation.speaker.toLowerCase()}`)
        : transcriptTimestamps.has(citation.timestamp);

      if (!citationExists) {
        throw new AppError(
          `AI returned an unsupported citation at ${citation.timestamp}`,
          502,
          'INVALID_AI_OUTPUT'
        );
      }
    }
  }

  return result;
};

const ANALYSIS_PROMPT = `
You are an expert meeting analyst. Your task is to analyze the provided meeting transcript and extract the following:
1. Summary
2. Decisions
3. Action Items
4. Follow-Ups

CRITICAL RULES FOR HALLUCINATION PREVENTION AND GROUNDING:
- You MUST ONLY use the information provided in the transcript.
- NEVER invent or assume attendees, decisions, action items, or outcomes.
- If information is missing, do not generate it.
- EVERY single extracted point MUST include exact citations from the transcript.

JSON OUTPUT FORMAT:
Return ONLY a strictly valid JSON object with the following structure.
{
  "summary": [
    { "text": "...", "citations": [{ "timestamp": "...", "speaker": "..." }] }
  ],
  "decisions": [
    { "text": "...", "citations": [{ "timestamp": "...", "speaker": "..." }] }
  ],
  "actionItems": [
    { "text": "...", "assignee": "...", "dueDate": "ISO-8601 date-time or null", "citations": [{ "timestamp": "...", "speaker": "..." }] }
  ],
  "followUps": [
    { "text": "...", "citations": [{ "timestamp": "...", "speaker": "..." }] }
  ]
}

TRANSCRIPT:
{{TRANSCRIPT_CONTENT}}
`;

export class AIService {
  async analyzeMeeting(transcripts: TranscriptSegment[]) {
    if (!transcripts || transcripts.length === 0) {
      throw new AppError('No transcripts available for analysis', 400, 'NO_TRANSCRIPT');
    }

    const transcriptContent = transcripts
      .map(t => `[${t.timestamp}] ${t.speaker}: ${t.text}`)
      .join('\n');

    const prompt = ANALYSIS_PROMPT.replace('{{TRANSCRIPT_CONTENT}}', transcriptContent);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new AppError('Gemini API key is not configured', 503, 'AI_NOT_CONFIGURED');
      }

      const ai = new GoogleGenerativeAI(apiKey);
      const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const response = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      });

      const text = response.response.text();
      if (!text) throw new Error('Empty response from AI');

      // Strip markdown code blocks if the AI accidentally wrapped the JSON
      const cleanText = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();

      return validateAnalysisResult(JSON.parse(cleanText), transcripts);
    } catch (error: any) {
      console.error("[AI Service Error]", error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(`AI Analysis failed: ${error.message}`, 500, 'AI_ERROR');
    }
  }
}
