using Data.Entity;
using Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Business
{
  public class MaterialBusiness
  {
    public Material createMaterial(Material material)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Material s = db.Material.Where(p => String.Compare(p.Name, material.Name, false) == 0 && p.Status == true).SingleOrDefault();
          if (s != null)
          {
            return new Material();
          }

          db.Add(material);
          db.SaveChanges();
          return material;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public Material putMaterial(MaterialModel materialModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Material d = db.Material.Where(p => p.Id != materialModel.material.Id && String.Compare(p.Name, materialModel.material.Name, false) == 0 && p.Status == true).SingleOrDefault();
          if (d != null)
          {
            return new Material();
          }

          Material material = db.Material.Find(materialModel.material.Id);
          material.Name = materialModel.material.Name;
          material.ModifiedDate = DateTime.Now;
          material.ModifiedBy = materialModel.employee.UserName;

          db.SaveChanges();
          return material;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public bool deleteMaterialById(Material d)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Material material = db.Material.Find(d.Id);
          if (material == null)
          {
            return false;
          }
          material.Status = false;
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

    public bool deleteMaterialByIds(MaterialModel materialModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          foreach (Material d in materialModel.materialList)
          {
            Material material = db.Material.Find(d.Id);
            if (material == null)
            {
              return false;
            }

            material.Status = false;
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
