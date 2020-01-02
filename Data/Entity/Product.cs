using System;
using System.Collections.Generic;

namespace Data.Entity
{
    public partial class Product
    {
        public Product()
        {
            CollectionDetail = new HashSet<CollectionDetail>();
            ProductVariant = new HashSet<ProductVariant>();
            Reviews = new HashSet<Reviews>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string MetaTitle { get; set; }
        public decimal? Price { get; set; }
        public decimal? PromotionPrice { get; set; }
        public int? DiscountAmount { get; set; }
        public int? TotalQuantity { get; set; }
        public string Description { get; set; }
        public string Detail { get; set; }
        public string WarrantyPeriod { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public int? Views { get; set; }
        public bool? Status { get; set; }
        public int MaterialId { get; set; }
        public int BrandId { get; set; }
        public int CategoryId { get; set; }
        public int UnitId { get; set; }
        public int SuplierId { get; set; }

        public virtual Brand Brand { get; set; }
        public virtual Category Category { get; set; }
        public virtual Material Material { get; set; }
        public virtual Suplier Suplier { get; set; }
        public virtual Unit Unit { get; set; }
        public virtual ICollection<CollectionDetail> CollectionDetail { get; set; }
        public virtual ICollection<ProductVariant> ProductVariant { get; set; }
        public virtual ICollection<Reviews> Reviews { get; set; }
    }
}
