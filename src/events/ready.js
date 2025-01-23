
export default {
    name: "ready", 
    once: true, 
    async execute(client) {
        console.log("Bot launched !");
        
        const devGuild = client.guilds.cache.get(process.env.SERV_ID);
        devGuild?.commands.set(client.commands.map((cmd) => cmd));

        client.user.setActivity({
            name: process.env.UTILISATEUR
        });
    }
};
