import instance from ".";

export const fetchCommentsFromArt = (artId) => instance.get(`comment/get/${artId}`)

export const postComment = (newComment) => instance.post("comment", newComment)

export const editComment = (commentId, editComment) => instance.patch(`comment/${commentId}`, editComment)

export const deleteComment = (commentId) => instance.delete(`comment/${commentId}`)