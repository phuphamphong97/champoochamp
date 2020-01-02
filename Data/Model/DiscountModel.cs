using Data.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Model
{
  public class DiscountModel
  {
    public Employee employee { get; set; }
    public Discount discount { get; set; }
    public List<Discount> discountList { get; set; }

    public DiscountModel()
    {
      discountList = new List<Discount>();
    }

    public DiscountModel(Employee employee, Discount discount, List<Discount> discountList)
    {
      this.employee = employee;
      this.discount = discount;
      this.discountList = discountList;
    }
  }
}
