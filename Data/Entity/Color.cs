﻿using System;
using System.Collections.Generic;

namespace Data.Entity
{
    public partial class Color
    {
        public Color()
        {
            ProductVariant = new HashSet<ProductVariant>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public bool? Status { get; set; }

        public virtual ICollection<ProductVariant> ProductVariant { get; set; }
    }
}
