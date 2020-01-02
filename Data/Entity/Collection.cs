using System;
using System.Collections.Generic;

namespace Data.Entity
{
    public partial class Collection
    {
        public Collection()
        {
            CollectionDetail = new HashSet<CollectionDetail>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string MetaTitle { get; set; }
        public string Thumbnail { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public bool? Status { get; set; }

        public virtual ICollection<CollectionDetail> CollectionDetail { get; set; }
    }
}
