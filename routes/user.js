const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')

const { registerUser, loginUser,logoutUser } = require('../Controllers/user')
const petController = require('../Controllers/pet');
router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout',logoutUser);

router.post('/pets', petController.createPetForUser);
module.exports = router