import ky from 'ky';
import _ from 'lodash';
import { CryptoAddress } from '../../shared/SharedTypes';

export type BalanceResult = number | object;

interface BalanceResponse {
  amount: number;
}

export interface AirDropResponse {
  result: boolean;
  message?: string;
}

class LMHTTPClient {

  static baseURL = process.env.NEXT_PUBLIC_SERVER_URL;

  static async getBalance(address: CryptoAddress, tokenAddress?: CryptoAddress): Promise<BalanceResponse> {
    const endpoint = `${LMHTTPClient.baseURL}/api/balance`;
    console.log(`Haciendo post a ${endpoint}`);

    const response = await ky.post(endpoint, { json: { address: address, tokenAddress: tokenAddress } }).json() as any;
    const result = response.result;
    const balanceResponse = (result as BalanceResponse);
    if (_.isNumber(balanceResponse.amount)) {
      return balanceResponse;
    }
    throw new Error("Invalid Params");
  }

  static async sendAirDrop(address: CryptoAddress): Promise<AirDropResponse> {
    const endpoint = `${LMHTTPClient.baseURL}/api/airDrop`;
    console.log(`Haciendo post a ${endpoint}`);

    const response = await ky.post(endpoint, { json: { address: address } }).json() as any;
    const airDropResponse = (response as AirDropResponse);
    if (_.isBoolean(airDropResponse.result)) {
      return airDropResponse;
    }
    throw new Error("Invalid Params");
  }

}

export default LMHTTPClient;