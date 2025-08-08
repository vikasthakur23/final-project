const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.getMe = async (req, res) => {
  const user = req.user;
  res.json({ user });
};

// simple admin creation route (protected by superadmin)
exports.createAdmin = async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) return res.status(400).json({ message: 'Missing' });

  let user = await User.findOne({ email });
  if (!user) user = await User.create({ email, name, role: 'admin' });
  else user.role = 'admin', await user.save();

  res.json({ ok: true, user });
};
