import * as React from "react"

const Bio = ({ discordButtonId }) => {

  return (
    <>
      <b>Written by the Folks at <a href="https://supertokens.com">SuperTokens</a> — hope you enjoyed! We are always available on our Discord server. Join us if you have any questions or need any help.</b>
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
