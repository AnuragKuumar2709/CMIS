import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

router.use(requireAuth);

// List attendance (ADMIN/STAFF)
router.get('/', requireRole(['ADMIN', 'STAFF']), async (req, res) => {
  const { studentId, subjectId, date } = req.query;
  
  const where: any = {};
  if (studentId) where.studentId = studentId as string;
  if (subjectId) where.subjectId = subjectId as string;
  if (date) where.date = new Date(date as string);
  
  const attendance = await prisma.attendance.findMany({
    where,
    include: { 
      student: { 
        select: { 
          id: true, 
          firstName: true, 
          lastName: true, 
          rollNumber: true 
        } 
      }, 
      subject: { select: { id: true, name: true, code: true } } 
    },
    orderBy: { date: 'desc' }
  });
  res.json(attendance);
});

// Create attendance (ADMIN/STAFF)
const createSchema = z.object({
  studentId: z.string().uuid(),
  subjectId: z.string().uuid(),
  date: z.string().datetime(),
  present: z.boolean()
});

router.post('/', requireRole(['ADMIN', 'STAFF']), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { studentId, subjectId, date, present } = parsed.data;
  
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return res.status(404).json({ error: 'Student not found' });
  
  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
  if (!subject) return res.status(404).json({ error: 'Subject not found' });
  
  const existing = await prisma.attendance.findUnique({
    where: { studentId_subjectId_date: { studentId, subjectId, date: new Date(date) } }
  });
  if (existing) return res.status(409).json({ error: 'Attendance already marked for this student, subject, and date' });
  
  const attendance = await prisma.attendance.create({ 
    data: { studentId, subjectId, date: new Date(date), present },
    include: { student: true, subject: true }
  });
  res.status(201).json(attendance);
});

export default router;
