using Data.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Model
{
  public class UserModel
  {
    public Employee employee { get; set; }
    public User user { get; set; }
    public string imageUrl { get; set; }
    public List<User> userList { get; set; }

    public UserModel()
    {
      userList = new List<User>();
    }

    public UserModel(Employee employee, User user, string imageUrl, List<User> userList)
    {
      this.employee = employee;
      this.user = user;
      this.imageUrl = imageUrl;
      this.userList = userList;
    }
  }
}
