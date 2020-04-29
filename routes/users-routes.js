const express = require('express');
const { check } = require('express-validator');

const usersControllers = require('../controllers/users-controllers');

const router = express.Router();

router.get('/', usersControllers.getUsers)

router.post('/login', usersControllers.login)

router.post('/signup',
    [
        check('name')
            .not()
            .isEmpty(),
        check('email')
            .normalizeEmail() //makes emails not case sensitive
            .isEmail(),
        check('password')
            .isLength({min: 8})
    ], usersControllers.signup)

module.exports = router;