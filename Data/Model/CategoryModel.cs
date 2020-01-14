using Data.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Model
{
  public class CategoryModel
  {
    public Employee employee { get; set; }
    public Category category { get; set; }
    public List<Category> categoryList { get; set; }

    public CategoryModel()
    {
      categoryList = new List<Category>();
    }

    public CategoryModel(Employee employee, Category category, List<Category> categoryList)
    {
      this.employee = employee;
      this.category = category;
      this.categoryList = categoryList;
    }
  }
}
