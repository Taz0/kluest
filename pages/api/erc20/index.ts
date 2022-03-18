// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getBalance } from '../../../server/LMBalance'
import { CryptoAddress } from '../../../shared/SharedTypes';

type ResponseType = object;

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {
  const addressParam = req.body.address;
  if (_.isUndefined(addressParam)) {
    console.error(`No param address found in body`);
    const response = { json: { result: 'Invalid params' } };
    res.status(401).json(response);
    return;
  }

  const address = addressParam as CryptoAddress;
  console.log(`Checking balance of address ${address}`);
  const amount = await getBalance(address);
  console.log(`Checking finished result ${amount}`);
  res.status(200).json({ result: { amount: amount } });
}
