import cartModel from "../models/cartSchema.js"
import categoryModel from "../models/categorySchema.js"
import userModel from "../models/userSchema.js"

const placeOrderController=async(req,res)=>{
    const category=await categoryModel.find({})
    const userData=await userModel.findById(req.session.loggedIn)
    const cartData = await cartModel.findOne({ user: req.session.loggedIn }).populate('products.product'); 

    let totalItems = 0;
    let totalprice = 0;
     if (cartData) {
         totalItems = cartData.products.reduce((total, item) => total + item.quantity, 0);
         req.session.totalItems=totalItems
         
         for (const cartItem of cartData.products) {
             totalprice += cartItem.product.price * cartItem.quantity;
         }
         
          var totalPrice = totalprice;
        }

       


    res.render('place-order',{'totalPrice':totalPrice,'loggedIn': req.session.loggedIn,'totalItems':req.session.totalItems,'cartData': cartData,'userData':userData,'isAdmin':req.session.userRole,'category':category})
}

export {placeOrderController}