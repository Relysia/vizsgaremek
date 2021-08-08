const Team = require('../../models/team');

const getTeam = async (req, res) => {
  const team = await Team.find();

  if (!team) {
    res.status(400).send('No team available to join!');
  }

  const teamDetails = [];

  team.forEach((team) => {
    teamDetails.push({ title: team.title, calendar_id: team.calendar_id, name: team.leader.name, picture: team.leader.picture, public: team.public });
  });

  res.send(teamDetails);
};

module.exports = getTeam;
