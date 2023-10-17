import express from 'express';
const router = express.Router();
import AuthController from '../controllers/AuthController';

router.get('/register', AuthController.register);
router.post('/register', AuthController.createUser);
router.get('/logout', AuthController.logout);
router.get('/login', AuthController.login);
router.post('/login', AuthController.loginPost);
module.exports = router;