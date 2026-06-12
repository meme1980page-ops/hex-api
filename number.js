// api/merge.js - Vercel serverless function
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req;
  const input = query.input || query.tg || query.number;
  
  if (!input) {
    return res.status(400).json({
      error: 'Missing parameter',
      usage: '/api/merge?input=@username OR 9999999999',
      developer: '@Zyro_ooo'
    });
  }

  const isTelegram = input.startsWith('@');
  
  try {
    let phoneNumber = null;
    let details = null;
    
    // Step 1: If input is Telegram username, fetch number
    if (isTelegram) {
      const tgRes = await fetch(
        `https://numinfo.eu.cc/api/tg?apikey=freehostmafiatestkey&tg2num=${encodeURIComponent(input)}`
      );
      const tgData = await tgRes.json();
      
      if (!tgData.success || !tgData.number) {
        return res.status(404).json({
          success: false,
          message: 'Telegram username not found',
          developer: '@Zyro_ooo'
        });
      }
      
      phoneNumber = tgData.number;
    } else {
      // Input is already a number
      phoneNumber = input.replace(/\D/g, ''); // Keep only digits
    }
    
    // Step 2: Fetch details using the phone number
    const infoRes = await fetch(
      `https://numinfo.eu.cc/api/check?apikey=freekeyhostmafia&number=${phoneNumber}`
    );
    const infoData = await infoRes.json();
    
    // Step 3: Format combined response
    const combinedResponse = {
      success: true,
      developer: '@Zyro_ooo',
      credit: {
        original_api: infoData.credit || { name: "LAKHAN LAKHNOTRA", developer: "@LAKHAN_LAKHNOTRA" },
        merged_by: "@Zyro_ooo"
      },
      input_type: isTelegram ? 'telegram_username' : 'phone_number',
      original_input: input,
      phone_number: phoneNumber,
      records: infoData[0] ? Object.values(infoData).filter(item => typeof item === 'object' && item.mobile) : [],
      total_records: Object.values(infoData).filter(item => typeof item === 'object' && item.mobile).length
    };
    
    // If from Telegram, also include Telegram metadata
    if (isTelegram && tgData) {
      combinedResponse.telegram_meta = {
        tg_id: tgData.tg_id,
        country: tgData.country,
        country_code: tgData.country_code
      };
    }
    
    return res.status(200).json(combinedResponse);
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
      developer: '@Zyro_ooo'
    });
  }
}
