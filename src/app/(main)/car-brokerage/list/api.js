export const getCarBrkTradeList = async (params) => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCarBrkTradeList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    }).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getCarBrkTradeList Error:", error); 
    return { success: false, data: [], error: error.message };
  }
};

export const getCarBrkTradeSummary = async (params) => {
try {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCarBrkTradeSummary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  }).then(res => res.json());
  return { success: true, data, error: null };
} catch (error) {
  console.error("getCarBrkTradeSummary Error:", error);  
  return { success: false, data: [], error: error.message };
}
};
