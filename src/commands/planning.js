import { EmbedBuilder } from "discord.js";

import { get_agenda, transfo_date, date_cours, verifier_date } from "../agenda.js";
import moment from "moment";
import mysql from "mysql2/promise";

// Configuration de la base de données
const dbConfig = {
  host: "localhost",
  user: "root",
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
};

export default {
  name: "planning",
  description: "Commande pour obtenir le planning d'une personne",
  options: [
    {
      name: "name",
      description: "Nom de la personne, par défaut le vôtre",
      required: false,
      type: 3,
    },
    {
      name: "date",
      description: "Date sous la forme AAAA-MM-JJ",
      required: false,
      type: 3,
    },
    {
      name: "ephemeral",
      description: "Est-ce que la réponse doit être éphémère ?",
      required: false,
      type: 3,
    },
  ],
  runSlash: async (client, interaction) => {
    const isEphemeral = interaction.options.getString("ephemeral") === "true";
    console.log(interaction.user);
    const nom = interaction.options.getString("name")?.toLowerCase() || interaction.user.id;
    const dateInput = interaction.options.getString("date") || "";
    const date = transfo_date(dateInput);
    if (!interaction.channel || interaction.channelId !== process.env.BOT_PLANNING_CHANNEL) {
      return interaction.editReply({
        content: "Vous ne pouvez pas utiliser cette commande dans ce salon !",
      });
    }
    // Vérification de la date
    if (verifier_date(date) === "false") {
      return interaction.reply({
        content: `${date} est une date invalide. Format attendu : AAAA-MM-JJ.`,
        ephemeral: true,
      });
    }

    // Connexion à la base de données
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);

      // Recherche de l'URL associée au nom
      const [rows] = await connection.execute("SELECT planning_url FROM user_plannings WHERE name = ?", [nom]);

      if (rows.length === 0) {
        return interaction.reply({
          content: `Aucune URL de planning trouvée pour ${nom}. Veuillez vérifier le nom ou ajouter une URL avec /addPlanning.`,
          ephemeral: true,
        });
      }

      const url = rows[0].url;

      // Chargement de l'agenda depuis l'URL
      const agenda = await get_agenda(url);
      const coursDuJour = date_cours(agenda, date);

      if (coursDuJour.length === 0) {
        return interaction.reply({
          content: `${nom} n'a pas de cours le ${date} 🎉`,
          ephemeral: isEphemeral,
        });
      }

      // Création de l'embed
      const embed = new EmbedBuilder()
        .setTitle(`Cours de ${nom}`)
        .setDescription(`__Voici vos cours du ${date} :__\n`)
        .setColor(0x00bfff)
        .setFooter({ text: `Total de ${coursDuJour.length} cours pour le ${date}` })
        .setThumbnail("https://www.efrei.fr/wp-content/uploads/2022/01/LOGO_EFREI-PRINT_EFREI-WEB.png");

      coursDuJour.forEach(({ nom_cours, salle, start, end }) => {
        embed.addFields(
          { name: nom_cours, value: salle, inline: true },
          { name: "Horaires", value: `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`, inline: true },
          { name: "\u200B", value: "\u200B", inline: false }
        );
      });

      await interaction.reply({ embeds: [embed], ephemeral: isEphemeral });
    } catch (error) {
      console.error("Erreur lors de l'accès à la base de données ou au planning :", error);
      return interaction.reply({
        content: "Une erreur est survenue lors de la récupération du planning. Veuillez réessayer plus tard.",
        ephemeral: true,
      });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  },
};
