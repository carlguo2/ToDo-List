var express = require('express');
var router = express.Router();

// get the Task record
var Task = require('../models/task');

// REST api requests for /task
// Respond with a list of tasks
router.get('/', function(req, res) {
    // construct where filters
    var where = req.query.where ? JSON.parse(req.query.where) : {};
    // construct select filter
    var select = req.query.select ? JSON.parse(req.query.select) : {};
    Task.find(where, select, null, function(err, tasks) {
        if (err) {
            return res.status(500).send({
                message: 'Server Error: ' + err,
                data: []
            })
        } else {
            res.status(200).send({
                message: 'Tasks Retrieved',
                data: tasks
            })
        }
    });
});

// Retrieve a specific task given the id
router.get('/:id', function(req, res) {
    const id = req.params.id;
    Task.findById(id, function(err, task) {
        if (err) {
            return res.status(500).send({
                message: 'Server Error: ' + err,
                data: {}
            });
        } else {
            if (!task) {
                return res.status(404).send({
                    message: 'Task Not Found',
                    data: {}
                })
            } else {
                res.status(200).send({
                    message: 'Task Retrieved',
                    data: task
                })
            }
        }
    });
});

// Create a new task 
router.post('/', function(req, res) {
    const name = req.body.name;
    const priority = req.body.priority;
    Task.create(req.body, function(err, task) {
        if (err) {
            if (!name || (priority !== 'low' && priority !== 'med' && priority !== 'high')) {
                res.status(400).send({
                    message: 'Invalid Request - Failed to create Task: ' + err,
                    data: {}
                });
            } else {
                res.status(500).send({
                    message: 'Server Error - Failed to create Task: ' + err,
                    data:{}
                });
            }
        } else {
            if (!task) {
                res.status(404).send({
                    message: 'Task Not Found',
                    data: {}
                });
            } else {
                res.status(201).send({
                    message: 'Task Created Successfully',
                    data: task
                });
            }
        }
    });
});

// Edit a specific task given the id
router.put("/:id", function(req, res) {
    const name = req.body.name;
    const priority = req.body.priority;
    Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true}, function(err, task) {
        if (err) {
            if (!name || (priority !== 'low' && priority !== 'med' && priority !== 'high')) {
                res.status(400).send({
                    message: 'Invalid Request - Failed to edit Task: ' + err,
                    data: {}
                });
            } else {
                res.status(500).send({
                    message: 'Server Error - Failed to edit Task: ' + err,
                    data:{}
                });
            }
        } else {
            if (!task) {
                res.status(404).send({
                    message: 'Task Not Found',
                    data: {}
                });
            } else {
                res.status(200).send({
                    message: 'Task Updated Successfully',
                    data: task
                });
            }
        }
    });
});

// Delete a specific task given the id
router.delete('/:id', function(req, res) {
    Task.findByIdAndDelete(req.params.id, function(err, task) {
        if (err) {
            res.status(500).send({
                message: 'Server Error: ' + err,
                data: {}
            });
        } else {
            if (!task) {
                res.status(404).send({
                    message: 'Task Not Found',
                    data: {}
                }); 
            } else {
                res.status(200).send({
                    message: 'Task Successfully Deleted',
                    data: task
                });
            }
        }
    });
});

module.exports = router;
