import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user.model';

export class Device extends Model {
    public user_id!: number;
    public fcm_token!: string;
    public platform!: string;
    public is_active!: boolean;
}

Device.init({
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: User, key: 'id' }
    },
    fcm_token: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    platform: {
        type: DataTypes.STRING(20),
        defaultValue: 'ios'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    tableName: 'devices',
    timestamps: false,
    underscored: true
});
