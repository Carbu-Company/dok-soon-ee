export const getCarConcilList = async (params) => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCarConcilList`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    }).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getCarConcilList Error:", error); 
    return { success: false, data: [], error: error.message };
  }
};

export const getCarConcilSummary = async (params) => {
try {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCarConcilSummary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  }).then(res => res.json());
  return { success: true, data, error: null };
} catch (error) {
  console.error("getCarConcilSummary Error:", error);  
  return { success: false, data: [], error: error.message };
}
};
