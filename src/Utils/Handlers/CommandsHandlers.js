import { readdirSync } from "fs";
import chalk from "chalk";

export default async (client) => {
    // Chemin complet vers le répertoire contenant les fichiers de commandes
    const allCommandsPath = process.cwd() + "/src/commands";

    // Liste tous les noms de fichiers dans le répertoire des commandes
    const allCommandsFileName = readdirSync(allCommandsPath);

    // Parcourt chaque nom de fichier de commande
    allCommandsFileName.map((commandFile) => {
        
        // Importe la commande depuis son fichier
        import(`${allCommandsPath}/${commandFile}`).then(command => {
            command=command.default
            
            // Vérifie si la commande a un nom et une description
            if (!command.name || !command.description) {
                console.log(`${allCommandsPath}/${commandFile}`)
                console.log(command.name,command.description)
                return console.log(chalk.red("------\nCommande pas chargée : Pas de description ou de nom\n------"));
            }

            // Ajoute la commande au client Discord
            client.commands.set(command.name, command);

            // Affiche un message indiquant que la commande a été chargée avec succès
            console.log(chalk.blue("Commande chargée :", command.name));
        }).catch(err => {
            console.log(chalk.red(`Erreur lors du chargement de la commande ${commandFile}:`, err));
        });
    });
}
