import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "@/routes/layout";
import Page from "@/routes/dashboard/page";
import Login from "./routes/Pages/Login";
import EditProfile from "./routes/Pages/EditProfile";

import ManageUsers from "./routes/Pages/ManageUsers";
import ManageProfile from "./routes/Pages/ManageProfile";
import ManageReligion from "./routes/Pages/ManageReligion";
import AddReligion from "./routes/Pages/AddReligion";
import ManageCaste from "./routes/Pages/ManageCaste";
import AddCaste from "./routes/Pages/AddCaste";
import AddSubCaste from "./routes/Pages/AddSubCaste";
import ManageSubCaste from "./routes/Pages/ManageSubCaste";
import AddEducation from "./routes/Pages/AddEducation";
import ManageEducation from "./routes/Pages/ManageEducation";
import AddMotherTongue from "./routes/Pages/AddMotherTongue";
import ManageMotherTongue from "./routes/Pages/ManageMotherTongue";
import AddProfession from "./routes/Pages/AddProfession";
import ManageProfession from "./routes/Pages/ManageProfession";
import ManageLocation from "./routes/Pages/ManagerLocation";
import AddLocation from "./routes/Pages/AddLocation";
import ManageRaasi from "./routes/Pages/ManageRaasi";
import AddRaasi from "./routes/Pages/AddRaasi";
import CreateProfile from "./routes/Pages/CreateProfile";
import ManagePlans from "./routes/Pages/ManagePlans";
import AddPlan from "./routes/Pages/AddPlan";
import EditPlan from "./routes/Pages/EditPlan";
import Home from "./routes/Pages/Home";
import AddBanner from "./routes/Pages/AddBanner";
import EditBanner from "./routes/Pages/EditBanner";
import ManageBanner from "./routes/Pages/ManageBanner";
import ManageAbout from "./routes/Pages/ManageAbout";
import AddAbout from "./routes/Pages/AddAbout";
import EditAbout from "./routes/Pages/EditAbout";

import ManageContact from "./routes/Pages/ManageContact";
import AddContact from "./routes/Pages/AddContact";
import EditContact from "./routes/Pages/EditContact";


// Terms & Privacy Management
import ManageTermsPrivacy from "./routes/Pages/ManageTermsPrivacy";
import AddTermsPrivacy from "./routes/Pages/AddTermsPrivacy";
import EditTermsPrivacy from "./routes/Pages/EditTermsPrivacy";
import RefrealSetting from "./routes/Pages/RefrealSetting";



function App() {
    const router = createBrowserRouter([
        {
            path: "/",
            element:  <Login />,
        },
   
   
      {
            path: "/",
            element:  <Home />,
        },
        {
            path: "/",
            element: <Layout />,
            children: [
                {
                   path:"/dashboard",
                    index: true,
                    element: <Page />,
                },
                {
                    path:"/editprofile/:id",
                    index: true,
                    element: <EditProfile />,
                }, 
                
                  {
                    path:"/users",
                    index: true,
                    element: <ManageUsers />,
                }, 
                    {
                    path:"/religion",
                    index: true,
                    element: <ManageReligion />,
                }, 
                     {
                    path:"/addreligion",
                    index: true,
                    element: <AddReligion />,
                }, 
                         {
                    path:"/caste",
                    index: true,
                    element: <ManageCaste />,
                }, 
                     {
                    path:"/addcaste",
                    index: true,
                    element: <AddCaste />,
                }, 
                             {
                    path:"/caste",
                    index: true,
                    element: <ManageCaste />,
                }, 
                     {
                    path:"/addsubcaste",
                    index: true,
                    element: <AddSubCaste />,
                }, 
                  {
                    path:"/subcaste",
                    index: true,
                    element: <ManageSubCaste />,
                }, 
                        {
                    path:"/addeducation",
                    index: true,
                    element: <AddEducation />,
                }, 
                  {
                    path:"/education",
                    index: true,
                    element: <ManageEducation />,
                }, 
                           {
                    path:"/addmothertongue",
                    index: true,
                    element: <AddMotherTongue />,
                }, 
                  {
                    path:"/mothertongue",
                    index: true,
                    element: <ManageMotherTongue />,
                }, 
                           {
                    path:"/addprofession",
                    index: true,
                    element: <AddProfession />,
                }, 
                  {
                    path:"/profession",
                    index: true,
                    element: <ManageProfession />,
                }, 
                           {
                    path:"/addlocation",
                    index: true,
                    element: <AddLocation />,
                }, 
                  {
                    path:"/location",
                    index: true,
                    element: <ManageLocation/>,
                }, 
                                   {
                    path:"/addraasi",
                    index: true,
                    element: <AddRaasi />,
                }, 
                  {
                    path:"/raasi",
                    index: true,
                    element: <ManageRaasi/>,
                }, 
                      {
                    path:"/addprofile",
                    index: true,
                    element: <CreateProfile/>,
                }, 
                     {
                    path:"/profiles",
                    index: true,
                    element: <ManageProfile />,
                }, 
                      {
                    path:"/plans",
                    index: true,
                    element: <ManagePlans />,
                }, 
                      {
                    path:"/addplan",
                    index: true,
                    element: <AddPlan />,
                },         {
                    path:"/editplan/:id",
                    index: true,
                    element: <EditPlan />,
                }, 
                 {
                    path: "/addbanner",
                    index: true,
                    element: <AddBanner />,
                },

                {
                    path: "/editbanner/:id",
                    index: true,
                    element: <EditBanner />,
                },
                {
                    path: "/managebanner",
                    index: true,
                    element: <ManageBanner />,
                },
                 {
                    path: "/terms-privacy",
                    index: true,
                    element: <ManageTermsPrivacy />,
                },
                {
                    path: "/addtermsprivacy",
                    index: true,
                    element: <AddTermsPrivacy />,
                },
                {
                    path: "/edittermsprivacy/:id",
                    index: true,
                    element: <EditTermsPrivacy />,
                },
                  {
                    path: "/about",
                    index: true,
                    element: <ManageAbout />,
                },
                {
                    path: "/addabout",
                    index: true,
                    element: <AddAbout />,
                },
                {
                    path: "/editabout/:id",
                    index: true,
                    element: <EditAbout />,
                },
                {
                    path: "/contact",
                    index: true,
                    element: <ManageContact />,
                },
                {
                    path: "/addcontact",
                    index: true,
                    element: <AddContact />,
                },
                {
                    path: "/editcontact/:id",
                    index: true,
                    element: <EditContact />,
                },
                {
                    path: "/refrealSetting",
                    index: true,
                    element: <RefrealSetting />,
                },
            ],
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
