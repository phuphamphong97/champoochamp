using System;
using System.Collections.Generic;

namespace Data.Entity
{
    public partial class InvoiceDetail
    {
        public int Id { get; set; }
        public decimal? PriceCurrent { get; set; }
        public int? Quantity { get; set; }
        public decimal? Total { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public bool? Status { get; set; }
        public string ProductVariantId { get; set; }
        public int InvoiceId { get; set; }

        public virtual Invoice Invoice { get; set; }
        public virtual ProductVariant ProductVariant { get; set; }
    }
}
