import React, { memo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchHomeArts } from "@/api/artApi";

import MasonryArtList from "components/MasonryArtList";

const Home = () => {
  const { data, fetchNextPage, isLoading, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["artList"],
    queryFn: ({ pageParam = 1 }) => {
      return fetchHomeArts(pageParam);
    },
    
    /* enabled: false, */

    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.numberOfPages > allPages.length
        ? allPages.length + 1
        : undefined;
    },
  });


  return (
    <div className="w-full">
      <MasonryArtList
        artList={data}
        fetchNextPage={fetchNextPage}
        loading={isLoading}
        loadingNextPage={isFetchingNextPage}
      />
    </div>
  );
};

export default memo(Home);
