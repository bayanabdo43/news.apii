const express = require('express')
const router = express.Router()
const News = require('../models/news')
const multer = require('multer')
const auth = require('../middelware/auth')



/////////////post
router.post("/news", auth, async (req, res)=>{
  try {
    const news = new News({ ...req.body,user: req.user._id })
    await news.save()
    res.status(200).send(news)
  }
  catch (e) {
    res.status(400).send(e.message)
  }
})


/////////////////get
router.get('/news',auth,async(req,res)=>{
  try {
    await req.reporter.populate("news")
    res.status(200).send(req.reporter.news)
  }
  catch (e) {
    res.status(500).send(e.message)
  }
})

/////////////get by id
router.get('/news/:id',auth,async (req,res)=>{
    try {
      const _id = req.params.id
      const news = await News.findOne({ _id,ruser:req.reporter._id})
      if (!news){
        return res.status(404).send('unable ti find news')
      }
      res.status(200).send(news)
    }
    catch(e){
      res.status(500).send(e.message)
    }
  })

//////////update
router.patch('/news', auth, async (req, res)=>{
  try {
    const news = await News.findOneAndUpdate(
      { ...req.user._id, user: req.user._id },
      req.body,
      {
        new: true
      }
    )
    if (!news) {
      return res.status(404).send('Unable To Find')
    }
    res.status(200).send(news)
  }
  catch (e) {
    res.status(400).send(e.message)
  }
})

////////////delete
router.delete('/news/:id', auth, async (req, res)=>{
  try {
    const _id = req.params.id
    const news = await News.findOneAndDelete({_id,user: req.user._id,})
    if (!news) {
      return res.status(404).send('Unable To Find')
    }
    res.status(200).send(news)
  } catch (e) {
    res.status(500).send(e.message)
  }
})



const uploads = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)) {
      return cb(new Error('Please Upload img'))
    }
    cb(null, true)
  }
})

router.post('/news/img/:id',uploads.single('img'),auth,async (req,res)=>{
    try{
      req.news.avater=req.file.buffer
      await req.news.save()
          req.send()
    }
    catch(e){
      res.status(500).send(e.message)
    }
  })

module.exports = router