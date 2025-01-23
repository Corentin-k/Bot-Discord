"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: "help",
    description: "Obtenir toutes les informations de chaque commande",
    options: [
        {
            name: "name_command",
            description: "Nom de la commande à voir",
            type: "STRING",
            required: false
        }
    ],
    runSlash: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        let message = "";
        message += "Bot créé en 2023 par Crobot'ic. Voici la liste des différentes commandes de ce BOT :\n\n";
        const name_command = interaction.options.getString("name_command");
        if (!name_command) {
            message +=
                "**/create_project** : permet de créer un nouveau projet en demandant les informations suivantes : image, nom, description, avancement et deadline. \n\n" +
                    "**/delete_project** : permet de supprimer un projet en demandant l'identifiant du projet. \n\n" +
                    "**/view_project** : permet de voir un projet en demandant l'identifiant du projet. Le bot génère ensuite l'Embed du projet et l'envoie en message privé.\n\n" +
                    "**/list_projects** : permet d'avoir un channel contenant tous les projets et de les mettre à jour. \n\n" +
                    "**/modify_project** : permet de modifier un projet en demandant l'identifiant du projet, l'information à modifier et la nouvelle valeur. \n\n" +
                    "**/create_event** : permet de créer un nouvel événement en demandant la date, la durée, la description, le nom de l'événement et la place. \n\n" +
                    "**/list_next-events** : permet de lister les prochains événements avec leur nom et leur ID.\n\n" +
                    "**/list_all-events** : permet de lister tous les événements en deux parties : événements passés et à venir.\n\n" +
                    "**/modify_event** : permet de modifier un événement en demandant l'identifiant de l'événement, l'information à modifier et la nouvelle valeur. Le bot envoie ensuite un nouveau message avec un everyone et ne modifie pas le précédent.\n\n" +
                    "**/delete_event** : permet de supprimer un événement en demandant l'identifiant de l'événement. \n\n" +
                    "**/send_message** : permet d'envoyer un message à notre place en demandant le contenu du message, le channel à envoyer, l'heure d'envoi et si le message doit être envoyé à tout le monde ou pas. \n";
        }
        else {
            switch (name_command) {
                case "list_project":
                    message += "Affiche l'ensemble de tous les projets";
                case "create_project":
                    message += "Permet de créer un projet ";
                case "modify_project":
                    message += "";
                case "list_projects":
                    message += "";
                case "modify_project":
                    message += "";
                case "":
                    message += "";
                default:
                    message += "La commande demandé n'existe pas !";
            }
        }
        interaction.reply({ content: message, ephemeral: true });
    })
};
