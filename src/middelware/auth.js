const jwt = require("jsonwebtoken")
const user = require("../models/user")
const auth = async (req,res,next)=>{

  try {
    const token = req.header("Authorization").replace('Bearer','')
    console.log(token)
    const decode = jwt.verify(token,'nodecourse')
    const user = await user.findOne({ _id: decode._id, tokens: token })
    if (!user) {
      throw new Error()
    }
    req.user = user
    req.token = token
    next()
  }
  catch(e){
    res.status(401).send({ Error:'Please authenticate'})
  }
}


module.exports = auth