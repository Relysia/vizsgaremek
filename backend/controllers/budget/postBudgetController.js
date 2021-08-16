const Budget = require('../../models/budget');
const jwt_decode = require('jwt-decode');

exports.postBudget = async (req, res) => {
  const jwt = req.headers.authorization;
  const { type, first, second, third } = req.body;
  const { google_id } = jwt_decode(jwt);
  const budget = await Budget.findOne({ google_id });

  if (!budget) {
    res.status(404).send('You need to create a team first!');
  }

  if (first === '' || second === '') {
    res.status(400).send('You need to fill out all input field!');
  }

  if (type === 'cast') {
    await budget[type].push({ cast_role: first, cast_name: second, cast_cost: third });

    const total = budget[type].map((data) => data.cast_cost).reduce((a, b) => a + b, 0);

    budget.cast_total = total;
  }
  if (type === 'rent') {
    await budget[type].push({ rent_type: first, rent_name: second, rent_cost: third });

    const total = budget[type].map((data) => data.rent_cost).reduce((a, b) => a + b, 0);

    budget.rent_total = total;
  }
  if (type === 'travel') {
    await budget[type].push({ travel_distance: first, travel_car_cons: second, travel_litre_cost: third });

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
    await budget[type].push({ food_day: first, food_cost: second });

    const total = budget[type].map((data) => data.food_cost).reduce((a, b) => a + b, 0);

    budget.food_total = total;
  }

  await budget.save();

  res.json('Successfully added new cast member!');
};
