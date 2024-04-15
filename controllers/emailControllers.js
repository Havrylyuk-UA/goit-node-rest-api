import HttpError from '../helpers/HttpError.js';
import sendEmail from '../helpers/sendlerEmail.js';
import User from '../models/users.js';
import ctrlWrapper from '../decorators/ctrlWrapper.js';

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, 'User not found');
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  res.json({
    message: 'Verifycation successful',
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return HttpError(400, 'User not found');
  }

  if (user.verify) {
    return res
      .status(400)
      .json({ message: 'Verification has already been passed' });
  }

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">Verify email</a>`,
  };

  try {
    await sendEmail(verifyEmail);
    return res.status(201).json({
      message: 'Verification email sent',
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export default {
  verifyEmail: ctrlWrapper(verifyEmail),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
};
