import * as React from "react"

const Layout = ({ children }) => {
  return (
    <div className="global-wrapper">
      <main>{children}</main>
    </div>
  )
}

export default Layout
