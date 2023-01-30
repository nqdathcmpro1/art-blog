import { useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthLayouts from "@/components/authLayouts";
import Layout from "@/components/homeLayouts";
import NotFound from "@/components/NotFound";

const Home = lazy(() => import("@/pages/Home"));
const ArtDetail = lazy(() => import("@/pages/ArtDetail"));
const AuthorPage = lazy(() => import("@/pages/AuthorPage"));
const Search = lazy(() => import("@/pages/Search"));
const ArtCreate = lazy(() => import("@/pages/ArtCreate"));
const EditUser = lazy(() => import("@/pages/EditUser"));
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Suspense fallback={<h1>Loading ...</h1>}>
                <Home />
              </Suspense>
            }
          />
          <Route path="user">
            <Route
              path=":author"
              element={
                <Suspense fallback={<h1>Loading ...</h1>}>
                  <AuthorPage />
                </Suspense>
              }
            />
            <Route
              path="edit"
              element={
                <Suspense fallback={<h1>Loading ...</h1>}>
                  <EditUser />
                </Suspense>
              }
            />
          </Route>
          <Route path="art">
            <Route
              path="search/:search"
              element={
                <Suspense fallback={<h1>Loading ...</h1>}>
                  <Search />
                </Suspense>
              }
            />
            <Route
              path="create"
              element={
                <Suspense fallback={<h1>Loading ...</h1>}>
                  <ArtCreate />
                </Suspense>
              }
            />
            <Route
              path=":id"
              element={
                <Suspense fallback={<h1>Loading ...</h1>}>
                  <ArtDetail />
                </Suspense>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route
          path="auth"
          element={
            <Suspense fallback={<h1>Loading ...</h1>}>
              <AuthLayouts />
            </Suspense>
          }
        >
          <Route index element={<Navigate to="login" />} />
          <Route
            path="login"
            element={
              <Suspense fallback={<h1>Loading ...</h1>}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="register"
            element={
              <Suspense fallback={<h1>Loading ...</h1>}>
                <Register />
              </Suspense>
            }
          />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
