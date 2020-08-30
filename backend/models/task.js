// load the required packages
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the task schema
/**
 * "name" - String
 * "description" - String
 * "completed" - Boolean
 * "priority" - String
 * "dateCreated" - Date - should be set automatically by server to present date
 */
// https://stackoverflow.com/questions/29859910/restrict-mongoose-field-values
var TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    priority: { type: String, default: "low", enum: ['low', 'med', 'high'] },
    completed: { type: Boolean, default: false }
}, {
    timestamps: {createdAt: 'dateCreated', updatedAt: false},
    versionKey: false
});

module.exports = mongoose.model('Task', TaskSchema)