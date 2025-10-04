// routes/pet.js
const express = require('express');
const router = express.Router();
const userController = require('../Controllers/user');
const petController = require('../Controllers/pet');
const upload = require('../utils/multer');

// Admin User CRUD
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);



// ✅ Use multer fields middleware correctly
const petUploadFields = upload.fields([
  { name: 'level1_image', maxCount: 1 },
  { name: 'level2_image', maxCount: 1 },
  { name: 'level3_image', maxCount: 1 }
]);
// Admin Pet CRUD
router.get('/pets', petController.getAllPets);
router.get('/pets/:id', petController.getPetById);
router.post('/pets', petUploadFields, petController.createPet);
router.put('/pets/:id', petUploadFields, petController.updatePet);
router.delete('/pets/:id', petController.deletePet);


module.exports = router;