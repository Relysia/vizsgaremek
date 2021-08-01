const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  team_leader: {
    type: Boolean,
    default: false,
  },
  team_member: {
    type: Boolean,
    default: false,
  },
});

const budgetSchema = new mongoose.Schema({
  cast: [
    {
      cast_role: {
        type: String,
        default: '',
      },
      cast_name: {
        type: String,
        default: '',
      },
      cast_cost: {
        type: Number,
        default: 0,
      },
    },
  ],
  rent: [
    {
      rent_type: {
        type: String,
        default: '',
      },
      rent_name: {
        type: String,
        default: '',
      },
      rent_cost: {
        type: Number,
        default: 0,
      },
    },
  ],
  travel: [
    {
      travel_distance: {
        type: Number,
        default: 0,
      },
      travel_car_cons: {
        type: Number,
        default: 0,
      },
      travel_litre_cost: {
        type: Number,
        default: 0,
      },
    },
  ],
  food: [
    {
      food_day: {
        type: Number,
        default: 0,
      },
      food_cost: {
        type: Number,
        default: 0,
      },
    },
  ],
});

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
    team_id: {
      type: String,
    },
    team_title: {
      type: String,
    },
  },
  budget: {
    cast: [
      {
        cast_role: {
          type: String,
          default: '',
        },
        cast_name: {
          type: String,
          default: '',
        },
        cast_cost: {
          type: Number,
          default: 0,
        },
      },
    ],
    rent: [
      {
        rent_type: {
          type: String,
          default: '',
        },
        rent_name: {
          type: String,
          default: '',
        },
        rent_cost: {
          type: Number,
          default: 0,
        },
      },
    ],
    travel: [
      {
        travel_distance: {
          type: Number,
          default: 0,
        },
        travel_car_cons: {
          type: Number,
          default: 0,
        },
        travel_litre_cost: {
          type: Number,
          default: 0,
        },
      },
    ],
    food: [
      {
        food_day: {
          type: Number,
          default: 0,
        },
        food_cost: {
          type: Number,
          default: 0,
        },
      },
    ],
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
