const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  google_id: {
    type: String,
    required: true,
  },
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
        type: String,
        default: '',
      },
      food_cost: {
        type: Number,
        default: 0,
      },
    },
  ],
});

module.exports = mongoose.model('Budget', budgetSchema);
