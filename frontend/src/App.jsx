import {createBrowserRouter, Outlet, RouterProvider} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/Home/home";
import Gigs from "./pages/gigs/Gigs";
import Gig from "./pages/gig/Gig";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Add from "./pages/add/Add";
import Orders from "./pages/orders/Orders";
import Messages from "./pages/messages/Messages";
import Message from "./pages/message/Message";
import MyGigs from "./pages/myGigs/MyGigs";
 import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Pay from "./pages/pay/Pay";
import Success from "./pages/success/Success";
import Profile from "./pages/Profile/Profile.jsx";
import Profileedite from "./pages/Profile/Profile-edit.jsx";
import Order from "./pages/orderstable/orderstable.jsx";
import Forgot from "./pages/forgot/ForgetPassword.jsx";
import Reset from "./pages/forgot/ResetPassword.jsx";

import AdminDashboard from "./pages/admin/admindashboard/admindashboard.jsx";


function App() {
  const queryClient = new QueryClient();

  const Layout = () => {
    return (
      <div className="app">
        <QueryClientProvider client={queryClient}>
          <Navbar />
          <Outlet />
          <Footer />
        </QueryClientProvider>
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/gigs",
          element: <Gigs />,
        },
        {
          path: "/myGigs",
          element: <MyGigs />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/profileedit",
          element: <Profileedite />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/ordertable",
          element: <Order />,
        },
        {
          path: "/messages",
          element: <Messages />,
        },
        {
          path: "/message/:id",
          element: <Message />,
        },
        {
          path: "/add",
          element: <Add />,
        },
        {
          path: "/gig/:id",
          element: <Gig />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/pay/:id",
          element: <Pay />,
        },
        {
          path: "/success",
          element: <Success />,
        },
        {
          path: "/forgot",
          element: <Forgot />,
        },
        {
          path: "/api/password/ResetPassword",
          element: <Reset />,
        },
      ],
    },
    {
      path: "/admindashboard",
      element: <AdminDashboard />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
