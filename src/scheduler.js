import cron from "node-cron";
import mysql from "mysql2/promise";
import { TextChannel } from "discord.js";

const dbConfig = {
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
};

// Fonction pour planifier un rappel
export const scheduleReminder = async (client, userId, eventId, date, time, message, channelId) => {
  const [hour, minute] = time.split(":").map(Number);

  // Calcul du cron expression
  const cronExpression = `${minute} ${hour} ${date.getDate()} ${date.getMonth() + 1} *`;

  // Planification du rappel
  cron.schedule(cronExpression, async () => {
    try {
      const channel = client.channels.cache.get(channelId);
      if (channel instanceof TextChannel) {
        await channel.send(`<@${userId}> Rappel : ${message}`);
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
