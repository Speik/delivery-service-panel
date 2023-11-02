import { RequestError, UnauthorizedError, parseLocalDate } from '@/utils';
import { useAuth } from './use-auth';

type RequestData = FormData | Record<string, any>;
type RequestParams = Record<string, any>;

type UseFetchOptions = Omit<RequestInit, 'body'> & {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: RequestData;
  params?: RequestParams;
};

type HttpErrorResponse = {
  error: string;
  statusCode: number;
  message: string | string[];
}

const BASE_URL: string | undefined = import.meta.env.VITE_API_BASE_URL;
const API_PREFIX = '/api/v1';

const getQueryData = (data?: RequestData) => {
  if (!data) return null;
  if (data instanceof FormData) return data;
  return JSON.stringify(data);
};

const getQueryParams = (params?: RequestParams) => {
  if (!params) return '';
  return '?' + new URLSearchParams(params).toString();
};

const getQueryToken = () => {
  const { authorizedUser } = useAuth();

  if (!authorizedUser) return '';
  return `Bearer ${authorizedUser.accessToken}`;
};

const formatDateFields = (data: Record<string, any>) => {
  data.createdAt &&= parseLocalDate(data.createdAt);
  data.updatedAt &&= parseLocalDate(data.updatedAt);
  data.deletedAt &&= parseLocalDate(data.deletedAt);

  return data;
};

const handleResponse = async (response: Response) => {
  try {
    const data = await response.json();

    if (Array.isArray(data)) {
      return data.map(formatDateFields);
    }

    return formatDateFields(data);
  } catch {
    return null;
  }
};

const handleError = async (response: Response) => {
  const error: HttpErrorResponse = await response.json();

  const message = Array.isArray(error.message)
    ? error.message.join(', ')
    : error.message;

  if (response.status === 401) {
    throw new UnauthorizedError(message);
  }

  throw new RequestError(message);
};


const useFetch = async <T>(url: string, options: UseFetchOptions): Promise<T> => {
  const { data, params, headers, ...requestOptions } = options;

  if (!BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not defined');
  }

  const queryParams = getQueryParams(params);
  const queryUrl = BASE_URL + API_PREFIX + url + queryParams;

  const queryData = getQueryData(data);
  const isFormData = queryData instanceof FormData;
  const queryToken = getQueryToken();

  const response = await fetch(queryUrl, {
    ...requestOptions,
    body: queryData,
    headers: {
      'Authorization': queryToken,
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...headers,
    },
  });

  if (!response.ok) {
    await handleError(response);
  }

  return handleResponse(response) as Promise<T>;
};

export { useFetch };