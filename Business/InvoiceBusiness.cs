using Data.Entity;
using Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Business
{
  public class InvoiceBusiness
  {
    public IEnumerable<Invoice> UpdateInvoices(InvoiceModel invoiceModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          foreach(Invoice i in invoiceModel.invoiceList)
          {
            Invoice invoice = db.Invoice.Find(i.Id);
            if (invoice != null)
            {
              invoice.Status = i.Status;
              invoice.ModifiedBy = invoiceModel.employee.Id;
            }
          }

          db.SaveChanges();
          return db.Invoice.ToList();
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }
  }
}
