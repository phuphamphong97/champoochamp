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
  public class ColorController : ControllerBase
  {
    [Route("GetAllColors")]
    public IEnumerable<Color> GetAllColors()
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          return db.Color.Where(p => p.Status == true).ToList();
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