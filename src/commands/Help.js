import { Client } from "discord.js";

export default {
    name: "help", 
    description: "Obtenir toutes les informations de chaque commande", 
    options: [
        {
            name: "name_command", 
            description: "Nom de la commande à voir", 
            type: 3,
            required: false
        }
    ], 
    
    runSlash: async (client, interaction) => {
        let message = "";
        message += "Bot créé en 2023 par Crobot'ic. Voici la liste des différentes commandes de ce BOT :\n\n"
        const name_command = interaction.options.getString("name_command");
        if (!name_command) {
            message += 
                "**/planning** : permet de récupérer le planing d'une personne. \n\n" +
                "**/addPlanning** : ajouter son planning à la commande"
                "**/addEvent** : ajouter un évenement et le programmer pour qu'il envoie un ping le jour j + un ping sans everyone une semaine avant ou cinq"
                "Tapez /help + nom de la commande pour en savoir plus"                
        } else {
            switch (name_command){
                case "planning":
                    message += "Affiche le planning de la personne demandé. Vous pouvez spécifier la date sous la forme JJ-MM-AAAA et dire si vous voulez que le message soit ephémère ou non"
                case "addPlanning":
                    message += "Ajouter votre planning à la liste: le lien du planning est récupérable sur myefrei dans la section planning 'Copier l'url du planning (ical)'"
                case "addEvent":
                    message+="Ajouter un évenement: préciser la date et l'heure, si le message doit ping everyone et  le texte du message"
                default:
                    message +="La commande demandé n'existe pas !"
            }

        }
        
        await interaction.reply({ content: message, ephemeral: true });
        
    }
}