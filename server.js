if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
let cron = require('node-cron')
let nodemailer = require('nodemailer')


const initializePassport = require('./passport-config')
initializePassport(passport,
email =>    users.find(user => user.email === email),
id =>users.find(user => user.id === id)
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


app.get('/', (req,res)=>{
    res.render('index.ejs')
})

app.get('/login',checkNotAuthenticated, (req,res)=>{
    res.render('login.ejs')
})

app.get('/register',checkNotAuthenticated, (req,res)=>{
    res.render('register.ejs')
})

app.post('/login',checkNotAuthenticated, passport.authenticate('local',{
    successRedirect: '/homepage',
    failureRedirect: '/homepage',
    failureFlash: true
}))

app.get('/homepage',(req,res) => {
    res.render('homepage.ejs')
})

app.get('/discussion_forum_details',(req,res) => {
    res.render('discussion_forum_details.ejs')
})

app.get('/discussion_forum',(req,res) => {
    res.render('discussion_forum.ejs')
})

app.get('/regular_checkups',(req,res) => {
    res.render('regular_checkups.ejs')
})

app.get('/water_track',(req,res) => {
    res.render('water_track.ejs')
})

app.get('/workout_track',(req,res) => {
    res.render('workout_track.ejs')
})

app.get('/bodymass_index',(req,res) => {
    res.render('bodymass_index.ejs')
})

app.get('/regular_checkups_less45',(req,res)=>{
    res.render('regular_checkups_less45.ejs')
})

app.get('/regular_checkups_more45',(req,res)=>{
    res.render('regular_checkups_more45.ejs')
})

app.post('/regular_checkups',(req,res) => {
     const age = req.body.age;
     if(parseInt(age)<=45){
         res.render('regular_checkups_less45.ejs');
     }
     else{
          res.render('regular_checkups_more45.ejs');
     }
})

app.post('/register',checkNotAuthenticated, async (req,res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    }
    catch{
        res.redirect('/register')
    }
   
})

app.post('/workout_track',async (req,res) =>{
    const email = req.body.email;
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: 'da...@ethereal.email', //
            pass: 'aJ...', 
        },
    });
    
    const msg = {
        from: '"The Exapress App" <theExpressApp@example.com>', // sender address
        to: email, // list of receivers
        subject: "Reminder for Workout from Fitness App",
        text: "Hey! Its time for your workout now, go ahead.",
    }
    const info = await transporter.sendMail(msg);
    console.log("Message sent: %s", info.messageId);
    
    res.render('/workout_track',{message: 'Email Sent!'})
})

app.post('/water_track', async (req,res) =>{
    const email = req.body.email;
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: 'da...@ethereal.email', //
            pass: 'aJ...', 
        },
    });
    
    const msg = {
        from: '"The Exapress App" <theExpressApp@example.com>', // sender address
        to: email, // list of receivers
        subject: "Reminder from Fitness App",
        text: "Hey! Its time to drink water now, go ahead.",
    }
    const info = await transporter.sendMail(msg);
    console.log("Message sent: %s", info.messageId);
    
    res.send('Email Sent!')
})

app.post('/bodymass_index', (req,res) =>{

})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(3000)