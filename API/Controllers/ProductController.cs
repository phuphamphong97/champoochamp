using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Business;
using Data.Entity;
using Data.Model;
using Microsoft.AspNet.OData;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class ProductController : ControllerBase
  {
    ProductBusiness productBusiness = new ProductBusiness();

    [EnableQuery]
    [Route("GetAllProducts")]
    public IEnumerable<Product> GetAllProducts()
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          List<Product> productList = db.Product.Where(p => p.Status == true)
                                      .Include(p => p.ProductVariant)
                                        .ThenInclude(p => p.Color)
                                      .ToList();
          return productBusiness.ShortProductList(productList);
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    [EnableQuery]
    [Route("GetProductsByCategoryId-{id}")]
    public IEnumerable<Product> GetProductsByCategoryId(int id)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          List<Product> productList = new List<Product>();
          Category category = db.Category.Where(p => p.Id == id && p.Status == true)
                            .Include(p => p.InverseParent)
                              .ThenInclude(p => p.InverseParent)
                                .ThenInclude(p => p.Product)
                                  .ThenInclude(p => p.ProductVariant)
                                    .ThenInclude(p => p.Color)
                                  .ThenInclude(p => p.ProductVariant)
                                    .ThenInclude(p => p.ProductImages)
                            .Include(p => p.InverseParent)
                              .ThenInclude(p => p.Product)
                                .ThenInclude(p => p.ProductVariant)
                                  .ThenInclude(p => p.Color)
                                .ThenInclude(p => p.ProductVariant)
                                  .ThenInclude(p => p.ProductImages)
                            .Include(p => p.Product)
                              .ThenInclude(p => p.ProductVariant)
                                .ThenInclude(p => p.Color)
                              .ThenInclude(p => p.ProductVariant)
                                .ThenInclude(p => p.ProductImages)
                            .SingleOrDefault();
          productBusiness.GetProductsByCategory(category, ref productList);

          return productList;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    [EnableQuery]
    [Route("GetRelativeProducts-{productId}-{categoryId}")]
    public IEnumerable<Product> GetRelativeProducts(int productId, int categoryId)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {          
          List<Product> productList = new List<Product>();

          int collectionId = db.CollectionDetail.Where(p => p.Status == true && p.ProductId == productId)
            .Select(p => p.CollectionId).FirstOrDefault();

          List<Product> productListByCollectionId = db.CollectionDetail.Where(p => p.Status == true && 
            p.ProductId != productId && p.CollectionId == collectionId)
            .Select(p => p.Product)
            .Include(p => p.ProductVariant)
              .ThenInclude(p => p.Color)
            .ToList();

          List<Product> productListByCategoryId = db.Product.Where(p => p.Status == true && 
            p.Id != productId && p.CategoryId == categoryId)
            .Include(p => p.ProductVariant)
              .ThenInclude(p => p.Color)
            .ToList();

          productList = productListByCollectionId.Union(productListByCategoryId).Distinct().ToList();

          return productBusiness.ShortProductList(productList);
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    [EnableQuery]
    [Route("GetProductById-{id}")]
    public Product GetProductById(int id)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Product product = db.Product.Where(p => p.Id == id && p.Status == true)
            .Include(p => p.Brand).Include(p => p.Material).Include(p => p.Suplier)
            .Include(p => p.ProductVariant)
              .ThenInclude(p => p.Color)
            .Include(p => p.ProductVariant)
              .ThenInclude(p => p.Size)
            .Include(p => p.ProductVariant)
              .ThenInclude(p => p.ProductImages)
            .SingleOrDefault();

          return productBusiness.ShortProduct(product);
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    [Route("GetProductsByCollectionId-{collectionId}")]
    public CollectionModel GetProductsByCollectionId(int collectionId)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Collection collection = db.Collection.Find(collectionId);
          List<Product> productList = db.CollectionDetail
            .Where(p => p.CollectionId == collectionId && p.Status == true)
            .Select(p => p.Product).Include(p => p.ProductVariant).ThenInclude(p => p.Color)
            .ToList();

          return new CollectionModel(null, collection, null, null, new List<Collection>(), productBusiness.ShortProductList(productList));
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