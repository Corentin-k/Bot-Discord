import mysql from "mysql2/promise";
import { scheduleReminder } from "../scheduler.js";
import {transfo_date,verifier_date} from '../agenda.js'
const dbConfig = {
  host: "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
};

export default {
  name: "addevent",
  description: "Ajoutez un événement",
  options: [
    {
      name: "evenement",
      description: "Description de l'événement",
      type: 3,
      required: true,
    },
    {
      name: "date",
      description: "Date de l'événement - AAAA-MM-JJ",
      type: 3,
      required: true,
    },
    {
      name: "heure",
      description: "Heure de l'événement - HH:MM",
      type: 3,
      required: true,
    },
  ],

  runSlash: async (client, interaction) => {
    await interaction.deferReply({ flags:  64 });

    const userId = interaction.user.id;
    const textEvent = interaction.options.getString("evenement");
    const dateInput = interaction.options.getString("date");
    const timeInput = interaction.options.getString("heure");
    const channelId = interaction.channelId;

    try {
      // Connexion à la base de données
      const connection = await mysql.createConnection(dbConfig);
      const date = transfo_date(dateInput);
      if (!verifier_date(date)) {
          return interaction.editReply({
            content: `${dateInput} est une date invalide. Format attendu : AAAA-MM-JJ.`,
          });
        }
      // Insertion de l'événement
      const [result] = await connection.execute(
        `INSERT INTO events (user_id, dateEvent, heureEvent, textEvent) VALUES (?, ?, ?, ?)`,
        [userId, date, timeInput, textEvent]
      );

      const eventId = result.insertId;

      // Planification du rappel
      
      await scheduleReminder(client, userId, eventId, date, timeInput, textEvent, channelId,interaction.user.globalName);

      // Confirmation à l'utilisateur
      await interaction.editReply({
        content: `Événement ajouté : "${textEvent}" prévu le ${date} à ${timeInput}. Un rappel sera envoyé ici.`,
      });

      connection.end();
    } catch (err) {
      console.error(err);
      return interaction.editReply({
        content: "Une erreur est survenue lors de l'ajout de l'événement.",
        
      });
    }
  },
};

     
        