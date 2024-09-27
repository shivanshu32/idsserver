const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const apiRoute = require("./routes/storeImages");
const getRoute = require("./routes/getImages");
const evenRegistration = require("./routes/eventRegistration");
const axios = require('axios');
const sha256 = require('sha256');


dotenv.config();
const app = express();
async function connectToMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully with indexes");
  } catch (error) {
    console.error("Error connecting to MongoDB or creating indexes:", error);
    process.exit(1);
  }
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("common"));
app.use('/ids', evenRegistration );


const port = process.env.PORT || 8800;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Routes
app.use(apiRoute);
app.use(getRoute);

// Default route
app.get("/", (req, res) => {
  res.status(200).json("API Connected");
});


// Payment API route
app.post("/paynow", (req, res) => {
  const {
    price,
    merchanttxnid
  } = req.body;
  //res.status(200).json("Payment goes here");

//  console.log('req starts')
//  console.log(req)
//  console.log("req ends")

  const PHONEPE_HOST_URL = "https://api.phonepe.com/apis/hermes"
  //const MERCHANT_ID = "PGTESTPAYUAT" //  TESTING
  const MERCHANT_ID = "INDIAMONLINE" //  PRODUCTION
  const SALT_INDEX = '1'
  //const SALT_KEY = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399"  //TESTING
  const SALT_KEY = "aa9ce227-5204-4bfe-a8ae-6ad40ec768f8"  //PRODUCTION
  const PAY_ENDPOINT = '/pg/v1/pay'

const payload = 
 {	
	"merchantId": MERCHANT_ID, 
	"merchantTransactionId": merchanttxnid, // String Mandatory
	"merchantUserId": "unknowg8835", // String Mandatory - used for auto login.
  "amount": price,
  "redirectUrl": "https://localhost:8800/",
  "redirectMode": "REDIRECT",
  "callbackUrl": "https://localhost:8800/",
  "mobileNumber": "8630062102",
  "paymentInstrument": {
  "type": "PAY_PAGE"
  } 
}

 //Test API Key Value	:	099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
  //Test API Key Index	:	1
  //Test Host URL	:	https://api-preprod.phonepe.com/apis/hermes

  //Merchant Id	:	INDIAMONLINE
//Production API Key Value	:	1
//Production API Key Index File	:	INDIAMONLINE_1.json
//Production Host URL	:	https://api.phonepe.com/apis/hermes
// "keyIndex": 1,
 // "key": "aa9ce227-5204-4bfe-a8ae-6ad40ec768f8"

const bufferObj = Buffer.from(JSON.stringify(payload),"utf-8");
const base63encodedpayload = bufferObj.toString("base64")

const xVerify = sha256(base63encodedpayload + PAY_ENDPOINT + SALT_KEY) + '###' + SALT_INDEX

// let data = JSON.stringify({
//   "request": base63encodedpayload
// });

const options = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://api.phonepe.com/apis/hermes/pg/v1/pay',
  headers: {
        accept: 'application/json',
        "Content-Type": 'application/json',
				"X-VERIFY": xVerify
				},
  data: {
    request: base63encodedpayload
  },
};

// axios
//   .request(options)
//       .then(function (response) {
//       console.log("in response")
//       console.log(response.data);
//       res.status(200).json("responsee");
//   })
//   .catch(function (error) {
//     console.log("in error")
//     console.error(error);
//     res.status(200).json("error response");
//   });


        
  axios
    .request(options)
      .then(function (response) {
        console.log("response is")
            console.log(response.data);
            res.status(200).json(response.data);
        })
        .catch(function (error) {
            console.error(error);
            res.status(200).json(error);
        });


// const options = {
//   method: 'post',
//   url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay',
//   headers: {
//         accept: 'text/plain',
//         'Content-Type': 'application/json',
//         'X-VERIFY': xVerify
// 				},
// data: {
//   request: base63encodedpayload
// }

// };
// axios
//   .request(options)
//       .then(function (response) {
//       console.log(response.data);
//   })
//   .catch(function (error) {
//     console.error(error);
//   });

});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});
connectToMongoDB();
