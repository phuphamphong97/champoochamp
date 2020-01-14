using Data.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Model
{
  public class ProductVariantModel
  {
    public ProductVariant productVariant { get; set; }
    public List<ImageUrl> imageUrlList { get; set; }

    public ProductVariantModel()
    {
      imageUrlList = new List<ImageUrl>();
    }

    public ProductVariantModel(ProductVariant productVariant, List<ImageUrl> imageUrlList)
    {
      this.productVariant = productVariant;
      this.imageUrlList = imageUrlList;
    }
  }

  public class ImageUrl
  {
    public string name { get; set; }
    public string thumbUrl { get; set; }
    public ImageUrl(string name, string thumbUrl)
    {
      this.name = name;
      this.thumbUrl = thumbUrl;
    }

  }
}
