"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const Connection_1 = __importDefault(require("./Connection"));
const Livres = Connection_1.default.define("Livre", {
    idLivres: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    titre: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    sousTitre: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    dateLecture: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
}, { timestamps: false });
exports.default = Livres;
