import { z } from 'zod';

export const createMeetingSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    date: z.string().datetime().optional(),
    meetingDate: z.string().datetime().optional(),
    duration: z.number().optional(),
    participants: z.array(z.union([
      z.string().email(),
      z.object({
        name: z.string(),
        email: z.string().email().optional(),
        userId: z.string().uuid().optional()
      })
    ])).optional(),
    transcripts: z.array(z.object({
      timestamp: z.string(),
      speaker: z.string(),
      text: z.string()
    })).optional(),
    transcript: z.array(z.object({
      timestamp: z.string(),
      speaker: z.string(),
      text: z.string()
    })).optional()
  }).refine(data => Boolean(data.date || data.meetingDate), {
    message: 'Meeting date is required',
    path: ['meetingDate']
  })
});

export const updateMeetingSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    date: z.string().datetime().optional(),
    duration: z.number().optional(),
  }),
  params: z.object({
    id: z.string().uuid('Invalid meeting ID format')
  })
});

export const getMeetingSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid meeting ID format')
  })
});

export const listMeetingsSchema = z.object({
  query: z.object({
    page: z.string().regex(/^[1-9]\d*$/).optional(),
    limit: z.string().regex(/^[1-9]\d*$/).refine(
      value => Number(value) <= 100,
      'Limit cannot exceed 100'
    ).optional(),
    search: z.string().optional(),
    sortBy: z.enum(['date', 'createdAt', 'title']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional()
  })
});
