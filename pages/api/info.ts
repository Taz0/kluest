// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  result: boolean
  contract: string,
  key: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.dir(process.env);
  console.log(`Contract ${process.env.TOKEN_CONTRACT_ADDRESS!}`);
  console.log(`Using mnemonic ${process.env.MNEMONIC?.substring(0, 5) || 'Unknown'}`);
  res.status(200).json(
    { 
      result: true,
      contract: 'process.env.TOKEN_CONTRACT_ADDRESS',
      key: process.env.MNEMONIC?.substring(0, 5) || 'Unknown'
  })
}
