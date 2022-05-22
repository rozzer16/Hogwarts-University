const Student = require('../models/student_model');
const Teacher = require('../models/teacher_model');
const Admin = require('../models/admin_model');
const bcrypt = require('bcrypt');
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')


// STUDENT
get_student = async(req,res)=>{
    if(req.session.type === 'student'){
        await Student.findOne({uid: req.session.username}, (err, foundStudent)=>{
            console.log(foundStudent);
            if(!err){
                res.render("studentDashboard", {Student: foundStudent})
                console.log(foundStudent);
            }
        }).clone()
    }else{
        res.render('studentLogin')
    }
}

login_student = async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    await Student.findOne({uid:username}, (err,foundStudent)=>{
        if(!err){
            if(foundStudent){
                bcrypt.compare(password, foundStudent.password, (err,result)=>{
                    if(result){
                        passport.authenticate("local")
                        req.session.username = foundStudent.uid
                        req.session.type = 'student'
                        res.render('studentDashboard', {Student: foundStudent})
                    }
                })
            }else{
                res.render('studentLogin')
            }
        }
    }).clone()
}

// TEACHER
get_teacher = async(req,res)=>{
    if(req.session.type === 'teacher'){
        await Teacher.find({eid: req.session.eid}, (err,foundTeacher)=>{
            res.render("teacherDashboard", {Teacher: foundTeacher})
        }).clone()
    }else{
        res.render('teacherLogin')
    }
}

login_teacher = async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    await Teacher.findOne({eid:username}, (err,foundTeacher)=>{
        if(!err){
            if(foundTeacher){
                bcrypt.compare(password, foundTeacher.password, (err,result)=>{
                    if(result){
                        passport.authenticate("local")
                        req.session.username = foundTeacher.eid
                        req.session.type = 'teacher'
                        res.render('teacherDashboard',{Teacher: foundTeacher})
                    }
                })
            }
        }else{
            res.render('teacherLogin')
        }
    }).clone()
}

//  ADMIN
get_admin = async(req,res)=>{
    if(req.session.type === 'admin'){
        await Admin.findOne({username: req.session.type}, (err,foundAdmin)=>{
            res.render("adminDashboard", {Admin: foundAdmin})
            console.log(foundAdmin);
        }).clone()
    }else{
        res.render('adminLogin')
    }
}

login_admin = async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    await Admin.findOne({username:username}, (err,foundAdmin)=>{
        if(!err){
            if(foundAdmin){
                bcrypt.compare(password, foundAdmin.password, (err, result)=>{
                    if(result){
                        passport.authenticate('local')
                        req.session.type = 'admin'
                        res.redirect('/Dashboard-Admin')
                    }
                })
            }else{
                res.render('adminLogin')
            }
        }
    }).clone()
}

logout = (req,res)=>{
    req.session.destroy((err) => {
        res.redirect('/');
      })
}


module.exports = {
    get_student,
    get_teacher,
    get_admin,
    login_student,
    login_teacher,
    login_admin,
    logout
}
