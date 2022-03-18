// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getTelosBalance, getTokenBalance } from '../../server/LMBalance'
import { CryptoAddress } from '../../shared/SharedTypes';

type ResponseType = object;

// POST: obtain balance from address
// PARAMS: - address: Hex address of the account
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const addressParam = req.body.address;
  if (!_.isString(addressParam)) {
    console.error(`No param address found in body`);
    const response = { json: { result: 'Invalid params' } };
    res.status(401).json(response);
    return;
  }

  const tokenAddressParam = req.body.tokenAddress;
  if (_.isString(tokenAddressParam)) {
    // Load token contract, by default loads TokenERC20.abi
    const amount = await getTokenBalance(addressParam, tokenAddressParam);
    console.log(`Checking finished result ${amount}`);
    res.status(200).json({ result: { amount: amount } });
    return;
  }

  // Load token contract, by default loads TokenERC20.abi
  const tokenContract = process.env.ENV_TOKEN_CONTRACT;
  if (_.isString(tokenContract)) {
    const amount = await getTokenBalance(addressParam, tokenContract);
    console.log(`Checking finished result ${amount}`);
    res.status(200).json({ result: { amount: amount } });
    return;
  }

  const address = addressParam as CryptoAddress;
  console.log(`Checking balance of address ${address}`);
  const amount = await getTelosBalance(address);
  console.log(`Checking finished result ${amount}`);
  res.status(200).json({ result: { amount: amount } });
}
