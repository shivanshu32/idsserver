const fs = require('fs');
const path = require('path');
const csv = require("csvtojson");

exports.uploadBulk = async (req, res) => {
  try {
    const response = await csv().fromFile(req.file.path);

    const ClientData = response.map(row => ({
      image: row?.image + ".jpg",
      imageUrl : "",
      brandName : row?.brandName,
      description : row?.description
    }));

    console.log(ClientData);

    // Define the directory path for storing JSON files
    const directory = path.join(__dirname, '../csv');
    
    // Create the directory if it doesn't exist
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }

    // Define the file path for the JSON file
    const filePath = path.join(directory, 'brandDetails.json');

    // Write the JSON data to the file
    fs.writeFileSync(filePath, JSON.stringify(ClientData, null, 2));

    res.status(201).json({ message: "Data stored as JSON file", clientData: ClientData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};