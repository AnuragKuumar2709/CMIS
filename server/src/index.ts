import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pino from 'pino';
import { swaggerUi, specs } from './swagger';
import health from './routes/health';
import auth from './routes/auth';
import students from './routes/students';
import departments from './routes/departments';
import courses from './routes/courses';
import enrollments from './routes/enrollments';
import subjects from './routes/subjects';
import attendance from './routes/attendance';
import exams from './routes/exams';
import fees from './routes/fees';
import timetable from './routes/timetable';

const app = express();
const logger = pino({ 
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// API Versioning - v1 prefix
const apiV1 = express.Router();

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'CMIS API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      apiDocs: '/api-docs',
      api: '/api/v1'
    }
  });
});

// Health check (no versioning needed)
app.use('/health', health);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'CMIS API Documentation'
}));

// API v1 routes
apiV1.use('/auth', auth);
apiV1.use('/students', students);
apiV1.use('/departments', departments);
apiV1.use('/courses', courses);
apiV1.use('/enrollments', enrollments);
apiV1.use('/subjects', subjects);
apiV1.use('/attendance', attendance);
apiV1.use('/exams', exams);
apiV1.use('/fees', fees);
apiV1.use('/timetable', timetable);

// Mount API v1
app.use('/api/v1', apiV1);

// Global error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  // User-readable error messages
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Invalid input data provided',
      details: err.message 
    });
  }

  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({ 
      error: 'Database operation failed',
      details: 'Please check your input data' 
    });
  }

  // Default error
  res.status(500).json({ 
    error: 'An unexpected error occurred',
    details: process.env.NODE_ENV === 'development' ? err.message : 'Please try again later'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist` 
  });
});

const port = Number(process.env.PORT || 4000);
app.listen(port, '0.0.0.0', () => {
  logger.info({ 
    port, 
    environment: process.env.NODE_ENV || 'development',
    apiDocs: `http://localhost:${port}/api-docs`,
    healthCheck: `http://localhost:${port}/health`
  }, 'CMIS API server running');
});


