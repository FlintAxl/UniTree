const express = require('express');
const router = express.Router();
const petController = require('../Controllers/pet');

// User-side pet creation (when registering/choosing a pet)
router.post('/pets/user', petController.createPetForUser);

module.exports = router;