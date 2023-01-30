import React from "react";

const Input = ({
  type,
  placeholder,
  name,
  disabled,
  value,
  onChange,
  errorMessage,
}) => {
  return (
    <div className="w-full flex flex-col">
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        className={
          "rounded-full px-3 py-2 " +
          `${errorMessage ? "focus:outline-red-500" : "focus: outline-black"}`
        }
        value={value}
      />
      <p className="text-4 italic text-red-600 break-words">{errorMessage}</p>
    </div>
  );
};

export default Input;
