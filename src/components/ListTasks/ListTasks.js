import React from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, Dropdown, Icon, Button, Modal } from 'semantic-ui-react';
import './ListTasks.scss'

class ListTasks extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            filterComplete: 0,
            filterPriority: 0,
            tasks: [] 
        };
        this.handleFilterComplete = this.handleFilterComplete.bind(this);
        this.handleFilterPriority = this.handleFilterPriority.bind(this);
        this.handleFilterAll = this.handleFilterAll.bind(this)
        this.handleReloadAfterDelete = this.handleReloadAfterDelete.bind(this);
    }

    // get a list of the tasks at component beginning mount
    componentDidMount() {
        axios.get('http://localhost:4000/api/task/')
            .then((response) => {
                // get the array data field (hence response.data.data)
                this.setState({ tasks: response.data.data })
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    async handleReloadAfterDelete() {
        // reload the tasks array after task deleted
        // make sure to keep filters saved
        this.handleFilterAll(this.state.filterComplete, this.state.filterPriority);
    }

    // check if filter by task complete or not
    // 0: no filter, 1: filter incomplete, 2: filter complete
    handleFilterComplete(filterCode) {
        this.handleFilterAll(filterCode, this.state.filterPriority);
    }

    // check if filter by task priority or not
    // 0: no filter, 1: filter low, 2: filter med, 3: filter high
    handleFilterPriority(filterCode) {
        this.handleFilterAll(this.state.filterComplete, filterCode);
    }

    async handleFilterAll(filterCompleteCode, filterPriorityCode) {
        // filter complete additions to GET url
        var filterCompAdd = "";
        if (filterCompleteCode === 1) {
            filterCompAdd = '"completed": false';
        } else if (filterCompleteCode === 2) {
            filterCompAdd = '"completed": true';
        }
        // filter priority additions to GET url
        var filterPriorAdd = "";
        if (filterPriorityCode === 1) {
            filterPriorAdd = '"priority": "low"';
        } else if (filterPriorityCode === 2) {
            filterPriorAdd = '"priority": "med"';
        } else if (filterPriorityCode === 3) {
            filterPriorAdd = '"priority": "high"';
        }
        // construct filter 
        var filterAdd = ""
        if (filterPriorAdd !== "" && filterCompAdd !== "") {
            filterAdd = "where={" + filterPriorAdd + "," + filterCompAdd + "}";
        } else if (filterPriorAdd !== "") {
            filterAdd = "where={" + filterPriorAdd + "}";
        } else if (filterCompAdd !== "") {
            filterAdd = "where={" + filterCompAdd + "}";
        }
        // call axios with the constraint
        await axios.get('http://localhost:4000/api/task?' + filterAdd)
        .then((response) => {
            this.setState({ 
                filterComplete: filterCompleteCode,
                filterPriority: filterPriorityCode,
                tasks: response.data.data 
            });
        })
        .catch(function(error) {
            console.log(error);
        });
    }

    render() {
        return (
            <div className="list-container">
                <ListHeader />
                <TaskTable 
                    taskList={this.state.tasks}
                    onReloadAfterDelete={this.handleReloadAfterDelete}
                />
                <ListFilters 
                    filterComplete={this.state.filterComplete}
                    filterPriority={this.state.filterPriority}
                    onFilterComplete={this.handleFilterComplete}
                    onFilterPriority={this.handleFilterPriority}
                />
            </div>
        );
    }
}

function ListHeader() {
    return(
        <h2 className="list-header">List Tasks</h2>
    )
}

// Render the Task table here
class TaskTable extends React.Component {
    // https://stackoverflow.com/questions/55829210/how-to-display-array-data-into-tables-in-reactjs
    render() {
        return (
            <Table celled className='task-table'>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Priority</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell>Edit</Table.HeaderCell>
                        <Table.HeaderCell>Delete</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    { 
                        this.props.taskList.map((currTask, index) => {
                            return  <Task tdata={currTask}
                                        onReloadAfterDelete={this.props.onReloadAfterDelete} 
                                        key={index} 
                                    />
                        })
                    }
                </Table.Body>
            </Table>
        );
    }
}

// render the individual task table rows
class Task extends React.Component {
    constructor(props) {
        super(props)
        // state to open modal
        this.state = {
            openModal: false
        }
        // bind function to change open variable
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }

    handleOpenModal() {
        this.setState({ openModal: true });
    }

    handleCloseModal() {
        this.setState({ openModal: false })
    }

    render() {
        var action = "Task already completed";
        // if task not completed 
        if (!this.props.tdata.completed) {
            action = <Button as={Link} color='grey' to={'/task/' + this.props.tdata._id}>Edit</Button>;
        }
        var btnColor = "";
        if (this.props.tdata.priority === "low") {
            btnColor = "olive";
        } else if (this.props.tdata.priority === "med") {
            btnColor = "yellow";
        } else {
            btnColor = "red";
        }
        // color of circle outline based on priority
        var taskIcon = <Icon name='circle outline' color={btnColor} />
        // replace priority icon with green check mark if completed
        if (this.props.tdata.completed) {
            taskIcon = <Icon name='check circle' color='green' />
        }
        return (
            <>
                <Table.Row className="tdata-row">  
                    <Table.Cell className="priority-cell">{ taskIcon }</Table.Cell>
                    <Table.Cell className='name-cell'>{ this.props.tdata.name }</Table.Cell>
                    <Table.Cell className='desc-cell' width={10 }>{ this.props.tdata.description }</Table.Cell>
                    <Table.Cell className='edit-cell'>{ action }</Table.Cell>
                    <Table.Cell className='delete-cell'>
                        {   <Button 
                                negative 
                                onClick={this.handleOpenModal} 
                                content='Delete'
                            />
                        }
                    </Table.Cell>
                </Table.Row>

                <DeleteModal 
                    isOpen={this.state.openModal} 
                    closeModal={this.handleCloseModal}
                    taskId={this.props.tdata._id}
                    onReloadAfterDelete={this.props.onReloadAfterDelete}
                />
            </>
        );
    }
}

class DeleteModal extends React.Component {
    constructor(props) {
        super(props);
        this.deleteTask = this.deleteTask.bind(this);
    }

    async deleteTask(event) {
        // make REST DELETE call on specific task
        await axios.delete('http://localhost:4000/api/task/' + this.props.taskId)
            .then(function(response) { 
                console.log("HTTP " + response.status + ": " + response.data.message);
            })
            .catch(function(error) {
                console.log('Something went wrong: ' + error);
            });
        // close the modal
        this.props.closeModal();
        // reload the tasks array
        this.props.onReloadAfterDelete();
    }

    render() {
        return(
            <Modal size='small' open={this.props.isOpen} onClose={this.props.closeModal}>
                <Modal.Header>Delete Task</Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete this task?</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button 
                        basic 
                        color='green'
                        onClick={this.props.closeModal}
                        content='No' 
                    />
                    <Button 
                        basic
                        color='red'
                        icon='checkmark'
                        labelPosition='right'
                        content='Yes'
                        onClick={this.deleteTask}
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

// render the filter dropdowns
class ListFilters extends React.Component {
    constructor(props) {
        super(props);
        this.handleFilterComplete = this.handleFilterComplete.bind(this);
        this.handleFilterPriority = this.handleFilterPriority.bind(this);
    }

    handleFilterComplete(event, data) {
        this.props.onFilterComplete(data.value);
    }

    handleFilterPriority(event, data) {
        this.props.onFilterPriority(data.value);
    }

    render() {
        return(
            <span className="filter-container">
                <span className="drop-container">
                    <label className="drop-label">Filter Complete: </label>
                    <Dropdown 
                        selection
                        value={this.props.filterComplete}
                        onChange={this.handleFilterComplete}
                        options={[{key:0, text:'None', value:0}, 
                                {key:1, text:'Incomplete', value:1},
                                {key:2, text:'Complete', value:2}]}
                        className="filter-drop"
                    />
                </span>
                <span className="drop-container">
                    <label className="drop-label">Filter Priority: </label>
                    <Dropdown 
                        selection
                        value={this.props.filterPriority}
                        onChange={this.handleFilterPriority}
                        options={[{key:0, text:'None', value:0}, 
                                {key:1, text:'Low', value:1},
                                {key:2, text:'Med', value:2},
                                {key:3, text:'High', value:3}]}
                        className="filter-drop"
                    />
                </span>
            </span>
        )
    }
}

export default ListTasks;

