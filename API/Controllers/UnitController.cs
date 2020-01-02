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
  public class UnitController : ControllerBase
  {
    UnitBusiness unitBusiness = new UnitBusiness();

    [Route("GetAllUnits")]
    public IEnumerable<Unit> GetAllUnits()
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          return db.Unit.Where(p => p.Status == true).ToList();
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    [Route("CreateUnit")]
    [HttpPost]
    public Unit CreateUnit(Unit unit)
    {
      return unitBusiness.createUnit(unit);
    }

    [Route("PutUnit")]
    [HttpPut]
    public Unit PutUnit(UnitModel unitModel)
    {
      return unitBusiness.putUnit(unitModel);
    }

    [Route("DeleteUnitById")]
    [HttpDelete]
    public bool DeleteUnitById(Unit unit)
    {
      return unitBusiness.deleteUnitById(unit);
    }

    [Route("DeleteUnitByIds")]
    [HttpDelete]
    public bool DeleteUnitByIds(UnitModel unitModel)
    {
      return unitBusiness.deleteUnitByIds(unitModel);
    }
  }
}