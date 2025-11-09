import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./authRoutes.js";

dotenv.config();
const app = express();


const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin.includes('localhost:3000') || origin.includes('127.0.0.1:3000') || origin.includes('localhost:5173')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});


app.use(express.json());


app.get("/", (req, res) => {
  res.status(200).send("ArogyaAI API is running...");
});


app.use("/api/auth", authRoutes);



const PORT = process.env.PORT || 5050;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
