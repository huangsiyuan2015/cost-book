import React from "react";
import Header from "@/components/Header";
import s from "./style.module.less";

const About = () => {
  return (
    <>
      <Header title="关于我们" />
      <div className={s.about}>
        <h2>关于项目</h2>
        <article>
          该项目服务端采用 Node 上层架构 Egg.js，前端采用 React 框架 + Zarm
          移动端组件库。
        </article>
      </div>
    </>
  );
};

export default About;
