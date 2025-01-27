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
    const isEphemeral = interaction.options.getString("ephemeral");

    let statuts;
    if (isEphemeral === "false") {
      statuts = false;
    } else {
      statuts = true;
    }
    // Remplace l'usage de ephemeral par flags
    await interaction.deferReply({ flags: statuts ? 64 : 0 });

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
      return interaction.editReply({
        content: `${date} est une date invalide. Format attendu : AAAA-MM-JJ.`,
      });
    }

    // Connexion à la base de données
    let connection;
    try {
      connection = await mysql.createConnection(dbConfig);

      // Recherche de l'URL associée au nom
      const [rows] = await connection.execute("SELECT planning_url FROM user_plannings WHERE user_name = ?", [nom]);

      if (rows.length === 0) {
        return interaction.editReply({
          content: `Aucune URL de planning trouvée pour ${nom}. Veuillez vérifier le nom ou ajouter une URL avec /addPlanning.`,
         
        });
      }
      console.log(rows)
      const url = rows[0].planning_url;
      console.log(url)
      // Chargement de l'agenda depuis l'URL
      const agenda = await get_agenda(url);
      const coursDuJour = date_cours(agenda, date);

      if (coursDuJour.length === 0) {
        return interaction.editReply({
          content: `${nom} n'a pas de cours le ${date} 🎉`,
  
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
          { name: "Horaires", value: `${moment(start, "HH:mm").format("HH:mm")} - ${ moment(end, "HH:mm").format("HH:mm")}`, inline: true },
          { name: "\u200B", value: "\u200B", inline: false }
        );
      });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Erreur lors de l'accès à la base de données ou au planning :", error);
      return interaction.editReply({
        content: "Une erreur est survenue lors de la récupération du planning. Veuillez réessayer plus tard.",
      
      });
    } finally {
      if (connection) {
        await connection.end();
      }
    }
  },
};
