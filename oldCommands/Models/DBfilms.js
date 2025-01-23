"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const Connection_1 = __importDefault(require("./Connection"));
const Films = Connection_1.default.define("Film", {
    idFilm: {
        type: sequelize_1.DataTypes.STRING(),
        allowNull: false,
        primaryKey: true,
    },
    titre: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    realisateur: {
        type: sequelize_1.DataTypes.STRING(30),
        allowNull: false,
    },
    dateSortie: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
}, { timestamps: false });
exports.default = Films;
