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

//USERS INPUT TO SELECT WHAT THEY WOULD LIKE TO DO IN THE DATABASE
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
// VIEW ALL DEPARTMENTs, ROLES, AND EMPLOYEES AVAILABLE IN THE DATABASE
    const viewAllDepartments= () => {
        db.query('select * from department', (err, response) => {
            if (err) {console.log('error')} 
            console.table(response);
            startTracker()
        })
    }
    const viewAllRoles= () => {
        // db.query('select * from roles', (err, response) => {
            db.query('select roles.title AS `Type of Role`,roles.salary AS `Salary`,department.name AS Department FROM roles INNER JOIN department ON roles.department_id = department.id;', (err, response) => {
            if (err) {console.log('error')} 
            console.table(response);
            startTracker()
        })
    }
    const viewAllEmployees= () => {
        db.query('SELECT employees.id,employees.first_name, employees.last_name, department.name AS Department,roles.title ,roles.salary AS `Employee Salary`,manager.first_name AS Manager from employees  INNER JOIN roles ON employees.role_id = roles.id INNER JOIN department ON roles.department_id = department.id  LEFT JOIN employees AS Manager ON employees.manager_id = manager.id', (err, response) => {
            if (err) {console.log('error')} 
            console.table(response);
            startTracker()
        })
    }

// ADD A ROLE INTO THE DATABASE
    const addRole= () => {
        db.query('select * from department', (err, response) => {
            if (err) {console.log('error')} 
            const departmentData = response.map((department) => 
            ({ name:department.name, value:department.id   })
            )

    inquirer.prompt([
            {
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
                choices: departmentData,
      }]).then(response => {
        var newRole = response.title;
        var newSalary = response.salary;
        var newDepartment = response.department;
        // console.log(newRole)
        db.query('insert into roles (title, salary, department_id) values (?,?,?)', [newRole, newSalary, newDepartment])
        console.log(`${newRole} role is added.`)
      })
    })
    }

// ADD AN EMPLOYEE TO THE DATABASE
const addEmployee = () => {
    db.query(
      'SELECT employees.*, roles.title AS role_name, manager.first_name AS manager_name FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN employees AS manager ON employees.manager_id = manager.id;',
      (err, response) => {
        if (err) {
          console.log('error');
          return;
        }
        const managerName = response.map((manager) => ({
          name: manager.first_name + ' ' + manager.last_name,
          value: manager.id,
        }));
        db.query('SELECT * FROM roles', (err, response) => {
          if (err) {
            console.log('error');
            return;
          }
          const roleData = response.map((role) => ({
            name: role.title,
            value: role.id,
          }));
          const departmentData = response.map((department) => ({
            name: department.name,
            value: department.id,
          }));
          inquirer
            .prompt([
              {
                
                name: 'firstName',
                type: 'input',
                message: "What is the employee's first name?",
              },
              {
                name: 'lastName',
                type: 'input',
                message: "What is the employee's last name?",
              },
              {
                name: 'manager',
                type: 'list',
                message: 'Who is their manager?',
                choices: managerName,
              },
              {
                name: 'role',
                type: 'list',
                message: "What is the employee's role?",
                choices: roleData,
              },
              {
                name: 'department',
                type: 'list',
                message: 'What is their department?',
                choices: departmentData,
              }
            ])
            .then((response) => {
              db.query(
                'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
                [
                  response.firstName,
                  response.lastName,
                  response.role,
                  response.manager,
                ],
                (err, response) => {
                  if (err) {
                    console.log('error');
                    return;
                  }
                  
                }
              );
                console.log(`${response.firstName} ${response.lastName} is added.`);
            });
        });
      }
    );
  };

//ADD A DEPARTMENT TO THE DATABASE
const addDepartment= () => {
    // db.query('select * from department', (err, response) => {
    //     if (err) {console.log('error')} 
    //     const departmentData = response.map((department) => 
    //     ({ name:department.name, value:department.id   })
    //     )

inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the department you would like to add?",
        },
  ]).then(response => {
    var newDepartment = response.name;
    db.query('insert into department (name) values (?)', [newDepartment])
    console.log(`${newDepartment} department is added.`)
  })
// })
}

// UPDATE AN EMPLOYEES INFORMATION IN THE DATABASE
const updateEmployeeRole = () => {
    db.query('select * from employees', (err, response) => {
        if (err) {console.log('error')} 
          const employeeData = response.map((employee) => 
          ({ name:employee.first_name + ' ' + employee.last_name, value:employee.id}))
          db.query('SELECT * FROM roles', (err, response) => {
            if (err) {
              console.log('error');
              return;
            }
            const roleData = response.map((role) => ({
              name: role.title,
              value: role.id,
            }));
        inquirer
        .prompt ([{
            name: "employees",
            type: "list",
            message: "Select the employee to update:",
            choices: employeeData,
          },
          {
            name: "role",
            type: "list",
            message: "Select the role to update:",
            choices: roleData,
          }]).then((response) => {
            const updateRole = response.role; 
            const updateEmployee = response.employees;
            db.query(`Update employees set role_id = ? where id = ? ;`, [updateRole, updateEmployee], (error) => {
                if (err) console.log(error);
            })
            console.log (`Role has been updated`)
            startTracker()
          })
    })})

}

// app.listen(PORT, () => {
//     console.log(`SERVER RUNNING ON POST ${PORT}`)
// });
