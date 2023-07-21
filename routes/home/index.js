const express = require("express");
const router = express.Router();
const Post = require('../../models/Post.js');
const User = require('../../models/User.js');
const Category = require('../../models/Category.js');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.all('/*', (req,res,next)=>{
    req.app.locals.layout='home';
    next();
});

//single posts in home blog
router.get('/',(req,res)=>{
    Post.find({}).then(posts=>{
        Category.find({}).then(categories=>{
            res.render('home/index',{posts:posts,categories:categories})
        })
        
    });
    
})

router.get('/about',(req,res)=>{
    res.render('home/about');
})

router.get('/login',(req,res)=>{
    res.render('home/login');
})

//APP login
router.post('/login',(req,res,next)=>{  //data from the form req is sent to next function
    passport.authenticate('local',{
        successRedirect:'/admin',
        failureRedirect:'/login',
        failureFlash:true

    })(req,res,next);
    
})
passport.use(new LocalStrategy({usernameField: 'email'},(email,password,done)=>{
    //console.log(email);
    User.findOne({email:email}).then(user=>{
        if(!user){
            return done(null,false,{message:'No user found'});          
        }
        bcrypt.compare(password,user.password,(err,matched)=>{
            if(err) return err;

            if(matched){
                return done(null,user)
            }else{
                return done(null,false,{message:'Incorrect password'});
            }
        }) 
    })
}));

//code to serialize user into session
passport.serializeUser(function(user, done) {
    process.nextTick(function() {
      return done(null, user.id);
    });
  });
  
passport.deserializeUser(function(user, done) {
    process.nextTick(function() {
      return done(null, user);
    });
  });
//
//end of login

router.get('/logout',(req,res)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
      });
})


router.get('/register',(req,res)=>{
    res.render('home/register');
})

router.post('/register',(req,res)=>{
    let errors=[]; 
    if(!req.body.firstName){
        errors.push({message:'Please add your First name'})
    }
    
    if(!req.body.lastName){
        errors.push({message:'Please add a Last name'})
    }
    if(!req.body.email){
        errors.push({message:'Please add an email'})
    }
    if(!req.body.password){
        errors.push({message:'Please add a password'})
    }
    if(!req.body.passwordConfirm){
        errors.push({message:'Please confirm password'})
    }
    if(req.body.password !== req.body.passwordConfirm){
        errors.push({message:"Password fields don't match"});
    }
    
    if(errors.length>0){
        res.render('home/register',{
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
        })
        
    }
    else{

        User.findOne({email:req.body.email}).then(user=>{
            if(!user){
                const newUser=new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: req.body.password
    
                });
                bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    newUser.password=hash;
                    newUser.save().then(savedUser=>{
                        req.flash('success_message','Registration successful!! Please login');
                        res.redirect('/login')
                    })
                })
                })
            }
            else{
                req.flash('error_message','That email exists please Login');
                res.redirect('/login');
            }
        });
    }
})

router.get('/post/:id',(req,res)=>{
    Post.findOne({_id:req.params.id})
    .then(post=>{
        Category.find({}).then(categories=>{
            res.render('home/post',{post:post,categories:categories})
        })
    })
    
})

module.exports=router;