"use client";

import { useState } from "react";
import { getBrokerageDataByCellNo } from "./api";

export default function BrokeragePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">중개업 데이터 조회</h1>
        <div className="flex gap-4 mb-4">
          <button
            onClick={async () => {
              setLoading(true);
              setError(null);
              setData([]);

              try {
                const res = await getBrokerageDataByCellNo("논리", "물리");
                if (res.success) {
                  setData(res.data);
                } else {
                  setError(res.error);
                }
              } catch (err) {
                setError("API 호출 중 오류가 발생했습니다: " + err.message);
              } finally {
                setLoading(false);
              }
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "조회 중..." : "전체 조회"}
          </button>
        </div>
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          오류: {error}
        </div>
      )}

      {/* 데이터 테이블 */}
      {!loading && !error && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {data && data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      kor_nm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      eng_nm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      kor_full_nm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      kor_desc
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.kor_nm || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.eng_nm}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.kor_full_nm}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.kor_desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              조회된 데이터가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
