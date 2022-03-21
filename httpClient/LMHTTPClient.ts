import ky from 'ky';
import _ from 'lodash';
import { CryptoAddress } from '../shared/SharedTypes';

export type BalanceResult = number | object;

interface BalanceResponse {
  amount: number;
}

class LMHTTPClient {

  static baseURL = process.env.ENV_SERVER_URL;
  static balanceEndPoint = `${LMHTTPClient.baseURL}/api/balance`;

  static async getBalance(address: CryptoAddress, tokenAddress?: CryptoAddress): Promise<BalanceResponse> {
    const response = await ky.post(LMHTTPClient.balanceEndPoint, { json: { address: address, tokenAddress: tokenAddress } }).json() as any;
    const result = response.result;
    const balanceResponse = (result as BalanceResponse);
    if (_.isNumber(balanceResponse.amount)) {
      return balanceResponse;
    }
    throw new Error("Invalid Params");
  }
}

export default LMHTTPClient;