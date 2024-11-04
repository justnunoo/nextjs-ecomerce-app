"use client"

import { useEffect } from "react"

export default function BootstrapClient () {
    useEffect(() => {
        // Bootstrap any necessary client-side resources here
        // For example, you can fetch data from an API
        // or perform any other client-side setup tasks
        require(`bootstrap/dist/js/bootstrap.bundle.min.js`)
    }, [])
}