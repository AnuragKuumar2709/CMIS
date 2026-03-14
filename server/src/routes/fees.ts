import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

router.use(requireAuth);

// List fees (ADMIN/STAFF)
router.get('/', requireRole(['ADMIN', 'STAFF']), async (req, res) => {
  const { studentId, status } = req.query;
  
  const where: any = {};
  if (studentId) where.studentId = studentId as string;
  if (status) where.status = status as string;
  
  const fees = await prisma.fee.findMany({
    where,
    include: { 
      student: { 
        select: { 
          id: true, 
          firstName: true, 
          lastName: true, 
          rollNumber: true,
          course: { select: { id: true, name: true } }
        } 
      } 
    },
    orderBy: { dueDate: 'asc' }
  });
  res.json(fees);
});

// Create fee record (ADMIN/STAFF)
const createFeeSchema = z.object({
  studentId: z.string().uuid(),
  amount: z.number().positive(),
  description: z.string().min(1),
  dueDate: z.string().datetime(),
  feeType: z.enum(['TUITION', 'EXAM', 'LIBRARY', 'OTHER'])
});

router.post('/', requireRole(['ADMIN', 'STAFF']), async (req, res) => {
  const parsed = createFeeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { studentId, amount, description, dueDate, feeType } = parsed.data;
  
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return res.status(404).json({ error: 'Student not found' });
  
  const fee = await prisma.fee.create({ 
    data: { 
      studentId, 
      amount, 
      description, 
      dueDate: new Date(dueDate), 
      feeType,
      status: 'PENDING'
    },
    include: { student: true }
  });
  res.status(201).json(fee);
});

// Record payment (ADMIN/STAFF)
const paymentSchema = z.object({
  amount: z.number().positive(),
  paymentMethod: z.enum(['CASH', 'CARD', 'BANK_TRANSFER', 'ONLINE']),
  reference: z.string().optional(),
  remarks: z.string().optional()
});

router.post('/:feeId/pay', requireRole(['ADMIN', 'STAFF']), async (req, res) => {
  const { feeId } = req.params;
  const parsed = paymentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { amount, paymentMethod, reference, remarks } = parsed.data;
  
  const fee = await prisma.fee.findUnique({ where: { id: feeId } });
  if (!fee) return res.status(404).json({ error: 'Fee record not found' });
  
  if (fee.status === 'PAID') {
    return res.status(400).json({ error: 'Fee already paid' });
  }
  
  if (amount > fee.amount) {
    return res.status(400).json({ error: 'Payment amount cannot exceed fee amount' });
  }
  
  // Update fee status
  const updatedFee = await prisma.fee.update({
    where: { id: feeId },
    data: { 
      status: amount >= fee.amount ? 'PAID' : 'PARTIAL',
      paidAmount: (fee.paidAmount || 0) + amount,
      paidDate: new Date()
    },
    include: { student: true }
  });
  
  // Create payment record
  const payment = await prisma.payment.create({
    data: {
      feeId,
      amount,
      paymentMethod,
      reference,
      remarks,
      studentId: fee.studentId
    }
  });
  
  res.json({ fee: updatedFee, payment });
});

// Get student fee summary (ADMIN/STAFF/STUDENT)
router.get('/student/:studentId/summary', requireRole(['ADMIN', 'STAFF', 'STUDENT']), async (req, res) => {
  const { studentId } = req.params;
  
  // Check if user can access this student's data
  if (req.user?.role === 'STUDENT' && req.user.sub !== studentId) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  const fees = await prisma.fee.findMany({
    where: { studentId },
    orderBy: { dueDate: 'asc' }
  });
  
  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const totalPaid = fees.reduce((sum, fee) => sum + (fee.paidAmount || 0), 0);
  const totalPending = totalFees - totalPaid;
  
  const summary = {
    studentId,
    totalFees,
    totalPaid,
    totalPending,
    fees: fees.map(fee => ({
      id: fee.id,
      amount: fee.amount,
      paidAmount: fee.paidAmount || 0,
      status: fee.status,
      dueDate: fee.dueDate,
      description: fee.description,
      feeType: fee.feeType
    }))
  };
  
  res.json(summary);
});

export default router;
