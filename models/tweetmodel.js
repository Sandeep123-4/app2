const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://xtry122:dV6zQGz1N5N9rV5k@sandeep123-4.is5vj.mongodb.net/?retryWrites=true&w=majority&appName=sandeep123-4",{
    useNewUrlParser: true,
  useUnifiedTopology: true
})
const tweet_schema = mongoose.Schema({
   tweet:{
    type:String,
    require:true,
    minlength:1,
    maxlength:10000,
   },
   username:{
    type:String,
    require:true
},
createdAt: { type: Date, default: Date.now }

});

module.exports = mongoose.model("tweet" , tweet_schema)