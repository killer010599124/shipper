import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";

const SelectShippers = () => {
  const [checked, setChecked] = React.useState(true);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  return (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={handleChange} />}
      label="Check me"
    />
  );
};

export default SelectShippers;


