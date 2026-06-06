const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

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
[00:00] Sarah: Welcome everyone to the Q3 Design Review. Let's start with the mobile app redesign.
[00:20] David: I've reviewed the wireframes. The new navigation bar looks great, but I think the checkout button is too small on mobile screens.
[00:45] Sarah: Good point. Let's officially decide to increase the checkout button size by 20% on all mobile views.
[01:10] David: Perfect. I will update the Figma prototypes by tomorrow morning.
[01:30] Sarah: Excellent. Once you do that, I'll schedule a final review meeting with the engineering team.
`;

const run = async () => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const ai = new GoogleGenerativeAI(apiKey);
        const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const response = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: ANALYSIS_PROMPT }] }],
            generationConfig: {
                temperature: 0.1,
                responseMimeType: 'application/json'
            }
        });
        const text = response.response.text();
        console.log("Raw Response:");
        console.log(text);
    } catch(e) {
        console.error(e);
    }
}
run();
