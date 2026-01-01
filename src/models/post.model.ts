import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class Post extends Model {
  public id!: number;
  public content_url!: string;
  public category!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(50),
    },
  },
  {
    sequelize,
    tableName: "posts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
