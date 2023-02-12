import { Router } from "express";
import userAuth from "../Middleware/userAuth.js";
// import { body, validationResult } from "express-validator";
import todoModel from "../Models/Todo.js";
const router = Router();

// User Specific Fetching & Adding.

// POST : http://localhost:5000/api/v1/todos/newtodo - Adding New ToDo.
// Login Required.
router.post('/newtodo', userAuth, async (req,res)=>{
    
    const {UID} = req.finalAuth;
    const {todo, completed} = req.body;

    try {

        if (!todo) {
            return res.status(400).json({
                success : false,
                alertMsg : "ToDo field is empty..."
            })
        }

        const newToDo = {user:UID,todo,completed}
        const addToDo = await todoModel.create(newToDo);
        
        return res.status(200).json({
            success : true,
            alertMsg : "Added New ToDo...",
            todo : addToDo
        })
        
    } catch (error) {
        return res.status(500).json({
            success : false,
            alertMsg : "Error Occured..."
        })
    }

})

// GET : http://localhost:5000/api/v1/todos/alltodos - All ToDo's.
// Login Required.
router.get('/alltodos', userAuth ,async (req,res)=>{
    
    try {
        const { UID: user } = req.finalAuth;
        const fetchUserToDos = await todoModel.find({ user });

        return res.status(200).json({
          success: true,
          todos: fetchUserToDos,
        });

    } catch (error) {
        return res.status(500).json({
          success: true,
          alertMsg: "Error Fetching ToDos...",
        });
    }
    
})

// PUT : http://localhost:5000/api/v1/todos/donetodo/123 - Toggle Completion ToDo.
// Login Required.
router.put('/donetodo/:id', userAuth ,async (req,res) => {
    
    const {id} = req.params;
    const {UID : user} = req.finalAuth;
    const {completed} = req.body;
    
    try {
        
        let todo = await todoModel.findById(id);

        if (!todo) {
          return res.status(400).json({
            success: false,
            alertMsg: "ToDo don't Exists...",
          });
        }

        if (todo.user.toString() !== user) {
          return res.status(400).json({
            success: false,
            alertMsg: "Authorized Error...",
          });
        }

        let updateToDo;
        if (completed !== todo.completed) {
            updateToDo = await todoModel.findByIdAndUpdate(id,{completed},{new:true});
        }

        return res.status(200).json({
            success : true,
            alertMsg : completed ? 'Work completed...' : 'Work incomplete.',
            updateToDo : updateToDo ? updateToDo : todo
        })

    } catch (error) {
        return res.status(500).json({
          success: true,
          alertMsg: "Error Updating ToDo...",
        });
    }

})

// DELETE : http://localhost:5000/api/v1/todos/deletetodo/123 - Deleting ToDo.
// Login Required.
router.delete('/deletetodo/:id', userAuth , async (req,res)=>{
    
    try {

        const {id} = req.params;
        const {UID : user} = req.finalAuth;

        let todo = await todoModel.findById(id);

        if (!todo) {
            return res.status(400).json({
                success : false,
                alertMsg : "ToDo don't Exists..."
            })
        }

        if (todo.user.toString() !== user) {
            return res.status(400).json({
              success: false,
              alertMsg: "Authorized Error...",
            });
        }

        let allToDos = await todoModel.findByIdAndDelete(id,{new:true});

        return res.status(200).json({
            success : true,
            alertMsg : "ToDo Deleted...",
        })
        
    } catch (error) {
        return res.status(500).json({
          success: true,
          alertMsg: "Error Deleting ToDo...",
        });
    }

})

export default router;