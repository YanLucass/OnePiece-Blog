import { DataTypes } from "sequelize";
import db from '../db/conn';
import User from '../models/User';


const Tought = db.define('Tought', {
    title: {
        type: DataTypes.STRING,
        required: true
    },

    content: {
        type: DataTypes.STRING,
        required: true
    },
    
});

module.exports = Tought;

Tought.belongsTo(User);
User.hasMany(Tought);




