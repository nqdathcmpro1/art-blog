import React, { memo, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { SearchOutlined, MenuOutlined } from "@ant-design/icons";

import logo from "public/logo-art.png";
import defaultAvatar from "public/default-avatar.png";
import { fetchAuthor } from "@/api/userApi";
import { logoutThunk } from "@/thunks/authThunk";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [searchText, setSearchText] = useState("");

  const navBarRef = useRef();
  const menuButtonRef = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.authReducer.loginUser);

  useEffect(() => {
    const windowClick = (e) => {
      if (
        !e.composedPath().includes(navBarRef.current) &&
        !e.composedPath().includes(menuButtonRef.current)
      )
        setOpenMenu(false);
    };
    window.addEventListener("click", windowClick);
    return () => window.removeEventListener("click", windowClick);
  }, []);

  const { data } = useQuery({
    queryKey: ["fetchCurrentUser", user],
    queryFn: () => fetchAuthor(user?.userName),
    retry: false,
    enabled: !!user,
  });

  const handleOpenMenu = () => {
    setOpenMenu(!openMenu);
  };

  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSubmitSearch = (e) => {
    e.preventDefault();
    if (searchText !== "") {
      navigate(`art/search/${searchText}`);
      setOpenMenu(false);
    }
  };

  const handleLogin = () => {
    navigate("/auth/login");
  };

  const handleLogout = async () => {
    const logoutUser = await dispatch(logoutThunk(user?._id));
    if (logoutUser.payload.status === 200) navigate("/auth/login");
  };

  return (
    <nav className="w-full md:px-5 max-h-[1000px] sticky top-0 shadow-lg md:flex md:items-center justify-between bg-white z-20">
      <span
        name="logo"
        className="w-full py-2 md:w-32 flex items-center justify-between "
      >
        <Link to="/">
          <img
            src={logo}
            alt="logo"
            className="w-40 h-16 object-contain cursor-pointer"
          />
        </Link>
        <MenuOutlined
          ref={menuButtonRef}
          title="Menu"
          onClick={handleOpenMenu}
          className="w-16 h-16 p-2 text-3xl md:hidden font-extrabold flex items-center justify-center cursor-pointer rounded-full hover:bg-slate-300/50"
        />
      </span>

      <ul
        ref={navBarRef}
        className={
          "md:flex absolute bg-white w-full px-3 py-5 right-0 md:static md:items-center items-end justify-end shadow-lg md:shadow-none gap-5 flex-col md:flex-row " +
          (openMenu ? "flex" : "hidden")
        }
      >
        <li className="px-3 py-1 bg-slate-200 w-full md:w-7/12 m-0 rounded-full ">
          <form
            className="w-full h-full flex items-center justify-between"
            onSubmit={handleSubmitSearch}
          >
            <input
              type="text"
              className="w-full pl-1 text-lg bg-transparent focus:outline-none"
              placeholder="Finding for..."
              onChange={handleChange}
            />
            <SearchOutlined
              title="Finding for..."
              type="submit"
              className="w-10 h-10 text-3xl flex items-center justify-center cursor-pointer"
            />
          </form>
        </li>
        {user ? (
          <>
            <li name="author-avatar" className="w-fit h-fit">
              <Link
                className="flex items-center gap-1"
                to={`/user/${data?.data.data.userName}`}
              >
                <img
                  title={data?.data.data.fullName}
                  src={data?.data.data.avatar || defaultAvatar}
                  alt="default avatar"
                  className="w-12 h-12 rounded-full aspect-square object-cover"
                />
                <p className="w-fit flex md:hidden font-semibold">
                  {data?.data.data.fullName}
                </p>
              </Link>
            </li>
            <button
              name="logout-button"
              className="w-24 h-10 bg-red-600 text-white font-semibold rounded-full hover:bg-red-800 cursor-pointer"
              onClick={handleLogout}
            >
              Log out
            </button>
          </>
        ) : (
          <button
            name="login-button"
            className="mx-1 w-20 h-10 bg-red-600 text-white font-semibold rounded-full hover:bg-red-800 cursor-pointer"
            onClick={handleLogin}
          >
            Log in
          </button>
        )}
      </ul>
    </nav>
  );
};

export default memo(Navbar);
