import { axiosInstance } from './instance';
import { CartDTO, CreateCartItemValues } from './dto/cart.dto';

export const getCart = async (): Promise<CartDTO> => {
  return (await axiosInstance.get<CartDTO>('/cart')).data;
};

export const updateItemQuantity = async (id: string, quantity: number): Promise<CartDTO> => {
  return (await axiosInstance.patch<CartDTO>(`/cart/${id}`, { quantity })).data;
};

export const removeCartItem = async (id: string): Promise<CartDTO> => {
  return (await axiosInstance.delete<CartDTO>(`/cart/${id}`)).data;
};

export const addCartItem = async (values: CreateCartItemValues): Promise<CartDTO> => {
  return (await axiosInstance.post<CartDTO>('/cart', values)).data;
};