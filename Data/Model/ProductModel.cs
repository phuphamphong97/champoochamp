using Data.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Model
{
  public class ProductModel
  {
    public Employee employee { get; set; }
    public Product product { get; set; }
    public List<ProductVariantModel> productVariantModelList { get; set; }
    public List<Product> productList { get; set; }

    public ProductModel()
    {
      productList = new List<Product>();
      productVariantModelList = new List<ProductVariantModel>();
    }

    public ProductModel(Employee employee, Product product, List<ProductVariantModel> productVariantModelList, List<Product> productList)
    {
      this.employee = employee;
      this.product = product;
      this.productVariantModelList = productVariantModelList;
      this.productList = productList;
    }
  }
}
