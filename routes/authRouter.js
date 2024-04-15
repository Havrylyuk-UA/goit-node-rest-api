import express from 'express';
import authControllers from '../controllers/authControllers.js';
import {
  userSigninSchema,
  userSignupSchema,
  emailSchemas,
} from '../schemas/usersSchemas.js';
import validateBody from '../decorators/validateBody.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';
import emailControllers from '../controllers/emailControllers.js';

const authRouter = express.Router();

authRouter.post(
  '/register',
  validateBody(userSignupSchema),
  authControllers.signup
);

authRouter.post(
  '/login',
  validateBody(userSigninSchema),
  authControllers.signin
);

authRouter.get('/current', authenticate, authControllers.getCurrent);

authRouter.post('/logout', authenticate, authControllers.signout);

authRouter.patch(
  '/avatars',
  upload.single('avatar'),
  authenticate,
  authControllers.updateAvatar
);

authRouter.post(
  '/verify',
  validateBody(emailSchemas),
  emailControllers.resendVerifyEmail
);

authRouter.get('/verify/:verificationToken', emailControllers.verifyEmail);

export default authRouter;
