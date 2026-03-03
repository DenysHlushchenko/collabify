import { Outlet, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import LeftsideBar from "./modules/navigation/components/LeftsideBar";
import Navbar from "./modules/navigation/components/Navbar";
import HomePage from "./modules/navigation/pages/HomePage";
import PostsPage from "./modules/navigation/pages/PostsPage";
import NotFoundPage from "./modules/navigation/pages/NotFoundPage";
import RightsideBar from "./modules/navigation/components/RightsideBar";
import Register from "./modules/auth/pages/Register";
import Login from "./modules/auth/pages/Login";
import ProtectedRoute from "./modules/auth/components/ProtectedRoute";
import PublicRoute from "./modules/auth/components/PublicRoute";
import UserProfile from "./modules/profile/pages/UserProfile";
import PostDetails from "./modules/posts/pages/PostDetails";
import { useEffect } from "react";
import { useAuthStore } from "./modules/auth/store/userStore";
import { Toaster } from "@/modules/shared/components/ui/Sonner";
import ChatsPage from "./modules/chats/pages/ChatsPage";
import ConversationPage from "./modules/chats/pages/ConversationPage";
import UserChats from "./modules/chats/components/UserChats";

function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const logout = useAuthStore((state) => state.logout);
  const isChatsRoute = pathname.startsWith("/chats");

  useEffect(() => {
    if (!isAuthenticated) {
      logout();
      navigate("/login");
    }
  });

  return (
    <main className="relative">
      <Navbar />
      <div className="mx-auto flex w-full max-w-7xl">
        <LeftsideBar />

        <section className="flex flex-1 flex-col overflow-y-auto px-6 pt-20 pb-6 max-md:pb-14 sm:px-10">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
            <Toaster />
          </div>
        </section>

        {isChatsRoute ? (
          <section className="custom-scrollbar sticky top-0 right-0 flex h-screen w-40 flex-col gap-6 overflow-y-auto border-l border-l-gray-300 p-6 pt-36 max-md:hidden">
            <UserChats />
          </section>
        ) : (
          <RightsideBar />
        )}
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
          <Route index element={<HomePage />} />
          <Route path="chats">
            <Route index element={<ChatsPage />} />
            <Route path=":chatId" element={<ConversationPage />} />
          </Route>
          <Route path="posts" element={<PostsPage />} />
          <Route path="posts/:postId" element={<PostDetails />} />
          <Route path="/profile/:userId" element={<UserProfile />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
