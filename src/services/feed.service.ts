import { Post } from '../models/post.model';
import { Interaction } from '../models/interaction.model';
import { Op, Sequelize } from 'sequelize';

export class FeedService {
    /**
     * Fetches the next batch of posts for a user.
     * Uses pure Sequelize ORM methods without raw SQL.
     */
    static async getNextPosts(userId: number): Promise<{ posts: Post[], cycleReset: boolean }> {
        // 1. Fetch the list of IDs the user has already seen
        // "SELECT post_id FROM user_viewed_posts WHERE user_id = ..."
        const viewedInteractions = await Interaction.findAll({
            where: { user_id: userId },
            attributes: ['post_id'],
            raw: true
        });

        // Map to an array of numbers: [1, 2, 5, ...]
        const viewedPostIds = viewedInteractions.map((i: any) => i.post_id);

        // 2. Fetch posts NOT in that list
        let posts = await Post.findAll({
            where: {
                id: {
                    [Op.notIn]: viewedPostIds.length > 0 ? viewedPostIds : [-1] // Handle empty list safe-guard
                }
            },
            order: [Sequelize.fn('RANDOM')],
            limit: 5
        });

        let cycleReset = false;

        // Reset Logic
        if (posts.length === 0) {
            console.log(`[FeedCycle] User ${userId} exhausted content. Resetting history.`);

            // ORM Delete
            await Interaction.destroy({
                where: { user_id: userId }
            });

            cycleReset = true;

            // Retry fetch (viewed list is now empty)
            posts = await Post.findAll({
                order: [Sequelize.fn('RANDOM')],
                limit: 5
            });
        }

        return { posts, cycleReset };
    }

    static async trackView(userId: number, postId: number): Promise<void> {
        await Interaction.findOrCreate({
            where: { user_id: userId, post_id: postId },
            defaults: { viewed_at: new Date() }
        });
    }
}
