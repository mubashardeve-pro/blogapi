const express = require('express');
const app = express();
app.set("trust proxy", 1);
const db = require('./db/models');
const { categories } = require('./db/models');
const globalErrorHandler = require('./utils/errorController');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const authMiddleware = require('./middlewares/authMiddleware');

const allowedOrigins = [
  "http://localhost:3000",
  "https://frontend-chi-eight-63.vercel.app",
];

if (process.env.CLIENT_URL) {
  const clientUrl = process.env.CLIENT_URL.replace(/\/$/, "");
  if (!allowedOrigins.includes(clientUrl)) {
    allowedOrigins.push(clientUrl);
  }
}

app.use(cors({
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }
    const normalized = origin.replace(/\/$/, "");
    const isAllowed = allowedOrigins.some(
      (allowed) => allowed.replace(/\/$/, "") === normalized
    );
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error(`CORS not allowed for origin: ${origin}`));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: "15mb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Home Page")
})

const PORT = process.env.PORT || 4600;
const isVercel = Boolean(process.env.VERCEL);

async function initializeApp() {
  const requiredEnv = ["JWT_SECRET", "DB_NAME", "DB_USER", "DB_HOST", "AWS_BUCKET_NAME", "AWS_REGION", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"];
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }

  await db.sequelize.authenticate();
  console.log('Database connected');

  await categories.findOrCreate({
    where: { slug: "uncategorized" },
    defaults: { name: "Uncategorized", slug: "uncategorized" },
  });
}

const initPromise = initializeApp();

if (isVercel) {
  app.use(async (req, res, next) => {
    try {
      await initPromise;
      next();
    } catch (error) {
      next(error);
    }
  });
}

app.use("/api/v1", authMiddleware, require("./routes"));

app.use(globalErrorHandler);

if (!isVercel) {
  initPromise
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to start server:', error);
      process.exit(1);
    });
}

module.exports = app;
