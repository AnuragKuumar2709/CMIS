import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

router.use(requireAuth);

// List students (ADMIN/STAFF)
router.get('/', requireRole(['ADMIN', 'STAFF']), async (_req, res) => {
  const students = await prisma.student.findMany({
    include: { user: { select: { email: true, role: true } }, course: true }
  });
  res.json(students);
});

// Create student (ADMIN/STAFF)
const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  rollNumber: z.string().min(1),
  batch: z.string().min(1),
  courseId: z.string().uuid()
});

router.post('/', requireRole(['ADMIN', 'STAFF']), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password, firstName, lastName, rollNumber, batch, courseId } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: 'Email already in use' });
  const bcrypt = await import('bcrypt');
  const passwordHash = await bcrypt.default.hash(password, 10);
  const student = await prisma.student.create({
    data: {
      user: { create: { email, passwordHash, role: 'STUDENT' } },
      firstName,
      lastName,
      rollNumber,
      batch,
      course: { connect: { id: courseId } }
    },
    include: { user: { select: { email: true, role: true } }, course: true }
  });
  res.status(201).json(student);
});

export default router;


