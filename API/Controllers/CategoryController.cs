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
  public class CategoryController : ControllerBase
  {
    CategoryBusiness categoryBusiness = new CategoryBusiness();

    [EnableQuery]
    [Route("GetAllCategories")]
    public IEnumerable<Category> GetAllCategories()
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          return db.Category.Where(p => p.Status == true).ToList();
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    [EnableQuery]
    [Route("GetAdminAllCategories")]
    public IEnumerable<Category> GetAdminAllCategories()
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          return categoryBusiness.shortCategoryList(db.Category.Where(p => p.Status == true).ToList());
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    [EnableQuery]
    [Route("GetCategoryById-{id}")]
    public Category GetCategoryById(int id)
    {
      return categoryBusiness.GetCategoryById(id);
    }

    [EnableQuery]
    [Route("GetAllParentCategories")]
    public IEnumerable<Category> GetAllParentCategories()
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          return db.Category.Where(p => p.Status == true && p.ParentId == null).ToList();
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    [Route("CreateCategory")]
    [HttpPost]
    public Category CreateCategory(Category category)
    {
      return categoryBusiness.createCategory(category);
    }

    [Route("PutCategory")]
    [HttpPut]
    public Category PutCategory(CategoryModel categoryModel)
    {
      return categoryBusiness.putCategory(categoryModel);
    }

    [Route("DeleteCategoryById")]
    [HttpDelete]
    public bool DeleteCategoryById(Category category)
    {
      return categoryBusiness.deleteCategoryById(category);
    }

    [Route("DeleteCategoryByIds")]
    [HttpDelete]
    public bool DeleteCategoryByIds(CategoryModel categoryModel)
    {
      return categoryBusiness.deleteCategoryByIds(categoryModel);
    }
  }
}