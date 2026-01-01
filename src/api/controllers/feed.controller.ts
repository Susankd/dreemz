import { Request, Response } from 'express';
import { FeedService } from '../../services/feed.service';
import { User } from '../../models/user.model';

export class FeedController {
    static async getFeed(req: Request, res: Response) {
        try {
            const username = req.headers['x-user-username'] as string;

            if (!username) {
                return res.status(401).json({ error: 'Unauthorized: Missing x-user-username' });
            }

            const user = await User.findOne({ where: { username } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const result = await FeedService.getNextPosts(user.id);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static async trackView(req: Request, res: Response) {
        try {
            const username = req.headers['x-user-username'] as string;
            const { postId } = req.body;

            if (!username || !postId) {
                return res.status(400).json({ error: 'Invalid Parameters' });
            }

            const user = await User.findOne({ where: { username } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            await FeedService.trackView(user.id, parseInt(postId));
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
