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
              invoice.ModifiedDate = DateTime.Now;
              invoice.ModifiedBy = invoiceModel.employee.UserName;
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

    public Invoice putInvoice(InvoiceModel invoiceModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Invoice invoice = db.Invoice.Find(invoiceModel.invoice.Id);
          invoice.CustomerName = invoiceModel.invoice.CustomerName;
          invoice.CustomerEmail = invoiceModel.invoice.CustomerEmail;
          invoice.CustomerPhone = invoiceModel.invoice.CustomerPhone;
          invoice.CustomerProvince = invoiceModel.invoice.CustomerProvince;
          invoice.CustomerDistrict = invoiceModel.invoice.CustomerDistrict;
          invoice.CustomerWard = invoiceModel.invoice.CustomerWard;
          invoice.CustomerAddress = invoiceModel.invoice.CustomerAddress;
          invoice.Message = invoiceModel.invoice.Message;
          invoice.PaymentMethod = invoiceModel.invoice.PaymentMethod;
          invoice.Status = invoiceModel.invoice.Status;
          invoice.ModifiedDate = DateTime.Now;
          invoice.ModifiedBy = invoiceModel.employee.UserName;

          db.SaveChanges();
          return invoice;
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
