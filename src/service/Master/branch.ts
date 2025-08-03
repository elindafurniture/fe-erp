import type { IDefaultParams } from "@/model/utils-interface";
import { apiMaster } from "../apiMaster";

export const basePath = '/master/branch';

export function list(params: IDefaultParams) {
  return apiMaster({
    url: `${basePath}`,
    method: 'GET',
    params,
  });
}