import React from "react";
import { Oval } from "react-loader-spinner";


const SubmitButton = ({ loading, children }) => {
  return (
    <button
      type="submit"
      className="w-32 p-1 bg-red-600 text-white text-xl font-semibold rounded-full flex items-center justify-center hover:bg-red-700"
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
