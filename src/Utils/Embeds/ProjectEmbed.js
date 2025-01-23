import { EmbedBuilder } from 'discord.js';

// Exemple de création d'un embed avec EmbedBuilder
const projectEmbed = (info) => {
    const embed = new EmbedBuilder();

    embed.setTitle(info.projectTitle);
    embed.setColor("DarkBlue");
    embed.setDescription((info.description).slice(0, 4095));
    embed.addFields(
        // Si tu souhaites ajouter des champs, tu peux les insérer ici
    );

    return embed;
}
