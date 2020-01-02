using Data.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Model
{
  public class SuplierModel
  {
    public Employee employee { get; set; }
    public Suplier suplier { get; set; }
    public List<Suplier> suplierList { get; set; }

    public SuplierModel()
    {
      suplierList = new List<Suplier>();
    }

    public SuplierModel(Employee employee, Suplier suplier, List<Suplier> suplierList)
    {
      this.employee = employee;
      this.suplier = suplier;
      this.suplierList = suplierList;
    }
  }
}
