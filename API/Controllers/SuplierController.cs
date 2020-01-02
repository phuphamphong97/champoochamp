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
  public class SuplierController : ControllerBase
  {
    SuplierBusiness suplierBusiness = new SuplierBusiness();

    [Route("GetAllSupliers")]
    public IEnumerable<Suplier> GetAllSupliers()
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          return db.Suplier.Where(p => p.Status == true).ToList();
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    [Route("CreateSuplier")]
    [HttpPost]
    public Suplier CreateSuplier(Suplier suplier)
    {
      return suplierBusiness.createSuplier(suplier);
    }

    [Route("PutSuplier")]
    [HttpPut]
    public Suplier PutSuplier(SuplierModel suplierModel)
    {
      return suplierBusiness.putSuplier(suplierModel);
    }

    [Route("DeleteSuplierById")]
    [HttpDelete]
    public bool DeleteSuplierById(Suplier suplier)
    {
      return suplierBusiness.deleteSuplierById(suplier);
    }

    [Route("DeleteSuplierByIds")]
    [HttpDelete]
    public bool DeleteSuplierByIds(SuplierModel suplierModel)
    {
      return suplierBusiness.deleteSuplierByIds(suplierModel);
    }
  }
}