// One-off admin utility to reset the single admin account.
// Deletes the old user, creates a new one with a generated password,
// sends an invitation email, and assigns the admin role.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OLD_EMAIL = "faridlannulhakim1@gmail.com";
const NEW_EMAIL = "faridlannulhakim@gmail.com";

function generatePassword(length = 16): string {
  const charset = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const b of bytes) out += charset[b % charset.length];
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    );

    // 1. Find & delete old user
    const { data: list, error: listErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (listErr) throw listErr;

    const oldUser = list.users.find((u) => u.email?.toLowerCase() === OLD_EMAIL);
    if (oldUser) {
      await admin.from("user_roles").delete().eq("user_id", oldUser.id);
      const { error: delErr } = await admin.auth.admin.deleteUser(oldUser.id);
      if (delErr) throw delErr;
    }

    // 2. Remove existing new email if it already exists (idempotent)
    const existingNew = list.users.find((u) => u.email?.toLowerCase() === NEW_EMAIL);
    if (existingNew) {
      await admin.from("user_roles").delete().eq("user_id", existingNew.id);
      await admin.auth.admin.deleteUser(existingNew.id);
    }

    // 3. Create new user with generated password (auto-confirmed so they can sign in immediately)
    const password = generatePassword(16);
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: NEW_EMAIL,
      password,
      email_confirm: true,
    });
    if (createErr) throw createErr;
    const newUser = created.user!;

    // 4. Grant admin role
    const { error: roleErr } = await admin.from("user_roles").insert({
      user_id: newUser.id,
      role: "admin",
    });
    if (roleErr) throw roleErr;

    // 5. Send invitation email (so user gets a notification)
    const { error: inviteErr } = await admin.auth.admin.inviteUserByEmail(NEW_EMAIL);
    // Note: invite may fail because user already exists; that's OK — we still return password.
    const inviteSent = !inviteErr;

    return new Response(
      JSON.stringify({
        success: true,
        email: NEW_EMAIL,
        password,
        user_id: newUser.id,
        invite_sent: inviteSent,
        invite_error: inviteErr?.message ?? null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
