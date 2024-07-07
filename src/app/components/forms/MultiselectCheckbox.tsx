import React, { useState } from "react";
import {
  Box,
  Checkbox,
  InputLabel,
  FormControl,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { Control, useController } from "react-hook-form";

interface MultiselectCheckboxProps {
  options: { label: string; value: string }[];
  control: Control;
  name: string;
  includeOthers?: boolean;
  othersLabel?: string;
  othersTextPlaceholder?: string;
}

const MultiselectCheckbox = (props: MultiselectCheckboxProps) => {
  const {
    options,
    control,
    includeOthers = false,
    othersLabel = "Otros",
    othersTextPlaceholder = "",
  } = props;
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [showOthers, setShowOthers] = useState(false);
  const [othersText, setOthersText] = useState("");
  const { field } = useController({
    name: props.name,
    control,
  });

  const handleCheckboxClick = (value: string) => () => {
    let newSelection;
    if (selectedValues.includes(value)) {
      newSelection = selectedValues.filter((val) => val !== value);
    } else {
      newSelection = [...selectedValues, value];
    }
    setSelectedValues(newSelection);
    field.onChange(newSelection);
  };

  const toggleOthersField = () => {
    if (showOthers) {
      const cleanList = selectedValues.filter(
        (val) => !val.startsWith("[other]="),
      );
      setSelectedValues(cleanList);
      field.onChange(cleanList);
      setOthersText("");
    }
    setShowOthers(!showOthers);
  };

  const handleBlur = () => {
    if (othersText.trim() !== "") {
      setSelectedValues([...selectedValues, `[other]=${othersText}`]);
      field.onChange([...selectedValues, `[other]=${othersText}`]);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {options.map((opt) => (
        <FormControlLabel
          key={opt.value}
          label={opt.label}
          control={
            <Checkbox
              onClick={handleCheckboxClick(opt.value)}
              checked={selectedValues.includes(opt.value)}
            />
          }
        />
      ))}
      {includeOthers && (
        <>
          <FormControlLabel
            control={<Checkbox onClick={toggleOthersField} />}
            label={othersLabel}
          />
          {showOthers && (
            <TextField
              onChange={(e) => setOthersText(e.target.value)}
              value={othersText}
              onBlur={handleBlur}
              placeholder={othersTextPlaceholder}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default MultiselectCheckbox;
