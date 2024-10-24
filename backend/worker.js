const Bull = require("bull");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const Redis = require("ioredis");

const redisClient = new Redis();
const videoQueue = new Bull("video conversion", { redis: redisClient });

console.log("Worker started and connected to Redis");

videoQueue.process(async (job) => {
  const { inputFilePath, outputFilePath } = job.data;

  return new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .outputOptions(["-vf", "fps=5,scale=400:-1"])
      .on("end", () => {
        console.log(`Job ${job.id} completed`);
        fs.unlink(inputFilePath, () => {});
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      })
      .save(outputFilePath);
  });
});

// Cleanup old files and jobs
setInterval(() => {
  const now = Date.now();
  const files = fs.readdirSync(outputDir);
  files.forEach((file) => {
    const filePath = path.join(outputDir, file);
    const stats = fs.statSync(filePath);
    if (now - stats.mtimeMs > 24 * 60 * 60 * 1000) {
      // 1 day
      fs.unlinkSync(filePath);
    }
  });

  videoQueue.clean(24 * 60 * 60 * 1000); // Clean jobs older than 1 day
}, 60 * 60 * 1000); // Run every hour
