using Data.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Model
{
  public class EmployeeModel
  {
    public Employee employeeLogin { get; set; }
    public Employee employee { get; set; }
    public string imageUrl { get; set; }
    public List<Employee> employeeList { get; set; }

    public EmployeeModel()
    {
      employeeList = new List<Employee>();
    }

    public EmployeeModel(Employee employeeLogin, Employee employee, string imageUrl, List<Employee> employeeList)
    {
      this.employeeLogin = employeeLogin;
      this.employee = employee;
      this.imageUrl = imageUrl;
      this.employeeList = employeeList;
    }
  }
}
