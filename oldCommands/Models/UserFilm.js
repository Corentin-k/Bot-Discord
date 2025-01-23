"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const Connection_1 = __importDefault(require("./Connection"));
const UsersFilms = Connection_1.default.define("UsersFilms", {
    idFilm: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    idUser: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
}, { timestamps: false });
exports.default = UsersFilms;
