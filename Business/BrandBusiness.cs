using Data.Entity;
using Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Business
{
  public class BrandBusiness
  {
    public Brand createBrand(BrandModel brandModel, string path)
    {
      using (champoochampContext db = new champoochampContext())
      {
        using (var transaction = db.Database.BeginTransaction())
        {
          try
          {
            Brand d = db.Brand.Where(p => String.Compare(p.Name, brandModel.brand.Name, false) == 0 && p.Status == true).SingleOrDefault();
            if (d != null)
            {
              return new Brand();
            }

            db.Add(brandModel.brand);
            db.SaveChanges();
            if (String.IsNullOrEmpty(brandModel.thumbnailBase64))
            {
              brandModel.brand.Thumbnail = "default.png";
            }
            else
            {
              string imageType = brandModel.thumbnailBase64.IndexOf("image/png") > 0 ? ".png" : ".jpg";
              string thumbnail = "Brand_" + brandModel.brand.Id.ToString() + imageType;
              bool isSave = Services.SaveImage(path, thumbnail, brandModel.thumbnailBase64);
              if (isSave)
              {
                brandModel.brand.Thumbnail = thumbnail;
              }
              else
              {
                transaction.Rollback();
                return null;
              }
            }

            db.SaveChanges();
            transaction.Commit();
            return brandModel.brand;
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

    public Brand putBrand(BrandModel brandModel, string path)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Brand d = db.Brand.Where(p => p.Id != brandModel.brand.Id && String.Compare(p.Name, brandModel.brand.Name, false) == 0 && p.Status == true).SingleOrDefault();
          if (d != null)
          {
            return new Brand();
          }

          Brand brand = db.Brand.Find(brandModel.brand.Id);
          brand.Name = brandModel.brand.Name;
          brand.Country = brandModel.brand.Country;
          brand.ModifiedDate = DateTime.Now;
          brand.ModifiedBy = brandModel.employee.UserName;
          if (!String.IsNullOrEmpty(brandModel.thumbnailBase64))
          {
            if (!Services.SaveImage(path, brandModel.brand.Thumbnail, brandModel.thumbnailBase64))
            {
              return null;
            }
          }

          db.SaveChanges();
          return brand;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public bool deleteBrandById(Brand d)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Brand brand = db.Brand.Find(d.Id);
          if(brand == null)
          {
            return false;
          }
          brand.Status = false;
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

    public bool deleteBrandByIds(BrandModel brandModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          foreach(Brand d in brandModel.brandList)
          {
            Brand brand = db.Brand.Find(d.Id);
            if (brand == null)
            {
              return false;
            }

            brand.Status = false;
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
