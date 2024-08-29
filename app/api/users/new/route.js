// import UserName from "@models/userName";
// import { connectToDB } from "@utils/database";

// const UserHandler = async (req) => {
//   const { userId, password } = await req.json();

//   try {
//     await connectToDB();

//     const newUser = await UserName.create({
//       userId,
//       password,
//     });

//     return new Response(JSON.stringify(newUser), { status: 201 });
//   } catch (error) {
//     return new Response("Failed", { status: 500 });
//   }
// };

// export { UserHandler as POST };

// // export const POST = async (request) => {
// //     const { userId, prompt, tag } = await request.json();

// //     try {
// //         await connectToDB();
// //         const newPrompt = new Prompt({ creator: userId, prompt, tag });

// //         await newPrompt.save();
// //         return new Response(JSON.stringify(newPrompt), { status: 201 })
// //     } catch (error) {
// //         return new Response("Failed to create a new prompt", { status: 500 });
// //     }
// // }
