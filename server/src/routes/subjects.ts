import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

router.use(requireAuth);

// List subjects (ADMIN/STAFF)
router.get('/', requireRole(['ADMIN', 'STAFF']), async (_req, res) => {
  const subjects = await prisma.subject.findMany({
    include: { 
      course: { select: { id: true, name: true, code: true } }
    }
  });
  res.json(subjects);
});

// Create subject (ADMIN/STAFF)
const createSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  courseId: z.string().uuid()
});

router.post('/', requireRole(['ADMIN', 'STAFF']), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { name, code, courseId } = parsed.data;
  
  const exists = await prisma.subject.findFirst({
    where: { OR: [{ name }, { code }] }
  });
  if (exists) return res.status(409).json({ error: 'Subject name or code already exists' });
  
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  
  const subject = await prisma.subject.create({ 
    data: { name, code, courseId },
    include: { course: true }
  });
  res.status(201).json(subject);
});

export default router;
