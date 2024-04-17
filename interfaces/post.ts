export interface IPostAdditionalInfoResponse {
  like: ILikeResponse;
}

export interface ILikeResponse {
  likeCount: number;
  isLiked: boolean;
}
