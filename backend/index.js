import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./authRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import analysisRoutes from "./analysisRoutes.js";
import reportRoutes from "./reportRoutes.js";

dotenv.config();
const app = express();


// Get allowed origins from environment variable or use defaults for development
const getAllowedOrigins = () => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000'];
  
  return allowedOrigins;
};

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    const allowedOrigins = getAllowedOrigins();
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // In development, allow localhost origins
      if (process.env.NODE_ENV !== 'production' && 
          (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
        callback(null, true);
      } 
      // In production, allow Vercel domains automatically
      else if (process.env.NODE_ENV === 'production' && origin.includes('.vercel.app')) {
        console.log('Allowing Vercel origin:', origin);
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        console.log('Allowed origins:', allowedOrigins);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true, // Enable credentials for cookies/auth headers
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
app.use("/api/upload", uploadRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/reports", reportRoutes);



const PORT = process.env.PORT || 5050;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
