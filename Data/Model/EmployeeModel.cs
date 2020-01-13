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
    public string thumbnailBase64 { get; set; }
    public string folderName { get; set; }
    public List<Employee> employeeList { get; set; }

    public EmployeeModel()
    {
      employeeList = new List<Employee>();
    }

    public EmployeeModel(Employee employeeLogin, Employee employee, string thumbnailBase64, string folderName, List<Employee> employeeList)
    {
      this.employeeLogin = employeeLogin;
      this.employee = employee;
      this.thumbnailBase64 = thumbnailBase64;
      this.folderName = folderName;
      this.employeeList = employeeList;
    }
  }
}
