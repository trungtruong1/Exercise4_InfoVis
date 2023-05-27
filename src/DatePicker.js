import React, { Fragment, useState } from "react";
import { KeyboardDatePicker } from "@material-ui/pickers";

function KeyboardDatePickerExample(props) {
  const [selectedDate, handleDateChange] = useState(new Date());

  return (
    <Fragment>
      <KeyboardDatePicker
        clearable
        value={selectedDate}
        onChange={date => handleDateChange(date)}
        minDate={new Date()}
        format="DD/MM/YYYY"
      />
    </Fragment>
  );
}

export default KeyboardDatePickerExample;
