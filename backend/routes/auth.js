const express=require('express');
const router=express.Router();
const User=require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt=require('bcrypt');
var jwt = require('jsonwebtoken');
var fetchuser=require('../middleware/fetchuser');

const JWT_SECRET="Zaidisverypeaceful@oye";

// ROUTE1 create a user using :POST"/api/auth/createuser" .. no login required
router.post('/createuser',[
    body('email').isEmail(),
    body('name').isLength({ min: 3 }),
    body('password').isLength({ min: 5 }),
],async (req,res)=>{
    let success=false
    // if there are errors return bad request along with errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    // check whether the user with the same email exists already
    try{
        let user =await User.findOne({email:req.body.email});
    // if user exists already with the same user name
    if(user){
        return res.status(400).json({success,error:"Sorry a user with same email exists already "})
    }
    // to generate salt
    const salt=await bcrypt.genSalt(10);
    const secPass= await bcrypt.hash(req.body.password,salt);
     user= await User.create({
        name: req.body.name,
        email:req.body.email,
        password: secPass
      });
      
     const data={
         user:{
             id:user.id
         }
     }
     const authtoken=jwt.sign(data,JWT_SECRET);
     success=true;
     res.json({success,authtoken});
    }catch (error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
//ROUTE2 authethicate a user using /api/auth/login
router.post('/login',[
    body('email','Enter a Valid email').isEmail(),
    body('password','password cannot be blank').exists(),
],async (req,res)=>{
    let success=false;
    // if there are errors return errors and bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const{email,password}=req.body;
    try {
        let user =await User.findOne({email});
        if(!user){
            success=false
            return res.status(400).json({ success,errors:"Please try to login with correct credentials" }) ;
        }
        const passwordCompare=await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            success=false;
            return res.status(400).json({ success,errors:"Please try to login with correct credentials" });
        }
        const data={
            user:{
                id:user.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET);
        success=true
        res.json({success,authtoken});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});
//ROUTE3 : Get logged in user details using POST "/api/auth/getUser"- login required
router.post('/getuser',fetchuser,async (req,res)=>{
try {
   userId=req.user.id;
 const user = await User.findById(userId).select("-password"); 
   res.send(user);
} catch (error) {
    console.error(error.message);
        res.status(500).send("Internal Server Error");
}
})
module.exports=router;