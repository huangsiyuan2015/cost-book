import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import CustomIcon from "@/components/CustomIcon";
import PopupAddBill from "@/components/PopupAddBill";
import { Modal, Toast } from "zarm";
import qs from "query-string";
import { get, post, typeMap } from "utils";
import cx from "classnames";
import dayjs from "dayjs";
import s from "./style.module.less";

const Detail = () => {
  const [detail, setDetail] = useState({}); // 账单详情的数据

  const location = useLocation(); // 获取当前路由地址
  const { id } = qs.parse(location.search); // 解析查询字符串中的参数

  const navigate = useNavigate();
  const editRef = useRef();

  useEffect(() => {
    getDetail();
  }, []);

  // 获取账单详情数据
  const getDetail = async () => {
    const { data } = await get(`/api/bill/detail?id=${id}`);
    setDetail(data);
    console.log(data);
  };

  // 删除账单
  const deleteDetail = () => {
    Modal.confirm({
      title: "删除",
      content: "确认删除账单？",
      onOk: async () => {
        const { data } = await post(`/api/bill/delete`, { id });
        Toast.show("删除成功");
        navigate(-1);
      },
    });
  };

  // 编辑账单详情
  const editDetail = () => {
    editRef?.current.show();
  };

  return (
    <div className={s.detail}>
      <Header title="账单详情" />
      <div className={s.card}>
        <div className={s.type}>
          {/* 通过 pay_type 属性，判断是收入还是支出，给出不同的颜色 */}
          <span
            className={cx({
              [s.expense]: detail.pay_type === 1,
              [s.income]: detail.pay_type === 2,
            })}
          >
            <CustomIcon
              className={s.iconfont}
              type={detail.type_id ? typeMap[detail.type_id].icon : 1}
            />
          </span>
          <span>{detail.type_name || ""}</span>
        </div>
        {detail.pay_type === 1 ? (
          <div className={cx(s.amount, s.expense)}>-{detail.amount}</div>
        ) : (
          <div className={cx(s.amount, s.income)}>+{detail.amount}</div>
        )}
        <div className={s.info}>
          <div className={s.time}>
            <span>记录时间</span>
            <span>{dayjs(Number(detail.date)).format("YYYY-MM-DD HH:mm")}</span>
          </div>
          <div className={s.remark}>
            <span>备注</span>
            <span>{detail.remark || "-"}</span>
          </div>
        </div>
        <div className={s.operation}>
          <span onClick={deleteDetail}>
            <CustomIcon type="shanchu">删除</CustomIcon>
          </span>
          <span onClick={editDetail}>
            <CustomIcon type="tianjia">添加</CustomIcon>
          </span>
        </div>
        <PopupAddBill ref={editRef} detail={detail} onReload={getDetail} />
      </div>
    </div>
  );
};

export default Detail;
