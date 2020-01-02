using System;
using System.Collections.Generic;

namespace Data.Entity
{
    public partial class CollectionDetail
    {
        public int Id { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public bool? Status { get; set; }
        public int CollectionId { get; set; }
        public int ProductId { get; set; }

        public virtual Collection Collection { get; set; }
        public virtual Product Product { get; set; }
    }
}
