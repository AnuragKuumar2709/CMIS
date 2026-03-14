import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

router.use(requireAuth);

// List courses (ADMIN/STAFF)
router.get('/', requireRole(['ADMIN', 'STAFF']), async (_req, res) => {
  const courses = await prisma.course.findMany({
    include: { 
      department: { select: { id: true, name: true, code: true } },
      students: { select: { id: true, firstName: true, lastName: true } }
    }
  });
  res.json(courses);
});

// Create course (ADMIN/STAFF)
const createSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  credits: z.number().int().positive(),
  departmentId: z.string().uuid()
});

router.post('/', requireRole(['ADMIN', 'STAFF']), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { name, code, credits, departmentId } = parsed.data;
  
  const exists = await prisma.course.findFirst({
    where: { OR: [{ name }, { code }] }
  });
  if (exists) return res.status(409).json({ error: 'Course name or code already exists' });
  
  const department = await prisma.department.findUnique({ where: { id: departmentId } });
  if (!department) return res.status(404).json({ error: 'Department not found' });
  
  const course = await prisma.course.create({ 
    data: { name, code, credits, departmentId },
    include: { department: true }
  });
  res.status(201).json(course);
});

export default router;
