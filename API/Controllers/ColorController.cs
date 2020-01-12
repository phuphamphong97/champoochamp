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
  public class ColorController : ControllerBase
  {
    ColorBusiness colorBusiness = new ColorBusiness();

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

    [Route("CreateColor")]
    [HttpPost]
    public Color CreateColor(Color color)
    {
      return colorBusiness.createColor(color);
    }

    [Route("PutColor")]
    [HttpPut]
    public Color PutColor(ColorModel colorModel)
    {
      return colorBusiness.putColor(colorModel);
    }

    [Route("DeleteColorById")]
    [HttpDelete]
    public bool DeleteColorById(Color color)
    {
      return colorBusiness.deleteColorById(color);
    }

    [Route("DeleteColorByIds")]
    [HttpDelete]
    public bool DeleteColorByIds(ColorModel colorModel)
    {
      return colorBusiness.deleteColorByIds(colorModel);
    }
  }
}