using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Business;
using Data.Entity;
using Data.Model;
using Microsoft.AspNetCore.Hosting;
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

    private IHostingEnvironment _env;
    public EmployeeController(IHostingEnvironment env)
    {
      _env = env;
    }

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
    public Employee CreateEmployee(EmployeeModel employeeModel)
    {
      string webRoot = _env.ContentRootPath;
      webRoot = webRoot.Replace("API", "Champoochamp");
      string path = Path.Combine(webRoot, "ClientApp\\src\\assets\\images", employeeModel.folderName);

      return employeeBusiness.createEmployee(employeeModel, path);
    }

    [Route("PutEmployee")]
    [HttpPut]
    public Employee PutEmployee(EmployeeModel employeeModel)
    {
      string webRoot = _env.ContentRootPath;
      webRoot = webRoot.Replace("API", "Champoochamp");
      string path = Path.Combine(webRoot, "ClientApp\\src\\assets\\images", employeeModel.folderName);

      return employeeBusiness.putEmployee(employeeModel, path);
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