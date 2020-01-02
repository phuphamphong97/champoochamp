using Data.Entity;
using Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Business
{
  public class DiscountBusiness
  {
    public Discount createDiscount(Discount discount)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {      
          Discount d = db.Discount.Where(p => String.Compare(p.Code, discount.Code, false) == 0 && p.Status == true).SingleOrDefault();
          if (d != null)
          {
            return new Discount();
          }

          db.Add(discount);
          db.SaveChanges();
          return discount;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public Discount putDiscount(DiscountModel discountModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Discount d = db.Discount.Where(p => p.Id != discountModel.discount.Id && String.Compare(p.Code, discountModel.discount.Code, false) == 0 && p.Status == true).SingleOrDefault();
          if (d != null)
          {
            return new Discount();
          }

          Discount discount = db.Discount.Find(discountModel.discount.Id);
          discount.Name = discountModel.discount.Name;
          discount.Code = discountModel.discount.Code;
          discount.Rate = discountModel.discount.Rate;
          discount.ModifiedDate = DateTime.Now;
          discount.ModifiedBy = discountModel.employee.UserName;

          db.SaveChanges();
          return discount;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public bool deleteDiscountById(Discount d)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Discount discount = db.Discount.Find(d.Id);
          if(discount == null)
          {
            return false;
          }
          discount.Status = false;
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

    public bool deleteDiscountByIds(DiscountModel discountModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          foreach(Discount d in discountModel.discountList)
          {
            Discount discount = db.Discount.Find(d.Id);
            if (discount == null)
            {
              return false;
            }

            discount.Status = false;
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
