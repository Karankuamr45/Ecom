import cartModel from "../models/cartSchema.js";
import categoryModel from "../models/categorySchema.js";
import productModel from "../models/productSchema.js";
import userModel from "../models/userSchema.js";
const cartController=async(req,res)=>{
    const category=await categoryModel.find({})
   
    const cartData = await cartModel.findOne({ user: req.session.loggedIn }).populate('products.product'); 
    // console.log(cartData)
    
     // Calculate total number of items in the cart
     let totalItems = 0;
     if (cartData) {
         totalItems = cartData.products.reduce((total, item) => total + item.quantity, 0);
         req.session.totalItems=totalItems
           // Calculate total price
      let totalprice = 0;
      for (const cartItem of cartData.products) {
          totalprice += cartItem.product.price * cartItem.quantity;
      }

      // Update cart's total price
      const tax = 0.18; 
      
       var totalPrice = totalprice;
      const totalWithTax = totalprice * (1 + tax);
      const totalPriceWithTaxFormatted = totalWithTax.toFixed(2);
      cartData.totalPrice=totalPriceWithTaxFormatted
      await cartData.save();


     

     const userData=await userModel.findById(req.session.loggedIn);
     res.render('cart',{'totalPrice':totalPrice,'loggedIn': req.session.loggedIn,'totalItems':req.session.totalItems,'cartData': cartData,'userData':userData,'isAdmin':req.session.userRole,'category':category})
 

     }

     else{
        
     }

    
     
    
  

    const userData=await userModel.findById(req.session.loggedIn);
    res.render('cart',{'totalPrice':totalPrice,'loggedIn': req.session.loggedIn,'totalItems':req.session.totalItems,'cartData': cartData,'userData':userData,'isAdmin':req.session.userRole,'category':category})
}

const addtoCartController=  async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).send('Product not found');
        }

        let cart = await cartModel.findOne({ user: req.session.loggedIn}); // Assuming user is authenticated and you have user data in req.user

        if (!cart) {
            cart = new cartModel({ user: req.session.loggedIn, products: [] });
        }
        
        // Check if the product already exists in the cart, if so, increase quantity
        const cartProduct = cart.products.find(item => item.product.equals(product._id));
        if (cartProduct) {
            cartProduct.quantity++;
            cartProduct.totalPrice = cartProduct.quantity * product.price;

        } else {
            cart.products.push({ product: product._id, quantity: 1 ,totalPrice: product.price});
        }


            // Check if the product already exists in the cart
            // const cartProductIndex = cart.products.findIndex(item => item.product.equals(product._id));
            // if (cartProductIndex !== -1) {
            //     // If product exists, increase the quantity and update the total price
            //     cart.products[cartProductIndex].quantity++;
            //     cart.products[cartProductIndex].totalPrice = cart.products[cartProductIndex].quantity * product.price;
            // } else {
            //     // If product doesn't exist, add it to the cart with quantity 1 and total price equal to product price
            //     cart.products.push({ product: product._id, quantity: 1, totalPrice: product.price });
            // }

       

        await cart.save();
        res.redirect('/cart'); // Redirect to the cart page after adding the product
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const removeCartController=async (req, res) => {
    const productId = req.params.productId;

    try {
        let cart = await cartModel.findOne({ user: req.session.loggedIn});
        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        // Remove the product from the cart
        cart.products = cart.products.filter(item => !item._id.equals(productId));

        await cart.save();
        res.redirect('/cart'); // Redirect to the cart page after removing the product
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}


const increaseCartController=async (req, res) => {
    const productId = req.params.productId;
    // console.log('productId',productId)

    try {
        const cart = await cartModel.findOne({ user: req.session.loggedIn });
        // const product = await productModel.findById(productId);

        // Find the product in the cart
        const cartProduct = cart.products.find(item => item._id.equals(productId));
        // console.log('cartproduct',cartProduct)

        // Increase the quantity if the product is in the cart
        if (cartProduct) {
            cartProduct.quantity++;
            
            await cart.save();
        }

        res.redirect('/cart'); // Redirect back to the cart page
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}


const decreaseCartController=async (req, res) => {
    const productId = req.params.productId;

    try {
        const cart = await cartModel.findOne({ user: req.session.loggedIn });

        // Find the product in the cart
        const cartProduct = cart.products.find(item => item._id.equals(productId));

        // Decrease the quantity if the product is in the cart
        if (cartProduct) {
            // Decrease quantity only if it's more than 1
            if (cartProduct.quantity > 1) {
                cartProduct.quantity--;
            } else {
                // If quantity is 1, remove the product from the cart
                cart.products = cart.products.filter(item => !item._id.equals(productId));
            }

            await cart.save();
        }

        res.redirect('/cart'); // Redirect back to the cart page
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}
export {cartController,addtoCartController,removeCartController,increaseCartController,decreaseCartController}