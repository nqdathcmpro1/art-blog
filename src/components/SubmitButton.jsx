import React from "react";
import { Oval } from "react-loader-spinner";


const SubmitButton = ({ disabled, loading, children, onClick }) => {
  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className="px-5 py-1 bg-red-600 text-white text-xl font-semibold rounded-full flex items-center justify-center hover:bg-red-700 disabled:opacity-30"
    >
      {loading ? (
        <Oval
          height={23}
          width={23}
          color="#ffffff"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#8b8b8b"
          strokeWidth={5}
          strokeWidthSecondary={5}
        />
      ) : (
        children
      )}
    </button>
  );
};

export default SubmitButton;
