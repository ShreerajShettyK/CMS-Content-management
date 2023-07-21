const express = require('express');
const app=express();
const path=require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const {mongoDbUrl} = require('./config/database');
const passport = require('passport');


mongoose.connect(mongoDbUrl);
mongoose.connection
    .once('open', ()=>console.log('CONNECTED'))
    .on('error', (err)=>{

        console.log(`could not connect`, err)
    });



//using static
app.use(express.static(path.join(__dirname,'public')));

//set view engine

const {select, generateDate} = require('./helpers/handlebars-helpers');
app.engine('handlebars',exphbs.engine({handlebars:allowInsecurePrototypeAccess(Handlebars),extname: 'handlebars',defaultLayout:'home',helpers:{select:select, generateDate:generateDate}}));
app.set('view engine','handlebars');

//upload middleware

app.use(upload());



//body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//method overrride

app.use(methodOverride('_method'));

//sessions

app.use(session({

    secret: 'password',
    resave: true,
    saveUninitialized: true
}))

//flash

app.use(flash());

//passport

app.use(passport.authenticate('session'));

//local variables using middleware

app.use((req,res,next)=>{

    res.locals.user= req.user || null; //global user logged in a session

    
    res.locals.success_message= req.flash('success_message');
    res.locals.error_message= req.flash('error_message');
    res.locals.form_errors= req.flash('form_errors');

    res.locals.error=req.flash('error');
    next();
})

//load routes
const home=require('./routes/home/index');
const admin=require('./routes/admin/index');
const posts=require('./routes/admin/posts');
const categories=require('./routes/admin/categories');



//using routes
app.use('/',home);
app.use('/admin',admin);
app.use('/admin/posts',posts);
app.use('/admin/categories',categories);


app.listen(4500,()=>{
    console.log('Listening to port 4500');
});