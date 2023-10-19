import WanoTought from '../models/WanoTought'
import Tought from '../models/Tought'
import User from '../models/User';

module.exports = class ToughtController {

    static async showHome(req, res){
        //exibir pensamentos na home
        const toughtsData = await Tought.findAll({ include: User});
        const toughts = toughtsData.map(result => result.get({plain: true}));
        res.render('optoughts/home', { toughts });
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
            })

            //console.log(user)
            const toughts = user.Toughts.map(result => result.dataValues);
            const wanoTought = user.WanoToughts.map(result => result.dataValues);
            res.render('optoughts/dashboard', { toughts, wanoTought})    
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

        if(!content) {
            req.flash('message', 'Digite um conteudo');
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
    static edit(req, res) {
        res.render('optoughts/edit');
    }

    //showArchss
    static showArchs(req, res) {
        res.render('optoughts/archs');
    }
}