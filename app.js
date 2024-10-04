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
const crypto = require('crypto');
const nodemailer = require("nodemailer");


const Uicallback = require("./models/uicallback")
const Servercallback = require("./models/servercallback")
const Statuscheck = require("./models/statuscheck")
const Transactionmaster = require("./models/transactionmaster")
const Passregister = require("./models/bookpass")
const Passmaster = require("./models/passmaster")


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

  const PHONEPE_HOST_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
  //const PHONEPE_HOST_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"
  //const MERCHANT_ID = "PGTESTPAYUAT86" //  TESTING
  const MERCHANT_ID = "INDIAMONLINE" //  PRODUCTION
  const SALT_INDEX = '1'
  //const SALT_KEY = "96434309-7796-489d-8924-ab56988a6076"  //TESTING
  const SALT_KEY = "aa9ce227-5204-4bfe-a8ae-6ad40ec768f8"  //PRODUCTION
  const PAY_ENDPOINT = '/pg/v1/pay'

const storefinalresponse = async(response) => {
  const entireresponse = response
 // console.log("in storefinal respnse")
 // console.log(response)
 // console.log(typeof(response))

  const statuscheckdata = new Statuscheck({
    entireresponse
  })
 await statuscheckdata.save()
 return response;

}

const sendpassmail = async (topassurl,finalemail) => {
        // Set up email transporter
        let transporter = nodemailer.createTransport({
          host: "smtp-relay.brevo.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.BREEVO_ID,
            pass: process.env.BREEVO_PASS,
          },
      });
      
       // Send email
        let info = await transporter.sendMail({
          to: finalemail,
          cc: "shivanshu@abscod.com,info@indiadesignershow.com",
          from: "info@indiadesignershow.com",
          subject: "Your IDS Season 5 Pass.",
          html: `
            <h3>Thank you for booking passes. <a href="${topassurl}">Click here</a> to download your passes</h3>
           
               
             
            `,
        });
}

{/* <ul>
<li><p>Name : ${name} </p></li>
<li><p>Email : ${email}</p></li>
<li><p>Phone : ${phone}</p></li>
<li><p>Occupation : ${occupation}</p></li>
</ul> */}

// Payment API route
app.post("/paynow", async(req, res) => {
  const {
    totalprice,
    merchanttxnid,
    quantity,
    showid,
    cost
  } = req.body;

  const transactionmasterdata = new Transactionmaster({
    showid,
    merchanttxnid,
    quantity,
    cost,
    totalprice

  })

  await transactionmasterdata.save()





const payload = 
 {	
	"merchantId": MERCHANT_ID, 
	"merchantTransactionId": merchanttxnid, // String Mandatory
	"merchantUserId": "unknowg8835", // String Mandatory - used for auto login.
  "amount": totalprice,
  "redirectUrl": `https://idsserver-app-tk64n.ondigitalocean.app/paystatus?id=${merchanttxnid}`,
  //"redirectUrl": `http://localhost:8800/paystatus?id=${merchanttxnid}`,
  "redirectMode": "POST",
  "callbackUrl": "https://idsserver-app-tk64n.ondigitalocean.app/servercallback",
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
  url: PHONEPE_HOST_URL,
  headers: {
        accept: 'application/json',
        "Content-Type": 'application/json',
				"X-VERIFY": xVerify
				},
  data: {
    request: base63encodedpayload
  },
};
        
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



});


// SERVER CALLBACK API route
app.post("/servercallback", async(req, res) => {

  //console.log("in server callback")


  const entireresponse = req.body.response

  const servercallbackdata = new Servercallback({
    entireresponse
  })

await servercallbackdata.save()
 
//   const {
//    response
//   } = req.body;

// var b = Buffer.from(response, 'base64')
// var s = b.toString();
// console.log(s)

//console.log('in server callback')

//return res.redirect("https://indiadesignershow.com/")
res.status(200).json({message:"success is"});
// const bufferObj = Buffer.from(JSON.stringify(payload),"utf-8");
// const base63encodedpayload = bufferObj.toString("base64")

// const xVerify = sha256(base63encodedpayload + PAY_ENDPOINT + SALT_KEY) + '###' + SALT_INDEX


});

