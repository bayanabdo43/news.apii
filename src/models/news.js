const mongoose = require("mongoose")
const news = mongoose.model('news',{

    title:{
      type: String,
      required: true,
      trim: true,

    },
    description: {
      type: String,
      required: true,
      trim: true

    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:'Reporter'

    },

    img: {
      type: Buffer
    }

  },{timestamps:true})

module.exports = News