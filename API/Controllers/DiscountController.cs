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
  public class DiscountController : ControllerBase
  {
    DiscountBusiness discountBusiness = new DiscountBusiness();

    [Route("GetAllDiscounts")]
    public IEnumerable<Discount> GetAllDiscounts()
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          return db.Discount.Where(p => p.Status == true).ToList();
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    [Route("GetDiscountByCode-{code}")]
    public Discount GetDiscountCodeByCode(string code)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          return db.Discount.Where(p => String.Compare(p.Code, code, false) == 0 && p.Status == true).SingleOrDefault();
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    [Route("CreateDiscount")]
    [HttpPost]
    public Discount CreateDiscount(Discount discount)
    {
      return discountBusiness.createDiscount(discount);
    }

    [Route("PutDiscount")]
    [HttpPut]
    public Discount PutDiscount(DiscountModel discountModel)
    {
      return discountBusiness.putDiscount(discountModel);
    }

    [Route("DeleteDiscountById")]
    [HttpDelete]
    public bool DeleteDiscountById(Discount discount)
    {
      return discountBusiness.deleteDiscountById(discount);
    }

    [Route("DeleteDiscountByIds")]
    [HttpDelete]
    public bool DeleteDiscountByIds(DiscountModel discountModel)
    {
      return discountBusiness.deleteDiscountByIds(discountModel);
    }
  }
}