import mysql from "mysql2/promise";

const dbConfig = {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
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
        let icalLink = interaction.options.getString("ical"); // Lien iCal
        const userName = interaction.options.getString("nom").toLowerCase(); // Nom de la personne

        try {
            // Connexion à la base de données
            const connection = await mysql.createConnection(dbConfig);
            if (icalLink.startsWith("webcal://")) {
                icalLink = icalLink.replace("webcal://", "https://");
            }


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
                    flags: 64
                });
            } else {
                // Insérer un nouveau planning
                await connection.execute(
                    "INSERT INTO user_plannings (user_id, planning_url, user_name) VALUES (?, ?, ?)",
                    [userId, icalLink, userName]
                );
                await interaction.reply({
                    content: "Votre planning a été ajouté avec succès !",
                    flags: 64
                });
            }

            // Fermer la connexion
            await connection.end();
        } catch (error) {
            console.error("Erreur lors de la connexion à la base de données :", error);
            await interaction.reply({
                content: "Une erreur est survenue lors de l'enregistrement de votre planning. Veuillez réessayer plus tard.",
                flags: 64
            });
        }
    },
};
