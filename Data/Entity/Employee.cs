﻿using System;
using System.Collections.Generic;

namespace Data.Entity
{
    public partial class Employee
    {
        public short Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Avatar { get; set; }
        public DateTime CreatedDate { get; set; }
        public short CreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public short? ModifiedBy { get; set; }
        public bool? Status { get; set; }
    }
}
