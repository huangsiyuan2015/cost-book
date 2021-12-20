import React, { forwardRef, useState, useRef, useEffect } from "react";
import { Popup, Icon, Keyboard, Input, Toast } from "zarm";
import PopupDate from "@/components/PopupDate";
import CustomIcon from "@/components/CustomIcon";
import dayjs from "dayjs";
import { get, post, typeMap } from "utils";
import cx from "classnames";
import s from "./style.module.less";

const PopupAddBill = forwardRef(({ detail = {}, onReload }, ref) => {
  const [show, setShow] = useState(false); // 控制弹窗显示隐藏
  const [payType, setPayType] = useState("expense"); // 支出或收入类型
  const [amount, setAmount] = useState(""); // 账单金额
  const [currentType, setCurrentType] = useState({}); // 当前选中的账单类型
  const [expense, setExpense] = useState([]); // 支出类型标签
  const [income, setIncome] = useState([]); // 收入类型标签
  const [remark, setRemark] = useState(""); // 备注信息
  const [showRemark, setShowRemark] = useState(false); // 备注输入框显示控制

  const dateRef = useRef();
  const [date, setDate] = useState(new Date());

  const id = detail?.id; // 获取账单的 id，如果没有说明是新建账单

  useEffect(async () => {
    const {
      data: { list },
    } = await get("/api/type/list");

    // 所有的支出标签
    const _expense = list.filter((item) => item.type === 1);
    // 所有的收入标签
    const _income = list.filter((item) => item.type === 2);

    setExpense(_expense);
    setIncome(_income);
    // 没有 id 说明是新建账单，新建账单默认选择支出类型的第一项
    !id && setCurrentType(_expense[0]);
  }, []);

  useEffect(() => {
    if (id) {
      const { pay_type, type_id, type_name, remark, amount, date } = detail;

      setPayType(pay_type === 1 ? "expense" : "income");
      setCurrentType({ id: type_id, name: type_name, type: pay_type });
      setRemark(remark);
      setAmount(amount);
      setDate(dayjs(Number(detail.date)).$d);
    }
  }, [detail]);

  // date 是字符串格式，"YYYY-MM"
  const selectDate = (date) => {
    setDate(date);
  };

  if (ref) {
    ref.current = {
      show: () => setShow(true),
      close: () => setShow(false),
    };
  }

  // 切换收入还是支出
  const changePayType = (payType) => {
    setPayType(payType);
  };

  // 监听输入框改变值
  const handleInputMoney = (value) => {
    // 点击删除按钮
    if (value === "delete") {
      let _amount = amount.slice(0, amount.length - 1);
      setAmount(_amount);
      return;
    }

    // 点击确定按钮
    if (value === "ok") {
      addBill(); // 添加账单
      return;
    }

    // 如果已经包含小数点，不允许再输入小数点
    if (value === "." && amount.includes(".")) return;

    // 小数点后保留两位，超过的部分不再加到字符串
    if (
      value !== "." &&
      amount.includes(".") &&
      amount &&
      amount.split(".")[1].length >= 2
    )
      return;

    setAmount((amount) => amount + value);
  };

  // 添加账单
  const addBill = async () => {
    if (!amount) {
      Toast.show("请输入具体金额！");
      return;
    }

    const params = {
      amount: Number(amount).toFixed(2),
      type_id: currentType.id,
      type_name: currentType.name,
      date: dayjs(date).unix() * 1000,
      pay_type: payType === "expense" ? 1 : 2,
      remark: remark || "",
    };

    if (id) {
      // 如果 id 存在，说明是修改账单
      params.id = id;
      const result = await post(`/api/bill/update`, params);
      Toast.show("修改成功");
    } else {
      // 如果 id 不存在，说明是新建账单
      const result = await post(`/api/bill/add`, params);

      // 重置数据
      setAmount("");
      setPayType("expense");
      setCurrentType(expense[0]);
      setDate(new Date());
      setRemark("");
      Toast.show("添加成功");
    }

    setShow(false);
    // 添加后刷新数据
    onReload && onReload();
  };

  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={s.addWrap}>
        {/* 右上角关闭弹窗 */}
        <header className={s.header}>
          <span className={s.close} onClick={() => setShow(false)}>
            <Icon type="wrong" />
          </span>
        </header>
        {/* 收入和支出切换类型 */}
        <div className={s.filter}>
          <div className={s.type}>
            <span
              className={cx({
                [s.expense]: true,
                [s.active]: payType == "expense",
              })}
              onClick={() => changePayType("expense")}
            >
              支出
            </span>
            <span
              className={cx({
                [s.income]: true,
                [s.active]: payType == "income",
              })}
              onClick={() => changePayType("income")}
            >
              收入
            </span>
          </div>
          <div className={s.time} onClick={() => dateRef?.current.show()}>
            {dayjs(date).format("MM-DD")}
            <Icon className={s.arrow} type="arrow-bottom"></Icon>
          </div>
        </div>
        {/* 输入金额 */}
        <div className={s.money}>
          <span className={s.sufix}>￥</span>
          <span className={cx(s.amount, s.animation)}>{amount}</span>
        </div>
        {/* 显示收入/支出标签 */}
        <div className={s.typeWarp}>
          <div className={s.typeBody}>
            {(payType === "expense" ? expense : income).map((item) => (
              <div
                className={s.typeItem}
                key={item.id}
                onClick={() => setCurrentType(item)}
              >
                <span
                  className={cx({
                    [s.iconfontWrap]: true,
                    [s.expense]: payType === "expense",
                    [s.income]: payType === "income",
                    [s.active]: currentType.id === item.id,
                  })}
                >
                  <CustomIcon
                    className={s.iconfont}
                    type={typeMap[item.id].icon}
                  />
                </span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* 编辑备注信息 */}
        <div className={s.remark}>
          {showRemark ? (
            <Input
              autoHeight
              showLength
              maxLength={50}
              type="text"
              rows={3}
              value={remark}
              placeholder="请输入备注信息"
              onChange={(value) => setRemark(value)}
              onBlur={() => setShowRemark(false)}
            />
          ) : (
            <span onClick={() => setShowRemark(true)}>
              {remark || "添加备注"}
            </span>
          )}
        </div>
        <Keyboard
          type="price"
          onKeyClick={(value) => handleInputMoney(value)}
        />
        {/* 日期弹出层 */}
        <PopupDate ref={dateRef} onSelect={selectDate} />
      </div>
    </Popup>
  );
});

export default PopupAddBill;
