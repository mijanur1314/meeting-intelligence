import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai.service';
import { AnalysisRepository } from '../repositories/analysis.repository';
import { MeetingService } from '../services/meeting.service';
import { prisma } from '../lib/prisma';

const aiService = new AIService();
const analysisRepo = new AnalysisRepository();
const meetingService = new MeetingService();

export class AnalysisController {
  async analyzeMeeting(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const meeting = await meetingService.getMeeting(id, req.user!.userId);
      const analysisResult = await aiService.analyzeMeeting(meeting.transcripts);
      
      const analysis = await analysisRepo.upsert(id, analysisResult);

      if (analysisResult.actionItems && analysisResult.actionItems.length > 0) {
        await prisma.actionItem.deleteMany({
          where: { meetingId: id }
        });

        const actionItemsData = analysisResult.actionItems.map(item => ({
          meetingId: id,
          task: item.text,
          assigneeName: item.assignee,
          dueDate: item.dueDate ? new Date(item.dueDate) : null,
          citations: item.citations
        }));

        await prisma.actionItem.createMany({
          data: actionItemsData
        });
      }

      res.status(200).json({
        traceId: req.traceId,
        success: true,
        data: {
          analysis,
          actionItems: analysisResult.actionItems
        }
      });
    } catch (err) {
      next(err);
    }
  }

  async getAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await meetingService.getMeeting(id, req.user!.userId);
      const analysis = await analysisRepo.getByMeetingId(id);
      const actionItems = await prisma.actionItem.findMany({
        where: { meetingId: id },
        orderBy: { createdAt: 'asc' }
      });
      
      res.status(200).json({
        traceId: req.traceId,
        success: true,
        data: {
          analysis,
          actionItems: actionItems.map(item => ({
            text: item.task,
            assignee: item.assigneeName,
            dueDate: item.dueDate?.toISOString() || null,
            citations: item.citations || []
          }))
        }
      });
    } catch (err) {
      next(err);
    }
  }
}
