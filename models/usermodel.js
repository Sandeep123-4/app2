const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://xtry122:dV6zQGz1N5N9rV5k@sandeep123-4.is5vj.mongodb.net/?retryWrites=true&w=majority&appName=sandeep123-4", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const user_schema = mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        unique:true,
        require:true
    },
    password:{
        type:String,
        require:true
    }
});

module.exports = mongoose.model("user" , user_schema)