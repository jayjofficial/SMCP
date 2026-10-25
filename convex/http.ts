import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/contact",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

http.route({
  path: "/contact",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    try {
      const data = await request.json();

      if (!data.name || !data.email || !data.subject || !data.message) {
        return new Response(
          JSON.stringify({ error: "Missing required inquiry fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      await ctx.runMutation(api.inquiries.create, {
        name: data.name,
        email: data.email,
        organization: data.organization || "",
        category: data.category || "General Secretariat Inquiry",
        subject: data.subject,
        message: data.message,
        submittedAt: data.submittedAt || new Date().toISOString(),
        source: data.source || "Website Contact Form",
      });

      return new Response(
        JSON.stringify({ success: true, message: "Inquiry successfully recorded by Secretariat" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: err.message || "Failed to process inquiry" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }),
});

export default http;
