import { Router } from 'express';
import { MeetingController } from '../controllers/meeting.controller';
import { AnalysisController } from '../controllers/analysis.controller';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../validators/auth.validator';
import {
  createMeetingSchema,
  updateMeetingSchema,
  getMeetingSchema,
  listMeetingsSchema
} from '../validators/meeting.validator';

const router = Router();
const meetingController = new MeetingController();
const analysisController = new AnalysisController();

router.use(authenticate); // Protect all meeting routes

router.post('/', validate(createMeetingSchema), meetingController.createMeeting);
router.get('/', validate(listMeetingsSchema), meetingController.listMeetings);
router.post('/:id/analyze', validate(getMeetingSchema), analysisController.analyzeMeeting);
router.get('/:id/analysis', validate(getMeetingSchema), analysisController.getAnalysis);
router.get('/:id', validate(getMeetingSchema), meetingController.getMeeting);
router.patch('/:id', validate(updateMeetingSchema), meetingController.updateMeeting);
router.delete('/:id', validate(getMeetingSchema), meetingController.deleteMeeting);

export default router;
