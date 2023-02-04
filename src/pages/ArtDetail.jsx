import React, { useState, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BallTriangle } from "react-loader-spinner";
import TextareaAutosize from "react-textarea-autosize";

import { fetchDetailArt } from "@/api/artApi";
import defaultAvatar from "@/public/default-avatar.png";
import NotFound from "@/components/NotFound";
import { useSelector } from "react-redux";
import { fetchAuthor } from "@/api/userApi";
import Comment from "@/components/Comment";
import { fetchCommentsFromArt, postComment } from "@/api/commentApi";
import { EnterOutlined } from "@ant-design/icons";

const ArtDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [activeComment, setActiveComment] = useState(null);

  const currentUser = useSelector((state) => state.authReducer.loginUser);

  const queryClient = useQueryClient();

  const postCommentMutation = useMutation({
    mutationKey: ["postComment"],
    mutationFn: async (newComment) => await postComment(newComment),
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["fetchComments"] });
    },
  });

  const {
    data: currentUserData,
    isLoading: currentUserLoading,
    isSuccess: currentUserSuccess,
  } = useQuery({
    queryKey: ["fetchAuthor"],
    queryFn: () => fetchAuthor(currentUser?.userName),
    retry: false,
    enabled: !!currentUser,
  });

  const { data: commentData, isLoading: commentLoading } = useQuery({
    queryKey: ["fetchComments"],
    queryFn: () => fetchCommentsFromArt(id),
    retry: false,
    enabled: !!id,
  });

  const {
    data: artDetailData,
    isLoading: artDetailLoading,
    isSuccess: artDetailSuccess,
  } = useQuery({
    queryKey: ["artDetail", id],
    queryFn: () => fetchDetailArt(id),
    retry: false,
    enabled: !!id,
  });

  const handleNavigateAuthor = (author) => {
    if (author) navigate(`/user/${author}`);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    const newComment = {
      fromAuthorId: currentUser._id,
      toArtId: id,
      content: comment,
    };
    postCommentMutation.mutate(newComment);
  };

  return (
    <>
      {artDetailLoading ? (
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
          {artDetailSuccess ? (
            <>
              <div className="lg:w-[900px] md:w-[600px] h-max w-10/12 my-5 shadow-2xl relative rounded-2xl bg-slate-100 overflow-hidden flex flex-col lg:flex-row">
                <div className="w-full md:min-h-full lg:w-1/2 relative">
                  <img
                    className="w-full lg:rounded-l-2xl"
                    src={artDetailData?.data?.data?.url}
                    alt={artDetailData?.data.data.title}
                  />
                </div>
                <div className="w-full lg:w-1/2 min-h-0 relative">
                  <div className="w-full lg:h-full h-96 lg:absolute relative overflow-auto">
                    {currentUser && <div className="w-full min-h-20 sticky top-0 z-10 left-0 px-3 py-5 bg-slate-400 flex items-start justify-between gap-3 ">
                      <img
                        src={currentUserData?.data.data.avatar || defaultAvatar}
                        className="w-12 aspect-square rounded-full overflow-hidden object-cover"
                      />
                      <div className="w-10/12 min-h-12 h-fit rounded-xl flex items-center justify-center p-3 bg-white">
                        <TextareaAutosize
                          maxRows={5}
                          className="w-full resize-none px-3 text-sm border-none focus:outline-none"
                          placeholder="Say something..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </div>
                      <EnterOutlined
                        onClick={handleSubmitComment}
                        className="w-8 md:w-12 text-white text-lg font-extrabold aspect-square rounded-full overflow-hidden bg-black/30 flex items-center justify-center"
                      />
                    </div>}
                    <div className="w-full p-5 ">
                      <div className="flex flex-col gap-3 h-fit ">
                        <h1 className="w-full md:text-4xl text-2xl font-bold break-words">
                          {artDetailData?.data?.data?.title}
                        </h1>

                        <div
                          className="w-fit flex items-center hover:underline cursor-pointer"
                          onClick={() =>
                            handleNavigateAuthor(
                              artDetailData?.data?.data?.author?.userName
                            )
                          }
                        >
                          <span className="mr-5 md:w-16 w-12 rounded-full overflow-hidden">
                            <img
                              src={
                                artDetailData?.data?.data?.author?.avatar ||
                                defaultAvatar
                              }
                              alt="default avatar"
                              className="w-full aspect-square object-center object-cover"
                            />
                          </span>
                          <p className="md:text-xl text-sm font-semibold">
                            {artDetailData?.data?.data?.author?.fullName}
                          </p>
                        </div>
                        <h1 className="md:text-2xl text-lg font-semibold ">
                          Comments ({commentData?.data.data.length || 0})
                        </h1>
                        <div className="min-w-full flex flex-col">
                          <div className="w-full p-3 flex flex-col gap-3">
                            {commentData?.data.data.map((comment) => {
                              return (
                                <Comment
                                  key={comment._id}
                                  comment={comment}
                                  activeComment={activeComment}
                                  setActiveComment={setActiveComment}
                                  hasButtons={
                                    currentUserData?.data.data.userName ===
                                    comment?.fromAuthorId.userName
                                  }
                                />
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <NotFound />
          )}
        </>
      )}
    </>
  );
};

export default memo(ArtDetail);
