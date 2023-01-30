import React, { memo } from "react";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BallTriangle } from "react-loader-spinner";

import { fetchDetailArt } from "@/api/artApi";
import defaultAvatar from "@/public/default-avatar.png";
import NotFound from "@/components/NotFound";

const ArtDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["artDetail", id],
    queryFn: () => fetchDetailArt(id),
    retry: false,
    enabled: !!id,
  });

  const handleNavigateAuthor = (author) => {
    if (author) navigate(`/user/${author}`);
  };

  return (
    <>
      {isLoading ? (
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#ff0000"
          ariaLabel="ball-triangle-loading"
          wrapperStyle=""
          visible={true}
        />
      ) : (
        <>
          {isSuccess ? (
            <div className="w-9/12 h-fit my-5 shadow-2xl rounded-2xl bg-slate-100 overflow-hidden flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 relative">
                <img
                  className="w-full"
                  src={data?.data?.data?.url}
                  alt="hinh"
                />
              </div>
              <div className="w-full md:w-1/2 px-5 py-10 flex flex-col gap-8">
                <h1 className="w-full text-4xl font-bold break-words">
                  {data?.data?.data?.title}
                </h1>

                <div
                  className="w-fit flex  items-center hover:underline cursor-pointer"
                  onClick={() =>
                    handleNavigateAuthor(data?.data?.data?.author?.userName)
                  }
                >
                  <span className="mr-5 w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={data?.data?.data?.author?.avatar || defaultAvatar}
                      alt="default avatar"
                      className="w-16 h-16 object-center object-cover"
                    />
                  </span>
                  <p className="text-xl font-bold">
                    {data?.data?.data?.author?.userName}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <NotFound />
          )}
        </>
      )}
    </>
  );
};

export default memo(ArtDetail);
