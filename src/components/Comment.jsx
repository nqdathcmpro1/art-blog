import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  EnterOutlined,
} from "@ant-design/icons";
import TextareaAutosize from "react-textarea-autosize";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { editComment, deleteComment } from "@/api/commentApi";

import DeleteModal from "./DeleteModal";

const Comment = ({ comment, hasButtons, activeComment, setActiveComment }) => {
  const [editCommentContent, setEditCommentContent] = useState("");

  const [isEdit, setIsEdit] = useState(false);

  const [isDelete, setIsDelete] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (activeComment !== comment?._id) setIsEdit(false);
  }, [activeComment, comment]);

  const formatTime = (time) => {
    const timeDate = new Date(time).getTime();
    const currentTime = Date.now();
    const difference = (currentTime - timeDate) / 1000;

    switch (true) {
      case difference > 60 * 60 * 24 * 365:
        return `${Math.floor(difference / (60 * 60 * 24 * 365))}y`;
      case difference > 60 * 60 * 24 * 7:
        return `${Math.floor(difference / (60 * 60 * 24 * 7))}w`;
      case difference > 60 * 60 * 24:
        return `${Math.floor(difference / (60 * 60 * 24))}d`;
      case difference > 60 * 60:
        return `${Math.floor(difference / (60 * 60))}h`;
      case difference > 60:
        return `${Math.floor(difference / 60)}m`;

      default:
        return "Just now";
    }
  };

  const editCommentMutation = useMutation({
    mutationKey: ["editComment"],
    mutationFn: async (input) => {
      const { commentId, commentContent } = input;
      if (commentContent?.content.length > 0)
        await editComment(commentId, commentContent);
      else handleDelete();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchComments"] });
      setIsEdit(false);
      setActiveComment("");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationKey: ["deleteComment"],
    mutationFn: (commentId) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchComments"] });
      setActiveComment("");
    },
  });

  const handleEdit = () => {
    setActiveComment(comment._id);
    setIsEdit(true);
    setEditCommentContent(comment.content);
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    const input = {
      commentId: comment._id,
      commentContent: {
        content: editCommentContent,
      },
    };
    await editCommentMutation.mutate(input);
  };

  const handleCloseEdit = () => {
    setEditCommentContent(null);
    setIsEdit(false);
    setActiveComment("");
  };

  const handleDelete = () => {
    setIsDelete(true);
  };

  const handleSubmitDelete = () => {
    deleteCommentMutation.mutate(comment._id);
  };

  return (
    <div className="flex items-start gap-3">
      <Link to={`/user/${comment.fromAuthorId.userName}`}>
        <img
          src={comment.fromAuthorId.avatar}
          className="md:w-12 w-8 aspect-square rounded-full overflow-hidden object-cover"
        />
      </Link>
      <span className="w-10/12 break-words flex flex-col">
        <div className="w-full flex items-center justify-between gap-5">
          <Link to={`/user/${comment.fromAuthorId.userName}`}>
            <p className="text-sm font-semibold hover:underline">
              {comment.fromAuthorId.fullName}
            </p>
          </Link>
          {hasButtons && (
            <div className="w-1/6 flex items-center justify-end gap-5">
              <EditOutlined
                onClick={handleEdit}
                className="md:text-md text-lg cursor-pointer"
              />
              <DeleteOutlined
                onClick={handleDelete}
                className="md:text-md text-lg cursor-pointer"
              />
            </div>
          )}
        </div>
        <div className="min-w-full">
          {isEdit ? (
            <div className="min-w-full rounded-xl p-3 bg-white gap-3 flex">
              <TextareaAutosize
                className="w-full resize-none border-none focus:outline-none"
                value={editCommentContent}
                onChange={(e) => {
                  setEditCommentContent(e.target.value);
                }}
              />
              <div className="w-fit h-fit flex flex-col items-center gap-2">
                <EnterOutlined
                  title="Send"
                  onClick={handleSubmitEdit}
                  className="w-8 h-8 text-white text-lg font-extrabold aspect-square rounded-full overflow-hidden bg-black/30 flex items-center justify-center"
                />
                <CloseOutlined
                  title="Close"
                  onClick={handleCloseEdit}
                  className="w-8 h-8 text-white text-lg font-extrabold aspect-square rounded-full overflow-hidden bg-black/30 flex items-center justify-center"
                />
              </div>
            </div>
          ) : (
            <p className="text-sm">{comment.content}</p>
          )}
        </div>
        <p className="text-xs text-slate-400">
          {formatTime(comment.createdAt)}
        </p>
      </span>
      <DeleteModal
        deleteModalOpen={isDelete}
        setDeleteModalOpen={setIsDelete}
        handleDelete={handleSubmitDelete}
      >
        Do you want to delete this comment ?
      </DeleteModal>
    </div>
  );
};

export default Comment;
