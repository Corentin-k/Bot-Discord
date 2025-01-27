import mysql from "mysql2/promise";

const dbConfig = {
    host: "localhost", // Adresse de votre serveur MySQL
    user: "root",      // Utilisateur MySQL
    password: process.env.DB_PWD, // Mot de passe
    database: process.env.DB_NAME, // Nom de la base de données
};

export default {
    name: "addplanning",
    description: "Ajoutez votre planning iCal à la base de données",
    options: [
        {
            name: "ical",
            description: "Lien vers le calendrier iCal",
            type: 3, // String
            required: true,
        },
        {
            name: "nom",
            description: "Nom de la personne",
            type: 3, // String
            required: true, // Le nom est désormais obligatoire
        },
    ],

    runSlash: async (client, interaction) => {
        const userId = interaction.user.id; // ID de l'utilisateur Discord
        const icalLink = interaction.options.getString("ical"); // Lien iCal
        const userName = interaction.options.getString("nom"); // Nom de la personne

        try {
            // Connexion à la base de données
            const connection = await mysql.createConnection(dbConfig);

            // Vérifier si l'utilisateur a déjà un planning
            const [rows] = await connection.execute(
                "SELECT * FROM user_plannings WHERE user_id = ?",
                [userId]
            );

            if (rows.length > 0) {
                // Mettre à jour le planning existant
                await connection.execute(
                    "UPDATE user_plannings SET planning_url = ?, user_name = ? WHERE user_id = ?",
                    [icalLink, userName, userId]
                );
                await interaction.reply({
                    content: "Votre planning a été mis à jour avec succès !",
                    ephemeral: true,
                });
            } else {
                // Insérer un nouveau planning
                await connection.execute(
                    "INSERT INTO user_plannings (user_id, planning_url, user_name) VALUES (?, ?, ?)",
                    [userId, icalLink, userName]
                );
                await interaction.reply({
                    content: "Votre planning a été ajouté avec succès !",
                    ephemeral: true,
                });
            }

            // Fermer la connexion
            await connection.end();
        } catch (error) {
            console.error("Erreur lors de la connexion à la base de données :", error);
            await interaction.reply({
                content: "Une erreur est survenue lors de l'enregistrement de votre planning. Veuillez réessayer plus tard.",
                ephemeral: true,
            });
        }
    },
};
