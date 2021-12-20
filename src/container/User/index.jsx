import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cell, Button } from "zarm";
import { get } from "utils";
import s from "./style.module.less";

const User = () => {
  const [user, setUser] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo();
  }, []);

  // 获取用户信息
  const getUserInfo = async () => {
    try {
      const { data } = await get(`/api/user/get_userinfo`);
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={s.user}>
      <div className={s.head}>
        <div className={s.info}>
          <span>昵称：{user.username || "--"}</span>
          <span>
            <img
              src="//s.yezgea02.com/1615973630132/geqian.png"
              alt="icon"
              style={{ width: 30, height: 30, verticalAlign: "-10px" }}
            />
            <b>个性签名：{user.signature || "这个人很懒，什么都不写"}</b>
          </span>
        </div>
        <img
          className={s.avatar}
          src={user.avatar || "//s.yezgea02.com/1624959897466/avatar.jpeg"}
          alt="avatar"
          style={{ width: 60, height: 60, borderRadius: 8 }}
        />
      </div>
      <div className={s.content}>
        <Cell
          hasArrow
          title="用户信息修改"
          icon={
            <img
              src="//s.yezgea02.com/1615974766264/gxqm.png"
              alt="icon"
              style={{ width: 20, verticalAlign: "-7px" }}
            />
          }
          onClick={() => navigate("/userinfo")}
        />
        <Cell
          hasArrow
          title="重置密码"
          icon={
            <img
              src="//s.yezgea02.com/1615974766264/zhaq.png"
              alt="icon"
              style={{ width: 20, verticalAlign: "-7px" }}
            />
          }
          onClick={() => navigate("/account")}
        />
        <Cell
          hasArrow
          title="关于我们"
          icon={
            <img
              src="//s.yezgea02.com/1615975178434/lianxi.png"
              alt="icon"
              style={{ width: 20, verticalAlign: "-7px" }}
            />
          }
          onClick={() => navigate("/about")}
        />
      </div>
      <Button className={s.logout} block theme="danger" onClick={logout}>
        退出登录
      </Button>
    </div>
  );
};

export default User;
