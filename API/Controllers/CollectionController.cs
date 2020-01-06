using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Business;
using Data.Entity;
using Data.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class CollectionController : ControllerBase
  {
    CollectionBusiness collectionBusiness = new CollectionBusiness();

    [Route("GetAllCollections")]
    public IEnumerable<Collection> GetAllCollections()
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          return db.Collection.Where(p => p.Status == true).ToList();
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    [Route("CreateCollection")]
    [HttpPost]
    public Collection CreateCollection(CollectionModel collectionModel)
    {
      return collectionBusiness.createCollection(collectionModel);
    }

    [Route("PutCollection")]
    [HttpPut]
    public Collection PutCollection(CollectionModel collectionModel)
    {
      return collectionBusiness.putCollection(collectionModel);
    }

    [Route("DeleteCollectionById")]
    [HttpDelete]
    public bool DeleteCollectionById(Collection collection)
    {
      return collectionBusiness.deleteCollectionById(collection);
    }

    [Route("DeleteCollectionByIds")]
    [HttpDelete]
    public bool DeleteCollectionByIds(CollectionModel collectionModel)
    {
      return collectionBusiness.deleteCollectionByIds(collectionModel);
    }
  }
}