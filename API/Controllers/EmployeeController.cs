using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Business;
using Data.Entity;
using Data.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class EmployeeController : ControllerBase
  {
    EmployeeBusiness employeeBusiness = new EmployeeBusiness();

    [Route("GetAllEmployees")]
    public IEnumerable<Employee> GetAllEmployees()
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          List<Employee> employeeList = db.Employee.Where(p => p.Status == true).ToList();
          return employeeBusiness.decryptPassword(employeeList);
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    [Route("CheckLogin")]
    [HttpPost]
    public Employee CheckLogin(Employee e)
    {
      return employeeBusiness.checkLogin(e.UserName, e.Password);      
    }

    [Route("CreateEmployee")]
    [HttpPost]
    public Employee CreateEmployee(Employee employee)
    {
      return employeeBusiness.createEmployee(employee);
    }

    [Route("PutEmployee")]
    [HttpPut]
    public Employee PutEmployee(EmployeeModel employeeModel)
    {
      return employeeBusiness.putEmployee(employeeModel);
    }

    [Route("DeleteEmployeeById")]
    [HttpDelete]
    public bool DeleteEmployeeById(Employee employee)
    {
      return employeeBusiness.deleteEmployeeById(employee);
    }

    [Route("DeleteEmployeeByIds")]
    [HttpDelete]
    public bool DeleteEmployeeByIds(EmployeeModel employeeModel)
    {
      return employeeBusiness.deleteEmployeeByIds(employeeModel);
    }
  }
}