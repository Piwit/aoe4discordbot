const { SlashCommandBuilder } = require('@discordjs/builders');
const maps = require('../data/map.json');
const biomes = require('../data/biome.json');
const { getRandomNumber } = require('../utils.js');

const WALL = "WALL";
const WATER = "WATER";

const randomMap = (interaction) => {
  const wall = interaction.options.getBoolean('wall');
  const earth = interaction.options.getBoolean('earth');
  const filteredMaps = maps.filter((m) =>
    (!wall || m.tags.indexOf(WALL) != -1) && (!earth || m.tags.indexOf(WATER) == -1)
  );
  const selectedMap = filteredMaps[getRandomNumber(filteredMaps.length)];
  const selectedBiome = biomes[getRandomNumber(biomes.length)];
  interaction.reply(`Map: ${selectedMap.name}\nBiome: ${selectedBiome}`);
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('map')
		.setDescription('Select a random map from the pool')
    .addBooleanOption(option => option.setName('wall').setDescription('All map will be easy to wall'))
    .addBooleanOption(option => option.setName('earth').setDescription('Exclude map with water')),
	async execute(interaction) {
		await randomMap(interaction);
	},
};
