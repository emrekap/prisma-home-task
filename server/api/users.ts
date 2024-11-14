import express from 'express';
import { validateRequest } from 'zod-express-middleware';
import { z } from 'zod';
import { prisma } from '../libs/db';
import { StatusCodes } from 'http-status-codes';
import { randomUUID } from 'crypto';
import { checkUserExists } from '../middlewares';

// All routes has /users prefix
const router = express.Router();

/**
 * @GET /users
 * @returns lists users
 */
router.get('/', async (_req, res) => {
  const users = await prisma.user.findMany({
    include: {
      _count: true,
    },
    orderBy: {
      entries: { _count: 'desc' },
    },
  });
  res.json(users.map(user => ({
    id : user.id,
    createdAt:user.createdAt,
    email: user.email,
    fullName: user.fullName,
    entries: user._count.entries,
    thumbnailUrl: user.thumbnailUrl,
  }),
  ));
});


/**
 * @GET /users/:id
 * @returns user detail with given id
 */
router.get('/:id',
  validateRequest({
    params: z.object({
      id: z.string().uuid(),
    }),
  }),
  checkUserExists,
  async (req, res, next) => {
    try {
      const user = await prisma.user.findFirstOrThrow({
        where: { id: req.params.id },
        include: {
          entries: true,
        },
      });
      res.json(user);

    } catch (error) {
      next(error);
    }

  });

/**
 * @POST /users
 * Creates user with given name and email
 */
router.post('/',
  validateRequest({
    body: z.object({
      fullName: z.string(),
      email: z.string().email(),
      thumbnailUrl: z.string().url().optional(),
    }),
  }),
  async (req, res, next) => {
    try {
      const existingUser = await prisma.user.findFirst({
        where: { email: req.body.email },
      });
      if (existingUser) {
        return res.status(StatusCodes.CONFLICT).json({ message: 'Email already exists' });
      }
      // Generate uuid on server side to reduce work load on the database
      const id = randomUUID();
      await prisma.user.create({
        data: {
          id,
          fullName: req.body.fullName,
          email: req.body.email,
          thumbnailUrl: req.body.thumbnailUrl,
        },
      });
      res.status(StatusCodes.CREATED).json({
        id,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

/**
 * @PUT /users/:id
 * Updates user with given id
 */
router.put('/:id',
  validateRequest({
    params: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      fullName: z.string(),
      thumbnailUrl: z.string().url().optional(),
    }),
  }),
  checkUserExists,
  async (req, res, next) => {
    try {
      const updated = await prisma.user.update({
        where: { id: req.params.id },
        data: {
          fullName: req.body.fullName,
          thumbnailUrl: req.body.thumbnailUrl,
        },
      });
      res.json(updated);
    } catch (error) {
      console.log(error);
      next(error);
    }
  });


/**
 * @DELETE /users/:id
 * Deletes user with given id
 */
router.delete('/:id',
  validateRequest({
    params: z.object({
      id: z.string().uuid(),
    }),
  }),
  checkUserExists,
  async (req, res, next) => {
    try {
      await prisma.user.delete({
        where: { id: req.params.id },
      });
      res.end();
    } catch (error) {
      console.log(error);
      next(error);
    }
  });


export default router;
