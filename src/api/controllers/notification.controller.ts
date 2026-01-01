import { Request, Response } from 'express';
import { NotificationService } from '../../services/notification.service';
import { User } from '../../models/user.model';

export class NotificationController {
    static async registerDevice(req: Request, res: Response) {
        try {
            const username = req.headers['x-user-username'] as string;
            const { fcmToken } = req.body;

            if (!username || !fcmToken) {
                return res.status(400).json({ error: 'Missing username or token' });
            }

            const user = await User.findOne({ where: { username } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            await NotificationService.registerDevice(user.id, fcmToken);
            res.json({ success: true, message: 'Device registered' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async triggerDailyTest(req: Request, res: Response) {
        try {
            const result = await NotificationService.triggerDailyDigest();
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
}
