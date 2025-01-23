export default {
    name: "help",
    description: "Obtenir toutes les informations de chaque commande",
    options: [
        {
            name: "name_command",
            description: "Nom de la commande à voir",
            type: 3, // Type STRING
            required: false,
        },
    ],

    runSlash: async (client, interaction) => {
        // Message initial
        let message =
            "Bot créé en 2023 par Corentin K. Voici la liste des différentes commandes de ce BOT :\n\n";

        // Récupération de l'option 'name_command'
        const name_command = interaction.options.getString("name_command");

        if (!name_command) {
            // Liste générale des commandes si aucun paramètre n'est fourni
            message +=
                "**/planning** : permet de récupérer le planning d'une personne.\n\n" +
                "**/addPlanning** : ajoutez votre planning à la commande.\n\n" +
                "**/addEvent** : ajoutez un événement et programmez un rappel automatique (jour J et une semaine avant).\n\n" +
                " Tapez `/help <nom de la commande>` pour en savoir plus.";
        } else {
            // Informations spécifiques sur une commande
            switch (name_command.toLowerCase()) {
                case "planning":
                    message +=
                        "🔹 **/planning** :\nAffiche le planning de la personne demandée. Vous pouvez spécifier la date sous la forme JJ-MM-AAAA et choisir si le message doit être éphémère.\n";
                    break;
                case "addplanning":
                    message +=
                        "🔹 **/addPlanning** :\nAjoutez votre planning à la liste. Le lien du planning est récupérable sur MyEfrei, dans la section Planning ('Copier l'URL du planning (iCal)').\n";
                    break;
                case "addevent":
                    message +=
                        "🔹 **/addEvent** :\nAjoutez un événement en précisant la date, l'heure, le texte du message, et si un ping everyone est nécessaire.\n";
                    break;
                default:
                    // Message d'erreur si la commande n'existe pas
                    message += "❌ La commande demandée n'existe pas !";
                    break;
            }
        }

        // Réponse à l'interaction
        await interaction.reply({ content: message,  flags: 64 });
    },
};
