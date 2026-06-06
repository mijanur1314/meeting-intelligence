import { Request, Response, NextFunction } from 'express';
import { MeetingService } from '../services/meeting.service';

const meetingService = new MeetingService();

export class MeetingController {
  async createMeeting(req: Request, res: Response, next: NextFunction) {
    try {
      const meeting = await meetingService.createMeeting(req.user!.userId, req.body);
      res.status(201).json({
        traceId: req.traceId,
        success: true,
        data: meeting
      });
    } catch (err) {
      next(err);
    }
  }

  async getMeeting(req: Request, res: Response, next: NextFunction) {
    try {
      const meeting = await meetingService.getMeeting(req.params.id, req.user!.userId);
      res.status(200).json({
        traceId: req.traceId,
        success: true,
        data: meeting
      });
    } catch (err) {
      next(err);
    }
  }

  async listMeetings(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await meetingService.listMeetings(req.user!.userId, req.query);
      res.status(200).json({
        traceId: req.traceId,
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }

  async updateMeeting(req: Request, res: Response, next: NextFunction) {
    try {
      const meeting = await meetingService.updateMeeting(req.params.id, req.user!.userId, req.body);
      res.status(200).json({
        traceId: req.traceId,
        success: true,
        data: meeting
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteMeeting(req: Request, res: Response, next: NextFunction) {
    try {
      await meetingService.deleteMeeting(req.params.id, req.user!.userId);
      res.status(200).json({
        traceId: req.traceId,
        success: true,
        data: { message: 'Meeting deleted successfully' }
      });
    } catch (err) {
      next(err);
    }
  }
}
