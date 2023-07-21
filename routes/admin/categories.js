const express = require("express");
const Post = require("../../models/Post");
const router = express.Router();
const {faker} = require('@faker-js/faker');
const Category = require('../../models/Category');


router.all('/*', (req,res,next)=>{
    req.app.locals.layout='admin';
    next();
});



router.get('/',(req,res)=>{
    Category.find({}).then(categories=>{
        res.render('admin/categories/index',{categories:categories});

    })
});

router.post('/create',(req,res)=>{
    const newCategory= new Category({
        name:req.body.name
    })
    newCategory.save().then(savedCat=>{
        res.redirect('/admin/categories');
        
    });
    
});

router.get('/edit/:id',(req,res)=>{
    Category.findOne({_id:req.params.id}).then(category=>{
        res.render('admin/categories/edit',{category:category});

    })
});

router.put('/edit/:id',(req,res)=>{
    Category.findOne({_id:req.params.id}).then(category=>{
        category.name=req.body.name2;
        category.save().then(savedcategory=>{
            res.redirect('/admin/categories');
        })
    })
});

router.delete('/:id', (req, res)=>{
    Category.deleteOne({_id: req.params.id})
    .then(result=>{
        res.redirect('/admin/categories');
    });
}); 


module.exports=router;