//importar bd, datatypes e outros models se necessário
import { DataTypes } from 'sequelize';
import db from '../db/conn';
import Tought from './Tought';
import User from './User';
//import User from './User';

const Comment = db.define('Comment', {
    content: {
        type: DataTypes.STRING,
        required: true,
    },

    userName: {
        type: DataTypes.STRING,
        required: true,
    }

});

//Relacionamentos
Comment.belongsTo(Tought); //1
Tought.hasMany(Comment); //N


module.exports = Comment;
