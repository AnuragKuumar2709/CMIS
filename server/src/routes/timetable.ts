import { Router } from 'express';
import { prisma } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

router.use(requireAuth);

// List timetable entries (ADMIN/STAFF)
router.get('/', requireRole(['ADMIN', 'STAFF']), async (req, res) => {
  const { courseId, dayOfWeek, subjectId } = req.query;
  
  const where: any = {};
  if (courseId) where.courseId = courseId as string;
  if (dayOfWeek) where.dayOfWeek = dayOfWeek as string;
  if (subjectId) where.subjectId = subjectId as string;
  
  const timetable = await prisma.timetable.findMany({
    where,
    include: { 
      course: { select: { id: true, name: true, code: true } },
      subject: { select: { id: true, name: true, code: true } }
    },
    orderBy: [
      { dayOfWeek: 'asc' },
      { startTime: 'asc' }
    ]
  });
  res.json(timetable);
});

// Create timetable entry (ADMIN/STAFF)
const createTimetableSchema = z.object({
  courseId: z.string().uuid(),
  subjectId: z.string().uuid(),
  dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/), // HH:MM format
  room: z.string().min(1),
  instructor: z.string().min(1)
});

router.post('/', requireRole(['ADMIN', 'STAFF']), async (req, res) => {
  const parsed = createTimetableSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { courseId, subjectId, dayOfWeek, startTime, endTime, room, instructor } = parsed.data;
  
  // Validate time format and logic
  const start = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);
  if (start >= end) {
    return res.status(400).json({ error: 'End time must be after start time' });
  }
  
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  
  const subject = await prisma.subject.findUnique({ where: { id: subjectId } });
  if (!subject) return res.status(404).json({ error: 'Subject not found' });
  
  // Check if subject belongs to the course
  if (subject.courseId !== courseId) {
    return res.status(400).json({ error: 'Subject does not belong to the specified course' });
  }
  
  // Check for time conflicts (same room, same day, overlapping time)
  const conflictingEntry = await prisma.timetable.findFirst({
    where: {
      room,
      dayOfWeek,
      OR: [
        {
          AND: [
            { startTime: { lte: startTime } },
            { endTime: { gt: startTime } }
          ]
        },
        {
          AND: [
            { startTime: { lt: endTime } },
            { endTime: { gte: endTime } }
          ]
        },
        {
          AND: [
            { startTime: { gte: startTime } },
            { endTime: { lte: endTime } }
          ]
        }
      ]
    }
  });
  
  if (conflictingEntry) {
    return res.status(409).json({ error: 'Time slot conflicts with existing schedule' });
  }
  
  const timetableEntry = await prisma.timetable.create({ 
    data: { 
      courseId, 
      subjectId, 
      dayOfWeek, 
      startTime, 
      endTime, 
      room, 
      instructor 
    },
    include: { course: true, subject: true }
  });
  res.status(201).json(timetableEntry);
});

// Get timetable for a specific course (ADMIN/STAFF/STUDENT)
router.get('/course/:courseId', requireRole(['ADMIN', 'STAFF', 'STUDENT']), async (req, res) => {
  const { courseId } = req.params;
  
  const timetable = await prisma.timetable.findMany({
    where: { courseId },
    include: { 
      subject: { select: { id: true, name: true, code: true } }
    },
    orderBy: [
      { dayOfWeek: 'asc' },
      { startTime: 'asc' }
    ]
  });
  
  // Group by day for better organization
  const groupedTimetable = timetable.reduce((acc, entry) => {
    if (!acc[entry.dayOfWeek]) {
      acc[entry.dayOfWeek] = [];
    }
    acc[entry.dayOfWeek].push(entry);
    return acc;
  }, {} as Record<string, any[]>);
  
  res.json(groupedTimetable);
});

// Get student's personal timetable (STUDENT)
router.get('/my-timetable', requireRole(['STUDENT']), async (req, res) => {
  const studentId = req.user!.sub;
  
  // Get student's enrolled courses
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId },
    include: { course: true }
  });
  
  if (enrollments.length === 0) {
    return res.json({ message: 'No courses enrolled' });
  }
  
  const courseIds = enrollments.map(e => e.courseId);
  
  const timetable = await prisma.timetable.findMany({
    where: { courseId: { in: courseIds } },
    include: { 
      course: { select: { id: true, name: true, code: true } },
      subject: { select: { id: true, name: true, code: true } }
    },
    orderBy: [
      { dayOfWeek: 'asc' },
      { startTime: 'asc' }
    ]
  });
  
  // Group by day
  const groupedTimetable = timetable.reduce((acc, entry) => {
    if (!acc[entry.dayOfWeek]) {
      acc[entry.dayOfWeek] = [];
    }
    acc[entry.dayOfWeek].push(entry);
    return acc;
  }, {} as Record<string, any[]>);
  
  res.json(groupedTimetable);
});

export default router;
