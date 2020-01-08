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
  public class SlideController : ControllerBase
  {
    [Route("GetAllSlides")]
    public IEnumerable<Slide> GetAllSlides()
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          return db.Slide.Where(p => p.Status == true).OrderByDescending(p => p.DisplayOrder.Value).ToList();
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