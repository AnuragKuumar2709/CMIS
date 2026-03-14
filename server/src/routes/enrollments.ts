import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

router.use(requireAuth);

// List enrollments (ADMIN/STAFF)
router.get('/', requireRole(['ADMIN', 'STAFF']), async (_req, res) => {
  const enrollments = await prisma.enrollment.findMany({
    include: { 
      student: { 
        select: { 
          id: true, 
          firstName: true, 
          lastName: true, 
          rollNumber: true,
          user: { select: { email: true } }
        } 
      }, 
      course: { select: { id: true, name: true, code: true } } 
    }
  });
  res.json(enrollments);
});

// Create enrollment (ADMIN/STAFF)
const createSchema = z.object({
  studentId: z.string().uuid(),
  courseId: z.string().uuid()
});

router.post('/', requireRole(['ADMIN', 'STAFF']), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { studentId, courseId } = parsed.data;
  
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return res.status(404).json({ error: 'Student not found' });
  
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  
  const existing = await prisma.enrollment.findUnique({
    where: { studentId_courseId: { studentId, courseId } }
  });
  if (existing) return res.status(409).json({ error: 'Student already enrolled in this course' });
  
  const enrollment = await prisma.enrollment.create({ 
    data: { studentId, courseId },
    include: { student: true, course: true }
  });
  res.status(201).json(enrollment);
});

export default router;
