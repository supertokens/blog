import React, { useState } from "react"

const McpToolkitInterestForm = () => {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = async e => {
    e.preventDefault()

    if (!email || !email.includes("@")) {
      setStatus("error")
      setMessage("Please enter a valid email address")
      return
    }

    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbydhFTfQz_JNyPJxtWQaZ2oz7MQ3K_akf89rjEqqIZURaBkQ6XZQRWo5unjxzTW3zF8Ew/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: JSON.stringify({
            email: email,
            source: "blog",
          }),
        }
      )

      if (response.ok) {
        setStatus("success")
        setMessage(
          "Thank you! We'll notify you when this feature is available."
        )
        setEmail("")
      } else {
        throw new Error("Failed to submit")
      }
    } catch (error) {
      console.error("Error submitting email:", error)
      setStatus("error")
      setMessage("Something went wrong. Please try again.")
    }
  }

  const closeMessage = () => {
    setMessage("")
    setStatus("idle")
  }

  return (
    <div className="mcp-toolkit-interest-form">
      <div className="mcp-toolkit-interest-form-content">
        <form
          onSubmit={handleSubmit}
          className="mcp-toolkit-interest-form-element"
        >
          <div className="mcp-toolkit-interest-form-input-container">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="mcp-toolkit-interest-form-input"
              disabled={status === "loading"}
              required
            />
            <button
              type="submit"
              className={`mcp-toolkit-interest-form-submit-button ${
                status === "loading" ? "loading" : ""
              }`}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Submitting..." : "Notify Me"}
            </button>
          </div>

          {message && (
            <div className={`mcp-toolkit-interest-form-message ${status}`}>
              <span className="mcp-toolkit-interest-form-message-text">
                {message}
              </span>
              <button
                type="button"
                className="mcp-toolkit-interest-form-message-close"
                onClick={closeMessage}
                aria-label="Close message"
              >
                ×
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default McpToolkitInterestForm
