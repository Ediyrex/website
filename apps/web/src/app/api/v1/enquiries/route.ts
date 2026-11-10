import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/validations/enquiry";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parseResult = enquirySchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validData = parseResult.data;

    // Minimal structured log (omits raw personal phone/free-text PII per privacy guidelines)
    console.log("[API v1 /enquiries] Client enquiry validated:", {
      projectType: validData.projectType,
      budgetCurrency: validData.budgetCurrency,
      budgetRange: validData.budgetRange,
      timeline: validData.timeline,
      wantsDiscoveryCall: validData.wantsDiscoveryCall,
      consentAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        stored: false,
        mode: "local_preview",
        message:
          "Enquiry validated in local preview mode. Persistent database storage and email delivery will be enabled in the backend phase.",
        data: {
          referenceId: `PREVIEW-${Date.now().toString().slice(-6)}`,
          status: "validated_preview",
          wantsDiscoveryCall: validData.wantsDiscoveryCall,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API v1 /enquiries] Error processing submission:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message:
          "Unable to process enquiry at this time. Please email hello@ediyrex.com directly.",
      },
      { status: 500 }
    );
  }
}
