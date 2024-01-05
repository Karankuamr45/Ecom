import categoryModel from "../models/categorySchema.js"
import userModel from "../models/userSchema.js"

const isLogin=(req,res,next)=>{
    try {
        if(req.session.loggedIn){

        }
        else{
            // res.render('login',{'loggedIn': req.session.loggedIn})
            res.redirect('/login')
        }
        next()
        
    } catch (error) {
        
    }
}

const isLogout=async(req,res,next)=>{
    try {
        if(req.session.loggedIn){

        }
        else{
            const category=await categoryModel.find({})

            res.render('login',{'totalItems':req.session.totalItems,'loggedIn': req.session.loggedIn,'isAdmin':req.session.userRole,'category':category})
        }
        next()
        
    } catch (error) {
        
    }
}

const isRegister=async(req,res,next)=>{
    try {
        if(req.session.loggedIn){

        }
        else{
            const category=await categoryModel.find({})

            res.render('register',{'totalItems':req.session.totalItems,'loggedIn': req.session.loggedIn,'isAdmin':req.session.userRole,'category':category})
        }
        next()
        
    } catch (error) {
        
    }
}


const isCart=(req,res,next)=>{
    try {
        if(req.session.loggedIn){

        }
        else{
            
            res.redirect('/login')
        }
        next()
        
    } catch (error) {
        
    }
}


const isAdmin=async(req,res,next)=>{
    const userData=await userModel.findById(req.session.loggedIn)
    try {
        if (req.session.userRole  === 'admin'){
            // res.render('dashboard',{'loggedIn': req.session.loggedIn,'userData':userData,'isAdmin':req.session.userRole})

        }
        else{
            
            res.redirect('/')
        }
        next()
        
    } catch (error) {
        
    }
}





export {isLogin,isLogout,isRegister,isCart,isAdmin};