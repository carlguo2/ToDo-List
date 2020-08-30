import React from "react";
import axios from 'axios';
import { Form, Input, Checkbox, TextArea } from 'semantic-ui-react';
import './EditTask.scss'

class EditTask extends React.Component {
    constructor(props) {
        super(props);
        // bind change state methods to object
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handlePriorityChange = this.handlePriorityChange.bind(this);
        this.handleCompletedChange = this.handleCompletedChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // state to hold new task info
        this.state = {
            name: '',
            description: '',
            priority: 'low',
            completed: false
        }
    }

    // get current task info as state when component mounted
    componentDidMount() {
        axios.get('http://localhost:4000/api/task/'+this.props.match.params.id)
            .then((response) => {
                this.setState({
                    // response.data has fields message and data
                    // hence having to use response.data.data
                    name: response.data.data.name,
                    description: response.data.data.description,
                    priority: response.data.data.priority,
                    completed: response.data.data.completed
                });
            })
            .catch(function(err) {
                console.log(err);
            });
    }

    handleNameChange(newName) {
        this.setState({
            name: newName
        })
    }

    handleDescChange(newDesc) {
        this.setState({
            description: newDesc
        })
    }

    handlePriorityChange(newPrior) {
        this.setState({
            priority: newPrior
        })
    }

    handleCompletedChange(newCompleted) {
        this.setState({
            completed: newCompleted
        });
    }

    async handleSubmit(event) {
        // get rid of default behavior
        event.preventDefault();
        // use axios to POST the task
        const newTask = {
            name: this.state.name,
            description: this.state.description,
            priority: this.state.priority,
            completed: this.state.completed
        }
        await axios.put('http://localhost:4000/api/task/' + this.props.match.params.id, newTask)
            .then(function(response) { 
                alert("HTTP " + response.status + ": " + response.data.message);
            })
            .catch(function(error) {
                alert('HTTP ' + error.response.status + " error: " + error.response.data.message);
            });
        // https://dev.to/projectescape/programmatic-navigation-in-react-3p1l
        // redirect back to list task page
        this.props.history.push("/");
    }

    render() {
        return (
            <div className='edit-container'>
                <div className='edit-header'>
                    <EditHeader />
                </div>
                <EditForm 
                    name={this.state.name}
                    description={this.state.description}
                    priority={this.state.priority}
                    completed={this.state.completed}
                    onNameChange={this.handleNameChange}
                    onDescChange={this.handleDescChange}
                    onPriorityChange={this.handlePriorityChange}
                    onCompletedChange={this.handleCompletedChange}
                    onSubmit={this.handleSubmit}
                />
            </div>
        );
    }
}

function EditHeader() {
    return(
        <p>Edit Task</p>
    );
}

class EditForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handlePriorityChange = this.handlePriorityChange.bind(this);
        this.handleCompletedChange = this.handleCompletedChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleNameChange(event) {
        this.props.onNameChange(event.target.value);
    }

    handleDescChange(event) {
        this.props.onDescChange(event.target.value);
    }

    handlePriorityChange(event) {
        this.props.onPriorityChange(event.target.value);
    }

    handleCompletedChange(event) {
        this.props.onCompletedChange((!this.props.completed))
    }

    handleSubmit(event) {
        this.props.onSubmit(event);
    }

    render() {
        return(
            <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                    <label>Name:</label>
                    <Input 
                        placeholder="Enter Name..."
                        value={this.props.name}
                        onChange={this.handleNameChange}
                    />
                </Form.Field>

                <div className='form-input-line-break'></div>

                <Form.Field>
                    <label>Description:</label>
                    <TextArea
                        className='desc-input' 
                        placeholder="Enter Description..."
                        value={this.props.description}
                        onChange={this.handleDescChange}
                    />
                </Form.Field>
                
                <div className='form-line-break'></div>

                <Form.Group inline>
                    <label>Priority:</label>
                    <Form.Radio 
                        name="priorityOptions"
                        id="lowPriority"
                        value="low"
                        label="Low"
                        checked={this.props.priority==="low"}
                        onChange={this.handlePriorityChange}
                    />
                    <Form.Radio 
                        name="priorityOptions"
                        id="medPriority"
                        value="med"
                        label="Med"
                        checked={this.props.priority==="med"}
                        onChange={this.handlePriorityChange}
                    />
                    <Form.Radio 
                        name="priorityOptions"
                        id="highPriority"
                        value="high"
                        label="High"
                        checked={this.props.priority==="high"}
                        onChange={this.handlePriorityChange}
                    />
                </Form.Group>


                <Form.Field>
                    <Checkbox 
                        id='completedCheckbox'
                        name='completedCheckbox'
                        label='Task completed'
                        checked={this.props.completed}  
                        value={this.props.completed}
                        onChange={this.handleCompletedChange} 
                    />
                </Form.Field>

                <div className='form-line-break'></div>

                <Form.Button>Edit</Form.Button>
            </Form>
        )
    }
}

export default EditTask;

