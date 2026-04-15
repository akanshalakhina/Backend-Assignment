const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../user/user.model');
const ApiError = require('../../utils/ApiError');
const ApiResponse = require('../../utils/ApiResponse');
const catchAsync = require('../../utils/catchAsync');

function generateToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'Email is already in use');
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed });

  const token = generateToken(user);

  return res
    .status(201)
    .json(new ApiResponse(201, 'User registered successfully', { token }));
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user);

  return res
    .status(200)
    .json(new ApiResponse(200, 'Login successful', { token, role: user.role }));
});

const me = catchAsync(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(200, 'Current user profile', {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
    })
  );
});

module.exports = { register, login, me };
