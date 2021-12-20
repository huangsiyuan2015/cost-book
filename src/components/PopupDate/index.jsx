import React, { forwardRef, useState } from "react";
import PropTypes from "prop-types";
import { Popup, DatePicker } from "zarm";
import dayjs from "dayjs";

const PopupDate = forwardRef(({ onSelect, mode = "date" }, ref) => {
  const [show, setShow] = useState(false);
  const [now, setNow] = useState(new Date());

  const choseDate = (date) => {
    console.log(date);
    setNow(date);
    setShow(false);

    if (mode === "month") {
      onSelect(dayjs(date).format("YYYY-MM"));
    } else if (mode === "date") {
      onSelect(dayjs(date).format("YYYY-MM-DD"));
    }
  };

  if (ref) {
    ref.current = {
      show: () => setShow(true),
      close: () => setShow(false),
    };
  }

  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div>
        <DatePicker
          visible={show}
          value={now}
          mode={mode}
          onOk={(date) => choseDate(date)}
          onCancel={() => setShow(false)}
        />
      </div>
    </Popup>
  );
});

PopupDate.propTypes = {
  select: PropTypes.func,
  mode: PropTypes.string,
};

export default PopupDate;
