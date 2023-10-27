import WanoTought from '../models/WanoTought'
import Tought from '../models/Tought'
import User from '../models/User';
import Comment from '../models/Comment'
import { Op } from 'sequelize';

module.exports = class ToughtController {

    static async showHome(req, res){
        let search = '';
        // Se tiver parametros nas querys params
        if(req.query.search) {
            search = req.query.search;
        }

        // Ordernação
        let order = 'DESC' // por padrão dos mais recentes pros mais antigos.
        // mas caso venha
        if(req.query.order === 'old') {
            order = 'ASC' // dos mais antigos para mais novos
        } else {
            order = 'DESC'
        }

        const toughtsData = await Tought.findAll({
            include: [
                { model: User},
                { model: Comment},
            ],

            where: {
                title: { [Op.like]: `%${search}%`},
            },
            order: [['createdAt', order]]
            
        });
        // console.log(toughtsData)
        const allToughtsQty = await Tought.count();
        const toughts = toughtsData.map(result => result.get({plain: true}));
        // console.log(toughts);
        let toughtsQty = toughts.length;

        //handlebars não reconhece 0 como false.
        if(toughtsQty === 0) {
            toughtsQty = false;
        }
        res.render('optoughts/home', { search, toughts, toughtsQty, allToughtsQty });
    }

    //dashboard
    static async dashboard(req, res) {
        const userId = req.session.userId;
        if(!userId) {
            res.redirect('/login');
            return;
        }
        try {
            const user = await User.findOne(
                { where: {id: userId},
                include: [Tought, WanoTought],
            });

            const userName = user.name;
            const toughts = user.Toughts.map(result => result.dataValues);
            const wanoTought = user.WanoToughts.map(result => result.dataValues);
            res.render('optoughts/dashboard', {userName, toughts, wanoTought})    
        }
        catch(err) {
            console.log('Deu erro' + err);
        }
    }

    //Criar pensamento geral apos clique na dashboard   
    static generalAdd(req, res) {
        res.render('optoughts/generalTought');
    }

    static async generalAddPost(req, res) {
        const { title, content} = req.body;
        if(!title) {
            req.flash('message', 'Digite um título!');
            res.redirect('/op/toughts/general');
            return;
        }

       
        const toughtData = {
            title,
            content,
            UserId: req.session.userId
        }

        console.log(toughtData);    
        try {
            await Tought.create(toughtData);
            req.session.save(() => {
                res.redirect('/op/toughts/dashboard');
                return;
            })
         } 
         catch(err) {
        console.log('Deu erro' + err);
        }      
    }

    // Editar pensamento
    static async edit(req, res) {
        const id = req.params.id;
        try {
        const tought = await Tought.findOne({ where: { id: id }, raw: true});
        res.render('optoughts/edit', { tought });
        } catch(err) {
            console.log(err);
        }
     
    }

    static async editPost(req, res) {
        
        const id = req.body.id
        
        const toughtData = {
            title: req.body.title,
            content: req.body.content,
            UserId: req.session.userId
        }

        console.log(id);

        console.log(toughtData)

        try {
            await Tought.update(toughtData, { where: {id: id}});
            req.flash('message', 'Pensamento editado');
            req.session.save(() => {
                res.redirect('/op/toughts/dashboard');
                return;
            })

        } catch(err) {
            console.log('Ocorreu um erro:' + err);
        }
    }

    //deletar pensamento geral
    static async deleteGeneral(req, res) {
        const id = req.body.id;
        const uniq = req.body.uniq;
        try {
            switch(uniq) {

                case 'Geral':
                    await Tought.destroy({where: { id: id }});
                    res.redirect('/op/toughts/dashboard');
                break;

                case 'Wano':
                    await WanoTought.destroy({where: {id: id}});
                    res.redirect('/op/toughts/dashboard');
                 break;   
            }
            
        } catch(err) {
            console.log('Deu erro' + err);
        }
    }

    //showArchss
    static showArchs(req, res) {
        res.render('optoughts/archs');
    }

    static async addComment(req, res) {

        const userId = req.session.userId;
        const user = await User.findOne({where: { id: userId}});
        
        console.log(user.name);
        const content = {
            content: req.body.content,
            ToughtId: req.body.toughtId,
            UserId: req.body.userId,
            userName: user.name
        }

        console.log(content);
        try {
            
           
            if(!userId) {
                return;
            }
            await Comment.create(content);
            req.flash('message', 'Comentário adiocionado com sucesso');
            req.session.save(() => {
                res.redirect('/');
                return;
            })
            
            
        } catch(err) {
            console.log('Ocorreu um erro' + err);
        }
    }

    }



