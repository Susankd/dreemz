import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class User extends Model {
    public id!: number;
    public username!: string;
    public timezone!: string;
    public last_active_at!: Date;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    timezone: {
        type: DataTypes.STRING(50),
        defaultValue: 'UTC'
    },
    last_active_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at' // Sequelize adds updatedAt by default
});
