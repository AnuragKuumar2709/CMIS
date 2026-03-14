import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

router.use(requireAuth);

// List departments (ADMIN/STAFF)
router.get('/', requireRole(['ADMIN', 'STAFF']), async (_req, res) => {
  const departments = await prisma.department.findMany({
    include: { courses: { select: { id: true, name: true, code: true } } }
  });
  res.json(departments);
});

// Create department (ADMIN/STAFF)
const createSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1)
});

router.post('/', requireRole(['ADMIN', 'STAFF']), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { name, code } = parsed.data;
  const exists = await prisma.department.findFirst({
    where: { OR: [{ name }, { code }] }
  });
  if (exists) return res.status(409).json({ error: 'Department name or code already exists' });
  const department = await prisma.department.create({ data: { name, code } });
  res.status(201).json(department);
});

export default router;
