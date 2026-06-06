CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "ActionItemStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Participant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "meetingId" TEXT NOT NULL,
    CONSTRAINT "Participant_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Transcript" (
    "id" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "speaker" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "meetingId" TEXT NOT NULL,
    CONSTRAINT "Transcript_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Analysis" (
    "id" TEXT NOT NULL,
    "summary" JSONB NOT NULL,
    "decisions" JSONB NOT NULL,
    "followUps" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "meetingId" TEXT NOT NULL,
    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ActionItem" (
    "id" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "assigneeName" TEXT,
    "dueDate" TIMESTAMP(3),
    "status" "ActionItemStatus" NOT NULL DEFAULT 'PENDING',
    "citations" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "assigneeId" TEXT,
    "meetingId" TEXT NOT NULL,
    CONSTRAINT "ActionItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReminderHistory" (
    "id" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "errorMessage" TEXT,
    "actionItemId" TEXT NOT NULL,
    CONSTRAINT "ReminderHistory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Analysis_meetingId_key" ON "Analysis"("meetingId");
CREATE INDEX "Meeting_ownerId_createdAt_idx" ON "Meeting"("ownerId", "createdAt");
CREATE INDEX "ActionItem_meetingId_status_idx" ON "ActionItem"("meetingId", "status");
CREATE INDEX "ActionItem_status_dueDate_idx" ON "ActionItem"("status", "dueDate");

ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Transcript" ADD CONSTRAINT "Transcript_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ActionItem" ADD CONSTRAINT "ActionItem_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ActionItem" ADD CONSTRAINT "ActionItem_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "Meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReminderHistory" ADD CONSTRAINT "ReminderHistory_actionItemId_fkey" FOREIGN KEY ("actionItemId") REFERENCES "ActionItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
