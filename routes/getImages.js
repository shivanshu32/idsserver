const express = require("express");
const router = express.Router();

const getImageController = require("../controllers/getImages");

router.get("/getSeason/:id", getImageController.getSeason);
router.get("/getGenXOrPaidMedia", getImageController.getGenXOrPaidMedia);
router.get("/getGallary", getImageController.getGallery);
router.get("/getOneImg", getImageController.getOneImg);
router.get("/getBrand", getImageController.getBrand);
router.get("/gethighlight", getImageController.getHighlight);

module.exports = router;
