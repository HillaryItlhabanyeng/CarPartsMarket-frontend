import api from "./axiosInstance";
import type { User } from "../Components/AuthContext.types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterBuyerRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  buyingPart: string;
}

export interface RegisterSellerRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  sellingPart: string;
}

export interface RegisterAdminRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role: string;
  permissions: string;
}

export const loginUser = (credentials: LoginRequest) =>
  api.post<User>("/api/auth/login", credentials);

export const registerBuyer = (data: RegisterBuyerRequest) =>
  api.post<User>("/api/auth/register/buyer", data);

export const registerSeller = (data: RegisterSellerRequest) =>
  api.post<User>("/api/auth/register/seller", data);

export const registerAdmin = (data: RegisterAdminRequest) =>
  api.post<User>("/api/auth/register/admin", data);