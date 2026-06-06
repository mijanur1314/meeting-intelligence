import { AppError } from '../src/utils/AppError';
import { validateAnalysisResult } from '../src/services/ai.service';

const transcripts = [
  {
    timestamp: '00:20',
    speaker: 'Alice',
    text: 'I will prepare the release notes.'
  }
];

describe('AI analysis validation', () => {
  it('accepts grounded insights with transcript citations', () => {
    const result = validateAnalysisResult({
      summary: [{
        text: 'Alice will prepare release notes.',
        citations: [{ timestamp: '00:20', speaker: 'Alice' }]
      }],
      decisions: [],
      actionItems: [{
        text: 'Prepare release notes',
        assignee: 'Alice',
        dueDate: null,
        citations: [{ timestamp: '00:20', speaker: 'Alice' }]
      }],
      followUps: []
    }, transcripts);

    expect(result.actionItems).toHaveLength(1);
  });

  it('rejects citations that do not exist in the transcript', () => {
    expect(() => validateAnalysisResult({
      summary: [{
        text: 'Unsupported statement',
        citations: [{ timestamp: '09:99', speaker: 'Alice' }]
      }],
      decisions: [],
      actionItems: [],
      followUps: []
    }, transcripts)).toThrow(AppError);
  });

  it('rejects generated insights without citations', () => {
    expect(() => validateAnalysisResult({
      summary: [{ text: 'Missing citation', citations: [] }],
      decisions: [],
      actionItems: [],
      followUps: []
    }, transcripts)).toThrow();
  });
});
