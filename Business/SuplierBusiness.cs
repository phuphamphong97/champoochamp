using Data.Entity;
using Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Business
{
  public class SuplierBusiness
  {
    public Suplier createSuplier(SuplierModel suplierModel, string path)
    {
      using (champoochampContext db = new champoochampContext())
      {
        using (var transaction = db.Database.BeginTransaction())
        {
          try
          {
            Suplier d = db.Suplier.Where(p => String.Compare(p.Name, suplierModel.suplier.Name, false) == 0 && p.Status == true).SingleOrDefault();
            if (d != null)
            {
              return new Suplier();
            }

            db.Add(suplierModel.suplier);
            db.SaveChanges();
            if (String.IsNullOrEmpty(suplierModel.thumbnailBase64))
            {
              suplierModel.suplier.Thumbnail = "default.png";
            }
            else
            {
              string imageType = suplierModel.thumbnailBase64.IndexOf("image/png") > 0 ? ".png" : ".jpg";
              string thumbnail = "Suplier_" + suplierModel.suplier.Id.ToString() + imageType;
              bool isSave = Services.SaveImage(path, thumbnail, suplierModel.thumbnailBase64);
              if (isSave)
              {
                suplierModel.suplier.Thumbnail = thumbnail;
              }
              else
              {
                transaction.Rollback();
                return null;
              }
            }

            db.SaveChanges();
            transaction.Commit();
            return suplierModel.suplier;
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

    public Suplier putSuplier(SuplierModel suplierModel, string path)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Suplier d = db.Suplier.Where(p => p.Id != suplierModel.suplier.Id && String.Compare(p.Name, suplierModel.suplier.Name, false) == 0 && p.Status == true).SingleOrDefault();
          if (d != null)
          {
            return new Suplier();
          }

          Suplier suplier = db.Suplier.Find(suplierModel.suplier.Id);
          suplier.Name = suplierModel.suplier.Name;
          suplier.Email = suplierModel.suplier.Email;
          suplier.Phone = suplierModel.suplier.Phone;
          suplier.Address = suplierModel.suplier.Address;
          suplier.ModifiedDate = DateTime.Now;
          suplier.ModifiedBy = suplierModel.employee.UserName;
          if (!String.IsNullOrEmpty(suplierModel.thumbnailBase64))
          {
            if (!Services.SaveImage(path, suplierModel.suplier.Thumbnail, suplierModel.thumbnailBase64))
            {
              return null;
            }
          }

          db.SaveChanges();
          return suplier;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public bool deleteSuplierById(Suplier d)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Suplier suplier = db.Suplier.Find(d.Id);
          if(suplier == null)
          {
            return false;
          }
          suplier.Status = false;
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

    public bool deleteSuplierByIds(SuplierModel suplierModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          foreach(Suplier d in suplierModel.suplierList)
          {
            Suplier suplier = db.Suplier.Find(d.Id);
            if (suplier == null)
            {
              return false;
            }

            suplier.Status = false;
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
