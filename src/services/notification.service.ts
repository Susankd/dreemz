import { User } from '../models/user.model';
import { Device } from '../models/device.model';
import { Op } from 'sequelize';

export class NotificationService {

    private static async sendFCM(token: string, message: string): Promise<boolean> {
        return true;
    }

    static async registerDevice(userId: number, token: string): Promise<void> {
        await Device.upsert({
            user_id: userId,
            fcm_token: token,
            is_active: true,
            platform: 'ios'
        });
        console.log(`[Notification] Registered device for user ${userId}`);
    }

    /**
     * Daily Digest Trigger
     */
    static async triggerDailyDigest(): Promise<{ sentCount: number }> {
        const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const targets = await User.findAll({
            where: {
                last_active_at: {
                    [Op.lt]: cutoff
                }
            }
        });

        let sentCount = 0;

        for (const user of targets) {
            // 1. Quiet Hours
            if (this.isQuietHours(user.timezone)) {
                console.log(`[Notification] Skipping ${user.username} (Quiet Hours)`);
                continue;
            }

            // 2. Lookup Device in DB
            const device = await Device.findOne({
                where: { user_id: user.id, is_active: true }
            });

            if (device) {
                await this.sendFCM(device.fcm_token, "Check out the top posts you missed today!");
                sentCount++;
            }
        }

        return { sentCount };
    }

    private static isQuietHours(timezone: string): boolean {
        return false;
    }
}
