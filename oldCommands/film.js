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
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const DBfilms_1 = __importDefault(require("../Models/DBfilms"));
const User_1 = __importDefault(require("../Models/User"));
const UserFilm_1 = __importDefault(require("../Models/UserFilm"));
// Fonction pour récupérer les informations d'un film en utilisant l'API OMDb
function getMovieInfo(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!process.env.API_FILM) {
                return "Clef de l'API manquante";
            }
            const response = yield axios_1.default.get(`http://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${process.env.API_FILM}`);
            const movie = response.data;
            const infoFilm = {
                title: movie.Title,
                year: movie.Year,
                director: movie.Director || 'Réalisateur inconnu',
                plot: movie.Plot || 'Pas de description disponible',
            };
            if (infoFilm.title == undefined) {
                return 'Aucune information trouvée pour ce film.';
            }
            return infoFilm;
        }
        catch (error) {
            return 'Aucune information trouvée pour ce film. ou Clef API incorrect';
        }
    });
}
module.exports = {
    name: "film",
    description: "Commande pour obtenir l'info d'un film",
    options: [
        {
            name: "title",
            description: "Titre du film",
            required: true,
            type: "STRING",
        },
        {
            name: "réalisateur",
            description: "réalisateur du film",
            required: false,
            type: "STRING",
        },
    ],
    runSlash: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield interaction.deferReply({ ephemeral: true });
        let film = interaction.options.getString("title");
        const filmInfo = yield getMovieInfo(film);
        console.log(filmInfo);
        if (typeof filmInfo === 'string') {
            yield interaction.editReply({ content: filmInfo });
        }
        else {
            const info = `**Titre**: ${filmInfo.title}\n**Réalisateur**: ${filmInfo.director}\n**Synopsis**: ${filmInfo.plot}\n**Année**: ${filmInfo.year}`;
            yield interaction.editReply({ content: info });
            // Ajouter le film en BDD
            yield User_1.default.findOrCreate({
                where: { idUser: interaction.user.id, UserName: interaction.user.username },
            });
            const idFilm = (0, uuid_1.v4)();
            const iduser = interaction.user.id;
            yield DBfilms_1.default.create({
                idFilm: idFilm,
                titre: filmInfo.title,
                realisateur: filmInfo.director,
                dateSortie: filmInfo.year,
            });
            yield UserFilm_1.default.create({
                idFilm: idFilm,
                idUser: iduser,
            });
            yield interaction.followUp({ content: `Le film "${filmInfo.title}" a été ajouté à votre liste.`, ephemeral: true });
        }
    })
};
