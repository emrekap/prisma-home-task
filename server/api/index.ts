import express from 'express';

import users from './users';
import guestbook from './guestbook';

const router = express.Router();


router.use('/users', users);
router.use('/guestbook', guestbook);

export default router;
