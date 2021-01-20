const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    description: {
        type : String,
        required : true,
        trim : true
    },
    completed: {
        type : Boolean,
        default : false
    },
    user: {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'User'
    },
    image: {
        type: Buffer
    }
},
{
    timestamps : true
});

taskSchema.methods.toJSON =  function(){
    const task = this;
    const taskObject = task.toObject();

    delete taskObject.image;
    
    return taskObject;

}

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;