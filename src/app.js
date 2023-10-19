import express from 'express'
const exphbs = require('express-handlebars');
import session from 'express-session';
const FileStore = require('session-file-store')(session);
import flash from 'express-flash';
//db
import conn from '../db/conn';

//Models
import User from '../models/User';
import Tought from '../models/Tought';
import WanoTought from '../models/WanoTought';

import ToughtController from '../controllers/ToughtController';

//Rotas
import toughtsRoutes from '../routes/toughtsRoutes';
import authRoutes from '../routes/authRoutes';
import archsRoutes from '../routes/archsRoutes'

const app = express();



//template engine
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

//receber resposta do body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//session middleware - diz onde o express vai salvar as seções. Configuração de sessão e seu cookie
app.use(
  session({
    name: "session",
    secret: "nosso_secret",
    ttl: 360000,
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),

    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
  })
);

// flash messages - Status do sistema, pequenas mensagens como "Cadastro feito". São feedbacks apos alteração no BD
app.use(flash());

// Salvar compartilhar sessao caso user esteja logado
app.use((req, res, next) => {
  //vamos criar uma logica para o andamento do sistema, dependendo do que queremos fazer
  //Verificar se o usuario tá logado.
  if (req.session.userId) {
    //Mandamos dados da sessão dele para outras. 
    res.locals.session = req.session;
  } else {
    req.session.userId = null;
  }
  // caso o usuario não está logado
  next();
});

//arquivos estaticoss
app.use(express.static("public"));

// Usar rotas
app.use('/op/toughts', toughtsRoutes);
app.use('/', authRoutes);
app.use('/archs', archsRoutes);

app.get('/', ToughtController.showHome);


//{force: true}
conn.sync()
    .then(() => {
        console.log('Conectado ao MySQL!');
        app.listen(3000);
    })
    .catch(err => {
        console.log('Deu erro' + err);
    })