const express = require("express");
const router = express.Router();
const setController = require("../controllers/setImages");
const {fileMulter} = require('../multer/fileMulter');
router.post('/setImages', fileMulter, setController.uploadBulk);
module.exports = router;