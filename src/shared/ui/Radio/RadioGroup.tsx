import classNames from "classnames";
import React from "react";
import { Radio } from "./Radio";
import styles from "./Radio.module.css";

interface Props {
  children:
    | React.ReactElement<React.ComponentProps<typeof Radio>>
    | React.ReactElement<React.ComponentProps<typeof Radio>>[];
  checkedValue: string;
  name: string;
  onChange: (value: string) => void;
  type?: "horizontal" | "vertical";
  className?: string;
}

export const RadioGroup = ({
  children,
  checkedValue,
  name,
  onChange,
  type = "horizontal",
  className,
}: Props) => {
  const handleChange = (value: string) => {
    onChange(value);
  };

  const Element = React.Children.map(
    children,
    (child: React.ReactElement<React.ComponentProps<typeof Radio>>) => {
      if (React.isValidElement(child)) {
        return (
          <React.Fragment key={child.props.value}>
            {React.cloneElement(child, {
              checked: child.props.value === checkedValue,
              value: child.props.value,
              onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(event.target.value),
              name,
            })}
          </React.Fragment>
        );
      }
    }
  );

  return (
    <div
      className={classNames(
        styles.radioGroup,
        {
          [styles.horizontal]: type === "horizontal",
          [styles.vertical]: type === "vertical",
        },
        className
      )}
    >
      {Element}
    </div>
  );
};
