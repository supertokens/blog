import * as React from "react"

const Bio = ({ discordButtonId }) => {

  return (
    <>
      <b>In case you have any questions please join our discord server by clicking the button below</b>
      <a id={discordButtonId} href="/discord">
        <img
          src="/discord.png"
          formats={["auto", "webp", "avif"]}
          alt="SuperTokens Logo"
          style={{
            width: "200px",
            height: "60px",
            margin: "32px auto",
            display: "block"
          }}
        />
      </a>
    </>
  )
}

export default Bio
