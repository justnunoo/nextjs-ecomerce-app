"use client"


import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import "./login.css"

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)

        const formData = new FormData(event.target)
        const email = formData.get("email")
        const password = formData.get("password")

        console.log(email)

        const res = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email,
                password
            }
            )
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await res.json()

        setLoading(false)

        if (res.ok) {
            localStorage.setItem("token", data.token);
            console.log("logged in succesfully")
            router.push("/")
        }
        else {
            setError(data.error || "Something went wrong")
        }
    };

    return (
        <div className="signup-container" style={{ marginTop: "30px" }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" required />
                </div>

                {error && <p className="error-message">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in ..." : "Login"}
                </button>
            </form>

            <p className="mt-3">Already have an account?
                <Link href={"/signup"} className="mx-2">
                    Sign up
                </Link>
            </p>
        </div>
    );
}