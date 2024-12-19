//import { nanoid } from 'nanoid';
const Modelf = require("../models/modelf");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const Brand = require("../models/brand");
const {nanoid} = require("nanoid")



//const nanoid = require("nanoid");
//import { nanoid } from 'nanoid'


const Passregister = require("../models/bookpass")
const Passmaster = require("../models/passmaster")


//f22
//a4
//v9  == 35
//s14
//s5
//s6 = s9 missing

dotenv.config();

const sendpassmail = async (topassurl,finalemail) => {


  // Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
service: 'gmail',
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASSWORD
}
});

// Email options


const mailOptions = {
to: finalemail,
from: process.env.EMAIL_USER,
subject: "Your IDS Season 5 Pass.",
html: `
<h3>Thank you for booking passes. <a href="${topassurl}">Click here</a> to download your passes</h3>

   
 
`,
}

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
if (error) {
console.error('❌ Error:', error.message);
} else {
console.log('✅ Email sent:', info.response);
}
});



    // Set up email transporter
  //   let transporter = nodemailer.createTransport({
  //     host: "smtp-relay.brevo.com",
  //     port: 587,
  //     secure: false,
  //     auth: {
  //       user: process.env.BREEVO_ID,
  //       pass: process.env.BREEVO_PASS,
  //     },
  // });
  
   // Send email
    // let info = await transporter.sendMail({
    //   to: finalemail,
    //   cc: "shivanshu@abscod.com,info@indiadesignershow.com",
    //   from: "info@indiadesignershow.com",
    //   subject: "Your IDS Season 5 Pass.",
    //   html: `
    //     <h3>Thank you for booking passes. <a href="${topassurl}">Click here</a> to download your passes</h3>
       
           
         
    //     `,
    // });
}

