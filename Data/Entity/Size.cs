using System;
using System.Collections.Generic;

namespace Data.Entity
{
    public partial class Size
    {
        public Size()
        {
            ProductVariant = new HashSet<ProductVariant>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public bool? Status { get; set; }

        public virtual ICollection<ProductVariant> ProductVariant { get; set; }
    }
}
