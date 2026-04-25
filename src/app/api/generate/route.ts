// import { NextResponse } from "next/server";
// import { config } from "@/envConfig";


// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();
//     const prompt = formData.get("prompt") as string;
//     const result = await uploadAndExecuteFlow(prompt)
//     return NextResponse.json({
//       success: true,
//       result,
//     });
//   } catch (err: any) {
//     return NextResponse.json(
//       { error: err.message },
//       { status: 500 }
//     );
//   }
// }


