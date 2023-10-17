//models necessários
import User from '../models/User';
import bcrypt from 'bcryptjs'

module.exports = class AuthController {
    
    //metodo login

    static login(req, res) {
        res.render('auth/login');
    } 

    static async loginPost(req, res) {
        
        const email = req.body.email;
        const password = req.body.password;

        //verify if email exists
        const user = await User.findOne({ where: { email: email }});
        if(!user) {
            req.flash('message', 'Esse email não existe!');
            res.render('auth/login');
            return;
        }

        //verify matchs passowords
        const passwordMatch = bcrypt.compareSync(password, user.password);
        if(!passwordMatch) {
            req.flash('message', 'Senha incorreta!');
            res.render('auth/login');
            return;
        }
        
        //construir sessão
        req.session.userId = user.id;
        req.flash('message', 'autenticado com sucesso!');
        req.session.save(() => {
            res.redirect('/');
            return;
        })

       
    }

    static register(req, res) {
        res.render('auth/register');
    }

    //Criar usuario
    static async createUser(req, res) {
        const { name, email, password, confirmPassword } = req.body;
        //validações

        //passwords don't match
        if(password != confirmPassword) {
            req.flash('message', 'Senhas não conferem');
            res.render('auth/register');
            return;
        }

        //validation email
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!regex.test(email)) {
            req.flash('message', 'email em formato inválido');
            res.render('auth/register');
            return;
        } 

        //check if users exists
        const checkUser = await User.findOne({ where: { email: email}});
        if(checkUser) {
            req.flash('message', 'Email ja cadastrado!');
            res.render('auth/register');
            return;
        }

        //create passwrod
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        
        const userData = {
            name,
            email,
            password: hashedPassword
        }

        try {
            const newUser = await User.create(userData);
            req.session.userId = newUser.id;
            req.flash('message', 'Usuario criado com sucesso!');
            
            req.session.save(() => {
                //console.log(req.session);
                res.redirect('/');
                return;
            });

        } catch(err) {
            console.log('Deu erro' + err);
        }
    }

    static async logout(req, res) {
       req.session.destroy();
        res.redirect('/login');
        return;
    }
}
