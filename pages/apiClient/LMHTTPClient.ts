import ky from 'ky';
import _ from 'lodash';
import { CryptoAddress } from '../../shared/SharedTypes';

export type BalanceResult = number | object;

interface BalanceResponse {
  amount: number;
}

class LMHTTPClient {

  static baseURL = process.env.NEXT_PUBLIC_SERVER_URL;
  static balanceEndPoint = `${LMHTTPClient.baseURL}/api/balance`;

  static async getBalance(address: CryptoAddress): Promise<BalanceResponse> {        
    const response = await ky.post(LMHTTPClient.balanceEndPoint, { json: { address: address } }).json() as any;
    const result = response.result;
    const balanceResponse = (result as BalanceResponse);
    if (_.isNumber(balanceResponse.amount)) {
      return balanceResponse;
    }
    throw new Error("Invalid Params");
  }
}

export default LMHTTPClient;