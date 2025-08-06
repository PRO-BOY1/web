import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAction, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export function CustomSignInForm() {
  const { signIn } = useAuthActions();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const validateUser = useAction(api.customAuth.signInWithUsername);
  const syncUser = useMutation(api.users.syncUserFromMongoDB);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // First validate the username/password against MongoDB
      console.log("Validating user:", username);
      const userData = await validateUser({ username, password });
      console.log("MongoDB validation result:", !!userData);
      
      if (!userData) {
        throw new Error("Invalid username or password");
      }

      // Sync the user data to Convex database
      console.log("Syncing user data to Convex...");
      await syncUser({ userData });
      console.log("User data synced successfully");
      
      // If validation passes, sign in with email format for Convex Auth
      const fakeEmail = `${username}@lawtown.local`;
      // Use a secure token instead of the actual MongoDB password
      const securePassword = `lawtown_${username}_secure_token_2024`;
      
      // Try to sign in first
      try {
        await signIn("password", { 
          email: fakeEmail, 
          password: securePassword,
          flow: "signIn" 
        });
      } catch (signInError) {
        console.log("Sign in failed, trying sign up...", signInError);
        // If sign in fails, try to create the account
        try {
          await signIn("password", { 
            email: fakeEmail, 
            password: securePassword,
            flow: "signUp" 
          });
        } catch (signUpError) {
          console.log("Sign up also failed:", signUpError);
          throw new Error(`Authentication failed: ${signUpError instanceof Error ? signUpError.message : 'Unknown error'}`);
        }
      }
      
      toast.success("Successfully signed in!");
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Invalid username or password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <input
          className="auth-input-field"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
      </div>
      <div>
        <input
          className="auth-input-field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
      </div>
      <button 
        className="auth-button" 
        type="submit" 
        disabled={submitting || !username || !password}
      >
        {submitting ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}
