﻿using Data.Entity;
using Data.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;

namespace Business
{
  public class EmployeeBusiness
  {
    public Employee checkLogin(string username, string password)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          password = PasswordConverter.Encrypt(password);
          Employee employee = db.Employee.Where(p => String.Compare(p.UserName, username, false) == 0 && p.Password == password && p.Status == true).SingleOrDefault();
          return employee;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public Employee createEmployee(EmployeeModel employeeModel, string path)
    {
      using (champoochampContext db = new champoochampContext())
      {
        using (var transaction = db.Database.BeginTransaction())
        {
          try
          {
            Employee d = db.Employee.Where(p => String.Compare(p.UserName, employeeModel.employee.UserName, false) == 0 && p.Status == true).SingleOrDefault();
            if (d != null)
            {
              return new Employee();
            }

            employeeModel.employee.Password = PasswordConverter.Encrypt(employeeModel.employee.Password);
            db.Add(employeeModel.employee);
            db.SaveChanges();
            if (String.IsNullOrEmpty(employeeModel.thumbnailBase64))
            {
              employeeModel.employee.Thumbnail = "default.png";
            }
            else
            {
              string imageType = employeeModel.thumbnailBase64.IndexOf("image/png") > 0 ? ".png" : ".jpg";
              string thumbnail = "Employee_" + employeeModel.employee.Id.ToString() + imageType;
              bool isSave = Services.SaveImage(path, thumbnail, employeeModel.thumbnailBase64);
              if (isSave)
              {
                employeeModel.employee.Thumbnail = thumbnail;
              }
              else
              {
                transaction.Rollback();
                return null;
              }
            }

            db.SaveChanges();
            transaction.Commit();
            return employeeModel.employee;
          }
          catch (Exception e)
          {
            Console.WriteLine(e.Message);
            transaction.Rollback();
            return null;
          }
        }        
      }
    }

    public Employee putEmployee(EmployeeModel employeeModel, string path)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Employee d = db.Employee.Where(p => p.Id != employeeModel.employee.Id && String.Compare(p.UserName, employeeModel.employee.UserName, false) == 0 && p.Status == true).SingleOrDefault();
          if (d != null)
          {
            return new Employee();
          }

          Employee employee = db.Employee.Find(employeeModel.employee.Id);
          employee.Name = employeeModel.employee.Name;
          employee.UserName = employeeModel.employee.UserName;
          employee.Password = PasswordConverter.Encrypt(employeeModel.employee.Password);
          employee.Phone = employeeModel.employee.Phone;
          employee.Address = employeeModel.employee.Address;
          employee.ModifiedDate = DateTime.Now;
          employee.ModifiedBy = employeeModel.employeeLogin.UserName;
          if (!String.IsNullOrEmpty(employeeModel.thumbnailBase64))
          {
            if (!Services.SaveImage(path, employeeModel.employee.Thumbnail, employeeModel.thumbnailBase64))
            {
              return null;
            }
          }

          db.SaveChanges();
          return employee;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public bool deleteEmployeeById(Employee d)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Employee employee = db.Employee.Find(d.Id);
          if (employee == null)
          {
            return false;
          }
          employee.Status = false;
          db.SaveChanges();
          return true;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return false;
        }
      }
    }

    public bool deleteEmployeeByIds(EmployeeModel employeeModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          foreach (Employee d in employeeModel.employeeList)
          {
            Employee employee = db.Employee.Find(d.Id);
            if (employee == null)
            {
              return false;
            }

            employee.Status = false;
          }

          db.SaveChanges();
          return true;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return false;
        }
      }
    }

    public List<Employee> decryptPassword(List<Employee> employeeList)
    {
      if (employeeList.Count() == 0)
      {
        return null;
      }

      foreach (Employee e in employeeList)
      {
        e.Password = PasswordConverter.Decrypt(e.Password);
      }

      return employeeList;
    }
  }
}
