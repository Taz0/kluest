// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next'
import { CryptoAddress } from '../../shared/SharedTypes';
import { initialAirdrop } from '../../server/LMUserCases'

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

  let contractAddress = req.body.tokenAddress;
  if (_.isUndefined(contractAddress) || contractAddress.length === 0) {
    contractAddress = process.env.TOKEN_CONTRACT_ADDRESS;
  }

  const address = addressParam as CryptoAddress;
  try {
    await initialAirdrop(address, contractAddress);
    res.status(200).json({ result: true, message: 'Airdrop executed successfully' });
  } catch (ex) {
    const exception = ex as any;
    const resultBody = exception?.error?.error?.body;
    console.error(`initial airdrop failed: ${resultBody}`);
    if (_.isString(exception.reason)){exception.reason
      res.status(200).json({ result: false, message: exception.reason});
      return;      
    }
    let errorMessage;
    if (_.isString(resultBody)) {
      errorMessage = JSON.parse(resultBody).error.message;
    }
    res.status(200).json({ result: false, message: errorMessage || 'Unknown error' });
  }
}
