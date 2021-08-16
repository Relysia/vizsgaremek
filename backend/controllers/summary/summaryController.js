const User = require('../../models/user');
const Team = require('../../models/team');
const Budget = require('../../models/budget');
const jwt_decode = require('jwt-decode');
const axios = require('axios');

const summary = async (req, res) => {
  const jwt = req.headers.authorization;
  const { google_id, access_token } = jwt_decode(jwt);
  const user = await User.findOne({ google_id });

  const calendar_id = user.team.calendar_id;

  if (!calendar_id) {
    if (user.roles.team_leader) {
      return res.status(404).send('You need to create a team first!');
    } else {
      return res.status(404).send('You need to join a team first!');
    }
  }

  const team = await Team.findOne({ calendar_id });

  // CREATING TEAM OBJECT
  const title = team.title;
  const { name, picture, role } = team.leader;
  const leader = { name, picture, role };

  const members = [];
  team.members.forEach((member) => {
    members.push({ name: member.name, picture: member.picture, role: member.role });
  });

  // CREATING BUDGET OBJECT
  const budget = await Budget.findOne({ calendar_id });

  // Total budget cost
  const { cast_total, rent_total, travel_total, food_total } = budget;

  const budgetArray = [cast_total, rent_total, travel_total, food_total];

  let budgetTotal = budgetArray.reduce((a, b) => a + b, 0);

  // Single budget cost
  let budgetSingle = {
    cast_total,
    rent_total,
    travel_total,
    food_total,
  };

  // If budget is not public send an empty array
  if (!budget.public && team.leader.google_id !== google_id) {
    budgetTotal = [];
    budgetSingle = [];
  }

  // CREATING CALENDAR OBJECT
  const url = `https://www.googleapis.com/calendar/v3/calendars/${calendar_id}/events?singleEvents=true&orderBy=startTime`;

  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };

  axios
    .get(url, config)
    .then((response) => {
      const events = [];

      response.data.items.forEach((event) => {
        events.push({ summary: event.summary, start: { dateTime: event.start.dateTime }, htmlLink: event.htmlLink });
      });

      return res.send({ team: { title, leader, members }, budget: { total: budgetTotal, budget: budgetSingle }, calendar: { events } });
    })
    .catch((err) => {
      // Send empty calendar array, if calendar is not shared with user
      const calendar = [];
      return res.send({ team: { title, leader, members }, budget: { total: budgetTotal, budget: budgetSingle }, calendar });
    });
};

module.exports = summary;
