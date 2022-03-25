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

  static async getBalance(address: CryptoAddress, tokenAddress?: CryptoAddress): Promise<BalanceResponse> {
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

  static async sendAirDrop(address: CryptoAddress, tokenAddress?: CryptoAddress): Promise<AirDropResponse> {
    const endpoint = `/api/airDrop`;
    console.log(`Haciendo post a ${endpoint}`);

    const response = await ky.post(endpoint, { json: { address: address, tokenAddress: tokenAddress } }).json() as any;
    const airDropResponse = (response as AirDropResponse);
    if (_.isBoolean(airDropResponse.result)) {
      return airDropResponse;
    }
    throw new Error("Invalid Params");
  }

}

export default LMHTTPClient;