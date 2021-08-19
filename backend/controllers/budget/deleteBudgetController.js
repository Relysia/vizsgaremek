const Budget = require('../../models/budget');
const jwt_decode = require('jwt-decode');

exports.deleteBudget = async (req, res) => {
  const jwt = req.headers.authorization;
  const { type, objectId } = req.body;
  const { google_id } = jwt_decode(jwt);
  const budget = await Budget.findOne({ google_id });

  budget[type].pull({ _id: objectId });

  if (type === 'cast') {
    const total = budget[type].map((data) => data.cast_cost).reduce((a, b) => a + b, 0);

    budget.cast_total = total;
  }

  if (type === 'rent') {
    const total = budget[type].map((data) => data.rent_cost).reduce((a, b) => a + b, 0);

    budget.rent_total = total;
  }

  if (type === 'travel') {
    if (budget[type].length < 1) {
      budget.travel_total = 0;
    } else {
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
  }

  if (type === 'food') {
    const total = budget[type].map((data) => data.food_cost).reduce((a, b) => a + b, 0);

    budget.food_total = total;
  }

  await budget.save();

  res.status(200).send('Successfully deleted cast member!');
};
