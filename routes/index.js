const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const doesUserHavePermission = require('../middlewares/auth');

router.use(doesUserHavePermission);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('*', (req, res) => {
  res.status(404).send({ message: 'Page not found 404' });
});

module.exports = router;
