import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { StrictAuthProp } from '@clerk/clerk-sdk-node';

export const identityRouter = Router();

type AuthRequest = Request & StrictAuthProp;

// ProfileUpdateSchema for validating POST /profile/update body
const ProfileUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be 255 characters or less'),
  email: z.string().email('Invalid email format').optional(),
  avatar: z.string().url('Avatar must be a valid URL').optional(),
  civilization: z.string().max(255, 'Civilization must be 255 characters or less').optional(),
  role: z.string().max(255, 'Role must be 255 characters or less').optional(),
});

identityRouter.get('/profile', async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.auth?.userId;

  // Guard against null/undefined userId
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const userProfiles = await db.select().from(users).where(eq(users.id, userId));
    const profile = userProfiles[0];

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({
      status: 'success',
      profile
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

identityRouter.post('/profile/update', async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.auth?.userId;

  // Guard against null/undefined userId
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Validate request body with ProfileUpdateSchema
  const parseResult = ProfileUpdateSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      error: 'Validation failed',
      issues: parseResult.error.issues,
    });
  }

  const { name, email, avatar, civilization, role } = parseResult.data;

  try {
    // Upsert behavior
    const existing = await db.select().from(users).where(eq(users.id, userId));

    if (existing.length === 0) {
      await db.insert(users).values({
        id: userId,
        name: name || 'Anonymous',
        civilization: civilization || 'Unknown',
        role: role || 'Initiate',
      });
    } else {
      await db.update(users).set({
        name: name || existing[0].name,
        civilization: civilization || existing[0].civilization,
        role: role || existing[0].role,
        lastActive: new Date(),
      }).where(eq(users.id, userId));
    }

    const updatedProfile = await db.select().from(users).where(eq(users.id, userId));

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      profile: updatedProfile[0],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});
