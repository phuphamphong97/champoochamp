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
  public class SizeController : ControllerBase
  {
    SizeBusiness sizeBusiness = new SizeBusiness();

    [Route("GetAllSizes")]
    public IEnumerable<Size> GetAllSizes()
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          return db.Size.Where(p => p.Status == true).ToList();
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    [Route("CreateSize")]
    [HttpPost]
    public Size CreateSize(Size size)
    {
      return sizeBusiness.createSize(size);
    }

    [Route("PutSize")]
    [HttpPut]
    public Size PutSize(SizeModel sizeModel)
    {
      return sizeBusiness.putSize(sizeModel);
    }

    [Route("DeleteSizeById")]
    [HttpDelete]
    public bool DeleteSizeById(Size size)
    {
      return sizeBusiness.deleteSizeById(size);
    }

    [Route("DeleteSizeByIds")]
    [HttpDelete]
    public bool DeleteSizeByIds(SizeModel sizeModel)
    {
      return sizeBusiness.deleteSizeByIds(sizeModel);
    }
  }
}