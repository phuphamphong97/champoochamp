using Data.Entity;
using Data.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;

namespace Business
{
  public class CollectionBusiness
  {
    public Collection createCollection(CollectionModel collectionModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          string folderPath = "http://localhost:5000/assets/images/users";
          //Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location)
          Collection d = db.Collection.Where(p => String.Compare(p.Name, collectionModel.collection.Name, false) == 0 && p.Status == true).SingleOrDefault();
          if (d != null)
          {
            return new Collection();
          }

          if (String.IsNullOrEmpty(collectionModel.collection.Thumbnail))
          {
            collectionModel.collection.Thumbnail = "default.png";
          }
          else
          {
            Services.SaveImage(folderPath, collectionModel.collection.Thumbnail, collectionModel.imageUrl);
          }
          db.Add(collectionModel.collection);

          db.SaveChanges();
          return collectionModel.collection;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public Collection putCollection(CollectionModel collectionModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Collection d = db.Collection.Where(p => p.Id != collectionModel.collection.Id && String.Compare(p.Name, collectionModel.collection.Name, false) == 0 && p.Status == true).SingleOrDefault();
          if (d != null)
          {
            return new Collection();
          }

          Collection collection = db.Collection.Find(collectionModel.collection.Id);
          collection.Name = collectionModel.collection.Name;
          //collection.MetaTitle = collectionModel.collection.Name;
          collection.ModifiedDate = DateTime.Now;
          collection.ModifiedBy = collectionModel.employee.Name;
          if (String.IsNullOrEmpty(collectionModel.collection.Thumbnail))
          {
            collection.Thumbnail = "default.png";
          }
          else
          {
            collection.Thumbnail = collectionModel.collection.Thumbnail;
          }

          db.SaveChanges();
          return collection;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    public bool deleteCollectionById(Collection d)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Collection collection = db.Collection.Find(d.Id);
          if (collection == null)
          {
            return false;
          }
          collection.Status = false;
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

    public bool deleteCollectionByIds(CollectionModel collectionModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          foreach (Collection d in collectionModel.collectionList)
          {
            Collection collection = db.Collection.Find(d.Id);
            if (collection == null)
            {
              return false;
            }

            collection.Status = false;
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
