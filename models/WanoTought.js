import { DataTypes } from "sequelize";
import db from '../db/conn';
import User from './User';

const WanoTought = db.define('WanoTought', {

    title: {
        type: DataTypes.STRING,
        required: true
    },

    content: {
        type: DataTypes.STRING,
        required: true
    },

    arch: {
        type: DataTypes.STRING,
        required: true
    }
});


WanoTought.belongsTo(User);
User.hasMany(WanoTought);

module.exports = WanoTought;