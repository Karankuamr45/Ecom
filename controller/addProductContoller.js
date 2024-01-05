import categoryModel from "../models/categorySchema.js";
import productModel from "../models/productSchema.js"
import userModel from "../models/userSchema.js";

const addProductContoller=async(req,res)=>{
    const category=await categoryModel.find({});
    res.render('addproduct',{'category':category})
}



const postAddProductContoller=async(req,res)=>{
    const userdata=await userModel.findById(req.session.loggedIn);
    const categoryid =await categoryModel.findById(req.body.category)
  
    
    
    const productData=await productModel({
        user_id:userdata._id,
        category_id:categoryid._id,
        category_name:categoryid.name,
        title:req.body.title,
        description:req.body.description,
        image:req.file.filename,
        price:req.body.price,
       

    })

    productData.save()

    res.redirect('/addproduct')
}

const myProductsController=async(req,res)=>{
    const productData=await productModel.find({})

    res.render('myproducts',{'productData':productData})
    
}

const deleteProductController=async(req,res)=>{
    const deleteProduct=await productModel.findByIdAndDelete(req.params.id);

    if(deleteProduct){
        res.redirect('/myproducts')
    }else{
        res.redirect('/myproducts')

    }

}

const editProductController=async(req,res)=>{
    const productData=await productModel.findById(req.params.id);
    const categoryData=await categoryModel.find({})

    res.render('editproduct',{'productData':productData,'categoryData':categoryData})

}

const posteditProductController=async(req,res)=>{
    const updateData=await productModel.findByIdAndUpdate(req.params.id);

    updateData.title=req.body.title
    updateData.description=req.body.description
    updateData.image=req.file.filename
    updateData.price=req.body.price
    updateData.category_name=req.body.category

    updateData.save()

    if(updateData){
        res.redirect('/myproducts')
    }
    else{
        res.redirect('/myproducts')
    }
}




const productDetailController=async(req,res)=>{
    
    const productData=await productModel.findById(req.params.id);
    const userData=await userModel.findById(req.session.loggedIn);
    const category=await categoryModel.find({})
    // const productId = req.params.id;

    

    res.render('product-detail',{'productData':productData,'totalItems':req.session.totalItems,'userData':userData,'category':category,'loggedIn': req.session.loggedIn,'isAdmin':req.session.userRole,})


}


export {addProductContoller,postAddProductContoller,myProductsController,deleteProductController,editProductController,posteditProductController,productDetailController}