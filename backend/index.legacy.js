import express from "express";
import cors from "cors";
import authRoutes from "./authRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import analysisRoutes from "./analysisRoutes.js";
import reportRoutes from "./reportRoutes.js";

const app = express();



const getAllowedOrigins = () => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000' ,'http://10.7.3.194:3000'];
  
  return allowedOrigins;
};

const corsOptions = {
  origin: function (origin, callback) {

    if (!origin) {
      return callback(null, true);
    }
    
    const allowedOrigins = getAllowedOrigins();
    

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {

      if (process.env.NODE_ENV !== 'production' && 
          (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
        callback(null, true);
      } 

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
  credentials: true,
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
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on http://localhost:${PORT}`)
);