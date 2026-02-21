import { Outlet, Route, Routes, useLocation } from "react-router-dom";
import LeftsideBar from "./modules/navigation/components/LeftsideBar";
import Navbar from "./modules/navigation/components/Navbar";
import Home from "./modules/navigation/pages/Home";
import Messages from "./modules/navigation/pages/Messages";
import Posts from "./modules/navigation/pages/Posts";
import NotFound from "./modules/navigation/pages/NotFound";
import RightsideBar from "./modules/navigation/components/RightsideBar";
import Register from "./modules/auth/pages/Register";
import Login from "./modules/auth/pages/Login";
import ProtectedRoute from "./modules/auth/components/ProtectedRoute";
import PublicRoute from "./modules/auth/components/PublicRoute";
import UserProfile from "./modules/profile/pages/UserProfile";

function App() {
  const { pathname } = useLocation();
  const showRightsideBar = pathname !== "/messages";
  return (
    <main className="relative">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl">
        <LeftsideBar />

        <section className="flex flex-1 flex-col overflow-y-auto px-6 pt-20 pb-6 max-md:pb-14 sm:px-14">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
          </div>
        </section>

        {showRightsideBar && <RightsideBar />}
      </div>
    </main>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<App />}>
          <Route index element={<Home />} />
          <Route path="messages" element={<Messages />} />
          <Route path="posts" element={<Posts />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
