const express = require("express");
const Post = require("../../models/Post");
const Category = require('../../models/Category.js');
const router = express.Router();
const {faker} = require('@faker-js/faker');
const {userAuthenticated} = require('../../helpers/authentication')
const path = require('path');
const download = require('image-downloader');

router.all('/*',userAuthenticated, (req,res,next)=>{
    req.app.locals.layout='admin';
    next();
});



router.get('/',(req,res)=>{
    Category.find({}).then(categories=>{
        res.render('admin/index',{categories:categories});
    
    })
});

router.post('/generate-fake-posts', async (req,res)=>{
    const amount = req.body.amount;
    for(let i = 0; i < amount ; i++){

        let post= new Post();
        
        title1=faker.lorem.word();

        post.title=title1.charAt(0).toUpperCase()+title1.slice(1);
        
        post.status='public';
        post.allowComments=Boolean(faker.number.bigInt(1n));
        post.body=faker.lorem.sentence();
        const value = faker.image.url();
        //console.log(value);
        
        

        const options = {
            url: value,
            dest: '../../public/uploads/'+post.title+'.jpg',  // will be saved to /path/to/dest/image.jpg
        };
    
        await download.image(options)
        .then(({ filename }) => {
            //console.log('Saved to', filename); // saved to /path/to/dest/image.jpg
        })
        .catch((err) => console.error(err));

        await Category.countDocuments({}).then(async count => {
            if (count>=1) {
                await Category.find({}).then(docs => {
                    // if (err) {
                    //     console.error('Error while fetching documents:', err);
                    //   }

                      // Extract and log the IDs of the documents
                    //   const catId = docs.map(doc => doc._id);
                    //   console.log(catId[0]);
                    const catId = docs[0]._id;
                    console.log(catId); 
                    post.category= catId;
                      

                })
    
            }
            else{
                //console.log(count);
                const newCategory= new Category({
                    name:"Angular",
                });
                await newCategory.save().then(savedCat=>{
                    post.category= savedCat._id;
                });
            }
            
        });
      

        post.file=post.title.concat('.',"jpg");

        await post.save().then(savedPost=>{
            
        });
        
    }
    res.redirect('/admin/posts');
})

module.exports=router;