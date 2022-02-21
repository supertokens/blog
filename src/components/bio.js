import * as React from "react"
import { StaticImage } from "gatsby-plugin-image"

const Bio = () => {
  return (
    <>
      <div className="bio">
        <StaticImage
          className="bio-avatar"
          layout="fixed"
          formats={["auto", "webp", "avif"]}
          src="https://avatars.githubusercontent.com/u/50478857?s=200&v=4"
          width={50}
          height={50}
          quality={95}
          alt="Profile picture"
        />

        <p>
          Written by the Folks at SuperTokens — hope you enjoyed! We are always available on our Discord server. Join us if you have any questions or need any help.
        </p>
      </div>
      <a href="/discord">
        <img
          src="/discord.png"
          formats={["auto", "webp", "avif"]}
          alt="SuperTokens Logo"
          style={{
            width: "200px",
            height: "60px",
            margin: "0 auto",
            display: "block"
          }}
        />
      </a>
    </>
  )
}

export default Bio
