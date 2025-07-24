import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

// 1- we need to make sure that the webhook event is coming from Clerk
// 2- if so, we will listen for the "user.created" event
// 3- we will save the user to the database
// 4- we will return a 200 response if the event is processed successfully
// 5- if the event is not processed successfully, we will return a 400 response

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
    }
    // check if the request is coming from Clerk
    // check headers
    // svix-id, svix-signature, svix-timestamp are required headers for Clerk webhooks
    // svix-id is the ID of the webhook event
    // svix-signature is the signature of the webhook event
    // svix-timestamp is the timestamp of the webhook event 
    const svix_id = request.headers.get("svix-id");
    const svix_signature = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_signature || !svix_timestamp) {
      return new Response("Error occurred -- no svix headers", {
        status: 400,
      });
    }
    // read the request body
    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt: any;

    // verify webhook
    // if the verification fails, it will throw an error
    // if it succeeds, it will return the event
    // we can then use the event to get the user details
    // and save the user to the database
    // if the verification fails, we will return a 400 response
    // if it succeeds, we will return a 200 response
    // if the verification fails, we will log the error and return a 400 response
    // if it succeeds, we will log the event and return a 200 response
    // this is a security measure to ensure that the webhook is coming from Clerk
    // and not from an attacker trying to spoof the webhook
    // we will also log the event to see what data we are getting from Clerk
    // this will help us debug any issues that may arise in the future
    // we will also log the event type to see what events we are getting from Clerk
    // this will help us understand what events we can listen for in the future
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as any;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return new Response("Error occurred", { status: 400 });
    }
// Check if the event type is "user.created"
    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;
        // Extract the first email address from the email_addresses array
      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();
        // Check if the user already exists in the database
        // If the user does not exist, create a new user
      try {
        await ctx.runMutation(api.users.createUser, {
          email,
          fullname: name,
          image: image_url,
          clerkId: id,
          username: email.split("@")[0],
        }); // Use email prefix as username
        console.log("User created successfully:", email);
      } catch (error) {
        console.log("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
      }
    }
    // If the event type is not "user.created", we can ignore it
    // Log the event for debugging purposes
    console.log("Received Clerk webhook event:", evt);
    return new Response("Webhook processed successfully", { status: 200 });
    // Return a 200 response to indicate that the webhook was processed successfully
  }),
});
// Export the http router to be used in the Convex server
export default http;