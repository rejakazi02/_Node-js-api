// Main Module Required..
const express = require('express');

// Created Require Files..
const controller = require('../controller/user');
const inputValidator = require('../validation/user');
const checkAuth = require('../middileware/check-user-auth');

const router = express.Router();

/**
 * /api/user
 * http://localhost:3000/api/user
 */


router.post('/registration', inputValidator.checkUserRegInput, controller.userRegistration);
router.put('/login', controller.userLogin);
router.get('/logged-in-user-data', checkAuth, controller.getLoginUserInfo);
router.get('/get-all-user-list', controller.getUserLists);

// Export All router..
module.exports = router;
