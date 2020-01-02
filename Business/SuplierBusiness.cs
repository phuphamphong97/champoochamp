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
    public Suplier createSuplier(Suplier suplier)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {      
          db.Add(suplier);
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

    public Suplier putSuplier(SuplierModel suplierModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Suplier suplier = db.Suplier.Find(suplierModel.suplier.Id);
          suplier.Name = suplierModel.suplier.Name;
          suplier.Email = suplierModel.suplier.Email;
          suplier.Phone = suplierModel.suplier.Phone;
          suplier.Address = suplierModel.suplier.Address;
          suplier.Note = suplierModel.suplier.Note;
          suplier.ModifiedDate = DateTime.Now;
          suplier.ModifiedBy = suplierModel.employee.Name;

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
