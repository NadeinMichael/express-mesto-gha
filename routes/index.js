const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const doesUserHavePermission = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');

router.use(doesUserHavePermission);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Page not found'));
});

module.exports = router;
