import {Schema,model} from "mongoose";

const userSchema = new Schema({
    fullName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
        min : [8, 'Minimum 8 Characters...']
    }
});

const userModel = model('users',userSchema);
export default userModel;