import {NextRequest, NextResponse} from "next/server";

import {mapMatchToResponse, searchIndex} from "./searchIndex";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Math.min(25, Math.max(1, Number(limitParam))) : 10;

  try {
    const matches = await searchIndex(query, limit);
    const results = matches.map(mapMatchToResponse);

    return NextResponse.json({
      query,
      limit,
      count: results.length,
      results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        query,
        limit,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {status: 500}
    );
  }
}