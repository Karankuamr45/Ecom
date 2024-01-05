import express from 'express';
import multer from 'multer';
import path from 'path';
import { body, validationResult } from 'express-validator';
import homeController from '../controller/homeController.js';
import { dashboardController } from '../controller/dashboardController.js';
import { PostLoginController,  loginController, logoutController, postRegisterController, postverifyotpController, registerController, resenotpCobtoller, verifyotpController } from '../controller/accountController.js';
import { storeController } from '../controller/storeController.js';
import { addtoCartController, cartController, decreaseCartController, increaseCartController, removeCartController } from '../controller/cartController.js';
import { isAdmin, isCart, isLogin, isLogout } from '../middlewares/userMiddleware.js';
import { bothDeleteController, categoryContoller, deleteCategoryController, deleteCategorydataController, manageCategoryController, postCategoryContoller, showByCategoryController } from '../controller/categoryController.js';
import { addProductContoller, deleteProductController, editProductController, myProductsController, postAddProductContoller, posteditProductController, productDetailController } from '../controller/addProductContoller.js';
import { placeOrderController } from '../controller/placeOrder.js';
const router=express.Router()

// for image  

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(process.cwd(),'/public/images'))
    },
    filename: function (req, file, cb) {
      const file_filename = Date.now() + '-' + file.originalname
      cb(null, file_filename)
    }
  })
  
  const upload = multer({ storage: storage })

  // end for image


  const validata=[
    // Validate and sanitize the fields using express-validator
    body('first_name').trim().isLength({ min: 1 }).escape(),
    body('last_name').trim().isLength({ min: 1 }).escape(),
    body('email').trim().isEmail().normalizeEmail(),
    body('gender').isIn(['male', 'female', 'other']),
    body('country').trim().isLength({ min: 1 }).escape(),
    body('city').trim().isLength({ min: 1 }).escape(),
    body('password').trim().isLength({ min: 6 }).escape(),
    body('role').optional().isIn(['user', 'admin']), // 'role' field is optional
  
    // Custom validation for checking if the email is already in use
    body('email').custom(async (value) => {
      const existingUser = await userModel.findOne({ email: value });
      if (existingUser) {
        throw new Error('Email already in use');
      }
      return true;
    }),
  ]

// routes start

router.get('/',homeController)
router.get('/dashboard',isAdmin,dashboardController)

router.get('/register',registerController)
router.post('/register',validata,postRegisterController)

router.get('/login',isLogout,loginController)
router.post('/login',PostLoginController)
router.get('/logout',logoutController)

router.get('/store',storeController)


router.get('/category',isAdmin,categoryContoller)
router.post('/category',postCategoryContoller)

router.get('/addproduct',isAdmin,addProductContoller)
router.post('/addproduct',upload.single('image'),postAddProductContoller)

router.get('/showcate/:category',showByCategoryController)


router.get('/myproducts',isAdmin,myProductsController)
router.get('/deletepost/:id',isAdmin,deleteProductController)

router.get('/editpost/:id',isAdmin,editProductController)
router.post('/editpost/:id',upload.single('image'),posteditProductController)


router.get('/managecate',isAdmin,manageCategoryController)
router.get('/deletecate/:id',isAdmin,deleteCategoryController)
router.get('/deletecatedate/:id',isAdmin,deleteCategorydataController)
router.delete('/categories/:id',isAdmin,bothDeleteController)

router.get('/verifyotp',verifyotpController)
router.post('/verifyotp',postverifyotpController)


router.get('/send-otp',resenotpCobtoller);

router.get('/product-detail/:id',productDetailController)

router.get('/cart',isLogin,cartController)

router.post('/add-to-cart/:productId',addtoCartController)

router.post('/remove-from-cart/:productId',removeCartController);

router.post('/increase-quantity/:productId',increaseCartController)
router.post('/decrease-quantity/:productId',decreaseCartController)


router.get('/place-order',isLogin,placeOrderController)

// routes ending















// router.get('/admin',adminController)


export default router;