import { prisma } from '../lib/prisma';
import { Prisma } from '@prisma/client';

export class MeetingRepository {
  async create(data: Prisma.MeetingCreateInput) {
    return prisma.meeting.create({
      data,
      include: {
        participants: true,
        transcripts: true
      }
    });
  }

  async findById(id: string) {
    return prisma.meeting.findUnique({
      where: { id },
      include: {
        participants: true,
        transcripts: true,
        analysis: true,
        actionItems: true
      }
    });
  }

  async update(id: string, data: Prisma.MeetingUpdateInput) {
    return prisma.meeting.update({
      where: { id },
      data,
      include: {
        participants: true,
        transcripts: true
      }
    });
  }

  async delete(id: string) {
    return prisma.meeting.delete({
      where: { id }
    });
  }

  async findAll(ownerId: string, options: {
    skip?: number;
    take?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const where: Prisma.MeetingWhereInput = { ownerId };
    
    if (options.search) {
      where.title = { contains: options.search, mode: 'insensitive' };
    }

    const allowedSortFields = ['title', 'date', 'createdAt', 'updatedAt'] as const;
    const sortBy = allowedSortFields.includes(
      options.sortBy as (typeof allowedSortFields)[number]
    )
      ? (options.sortBy as (typeof allowedSortFields)[number])
      : 'createdAt';
    const orderBy: Prisma.MeetingOrderByWithRelationInput = {
      [sortBy]: options.sortOrder || 'desc'
    };

    const [items, total] = await Promise.all([
      prisma.meeting.findMany({
        where,
        skip: options.skip,
        take: options.take,
        orderBy,
      }),
      prisma.meeting.count({ where })
    ]);

    return { items, total };
  }
}
