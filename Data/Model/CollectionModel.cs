using Data.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Model
{
  public class CollectionModel
  {
    public Employee employee { get; set; }
    public Collection collection { get; set; }
    public string thumbnailBase64 { get; set; }
    public string folderName { get; set; }
    public List<Collection> collectionList { get; set; }
    public List<Product> productList { get; set; }

    public CollectionModel()
    {
      collectionList = new List<Collection>();
      productList = new List<Product>();
    }

    public CollectionModel(Employee employee, Collection collection, string thumbnailBase64, string folderName, List<Collection> collectionList, List<Product> productList)
    {
      this.employee = employee;
      this.collection = collection;
      this.thumbnailBase64 = thumbnailBase64;
      this.folderName = folderName;
      this.collectionList = collectionList;
      this.productList = productList;
    }
  }
}
