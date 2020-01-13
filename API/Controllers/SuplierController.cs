using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Business;
using Data.Entity;
using Data.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class SuplierController : ControllerBase
  {
    SuplierBusiness suplierBusiness = new SuplierBusiness();

    private IHostingEnvironment _env;
    public SuplierController(IHostingEnvironment env)
    {
      _env = env;
    }

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
    public Suplier CreateSuplier(SuplierModel suplierModel)
    {
      string webRoot = _env.ContentRootPath;
      webRoot = webRoot.Replace("API", "Champoochamp");
      string path = Path.Combine(webRoot, "ClientApp\\src\\assets\\images", suplierModel.folderName);

      return suplierBusiness.createSuplier(suplierModel, path);
    }

    [Route("PutSuplier")]
    [HttpPut]
    public Suplier PutSuplier(SuplierModel suplierModel)
    {
      string webRoot = _env.ContentRootPath;
      webRoot = webRoot.Replace("API", "Champoochamp");
      string path = Path.Combine(webRoot, "ClientApp\\src\\assets\\images", suplierModel.folderName);

      return suplierBusiness.putSuplier(suplierModel, path);
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