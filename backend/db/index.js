const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then((data)=>{
    console.log("mongodb connected succssefuly");
})

const userSchema = new mongoose.Schema({
        /*firstname : {type: String, trim: true, required: true},
        lastname : {type: String, trim: true, required: true},*/
        username : {type: String, required : true, unique : true, trim : true, lowercase: true, minLenght: 3, maxLenght:30},
        password : {type: String, required: true, minLenght:6}
})

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);

module.exports = {
    User,
    Account
}