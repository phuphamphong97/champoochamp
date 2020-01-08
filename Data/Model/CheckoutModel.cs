using Data.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Model
{
  public class CheckoutModel
  {
    public User user { get; set; }
    public List<CartItemModel> shoppingCartList { get; set; }
    public Invoice invoice { get; set; }
    public Discount discount { get; set; }

    public CheckoutModel()
    {
      shoppingCartList = new List<CartItemModel>();
    }

    public CheckoutModel(User user, List<CartItemModel> shoppingCartList, Invoice invoice, Discount discount)
    {
      this.user = user;
      this.shoppingCartList = shoppingCartList;
      this.invoice = invoice;
      this.discount = discount;
    }
  }
}
