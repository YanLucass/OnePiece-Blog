//importar models
import WanoTought from '../models/WanoTought'
import User from '../models/User';
import Tought from '../models/Tought';

module.exports = class ArchController {

    static async wano(req, res) {
        const toughtsWanoData = await WanoTought.findAll({ include: User});
        const toughtsWano = toughtsWanoData.map(result => result.get({plain: true}));

        res.render('archs/wano', { toughtsWano});
    }

    static async archWanoAdd(req, res) {
        const { title, content } = req.body;
    
        if(!title) {
            req.flash('message', 'Preencha os campos!');
            res.redirect('/archs/wano');
            return;
        }

        const WanoData = {
            title,
            content,
            arch: 'Wano',
            UserId: req.session.userId
        }

        try {
            await WanoTought.create(WanoData);
            req.flash('message', 'Habilidade pensante desbloqueada!!');
            req.session.save(() => {
                res.redirect('/archs/wano')
                return;
            })
        } catch(err) {
            console.log('Deu erro' + err);
        }
    }   
}