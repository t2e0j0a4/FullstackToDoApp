import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const todoSchema = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  todo : {
    type : String,
    required : true
  },
  completed : {
    type : Boolean,
    default : false
  }
});

const todoModel = model("todos", todoSchema);
export default todoModel;