import { Client } from "discord.js";
import mysql from "mysql2/promise";

// Configuration de la base de données
const dbConfig = {
    host: "localhost", // Remplacez par l'adresse de votre serveur MySQL
    user: "root",      // Remplacez par votre utilisateur MySQL
    password: "password", // Mot de passe de l'utilisateur MySQL
    database: "discord_bot" // Nom de la base de données
};

export default {
    name: "addPlanning",
    description: "Ajout des plannings",
    options: [
        {
            name: "ical",
            description: "Lien vers le calendrier iCal",
            type: 3, // String
            required: true
        }
    ],

    runSlash: async (client, interaction) => {
        const userId = interaction.user.id;
        const icalLink = interaction.options.getString("ical");

        try {
            // Connexion à la base de données
            const connection = await mysql.createConnection(dbConfig);

            // Vérifier si l'utilisateur a déjà un planning
            const [rows] = await connection.execute(
                "SELECT * FROM plannings WHERE user_id = ?",
                [userId]
            );

            if (rows.length > 0) {
                // Mettre à jour le planning existant
                await connection.execute(
                    "UPDATE plannings SET planning_url = ? WHERE user_id = ?",
                    [icalLink, userId]
                );
                await interaction.reply({
                    content: "Votre planning a été mis à jour avec succès !",
                    ephemeral: true
                });
            } else {
                // Insérer un nouveau planning
                await connection.execute(
                    "INSERT INTO plannings (user_id, planning_url) VALUES (?, ?)",
                    [userId, icalLink]
                );
                await interaction.reply({
                    content: "Votre planning a été ajouté avec succès !",
                    ephemeral: true
                });
            }

            // Fermer la connexion
            await connection.end();
        } catch (error) {
            console.error("Erreur lors de la connexion à la base de données :", error);
            await interaction.reply({
                content: "Une erreur est survenue lors de l'enregistrement de votre planning. Veuillez réessayer plus tard.",
                ephemeral: true
            });
        }
    }
};
