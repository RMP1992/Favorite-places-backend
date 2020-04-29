const HttpError = require('../models/http-error');
const uuid = require('uuid/v4')
const { validationResult } = require('express-validator');

const DUMMY_USER = [{
    id: 'u1',
    name: 'Ruben',
    email: 'test@test.com',
    password: 'tester'
}]

const getUsers = (req, res, next) => {
    res.json({users: DUMMY_USER})
}

const signup = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalid inputs passed, please check your data', 422)
    }

    const {name, email, password} = req.body;

    const hasUser = DUMMY_USER.find(u => u.email ===email);

    if(hasUser){
        throw new HttpError('User already exists.', 422)
    }

    const createdUser = {
        id: uuid(),
        name: name,
        email: email,
        password: password
    }
    DUMMY_USER.push(createdUser)

    res.status(201).json({user: createdUser})
}

const login = (req, res, next) => {
    const {email, password} = req.body

    const identifiedUser = DUMMY_USER.find(u => u.email === email)
    if(!identifiedUser || identifiedUser.password !== password){
        throw new HttpError('Could not identify user.', 401)
    }
    res.json({message: 'Logged in.'})
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;