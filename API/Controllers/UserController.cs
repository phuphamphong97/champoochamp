using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Business;
using Data.Entity;
using Data.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class UserController : ControllerBase
  {
    UserBusiness userBusiness = new UserBusiness();

    [Route("GetAllUsers")]
    public IEnumerable<User> GetAllUsers()
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          List<User> userList = db.User.Where(p => p.Status == true).ToList();
          return userBusiness.decryptPassword(userList);
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    [Route("GetUserByEmail-{userEmail}")]
    public User GetUserByEmail(string userEmail)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          return db.User.Where(p => String.Compare(p.Email, userEmail, false) == 0 && p.Status == true).SingleOrDefault();
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
    public User CheckLogin(User user)
    {
      return userBusiness.checkLogin(user);
    }

    [Route("Register")]
    [HttpPost]
    public int Register(User user)
    {
      return userBusiness.register(user);
    }

    [Route("ForgetPassword")]
    [HttpPost]
    public string ForgetPassword(User user)
    {
      return userBusiness.forgetPassword(user.Email, user.VerificationCode, user.Password);
    }

    [Route("SendVerificationCode-{email}")]
    [HttpGet]
    public int SendVerificationCode(string email)
    {
      return userBusiness.sendVerificationCode(email);
    }

    [Route("CreateUser")]
    [HttpPost]
    public User CreateUser(UserModel userModel)
    {
      return userBusiness.createUser(userModel);
    }

    [Route("PutUser")]
    [HttpPut]
    public User PutUser(UserModel userModel)
    {
      return userBusiness.putUser(userModel);
    }

    [Route("DeleteUserById")]
    [HttpDelete]
    public bool DeleteUserById(User user)
    {
      return userBusiness.deleteUserById(user);
    }

    [Route("DeleteUserByIds")]
    [HttpDelete]
    public bool DeleteUserByIds(UserModel userModel)
    {
      return userBusiness.deleteUserByIds(userModel);
    }
  }
}