const User = require('../models/user');
const Team = require('../models/team');

exports.createTeam = async (data, res, google_id, title, public, teamRole) => {
  let publicValue;

  if (public === true) {
    publicValue = true;
  } else {
    publicValue = false;
  }

  // Save calendar ID to the user model
  await User.findOne({ google_id })
    .then(async (user) => {
      user.team.calendar_id = data.id;
      user.team.team_title = title;
      await user.save();

      // Create a new team with calendar ID
      const team = new Team({
        calendar_id: data.id,
        title,
        leader: {
          google_id,
          name: user.name,
          picture: user.picture,
          role: teamRole,
        },
        public: publicValue,
      });

      await team.save();

      res.send('New team is created!');
    })
    .catch((err) => {
      console.log(err);
    });
};
