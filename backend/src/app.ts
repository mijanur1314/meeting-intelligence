import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger, errorLogger } from './middleware/logger';
import { traceMiddleware } from './middleware/traceMiddleware';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests from this IP, please try again after 15 minutes'
    }
  }
});

app.use('/api', limiter);
app.use(traceMiddleware);
app.use(requestLogger);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// Evaluation Endpoint
app.get('/api/evaluation', (req, res) => {
  res.status(200).json({
    candidateName: process.env.CANDIDATE_NAME || "Sk Mijanur Rahaman",
    email: process.env.CANDIDATE_EMAIL || "",
    repositoryUrl: process.env.REPOSITORY_URL || "",
    deployedUrl: process.env.DEPLOYED_URL || "",
    externalIntegration: "Telegram Bot API",
    features: [
      "Authentication",
      "AI Analysis",
      "Reminder Scheduler"
    ]
  });
});

const swaggerDocument = yaml.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes will be registered here
import authRoutes from './routes/auth.routes';
import meetingRoutes from './routes/meeting.routes';
import actionItemRoutes from './routes/actionItem.routes';

app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/action-items', actionItemRoutes);

// Error Handling
app.use(errorLogger);
app.use(errorHandler);

export default app;
