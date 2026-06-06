import { Router } from 'express';
import { ActionItemController } from '../controllers/actionItem.controller';
import { authenticate } from '../middleware/authMiddleware';
import { validate } from '../validators/auth.validator';
import {
  actionItemIdSchema,
  createActionItemSchema,
  listActionItemsSchema,
  updateActionItemStatusSchema
} from '../validators/actionItem.validator';

const router = Router();
const controller = new ActionItemController();

router.use(authenticate);

router.get('/overdue', controller.getOverdue);
router.post('/', validate(createActionItemSchema), controller.createActionItem);
router.get('/', validate(listActionItemsSchema), controller.listActionItems);
router.patch('/:id/status', validate(updateActionItemStatusSchema), controller.updateStatus);
router.delete('/:id', validate(actionItemIdSchema), controller.deleteActionItem);

export default router;
