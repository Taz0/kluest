// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import _ from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next'
import { CryptoAddress } from '../../shared/SharedTypes';
import { airdrop50ToUser, userBuyItem } from '../../server/LMUserCases'

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

  const amountParam = req.body.amount;
  if (!_.isString(amountParam)) {
    console.error(`No param amount found in body`);
    const response = { json: { result: 'Invalid params' } };
    res.status(401).json(response);
    return;
  }


    
  try {
    console.log(`Usuario ${addressParam} compra ${itemParam} por ${amountParam}`);
    await userBuyItem(addressParam, itemParam, amountParam);
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
