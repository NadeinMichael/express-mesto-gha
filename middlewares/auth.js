const jwt = require('jsonwebtoken');

const JWT_SECRET = 'unique-secret-key';

function doesUserHavePermission(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'нет доступа' });
  }

  let payload;
  try {
    payload = jwt.verify(req.headers.authorization, JWT_SECRET);
  } catch (e) {
    return res.status(401).send({ message: 'нет доступа' });
  }
  req.user = payload;
  return next();
}

module.exports = doesUserHavePermission;
