// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next'
import { CryptoAddress } from '../../shared/SharedTypes';
import { airdrop50ToUser } from '../../server/LMAirDrop'

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

  const address = addressParam as CryptoAddress;
  try {
    console.log(`Ejecutando airdrop a ${address}`);
    await airdrop50ToUser(address);
    res.status(200).json({ result: true, message: 'Air Drop executed successfully' });
  } catch (ex) {
    const exception = ex as any;
    const resultBody = exception?.error?.error?.body;
    let errorMessage;
    if (_.isString(resultBody)) {
      errorMessage = JSON.parse(resultBody).error.message;
    }
    res.status(200).json({ result: false, message: errorMessage || 'Unknown error' });
  }
}
