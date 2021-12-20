import React, { useEffect, useState, useRef } from "react";
import { Icon, Pull } from "zarm";
import BillItem from "@/components/BillItem";
import PopupType from "@/components/PopupType";
import PopupDate from "@/components/PopupDate";
import PopupAddBill from "@/components/PopupAddBill";
import CustomIcon from "@/components/CustomIcon";
import dayjs from "dayjs";
import { get, REFRESH_STATE, LOAD_STATE } from "utils";
import s from "./style.module.less";

const Home = () => {
  const [currentTime, setCurrentTime] = useState(dayjs().format("YYYY-MM")); // 当前筛选时间
  const [list, setList] = useState([]); // 账单列表
  const [totalExpense, setTotalExpense] = useState(0); // 总支出
  const [totalIncome, setTotalIncome] = useState(0); // 总收入
  const [page, setPage] = useState(1); // 分页
  const [totalPage, setTotalPage] = useState(0); // 分页总数
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal); // 下拉刷新
  const [loading, setLoading] = useState(LOAD_STATE.normal); // 上滑加载

  // 获取弹出层 PopupType 中选中的标签
  const typeRef = useRef();
  const [currentSelect, setCurrentSelect] = useState({});

  // 获取弹出层 PopupDate 中选中的日期
  const monthRef = useRef();

  // 显示添加账单 PopupAddButton 的弹出层
  const addRef = useRef();

  // page 一发生变化就要重新获取账单数据
  useEffect(() => {
    getBillList();
  }, [page, currentSelect, currentTime]);

  // 获取账单数据
  const getBillList = async () => {
    const { data } = await get(
      `/api/bill/list?page=${page}&page_size=5&date=${currentTime}&type_id=${
        currentSelect.id || "all"
      }`
    );

    const { list, totalPage, totalExpense, totalIncome } = data;

    // 下拉刷新，重制数据
    if (page === 1) {
      setList(list);
    } else {
      setList(list.concat(list));
    }
    setTotalExpense(totalExpense);
    setTotalIncome(totalIncome);
    setTotalPage(totalPage);

    // 上滑加载状态
    setLoading(LOAD_STATE.success);
    setRefreshing(REFRESH_STATE.success);
  };

  // 下拉刷新请求数据
  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading);
    if (page !== 1) {
      setPage(1);
    } else {
      getBillList();
    }
    console.log("refreshingData");
  };

  // 上滑加载数据
  const loadData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading);
      setPage(page + 1);
    }
    console.log("loadData");
  };

  // 切换账单弹窗
  const typeToggle = () => {
    typeRef.current?.show();
  };

  // 选择类型标签
  const typeSelect = (item) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentSelect(item);
  };

  // 切換月份弹窗
  const monthToggle = () => {
    monthRef.current?.show();
  };

  // 选择月份弹窗
  const monthSelect = (date) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setCurrentTime(date);
  };

  // 添加账单按钮
  const addToggle = () => {
    addRef?.current.show();
  };

  return (
    <div className={s.home}>
      <div className={s.header}>
        <div className={s.dataWrap}>
          <span className={s.expense}>
            总支出：<b>￥{totalExpense}</b>
          </span>
          <span className={s.income}>
            总收入：<b>￥{totalIncome}</b>
          </span>
        </div>
        <div className={s.typeWrap}>
          <div className={s.left} onClick={typeToggle}>
            <span className={s.title}>
              全部类型
              <Icon className={s.arrow} type="arrow-bottom" />
            </span>
          </div>
          <div className={s.right} onClick={monthToggle}>
            <span className={s.time}>
              {currentTime}
              <Icon className={s.arrow} type="arrow-bottom" />
            </span>
          </div>
        </div>
      </div>
      <div className={s.contentWrap}>
        {list.length ? (
          <Pull
            animationDuration={200}
            stayTime={400}
            refresh={{
              state: refreshing,
              handler: refreshData,
            }}
            load={{
              state: loading,
              distance: 200,
              handler: loadData,
            }}
          >
            {list.map((item, index) => (
              <BillItem bill={item} key={`bill-item-${index}`} />
            ))}
          </Pull>
        ) : (
          ""
        )}
      </div>
      <PopupType ref={typeRef} onSelect={typeSelect} />
      <PopupDate ref={monthRef} onSelect={monthSelect} mode="month" />
      <div className={s.add} onClick={addToggle}>
        <CustomIcon type="tianjia" />
      </div>
      <PopupAddBill ref={addRef} onReload={refreshData} />
    </div>
  );
};

export default Home;
