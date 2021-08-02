const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  google_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  roles: {
    team_leader: {
      type: Boolean,
      default: false,
    },
    team_member: {
      type: Boolean,
      default: false,
    },
  },
  team: {
    calendar_id: {
      type: String,
      default: '',
    },
    team_title: {
      type: String,
      default: '',
    },
  },
  isValid: {
    type: Boolean,
    default: false,
  },
  firstTime: {
    type: Boolean,
    default: true,
  },
  uniqueString: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', userSchema);
