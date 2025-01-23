
export default {
    name: "interactionCreate", 
    once: false, 
    async execute(client, interaction) {

        // Vérifie si l'interaction est une commande
        if (interaction.isCommand()) {

            // Récupère la commande associée à l'interaction en utilisant son nom
            const cmd = client.commands.get(interaction.commandName);

            // Si la commande n'existe pas, renvoie une réponse à l'interaction
            if (!cmd) return interaction.reply("Cette commande n'existe pas");

            // Exécute la commande associée à l'interaction
            cmd.runSlash(client, interaction);
        }

        const devGuild = await client.guilds.cache.get(process.env.SERV_ID);
        devGuild.commands.set(client.commands.map((cmd) => cmd));
    }
};
