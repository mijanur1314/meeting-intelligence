import { createMeetingSchema, listMeetingsSchema } from '../src/validators/meeting.validator';

describe('Meeting validation', () => {
  it('accepts the assignment payload format', () => {
    const result = createMeetingSchema.safeParse({
      body: {
        title: 'Sprint Planning',
        participants: ['alice@example.com', 'bob@example.com'],
        meetingDate: '2026-05-20T10:00:00Z',
        transcript: [{
          timestamp: '00:20',
          speaker: 'Alice',
          text: 'I will prepare release notes.'
        }]
      }
    });

    expect(result.success).toBe(true);
  });

  it('rejects unbounded pagination limits', () => {
    const result = listMeetingsSchema.safeParse({
      query: { page: '1', limit: '1000' }
    });

    expect(result.success).toBe(false);
  });
});
