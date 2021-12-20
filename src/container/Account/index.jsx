import React from "react";
import { Cell, Input, Button, Toast } from "zarm";
import { createForm } from "rc-form";
import Header from "@/components/Header";
import { post } from "utils";
import s from "./style.module.less";

const Account = ({ form }) => {
  // Account 组件经过 createForm 高阶组件包裹后，可以获取到 form 属性
  const { getFieldProps, getFieldError, validateFields } = form;

  // 提交修改方法
  const submit = () => {
    validateFields(async (error, value) => {
      if (!error) {
        console.log(value);

        if (value.newpass !== value.newpass2) {
          Toast.show("新密码输入不一致！");
          return;
        }

        try {
          const { msg } = await post(`/api/user/modify_pass`, {
            oldpass: value.oldpass,
            newpass: value.newpass,
            newpass2: value.newpass2,
          });

          Toast.show(msg);
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  return (
    <>
      <Header title="重置密码" />
      <div className={s.account}>
        <div className={s.form}>
          <Cell title="原密码">
            <Input
              clearable
              type="password"
              placeholder="请输入原密码"
              {...getFieldProps("oldpass", { rules: [{ required: true }] })}
            />
          </Cell>
          <Cell title="新密码">
            <Input
              clearable
              type="password"
              placeholder="请输入新密码"
              {...getFieldProps("newpass", { rules: [{ required: true }] })}
            />
          </Cell>
          <Cell title="新密码">
            <Input
              clearable
              type="password"
              placeholder="请输入新密码"
              {...getFieldProps("newpass2", { rules: [{ required: true }] })}
            />
          </Cell>
        </div>
        <Button className={s.btn} block theme="primary" onClick={submit}>
          提交
        </Button>
      </div>
    </>
  );
};

export default createForm()(Account);
