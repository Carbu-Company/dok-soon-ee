"use server";

export const getPurchasesListNew = async (carAgent, page, pageSize) => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/getSuggestListNew`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ carAgent, page, pageSize })
    }).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("getPurchasesListNew Error:", error);
    return { success: false, data: [], error: error.message };
  }
};