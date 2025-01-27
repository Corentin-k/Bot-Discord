import dotenv from "dotenv";
import chalk from "chalk";
dotenv.config();

import { Client, Collection } from "discord.js";
import EventsHandlers from "./Utils/Handlers/EventsHandlers.js";  
import CommandsHandlers from "./Utils/Handlers/CommandsHandlers.js";  


const libraries = ["discord.js", "axios", "node-ical", "moment", "moment-timezone"];

async function checkLibraries() {
    for (const library of libraries) {
        try {
            // Utilisation de la syntaxe ESM pour vérifier si la bibliothèque est installée
            await import(library);
            console.log(chalk.grey(`${library} est installée.`));
        } catch (error) {
            console.log(chalk.red(`Bibliothèque manquante : ${library}`));
            console.log(chalk.red(`Installez-la avec la commande >> npm install ${library}`));
            process.exit(0);
        }
    }
}

//console.clear();
//console.clear();
checkLibraries();

// Partie DiscordJS
const client = new Client({ intents: 3243773 }); //131071 3243773 3276799
client.on('debug', (info) => {
    console.log(info);  // Affiche les messages de débogage
  });
client.commands = new Collection(); //permmettra de stocker l'ensemble des commandes

process.on(`exit`, (code) => { console.log(`le processus s'est arreté avec le code ${code} !`) });
process.on(`uncaughtExeption`, (err, origin) => { console.log(`uncaughtExeption ${err}, origin : ${origin} !`) }); // gestion des erreurs
process.on(`unhandledRejection`, (reason, promise) => { console.log(`unhandledRejection ${reason}\n -----\n${promise} !`) });
process.on(`warning`, (...args) => { console.log(...args) });

client.login(process.env.BOT_TOKEN); // connexion au bot

const mainDiscordJs = async () => {
    await EventsHandlers(client); // initialisation sur gestionnaire d'évènement
    await CommandsHandlers(client); // initialisation sur gestionnaire de commandes
}

const main = async () => {
    await mainDiscordJs(); // initialisation de discordJS
}

main();
