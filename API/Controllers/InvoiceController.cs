using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Business;
using Data.Entity;
using Data.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
          return db.Invoice.ToList();
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return null;
        }
      }
    }

    [Route("GetAllInvoiceDetailsByInvoiceId-{id}")]
    public IEnumerable<InvoiceDetail> GetAllInvoiceDetailsByInvoiceId(int id)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          List<InvoiceDetail> invoiceDetailList = new List<InvoiceDetail>();
          invoiceDetailList = db.InvoiceDetail.Where(p => p.InvoiceId == id)
                              .Include(p => p.ProductVariant)
                                .ThenInclude(p => p.Product)
                              .ToList();

          return invoiceDetailList;
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

    [Route("PutInvoice")]
    [HttpPut]
    public Invoice PutInvoice(InvoiceModel invoiceModel)
    {
      return invoiceBusiness.putInvoice(invoiceModel);
    }
  }
}