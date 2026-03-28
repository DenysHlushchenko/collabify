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
import PageTitle from "./modules/shared/components/PageTitle";

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

        <section className="flex flex-1 flex-col overflow-y-auto px-6 pt-20 pb-6 max-md:pb-14 sm:px-6">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
            <Toaster />
          </div>
        </section>

        {isChatsRoute ? (
          <section className="md:custom-scrollbar sticky top-0 right-0 flex h-screen w-60 flex-col gap-6 overflow-y-auto border-l border-l-gray-300 p-6 pt-36 max-md:hidden">
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
        <Route
          path="/register"
          element={
            <>
              <PageTitle title="Register" />
              <Register />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <PageTitle title="Login" />
              <Login />
            </>
          }
        />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<App />}>
          <Route
            index
            element={
              <>
                <PageTitle title="Home" />
                <HomePage />
              </>
            }
          />
          <Route path="chats">
            <Route
              index
              element={
                <>
                  <PageTitle title="Chats" />
                  <ChatsPage />
                </>
              }
            />
            <Route
              path=":chatId"
              element={
                <>
                  <PageTitle title="Conversation" />
                  <ConversationPage />
                </>
              }
            />
          </Route>
          <Route
            path="posts"
            element={
              <>
                <PageTitle title="Posts" />
                <PostsPage />
              </>
            }
          />
          <Route
            path="posts/:postId"
            element={
              <>
                <PageTitle title="Post Details" />
                <PostDetails />
              </>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <>
                <PageTitle title="Profile" />
                <UserProfile />
              </>
            }
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <>
            <PageTitle title="Not Found" />
            <NotFoundPage />
          </>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
