using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Data.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class BrandController : ControllerBase
  {
    [Route("GetAllBrands")]
    public IEnumerable<Brand> GetAllBrands()
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          return db.Brand.Where(p => p.Status == true).ToList();
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }
  }
}