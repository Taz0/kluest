// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log(`Using mnemonic ${process.env.MNEMONIC.substring(0, 5) || 'Unknown'}`);
  console.dir(process.env);
  res.status(200).json({ name: 'Hello world!' })
}
