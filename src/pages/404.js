import * as React from "react"
import { Link } from "gatsby"

const NotFoundPage = () => {
  return (
    <div
      style={{
        marginTop: "64px",
        textAlign: "center"
      }}
    >
      <h2>404: Not Found</h2>
      <Link to="/">Return to blog page</Link>
    </div>
  )
}

export default NotFoundPage
