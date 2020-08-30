import React from 'react';
import {
	BrowserRouter as Router, 
	Switch,
	Route
} from "react-router-dom";
import Header from "./components/SiteHeader/Header";
import CreateTask from "./components/CreateTask/CreateTask";
import EditTask from "./components/EditTask/EditTask";
import ListTasks from "./components/ListTasks/ListTasks";

// aggregated sources:
// https://reactjs.org/docs/thinking-in-react.html
// https://css-tricks.com/snippets/css/a-guide-to-flexbox/
// https://www.freecodecamp.org/forum/t/how-to-use-font-awesome-icons-in-react-js/266535/3
// https://reacttraining.com/react-router/web/guides/primary-components
// https://stackoverflow.com/questions/55829210/how-to-display-array-data-into-tables-in-reactjs
// https://dev.to/projectescape/programmatic-navigation-in-react-3p1l
// https://stackoverflow.com/questions/29859910/restrict-mongoose-field-values
// https://codingthesmartway.com/the-mern-stack-tutorial-building-a-react-crud-application-from-start-to-finish-part-1/
// https://stackoverflow.com/questions/50218489/reload-react-table-on-event
// https://react.semantic-ui.com/augmentation
// https://stackoverflow.com/questions/36418352/css-word-wrap-break-word-wont-work/36555643

function App() {
	return (
		<Router>
			<Header />
			<Switch>
				<Route path="/" exact component={ListTasks} />
				<Route path="/task/:id" component={EditTask} />
				<Route path="/create" component={CreateTask} />
			</Switch>
		</Router>
	);
}

export default App;
