import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Cell } from "zarm";
import CustomIcon from "../CustomIcon";
import dayjs from "dayjs";
import { typeMap } from "utils";
import s from "./style.module.less";

const BillItem = ({ bill }) => {
  const [income, setIncome] = useState(0); // 收入
  const [expense, setExpense] = useState(0); // 支出

  const navigate = useNavigate();

  // 当添加账单时，bill.bills 长度变化，触发当日收支总和的计算
  useEffect(() => {
    // 计算当日总收入
    const _income = bill.bills
      .filter((item) => item.pay_type == 2)
      .reduce((cur, item) => (cur += Number(item.amount)), 0);

    setIncome(_income);

    // 计算当日总支出
    const _expense = bill.bills
      .filter((item) => item.pay_type == 1)
      .reduce((cur, item) => (cur += Number(item.amount)), 0);

    setExpense(_expense);
  }, [bill.bills]);

  // 跳转到账单详情
  const goToDetail = (item) => {
    navigate(`/detail?id=${item.id}`);
  };

  return (
    <div className={s.item}>
      <div className={s.headerDate}>
        <div className={s.date}>{bill.date}</div>
        <div className={s.money}>
          <span>
            <img src="//s.yezgea02.com/1615953405599/zhi%402x.png" alt="支" />
            <span>￥{expense.toFixed(2)}</span>
          </span>
          <span>
            <img src="//s.yezgea02.com/1615953405599/shou%402x.png" alt="收" />
            <span>￥{income.toFixed(2)}</span>
          </span>
        </div>
      </div>
      {bill &&
        bill.bills
          .sort((a, b) => b.date - a.date)
          .map((item) => (
            <Cell
              className={s.bill}
              key={item.id}
              onClick={() => goToDetail(item)}
              title={
                <>
                  <CustomIcon
                    className={s.itemIcon}
                    type={item.type_id ? typeMap[item.type_id].icon : 1}
                  />
                  <span>{item.type_name}</span>
                </>
              }
              description={
                <span style={{ color: item.pay_type == 1 ? "red" : "#39be77" }}>
                  {`${item.pay_type == 1 ? "-" : "+"}${item.amount}`}
                </span>
              }
              help={
                <div>
                  {dayjs(Number(item.date)).format("HH:mm")}{" "}
                  {item.remark ? `| ${item.remark}` : ""}
                </div>
              }
            />
          ))}
    </div>
  );
};

BillItem.propTypes = {
  bill: PropTypes.object,
};

export default BillItem;
