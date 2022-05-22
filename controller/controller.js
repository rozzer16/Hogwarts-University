const Student = require('../models/student_model');
const Teacher = require('../models/teacher_model');
const Admin = require('../models/admin_model');
const session = require('express-session');
const passport = require('passport')
const express = require('express')
const passportLocalMongoose = require('passport-local-mongoose')
const bcrypt = require('bcrypt');
const req = require('express/lib/request');

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

/* Bcrypt */
const saltRounds = 10;

//  student
create_student = (req,res)=>{
    const uid = req.body.uid
    const name = req.body.name
    const dob  = req.body.dob
    const password = req.body.password
    const gender = req.body.gender
    const address = req.body.address
    const email = req.body.email
    const section = req.body.section
    const phone = req.body.phone

    bcrypt.hash(password, saltRounds, (err,hash)=>{
        const newStudent = new Student({
            uid : uid ,
            name : name ,
            dob : dob ,
            password : hash,
            gender : gender ,
            address : address ,
            email : email ,
            section : section ,
            phone : phone,
            marks: [0,0,0,0,0,0,0] 
        })
        newStudent.save((err)=>{
            if(!err){
                res.redirect('Dashboard-Admin');
            }else{
                console.log(err)
                res.redirect("/Student-Admin");
            }
        })
    })
}

get_student = async(req,res)=>{
    if(req.session.type === 'student'){
        await Student.findOne({uid: req.session.username}, (err, foundStudent)=>{
            console.log(foundStudent);
            if(!err){
                res.render("studentProfile", {Student: foundStudent})
                console.log(foundStudent);
            }
        }).clone()
    }else{
        res.render('studentLogin')
    }
}

get_student_marks = async(req,res)=>{
    if(req.session.type === 'student'){
        await Student.findOne({uid: req.session.username}, (err, foundStudent)=>{
            if(!err){
                res.render("studentResult", {Student: foundStudent})
            }
        }).clone()
    }else{
        res.render('studentLogin')
    }
}
get_student_feedback = async(req,res)=>{
    if(req.session.type === 'student'){
        await Student.findOne({uid: req.session.username}, (err, foundStudent)=>{
            if(!err){
                res.render("studentFeedback", {Student: foundStudent})
            }
        }).clone()
    }else{
        res.render('studentLogin')
    }
}
get_student_help = async(req,res)=>{
    if(req.session.type === 'student'){
        await Student.findOne({uid: req.session.username}, (err, foundStudent)=>{
            if(!err){
                res.render("studentHelp", {Student: foundStudent})
            }
        }).clone()
    }else{
        res.render('studentLogin')
    }
}
get_student_timetable = async(req,res)=>{
    if(req.session.type === 'student'){
        await Student.findOne({uid: req.session.username}, (err, foundStudent)=>{
            if(!err){
                res.render("studentTimetable", {Student: foundStudent})
            }
        }).clone()
    }else{
        res.render('studentLogin')
    }
}


//  teacher
create_teacher = (req,res)=>{
    const eid = req.body.eid
    const name = req.body.name
    const dob = req.body.dob
    const spelization = req.body.Specialization
    const password = req.body.password
    const gender = req.body.gender
    const joiningyear = req.body.joiningyear
    const address = req.body.address
    const email = req.body.email
    const phone = req.body.phone

    bcrypt.hash(password, saltRounds, (err,hash)=>{
        const newTeacher = new Teacher({
            eid : eid,  
            name : name, 
            dob : dob,
            spelization : spelization, 
            password : hash,
            gender : gender ,
            joiningyear : joiningyear , 
            address : address ,
            email : email , 
            phone : phone
        })

        newTeacher.save((err)=>{
            if(!err){
                res.redirect('/Dashboard-Admin');
            }else{
                console.log(err);
                res.redirect("/Teacher-Admin");
            }
        })
    })
}

