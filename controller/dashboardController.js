import categoryModel from "../models/categorySchema.js";
import userModel from "../models/userSchema.js"

const dashboardController=async(req,res)=>{
    const userData=await userModel.findById(req.session.loggedIn);
    const category=await categoryModel.find({})


    res.render('dashboard',{'loggedIn': req.session.loggedIn,'totalItems':req.session.totalItems,'userData':userData,'isAdmin':req.session.userRole,'category':category})
}

export {dashboardController}