import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required : true,
        unique: true,
        minlength : 6
    },
    profileImage: {
        type: String,
        default:""
    }
});

//hash the password before saving user to database [ await user.save() [ from authRoutes.js ]]
userSchema.pre("save", async function(next){
    
    if(!this.isModified("password")) return next(); //if password is not being updated, we don't want to hash the password once again;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
})

const User = mongoose.model("User", userSchema);
export default User;