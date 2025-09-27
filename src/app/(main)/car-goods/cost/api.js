
export const getGoodsFeeList = async (params) => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getGoodsFeeList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    }).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getGoodsFeeList Error:", error); 
    return { success: false, data: [], error: error.message };
  }
};

export const getGoodsFeeCarSummary = async (params) => {
try {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getGoodsFeeCarSummary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  }).then(res => res.json());
  return { success: true, data, error: null };
} catch (error) {
  console.error("getGoodsFeeCarSummary Error:", error);  
  return { success: false, data: [], error: error.message };
}
};
