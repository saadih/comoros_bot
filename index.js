const fs = require('node:fs');
const path = require('node:path');
const {
	Client,
	Collection,
	Events,
	GatewayIntentBits
} = require('discord.js');
const {
	token
} = require('./config.json');

const client = new Client({
	intents: [GatewayIntentBits.Guilds]
});



client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, () => {
	console.log('Ready!');
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);


	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				ephemeral: true
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				ephemeral: true
			});
		}
	}
});

// feed command
client.on(Events.InteractionCreate, interaction => {
	if (interaction.name === "feed") {
		// currentFeedChannel = interaction.getChannel("channel");
	}
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isModalSubmit()) return;
	if (interaction.customId === 'Form') {


		// Get the data entered by the user
		const messageTitle = interaction.fields.getTextInputValue('title');
		const content = interaction.fields.getTextInputValue('content');
		const imageUrl = interaction.fields.getTextInputValue('image');
		const currentFeedChannel = client.channels.cache.get(interaction.fields.getTextInputValue("channel"));

		try {
			await currentFeedChannel.send({
				embeds: [{
					title: messageTitle,
					description: content,
					image: imageUrl ? {
						url: imageUrl
					} : undefined
				}]
			}).then(message => {
				const messageId = message.id
				const messageLink = `https://discord.com/channels/${interaction.guildId}/${currentFeedChannel.id}/${messageId}`;

				interaction.reply({
					content: `Message sent! (${messageLink})`,
					ephemeral: true
				});
			}).catch( error => console.log(error))

		} catch (error) {
			console.log(error)
		}

	}
});

client.login(token);