using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Business;
using Data.Entity;
using Data.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class InvoiceController : ControllerBase
  {
    InvoiceBusiness invoiceBusiness = new InvoiceBusiness();

    [Route("GetAllInvoices")]
    public IEnumerable<Invoice> GetAllInvoices()
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          return db.Invoice.Where(p => p.Status != -1).ToList();
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    [HttpPost]
    [Route("UpdateInvoices")]
    public IEnumerable<Invoice> UpdateInvoices(InvoiceModel invoiceModel)
    {
      return invoiceBusiness.UpdateInvoices(invoiceModel);
    }
  }
}