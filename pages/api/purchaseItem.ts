// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next'
import { CryptoAddress } from '../../shared/SharedTypes';
import { purchaseItem } from '../../server/LMUserCases'

type ResponseType = object;

// POST: obtain balance from address
// PARAMS: - address: Hex address of the account
export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseType>) {

  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }    
  
  // Validate params
  const addressParam = req.body.address as CryptoAddress;
  if (!_.isString(addressParam)) {
    console.error(`No param address found in body`);
    const response = { json: { result: 'Invalid params' } };
    res.status(401).json(response);
    return;
  }

  const itemParam = req.body.item;
  if (!_.isString(itemParam)) {
    console.error(`No param item found in body`);
    const response = { json: { result: 'Invalid params' } };
    res.status(401).json(response);
    return;
  }

  const amountMilli = _.parseInt(req.body.amountMilli);
  if (!_.isNumber(amountMilli) || _.isNaN(amountMilli)) {
    console.error(`No param number found or not valid in body`);
    const response = { json: { result: 'Invalid params' } };
    res.status(401).json(response);
    return;
  }
    
  const contractAddress = process.env.TOKEN_CONTRACT_ADDRESS!;

  try {
    console.log(`Usuario ${addressParam} compra ${itemParam} por ${amountMilli}`);
    await purchaseItem(addressParam, itemParam, amountMilli, contractAddress);
    res.status(200).json({ result: true, message: 'Purchase executed successfully' });
  } catch (ex) {
    console.dir(ex);
    const exception = ex as any;
    const errorMessage = exception?.error?.message;
    res.status(401).json({ result: false, message: errorMessage || 'Unknown error' });
  }
}
