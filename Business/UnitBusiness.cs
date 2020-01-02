using Data.Entity;
using Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Business
{
  public class UnitBusiness
  {
    public Unit createUnit(Unit unit)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {      
          Unit d = db.Unit.Where(p => String.Compare(p.Name, unit.Name, false) == 0 && p.Status == true).SingleOrDefault();
          if (d != null)
          {
            return new Unit();
          }

          db.Add(unit);
          db.SaveChanges();
          return unit;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public Unit putUnit(UnitModel unitModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Unit d = db.Unit.Where(p => p.Id != unitModel.unit.Id && String.Compare(p.Name, unitModel.unit.Name, false) == 0 && p.Status == true).SingleOrDefault();
          if (d != null)
          {
            return new Unit();
          }

          Unit unit = db.Unit.Find(unitModel.unit.Id);
          unit.Name = unitModel.unit.Name;
          unit.ModifiedDate = DateTime.Now;
          unit.ModifiedBy = unitModel.employee.UserName;

          db.SaveChanges();
          return unit;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public bool deleteUnitById(Unit d)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Unit unit = db.Unit.Find(d.Id);
          if(unit == null)
          {
            return false;
          }
          unit.Status = false;
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

    public bool deleteUnitByIds(UnitModel unitModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          foreach(Unit d in unitModel.unitList)
          {
            Unit unit = db.Unit.Find(d.Id);
            if (unit == null)
            {
              return false;
            }

            unit.Status = false;
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
