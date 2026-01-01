import express from "express";
import v1Routes from "./api/routes/v1.routes";
import { connectDB } from "./config/database";
import { User } from "./models/user.model";
import { Post } from "./models/post.model";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/v1", v1Routes);
app.get("/health", (_, res) =>
  res.json({ status: "ok", time: new Date().toISOString() })
);

const start = async () => {
  try {
    await connectDB();

    // If DB is empty, add some data so the user can verify immediately
    const userCount = await User.count();
    if (userCount === 0) {
      console.log("🌱 Seeding database with Sequelize...");
      await User.create({ username: "alice", timezone: "America/New_York" });
      for (let i = 1; i <= 10; i++) {
        await Post.create({
          content_url: `https://v/${i}.mp4`,
          category: "fun",
        });
      }
    }

    app.listen(PORT, () => {
      console.log(`🚀 Dreemz Service (ORM Mode) running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Fatal:", err);
    process.exit(1);
  }
};

start();
