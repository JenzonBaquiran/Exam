const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const Film = require("./models/films.model");
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "20mb" })); // Increase JSON body size limit if needed
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files

// Multer setup (no file size limit)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage }); // No file size limit

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/Film", {});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

// --- Film Routes ---

// Fetch all films
app.get("/api/films", async (req, res) => {
  try {
    const films = await Film.find();
    res.json(films);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new film (with file upload)
app.post("/api/films", upload.single("poster"), async (req, res) => {
  try {
    const { title, year, description } = req.body;
    const film = new Film({
      title,
      year,
      description,
      img: req.file ? `/uploads/${req.file.filename}` : "",
    });
    await film.save();
    res.json(film);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Edit a film (with file upload)
app.put("/api/films/:id", upload.single("poster"), async (req, res) => {
  try {
    const { title, year, description } = req.body;
    const updateData = {
      title,
      year,
      description,
    };
    if (req.file) {
      updateData.img = `/uploads/${req.file.filename}`;
    }
    const updated = await Film.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a film
app.delete("/api/films/:id", async (req, res) => {
  try {
    await Film.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Start Server ---
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});