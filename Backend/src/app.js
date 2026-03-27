const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const profileRoutes = require("./routes/profile");
const jobRoutes = require("./routes/jobs");
const applicationRoutes = require("./routes/applications");
const messageRoutes = require("./routes/messages");
const notificationRoutes = require("./routes/notifications");
const fileRoutes = require("./routes/fileRoutes");

const { errorHandler } = require("./middleware/errorHandler");

const app = express();
// ✅ Proper CORS setup

app.use(cors({
  origin: true, // This reflects whatever origin is sending the request
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Health check
app.get("/api/health", (req, res) =>
  res.json({ ok: true, ts: Date.now() })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/files", fileRoutes);

// Static uploads (kept for existing files, but new ones will use GridFS)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));



app.use(errorHandler);

module.exports = app;
