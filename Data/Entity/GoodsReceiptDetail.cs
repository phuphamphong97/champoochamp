using System;
using System.Collections.Generic;

namespace Data.Entity
{
    public partial class GoodsReceiptDetail
    {
        public int Id { get; set; }
        public decimal? Price { get; set; }
        public int? Quantity { get; set; }
        public decimal? Total { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public bool? Status { get; set; }
        public string ProductVariantId { get; set; }
        public int GoodsReceiptId { get; set; }

        public virtual GoodsReceipt GoodsReceipt { get; set; }
        public virtual ProductVariant ProductVariant { get; set; }
    }
}
