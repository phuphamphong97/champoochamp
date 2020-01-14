using Data.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Model
{
  public class BrandModel
  {
    public Employee employee { get; set; }
    public Brand brand { get; set; }
    public string thumbnailBase64 { get; set; }
    public string folderName { get; set; }
    public List<Brand> brandList { get; set; }

    public BrandModel()
    {
      brandList = new List<Brand>();
    }

    public BrandModel(Employee employee, Brand brand, string thumbnailBase64, string folderName, List<Brand> brandList)
    {
      this.employee = employee;
      this.brand = brand;
      this.thumbnailBase64 = thumbnailBase64;
      this.folderName = folderName;
      this.brandList = brandList;
    }
  }
}
