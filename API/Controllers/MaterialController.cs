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
  public class MaterialController : ControllerBase
  {
    MaterialBusiness materialBusiness = new MaterialBusiness();

    [Route("GetAllMaterials")]
    public IEnumerable<Material> GetAllMaterials()
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          return db.Material.Where(p => p.Status == true).ToList();
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    [Route("CreateMaterial")]
    [HttpPost]
    public Material CreateMaterial(Material material)
    {
      return materialBusiness.createMaterial(material);
    }

    [Route("PutMaterial")]
    [HttpPut]
    public Material PutMaterial(MaterialModel materialModel)
    {
      return materialBusiness.putMaterial(materialModel);
    }

    [Route("DeleteMaterialById")]
    [HttpDelete]
    public bool DeleteMaterialById(Material material)
    {
      return materialBusiness.deleteMaterialById(material);
    }

    [Route("DeleteMaterialByIds")]
    [HttpDelete]
    public bool DeleteMaterialByIds(MaterialModel materialModel)
    {
      return materialBusiness.deleteMaterialByIds(materialModel);
    }
  }
}