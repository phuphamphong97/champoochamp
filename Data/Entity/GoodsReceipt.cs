using System;
using System.Collections.Generic;

namespace Data.Entity
{
    public partial class GoodsReceipt
    {
        public GoodsReceipt()
        {
            GoodsReceiptDetail = new HashSet<GoodsReceiptDetail>();
        }

        public int Id { get; set; }
        public decimal? Total { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public bool? Status { get; set; }
        public int SuplierId { get; set; }

        public virtual Suplier Suplier { get; set; }
        public virtual ICollection<GoodsReceiptDetail> GoodsReceiptDetail { get; set; }
    }
}
