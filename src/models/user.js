const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = mongoose.model('User',{
    name:{
        type:string,
        required:true,
        trim:true
    },
    address:{
        type:string
    },
    email:{
        type:string,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error ('Email is inva;id')
            }
        }
    },
    password:{
        type:string,
        required:true,
        trim:true,
        minlength:5,
        validate(value){
            let password = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')
            if (!password.test(value)) {
              throw new Error('Password Must Contain Special character')
            }
        }
    },
    phonenumber:{
        type:number,
        required:true,
        trim:true,
        minlength:11,
        validate(value){
            if (!validator.isMobilePhone(value,['ar-EG'])) {
              throw new Error('Phone Number is invalid')
            }
          }
        },

        tokens:[
          {
            type: String,
            required:true
          }
        ],

        avatar:{
          type: Buffer
        }
      },{timestamps:true})
    


    userSchema.pre('save',async function(){
      const user = this
      if (user.isModified('password'))
        user.password = await bcryptjs.hash(user.password,8)
    })
    
    


    userSchema.statics.findByCredentials = async (email, password)=>{
      const user = await user.findOne({email})
      if (!user){
        throw new Error('Unable to login')
      }
      const isMatch = await bcryptjs.compare(password, user.password)
      if (!isMatch){
        throw new Error('Unable to login')
      }
      return user
    }
    
    


    userSchema.methods.generateToken = async function(){
      const user = this
      const token = jwt.sign({ _id:user._id.toString()},'nodecouese')
      user.tokens = user.tokens.concat(token)
      await user.save()
      return token
    }
    
    

    userSchema.methods.toJSON = function(){
      const user = this
      const userObject = user.toObject()
      delete userObject.password
      delete userObject.tokens
      return userObject
    }
    
    userSchema.virtual('news',{
      ref: 'News',
      localField: '_id',
      foreignField: 'user'
    })
    
    

const user = mongoose.model('user',userSchema)
module.exports = User