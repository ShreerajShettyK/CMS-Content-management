const express = require("express");
const router = express.Router();
const Post = require('../../models/Post.js');
const Category = require('../../models/Category.js');
const {userAuthenticated} = require('../../helpers/authentication')


const fs = require('fs');
const path = require('path');


router.all('/*',userAuthenticated, (req,res,next)=>{
    req.app.locals.layout='admin';
    next();
});

router.get('/',(req,res)=>{
    Post.find({})
    .populate('category')
    .then(posts=>{
        res.render('admin/posts', {posts:posts});
        
    });
});

router.get('/create',(req,res)=>{
    Category.find({}).then(categories=>{
        res.render('admin/posts/create',{categories:categories});
    })
    
})

router.post('/create',(req,res)=>{

    //server side validation
    let errors=[];
    if(!req.body.title){
        errors.push({message:'Please add a title'})
    }
    
    if(!req.body.body){
        errors.push({message:'Please add a description'})
    }
    
    if(errors.length>0){
        res.render('admin/posts/create',{
            errors: errors
        })
    }

    //
    else{

    let file=req.files.file;
    let filename=file.name;
    file.mv('./public/uploads/'+filename,(err)=>{
        if(err) throw err;
    })

    
    let allowComments= true;
    if(req.body.allowComments){
        allowComments=true;
    }else{
        allowComments=false;
    }

    const newPost= new Post({
        title:req.body.title,
        status:req.body.status,
        allowComments: allowComments,
        body: req.body.body,
        category: req.body.category,
        file: filename
    });
    //console.log(req.body.category);
    newPost.save().then(savedPost=>{
        //console.log(savedPost);
        req.flash('success_message',`Post ${savedPost.title} was created successfully`);
        
        res.redirect('/admin/posts');
    }).catch(error=>{
        console.log(error, 'Could not save POST');
    });

    }

})

router.get('/edit/:id',(req,res)=>{
    
    Post.findOne({_id: req.params.id}).then(post=>{
        Category.find({}).then(categories=>{
            res.render('admin/posts/edit',{post: post,categories:categories});
        })
   
    });
})

router.put('/edit/:id',(req,res)=>{

    Post.findOne({_id: req.params.id}).then(post=>{
        if(req.body.allowComments){
            allowComments=true;
        }else{
            allowComments=false;
        }

        let file=req.files.file;
        let filename=file.name;
        file.mv('./public/uploads/'+filename,(err)=>{
            if(err) throw err;
        })
        
        post.title=req.body.title; 
        post.status=req.body.status; 
        post.allowComments=allowComments; 
        post.body=req.body.body; 
        post.file=filename;
        post.category=req.body.category;

        post.save().then(updatedPost=>{
            req.flash('success_message','Post was successfully updated');
            res.redirect('/admin/posts');
        })
        
    });
    
})

router.delete('/:id',(req,res)=>{
    Post.findOne({_id: req.params.id})
    .then(post=>{    
        fs.unlink('./public/uploads/'+post.file,(err)=>{
            //console.log('Post was successfully deleted');   

        });
    })

    Post.deleteOne({_id: req.params.id})
        .then(result=>{
            req.flash('success_message','Post was successfully deleted');
            res.redirect('/admin/posts');
           
        })
})

module.exports=router;