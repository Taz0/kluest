// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {checkBalances, Balance} from '../../lib/balance'

type Data = Balance[];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(`Checking balances`);
  const balances = await checkBalances();
  console.log(`Checking finished`);
  res.status(200).json(balances);
}
