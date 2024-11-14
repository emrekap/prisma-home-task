import express from 'express';
import { prisma } from '../libs/db';
import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { randomUUID } from 'crypto';


// All routes has /guestbook prefix
const router = express.Router();

/**
 * @GET /guestbook/entiries
 * @returns all books
 */
router.get('/', async (_req, res) => {
  const entries = await prisma.guestBookEntry.findMany({ select: { id: true, user: true, content : true }, orderBy: { createdAt: 'desc' } });
  res.json(entries);
});

/**
 * @GET /guestbook/entries/:id
 * @returns all books
 */
router.get('/entries/:id',
  validateRequest({
    params: z.object({
      id: z.string().uuid(),
    }),
  }), async (req, res) => {
    const entry = await prisma.guestBookEntry.findFirst({ include: { user: true }, where: { id: req.params.id } });
    if (!entry) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Entry not found' });
    res.json(entry);
  });



/**
 * @POST /guestbook/entry
 * Create guestbook entries on user
 */
router.post('/entry',
  validateRequest({
    body: z.object({
      content: z.string().min(1),
      userId: z.string().uuid(),
    }),
  }),
  async (req, res, next) => {
    try {
      const id = randomUUID();
      const entries = await prisma.guestBookEntry.create({
        data:
        {
          id,
          content: req.body.content,
          userId: req.body.userId,
        },
      });
      res.json(entries);
    } catch (error) {
      next(error);
    }

  });


/**
 * @PUT /guestbook/entry/:id
 * Updates guestbook entry with given id
 */
router.put('/entry/:id',
  validateRequest({
    params: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      content: z.string().min(1),
    }),
  }),
  async (req, res, next) => {
    try {
      const entry = await prisma.guestBookEntry.findFirst({ where: { id: req.params.id } });
      if (!entry) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Entry not found' });
  
      const updated = await prisma.guestBookEntry.update({
        data: {
          content: req.body.content,
        },
        where: { id: req.params.id },
      });
      res.json(updated);
    } catch (error) {
      next(error);
    }

  });


/**
 * @DELETE /guestbook/entry/:id
 * Deletes guestbook entry with given id
 */
router.delete('/entry/:id',
  validateRequest({
    params: z.object({
      id: z.string().uuid(),
    }),
  }),
  async (req, res, next) => {
    try {
      const entry = await prisma.guestBookEntry.findFirst({ where: { id: req.params.id } });
      if (!entry) return res.status(StatusCodes.NOT_FOUND).json({ message: 'Entry not found' });
  
      await prisma.guestBookEntry.delete({
        where: { id: req.params.id },
      });
      res.end();
    } catch (error) {
      next(error);
    }

  });



export default router;
