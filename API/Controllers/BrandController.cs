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
  public class BrandController : ControllerBase
  {
    BrandBusiness brandBusiness = new BrandBusiness();

    private IHostingEnvironment _env;
    public BrandController(IHostingEnvironment env)
    {
      _env = env;
    }

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

    [Route("CreateBrand")]
    [HttpPost]
    public Brand CreateBrand(BrandModel brandModel)
    {
      string webRoot = _env.ContentRootPath;
      webRoot = webRoot.Replace("API", "Champoochamp");
      string path = Path.Combine(webRoot, "ClientApp\\src\\assets\\images", brandModel.folderName);

      return brandBusiness.createBrand(brandModel, path);
    }

    [Route("PutBrand")]
    [HttpPut]
    public Brand PutBrand(BrandModel brandModel)
    {
      string webRoot = _env.ContentRootPath;
      webRoot = webRoot.Replace("API", "Champoochamp");
      string path = Path.Combine(webRoot, "ClientApp\\src\\assets\\images", brandModel.folderName);

      return brandBusiness.putBrand(brandModel, path);
    }

    [Route("DeleteBrandById")]
    [HttpDelete]
    public bool DeleteBrandById(Brand brand)
    {
      return brandBusiness.deleteBrandById(brand);
    }

    [Route("DeleteBrandByIds")]
    [HttpDelete]
    public bool DeleteBrandByIds(BrandModel brandModel)
    {
      return brandBusiness.deleteBrandByIds(brandModel);
    }
  }
}