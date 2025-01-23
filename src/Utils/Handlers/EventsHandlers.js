import { readdirSync } from "fs";
import chalk from "chalk";

const eventList = ['ready','interactionCreate',
    'apiRequest', 'apiResponse', 'applicationCommandCreate', 'applicationCommandDelete', 'applicationCommandUpdate',
    'channelCreate', 'channelDelete', 'channelPinsUpdate', 'channelUpdate', 'debug', 'emojiCreate', 'emojiDelete',
    'emojiUpdate', 'error', 'guildBanAdd', 'guildBanRemove', 'guildCreate', 'guildDelete', 'guildIntegrationsUpdate',
    'guildMemberAdd', 'guildMemberAvailable', 'guildMemberRemove', 'guildMembersChunk', 'guildMemberUpdate',
    'guildScheduledEventCreate', 'guildScheduledEventDelete', 'guildScheduledEventUpdate', 'guildScheduledEventUserAdd',
    'guildScheduledEventUserRemove', 'guildUnavailable', 'guildUpdate', 'interaction', 'interactionCreate', 'invalidated',
    'invalidRequestWarning', 'inviteCreate', 'inviteDelete', 'message', 'messageCreate', 'messageDelete', 'messageDeleteBulk',
    'messageReactionAdd', 'messageReactionRemove', 'messageReactionRemoveAll', 'messageReactionRemoveEmoji', 'messageUpdate',
    'presenceUpdate', 'rateLimit', 'ready', 'roleCreate', 'roleDelete', 'roleUpdate', 'shardDisconnect', 'shardError',
    'shardReady', 'shardReconnecting', 'shardResume', 'stageInstanceCreate', 'stageInstanceDelete', 'stageInstanceUpdate',
    'stickerCreate', 'stickerDelete', 'stickerUpdate', 'threadCreate', 'threadDelete', 'threadListSync', 'threadMembersUpdate',
    'threadMemberUpdate', 'threadUpdate', 'typingStart', 'userUpdate', 'voiceStateUpdate', 'warn', 'webhookUpdate'
];

export default async (client) => {   
    // Chemin complet vers le répertoire contenant les fichiers d'événements
    const allEventsPath = process.cwd() + "/src/events";

    // Liste tous les noms de fichiers dans le répertoire des événements
    const allEventsFileName = readdirSync(allEventsPath);

    // Parcourt chaque nom de fichier d'événement
    for (const eventFile of allEventsFileName) {
        // Importe l'événement depuis son fichier de manière dynamique
        const eventModule= await import(`${allEventsPath}/${eventFile}`);
        const event = eventModule.default;
    
        // Vérifie si l'événement est dans la liste des événements autorisés et s'il a un nom
        if (!eventList.includes(event.name) || !event.name) {
            console.log(`-----\nÉvénement non-déclenché \nFichier -> ${eventFile}\n-----`);
            continue;
        }

        console.log(chalk.green("Événement chargé : " + event.name));
        
        // Si l'événement doit être exécuté une seule fois
        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }
    }
};
