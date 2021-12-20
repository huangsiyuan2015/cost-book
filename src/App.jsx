import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ConfigProvider } from "zarm";
import zhCN from "zarm/lib/config-provider/locale/zh_CN";
import Home from "./container/Home";
import Data from "./container/Data";
import User from "./container/User";
import NavBar from "@/components/NavBar";
import Detail from "./container/Detail";
import Login from "./container/Login";
import UserInfo from "./container/UserInfo";
import Account from "./container/Account";
import About from "./container/About";

function App() {
  // 是否显示底部导航栏
  const [showNav, setShowNav] = useState(false);

  const navs = ["/", "/data", "/user"];
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    // 如果当前路径包含底部导航的 url，就显示底部导航
    setShowNav(navs.includes(pathname));
  }, [pathname]);

  return (
    <ConfigProvider primaryColor={"#007fff"} locale={zhCN}>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/detail" element={<Detail />} />
          <Route path="/data" element={<Data />} />
          <Route path="/user" element={<User />} />
          <Route path="/userinfo" element={<UserInfo />} />
          <Route path="/account" element={<Account />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <NavBar showNav={showNav} />
      </div>
    </ConfigProvider>
  );
}

export default App;
