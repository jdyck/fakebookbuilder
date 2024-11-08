require("dotenv").config();

const fs = require("fs");
const path = require("path");
const Mustache = require("mustache");

console.log(
  "Environment Variables Loaded:",
  process.env.SONGS_SRC_PATH,
  process.env.OUTPUT_PATH
);

// Use paths from .env.local
const SONGS_DIR = path.resolve(process.env.SONGS_SRC_PATH_SCRIPT + "/songs");
const OUTPUT_DIR = path.resolve(process.env.OUTPUT_PATH);

// Load templates
const indexTemplate = fs.readFileSync("./src/templates/index.html", "utf8");
const songTemplate = fs.readFileSync("./src/templates/song.html", "utf8");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Read song metadata and generate pages
const songs = [];
fs.readdirSync(SONGS_DIR).forEach((songFolder) => {
  const songPath = path.join(SONGS_DIR, songFolder);
  const metadataPath = path.join(songPath, `${songFolder}.json`);

  if (fs.existsSync(metadataPath)) {
    const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
    const { title, composer } = metadata;

    fs.readdirSync(songPath).forEach((file) => {
      if (file.endsWith(".abc")) {
        const version = file.replace(".abc", "");
        const abcContent = fs.readFileSync(path.join(songPath, file), "utf8");
        const songPagePath = path.join(OUTPUT_DIR, `${version}.html`);

        // Render song template
        const songHtml = Mustache.render(songTemplate, {
          title,
          composer,
          abcContent: abcContent.replace(/`/g, "\\`"), // Escape backticks
        });
        fs.writeFileSync(songPagePath, songHtml);

        songs.push({
          title,
          composer,
          filePath: `${version}.html`,
        });
      }
    });
  }
});

// Render index template with song links
const indexHtml = Mustache.render(indexTemplate, {
  songs,
  nameOfBook: process.env.NAME_OF_BOOK,
  descriptionOfBook: process.env.DESCRIPTION_OF_BOOK,
});
fs.writeFileSync(path.join(OUTPUT_DIR, "index.html"), indexHtml);

console.log("Static site generated successfully!");
