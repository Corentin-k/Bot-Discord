import cron from "node-cron";
import mysql from "mysql2/promise";
import { TextChannel, EmbedBuilder } from "discord.js";

const dbConfig = {
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
};

// Fonction pour planifier un rappel
export const scheduleReminder = async (client, userId, eventId, date, time, message, channelId,globalName) => {
  const [hour, minute] = time.split(":").map(Number);
  if (typeof date === "string") {
    date = new Date(date);
  }
  if (isNaN(date.getTime())) {
    console.error("Date invalide :", date);
    return;
  }

  // Calcul du cron expression
  //https://www.npmjs.com/package/node-cron

  const cronExpression = `${minute} ${hour} ${date.getDate()} ${date.getMonth() + 1} *`;
  console.log("Cron planifié :", cronExpression);

  // Planification du rappel
  cron.schedule(cronExpression, async () => {
    try {
      const channel = client.channels.cache.get(channelId);
      if (channel instanceof TextChannel) {
        
        //  Création de l'embed
        const reminderEmbed = new EmbedBuilder()
          .setColor("#FFA500") 
          .setTitle("📅 Rappel d'Événement")
          .setDescription(message)
          .addFields(
            { name: "📌 Date", value: date.toISOString().split("T")[0], inline: true },
            { name: "🕒 Heure", value: time, inline: true }
          )
          .setFooter({ text: `Rappel programmé par <@${globalName}>` })
          .setTimestamp();

        // Envoi du message embed
        await channel.send({ content: `@everyone`, embeds: [reminderEmbed],flag:64 });

        await markAsNotified(eventId);
      }
    } catch (err) {
      console.error("Erreur lors de l'envoi du rappel :", err);
    }
  });
};

// Fonction pour marquer un événement comme notifié
const markAsNotified = async (eventId) => {
  const connection = await mysql.createConnection(dbConfig);
  await connection.execute(
    `UPDATE events SET notified = 1 WHERE id = ?`,
    [eventId]
  );
  connection.end();
};
