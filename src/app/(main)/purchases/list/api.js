export const getDealerList = async (carAgent) => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getDealerList?carAgent=${carAgent}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getDealerList Error:", error);
    return { success: false, data: [], error: error.message };
  }
};


export const getCarPurList = async (params) => {
    try {
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCarPurList`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
      }).then(res => res.json());
      return { success: true, data, error: null };
    } catch (error) {
      console.error("getCarPurList Error:", error); 
      return { success: false, data: [], error: error.message };
    }
  };


export const getCarPurSummary = async (params) => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getCarPurSummary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params)
    }).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getCarPurSummary Error:", error);
    return { success: false, data: [], error: error.message };
  }
};
