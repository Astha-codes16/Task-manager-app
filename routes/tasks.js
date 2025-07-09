const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

router.get('/', async (req, res) => {

const tasks = await Task.find({ userId: req.userId }).sort({ number: 1 });
  res.json(tasks);
});
// 🟢 Get One Task by ID (for Edit)
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id});
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching task' });
  }
});

router.post('/', async (req, res) => {
     console.log("req.userId =", req.userId); 
    const count = await Task.countDocuments({ userId:req.userId  });
   console.log(count);

   
  const { title, deadline, description } = req.body;
  const newTask = new Task({ title, deadline, description, userId: req.userId,number:count+1 });
  await newTask.save();
  res.status(201).end();
});

router.put('/:id', async (req, res) => {
  const { title, deadline, description } = req.body;
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    { title, deadline, description },
    { new: true }
  );
  res.json(updatedTask);
});

router.patch('/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.status = task.status === 'completed' ? 'pending' : 'completed';
  await task.save();
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
   const tasks = await Task.find({ userId: req.userId }).sort({ number: 1 });
    for (let i = 0; i < tasks.length; i++) {
      tasks[i].number = i + 1;
      await tasks[i].save();}
  res.status(204).end();
});

module.exports = router;