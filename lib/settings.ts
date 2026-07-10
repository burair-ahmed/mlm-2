import SystemSettings from '../models/SystemSettings';
import dbConnect from './dbConnect';

export async function getEquityUnitPrice(): Promise<number> {
  try {
    await dbConnect();
    const setting = await SystemSettings.findOne({ key: 'equityUnitPrice' });
    if (setting && typeof setting.value === 'number') {
      return setting.value;
    }
  } catch (err) {
    console.error("Error fetching equity unit price:", err);
  }
  return 10; // Default fallback
}
