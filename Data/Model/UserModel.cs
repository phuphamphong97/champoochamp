﻿using Data.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Model
{
  public class UserModel
  {
    public Employee employee { get; set; }
    public User user { get; set; }
    public string thumbnailBase64 { get; set; }
    public string folderName { get; set; }
    public List<User> userList { get; set; }

    public UserModel()
    {
      userList = new List<User>();
    }

    public UserModel(Employee employee, User user, string thumbnailBase64, string folderName, List<User> userList)
    {
      this.employee = employee;
      this.user = user;
      this.thumbnailBase64 = thumbnailBase64;
      this.folderName = folderName;
      this.userList = userList;
    }
  }
}
