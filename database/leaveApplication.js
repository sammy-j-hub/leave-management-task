const mysql = require('mysql');
var config = require('./config');
var connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.User,
    password: process.env.Password,
    database: process.env.Database
});

async function leaveApplication(formData) {
    console.log(formData)
    return new Promise((resolve, reject) => {
        try {
            
            // connection.input('firstName', mysql.VarChar, formData.form_name);
            // connection.input('department', mysql.VarChar, formData.form_department);
            // connection.input('reason', mysql.VarChar, formData.form_reason);
            // connection.input('startDate', mysql.Date, formData.form_name);
            var post = { 
                name : formData.form_name, 
                department : formData.form_department, 
                reason : formData.form_reason, 
                startDate: formData.form_startDate
            };

            connection.query('INSERT INTO leave_application SET ?', post,function (error, recordset) {
                if (error) {
                    console.error(error);
                    reject(errorMessage)
                }
                else {
                    resolve(recordset.recordset);
                }
            });
        } catch (error) {
            console.error(error);
            reject(errorMessage)
        }
    })
        
}

module.exports.leaveApplication = leaveApplication;