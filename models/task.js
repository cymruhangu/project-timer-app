'use strict';

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const taskSchema = new mongoose.Schema({
    parent: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
    name: {type: String, required: true},
    owner: String,
    description: String,
    budget: Number,
    remaining: Number,
    isComplete: {type: Boolean, default: true}
});

// taskSchema.pre('find', function(next) {
//     this.populate('name');
//     this.populate('description');
//     this.populate('budget');
//     this.populate('remaining');
//     next();
// });

// taskSchema.pre('findOne', function(next) {
//     this.populate('name');
//     this.populate('description');
//     this.populate('budget');
//     this.populate('remaining');
//     next();
// });

taskSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        owner: this.owner,
        description: this.description,
        budget: this.budget,
        remaining: this.remaining,
        isComplete: this.isComplete
    }
}

const Task = mongoose.model('Task', taskSchema);
module.exports = { Task };