"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = {
    name: "ping",
    description: "Answer by Pong !",
    runSlash: (client, interaction) => {
        interaction.reply({
            content: `Pong! Latence de ${Date.now() - interaction.createdTimestamp}ms`,
            ephemeral: true
        });
    }
};
