"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const Connection_1 = __importDefault(require("./Connection"));
const Users = Connection_1.default.define("Users", {
    idUser: {
        type: sequelize_1.DataTypes.STRING(),
        allowNull: false,
    },
    UserName: {
        type: sequelize_1.DataTypes.STRING(),
        allowNull: false,
        unique: true
    },
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        primaryKey: true,
        autoIncrement: true
    }
}, { timestamps: false });
exports.default = Users;
