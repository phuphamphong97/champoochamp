using Data.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Model
{
  public class InvoiceModel
  {
    public Employee employee { get; set; }
    public string[] invoiceIds { get; set; }

    public InvoiceModel(Employee employee, string[] invoiceIds)
    {
      this.employee = employee;
      this.invoiceIds = invoiceIds;
    }
  }
}
