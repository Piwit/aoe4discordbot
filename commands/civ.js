const { SlashCommandBuilder } = require('@discordjs/builders');
const CIVILIZATIONS = require('../data/civ.json');
const { getRandomNumber } = require('../utils.js');

const MAX_PLAYERS = 8;

const randomCiv = (player, civilizations, realPlayer) => {
  const selectedCiv = CIVILIZATIONS[getRandomNumber(CIVILIZATIONS.length)].name;
  if (realPlayer)
    civilizations.push(`<@${player}>: ${selectedCiv}`);
  else
    civilizations.push(`${player}: ${selectedCiv}`);
}

const civForBadGuys = (numberOfPlayers, civilizations) => {
  if (numberOfPlayers > 4) {
    Array.apply(null, Array(MAX_PLAYERS - numberOfPlayers)).forEach((v, index) => randomCiv(`Méchant ${index + 1}`, civilizations, false));
  } else {
    Array.apply(null, Array(numberOfPlayers)).forEach((v, index) => randomCiv(`Méchant ${index + 1}`, civilizations,  false));
  }
}

async function randomCivForAll (interaction) {
  const civilizations = [];
  const promises = [];
  // Fetch all voice channels, maybe add a channel option to target a channel
  await interaction.guild.channels.fetch().then(
    (channels) => {
      channels.forEach((channel) => {
        if (channel.isVoice()) {
          promises.push(
            channel.members.forEach((member) => {
              randomCiv(member.id, civilizations, true)
            })
          )
        }
      })
    }
  )
  Promise.all(promises).then((_) => {
    civForBadGuys(civilizations.length, civilizations);
    if (civilizations.length > 0)
      interaction.reply(civilizations.join('\n'))
    else
      interaction.reply('Les joueurs doivent être dans un channel audio pour tirer au sort les civilisations')
  });
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('civ')
		.setDescription('Select a random civilization for every player'),
	async execute(interaction) {
		await randomCivForAll(interaction);
	},
};
