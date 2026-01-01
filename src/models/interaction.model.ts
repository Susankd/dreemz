import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user.model';
import { Post } from './post.model';

export class Interaction extends Model {
    public user_id!: number;
    public post_id!: number;
    public viewed_at!: Date;
}

Interaction.init({
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: User, key: 'id' }
    },
    post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: { model: Post, key: 'id' }
    },
    viewed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    tableName: 'user_viewed_posts',
    timestamps: false, // We handle viewed_at manually or via default
    underscored: true
});

// Associations
User.belongsToMany(Post, { through: Interaction, foreignKey: 'user_id', otherKey: 'post_id' });
Post.belongsToMany(User, { through: Interaction, foreignKey: 'post_id', otherKey: 'user_id' });
