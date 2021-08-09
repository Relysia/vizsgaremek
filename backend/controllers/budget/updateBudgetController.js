const Budget = require('../../models/budget');
const jwt_decode = require('jwt-decode');

exports.updateBudget = async (req, res) => {
  const jwt = req.headers.authorization;
  const { type, objectId, first, second, third } = req.body;
  const { google_id } = jwt_decode(jwt);

  await Budget.findOne({ google_id })
    .then(async (budget) => {
      let budgetItem = budget[type].filter((type) => type._id.toString() === objectId.toString());

      if (type === 'cast') {
        if (first !== '') {
          budgetItem[0].cast_role = first;
        }
        if (second !== '') {
          budgetItem[0].cast_name = second;
        }
        if (third !== '') {
          budgetItem[0].cast_cost = third;
        }
      }

      if (type === 'rent') {
        if (first !== '') {
          budgetItem[0].rent_type = first;
        }
        if (second !== '') {
          budgetItem[0].rent_name = second;
        }
        if (third !== '') {
          budgetItem[0].rent_cost = third;
        }
      }

      if (type === 'travel') {
        if (first !== '') {
          budgetItem[0].travel_distance = first;
        }
        if (second !== '') {
          budgetItem[0].travel_car_cons = second;
        }
        if (third !== '') {
          budgetItem[0].travel_litre_cost = third;
        }
      }

      if (type === 'food') {
        if (first !== '') {
          budgetItem[0].food_day = first;
        }
        if (second !== '') {
          budgetItem[0].food_cost = second;
        }
      }

      await budget.save();
    })
    .catch((err) => {
      console.log(err);
    });

  res.send('Successfully updated cast details!');
};
