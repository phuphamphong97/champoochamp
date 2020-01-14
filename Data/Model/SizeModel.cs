using Data.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Model
{
  public class SizeModel
  {
    public Employee employee { get; set; }
    public Size size { get; set; }
    public List<Size> sizeList { get; set; }

    public SizeModel()
    {
      sizeList = new List<Size>();
    }

    public SizeModel(Employee employee, Size size, List<Size> sizeList)
    {
      this.employee = employee;
      this.size = size;
      this.sizeList = sizeList;
    }
  }
}
