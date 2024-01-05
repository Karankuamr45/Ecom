import categoryModel from "../models/categorySchema.js";
import productModel from "../models/productSchema.js";
import userModel from "../models/userSchema.js";

const storeController=async(req,res)=>{
    const userData=await userModel.findById(req.session.loggedIn);
    const category=await categoryModel.find({})
    const productData=await productModel.find({});

    res.render('store',{'loggedIn': req.session.loggedIn,'totalItems':req.session.totalItems,'userData':userData,'isAdmin':req.session.userRole,'productData':productData,'category':category})
}

export {storeController}