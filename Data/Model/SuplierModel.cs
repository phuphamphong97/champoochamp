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
    public string thumbnailBase64 { get; set; }
    public string folderName { get; set; }
    public List<Suplier> suplierList { get; set; }

    public SuplierModel()
    {
      suplierList = new List<Suplier>();
    }

    public SuplierModel(Employee employee, Suplier suplier, string thumbnailBase64, string folderName, List<Suplier> suplierList)
    {
      this.employee = employee;
      this.suplier = suplier;
      this.thumbnailBase64 = thumbnailBase64;
      this.folderName = folderName;
      this.suplierList = suplierList;
    }
  }
}
