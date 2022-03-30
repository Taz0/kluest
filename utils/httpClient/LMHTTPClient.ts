import ky from 'ky';
import _ from 'lodash';
import { CryptoAddress } from '../../shared/SharedTypes';

export type BalanceResult = number | object;

interface BalanceResponse {
  amount: number;
}

export interface RewardResponse {
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

  static async sendAirDrop(address: CryptoAddress, tokenAddress?: CryptoAddress): Promise<RewardResponse> {
    const endpoint = `/api/initialAirdrop`;
    console.log(`Haciendo post a ${endpoint}`);

    const response = await ky.post(endpoint, { json: { address: address, tokenAddress: tokenAddress } }).json() as any;
    const airdropResponse = (response as RewardResponse);
    if (_.isBoolean(airdropResponse.result)) {
      return airdropResponse;
    }
    throw new Error("Invalid Params");
  }

  static async sendChestReward(address: CryptoAddress, amountMilli: number, tokenAddress?: CryptoAddress): Promise<RewardResponse> {
    const endpoint = `/api/chestReward`;
    console.log(`Haciendo post a ${endpoint}`);

    const response = await ky.post(endpoint, { json: { address: address, amountMilli: amountMilli, tokenAddress: tokenAddress } }).json() as any;
    const rewardResponse = (response as RewardResponse);
    if (_.isBoolean(rewardResponse.result)) {
      return rewardResponse;
    }
    throw new Error("Invalid Params");
  }

}

export default LMHTTPClient;