get_teacher = async(req,res)=>{
    if(req.session.type === 'teacher'){
        await Teacher.findOne({eid: req.session.username}, (err, foundTeacher)=>{
            console.log(foundTeacher);
            if(!err){
                res.render("teacherProfile", {Teacher: foundTeacher})
                console.log(foundTeacher);
            }
        }).clone()
    }else{
        res.render('TeacherLogin')
    }
}

get_teacher_feedback = async(req,res)=>{
    if(req.session.type === 'teacher'){
        await Teacher.findOne({eid: req.session.username}, (err, foundTeacher)=>{
            if(!err){
                res.render("teacherFeedback", {Teacher: foundTeacher})
            }
        }).clone()
    }else{
        res.render('teacherLogin')
    }
}
get_teacher_help = async(req,res)=>{
    if(req.session.type === 'teacher'){
        await Teacher.findOne({eid: req.session.username}, (err, foundTeacher)=>{
            if(!err){
                res.render("teacherHelp", {Teacher: foundTeacher})
            }
        }).clone()
    }else{
        res.render('teacherLogin')
    }
}
get_teacher_timetable = async(req,res)=>{
    if(req.session.type === 'teacher'){
        await Teacher.findOne({eid: req.session.username}, (err, foundTeacher)=>{
            if(!err){
                res.render("teacherTimetable", {Teacher: foundTeacher})
            }
        }).clone()
    }else{
        res.render('teacherLogin')
    }
}
get_teacher_grades = async(req,res)=>{
    if(req.session.type === 'teacher'){
        await Teacher.findOne({eid: req.session.username}, async(err, foundTeacher)=>{
            if(!err){
                await Student.find({}, (err,foundStudent)=>{
                    if(!err){
                        res.render('teacherGrades', {Teacher: foundTeacher, Student: foundStudent})
                    }
                }).clone()
            }
        }).clone()
    }else{
        res.render('teacherLogin')
    }
}

