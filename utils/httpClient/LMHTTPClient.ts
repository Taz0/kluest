import ky, { HTTPError } from 'ky';
import _ from 'lodash';
import { CryptoAddress } from '../../shared/SharedTypes';

export type BalanceResult = number | object;

interface BalanceResponse {
  amount: number;
}

export interface RequestResponse {
  result: boolean;
  message?: string;
}

class LMHTTPClient {

  static async balance(address: CryptoAddress, tokenAddress?: CryptoAddress): Promise<BalanceResponse> {
    const endpoint = `/api/balance`;
    console.log(`Haciendo post a ${endpoint}`);

    const response = await ky.post(endpoint, { json: { address: address, tokenAddress: tokenAddress } }).json() as any;
    const result = response.result;
    const balanceResponse = (result as BalanceResponse);
    if (_.isNumber(balanceResponse.amount)) {
      return balanceResponse;
    }
    throw new Error("Invalid Params");
  }

  static async sendAirDrop(address: CryptoAddress, tokenAddress?: CryptoAddress): Promise<RequestResponse> {
    const endpoint = `/api/initialAirdrop`;
    console.log(`Haciendo post a ${endpoint}`);
    try {
      const response = await ky.post(endpoint, { json: { address: address, tokenAddress: tokenAddress } }).json() as any;
      const requestResponse = (response as RequestResponse);
      return requestResponse;
    } catch (error) {
      const httpError = error as HTTPError;
      const errorBody = await httpError.response.json();
      throw new Error(errorBody.message, errorBody);
    }
  }

  static async sendChestReward(address: CryptoAddress, amountMilli: number, tokenAddress?: CryptoAddress): Promise<RequestResponse> {
    const endpoint = `/api/chestReward`;
    console.log(`Haciendo post a ${endpoint}`);
    try {
      const response = await ky.post(endpoint, { json: { address: address, amountMilli: amountMilli, tokenAddress: tokenAddress } }).json() as any;
      const requestResponse = (response as RequestResponse);
      return requestResponse;
    } catch (error) {
      const httpError = error as HTTPError;
      const errorBody = await httpError.response.json();
      throw new Error(errorBody.message, errorBody);
    }
  }

  static async getUserItems(address: CryptoAddress, tokenAddress?: CryptoAddress): Promise<RequestResponse> {
    const endpoint = `/api/userItems`;
    console.log(`Haciendo post a ${endpoint}`);
    try {
      const response = await ky.post(endpoint, { json: { address: address, tokenAddress: tokenAddress } }).json() as any;
      const itemsResponse = {
        result: response.result,
        message: response.items
      };
      return itemsResponse;
    } catch (error) {
      const httpError = error as HTTPError;
      const errorBody = await httpError.response.json();
      throw new Error(errorBody.message, errorBody);
    }
  }

  static async sendRewardItem(address: CryptoAddress, item: string, tokenAddress?: CryptoAddress): Promise<RequestResponse> {
    const endpoint = `/api/rewardItem`;
    console.log(`Haciendo post a ${endpoint}`);
    try {
      const response = await ky.post(endpoint, { json: { address: address, item: item, tokenAddress: tokenAddress } }).json() as any;
      const requestResponse = (response as RequestResponse);
      return requestResponse;
    } catch (error) {
      const httpError = error as HTTPError;
      const errorBody = await httpError.response.json();
      throw new Error(errorBody.message, errorBody);
    }
  }

}

export default LMHTTPClient;