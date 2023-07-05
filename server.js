// MODULE PACKAGES
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const { response } = require('express');
// import inquirer from 'inquirer';
const PORT = 3001; 

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

// CONNECT OT THE LOCAL DATABASE
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Sagenthave07',
        database:  'tracker_db'
    },
    console.log(`Connect to the tracker_db`)
)

// START TRACKER
function startTracker() {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "Exit",
        ],
      })

    //USERS INPUT
    .then((answer) => {
        switch (answer.action) {
          case "View all departments":
            viewAllDepartments();
            break;
          case "View all roles":
            viewAllRoles();
            break;
          case "View all employees":
            viewAllEmployees();
            break;
          case "Add a department":
            addDepartment();
            break;
          case "Add a role":
            addRole();
            break;
          case "Add an employee":
            addEmployee();
            break;
          case "Update an employee role":
            updateEmployeeRole();
            break;
          case "Exit":
            connection.end();
            break;
        }
      });

    }
    startTracker()

    const viewAllDepartments= () => {
        db.query('select * from department', (err, response) => {
            if (err) {console.log('error')} 
            console.table(response);
            startTracker()
        })
    }
    const viewAllRoles= () => {
        db.query('select * from roles', (err, response) => {
            if (err) {console.log('error')} 
            console.table(response);
            startTracker()
        })
    }
    const viewAllEmployees= () => {
        db.query('select * from employees', (err, response) => {
            if (err) {console.log('error')} 
            console.table(response);
            startTracker()
        })
    }


    const addRole= () => {
        db.query('select * from roles', (err, response) => {
            if (err) {console.log('error')} 
    const departmentData = response.map((department) => ({
        name:department.name, value:department.id
    }))
        //     console.table(response);
        //     startTracker()
    inquirer
    .prompt({
      name: "title",
      type: "input",
      message: "What is the role you would like to add?",
    }, {
        name: "salary",
        type: "input",
        message: "What is the salary of the new role?",
      },{
        name: "department",
        type: "list",
        message: "What is the department?",
        choices: departmentData
      }).then(response => {
        var newRole = response.title;
        var newSalary = response.salary;
        var newDepartment = response.department;
        // console.log(newRole)
        db.query('insert into roles (title, salary, department_id) values (?,?,?)', [])
      })
    })
    }

// app.listen(PORT, () => {
//     console.log(`SERVER RUNNING ON POST ${PORT}`)
// });
