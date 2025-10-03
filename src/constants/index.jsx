// admin-panel/src/constants/navbarLinks.js
// Make sure you have @tabler/icons-react installed: npm install @tabler/icons-react
import {
  IconDashboard,
  IconUser, 
  IconUsers, 
  IconSettings,
  IconScale, 
  IconInfoCircle, 
  IconFileDescription, 
  IconPhoneCall, 
  IconBook,      
  IconBriefcase,  
  IconLanguage,   
  IconRosette,    
  IconUsersGroup, 
  IconUserCircle, 
   IconPhoto,
IconBuildingChurch,
 IconZodiacLeo
} from "@tabler/icons-react";
import { FaGift } from "react-icons/fa";
export const navbarLinks = {
  Admin: [
    {
      label: "Dashboard",
      icon: IconDashboard,
      path: "/dashboard",
    },
    {
      label: "User Management", 
      icon: IconUser,
      path: "/users",
    },
    {
      label: "Profile Management", 
      icon: IconUsers,
      path: "/profiles",
    },

   
    {
      label: "Masters",
      icon: IconBook,
      subMenu: [
        {
          label: "Religion",
          icon: IconRosette,
          path: "/religion",
        },
        {
          label: "Cast",
          icon: IconUsersGroup,
          path: "/caste",
        },
        {
          label: "Subcast",
          icon: IconUserCircle,
          path: "/subcaste",
        },
        {
          label: "Education",
          icon: IconBook,
          path: "/education",
        },
        {
          label: "Profession",
          icon: IconBriefcase,
          path: "/profession",
        },
        {
          label: "Mother Tongue",
          icon: IconLanguage,
          path: "/mothertongue",
        },
          {
          label: "Raasi",
          icon: IconBuildingChurch,
          path: "/raasi",
        },
          {
          label: "Location",
          icon: IconZodiacLeo,
          path: "/location",
        },
      ],
    },

    {
      label: "Settings",
      icon: IconSettings,
      path: "/settings",
      subMenu: [
      {
          label: "Plans Management",  
          icon: IconScale,
          path: "/plans",
        },
            {
          label: "Refreal Setting",  
          icon: FaGift,
          path: "/refrealsetting",
        },
         {
        label: "Manage Banners",
        icon:  IconPhoto,
        path: "/managebanner",
      },
        {
          label: "About MorJodi",
          icon: IconInfoCircle,
          path: "/about",
        },
        {
          label: "Terms & Privacy",
          icon: IconFileDescription,
          path: "/terms-privacy",
        },
        {
          label: "Contact Info",
          icon: IconPhoneCall,
          path: "/contact",
        },
      ],
    },
  ],
};
