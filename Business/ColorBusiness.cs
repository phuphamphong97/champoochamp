using Data.Entity;
using Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Business
{
  public class ColorBusiness
  {
    public Color createColor(Color color)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Color s = db.Color.Where(p => String.Compare(p.Code, color.Code, false) == 0 && p.Status == true).SingleOrDefault();
          if (s != null)
          {
            return new Color();
          }

          db.Add(color);
          db.SaveChanges();
          return color;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public Color putColor(ColorModel colorModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Color d = db.Color.Where(p => p.Id != colorModel.color.Id && String.Compare(p.Code, colorModel.color.Code, false) == 0 && p.Status == true).SingleOrDefault();
          if (d != null)
          {
            return new Color();
          }

          Color color = db.Color.Find(colorModel.color.Id);
          color.Name = colorModel.color.Name;
          color.Code = colorModel.color.Code;
          color.ModifiedDate = DateTime.Now;
          color.ModifiedBy = colorModel.employee.UserName;

          db.SaveChanges();
          return color;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public bool deleteColorById(Color d)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Color color = db.Color.Find(d.Id);
          if (color == null)
          {
            return false;
          }
          color.Status = false;
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

    public bool deleteColorByIds(ColorModel colorModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          foreach (Color d in colorModel.colorList)
          {
            Color color = db.Color.Find(d.Id);
            if (color == null)
            {
              return false;
            }

            color.Status = false;
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
  }
}
