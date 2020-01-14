using Data.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Model
{
  public class InvoiceModel
  {
    public Employee employee { get; set; }
    public Invoice invoice { get; set; }
    public List<Invoice> invoiceList { get; set; }

    public InvoiceModel()
    {
      invoiceList = new List<Invoice>();
    }

    public InvoiceModel(Employee employee, Invoice invoice, List<Invoice> invoiceList)
    {
      this.employee = employee;
      this.invoice = invoice;
      this.invoiceList = invoiceList;
    }
  }
}
