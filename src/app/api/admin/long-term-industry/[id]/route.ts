import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../../../../lib/dbConnect';
import LongTermPackage from '../../../../../../models/LongTermPackage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const { id } = req.query;

  switch (req.method) {
    case 'GET': // Get Single Long-Term Package
      try {
        const packageData = await LongTermPackage.findById(id);
        if (!packageData) return res.status(404).json({ error: 'Package not found' });
        return res.status(200).json(packageData);
      } catch {
        return res.status(500).json({ error: 'Error fetching package' });
      }

    case 'PUT': // Update Long-Term Package
      try {
        const updatedPackage = await LongTermPackage.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json(updatedPackage);
      } catch {
        return res.status(400).json({ error: 'Error updating package' });
      }

    case 'DELETE': // Delete Long-Term Package
      try {
        await LongTermPackage.findByIdAndDelete(id);
        return res.status(200).json({ message: 'Package deleted' });
      } catch {
        return res.status(500).json({ error: 'Error deleting package' });
      }

    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
