using Data.Entity;
using Data.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Business
{
  public class CategoryBusiness
  {
    public Category GetCategoryById(int id)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          return db.Category.Where(p => p.Id == id && p.Status == true).Include(p => p.Parent).ThenInclude(p => p.Parent).SingleOrDefault();
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public IEnumerable<Category> shortCategoryList(IEnumerable<Category> categoryList)
    {
      foreach(Category c in categoryList)
      {
        c.InverseParent = null;
      }

      return categoryList;
    }

    public Category createCategory(Category category)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Category d = db.Category.Where(p => String.Compare(p.Name, category.Name, false) == 0 && p.Status == true).SingleOrDefault();
          if (d != null)
          {
            return new Category();
          }

          db.Add(category);
          db.SaveChanges();
          Category categoryParent = db.Category.Find(category.ParentId);
          category.Parent = categoryParent;
          return category;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public Category putCategory(CategoryModel categoryModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Category d = db.Category.Where(p => p.Id != categoryModel.category.Id && String.Compare(p.Name, categoryModel.category.Name, false) == 0 && p.Status == true).SingleOrDefault();
          if (d != null)
          {
            return new Category();
          }

          Category category = db.Category.Find(categoryModel.category.Id);
          category.Name = categoryModel.category.Name;
          category.ParentId = categoryModel.category.ParentId;
          category.ModifiedDate = DateTime.Now;
          category.ModifiedBy = categoryModel.employee.UserName;

          db.SaveChanges();
          Category categoryParent = db.Category.Find(category.ParentId);
          category.Parent = categoryParent;
          return category;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public bool deleteCategoryById(Category d)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Category category = db.Category.Find(d.Id);
          if (category == null)
          {
            return false;
          }
          category.Status = false;
          db.SaveChanges();
          return true;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return false;
        }
      }
    }

    public bool deleteCategoryByIds(CategoryModel categoryModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          foreach (Category d in categoryModel.categoryList)
          {
            Category category = db.Category.Find(d.Id);
            if (category == null)
            {
              return false;
            }

            category.Status = false;
          }

          db.SaveChanges();
          return true;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return false;
        }
      }
    }
  }
}
