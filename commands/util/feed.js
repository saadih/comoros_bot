const { channel } = require('diagnostics_channel');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('feed')
		.setDescription('Sends a stylized embed message to a channel')
		
		.addChannelOption(option =>
		option.setName("channel")
		.setDescription("The channel you want to send the feed to")
		.setRequired(true))

		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		,
	async execute(interaction) {
		/*
		interaction.reply('Please enter the content you want to add to the message').then(() => {
			const collectorFilter = m => interaction.user.id === m.author.id;

			interaction.channel.awaitMessages({
					filter: collectorFilter,
					time: 60000,
					max: 1,
					errors: ['time']
				})
				.then(messages => {
					channel.send({
						embeds: [{
							title: messageTitle,
							description: messages.first().content,
							image: imageUrl ? {
								url: imageUrl
							} : undefined
						}]
					}).then(message => {
						const messageId = message.id
						const messageLink = `https://discord.com/channels/${interaction.guildId}/${channelId}/${messageId}`;
						interaction.reply({
							content: `Message sent! (${messageLink})`,
							ephemeral: true
						});
					})

				})
				.catch(() => {
					interaction.followUp('You did not enter any input!');
				});
			
		});
		*/
			const modal = new ModalBuilder()
			.setCustomId("Form")
			.setTitle("Create your feed here and then submit")


			const title = new TextInputBuilder()
			.setCustomId('title')
			.setLabel("Feed title")
			.setStyle(TextInputStyle.Short)
			.setRequired(true)

			const content = new TextInputBuilder()
			.setCustomId('content')
			.setLabel("Feed content")
			.setStyle(TextInputStyle.Paragraph)
			.setRequired(true)
			
			const image = new TextInputBuilder()
			.setCustomId('image')
			.setLabel("Post an image URL to be shown in the feed")
			.setStyle(TextInputStyle.Short)
			.setRequired(false)

			const channel = new TextInputBuilder()
			.setCustomId('channel')
			.setLabel("Leave if you don't want to change channel")
			.setValue(interaction.options.getChannel("channel").id)
			.setStyle(TextInputStyle.Short)
			.setRequired(false)

			const firstActionRow = new ActionRowBuilder().addComponents(title);
			const secondActionRow = new ActionRowBuilder().addComponents(content);
			const thirdActionRow = new ActionRowBuilder().addComponents(image);
			const fourthActionRow = new ActionRowBuilder().addComponents(channel);

			modal.addComponents(firstActionRow,secondActionRow,thirdActionRow,fourthActionRow);

			await interaction.showModal(modal);
	},
};