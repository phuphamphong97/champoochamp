using Data.Entity;
using Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Business
{
  public class SizeBusiness
  {
    public Size createSize(Size size)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Size s = db.Size.Where(p => String.Compare(p.Name, size.Name, false) == 0 && p.Status == true).SingleOrDefault();
          if (s != null)
          {
            return new Size();
          }

          db.Add(size);
          db.SaveChanges();
          return size;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public Size putSize(SizeModel sizeModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Size d = db.Size.Where(p => p.Id != sizeModel.size.Id && String.Compare(p.Name, sizeModel.size.Name, false) == 0 && p.Status == true).SingleOrDefault();
          if (d != null)
          {
            return new Size();
          }

          Size size = db.Size.Find(sizeModel.size.Id);
          size.Name = sizeModel.size.Name;
          size.ModifiedDate = DateTime.Now;
          size.ModifiedBy = sizeModel.employee.UserName;

          db.SaveChanges();
          return size;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public bool deleteSizeById(Size d)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Size size = db.Size.Find(d.Id);
          if (size == null)
          {
            return false;
          }
          size.Status = false;
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

    public bool deleteSizeByIds(SizeModel sizeModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          foreach (Size d in sizeModel.sizeList)
          {
            Size size = db.Size.Find(d.Id);
            if (size == null)
            {
              return false;
            }

            size.Status = false;
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
