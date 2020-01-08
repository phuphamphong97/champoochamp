using Data.Entity;
using Data.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace Business
{
  public class CheckoutBusiness
  {
    public Invoice SaveInVoice(CheckoutModel checkoutModel)
    {
      using (champoochampContext db = new champoochampContext())
      {
        using (var transaction = db.Database.BeginTransaction())
        {
          try
          {
            Invoice invoice = getInvoice(checkoutModel);
            //Lưu hóa đơn
            db.Add(invoice);
            db.SaveChanges();

            //Lưu chi tiết hóa đơn
            List<InvoiceDetail> invoiceDetailList = getInvoiceDetail(checkoutModel.shoppingCartList, invoice.Id);
            foreach (InvoiceDetail item in invoiceDetailList)
            {
              db.Add(item);
            }
            //Cập nhật sản phẩm
            foreach (CartItemModel item in checkoutModel.shoppingCartList)
            {
              ProductVariant pv = db.ProductVariant.Find(item.productVariant.Id);
              Product p = db.Product.Find(item.productVariant.ProductId);
              if (pv != null && p != null)
              {
                pv.Quantity -= (short)item.quantity;
                p.TotalQuantity -= (short)item.quantity;
              }
              else
              {
                return null;
              }
            }

            //Cập nhật giỏ hàng người dùng
            User user = db.User.Find(checkoutModel.user.Id);
            if(user != null)
            {
              user.ShoppingCarts = string.Empty;
            }
            else if(checkoutModel.user.Id > 0)
            {
              return null;
            }


            db.SaveChanges();

            if (!SendEmail(checkoutModel))
            {
              return null;
            }

            transaction.Commit();
            return invoice;
          }
          catch (Exception e)
          {
            transaction.Rollback();
            return null;
          }
        }          
      }
    }

    public bool UpdateErrorInVoice(Invoice i)
    {
      using (champoochampContext db = new champoochampContext())
      {
        try
        {
          Invoice invoice = db.Invoice.Find(i.Id);
          {
            invoice.Status = i.Status;
          }

          db.SaveChanges();
          return true;
        }
        catch (Exception e)
        {
          Console.WriteLine(e.Message);
          return false;
        }
      }
    }

    public Invoice getInvoice(CheckoutModel checkoutModel)
    {
      User user = checkoutModel.user;

      Invoice invoice = new Invoice()
      {
        CustomerEmail = user.Email,
        CustomerName = user.Name,
        CustomerPhone = user.Phone,
        CustomerProvince = user.Province,
        CustomerDistrict = user.District,
        CustomerWard = user.Ward,
        CustomerAddress = user.Address,
        Message = checkoutModel.invoice.Message,
        Total = checkoutModel.invoice.Total,
        ShipMoney = checkoutModel.invoice.ShipMoney,
        PaymentMethod = checkoutModel.invoice.PaymentMethod,
        CreatedDate = DateTime.Now
      };

      if (user.Id > 0)
      {
        invoice.UserId = user.Id;
      }

      if (checkoutModel.discount != null)
      {
        invoice.DiscountCode = checkoutModel.discount.Code;
        invoice.DiscountAmount = checkoutModel.discount.Rate;
      }

      return invoice;
    }

    public List<InvoiceDetail> getInvoiceDetail(List<CartItemModel> shoppingCartList, int invoiceId)
    {
      List<InvoiceDetail> invoiceDetaiList = new List<InvoiceDetail>();

      foreach (CartItemModel item in shoppingCartList)
      {
        InvoiceDetail detail = new InvoiceDetail()
        {
          PriceCurrent = item.productVariant.Product.PromotionPrice,
          Quantity = (short)item.quantity,
          Total = Math.Round((decimal)(item.productVariant.Product.PromotionPrice * item.quantity), 0),
          CreatedDate = DateTime.Now,
          ProductVariantId = item.productVariant.Id,
          InvoiceId = invoiceId
        };

        invoiceDetaiList.Add(detail);
      }

      return invoiceDetaiList;
    }

    public bool SendEmail(CheckoutModel checkoutModel)
    {
      try
      {
        User user = checkoutModel.user;

        //string body = string.Empty;
        //using (StreamReader reader = new StreamReader(Server.MapPath("~/HtmlTemplate.html")))
        //{
        //  body = reader.ReadToEnd();
        //}
        //body = body.Replace("{UserName}", userName);  
        //body = body.Replace("{Title}", title);
        //body = body.Replace("{message}", message);

        // Credentials
        var credentials = new NetworkCredential("no.reply.guitarshop@gmail.com", "guitarshop.com");
        // Mail message
        var mail = new MailMessage()
        {
          From = new MailAddress("no.reply.guitarshop@gmail.com"),
          Subject = "Email Sender App",
          Body = "Hello"
        };
        mail.IsBodyHtml = true;
        mail.To.Add(new MailAddress(user.Email));
        // Smtp client
        var client = new SmtpClient()
        {
          Port = 587,
          DeliveryMethod = SmtpDeliveryMethod.Network,
          UseDefaultCredentials = false,
          Host = "smtp.gmail.com",
          EnableSsl = true,
          Credentials = credentials
        };
        client.Send(mail);
        return true;
      }
      catch (System.Exception e)
      {
        return false;
      }

    }
  }  
}
