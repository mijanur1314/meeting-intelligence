import { prisma } from '../lib/prisma';

export class AnalysisRepository {
  async upsert(meetingId: string, data: any) {
    return prisma.analysis.upsert({
      where: { meetingId },
      update: {
        summary: data.summary,
        decisions: data.decisions,
        followUps: data.followUps
      },
      create: {
        meetingId,
        summary: data.summary,
        decisions: data.decisions,
        followUps: data.followUps
      }
    });
  }

  async getByMeetingId(meetingId: string) {
    return prisma.analysis.findUnique({
      where: { meetingId }
    });
  }
}