set_teacher_grades_ps = async(req,res)=>{
    const grade = req.body.marks
    const uid = req.body.uid
    const eid = req.body.eid
    if(req.session.type === 'teacher'){
        await Teacher.findOne({eid: eid}, async(err,foundTeacher)=>{
            await Student.findOne({uid: uid}, (err,foundStudent)=>{
                if(!err){
                    foundStudent.marks[0] = grade
                }
    
                foundStudent.save((err)=>{
                    if(!err){
                        res.render('teacherGrades', {Student: foundStudent, Teacher: foundTeacher})
                    }else{
                        res.redirect('/Grade-teacher')
                    }
                })
            }).clone()
        }).clone()
    }
}
set_teacher_grades_cn = async(req,res)=>{
    const grade = req.body.marks
    const uid = req.body.uid
    const eid = req.body.eid
    if(req.session.type === 'teacher'){
        await Teacher.findOne({eid: eid}, async(err, foundTeacher)=>{
            if(!err){
                await Student.findOne({uid: uid}, (err,foundStudent)=>{
                    if(!err){
                        foundStudent.marks[1] = grade
                    }
                    
                    foundStudent.save((err)=>{
                        if(!err){
                            res.render('teacherGrades', {Teacher: foundTeacher,Student: foundStudent})
                        }else{
                            res.redirect('/Grade-teacher')
                        }
                    })
                }).clone()
            }
        }).clone()
    }
}
set_teacher_grades_python = async(req,res)=>{
    const grade = req.body.marks
    const uid = req.body.uid
    const eid = req.body.eid
    if(req.session.type === 'teacher'){
        await Teacher.findOne({eid: eid}, async(err,foundTeacher)=>{
            await Student.findOne({uid: uid}, (err,foundStudent)=>{
                if(!err){
                    foundStudent.marks[2] = grade
                }
    
                foundStudent.save((err)=>{
                    if(!err){
                        res.render('teacherGrades', {Student: foundStudent, Teacher: foundTeacher})
                    }else{
                        res.redirect('/Grade-teacher')
                    }
                })
            }).clone()
        }).clone()
    }
}
set_teacher_grades_se = async(req,res)=>{
    const grade = req.body.marks
    const uid = req.body.uid
    const eid = req.body.eid
    if(req.session.type === 'teacher'){
        await Teacher.findOne({eid: eid}, async(err,foundTeacher)=>{
            await Student.findOne({uid: uid}, (err,foundStudent)=>{
                if(!err){
                    foundStudent.marks[3] = grade
                }
    
                foundStudent.save((err)=>{
                    if(!err){
                        res.render('teacherGrades', {Student: foundStudent, Teacher: foundTeacher})
                    }else{
                        res.redirect('/Grade-teacher')
                    }
                })
            }).clone()
        }).clone()
    }
}
set_teacher_grades_mpi = async(req,res)=>{
    const grade = req.body.marks
    const uid = req.body.uid
    const eid = req.body.eid
    if(req.session.type === 'teacher'){
        await Teacher.findOne({eid: eid}, async(err,foundTeacher)=>{
            await Student.findOne({uid: uid}, (err,foundStudent)=>{
                if(!err){
                    foundStudent.marks[4] = grade
                }
    
                foundStudent.save((err)=>{
                    if(!err){
                        res.render('teacherGrades', {Student: foundStudent, Teacher: foundTeacher})
                    }else{
                        res.redirect('/Grade-teacher')
                    }
                })
            }).clone()
        }).clone()
    }
}
set_teacher_grades_dsa = async(req,res)=>{
    const grade = req.body.marks
    const uid = req.body.uid
    const eid = req.body.eid
    if(req.session.type === 'teacher'){
        await Teacher.findOne({eid: eid}, async(err,foundTeacher)=>{
            await Student.findOne({uid: uid}, (err,foundStudent)=>{
                if(!err){
                    foundStudent.marks[5] = grade
                }
    
                foundStudent.save((err)=>{
                    if(!err){
                        res.render('teacherGrades', {Student: foundStudent, Teacher: foundTeacher})
                    }else{
                        res.redirect('/Grade-teacher')
                    }
                })
            }).clone()
        }).clone()
    }
}
set_teacher_grades_soft = async(req,res)=>{
    const grade = req.body.marks
    const uid = req.body.uid
    const eid = req.body.eid
    if(req.session.type === 'teacher'){
        await Teacher.findOne({eid: eid}, async(err,foundTeacher)=>{
            await Student.findOne({uid: uid}, (err,foundStudent)=>{
                if(!err){
                    foundStudent.marks[6] = grade
                }
    
                foundStudent.save((err)=>{
                    if(!err){
                        res.render('teacherGrades', {Student: foundStudent, Teacher: foundTeacher})
                    }else{
                        res.redirect('/Grade-teacher')
                    }
                })
            }).clone()
        }).clone()
    }
}


// ADMIN
create_admin = (req,res)=> {
    const username = req.body.username
    const password = req.body.password

    bcrypt.hash(password, saltRounds, (err,hash)=>{
        const newAdmin = new Admin({
            username: username,
            password: hash
        })

        newAdmin.save((err)=>{
            if(!err){
                res.render('adminLogin')
            }else{
                res.redirect("/Admin-Admin");
            }
        })
    })
}


module.exports = {
    create_student,
    create_teacher,
    create_admin,
    get_student,
    get_student_marks,
    get_student_feedback,
    get_student_help,
    get_student_timetable,
    get_teacher,
    get_teacher_grades,
    get_teacher_feedback,
    get_teacher_help,
    get_teacher_timetable,
    set_teacher_grades_ps,
    set_teacher_grades_cn,
    set_teacher_grades_python,
    set_teacher_grades_se,
    set_teacher_grades_mpi,
    set_teacher_grades_dsa,
    set_teacher_grades_soft
}
