import categoryModel from "../models/categorySchema.js"
import productModel from "../models/productSchema.js"
import userModel from "../models/userSchema.js"

const categoryContoller=(req,res)=>{
    res.render('category')
}

const postCategoryContoller=async(req,res)=>{
    const categorydata=await categoryModel({
        name:req.body.category
    })
    await categorydata.save()
    res.redirect('/category')
}

const showByCategoryController=async(req,res)=>{
    const userData=await userModel.findById(req.session.loggedIn);
    const category=await categoryModel.find({})
    const productData=await productModel.find({});

    const para = req.params;
    // console.log(para.category)
    
    const productsbycate = await productModel.find({category_name:para.category});
    res.render('showcate',{'loggedIn': req.session.loggedIn,'totalItems':req.session.totalItems,'userData':userData,'isAdmin':req.session.userRole,'productData':productData,'category':category,'productsbycate':productsbycate})

}

const manageCategoryController=async(req,res)=>{
    const categoryData=await  categoryModel.find({})

    res.render('managecategory',{'categoryData':categoryData})
}

const deleteCategoryController=async(req,res)=>{
    // const deletecatedata=await productModel.deleteMany({ category_id: req.params.id });
    const onlycate=await categoryModel.findByIdAndDelete(req.params.id)
    if(onlycate){
        res.redirect('/managecate')
    }
    else{
        res.redirect('/managecate')
    }
}

const deleteCategorydataController=async(req,res)=>{
    const deletecatedata=await productModel.deleteMany({ category_id: req.params.id });
    if(deletecatedata){
        res.redirect('/myproducts')
    }
    else{
        res.redirect('/managecate')
    }
    
}

const bothDeleteController=async(req,res)=>{
    try {
        await categoryModel.findByIdAndDelete(req.params.id)
        await productModel.deleteMany({ category_id: req.params.id });

        res.redirect('/myproducts')
        
    } catch (error) {
        console.log(error.message)
        
    }

}

export {categoryContoller,postCategoryContoller,showByCategoryController,manageCategoryController,deleteCategoryController,deleteCategorydataController,bothDeleteController}