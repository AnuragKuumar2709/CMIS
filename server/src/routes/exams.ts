import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

router.use(requireAuth);

// List exams (ADMIN/STAFF)
router.get('/', requireRole(['ADMIN', 'STAFF']), async (_req, res) => {
  const exams = await prisma.exam.findMany({
    include: { 
      subject: { select: { id: true, name: true, code: true } }
    },
    orderBy: { date: 'desc' }
  });
  res.json(exams);
});

// Create exam (ADMIN/STAFF)
const createExamSchema = z.object({
  name: z.string().min(1),
  subjectId: z.string().uuid(),
  date: z.string().datetime(),
  totalMarks: z.number().int().positive(),
  duration: z.number().int().positive() // in minutes
});

router.post('/', requireRole(['ADMIN', 'STAFF']), async (req, res) => {
  const parsed = createExamSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { name, subjectId, date, totalMarks, duration } = parsed.data;
  
  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
  if (!subject) return res.status(404).json({ error: 'Subject not found' });
  
  const exam = await prisma.exam.create({ 
    data: { name, subjectId, date: new Date(date), totalMarks, duration },
    include: { subject: true }
  });
  res.status(201).json(exam);
});

// List grades for an exam (ADMIN/STAFF)
router.get('/:examId/grades', requireRole(['ADMIN', 'STAFF']), async (req, res) => {
  const { examId } = req.params;
  const grades = await prisma.grade.findMany({
    where: { examId },
    include: { 
      student: { select: { id: true, firstName: true, lastName: true, rollNumber: true } },
      exam: { select: { id: true, name: true, totalMarks: true } }
    },
    orderBy: { marks: 'desc' }
  });
  res.json(grades);
});

// Add/Update grade (ADMIN/STAFF)
const gradeSchema = z.object({
  studentId: z.string().uuid(),
  marks: z.number().int().min(0),
  remarks: z.string().optional()
});

router.post('/:examId/grades', requireRole(['ADMIN', 'STAFF']), async (req, res) => {
  const { examId } = req.params;
  const parsed = gradeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { studentId, marks, remarks } = parsed.data;
  
  const exam = await prisma.exam.findUnique({ where: { id: examId } });
  if (!exam) return res.status(404).json({ error: 'Exam not found' });
  
  if (marks > exam.totalMarks) {
    return res.status(400).json({ error: 'Marks cannot exceed total marks' });
  }
  
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return res.status(404).json({ error: 'Student not found' });
  
  // Check if student is enrolled in the course that contains this subject
  const enrollment = await prisma.enrollment.findFirst({
    where: { 
      studentId,
      course: { subjects: { some: { id: exam.subjectId } } }
    }
  });
  if (!enrollment) return res.status(400).json({ error: 'Student not enrolled in this course' });
  
  // Upsert grade (create or update)
  const grade = await prisma.grade.upsert({
    where: { studentId_examId: { studentId, examId } },
    update: { marks, remarks },
    create: { studentId, examId, marks, remarks }
  });
  
  res.status(201).json(grade);
});

export default router;
