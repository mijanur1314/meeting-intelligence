import { ActionItemStatus, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';

const actionItemInclude = {
  assignee: {
    select: {
      id: true,
      email: true
    }
  }
} satisfies Prisma.ActionItemInclude;

export class ActionItemService {
  async create(
    userId: string,
    data: {
      task: string;
      meetingId: string;
      assignee?: string;
      assigneeId?: string;
      dueDate?: string;
    }
  ) {
    const meeting = await prisma.meeting.findFirst({
      where: { id: data.meetingId, ownerId: userId },
      select: { id: true }
    });

    if (!meeting) {
      throw new AppError('Meeting not found', 404, 'NOT_FOUND');
    }

    if (data.assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: data.assigneeId },
        select: { id: true }
      });
      if (!assignee) {
        throw new AppError('Assignee not found', 400, 'INVALID_ASSIGNEE');
      }
    }

    return prisma.actionItem.create({
      data: {
        task: data.task,
        assigneeName: data.assignee,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        meetingId: data.meetingId,
        assigneeId: data.assigneeId,
        status: 'PENDING'
      },
      include: actionItemInclude
    });
  }

  async list(
    userId: string,
    filters: {
      status?: ActionItemStatus;
      assignee?: string;
      assigneeId?: string;
      meetingId?: string;
    }
  ) {
    const where: Prisma.ActionItemWhereInput = {
      meeting: { ownerId: userId }
    };

    if (filters.status) where.status = filters.status;
    if (filters.meetingId) where.meetingId = filters.meetingId;
    if (filters.assigneeId) where.assigneeId = filters.assigneeId;
    if (filters.assignee) {
      where.OR = [
        { assigneeName: { equals: filters.assignee, mode: 'insensitive' } },
        { assignee: { email: filters.assignee } }
      ];
    }

    return prisma.actionItem.findMany({
      where,
      include: actionItemInclude,
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatus(userId: string, id: string, status: ActionItemStatus) {
    await this.requireOwnedItem(userId, id);
    return prisma.actionItem.update({
      where: { id },
      data: { status },
      include: actionItemInclude
    });
  }

  async delete(userId: string, id: string) {
    await this.requireOwnedItem(userId, id);
    await prisma.actionItem.delete({ where: { id } });
  }

  async getOverdue(userId: string) {
    return prisma.actionItem.findMany({
      where: {
        meeting: { ownerId: userId },
        status: { not: 'COMPLETED' },
        dueDate: { lt: new Date() }
      },
      include: actionItemInclude,
      orderBy: { dueDate: 'asc' }
    });
  }

  private async requireOwnedItem(userId: string, id: string) {
    const item = await prisma.actionItem.findFirst({
      where: { id, meeting: { ownerId: userId } },
      select: { id: true }
    });

    if (!item) {
      throw new AppError('Action item not found', 404, 'NOT_FOUND');
    }
  }
}
