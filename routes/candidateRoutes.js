const express = require("express")

const { login, register, getUserInfo, userUpdate, userDelete, addProduct } = require('../controllers/CandidateController');
const auth = require("../middleware/Auth");
const { registerValidation, validate } = require("../validation/register");

const router = express.Router()

router.post('/login', login);
router.post('/register', registerValidation(), validate, register);
router.get('/user-info', auth, getUserInfo);
router.post('/user-update', auth, userUpdate);
router.delete('/user-delete', auth, userDelete);
router.post('/add-product', auth, addProduct);

module.exports = router;