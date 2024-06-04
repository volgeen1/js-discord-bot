const { Events, Client, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        const messageContent = await interaction.channel.messages.fetch(interaction.message.id);

        if (interaction.customId === 'unattend') {
            await messageContent.edit({ embeds: [await parseEmbed(interaction, interaction.user.id, false)] });
            await interaction.deferUpdate();
        } else if (interaction.customId === 'attend') {
            await messageContent.edit({ embeds: [await parseEmbed(interaction, interaction.user.id, true)] });
            await interaction.deferUpdate();
        } else if (interaction.customId === 'event-notify') {
            const role = interaction.guild.roles.cache.find(role => role.name === 'Event Notification');
            const member = await interaction.guild.members.fetch(interaction.user.id);

            if (!member.roles.cache.find(role => role.name === 'Event Notification')) {
                await member.roles.add(role);
                await interaction.reply({ content: "You are now getting notified when a new event happens!", ephemeral: true });
            } else {
                await member.roles.remove(role);
                await interaction.reply({ content: "You are no longer getting notified when a new event happens!", ephemeral: true });
            }
        }
    }
}

async function parseEmbed(interaction, user, adduser = true) {

    console.log("userid:", user, "username:", interaction.user.username, "adduser:", adduser);

    const messageContent = await interaction.channel.messages.fetch(interaction.message.id);
    const embedvalue = messageContent.embeds[0].fields[2].value;
    const attendees = embedvalue.split(',\n');
    if (embedvalue === "None") {
        attendees.pop(0);
    }
    user = "<@" + user + ">";
    if (!attendees.includes(user) && adduser) {
        attendees.push(user);
    } else if (attendees.includes(user) && !adduser) {
        const index = attendees.indexOf(user);
        if (index !== -1) {
            attendees.splice(index, 1);
        }
    } else {
        console.log(attendees, user);
        console.log(interaction.user.username, 'is already in the list');
    }

    const embed = new EmbedBuilder()
        .setTitle(messageContent.embeds[0].title)
        .setDescription(messageContent.embeds[0].description)
        .setFooter({ text: "Want to get notified when a new event happens? Press 'Get Notified'" })
        .addFields(
            { name: 'Time:', value: messageContent.embeds[0].fields[0].value, inline: true },
            { name: 'Organizer:', value: messageContent.embeds[0].fields[1].value, inline: true },
            { name: 'Attendees:', value: attendees.length > 0 ? attendees.join(',\n') : 'None' },
        )
        .setColor(0xDA70D6);
    return embed;
}