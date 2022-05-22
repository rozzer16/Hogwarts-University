const express = require('express')
const controller = require('../controller/Controller')
const login = require('../controller/login')
const session = require('express-session');
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')
const bcrypt = require('bcrypt')
const Admin = require('../models/admin_model');
const Student = require('../models/student_model');
const Teacher = require('../models/teacher_model');



const app = express()

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

app.use(session({
    secret: "8016976125",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize())
app.use(passport.session())
app.use((req,res,next)=>{
    next()
  });

// Template Engine
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: false}))


// Login Routes
app.route('/')
    .get((req,res)=> res.render("index"))

app.route('/logout')
    .get(login.logout)    

app.route('/Contact')
    .get((req,res)=> res.render("contact"))

app.route('/Developer')
    .get((req,res)=> res.render("developer"))

app.route('/University')
    .get((req,res)=> res.render("university"))

// log-in-pages
app.route('/Student-Login')
    .get(login.get_student)
    .post(login.login_student)

app.route('/Teacher-Login')
    .get(login.get_teacher)
    .post(login.login_teacher)

app.route('/Admin-Login')
    .get(login.get_admin)
    .post(login.login_admin)

// student-pages
app.route('/Dashboard-Student')
    .get(login.get_student)

app.route('/Feedback-Student')
    .get(controller.get_student_feedback)

app.route('/Help-Student')
    .get(controller.get_student_help)

app.route('/Profile-Student')
    .get(controller.get_student)

app.route('/Result-Student')
    .get(controller.get_student_marks)

app.route('/Timetable-Student')
    .get(controller.get_student_timetable)


//Teacher-pages
app.route('/Dashboard-teacher')
    .get(login.get_teacher)

app.route('/Feedback-teacher')
    .get(controller.get_teacher_feedback)

app.route('/Help-teacher')
    .get(controller.get_teacher_help)

app.route('/Profile-teacher')
    .get(controller.get_teacher)

app.route('/Grade-teacher')
    .get(controller.get_teacher_grades)

app.route('/Timetable-teacher')
    .get(controller.get_teacher_timetable)
    

// admin-pages
app.route('/Dashboard-Admin')
    .get(login.get_admin)

app.route('/Student-Admin')
    .get(async(req,res)=>{ 
        if(req.session.type === 'admin'){
            console.log(req.session.type);
            await Admin.findOne({username: req.session.type}, (err,foundAdmin)=>{
                res.render("adminStudent", {Admin: foundAdmin})
                console.log(foundAdmin);
            }).clone()
        }else{
            res.render('adminLogin')
        } 
    })    
    .post(controller.create_student)

app.route('/Teacher-Admin')
    .get(async(req,res)=>{ 
        if(req.session.type === 'admin'){
            await Admin.findOne({username: req.session.type}, (err,foundAdmin)=>{
                res.render("adminTeacher", {Admin: foundAdmin})
            }).clone()
        }else{
            res.render('adminLogin')
        }
    })
    .post(controller.create_teacher)  

app.route('/Admin-Admin')
    .get((req,res)=> res.render('adminRegister' , {Admin: 'Admin'}))
    .post(controller.create_admin)


// GRADES
app.route('/ps')
    .get(async(req,res)=>{
        if(req.session.type === 'teacher'){
            console.log(req.session.type + " " + req.session.username);
            await Teacher.find({eid: req.session.username}, async(err,foundTeacher)=>{
                if(!err){
                    await Student.find({uid: req.session.username}, (err, foundStudent)=>{
                        if(!err){
                            res.redirect('/Grade-teacher')
                        }
                    }).clone()
                }else{
                    
                }
            }).clone()
        }
    })
    .post(controller.set_teacher_grades_ps)
app.route('/cn')
    .post(controller.set_teacher_grades_cn)  
app.route('/python')
    .post(controller.set_teacher_grades_python)      
app.route('/se')
    .post(controller.set_teacher_grades_se)
app.route('/mpi')
    .post(controller.set_teacher_grades_mpi)
app.route('/dsa')
    .post(controller.set_teacher_grades_dsa)    
app.route('/soft')
    .post(controller.set_teacher_grades_soft)

module.exports = app;  

app.route('*')
    .get((req,res)=> res.render('Error'))

module.exports = app;  