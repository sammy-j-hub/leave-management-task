const sql = require('mssql')

async function getEmployeeDetails(employeeID) {
    return new Promise((resolve, reject) => {
        try {
            var request = new sql.Request();
            request.input('employeeID', sql.VarChar, employeeID);
            request.query(`SELECT [EmployeeID]
                ,[FirstName]
                ,[LastName]
                ,[MobileNumber]
                ,[Email]
                ,[CompanyDepartment]
                FROM company_db. Employee_Information `,
                function (error, result) {
                if (error) {
                    console.error(error);
                    reject(errorMessage)
                }
                else {
                    resolve(result);
                }
            });
        } catch (error) {
            console.error(error);
            reject(errorMessage)
        }
    })

}
module.exports = { getEmployeeDetails }