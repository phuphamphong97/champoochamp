using System;
using System.Collections.Generic;

namespace Data.Entity
{
    public partial class Suplier
    {
        public Suplier()
        {
            GoodsReceipt = new HashSet<GoodsReceipt>();
            Product = new HashSet<Product>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Thumbnail { get; set; }
        public string Note { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public bool? Status { get; set; }

        public virtual ICollection<GoodsReceipt> GoodsReceipt { get; set; }
        public virtual ICollection<Product> Product { get; set; }
    }
}
