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
    public Collection createCollection(CollectionModel collectionModel, string path)
    {
      using (champoochampContext db = new champoochampContext())
      {
        using (var transaction = db.Database.BeginTransaction())
        {
          try
          {
            Collection d = db.Collection.Where(p => String.Compare(p.Name, collectionModel.collection.Name, false) == 0 && p.Status == true).SingleOrDefault();
            if (d != null)
            {
              return new Collection();
            }

            db.Add(collectionModel.collection);
            db.SaveChanges();
            if (String.IsNullOrEmpty(collectionModel.thumbnailBase64))
            {
              collectionModel.collection.Thumbnail = "default.png";
            }
            else
            {
              string imageType = collectionModel.thumbnailBase64.IndexOf("image/png") > 0 ? ".png" : ".jpg";
              string thumbnail = "Collection_" + collectionModel.collection.Id.ToString() + imageType;
              bool isSave = Services.SaveImage(path, thumbnail, collectionModel.thumbnailBase64);
              if (isSave)
              {
                collectionModel.collection.Thumbnail = thumbnail;
              }
              else
              {
                transaction.Rollback();
                return null;
              }
            }

            db.SaveChanges();
            transaction.Commit();
            return collectionModel.collection;
          }
          catch (Exception e)
          {
            Console.WriteLine(e.Message);
            transaction.Rollback();
            return null;
          }
        }
      }
    }

    public Collection putCollection(CollectionModel collectionModel, string path)
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
          collection.ModifiedDate = DateTime.Now;
          collection.ModifiedBy = collectionModel.employee.UserName;
          if (!String.IsNullOrEmpty(collectionModel.thumbnailBase64))
          {
            if (!Services.SaveImage(path, collectionModel.collection.Thumbnail, collectionModel.thumbnailBase64))
            {
              return null;
            }
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
