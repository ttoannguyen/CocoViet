import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ArrowLeftIcon,
  Bars3Icon,
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

// const { setShowSearch, getCartCount } = useContext(ShopContext);
const Navbar = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to={"/"}>
        {/* <img src={assets.logo} className="w-36" alt="" /> */}
        Logo
      </Link>
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to={"/"} className="flex flex-col items-center gap-1 ">
          <p className="uppercase">Trang chủ</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to={"/products"} className="flex flex-col items-center gap-1 ">
          <p className="uppercase">Sản phẩm</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to={"/about"} className="flex flex-col items-center gap-1 ">
          <p className="uppercase">Giới thiệu</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
        <NavLink to={"/blogs"} className="flex flex-col items-center gap-1 ">
          <p className="uppercase">Bài viết</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <MagnifyingGlassIcon className="size-7" />

        <div className="group relative">
          <Link to="/login">
            <UserCircleIcon className="size-7" />
          </Link>
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex  flex-col gap-2 w-36 px-5 py-3 bg-slate-100 text-gray-500 rounded">
              <p className=" cursor-pointer hover:text-black">My Profile</p>
              <p className=" cursor-pointer hover:text-black">Order</p>
              <p className=" cursor-pointer hover:text-black">Logout</p>
            </div>
          </div>
        </div>
        <Link to="/cart" className="relative">
          <ShoppingBagIcon className="size-7 cursor-pointer" />

          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white rounded-full text-[8px]">
            9{/* {getCartCount()} */}
          </p>
        </Link>
        <Bars3Icon
          className="w-7 h-7 cursor-pointer"
          onClick={() => setVisible(true)}
        />
      </div>
      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all  ${
          visible ? "w-full" : "w-0"
        } `}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <ArrowLeftIcon className="w-5 h-5 cursor-pointer" />
          </div>
          <NavLink
            className="py-2 pl-6 border-t uppercase"
            onClick={() => setVisible(false)}
            to="/"
          >
            Trang chủ
          </NavLink>
          <NavLink
            className="py-2 pl-6 border-t uppercase"
            onClick={() => setVisible(false)}
            to="/products"
          >
            Sản phẩm
          </NavLink>
          <NavLink
            className="py-2 pl-6 border-t uppercase"
            onClick={() => setVisible(false)}
            to="/about"
          >
            Giới thiệu
          </NavLink>
          <NavLink
            className="py-2 pl-6 border-y uppercase"
            onClick={() => setVisible(false)}
            to="/blogs"
          >
            Bài viết
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
