import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FilePicker, Button, Input, Toast } from "zarm";
import Header from "@/components/Header";
import axios from "axios";
import { get, post } from "utils";
// import { baseUrl } from "config";
import s from "./style.module.less";

const UserInfo = () => {
  const [user, setUser] = useState({}); // 用户信息
  const [avatar, setAvatar] = useState(""); // 头像
  const [signature, setSignature] = useState(""); // 个性签名

  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo();
  }, []);

  // 获取用户信息
  const getUserInfo = async () => {
    try {
      const { data } = await get(`/api/user/get_userinfo`);
      setUser(data);
      setAvatar(data.avatar);
      setSignature(data.signature);
    } catch (error) {
      console.log(error);
    }
  };

  // 获取图片回调
  const handleSelect = (file) => {
    console.log("file", file);
    console.log("file.file", file.file);

    if (file && file.file.size > 200 * 1024) {
      Toast.show("上传头像不得超过 200kb！");
      return;
    }

    let formData = new FormData();
    formData.append("file", file.file);

    // 配置发送表单的请求头
    // 因为默认配置发送的是 form-urlencoded 格式
    axios({
      method: "post",
      url: `/api/upload`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log(res);
        setAvatar(`http://localhost:7001${res.data}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // 提交编辑的用户信息
  const save = async () => {
    try {
      const { data } = await post(`/api/user/edit_userinfo`, {
        signature,
        avatar,
      });

      Toast.show("修改成功");
      navigate(-1); // 修改成功后返回个人中心
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header title="用户信息" />
      <div className={s.userinfo}>
        <h1>个人资料</h1>
        <div className={s.item}>
          <div className={s.title}>头像</div>
          <div className={s.avatar}>
            <img className={s.avatarUrl} src={avatar} alt="avatar" />
            <div className={s.desc}>
              <span>支持 jpg、png、jpeg 格式大小 200kb 以内的图片</span>
              <FilePicker onChange={handleSelect} accept="image/">
                <Button theme="primary" size="xs">
                  点击上传
                </Button>
              </FilePicker>
            </div>
          </div>
        </div>
        <div className={s.item}>
          <div className={s.title}>个性签名</div>
          <div className={s.signature}>
            <Input
              clearable
              type="text"
              value={signature}
              placeholder="请输入个性签名"
              onChange={(value) => setSignature(value)}
            />
          </div>
        </div>
        <Button block theme="primary" style={{ marginTop: 50 }} onClick={save}>
          保存
        </Button>
      </div>
    </>
  );
};

export default UserInfo;
