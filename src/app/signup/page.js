"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import "./signup.css";
import Link from "next/link";

export default function SignupPage() {
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        // API call to signup the user
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, username, password }), // Use 'username' here
            });

            if (res.ok) {
                setSuccess("User registered successfully.");
                setTimeout(() => router.push("/login"), 2000); // Redirect to login after 2 seconds
                setLoading(false);
            } else {
                const data = await res.json();
                setError(data.message);
                setLoading(false);
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="signup-container" style={{ marginTop: "30px" }}>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" onChange={(e) => setUserName(e.target.value)} required />
                </div>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} required />
                </div>

                {error && <p className="error-message">{error}</p>}
                {success && <div className="success">{success}</div>}

                <button type="submit" disabled={loading}>
                    {loading ? "Signing up..." : "Sign Up"}
                </button>
            </form>

            <p className="mt-3">
                Already have an account?
                <Link href={"/login"} className="mx-2">
                    Login
                </Link>
            </p>
        </div>
    );
}
