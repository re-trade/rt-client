export interface IPaginationResponse {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export interface IPaginationWrapper<T extends any[]> {
  data: T;
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
}

export interface IResponseObject<T> {
  content: T;
  messages: string[];
  code: string;
  success: boolean;
  pagination?: IPaginationResponse;
}

export const createResponseObject = <T>(params: {
  content: T;
  messages?: string[] | string;
  code: string;
  success: boolean;
  pagination?: IPaginationResponse;
}): IResponseObject<T> => {
  const { content, messages, code, success, pagination } = params;
  return {
    content,
    messages: typeof messages === 'string' ? [messages] : (messages ?? []),
    code,
    success,
    pagination,
  };
};

export const unwrapPaginationWrapper = <T extends any[]>(
  wrapper: IPaginationWrapper<T>,
  options?: {
    code?: string;
    messages?: string[] | string;
    success?: boolean;
  },
): IResponseObject<T> => {
  if (!wrapper?.data) throw new Error('Invalid wrapper: data is undefined');

  return {
    content: wrapper.data,
    messages:
      typeof options?.messages === 'string' ? [options.messages] : (options?.messages ?? []),
    code: options?.code ?? '200',
    success: options?.success ?? true,
    pagination: {
      page: wrapper.page,
      size: wrapper.size,
      totalPages: wrapper.totalPages,
      totalElements: wrapper.totalElements,
    },
  };
};
