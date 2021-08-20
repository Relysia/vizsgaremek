const User = require('../models/user');
const Team = require('../models/team');
const Budget = require('../models/budget');

exports.createTeam = async (data, res, google_id, title, joinPublic, budgetPublic, teamRole) => {
  // Save calendar ID to the user model
  await User.findOne({ google_id }).then(async (user) => {
    user.team.calendar_id = data.id;
    user.team.team_title = title;
    await user.save();

    // Create new budget with calendar ID
    const newBudget = new Budget({
      calendar_id: data.id,
      google_id,
      public: budgetPublic,
    });

    await newBudget.save();

    // Create a new team with calendar ID
    const team = new Team({
      calendar_id: data.id,
      title,
      leader: {
        google_id,
        name: user.name,
        picture: user.picture,
        email: user.email,
        role: teamRole,
      },
      public: joinPublic,
    });

    await team.save();

    return res.send('New team is created!');
  });
};
