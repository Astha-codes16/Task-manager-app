// const express = require('express');
// const app = express();
// const { v4: uuidv4 } = require('uuid');
// const PORT = 3000;
// const mongoose = require('mongoose');
// const authRoutes = require('./routes/auth');
// const authMiddleware = require('./middleware/auth');

// const Task = require('./models/Task');
// app.use(express.static('public'));
// app.use(express.json());
// app.use('/auth', authRoutes);
// // async function connectToDB() {
// //   try {
// //     await mongoose.connect('mongodb://127.0.0.1:27017/Notes_CRUD', {
// //       useNewUrlParser: true,
// //       useUnifiedTopology: true,
// //     });
// //     console.log("✅ Connected to MongoDB");
// //   } catch (err) {
// //     console.error("❌ MongoDB connection error:", err);
// //   }
// // }

// // connectToDB();
// // async function connectDB() {
// //   try {
// //     await mongoose.connect('mongodb://127.0.0.1:27017/taskplanner');
// //     console.log('✅ Connected to MongoDB');
// //   } catch (err) {
// //     console.error('❌ MongoDB connection error:', err);
// //   }
// // }
// async function connectDB()
// {
//   try{
//     await mongoose.connect('mongodb://127.0.0.1:27017/taskplanner');
    
//       console.log('connected');
    
//   }
//   catch(err)
//   {
//     console.error(err);
//   }
// }
// // Call the function to connect
// connectDB();


// // let tasks = [];

// // Get all tasks
// // app.get('/tasks', (req, res) => {
// //   res.json(tasks);
// // });

// app.get('/tasks', async (req, res) => {
//   const tasks = await Task.find();
//   res.json(tasks);
// });


// // Get a task by ID
// // app.get('/tasks/:id', (req, res) => {
// //   const task = tasks.find(t => t.id === req.params.id);
// //   if (!task) return res.status(404).json({ error: "Task not found" });
// //   res.json(task);
// // });
// app.get('/tasks/:id', async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ error: 'Task not found' });
//     res.json(task);
//   } catch (err) {
//     res.status(400).json({ error: 'Invalid ID format' });
//   }
// });


// // Create a task
// // app.post('/tasks', (req, res) => {
// //   const { title, description, deadline } = req.body;
// //   const task = { id: uuidv4(), title, description, deadline, status: 'pending' };
// //   tasks.push(task);
// //   res.status(201).json(task);
// // });
// app.post('/tasks', async (req, res) => {
//   const { title, deadline, description } = req.body;
//   const newTask = new Task({ title, deadline,description });
//   await newTask.save();
//   res.status(201).json(newTask);
// });


// // Update a task
// // app.put('/tasks/:id', (req, res) => {
// //   const { title, description, deadline } = req.body;
// //   const task = tasks.find(t => t.id === req.params.id);
// //   if (!task) return res.status(404).json({ error: "Task not found" });

// //   task.title = title;
// //   task.description = description;
// //   task.deadline = deadline;
// //   res.json(task);
// // });
// // app.put('/tasks/:id', async (req, res) => {
// //   const { title, deadline,description } = req.body;
// //   const updatedTask = await Task.findByIdAndUpdate(
// //     req.params.id,
// //     { title, deadline,description },
// //     { new: true }
// //   );
// //   res.json(updatedTask);
// // });
// app.put('/tasks/:id',async(req,res)=>{
//   const{title,deadline,description}=req.body;
//   const updatedtask=await Task.findByIdAndUpdate(
//     req.params.id,
//     {title,deadline,description},
//     {new:true},
//   );
//   res.json(updatedtask);
// })
// // Toggle status
// // app.patch('/tasks/:id', (req, res) => {
// //   const task = tasks.find(t => t.id === req.params.id);
// //   if (!task) return res.status(404).json({ error: "Task not found" });

// //   task.status = task.status === 'pending' ? 'completed' : 'pending';
// //   res.json(task);
// // });
// // app.patch('/tasks/:id',(req,res)=>{
// //   const task=tasks.find(task=>task.id===req.params.id);
// //   task.status=task.status==='pending'?'completed':'pending';
// //   res.json(task);
// // })
// // app.patch('/tasks/:id', async (req, res) => {
// //   const task = await Task.findById(req.params.id);
// //   if (!task) return res.status(404).send("Task not found");

// //   task.status = (task.status === 'pending') ? 'done' : 'pending';
// //   await task.save();
// //   res.json(task);
// // });
// app.patch('/tasks/:id',async(req,res)=>
// {
//   try{const task=await Task.findById(req.params.id);
  
//   task.status=task.status==='pending'?'completed':'pending';
//   await task.save();
//   res.json(task);}
//   catch(err)
//   {
//     console.log("The error is",err);
//   }
// })

// // Delete a task
// // app.delete('/tasks/:id', (req, res) => {
// //   tasks = tasks.filter(t => t.id !== req.params.id);
// //   res.status(204).end();
// // });
// app.delete('/tasks/:id', async (req, res) => {
//   await Task.findByIdAndDelete(req.params.id);
//   res.status(204).end();
// });

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const authMiddleware = require('./middleware/auth');

const app = express();
app.use(express.json());
app.use(express.static('public'));


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/auth', authRoutes);
app.use('/tasks', authMiddleware, taskRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
















// // === server.js ===
// const express = require('express');
// const app = express();
// const PORT = 3000;

// let notes = []; // In-memory notes array

// app.use(express.static('public'));
// app.use(express.json());

// app.get('/api/notes', (req, res) => {
//   res.json(notes);
// });

// app.post('/api/notes', (req, res) => {
//   const { title, content } = req.body;
//   if (!title || !content) {
//     return res.status(400).json({ error: 'Title and content are required' });
//   }

//   const note = {
//     id: Date.now(),
//     title,
//     content,
//     timestamp: new Date().toISOString(),
//   };

//   notes.push(note);
//   res.status(201).json(note);
// });

// app.put('/api/notes/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   const { title, content } = req.body;
//   const note = notes.find(note => note.id === id);
//   if (!note) {
//     return res.status(404).json({ error: 'Note not found' });
//   }
//   note.title = title;
//   note.content = content;
//   res.json(note); //this is implicitly returning status==200;
// });

// app.delete('/api/notes/:id', (req, res) => {
//   const id = parseInt(req.params.id);
//   notes = notes.filter(note => note.id !== id);
//   res.status(204).end();
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

