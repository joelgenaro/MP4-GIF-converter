const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.use(cors());
app.use("/output", express.static(path.join(__dirname, "output")));

const outputDir = path.join(__dirname, "output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

app.post("/convert", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const inputFilePath = req.file.path;
  const outputFilePath = path.join(outputDir, `${req.file.filename}.gif`);

  console.log(`Converting file: ${inputFilePath} to ${outputFilePath}`);

  ffmpeg(inputFilePath)
    .outputOptions(["-vf", "fps=5,scale=400:-1"])
    .on("end", () => {
      console.log(`Conversion complete: ${outputFilePath}`);
      res.download(outputFilePath, (err) => {
        if (err) {
          console.error(`Error sending file: ${err}`);
          res.status(500).send(err);
        }

        fs.unlink(inputFilePath, () => {});
        fs.unlink(outputFilePath, () => {});
      });
    })
    .on("error", (err) => {
      console.error(`Conversion error: ${err}`);
      res.status(500).send(err);
    })
    .save(outputFilePath);
});

app.listen(3000, () => console.log("Server running on port 3000"));
