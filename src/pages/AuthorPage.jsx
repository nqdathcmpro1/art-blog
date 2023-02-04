import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useInfiniteQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { PlusCircleOutlined } from "@ant-design/icons";
import defaultAvatar from "@/public/default-avatar.png";

import MasonryArtList from "@/components/MasonryArtList";
import EditModal from "@/components/EditModal";
import { fetchAuthor } from "@/api/userApi";
import { fetchAuthorArts, deleteArt } from "@/api/artApi";
import DeleteModal from "@/components/DeleteModal";

const AuthorPage = () => {
  const navigate = useNavigate();

  const { author } = useParams();

  const [isAuthor, setIsAuthor] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [chosenArtId, setChosenArtId] = useState("");

  const currentUser = useSelector((state) => state.authReducer.loginUser);

  const queryClient = useQueryClient()

  useEffect(() => {
    setIsAuthor(currentUser?.userName === author);
  }, [currentUser, author]);

  const handleNavigateEdit = () => {
    navigate("/user/edit");
  };

  const { data: authorData, isLoading: authorLoading } = useQuery({
    queryKey: ["author", author],
    queryFn: () => fetchAuthor(author),
    enabled: !!author,
  });

  const {
    data: artData,
    fetchNextPage,
    isFetchingNextPage: artFetchingNextPage,
    isLoading: artLoading,
  } = useInfiniteQuery({
    queryKey: ["authorArts", author],
    queryFn: ({ pageParam = 1 }) => fetchAuthorArts(author, pageParam),
    enabled: !!author,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.data?.numberOfPages > allPages.length
        ? allPages.length + 1
        : undefined;
    },
  });

  const getName = (fullName) => {
    if (fullName) {
      const splitName = fullName.split(" ");
      return splitName[splitName.length - 1];
    }
  };

  const deleteArtMutation = useMutation({
    mutationKey: ["deleteArt"],
    mutationFn: () => {
      return deleteArt(chosenArtId);
    },
    onSuccess: (data) => {
      if (data.status === 200) {
        setDeleteModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ["authorArts"] });
      }
    },
  });

  const handleDeleteArt = () => {
    deleteArtMutation.mutate();
  };

  return (
    <div className="flex flex-col items-center gap-10 w-full">
      <div
        name="author-avatar"
        className="w-full md:w-1/2 flex flex-col items-center gap-2"
      >
        {authorData ? (
          <>
            <span className="w-32 md:w-56 h-32 md:h-56 rounded-full overflow-hidden">
              <img
                src={authorData?.data?.data?.avatar || defaultAvatar}
                alt="author avatar"
                className="w-full object-cover"
              />
            </span>
            <h1 name="author-name" className="text-4xl font-bold w-fit">
              {authorData?.data?.data?.fullName}
            </h1>
            <p
              name="author-username"
              className="text-sm italic text-slate-600 font-semibold"
            >
              @{authorData?.data?.data?.userName}
            </p>
            <p name="status" className="text-sm font-semibold break-words">
              {authorData?.data?.data?.status}
            </p>
          </>
        ) : (
          <>
            <span className="w-32 md:w-56 h-32 md:h-56 rounded-full overflow-hidden">
              <div className="w-full h-full bg-slate-300"></div>
            </span>
            <div className="w-72 h-12 bg-slate-300 rounded-full"></div>
            <div className="w-32 h-4 bg-slate-300 rounded-full"></div>
            <div className="w-72 h-24 bg-slate-300 rounded-full"></div>
          </>
        )}
      </div>

      {isAuthor && (
        <button
          className="h-14 px-5 rounded-full shadow-md text-xl font-semibold bg-slate-200 hover:bg-slate-400"
          onClick={handleNavigateEdit}
        >
          Profile Setting
        </button>
      )}
      {authorData && (
        <h1 className="text-3xl text-center font-bold">
          {getName(authorData?.data?.data?.fullName)}'s Arts
        </h1>
      )}
      <MasonryArtList
        artList={artData}
        fetchNextPage={fetchNextPage}
        loading={artLoading}
        loadingNextPage={artFetchingNextPage}
        authorEdit={isAuthor}
        setEditModalOpen={setEditModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setChosenArtId={setChosenArtId}
      >
        {isAuthor && (
          <Link
            className="w-full h-full flex flex-col items-center justify-center bg-slate-200"
            to="/art/create"
          >
            <PlusCircleOutlined className="text-6xl text-slate-500 font-extrabold" />
            <p className="text-lg italic text-slate-500">Add some Arts</p>
          </Link>
        )}
      </MasonryArtList>

      <EditModal
        chosenArtId={chosenArtId}
        editModalOpen={editModalOpen}
        setEditModalOpen={setEditModalOpen}
      />

      <DeleteModal
        handleDelete={handleDeleteArt}
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
      >Do you want to delete this art ?</DeleteModal>
    </div>
  );
};

export default AuthorPage;
