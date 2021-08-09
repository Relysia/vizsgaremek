const User = require('../../models/user');
const Budget = require('../../models/budget');
const jwt_decode = require('jwt-decode');

const getBudgetRole = async (req, res) => {
  const jwt = req.headers.authorization;
  const { google_id } = jwt_decode(jwt);
  const user = await User.findOne({ google_id });

  const calendar_id = user.team.calendar_id;

  const budget = await Budget.findOne({ calendar_id });

  if (!budget) {
    if (user.roles.team_leader) {
      return res.status(404).send('You need to create a team first!');
    } else {
      return res.status(404).send('You need to join a team first!');
    }
  }

  const budgetPublic = budget.public;

  return res.send(budgetPublic);
};

module.exports = getBudgetRole;
