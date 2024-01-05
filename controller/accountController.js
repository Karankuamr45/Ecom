import bcrypt from 'bcryptjs';
import userModel from "../models/userSchema.js"
import categoryModel from '../models/categorySchema.js';
import speakeasy from 'speakeasy';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';
import transporter from '../app.js';

const registerController=async(req,res)=>{
    const category=await categoryModel.find({})
    const userData=await userModel.findById(req.session.loggedIn);
    res.render('register',{'loggedIn': req.session.loggedIn,'totalItems':req.session.totalItems,'userData':userData,'isAdmin':req.session.userRole,'category':category,'errorMessage':''})

    // req.session.error = null;
    // req.session.success = null;
}

const securePassword=async(password)=>{
    try {
     const hashPassword = await bcrypt.hash(password,10);
     return hashPassword
    } catch (error) {
        console.log(error.message)
    }
}

// const otp= crypto.randomBytes(3).toString('hex');
// const otp=  Math.floor(100000 + Math.random() * 900000);



function generateOTP() {
    // const otp = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit OTP
    // return otp;
    const secret= speakeasy.generateSecret({ length: 20 });

// Generate TOTP token with a 2-minute expiry
    const token = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32',
    step: 30, // TOTP token valid for 2 minutes (120 seconds)
    window: 4,
});

const otpgenerationTime = new Date(); 

return {
    secret: secret.base32,
    token: token,
    otpgenerationTime:otpgenerationTime
};
}



// const { secret, token } = generateOTP();
// console.log('Secret:', secret);
// console.log('Generated TOTP Token:', token);



const postRegisterController=async(req,res)=>{

    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.redirect('/register')
    // }

   


    const bcryptPassword=await securePassword(req.body.password);
    
    

    
    
    
    const userData= await userModel({
        first_name:req.body.first_name,
        last_name:req.body.last_name,
        email:req.body.email,
        gender:req.body.gender,
        country:req.body.country,
        city:req.body.city,
        password:bcryptPassword,
       


    })



    try {
        await userData.save();

        req.session.userEmail=req.body.email
        req.session.first_name=req.body.first_name
        req.session.last_name=req.body.last_name
    
        const {secret,token,otpgenerationTime} = generateOTP();
        req.session.generatedOTP = token;
        req.session.secret = secret;
        req.session.otpgenerationTime = otpgenerationTime;

        
        req.session.otpgenerationTime.setMinutes(req.session.otpgenerationTime.getMinutes() + 2); 
        const formattedExpiryTime = req.session.otpgenerationTime.toLocaleTimeString();
        
    

        

        
    const mailOptions = {
        from: 'karankumarr0002@gmail.com',
        to: req.body.email,
        subject: 'Email Verification',
        // text: `Your OTP for email verification is: ${generatedOTP}`,
        html:`<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Email</title>
        </head>
        
        <body style="font-family: Arial, sans-serif; padding: 20px;">
        
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #333;">Your One-Time Password (OTP)</h2>
                <p style="font-size: 16px; color: #555;">Hello ${req.body.first_name}  ${req.body.last_name} ,</p>
                <p style="font-size: 16px; color: #555;">Your OTP for verification is:</p>
                <h1 style="font-size: 32px; color: #007bff; margin: 10px 0;">${req.session.generatedOTP}</h1>
                <p style="font-size: 16px; color: #555;">It will expire at ${formattedExpiryTime}.</p>
                <p style="font-size: 16px; color: #555;">Please use this OTP to complete your action on our platform.</p>
                <p style="font-size: 16px; color: #555;">If you didn't request this OTP, please ignore this email.</p>
                <p style="font-size: 16px; color: #555;">Best regards,<br>GreatKart</p>
            </div>
        
        </body>
        
        </html>
        
        `
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.send('Error sending email.');
        } else {
          console.log('Email sent: ' + info.response);
          
          
          res.send('Email sent for verification. Check your email.');
          
        }
      });

        res.redirect('/verifyotp')
        
    } catch (error) {
        console.log(error.message)
        
    }
}

const loginController=async(req,res)=>{
    const category=await categoryModel.find({})
    const userData=await userModel.findById(req.session.loggedIn);
    res.render('login.ejs',{'loggedIn': req.session.loggedIn,'totalItems':req.session.totalItems,'userData':userData,'isAdmin':req.session.userRole,'category':category})
}

