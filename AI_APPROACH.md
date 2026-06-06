# AI Approach

## Prompt Design

Gemini receives only timestamped transcript segments. The prompt explicitly prohibits invented attendees, outcomes, decisions, and tasks, requests low-temperature JSON output, and requires citations on every generated insight.

## Citation Strategy

Each summary, decision, action item, and follow-up must contain at least one `{ timestamp, speaker }` citation. After JSON parsing, Zod enforces the output structure and the service verifies that every cited timestamp and speaker pair exists in the original transcript.

## Hallucination Prevention

- Transcript-only prompt context
- Temperature set to `0.1`
- Strict top-level Zod schema
- Non-empty citation arrays for every insight
- Rejection of citations not present in the transcript
- No database write when AI validation fails

This validates structural grounding. It cannot prove that an otherwise valid cited sentence semantically supports every word of an insight; human review remains appropriate for high-impact use.

## Output Validation

Malformed JSON, unknown fields, missing arrays, invalid due dates, empty text, missing citations, and unsupported citations are rejected. Unsupported citations return `INVALID_AI_OUTPUT`.

## Known Limitations

- Assignee names extracted from speech are not automatically linked to registered user IDs.
- Relative dates may be omitted unless Gemini can return a valid ISO-8601 date-time.
- Re-running analysis replaces action items previously extracted for that meeting.
