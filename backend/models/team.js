const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
  google_id: {
    type: String,
  },
  name: {
    type: String,
  },
  picture: {
    type: String,
  },
});

const teamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  leader: {
    type: [userDetailsSchema],
  },
  members: [
    {
      type: [userDetailsSchema],
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Team', teamSchema);
