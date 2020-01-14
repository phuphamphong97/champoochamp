using Data.Entity;
using Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Business
{
  public class ProductBusiness
  {
    public void GetProductsByCategories(List<Category> categoryList, ref List<Product> productList)
    {
      if (categoryList.Count > 0)
      {
        foreach(Category item in categoryList)
        {
          GetProductsByCategory(item, ref productList);
        }
      }
    }

    public void GetProductsByCategory(Category category, ref List<Product> productList)
    {
      if (category != null)
      {
        if (category.InverseParent.Count > 0)
        {
          foreach (Category item in category.InverseParent)
          {
            GetProductsByCategory(item, ref productList);
          }
        }
        else
        {
          CombineProducts(category.Product, ref productList);
        }
      }
    }

    public void CombineProducts(ICollection<Product> productList, ref List<Product> result)
    {
      if (productList.Count > 0)
      {
        foreach (Product p in productList)
        {
          p.Category = null;
          foreach (ProductVariant pv in p.ProductVariant)
          {
            if (pv.Color != null)
            {
              pv.Color.ProductVariant = null;
            }
            if (pv.ProductImages != null)
            {
              pv.ProductImages.ProductVariant = null;
            }
          }

          result.Add(p);
        }
      }
    }

    public List<Product> ShortProductList(List<Product> productList)
    {
      foreach (Product p in productList)
      {
        foreach (ProductVariant pv in p.ProductVariant)
        {
          if (pv.Color != null)
          {
            pv.Color.ProductVariant = null;
          }
        }
      }

      return productList;
    }

    public Product ShortProduct(Product product)
    {    
      foreach (ProductVariant pv in product.ProductVariant)
      {
        if(pv.Color != null)
        {
          pv.Color.ProductVariant = null;
        }
        if (pv.Size != null)
        {
          pv.Size.ProductVariant = null;
        }
        if (pv.ProductImages != null)
        {
          pv.ProductImages.ProductVariant = null;
        }
      }

      return product;
    }

    public ProductVariant ShortProductVariant(ProductVariant productVariant)
    {
      if (productVariant.Product != null)
      {
        productVariant.Product.ProductVariant = null;
      }
      if (productVariant.Color != null)
      {
        productVariant.Color.ProductVariant = null;
      }
      if (productVariant.Size != null)
      {
        productVariant.Size.ProductVariant = null;
      }

      return productVariant;
    }

    public List<Product> ShortAdminProductList(List<Product> productList)
    {
      foreach (Product p in productList)
      {
        if (p.Brand != null)
        {
          p.Brand.Product = null;
        }
        if (p.Category != null)
        {
          p.Category.Product = null;
        }
        if (p.Unit != null)
        {
          p.Unit.Product = null;
        }
        if (p.Suplier != null)
        {
          p.Suplier.Product = null;
        }
        if (p.Material != null)
        {
          p.Material.Product = null;
        }

        foreach (ProductVariant pv in p.ProductVariant)
        {
          if (pv.Color != null)
          {
            pv.Color.ProductVariant = null;
          }
          if (pv.Size != null)
          {
            pv.Size.ProductVariant = null;
          }
          if (pv.ProductImages != null)
          {
            pv.ProductImages.ProductVariant = null;
          }
        }
      }

      return productList;
    }

    public Product createProduct(ProductModel productModel, string path)
    {
      using (champoochampContext db = new champoochampContext())
      {
        using (var transaction = db.Database.BeginTransaction())
        {
          try
          {
            Product product = db.Product.Where(p => String.Compare(p.Name, productModel.product.Name, false) == 0 && p.Status == true).SingleOrDefault();
            if (product != null)
            {
              return new Product();
            }

            productModel.product.CreatedBy = productModel.employee.Name;
            db.Add(productModel.product);
            db.SaveChanges();

            foreach (ProductVariantModel pvm in productModel.productVariantModelList)
            {
              string ImageUrls = string.Empty;
              foreach (ImageUrl image in pvm.imageUrlList)
              {
                ImageUrls += image + ",";

                string imageType = image.thumbUrl.IndexOf("image/png") > 0 ? ".png" : ".jpg";
                string thumbnail = "Product_" + productModel.product.Id.ToString() + imageType;
                bool isSave = Services.SaveImage(path, thumbnail, image.thumbUrl);
                if (isSave)
                {
                }
                else
                {
                  transaction.Rollback();
                  return null;
                }
              }

              ImageUrls = ImageUrls.Substring(0, ImageUrls.Length - 2);              

              ProductImages pi = new ProductImages();
              pi.ImageUrls = ImageUrls;
              pi.CreatedBy = productModel.employee.Name;
              db.Add(pi);
              db.SaveChanges();

              ProductVariant pv = new ProductVariant();
              pv.Id = "0000" + productModel.product + "0" + pvm.productVariant.ColorId + "0" + pvm.productVariant.SizeId;
              pv.Quantity = pvm.productVariant.Quantity;
              pv.Thumbnail = pvm.imageUrlList[0].name;
              pv.CreatedBy = productModel.employee.Name;
              pv.ProductId = productModel.product.Id;
              pv.ColorId = pvm.productVariant.ColorId;
              pv.SizeId = pvm.productVariant.SizeId;
              pv.ProductImagesId = pi.Id;              
            }

            db.SaveChanges();
            transaction.Commit();
            return productModel.product;
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
  }
}
