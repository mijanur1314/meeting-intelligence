import { MeetingRepository } from '../repositories/meeting.repository';
import { AppError } from '../utils/AppError';

const meetingRepo = new MeetingRepository();

export class MeetingService {
  async createMeeting(ownerId: string, data: any) {
    const participants = (data.participants || []).map(
      (participant: string | { name: string; email?: string; userId?: string }) =>
        typeof participant === 'string'
          ? { name: participant, email: participant }
          : participant
    );

    return meetingRepo.create({
      title: data.title,
      date: new Date(data.meetingDate || data.date),
      duration: data.duration,
      owner: { connect: { id: ownerId } },
      participants: {
        create: participants
      },
      transcripts: {
        create: data.transcript || data.transcripts || []
      }
    });
  }

  async getMeeting(id: string, userId: string) {
    const meeting = await meetingRepo.findById(id);
    if (!meeting) {
      throw new AppError('Meeting not found', 404, 'NOT_FOUND');
    }
    if (meeting.ownerId !== userId) {
      throw new AppError('Forbidden access', 403, 'FORBIDDEN');
    }
    return meeting;
  }

  async updateMeeting(id: string, userId: string, data: any) {
    await this.getMeeting(id, userId); // verify existence & ownership
    return meetingRepo.update(id, data);
  }

  async deleteMeeting(id: string, userId: string) {
    await this.getMeeting(id, userId); // verify existence & ownership
    return meetingRepo.delete(id);
  }

  async listMeetings(userId: string, query: any) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const skip = (page - 1) * limit;

    const result = await meetingRepo.findAll(userId, {
      skip,
      take: limit,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder as 'asc' | 'desc'
    });

    return {
      items: result.items,
      pagination: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit)
      }
    };
  }
}
