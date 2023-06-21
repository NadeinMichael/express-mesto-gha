const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.get('*', (req, res) => {
  res.status(404).send({ message: '404' });
});

module.exports = router;