const PostLoginController=async(req,res)=>{
    const userData=await userModel.findOne({email:req.body.email});
    
    if(userData){
        const encryptPassword=await bcrypt.compare(req.body.password,userData.password);
        if(encryptPassword){
            req.session.loggedIn=userData._id
            req.session.userRole = userData.role
            // console.log(userData.role)
            

            res.redirect('/')
        }else{
            res.redirect('/login')
        }

    }else{
        res.redirect('/register')
    }


}

const logoutController=(req,res)=>{
    if(req.session.loggedIn){
        req.session.destroy()
        res.redirect('/login')
    }else{
        res.redirect('/login')
    }
}


const verifyotpController=(req,res)=>{
    res.render('otpvarify')
}



const postverifyotpController=async(req,res)=>{
    const userData=await userModel.findOne({email:req.session.userEmail})
    const storedOTP = req.session.generatedOTP;
    // console.log("storedotp",storedOTP)
    const otpExpiryTime = new Date();
    otpExpiryTime.setMinutes(otpExpiryTime.getMinutes() + 1); 
    // console.log(storedOTP)
    // otoo

    // const formattedOTP = req.body.otp.toUpperCase();
    // console.log("type of formatedd eala",typeof(formattedOTP))
    // console.log(formattedOTP)
    function validateOTP(userEnteredOTP, secret) {
        const isValidOTP = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: userEnteredOTP,
            step: 30, // Same time step used for generating the OTP
            window: 4, // Allow no deviation from the current time
        });
    
        return isValidOTP;
    }
    
     
    
    const isValidOTP = validateOTP(req.body.otp,req.session.secret);
    console.log("isValid",isValidOTP)

    // otp

    if (isValidOTP) {
        if(req.body.otp==storedOTP){
            req.session.loggedIn=userData._id
            res.redirect('/')
        }
        else{
            res.redirect('/verifyotp')
        }
    } else {
        res.send("time expired")
        console.log('OTP is invalid or expired.');
    }
    
    
       

    

}

const resenotpCobtoller=async (req, res) => {
    // Generate a random OTP
    const {secret,token,otpgenerationTime} = generateOTP();
        req.session.generatedOTP = token;
        req.session.secret = secret;
        req.session.newgentime = otpgenerationTime;

        req.session.newgentime.setMinutes(req.session.newgentime.getMinutes() + 2); 
        const newformattedExpiryTime = req.session.newgentime.toLocaleTimeString();
     
     
    
  
    // Save the OTP to the user's session
    

   
  
    // Send OTP to the user's email
    const mailOptions = {
      from: 'karankumarr0002@gmail.com',
      to: req.session.userEmail,
      subject: 'OTP Verification',
    //   text: `Your OTP for verification is: ${newOTP}`
    html:`<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Email</title>
    </head>
    
    <body style="font-family: Arial, sans-serif; padding: 20px;">
    
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333;">Your One-Time Password (OTP)</h2>
            <p style="font-size: 16px; color: #555;">Hello ${req.session.first_name}  ${req.session.last_name} ,</p>
            <p style="font-size: 16px; color: #555;">Your OTP for verification is:</p>
            <h1 style="font-size: 32px; color: #007bff; margin: 10px 0;">${req.session.generatedOTP}</h1>
            <p style="font-size: 16px; color: #555;">It will expire at ${newformattedExpiryTime}.</p>

            <p style="font-size: 16px; color: #555;">Please use this OTP to complete your action on our platform.</p>
            <p style="font-size: 16px; color: #555;">If you didn't request this OTP, please ignore this email.</p>
            <p style="font-size: 16px; color: #555;">Best regards,<br>GreatKart</p>
        </div>
    
    </body>
    
    </html>
    
    `
    };
  
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.send('Error sending OTP.');
      } else {
        console.log('Email sent: ' + info.response);
        
        res.redirect('/verifyotp')
        
        
      }
    });
  };
  
  


export {registerController,loginController,postRegisterController,PostLoginController,logoutController,verifyotpController,postverifyotpController,resenotpCobtoller}