# To start:
* Clone the project from https://gitlab.com/carlguo2/mp4
* navigate to the newly cloned project.
* The database is held in MongoAtlas again. I have put my credentials in /backend/config/secrets.js
  *  **(This database has been deleted!)**
* The MongoAtlas db should be open all IP addresses.
* The server settings is in /backend/server.js
* The backend of the application is held in a subdirectory called /backend

# To start the backend:
* on your terminal run "cd backend" to navigate into the backend part of the application.
* run "npm install" to install backend dependencies
* install nodemon globally: "npm install -g nodemon"
* run "npm start" on ./mp4/backend 

# To start the frontend
* open another terminal and navigate to mp4 project path
* run "npm install"
* run "npm start" on ./mp4 (to run on chrome: "browser=chrome npm start")

# About the backend:
* Task schema is: 
    {
        name: (string) required, 
        description: (string), 
        priority: (string in ["low", "med", "high"]) required, 
        completed: (bool)
    }
* name and priority are required fields
* mongoose will return on success either 200 or 201
* mongoose will return 400, 404, or 500 on error
* To see more, look into /backend/models/task.js

# Navigating the website: 
* To create a new task, click on "Create Task" in header or navigate to "/create" route.
    * This sends a POST request to the backend at "/api/task".
* "name" and "priority" are required fields. 
    * An error message will pop up if form is not filled properly.
* To see task list, click on "List Tasks" in header or navigate to "/" route. 
    * This sends a normal GET request to the backend at "/api/task".
* Priority field has 4 cases: 
    * light green circle outline - low priority
    * yellow circle outline - med priority
    * red circle outline - high priority
    * green check mark - task completed
* In task list, can have option to edit tasks. Form will be similar to one in create tasks.
    * In edit page, a GET request is send to "/api/task/:id" on component mount. 
    * When edit submitted, a PUT request is sent to "/api/task/:id".
    * If a task is complete it will not be possible to edit it.
    * After editting, a javascript alert is sent informing user if task edited successfully or if there was an error. User will be redirected to task list.
* Task list also has option to delete the task as well. 
    * This will send a DELETE request to the backend at "/api/task/:id"
* Below table there are options to filter by completed and priority fields. It is possible to filter by both.

# In case of application not working:
* Contact me at carlguo2@illinois.edu