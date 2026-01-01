import { Router } from 'express';
import { FeedController } from '../controllers/feed.controller';
import { NotificationController } from '../controllers/notification.controller';

const router = Router();

// Feed Routes
router.get('/feed', FeedController.getFeed);
router.post('/feed/view', FeedController.trackView);

// Notification Routes
router.post('/notifications/device', NotificationController.registerDevice);
router.post('/notifications/test-trigger', NotificationController.triggerDailyTest); // For testing

export default router;
