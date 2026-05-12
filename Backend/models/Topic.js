import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  done: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: "",
    trim: true
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const Topic = mongoose.model('Topic', topicSchema);

export default Topic;