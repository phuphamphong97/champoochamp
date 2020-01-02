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
    public List<Collection> collectionList { get; set; }
    public List<Product> productList { get; set; }

    public CollectionModel()
    {
      collectionList = new List<Collection>();
      productList = new List<Product>();
    }

    public CollectionModel(Employee employee, Collection collection, List<Collection> collectionList, List<Product> productList)
    {
      this.employee = employee;
      this.collection = collection;
      this.collectionList = collectionList;
      this.productList = productList;
    }
  }
}
