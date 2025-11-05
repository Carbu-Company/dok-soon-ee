



export const getCarCashList = async (params) => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCarCashList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    }).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getCarCashList Error:", error); 
    return { success: false, data: [], error: error.message };
  }
};

export const getCarCashSummary = async (params) => {
try {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCarCashSummary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  }).then(res => res.json());
  return { success: true, data, error: null };
} catch (error) {
  console.error("getCarCashSummary Error:", error);  
  return { success: false, data: [], error: error.message };
}
};
