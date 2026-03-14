import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'College Management Information System (CMIS) API',
      version: '1.0.0',
      description: 'A comprehensive API for managing college operations including students, courses, fees, attendance, and more.',
      contact: {
        name: 'CMIS Development Team',
        email: 'support@cmis.edu'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['ADMIN', 'STAFF', 'STUDENT'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Student: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            rollNumber: { type: 'string' },
            batch: { type: 'string' },
            courseId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Course: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            code: { type: 'string' },
            credits: { type: 'integer' },
            departmentId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Fee: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            studentId: { type: 'string', format: 'uuid' },
            amount: { type: 'integer' },
            description: { type: 'string' },
            dueDate: { type: 'string', format: 'date-time' },
            feeType: { type: 'string', enum: ['TUITION', 'EXAM', 'LIBRARY', 'OTHER'] },
            status: { type: 'string', enum: ['PENDING', 'PAID', 'PARTIAL', 'OVERDUE'] },
            paidAmount: { type: 'integer' },
            paidDate: { type: 'string', format: 'date-time' }
          }
        },
        Exam: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            subjectId: { type: 'string', format: 'uuid' },
            date: { type: 'string', format: 'date-time' },
            totalMarks: { type: 'integer' },
            duration: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Grade: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            studentId: { type: 'string', format: 'uuid' },
            examId: { type: 'string', format: 'uuid' },
            marks: { type: 'integer' },
            remarks: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Attendance: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            studentId: { type: 'string', format: 'uuid' },
            subjectId: { type: 'string', format: 'uuid' },
            date: { type: 'string', format: 'date-time' },
            present: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'object' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/index.ts']
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
