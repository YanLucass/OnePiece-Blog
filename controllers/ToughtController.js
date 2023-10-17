import Tought from '../models/Tought'
import User from '../models/User';

module.exports = class ToughtController {

    static showHome(req, res){
        res.render('optoughts/home');
    }

    //dashboard
    static async dashboard(req, res) {
        const userId = req.session.userId;
        if(!userId) {
            res.redirect('/login');
            return;
        }
        try {
            const user = await User.findOne({where: {id: userId}, include: Tought, plain: true});
            const toughts = user.Toughts.map(result => result.dataValues);

            res.render('optoughts/dashboard', { toughts })    
        }
        catch(err) {
            console.log(err);
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
}