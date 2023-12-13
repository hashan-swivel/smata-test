import { axiosInstance } from '@/utils/axiosInstance';
import { SWRConfiguration } from 'swr';

const fetcher = async (url: string) => {
  return (await axiosInstance.get(url)).data;
};

export const swrConfig: SWRConfiguration = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  fetcher
};
