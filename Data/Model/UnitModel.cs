using Data.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Model
{
  public class UnitModel
  {
    public Employee employee { get; set; }
    public Unit unit { get; set; }
    public List<Unit> unitList { get; set; }

    public UnitModel()
    {
      unitList = new List<Unit>();
    }

    public UnitModel(Employee employee, Unit unit, List<Unit> unitList)
    {
      this.employee = employee;
      this.unit = unit;
      this.unitList = unitList;
    }
  }
}
