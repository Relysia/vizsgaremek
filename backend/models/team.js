const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  calendar_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  leader: {
    google_id: {
      type: String,
    },
    name: {
      type: String,
    },
    picture: {
      type: String,
    },
  },
  members: [
    {
      google_id: {
        type: String,
      },
      name: {
        type: String,
      },
      picture: {
        type: String,
      },
    },
  ],
  public: {
    type: Boolean,
    default: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Team', teamSchema);
