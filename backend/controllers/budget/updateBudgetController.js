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

        const total = budget[type].map((data) => data.cast_cost).reduce((a, b) => a + b, 0);

        budget.cast_total = total;
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

        const total = budget[type].map((data) => data.rent_cost).reduce((a, b) => a + b, 0);

        budget.rent_total = total;
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

        const travelArray = budget[type].map((data) => data);

        const reducer = (acc, curr) => acc + curr;

        let distanceArray = travelArray.map((item) => item.travel_distance);
        let distance = distanceArray.reduce(reducer);

        let consumptionArray = travelArray.map((item) => item.travel_car_cons);
        let consumption = consumptionArray.reduce(reducer);

        let litreArray = travelArray.map((item) => item.travel_litre_cost);
        let litrePrice = litreArray.reduce(reducer);

        const total = Math.round((distance / 100) * (consumption / consumptionArray.length) * (litrePrice / litreArray.length));

        budget.travel_total = total;
      }

      if (type === 'food') {
        if (first !== '') {
          budgetItem[0].food_day = first;
        }
        if (second !== '') {
          budgetItem[0].food_cost = second;
        }

        const total = budget[type].map((data) => data.food_cost).reduce((a, b) => a + b, 0);

        budget.food_total = total;
      }

      await budget.save();
      return res.send('Successfully updated budget details!');
    })
    .catch((err) => {
      return res.status(404).send('Team not found!');
    });
};
