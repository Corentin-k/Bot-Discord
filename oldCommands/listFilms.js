"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Connection_1 = __importDefault(require("../Models/Connection"));
const sequelize_1 = require("sequelize");
function fetchMoviesForUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const listFilm = (yield Connection_1.default.query(`
      SELECT Films.*
      FROM Films
      INNER JOIN UsersFilms ON Films.idFilm = UsersFilms.idFilm 
      WHERE UsersFilms.idUser = :userId ;
      `, {
                replacements: { userId },
                type: sequelize_1.QueryTypes.SELECT,
            }));
            let formattedList = `Liste de films de ${listFilm[0].UserName} :\n`;
            let i = 0;
            for (const film of listFilm) {
                console.log(film);
                formattedList += `${i}. Titre : ${film.titre}\n`;
                formattedList += `   Réalisateur : ${film.realisateur}\n`;
                formattedList += `   Date de sortie : ${film.dateSortie}\n\n`;
                i = i + 1;
            }
            console.log(formattedList);
            return formattedList;
        }
        catch (error) {
            const err = `Erreur lors de l'exécution de la requête SQL : ${error}`;
            console.error(err);
            return err;
        }
    });
}
module.exports = {
    name: "listfilms",
    description: "Commande pour ma liste de films",
    options: [],
    runSlash: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield interaction.deferReply({ ephemeral: false });
        const iduser = interaction.user.id;
        //const info =`${interaction.user.username}, cette commande est en cours de programmation`;
        const info = yield fetchMoviesForUser(iduser);
        yield interaction.editReply({ content: info });
    })
};
