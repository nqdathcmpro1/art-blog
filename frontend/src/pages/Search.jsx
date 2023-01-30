import React from "react";
import { useParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";

import { fetchSearchArts } from "@/api/artApi";
import MasonryArtList from "@/components/MasonryArtList";

const Search = () => {
  const { search } = useParams();

  const { data, isFetching, fetchNextPage } = useInfiniteQuery({
    queryKey: ["searchArts", search],
    queryFn: ({ pageParam = 1 }) => fetchSearchArts(search, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.numberOfPages > allPages.length
        ? allPages.length + 1
        : undefined;
    },
  });

  return (
    <div className="flex flex-col items-center gap-10 w-full">
      <h1 name="search-content" className="text-xl md:text-3xl font-bold">
        Search results for {search}
      </h1>
      <MasonryArtList
        artList={data}
        loading={isFetching}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};

export default Search;
