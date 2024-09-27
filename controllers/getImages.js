const gallary = require("../files/gallary.json");
const season1 = require("../files/season1.json");
const season2 = require("../files/season2.json");
const season3 = require("../files/season3.json");
const season4 = require("../files/season4.json");
const genx = require("../files/genx.json");
const homeHighlight = require("../files/homeHighlights.json");
const paidMedia = require("../files/paidMedia.json");
const brandDetails = require("../files/brandDetails.json");
const { getSignedUrlFromS3 } = require("../utils/S3Utils");

exports.getHighlight = async (req, res) => {
  try {
    let imageData;
    imageData = homeHighlight;

    const imageUrls = await Promise.all(
      imageData.map(async (item) => {
        const imageUrl = await getSignedUrlFromS3(item.image);
        return { ...item, imageUrl: imageUrl };
      })
    );

    res.status(200).json(imageUrls);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getSeason = async (req, res) => {
  try {
    const { id } = req.params;
    let imageData;

    switch (id) {
      case "1":
        imageData = season1;
        break;
      case "2":
        imageData = season2;
        break;
      case "3":
        imageData = season3;
        break;
      case "4":
        imageData = season4;
        break;
      default:
        throw new Error("Invalid season ID");
    }

    const imageUrls = await Promise.all(
      imageData.map(async (item) => {
        const imageUrl = await getSignedUrlFromS3(item.image);
        return { ...item, imageUrl: imageUrl };
      })
    );

    res.status(200).json(imageUrls);

    // res.status(200).json(imageData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getGenXOrPaidMedia = async (req, res) => {
  try {
    const { value } = req.query;
    let imageData;

    if (value === "genx") {
      imageData = genx;
    } else {
      imageData = paidMedia;
    }

    const imageUrls = await Promise.all(
      imageData.map(async (item) => {
        const imageUrl = await getSignedUrlFromS3(item.image);
        return { ...item, imageUrl: imageUrl };
      })
    );

    res.status(200).json(imageUrls);

    // res.status(200).json(imageData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getGallery = async (req, res) => {
  try {
    let imageData;
    imageData = gallary;

    const imageUrls = await Promise.all(
      imageData.map(async (item) => {
        const imageUrl = await getSignedUrlFromS3(item.image);
        return { ...item, imageUrl: imageUrl };
      })
    );

    res.status(200).json(imageUrls);

    // res.status(200).json(imageData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getOneImg = async (req, res) => {
  try {
    let { imgName } = req.query;

    const imageUrl = await getSignedUrlFromS3(imgName);

    res.status(200).json(imageUrl);

    // res.status(200).json(imageData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getBrand = async (req, res) => {
  try {
    let imageData;
    imageData = brandDetails;

    const imageUrls = await Promise.all(
      imageData.map(async (item) => {
        const imageUrl = await getSignedUrlFromS3(item.image);
        return { ...item, imageUrl: imageUrl };
      })
    );

    res.status(200).json(imageUrls);

    // res.status(200).json(imageData);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};
