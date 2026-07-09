import { NextResponse } from "next/server";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("perPage") || "20");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  let filtered = [...MOCK_TRANSACTIONS];
  if (startDate && endDate) {
    filtered = MOCK_TRANSACTIONS.filter(
      (t) => t.date >= startDate && t.date <= endDate
    );
  }

  // Sort by date descending
  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return NextResponse.json({
    data: paginated,
    pagination: { page, perPage, total, totalPages },
  });
}
