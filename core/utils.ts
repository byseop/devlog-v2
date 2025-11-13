import type { Response } from '@interfaces/index';

export const createApiSuccessResponse = <T>(data: T): Response<T> => {
  return Object.assign({ data }, { status: 'ok', error: null });
};
