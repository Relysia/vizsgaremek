const Team = require('../models/team');

exports.getTeam = async (req, res) => {
  const team = await Team.find();

  const teamToSend = [];

  team.forEach((team) => {
    teamToSend.push({ title: team.title, calendar_id: team.calendar_id, name: team.leader.name, picture: team.leader.picture, public: team.public });
  });

  res.send(teamToSend);
};
