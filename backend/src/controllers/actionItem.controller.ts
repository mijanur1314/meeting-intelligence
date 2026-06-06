import { Request, Response, NextFunction } from 'express';
import { ActionItemStatus } from '@prisma/client';
import { ActionItemService } from '../services/actionItem.service';

const actionItemService = new ActionItemService();

export class ActionItemController {
  async createActionItem(req: Request, res: Response, next: NextFunction) {
    try {
      const actionItem = await actionItemService.create(req.user!.userId, req.body);
      res.status(201).json({ traceId: req.traceId, success: true, data: actionItem });
    } catch (err) {
      next(err);
    }
  }

  async listActionItems(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await actionItemService.list(req.user!.userId, {
        status: req.query.status as ActionItemStatus | undefined,
        assignee: req.query.assignee as string | undefined,
        assigneeId: req.query.assigneeId as string | undefined,
        meetingId: req.query.meetingId as string | undefined
      });
      res.status(200).json({ traceId: req.traceId, success: true, data: items });
    } catch (err) {
      next(err);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const item = await actionItemService.updateStatus(req.user!.userId, id, status);
      res.status(200).json({ traceId: req.traceId, success: true, data: item });
    } catch (err) {
      next(err);
    }
  }

  async deleteActionItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await actionItemService.delete(req.user!.userId, id);
      res.status(200).json({ traceId: req.traceId, success: true, data: { message: 'Deleted' } });
    } catch (err) {
      next(err);
    }
  }

  async getOverdue(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await actionItemService.getOverdue(req.user!.userId);
      res.status(200).json({ traceId: req.traceId, success: true, data: items });
    } catch (err) {
      next(err);
    }
  }
}
