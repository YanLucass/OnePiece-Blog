import express from 'express';
import checkAuth from '../helpers/checkAuth';
import ArchController from '../controllers/ArchController';
const router = express.Router();

router.get('/wano', checkAuth, ArchController.wano);
router.post('/archToughtAdd', checkAuth, ArchController.archWanoAdd);

module.exports = router;