const express = require('express')
const router = express.Router()
const User = require('../models/user')
const multer = require("multer")

const auth = require("../middelware/auth")


// router.post('/',(req,res)=>{
//     console.log(req.body)
//     const User = new User(req.body)
//     User.save().then(()=>{
//         res.status(201).send(User)
//     }).catch((e)=>{
//         res.status(400).send(e)
//     })
// })

// router.get('/users',(req,res)=>{
//     User.find({}.then((users)=>{
//         res
//     })
// })

router.post('/user', async (req,res)=>{
    try {
      const user = new user(req.body)
      const token = await user.generateToken()
      await user.save()
      res.status(200).send({user,token})
    } catch (e) {
      res.status(400).send(e.message)
    }
  })
  
  ////////////////login
  router.post('/login',async(req,res)=>{
    try {
      const user = await user.findByCredentials(req.body.email,req.body.password)
      const token = await user.generateToken()
      res.status(200).send({user,token})
    } catch (e) {
      res.status(400).send(e.message)
    }
  })
  
  //////////////logout
  router.delete('/logout', auth, async(req,res)=>{
    try {
      console.log(req.user)
      req.user.tokens = req.user.tokens.filter((el)=>{
        return el !== req.token
      })
      await req.user.save()
      res.send()
    } 
    catch(e){
      res.status(500).send(e)
    }
  })

  ///////////////logout all
  router.delete('/logoutAll', auth, async (req, res)=>{
    try {
      req.user.tokens=[]
      await req.user.save()
      res.send()
    }
    catch (e){
      res.status(500).send(e)
    }
  })
  
  ///////////////profile
  router.get('/profile', auth, async (req, res)=>{
    res.status(200).send(req.user);
  })
  
  ///////////////////get
  router.get('/user', async (req, res) => {
    try {
      const user = await user.find({});
      res.status(200).send(user);
    } catch (e) {
      res.status(400).send(e.message);
    }
  })
  
  ////////////////get by id
  router.get('/user/:id', async (req, res)=>{
    try {
      const _id = req.params.id
      const user = await user.findById(_id)
      if (!user) {
        return res.status(404).send("Unable to find a user")
      }
      res.status(200).send(user)
    } catch (e) {
      res.status(400).send(e.message)
    }
  })
  
  ///////////////get
  router.get('/user',auth, async (req, res)=>{
    user.find({}).then((user)=>{
        res.status(200).send(user)
    }).catch((e)=>{
        res.status(500).send(e)
    })
  })



  /////////////////ubdate
  router.patch('/user', auth, async (req, res)=>{
    try {
      const updates = Object.keys(req.body)
      updates.forEach((update)=>(req.user[update] = req.body[update]))
      await req.user.save()
      res.status(200).send(req.user)
    }
    catch (e) {
      res.status(400).send(e)
    }
  })
  
  ///////////////delete by id
  router.delete('/user/:id', async (req, res)=>{
    try {
      const _id = req.params.id
      const user = await user.findByIdAndDelete(_id)
      if (!user) {
        return res.status(404).send('Unable to find')
      }
      res.status(200).send(user)
    }
    catch (e) {
      res.status(500).send(e.message)
    }
  })

  ///////////////delete 
  router.delete("/user", auth, async (req, res) => {
    try {
      req.user.remove()
      res.status(200).send(req.user)
    }
    catch (e) {
      res.status(500).send(e.message)
    }
  })

  //////////////////upload img
  const uploads = multer({
    limits: {
      fileSize: 1000000
    },
    fileFilter(req, file,cb){
      if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
        return cb(new Error('Please Upload img'))
      }
      cb(null,true)
    }
  })
  
  
  router.post('/profile/avatar',auth,uploads.single('avatar'),async (req, res)=>{
      try {
        req.user.avatar=req.file.buffer
        await req.user.save()
        res.send()
      }
      catch(e){
        res.status(500).send(e)
      }
    }
  )


module.exports = router