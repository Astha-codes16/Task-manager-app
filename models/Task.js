// const mongoose = require('mongoose');

// const taskSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String,required:true },
//   deadline: { type: Date }, // change from String to Date
//   status: { type: String, enum: ['pending', 'completed'], default: 'pending' }
// });


// module.exports = mongoose.model('Task', taskSchema);
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  deadline: Date,
  number:Number,
  status: { type: String, default: 'pending' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Task', taskSchema);
