using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace Business
{
  public static class Services
  {
    public static bool SaveImage(string folderPath, string fileName, string imageUrl)
    {
      try
      {   
        //Check if directory exist
        //if (!Directory.Exists(folderPath))
        //{
        //  Directory.CreateDirectory(folderPath); //Create directory if it doesn't exist
        //}

        string imagePath = folderPath + fileName;
        string ImgStr = imageUrl.Replace("data:image/png;base64,", "");
        byte[] imageBytes = Convert.FromBase64String(ImgStr);
        File.WriteAllBytes(imagePath, imageBytes);

        return true;
      }
      catch (Exception e)
      {
        return false;
      }
    }
  }
}
