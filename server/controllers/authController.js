const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const createAuditLog = require('../utils/auditLogger');

// @desc  Register new user
// @route POST /api/auth/register
// @access Public
const register = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, department });

    await createAuditLog({
      userId: user._id,
      userEmail: user.email,
      action: 'USER_REGISTER',
      description: `New user registered: ${user.email}`,
      resourceId: user._id,
      resourceType: 'User',
      ipAddress: req.ip,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        department: user.department,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// @desc  Login user
// @route POST /api/auth/login
// @access Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account deactivated. Contact administrator.' });
    }

    // Update login stats
    user.lastLogin = new Date();
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save({ validateBeforeSave: false });

    await createAuditLog({
      userId: user._id,
      userEmail: user.email,
      action: 'USER_LOGIN',
      description: `User logged in: ${user.email}`,
      resourceId: user._id,
      resourceType: 'User',
      ipAddress: req.ip,
    });

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        department: user.department,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        loginCount: user.loginCount,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc  Logout user
// @route POST /api/auth/logout
// @access Private
const logout = async (req, res) => {
  try {
    if (req.user) {
      await createAuditLog({
        userId: req.user.id,
        userEmail: req.user.email,
        action: 'USER_LOGOUT',
        description: `User logged out: ${req.user.email}`,
        resourceId: req.user.id,
        resourceType: 'User',
        ipAddress: req.ip,
      });
    }

    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ success: false, message: 'Server error during logout' });
  }
};

// @desc  Get current user
// @route GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('GetMe error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc  Update current user profile / password
// @route PUT /api/auth/me
// @access Private
const updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { name, department, currentPassword, newPassword } = req.body;

    if (name !== undefined) user.name = name.trim();
    if (department !== undefined) user.department = department.trim();

    if (newPassword) {
      if (!currentPassword) return res.status(400).json({ success: false, message: 'Current password is required to change password' });
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      if (newPassword.length < 8) return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
      user.password = newPassword;
    }

    await user.save();
    await createAuditLog({ userId: user._id, userEmail: user.email, action: 'USER_UPDATED', description: `User updated profile: ${user.email}`, resourceId: user._id, resourceType: 'User', ipAddress: req.ip });

    const updated = await User.findById(user._id).select('-password');
    return res.status(200).json({ success: true, message: 'Profile updated', data: updated });
  } catch (err) {
    console.error('updateMe error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { register, login, logout, getMe, updateMe };
