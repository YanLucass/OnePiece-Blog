import express from 'express'
const router = express.Router();
// importar controllers
import ToughtController from '../controllers/ToughtController';
import checkAuth from '../helpers/checkAuth';

//dashboard
router.get('/dashboard', checkAuth, ToughtController.dashboard);
//criar pensamento geral
router.get('/general', checkAuth, ToughtController.generalAdd);
router.post('/general', checkAuth, ToughtController.generalAddPost);

router.get('/', ToughtController.showHome);



module.exports = router;