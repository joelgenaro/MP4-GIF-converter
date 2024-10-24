const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const Bull = require("bull");
const Redis = require("ioredis");
const { EventEmitter } = require("events");
const crypto = require("crypto");

const app = express();
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 },
});

const redisClient = new Redis();
const videoQueue = new Bull("video conversion", { redis: redisClient });
const eventEmitter = new EventEmitter();

app.use(cors());
app.use("/output", express.static(path.join(__dirname, "output")));

const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

function getSubdirectory() {
  const hash = crypto
    .createHash("md5")
    .update(Date.now().toString())
    .digest("hex");
  return path.join(outputDir, hash.slice(0, 2), hash.slice(2, 4));
}

app.post("/convert", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const inputFilePath = req.file.path;
  const subDir = getSubdirectory();
  if (!fs.existsSync(subDir)) {
    fs.mkdirSync(subDir, { recursive: true });
  }
  const outputFilePath = path.join(subDir, `${req.file.filename}.gif`);

  const video = ffmpeg(inputFilePath);
  video.ffprobe((err, metadata) => {
    if (err) {
      return res.status(500).send("Error processing video.");
    }

    const { width, height, duration } = metadata.streams[0];
    if (width > 1024 || height > 768) {
      return res
        .status(400)
        .send("Video dimensions should not exceed 1024x768.");
    }
    if (duration > 10) {
      return res
        .status(400)
        .send("Video duration should not exceed 10 seconds.");
    }

    videoQueue.add({ inputFilePath, outputFilePath });

    res.status(202).json({
      message: "Video is being processed.",
      outputFilePath: outputFilePath,
    });

    eventEmitter.once(`job-complete-${req.file.filename}`, () => {
      res.status(200).json({
        message: "Video processing complete.",
        outputFilePath: outputFilePath,
      });
    });
  });
});

videoQueue.on("completed", (job) => {
  eventEmitter.emit(
    `job-complete-${path.basename(job.data.outputFilePath, ".gif")}`
  );
});

app.listen(3000, () => console.log("Server running on port 3000"));
