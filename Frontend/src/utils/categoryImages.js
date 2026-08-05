import plumbingImg from "../assets/categories/plumbing.png";
import electricalImg from "../assets/categories/electrical.png";
import carpentryImg from "../assets/categories/carpentry.png";
import paintingImg from "../assets/categories/painting.png";
import defaultImg from "../assets/categories/default.png";

export const getCategoryImage = (categoryName) => {
  if (!categoryName) return defaultImg;
  
  const name = categoryName.toLowerCase();
  
  if (name.includes("plumb")) return plumbingImg;
  if (name.includes("electric")) return electricalImg;
  if (name.includes("carpent") || name.includes("wood")) return carpentryImg;
  if (name.includes("paint")) return paintingImg;
  
  return defaultImg;
};
