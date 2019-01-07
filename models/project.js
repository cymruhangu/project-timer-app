'use strict';

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const projectSchema = new mongoose.Schema({
    name: {type: String, required: true},
    owner: String,
    description: String,
    budget: Number,
    remaining: Number,
    tasks:[],
    isActive: {type: Boolean, default: true}
});

// projectSchema.pre('find', function(next) {
//     this.populate('name');
//     this.populate('description');
//     this.populate('budget');
//     this.populate('remaining');
//     next();
// });

// projectSchema.pre('findOne', function(next) {
//     this.populate('name');
//     this.populate('description');
//     this.populate('budget');
//     this.populate('remaining');
//     next();
// });

projectSchema.methods.serialize = function() {
    return {
        id: this._id,
        name: this.name,
        onwer: this.owner,
        description: this.description,
        budget: this.budget,
        remaining: this.remaining,
        tasks: this.tasks,
        isActive: this.isActive
    }
}

const Project = mongoose.model('Project', projectSchema);
module.exports = { Project };