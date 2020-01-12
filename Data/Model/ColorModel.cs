using Data.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Model
{
  public class ColorModel
  {
    public Employee employee { get; set; }
    public Color color { get; set; }
    public List<Color> colorList { get; set; }

    public ColorModel()
    {
      colorList = new List<Color>();
    }

    public ColorModel(Employee employee, Color color, List<Color> colorList)
    {
      this.employee = employee;
      this.color = color;
      this.colorList = colorList;
    }
  }
}
