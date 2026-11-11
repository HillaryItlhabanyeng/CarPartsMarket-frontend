import api from "./axiosInstance";

export interface ReviewDTO {
  reviewId: string;
  carPartId: string;
  reviewerEmail: string;
  reviewerName: string;
  reviewerRole: "buyer" | "seller" | "admin";
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

export interface NewReview {
  carPartId: string;
  reviewerName: string;
  rating: number;
  title: string;
  comment: string;
}

export const getAllReviews = () => api.get<ReviewDTO[]>("/api/reviews");
export const getPartReviews = (carPartId: string) =>
  api.get<ReviewDTO[]>(`/api/reviews/part/${encodeURIComponent(carPartId)}`);
export const createReview = (review: NewReview) => api.post<ReviewDTO>("/api/reviews", review);

export interface ContactRequest {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}
export const sendContactMessage = (data: ContactRequest) => api.post("/api/contact", data);
