import { z } from 'zod';

const statusSchema = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']);

export const createActionItemSchema = z.object({
  body: z.object({
    task: z.string().trim().min(1, 'Task is required').max(500),
    meetingId: z.string().uuid('Invalid meeting ID format'),
    assignee: z.string().trim().min(1).max(200).optional(),
    assigneeId: z.string().uuid('Invalid assignee ID format').optional(),
    dueDate: z.string().datetime('Invalid due date').optional()
  })
});

export const listActionItemsSchema = z.object({
  query: z.object({
    status: statusSchema.optional(),
    assignee: z.string().trim().min(1).optional(),
    assigneeId: z.string().uuid('Invalid assignee ID format').optional(),
    meetingId: z.string().uuid('Invalid meeting ID format').optional()
  })
});

export const actionItemIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid action item ID format')
  })
});

export const updateActionItemStatusSchema = actionItemIdSchema.extend({
  body: z.object({
    status: statusSchema
  })
});
