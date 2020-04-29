const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordinatesForAddress = require('../util/location');

let DUMMY_PLACES =[{
    id: 'p1',
    title: 'Shibuya Crossing',
    descritpion: 'Most famous crossing in the world',
    location: {
        lat: 35.6594666,
        lng: 139.7005536
    },
    address: '2 Chome-2-1 Dogenzaka, Shibuya City, Tokyo 150-0043, Japan',
    creator: 'u1'
}]

const getPlaceById = (req, res, next) => {
    const placeId = req.params.pid;

    const places = DUMMY_PLACES.filter(p =>{
        return p.id === placeId;
    });

    if(!places || places.length === 0) {
       throw new HttpError('Could not find places for the provided ID.', 404);
    }

    res.json({places: places})
};

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;

    const place = DUMMY_PLACES.find(p =>{
        return p.creator === userId;
    });
    if(!place){
        return next(
            new HttpError('Could not find a place for the provided user ID.', 404))
    }

    res.json({place: place})
}

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError('Invalid inputs passed, please check your data', 422))
    }

    const { title, description, address, creator } = req.body
    //the above is a shortcut for doing this for every property: const title = req.body.title

    let coordinates;
    try {
        coordinates = await getCoordinatesForAddress(address);
    } catch (error) {
        return next(error);
    }
    const createdPlace = {
        id: uuid(),
        title: title,
        description: description,
        location: coordinates,
        address: address,
        creator: creator
    }
    DUMMY_PLACES.push(createdPlace)

    res.status(201).json({place: createdPlace})
}
const updatePlace = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new HttpError('Invalid inputs passed, please check your data', 422)
    }

    const placeId = req.params.pid;
    const {title, description} = req.body
    const updatedPlace = {...DUMMY_PLACES.find(p => p.id === placeId)}; //the spread operator ... clones the item in the array that matches the id
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId); //stores the index of a place
    updatedPlace.title = title; //updates the title of the cloned item in the array 
    updatedPlace.descritpion = description; //updates the description of the cloned item in the array

    DUMMY_PLACES[placeIndex] = updatedPlace; //replaces the original item in the array with the clone

    res.status(200).json({place: updatedPlace});
}
const deletePlace = (req, res, next) => {
    const placeId = req.params.pid;
    if(!DUMMY_PLACES.find(p => p.id === placeId)){
        throw new HttpError('Could not find a place for that ID.', 404)
    }
    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId)
    res.status(200).json({message: 'Deleted Place'})
}

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;