// console.log(txnid)

app.get('/getpassdetails', async(req,res) => {
  const txnid = req.query.txnid;
  console.log("in get pass detail")
  console.log(txnid)

  Passmaster.find(
    { finalmerchanttxnid: txnid },  // Query parameter 
  )
  .then(
    (data)=>{

   
      
          res.status(200).send(
              data,
            );
  


  }
  )
  
  //res.status(200).json(txnid);

})

app.post('/paystatus', async (req, res) => {


const {
code,
merchantId,
transactionId,
amount,
providerReferenceId,
merchantOrderId,
  } = req.body;

  const entireresponse = req.body

 const Uicallbackdata = new Uicallback(
  {
code,
merchantId,
transactionId,
amount,
providerReferenceId,
merchantOrderId,
entireresponse
  }
 )

 await Uicallbackdata.save()

 // const merchantTransactionId = req.query.id
  //const merchantId = MERCHANT_ID


  const keyIndex = 1
  const string = `/pg/v1/status/${merchantId}/${transactionId}` + SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(string).digest('hex');
  const checksum = sha256 + '###' + keyIndex;


const options = {
      method: 'GET',
      // url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${transactionId}`,
      url: `https://api.phonepe.com/apis/hermes/pg/v1/pay/pg/v1/status/${merchantId}/${transactionId}`,
      headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': `${merchantId}`
      }
  }


  axios.request(options).then(function(response) {


  storefinalresponse(response.data)

    


      if (response.data.success === true) {


        Transactionmaster.updateOne(
          { merchanttxnid: transactionId },  // Query parameter 
    { $set: { paymentstatus: "complete" } }     // Update operation
        ).then(
function(){


  Transactionmaster.findOne(
    { merchanttxnid: transactionId },  // Query parameter 
  )
  .then((result)=>{
   

   const finalshowid = result.showid
   const finalmerchanttxnid = result.merchanttxnid
   const finalquantity = result.quantity
   const finaltotalprice = result.totalprice
   const finalcost = result.cost

  //  console.log(finalpassshowid)
  //  console.log(finalpassmerchanttxnid)
  //  console.log(finalpassquantity)
  //  console.log(finalpasstotalprice)
  //  console.log(finalpasscost)

   Passregister.findOne(
    { merchanttxnid: transactionId },
   )
   .then((result) =>{

    console.log("result is")
    console.log(result)

    const finalname = result.name
    const finalemail = result.email
    const finalphone = result.phone
    const finaloccupation = result.occupation

    const quantitycounter = Number(finalquantity)

    for (let i = 0; i < quantitycounter; i++) {
      const finalpassid = i + "o" + quantitycounter + finalmerchanttxnid

      const passmasterdata = new Passmaster({
      
        finalshowid,
        finalmerchanttxnid ,
        finalquantity ,
        finaltotalprice ,
        finalcost ,
        finalname ,
        finalemail ,
        finalphone ,
        finaloccupation,
        finalpassid
        })

        passmasterdata.save()
        .then(()=>{
          const topassurl = "https://www.indiadesignershow.com/Epass/" + finalmerchanttxnid
          sendpassmail(topassurl,finalemail)

        })


      
       

  




    }

   

    //const url = `http://localhost:5173/paymentstatus/success/${transactionId}`
    const url = `https://www.indiadesignershow.com/paymentstatus/success/${transactionId}`
    return res.redirect(url)

   })




  })

  //find registration details
  //find transaction details
  //generate ticketid for each quantity and insert to passmaster


 
}
        )



          
      } else {
          const url = `https://www.indiadesignershow.com/paymentstatus/failed/${transactionId}`
       //   const url = `http://localhost:5173/paymentstatus/failed/${transactionId}`
          return res.redirect(url)
      }

  }).catch(function (error) {
      console.log(error)
  })


})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});
connectToMongoDB();
