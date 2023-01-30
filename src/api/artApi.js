import instance from "."

export const fetchHomeArts = (page) => instance.get(`art?page=${page}`)

export const fetchAuthorArts = (authorId, page) => instance.get(`art/author/${authorId}?page=${page}`)

export const fetchSearchArts = (searchText, page) => instance.get(`art/search/${searchText}?page=${page}`)

export const fetchDetailArt = (artId) => instance.get(`art/${artId}`)

export const createArt = (art) => instance.post("art", art)

export const editArt = (artId, editContent) => instance.patch(`art/${artId}`, editContent)

export const deleteArt = (artId) => instance.delete(`art/${artId}`)