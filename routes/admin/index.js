const express = require("express");
const Post = require("../../models/Post");
const Category = require('../../models/Category.js');
const router = express.Router();
const {faker} = require('@faker-js/faker');
const {userAuthenticated} = require('../../helpers/authentication')
const path = require('path');

router.all('/*',userAuthenticated, (req,res,next)=>{
    req.app.locals.layout='admin';
    next();
});



router.get('/',(req,res)=>{
    Category.findOne({_id:'64b56b153eb0f28c6e0f4141'}).then(category=>{
        res.render('admin/index',{category:category});
    
    })
});

router.post('/generate-fake-posts',(req,res)=>{
    for(let i = 0; i < req.body.amount ; i++){

        let post= new Post();
        
        title1=faker.lorem.word();

        post.title=title1.charAt(0).toUpperCase()+title1.slice(1);
        
        post.status='public';
        post.allowComments=Boolean(faker.number.bigInt(1n));
        post.body=faker.lorem.sentence();
        const value = faker.image.url();
        console.log(value);
        
        const download = require('image-downloader');

        const options = {
            url: value,
            dest: '../../public/uploads/'+post.title+'.jpg',  // will be saved to /path/to/dest/image.jpg
        };
    
        download.image(options)
        .then(({ filename }) => {
            console.log('Saved to', filename); // saved to /path/to/dest/image.jpg
        })
        .catch((err) => console.error(err));

        post.category= '64b56b153eb0f28c6e0f4141';
        
        post.file=post.title.concat('.',"jpg");
        // let file=post.title;
        // let filename=file.name;
        // fs.mv('./public/uploads/'+filename,(err)=>{
        //     if(err) throw err;
        // })

        post.save().then(savedPost=>{

        });
        
    }
    res.redirect('/admin/posts');
})

module.exports=router;