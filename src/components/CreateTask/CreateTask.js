import React from "react";
import './CreateTask.scss'
import { Form, Input, Message, TextArea } from 'semantic-ui-react';
import axios from 'axios';

class CreateTask extends React.Component {
    constructor(props) {
        super(props);
        // bind change state methods to object
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handlePriorityChange = this.handlePriorityChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            // task fields
            name: '',
            description: '',
            priority: 'low',
            completed: false,
            // error and success indicator
            result: ''
        }
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

    handleSubmit(event) {
        // get rid of default behavior
        event.preventDefault();
        // use axios to POST the task
        const newTask = {
            name: this.state.name,
            description: this.state.description,
            priority: this.state.priority,
            completed: this.state.completed
        }
        axios.post('http://localhost:4000/api/task', newTask)
            .then((response) => { 
                console.log("HTTP " + response.status + ": " + response.data.message);
                this.setState({ result: 'positive' });
            })
            .catch((error) => {
                console.log('HTTP ' + error.response.status + " error: " + error.response.data.message);
                this.setState({ result: 'negative' });
            });
            // reset the state on submit
            this.setState({
                name: '',
                description: '',
                priority: 'low',
                completed: false
            });
    }

    render() {
        return (
            <div className='create-container'>
                <div className='create-header'>
                    <CreateHeader />
                </div>
                <CreateForm 
                    name={this.state.name}
                    description={this.state.description}
                    priority={this.state.priority}
                    result={this.state.result}
                    onNameChange={this.handleNameChange}
                    onDescChange={this.handleDescChange}
                    onPriorityChange={this.handlePriorityChange}
                    onSubmit={this.handleSubmit}
                />
            </div>
        );
    }
}

function CreateHeader() {
    return (
        <p>
            Create Task
        </p>
    );
}

class CreateForm extends React.Component {
    constructor(props) {
        super(props);
        // state to either hide or show Message response
        this.state = { hidden: true };

        // methods that handle state changes in Parent component
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleDescChange = this.handleDescChange.bind(this);
        this.handlePriorityChange = this.handlePriorityChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // method to handle hide or show Message
        this.handleShowMessage = this.handleShowMessage.bind(this);
        this.handleHideMessage = this.handleHideMessage.bind(this);
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

    handleSubmit(event) {
        this.props.onSubmit(event);
        this.handleShowMessage();
    }

    handleHideMessage() {
        this.setState({hidden: true})
    }

    handleShowMessage() {
        this.setState({hidden: false})
    }

    render() {
        var messageHeader = "";
        var messageContent = "";
        // construct message depending on if failed or succeeded
        if (this.props.result === 'positive') {
            messageHeader = "Success";
            messageContent = "Your task has been successfully created.";
        } else if (this.props.result === 'negative') {
            messageHeader = "Error";
            messageContent = "Your task failed to be created. If you haven't, make sure to set the task name."
        }
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

                <div className='form-line-break'></div>
                <Message 
                    onDismiss={this.handleHideMessage} 
                    hidden={this.state.hidden}
                    positive={this.props.result === 'positive'}
                    negative={this.props.result === 'negative'}
                    header={messageHeader}
                    content={messageContent}
                />
                <div className='form-line-break'></div>

                <Form.Button>Create</Form.Button>
            </Form>
        )
    }
}

export default CreateTask;

