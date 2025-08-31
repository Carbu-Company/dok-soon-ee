"use server";

import sql from "mssql";
import { getPool } from "@/lib/mssql/pool";

/* 현금/세금계산서 미발행 리스트 */
export const registerUser = async (name, email, password) => {
  try {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/registerUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email, 
        password
      })
    }).then(res => res.json());
    return { success: true, data, error: null };
  } catch (error) {
    console.error("registerUser Error:", error);
    return { success: false, data: [], error: error.message };
  }
};
