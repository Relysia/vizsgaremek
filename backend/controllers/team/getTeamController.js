const Team = require('../../models/team');

exports.getTeam = async (req, res) => {
  const team = await Team.find();

  const teamDetails = [];

  team.forEach((team) => {
    teamDetails.push({ title: team.title, calendar_id: team.calendar_id, name: team.leader.name, picture: team.leader.picture, public: team.public, share: calendar_share, join: calendar_join });
  });

  res.send(teamDetails);
};
