import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;

  // TODO: Replace mock data with real DB lookup
  const mockData = {
    id,
    offerType: '상사매입',
    modelName: '그랜저(승용)',
    carNo: '123가1234 (123허1234)',
    dealerName: '홍길동',
    purchaseDate: '2025-08-01',
    purchaseAmount: 100000000
  };

  return NextResponse.json(mockData);
}
