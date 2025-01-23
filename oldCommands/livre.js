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
function getBookInfo(Titre) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            if (!process.env.APi_GOOGLE) {
                return "Clef de l'API manquante";
            }
            const response = yield axios_1.default.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(Titre)}&key=${process.env.API_GOOGLE}`); //&key=${process.env.API_GOOGLE} https://developers.google.com/books/docs/v1/using?hl=fr
            //appercu du réponse :https://www.googleapis.com/books/v1/volumes?q=Fondation
            const book = response.data.items[0]; // Prend le premier résultat 
            const infoLivre = {
                title: book.volumeInfo.title,
                year: book.volumeInfo.publishedDate,
                author: ((_a = book.volumeInfo.authors) === null || _a === void 0 ? void 0 : _a.join(', ')) || 'Auteur inconnu',
                description: book.volumeInfo.description || 'Pas de description disponible',
            };
            return infoLivre;
        }
        catch (error) {
            return 'Aucune information trouvée pour ce livre. ou Clef API incorrect';
        }
    });
}
module.exports = {
    name: "livre",
    description: "Commande pour obtenir l'info d'un livre",
    options: [
        {
            name: "title",
            description: "Titre du livre",
            required: true,
            type: "STRING",
        },
        {
            name: "author",
            description: "Auteur du livre",
            required: false,
            type: "STRING",
        },
    ],
    runSlash: (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
        yield interaction.deferReply({ ephemeral: true });
        const livre = interaction.options.getString("title");
        const infoLivre = yield getBookInfo(livre);
        if (typeof infoLivre === 'string') {
            yield interaction.editReply({ content: infoLivre });
        }
        else {
            const info = `**Titre**: ${infoLivre.title}\n**Auteur**: ${infoLivre.author}\n**Description**: ${infoLivre.description}\n**Année de publication**: ${infoLivre.year}`;
            yield interaction.editReply({ content: info });
        }
        console.log(infoLivre);
    })
};
