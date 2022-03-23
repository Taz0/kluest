// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next'
import { CryptoAddress } from '../../shared/SharedTypes';
import { giveItemUriToUser } from '../../server/LMNFT';

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

  const uriParam = req.body.uri;
  if (!_.isString(uriParam)) {
    console.error(`No param uri found in body`);
    const response = { json: { result: 'Invalid params' } };
    res.status(401).json(response);
    return;
  }
  const uri = uriParam as CryptoAddress;

  try {
    console.log(`Giving NFT to ${address} with uri ${uri}`);
    const tokenId = await giveItemUriToUser(address, uri);
    res.status(200).json({ result: true, message: `NFT given successfully id ${tokenId}` });
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
