import React from "react";

import STBannerBackdrop from "../images/supertokens-logo-backdrop.png";

const BlogPostFooter = ({ idSlug }) => {

  return (
    <footer id={`last_section_${idSlug}`}>
      <b>Written by the Folks at <a href="https://supertokens.com">SuperTokens</a> — hope you enjoyed! We are always available on our Discord server. Join us if you have any questions or need any help.</b>
      <div className="blog-post-sign-up-banner">
        <img
          src={STBannerBackdrop}
          alt="Blog post sign up banner backdrop"
          className="sign-up-banner-backdrop"
        />

        <div className="sign-up-banner-content">
          <p className="sign-up-banner-content-title">Get started for free</p>
          <p className="sign-up-banner-content-paragraph">SuperTokens' free plan lets you go live and start signing up users (no credit card required)</p>
          <div className="sign-up-banner-buttons-container">
            <a
              href="https://supertokens.com/auth"
              className="sign-up-banner-content-cta"
              id={`sign_up_${idSlug}`}
            >Sign up</a>
            <a
              href="https://supertokens.com/discord"
              className="sign-up-banner-content-discord-button"
              id={`discord_${idSlug}`}
            >
              <img
                src="/blog-footer-discord-logo.png"
                alt="Join SuperTokens Discord channel"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
};

export default BlogPostFooter;
