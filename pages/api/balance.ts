// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getTelosBalance, getTokenBalance } from '../../server/LMBalance'

type ResponseType = object;

// POST: obtain balance from address
// PARAMS: - address: Hex address of the account
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }

  const addressParam = req.body.address;
  if (!_.isString(addressParam)) {
    console.error(`No param address found in body`);
    const response = { json: { result: 'Invalid params' } };
    res.status(401).json(response);
    return;
  }

  let tokenAddress = req.body.tokenAddress;
  if (_.isUndefined(tokenAddress) || tokenAddress.length === 0) {
      tokenAddress = process.env.TOKEN_CONTRACT;
  }

  let amount;
  if (_.isString(tokenAddress)) {
    // The token contract address is defined, by param or in .env.loval
    amount = await getTokenBalance(addressParam, tokenAddress);
  } else {
    amount = await getTelosBalance(addressParam);
    console.log(`Telos balance amount ${amount}`);
  }

  res.status(200).json({ result: { amount: amount } });
}
