const router = require('express').Router();
const Task = require('../models/Task');

router.get('/', async (req, res) => res.json(await Task.find()));
router.post('/', async (req, res) => res.json(await Task.create(req.body)));
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'deleted' });
});

router.patch('/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

module.exports = router;
