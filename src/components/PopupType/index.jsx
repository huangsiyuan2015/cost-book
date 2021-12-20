import React, { forwardRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Popup, Icon } from "zarm";
import { get } from "utils";
import cx from "classnames";
import s from "./style.module.less";

const PopupType = forwardRef(({ onSelect }, ref) => {
  const [show, setShow] = useState(false); // 组件的显示与隐藏
  const [active, setActive] = useState("all"); // 激活的 type
  const [expense, setExpense] = useState([]); // 支出类型标签
  const [income, setIncome] = useState([]); // 收入类型标签

  useEffect(async () => {
    const {
      data: { list },
    } = await get("/api/type/list");

    setExpense(list.filter((item) => item.type === 1));
    setIncome(list.filter((item) => item.type === 2));
  }, []);

  if (ref) {
    ref.current = {
      // 外部可以通过 ref.current.show 来控制组件的显示
      show: () => {
        setShow(true);
      },
      // 外部可以通过 ref.current.close 来控制组件的隐藏
      close: () => {
        setShow(false);
      },
    };
  }

  const choseType = (item) => {
    setActive(item.id);
    setShow(false);
    // 父组件获取点击的标签
    onSelect(item);
  };

  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={s.popupType}>
        <div className={s.header}>
          请选择类型
          <Icon
            type="wrong"
            className={s.cross}
            onClick={() => setShow(false)}
          />
        </div>
        <div className={s.content}>
          <div
            onClick={() => choseType({ id: "all" })}
            className={cx({ [s.all]: true, [s.active]: active === "all" })}
          >
            全部类型
          </div>
          <div className={s.title}>支出</div>
          <div className={s.expenseWrap}>
            {expense.map((item, index) => (
              <div
                className={cx({ [s.active]: active === item.id })}
                key={`expense-item-${index}`}
                onClick={() => choseType(item)}
              >
                {item.name}
              </div>
            ))}
          </div>
          <div className={s.title}>收入</div>
          <div className={s.incomeWrap}>
            {income.map((item, index) => (
              <div
                className={cx({ [s.active]: active === item.id })}
                key={`income-item-${index}`}
                onClick={() => choseType(item)}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Popup>
  );
});

PopupType.propTypes = {
  onSelect: PropTypes.func,
};

export default PopupType;
