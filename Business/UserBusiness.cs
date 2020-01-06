using Data.Entity;
using Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace Business
{
  public class UserBusiness
  {
    public User checkLogin(User u)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          string passwordMD5 = PasswordConverter.Encrypt(u.Password);
          User user = db.User.Where(p => String.Compare(p.Email, u.Email, false) == 0 && p.Password == passwordMD5 && p.Status == true).SingleOrDefault();
          if (user != null && !String.IsNullOrEmpty(u.ShoppingCarts))
          {
            if(String.IsNullOrEmpty(user.ShoppingCarts))
            {
              user.ShoppingCarts = u.ShoppingCarts;
            }
            else
            {
              user.ShoppingCarts += "," + u.ShoppingCarts;
            }

            db.SaveChanges();

            user.Password = u.Password;
          }
          return user;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public int register(User user)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          User u = db.User.Where(p => String.Compare(p.Email, user.Email, false) == 0 && p.Status == true).SingleOrDefault();
          if (u != null)
          {
            return 0;
          }          

          user.Password = PasswordConverter.Encrypt(user.Password);
          if (String.IsNullOrEmpty(user.Avatar))
          {
            user.Avatar = "default.png";
          }
          db.User.Add(user);

          db.SaveChanges();
          return 1;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return -1;
        }
      }
    }

    public string forgetPassword(string email, string verificationCode, string password)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          User user = db.User.Where(p => String.Compare(p.Email, email, false) == 0 && p.VerificationCode == verificationCode && p.Status == true).SingleOrDefault();
          if (user == null)
          {
            return null;
          }

          user.Password = PasswordConverter.Encrypt(password);
          user.VerificationCode = string.Empty;

          db.SaveChanges();
          return email;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public int sendVerificationCode(string email)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          User user = db.User.Where(p => String.Compare(p.Email, email, false) == 0 && p.Status == true).SingleOrDefault();
          if (user == null)
          {
            return 0;
          }

          user.VerificationCode = GetNewVerificationCode(new Random(), user.VerificationCode);
          if (!SendEmail(email, user.VerificationCode))
          {
            return -1;
          }

          db.SaveChanges();
          return 1;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return -1;
        }
      }
    }

    public string GetNewVerificationCode(Random rd, string verificationCode)
    {
      string code = rd.Next(100000, 999999).ToString();
      while (code == verificationCode)
      {
        code = rd.Next(100000, 999999).ToString();
      }

      return code;
    }

    public bool SendEmail(string email, string verificationCode)
    {
      try
      {
        // Credentials
        var credentials = new NetworkCredential("no.reply.guitarshop@gmail.com", "guitarshop.com");
        // Mail message
        var mail = new MailMessage()
        {
          From = new MailAddress("no.reply.guitarshop@gmail.com"),
          Subject = "Champoochamp gửi mã xác nhận",
          Body = "Mã xác nhận của bạn là: " + verificationCode
        };
        mail.IsBodyHtml = true;
        mail.To.Add(new MailAddress(email));
        // Smtp client
        var client = new SmtpClient()
        {
          Port = 587,
          DeliveryMethod = SmtpDeliveryMethod.Network,
          UseDefaultCredentials = false,
          Host = "smtp.gmail.com",
          EnableSsl = true,
          Credentials = credentials
        };
        client.Send(mail);
        return true;
      }
      catch (System.Exception e)
      {
        return false;
      }

    }

    public User createUser(UserModel userModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          string folderPath = "http://localhost:5000/assets/images/users";
          //Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location)
          User d = db.User.Where(p => String.Compare(p.Email, userModel.user.Email, false) == 0 && p.Status == true).SingleOrDefault();
          if (d != null)
          {
            return new User();
          }

          userModel.user.Password = PasswordConverter.Encrypt(userModel.user.Password);
          if (String.IsNullOrEmpty(userModel.user.Avatar))
          {
            userModel.user.Avatar = "default.png";
          }
          else
          {
            Services.SaveImage(folderPath, userModel.user.Avatar, userModel.imageUrl);
          }
          db.Add(userModel.user);

          db.SaveChanges();
          return userModel.user;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public User putUser(UserModel userModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          User d = db.User.Where(p => p.Id != userModel.user.Id && String.Compare(p.Email, userModel.user.Email, false) == 0 && p.Status == true).SingleOrDefault();
          if (d != null)
          {
            return new User();
          }

          User user = db.User.Find(userModel.user.Id);
          user.Name = userModel.user.Name;
          user.Email = userModel.user.Email;
          user.Password = PasswordConverter.Encrypt(userModel.user.Password);
          user.Phone = userModel.user.Phone;
          user.Address = userModel.user.Address;
          user.ModifiedDate = DateTime.Now;
          //user.ModifiedBy = userModel.employee.UserName;
          if (String.IsNullOrEmpty(userModel.user.Avatar))
          {
            user.Avatar = "default.png";
          }
          else
          {
            user.Avatar = userModel.user.Avatar;
          }

          db.SaveChanges();
          return user;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public bool deleteUserById(User d)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          User user = db.User.Find(d.Id);
          if (user == null)
          {
            return false;
          }
          user.Status = false;
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

    public bool deleteUserByIds(UserModel userModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          foreach (User d in userModel.userList)
          {
            User user = db.User.Find(d.Id);
            if (user == null)
            {
              return false;
            }

            user.Status = false;
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

    public List<User> decryptPassword(List<User> userList)
    {
      if (userList.Count() == 0)
      {
        return null;
      }

      foreach (User e in userList)
      {
        e.Password = PasswordConverter.Decrypt(e.Password);
      }

      return userList;
    }
  }
}
