using Data.Entity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Data.Model
{
  public class MaterialModel
  {
    public Employee employee { get; set; }
    public Material material { get; set; }
    public List<Material> materialList { get; set; }

    public MaterialModel()
    {
      materialList = new List<Material>();
    }

    public MaterialModel(Employee employee, Material material, List<Material> materialList)
    {
      this.employee = employee;
      this.material = material;
      this.materialList = materialList;
    }
  }
}
