import React, { memo } from "react";
import Masonry from "react-masonry-css";
import { ColorRing, Oval } from "react-loader-spinner";
import { Waypoint } from "react-waypoint";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";

const MasonryArtList = ({
  artList,
  fetchNextPage,
  loading,
  loadingNextPage,
  authorEdit,
  setEditModalOpen,
  setDeleteModalOpen,
  setChosenArtId,
  children,
}) => {

  const breakpointColumnsObj = {
    default: 5,
    1024: 3,
    768: 2,
    640: 1,
  };

  const handleEditArt = (id) => {
    setEditModalOpen(true);
    setChosenArtId(id);
  };

  const handleDeleteArt = (id) => {
    setDeleteModalOpen(true);
    setChosenArtId(id);
  };

  return (
    <div className="w-full ">
      {artList && (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid px-3"
          columnClassName="my-masonry-grid_column"
        >
          {children && (
            <div className="relative bg-transparent min-w-full h-56 flex flex-col overflow-hidden rounded-xl">
              {children}
            </div>
          )}
          {artList.pages.map((page) => {
            return page.data.data.map((art, index) => {
              return (
                <div
                  key={art._id}
                  className="relative bg-transparent min-w-full h-fit flex flex-col overflow-hidden rounded-xl"
                >
                  <Link
                    to={`/art/${art._id}`}
                    className="w-full cursor-zoom-in"
                  >
                    <img
                      title={art.title}
                      src={art.url}
                      alt={art._id}
                      className="w-full object-cover"
                    />
                  </Link>
                  <div className="absolute w-full h-16 bottom-0 left-0 p-2 bg-gradient-to-b from-slate-900/80 to-slate-400/50 flex items-center justify-between">
                    <h1 className="lg:text-xl md:text-lg text-base font-bold text-white truncate overflow-hidden">
                      {art.title}
                    </h1>
                    {authorEdit && (
                      <div className="w-1/4 flex  items-center justify-between gap-2">
                        <EditOutlined
                          title="Edit"
                          onClick={() => handleEditArt(art._id)}
                          className="w-8 text-white text-lg font-extrabold aspect-square rounded-full overflow-hidden bg-black/30 flex items-center justify-center"
                        />

                        <DeleteOutlined
                          title="Delete"
                          onClick={() => handleDeleteArt(art._id)}
                          className="w-8 text-white text-lg font-extrabold aspect-square rounded-full overflow-hidden bg-black/30 flex items-center justify-center"
                        />
                      </div>
                    )}
                  </div>
                  {index === page.data.data.length - 1 && (
                    <Waypoint topOffset="20%" onEnter={fetchNextPage} />
                  )}
                </div>
              );
            });
          })}
        </Masonry>
      )}
      {loading && (
        <div className="w-full h-32 flex flex-col items-center">
          <Oval
            height={50}
            width={50}
            color="#ffffff"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#8b8b8b"
            strokeWidth={5}
            strokeWidthSecondary={5}
          />
          <p className="italic text-lg">Finding arts...</p>
        </div>
      )}
      {loadingNextPage && (
        <div className="w-full flex items-center justify-center">
          <ColorRing
            className="w-[100%]"
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        </div>
      )}
    </div>
  );
};

export default memo(MasonryArtList);
