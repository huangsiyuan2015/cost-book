import React, { useState, useEffect, useRef } from "react";
import { Icon, Progress } from "zarm";
import cx from "classnames";
import dayjs from "dayjs";
import { get, typeMap } from "utils";
import CustomIcon from "@/components/CustomIcon";
import PopupDate from "@/components/PopupDate";
import s from "./style.module.less";

let proportionChart = null;

const Data = () => {
  const monthRef = useRef();
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM")); // 日期选择

  const [totalType, setTotalType] = useState("expense"); // 收入或支出类型
  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入
  const [expenseData, setExpenseData] = useState([]); // 支出数据
  const [incomeData, setIncomeData] = useState([]); // 收入数据
  const [pieType, setPieType] = useState("expense"); // 收支饼图

  useEffect(() => {
    getData();
    return () => {
      // 每次组件卸载时，释放图表实例
      proportionChart.dispose();
    };
  }, [currentMonth]);

  // 绘制饼图方法
  const setPieChart = (data) => {
    if (window.echarts) {
      proportionChart = echarts.init(document.getElementById("proportion"));
      proportionChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br /> {b}: {c} ({d}%)",
        },

        legend: {
          data: data.map((item) => item.type_name),
        },

        series: [
          {
            name: "支出",
            type: "pie",
            radius: "55%",
            data: data.map((item) => ({
              value: item.number,
              name: item.type_name,
            })),
          },
        ],

        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      });
    }
  };

  // 显示 PopupDate
  const monthShow = () => {
    monthRef?.current.show();
  };

  // 获取 PopupDate 组件中选中的月份
  const selectMonth = (month) => {
    setCurrentMonth(month);
  };

  // 切换收支类型
  const changeTotalType = (totalType) => {
    setTotalType(totalType);
  };

  // 切換饼图的收支类型
  const changePieType = (pieType) => {
    setPieType(pieType);
    // 重绘饼图
    setPieChart(pieType === "expense" ? expenseData : incomeData);
  };

  // 获取账单数据
  const getData = async () => {
    try {
      const { data } = await get(`/api/bill/data?date=${currentMonth}`);
      console.log(data);

      const { total_expense, total_income, total_data } = data;

      // 总收支
      setTotalExpense(total_expense);
      setTotalIncome(total_income);

      // 过滤出收入数据和支出数据
      const expenseData = total_data
        .filter((item) => item.pay_type === 1)
        .sort((a, b) => a.number - b.number);
      const incomeData = total_data
        .filter((item) => item.pay_type === 2)
        .sort((a, b) => a.number - b.number);

      setExpenseData(expenseData);
      setIncomeData(incomeData);

      // 绘制饼图
      setPieChart(pieType === "expense" ? expenseData : incomeData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={s.data}>
      <div className={s.total}>
        <div className={s.time} onClick={monthShow}>
          <span>{currentMonth}</span>
          <Icon className={s.date} type="date"></Icon>
        </div>
        <div className={s.title}>共支出</div>
        <div className={s.expense}>￥{totalExpense}</div>
        <div className={s.income}>共收入￥{totalIncome}</div>
      </div>
      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth} />
      <div className={s.structure}>
        <div className={s.head}>
          <span className={s.title}>收支构成</span>
          <div className={s.tab}>
            <span
              className={cx({
                [s.expense]: true,
                [s.active]: totalType === "expense",
              })}
              onClick={() => changeTotalType("expense")}
            >
              支出
            </span>
            <span
              className={cx({
                [s.income]: true,
                [s.active]: totalType === "income",
              })}
              onClick={() => changeTotalType("income")}
            >
              收入
            </span>
          </div>
        </div>
        <div className={s.content}>
          {(totalType === "expense" ? expenseData : incomeData).map((item) => (
            <div className={s.item} key={item.type_id}>
              <div className={s.left}>
                <div className={s.type}>
                  <span
                    className={cx({
                      [s.expense]: totalType === "expense",
                      [s.income]: totalType === "income",
                    })}
                  >
                    <CustomIcon
                      type={item.type_id ? typeMap[item.type_id].icon : 1}
                    />
                  </span>
                  <span className={s.name}>{item.type_name}</span>
                </div>
                <div className={s.progress}>
                  ￥{Number(item.number).toFixed(2) || 0}
                </div>
              </div>
              <div className={s.right}>
                <div className={s.percent}>
                  <Progress
                    shape="line"
                    percent={Number(
                      (item.number /
                        Number(
                          totalType === "expense" ? totalExpense : totalIncome
                        )) *
                        100
                    ).toFixed(2)}
                    theme="primary"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={s.proportion}>
          <div className={s.head}>
            <span className={s.title}>收支构成</span>
            <div className={s.tab}>
              <span
                className={cx({
                  [s.expense]: true,
                  [s.active]: pieType === "expense",
                })}
                onClick={() => changePieType("expense")}
              >
                支出
              </span>
              <span
                className={cx({
                  [s.income]: true,
                  [s.active]: pieType === "income",
                })}
                onClick={() => changePieType("income")}
              >
                收入
              </span>
            </div>
          </div>
          {/* 用于放置饼图的 dom 节点 */}
          <div id="proportion"></div>
        </div>
      </div>
    </div>
  );
};

export default Data;
