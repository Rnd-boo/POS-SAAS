"use server";
import { INITIAL_STATE_LOGIN_FORM } from "@/constants/auth.constant";
import { createClient } from "@/lib/supabase/server";
import { ClientProfilesFormState } from "@/types/profiles";
import { loginSchemaForm } from "@/validations/auth-validation";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Helper function to create JWT secret key
const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
};

export async function login(
  prevState: ClientProfilesFormState,
  formData: FormData | null
): Promise<ClientProfilesFormState> {
  if (!formData) {
    return INITIAL_STATE_LOGIN_FORM;
  }

  const validatedFields = loginSchemaForm.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      status: "error",
      errors: {
        ...validatedFields.error.flatten().fieldErrors,
        _form: [],
      },
    };
  }

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("client_profiles")
    .select("*")
    .eq("username", validatedFields.data.username)
    .single();

  if (error || !profile) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Username not found"],
      },
    };
  }

  const isValidPassword = await bcrypt.compare(
    validatedFields.data.password,
    profile.password_hash
  );

  if (!isValidPassword) {
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Invalid password"],
      },
    };
  }

  try {
    // Create JWT using jose (Edge Runtime compatible)
    const token = await new SignJWT({
      id: profile.id,
      client: profile.client_id,
      name: profile.name,
      branch: profile.branch,
      role: profile.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(getJwtSecretKey());

    const cookiesStore = await cookies();
    cookiesStore.set("client_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    revalidatePath("/", "layout");
  } catch (error) {
    console.error("JWT creation error:", error);
    return {
      status: "error",
      errors: {
        ...prevState.errors,
        _form: ["Authentication failed. Please try again."],
      },
    };
  }

  redirect("/");
}
