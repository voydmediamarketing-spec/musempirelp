import { NextResponse } from "next/server";
import { buildOpenApiDocument } from "@musempire/contracts/openapi";

export async function GET() {
  return NextResponse.json(buildOpenApiDocument());
}
