const jwt = require('jsonwebtoken');

const JWT_SECRET = 'unique-secret-key';

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
module.exports = {
  generateToken,
};