exports.passRegister = async (req, res) => {
 
//model.id = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
 // res.status(201).json({ message: "Registration for Pass" });
  const {
    name,
    email,
    phone,
    occupation,
    showid,
    quantity,
    price,
    followus,
    instagramid,
    resharelink
  } = req.body;

  try {
    // const existingModel = await Modelf.findOne({ phone });
    // if (existingModel) {
    //   return res
    //     .status(400)
    //     .json({ message: "Phone number already registered" });
    // }

  var merchanttxnid = nanoid() //=> "V1StGXR8_Z5jdHi6B-myT"
  merchanttxnid = merchanttxnid + showid

  const newPass = new Passregister({
    name,
    email,
    phone,
    occupation,
    showid,
    merchanttxnid,
    quantity,
    price,
    followus,
    instagramid,
    resharelink
  });

  await newPass.save();
// Set up email transporter
  // let transporter = nodemailer.createTransport({
  //     host: "smtp-relay.brevo.com",
  //     port: 587,
  //     secure: false,
  //     auth: {
  //       user: process.env.BREEVO_ID,
  //       pass: process.env.BREEVO_PASS,
  //     },
  // });

   // Send email
    // let info = await transporter.sendMail({
    //   to: "shivanshu@abscod.com",
    //   from: "info@indiadesignershow.com",
    //   subject: "IDS Pass Registration",
    //   html: `
    //     <h3>Registration for Pass, Payment Pending</h3>
    //     <ul>
    //       <li><p>Name : ${name} </p></li>
    //       <li><p>Email : ${email}</p></li>
    //       <li><p>Phone : ${phone}</p></li>
    //       <li><p>Occupation : ${occupation}</p></li>
           
         
    //     </ul>`,
    // });


    if (showid == "shw9")
    {
      res.status(201).json({ message: merchanttxnid });
    }
    else
    {
      console.log("show is not vip")
      const finalquantity = 1
      const finaltotalprice = 0
      const finalcost = 0
      const finalpassid = "FR" + merchanttxnid
      
      const passmasterdata = new Passmaster({
      
        showid,
        merchanttxnid ,
        finalquantity ,
        finaltotalprice ,
        finalcost ,
        name ,
        email ,
        phone ,
        occupation,
        finalpassid
        })

        passmasterdata.save()
        .then(()=>{
          const topassurl = "https://www.indiadesignershow.com/Epass/" + merchanttxnid
          sendpassmail(topassurl,email)

        })
    }

   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.modelRegister = async (req, res) => {
  const {
    fullname,
    email,
    phone,
    location,
    experience,
    age,
    social,
    height,
    designation,
  } = req.body;

  try {
    const existingModel = await Modelf.findOne({ phone });
    if (existingModel) {
      return res
        .status(400)
        .json({ message: "Phone number already registered" });
    }

    const newModelf = new Modelf({
      fullname,
      email,
      phone,
      location,
      experience,
      age,
      social,
      height,
      designation,
    });

    await newModelf.save();

       // Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email options


const mailOptions = {
  to: "info@indiadesignershow.com",
  from: process.env.EMAIL_USER,
  subject: "IDS Model Registration",
  html: `
    <h3>Model Details</h3>
    <ul>
      <li><p>Name : ${fullname} </p></li>
      <li><p>Email : ${email}</p></li>
      <li><p>Phone : ${phone}</p></li>
      <li><p>Location : ${location}</p></li>
      <li><p>Experience : ${experience}</p></li>
      <li><p>Age : ${age}</p></li>
      <li><p>Social : ${social}</p></li>
      <li><p>Height : ${height}</p></li>
      <li><p>Designation : ${designation}</p></li>
    </ul>`,
}

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('❌ Error:', error.message);
  } else {
    console.log('✅ Email sent:', info.response);
  }
});

    // Set up email transporter
    // let transporter = nodemailer.createTransport({
    //   host: "smtp-relay.brevo.com",
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: process.env.BREEVO_ID,
    //     pass: process.env.BREEVO_PASS,
    //   },
    // });

    // Send email
    // let info = await transporter.sendMail({
    //   to: "info@indiadesignershow.com",
    //   from: "info@indiadesignershow.com",
    //   subject: "IDS Model Registration",
    //   html: `
    //     <h3>Model Details</h3>
    //     <ul>
    //       <li><p>Name : ${fullname} </p></li>
    //       <li><p>Email : ${email}</p></li>
    //       <li><p>Phone : ${phone}</p></li>
    //       <li><p>Location : ${location}</p></li>
    //       <li><p>Experience : ${experience}</p></li>
    //       <li><p>Age : ${age}</p></li>
    //       <li><p>Social : ${social}</p></li>
    //       <li><p>Height : ${height}</p></li>
    //       <li><p>Designation : ${designation}</p></li>
    //     </ul>`,
    // });

    res.status(201).json({ message: "Model registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const Designer = require("../models/Designer");

exports.designerRegister = async (req, res) => {
  const { fullname, email, phone, location, experience, social, minspend } =
    req.body;

  try {
    const existingDesigner = await Designer.findOne({phone});
    if (existingDesigner) {
      return res
        .status(400)
        .json({ message: "Phone number already registered" });
    }

    const newDesigner = new Designer({
      fullname,
      email,
      phone,
      location,
      experience,
      social,
      minspend,
    });

    await newDesigner.save();



    // Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email options


const mailOptions = {
    to: "info@indiadesignershow.com",
    from: process.env.EMAIL_USER,
    subject: "IDS Designer Registration",
    html: `
      <h3>Designer Details</h3>
      <ul>
        <li><p>Name : ${fullname} </p></li>
        <li><p>Email : ${email}</p></li>
        <li><p>Phone : ${phone}</p></li>
        <li><p>Location : ${location}</p></li>
        <li><p>Experience : ${experience}</p></li>
        <li><p>Social : ${social}</p></li>
        <li><p>Minimum Spend : ${minspend}</p></li>
      </ul>
    `,
  }

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('❌ Error:', error.message);
  } else {
    console.log('✅ Email sent:', info.response);
  }
});

    // Set up email transporter
    // let transporter = nodemailer.createTransport({
    //   host: "smtp-relay.brevo.com",
    //   port: 587,
    //   secure: false,
    //   auth: {
    //     user: process.env.BREEVO_ID,
    //     pass: process.env.BREEVO_PASS,
    //   },
    // });

    // let info = await transporter.sendMail({
    //   to: "info@indiadesignershow.com",
    //   from: "info@indiadesignershow.com",
    //   subject: "IDS Designer Registration",
    //   html: `
    //     <h3>Designer Details</h3>
    //     <ul>
    //       <li><p>Name : ${fullname} </p></li>
    //       <li><p>Email : ${email}</p></li>
    //       <li><p>Phone : ${phone}</p></li>
    //       <li><p>Location : ${location}</p></li>
    //       <li><p>Experience : ${experience}</p></li>
    //       <li><p>Social : ${social}</p></li>
    //       <li><p>Minimum Spend : ${minspend}</p></li>
    //     </ul>
    //   `,
    // });

    res.status(201).json({ message: "Designer registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.BrandRegister = async (req, res) => {
  const { fullname, email, phone, brandlink, designation, brandname } =
    req.body;

  try {
    const existingBrand = await Brand.findOne({ phone });
    if (existingBrand) {
      return res
        .status(400)
        .json({ message: "Phone number already registered" });
    }

    const newBrand = new Brand({
      fullname,
      email,
      phone,
      brandname,
      brandlink,
      designation,
    });

    await newBrand.save();

          // Create a transporter object using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Email options


const mailOptions = {
  to: "info@indiadesignershow.com",
  from: "info@indiadesignershow.com",
  subject: "IDS Brand Registration",
  html: `
    <h3>Brand Details</h3>
    <ul>
      <li><p>Name : ${fullname} </p></li>
      <li><p>Email : ${email}</p></li>
      <li><p>Phone : ${phone}</p></li>
      <li><p>Brand Name : ${brandname}</p></li>
      <li><p>Brand Link : ${brandlink}</p></li>
      <li><p>Designation : ${designation}</p></li>
    </ul>
  `,
}

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('❌ Error:', error.message);
  } else {
    console.log('✅ Email sent:', info.response);
  }
});

    // Set up email transporter
    // let transporter = nodemailer.createTransport({
    //   host: "smtp-relay.brevo.com",
    //   port: 587,
    //   secure: false, 
    //   auth: {
    //     user: process.env.BREEVO_ID,
    //     pass: process.env.BREEVO_PASS,
    //   },
    // });

    // Send email
    // let info = await transporter.sendMail({
    //   to: "info@indiadesignershow.com",
    //   from: "info@indiadesignershow.com",
    //   subject: "IDS Brand Registration",
    //   html: `
    //     <h3>Brand Details</h3>
    //     <ul>
    //       <li><p>Name : ${fullname} </p></li>
    //       <li><p>Email : ${email}</p></li>
    //       <li><p>Phone : ${phone}</p></li>
    //       <li><p>Brand Name : ${brandname}</p></li>
    //       <li><p>Brand Link : ${brandlink}</p></li>
    //       <li><p>Designation : ${designation}</p></li>
    //     </ul>
    //   `,
    // });

    res.status(201).json({ message: "Brand registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
