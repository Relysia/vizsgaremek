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
    email: {
      type: String,
    },
    picture: {
      type: String,
    },
    role: {
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
      email: {
        type: String,
      },
      picture: {
        type: String,
      },
      role: {
        type: String,
      },
      calendar_share: {
        type: Boolean,
        default: false,
      },
      calendar_join: {
        type: Boolean,
        default: false,
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
