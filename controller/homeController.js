import categoryModel from "../models/categorySchema.js";
import productModel from "../models/productSchema.js";
import userModel from "../models/userSchema.js";
const homeController=async(req,res)=>{
    const productData=await productModel.find({});
    const category=await categoryModel.find({})

    const userData=await userModel.findById(req.session.loggedIn);
    
    // console.log(req.query)
    
    res.render('index',{'loggedIn': req.session.loggedIn,'totalItems':req.session.totalItems,'userData':userData,'isAdmin':req.session.userRole,'productData':productData,'category':category})
}

export default homeController;