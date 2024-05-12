import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Jimp from 'jimp';
import fs from 'fs/promises';
import path from 'path';
import gravatar from 'gravatar';
import 'dotenv/config';
import * as authServices from '../services/authServices.js';
import { nanoid } from 'nanoid';

import ctrlWrapper from '../decorators/ctrlWrapper.js';
import HttpError from '../helpers/HttpError.js';
import sendEmail from '../helpers/sendlerEmail.js';

const { JWT_SECRET, PROJECT_URL } = process.env;

const avatarsPath = path.resolve('public', 'avatars');

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });

  if (user) {
    throw HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const avatarURL = gravatar.url(email);

  const verificationToken = nanoid();

  const newUser = await authServices.signup({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const mail = {
    to: email,
    subject: 'Verify email',
    html: `<p>Hello, thank you for using our service, please confirm your email </p>
    <a target="_blank" href="${PROJECT_URL}/api/users/verify/${verificationToken}">Verify email</a>`,
  };

  try {
    await sendEmail(mail);
    return res.status(201).json({
      user: newUser,
      message: 'Verification email sent',
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });

  if (!user) {
    throw HttpError(401, 'Email or password is invalid');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, 'Email or password is invalid');
  }

  if (!user.verify) {
    return res
      .status(401)
      .json({ message: 'Email not verified. Access denied' });
  }

  const { _id: id } = user;

  const payload = {
    id,
    email,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '23h' });
  const response = await authServices.updateUser({ _id: id }, { token });

  res.json({
    token,
    user: response,
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;

  await authServices.updateUser({ _id }, { token: '' });

  res.status(204).json();
};

const updateAvatar = async (req, res) => {
  if (!req.file) throw HttpError(400, 'The file was not found');

  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  const image = await Jimp.read(tempUpload);
  if (!image) throw new Error('Failed to read image');

  await image.resize(250, 250).writeAsync(tempUpload);

  const uniquePrefix = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsPath, uniquePrefix);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join('avatars', uniquePrefix);

  await authServices.updateUser({ _id }, { avatarURL });

  res.json({
    avatarURL,
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
