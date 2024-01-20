import express from "express";
import session from "express-session";
import router from "./router/web.js";
import path from "path";
import methodOverride  from 'method-override';
import nodemailer from 'nodemailer';
import speakeasy from 'speakeasy';
import connectdb from "./db/connectdb.js";
const app=express();
const port=process.env.PORT||4500;
app.use(methodOverride('_method'));






const DATABASE_URL=process.env.DATABASE_URL||"mongodb+srv://karan:karan12712@cluster0.z9qdea3.mongodb.net/";
connectdb(DATABASE_URL)

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'karankumarr0002@gmail.com',
      pass: 'meswqewryfzngulk',
    },
  });

app.use(session({secret:"mynameiskaran",
resave: false,
saveUninitialized: true,
cookie: {
    maxAge: 360000 // Set the session to expire in 1 hour (60 seconds * 1000 milliseconds)
}
}))



app.use(express.urlencoded({extended:false}))

// for staticfiles
app.use(express.static(path.join(process.cwd(),'public')))
// end for staticfiles

// ejs setup
app.set('views','./views');
app.set('view engine','ejs');
// setup end

app.use('/',router)

app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})


// https://chat.openai.com/share/0867f386-4ad2-4ea1-af6f-f32681a53f3d


export default transporter;

// https://chat.openai.com/share/d2a6054f-c785-4f85-b3c5-39f63702693b  for otp expiration


// https://chat.openai.com/share/213445c6-1635-4d98-b605-2650dabba775  for add to cart logic

// https://chat.openai.com/share/213445c6-1635-4d98-b605-2650dabba775  for place order if this not work you also have a video

// https://chat.openai.com/share/67791468-ed54-4606-a251-9a2692d15f00
// please tellme remove fron cart button logic as from above cart schema  example 
// please tellme increase and decrease cart button logic as from above cart schema  example 