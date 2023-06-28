const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('information')
		.setDescription('Gives a summary of the bot, used primarily for testing purposes'),
	async execute(interaction) {
		await interaction.reply('comoros bot ran by teks raspberry pi lol');
	},
};
