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
          foreach(string id in invoiceModel.invoiceIds)
          {
            Invoice invoice = db.Invoice.Find(Int32.Parse(id));
            if (invoice != null)
            {
              if(invoice.Status == 0)
              {
                invoice.Status = 1;
                invoice.ModifiedBy = invoiceModel.employee.Id;
              }
              else if(invoice.Status == 1)
              {
                invoice.Status = 0;
                invoice.ModifiedBy = invoiceModel.employee.Id;
              }
            }
          }

          db.SaveChanges();
          return db.Invoice.Where(p => p.Status != -1).ToList();
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
