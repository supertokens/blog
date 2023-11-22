import React from "react";

import STBannerBackdrop from "../images/supertokens-logo-backdrop.png";
import STBannerTop from "../images/bottom-banner-top-icon.png";
import AuthorCardFooter from "./AuthorCardFooter";

const BlogPostFooter = ({ idSlug , author}) => {

  return (
    <footer id={`last_section_${idSlug}`}>
      <b>Written by the Folks at <a href="https://supertokens.com">SuperTokens</a> — hope you enjoyed!</b>
      <AuthorCardFooter author={author}/>
      <div className="sign-up-banner-content-border">
        <div className="blog-post-sign-up-banner">
          <img
            src={STBannerBackdrop}
            alt="Blog post sign up banner backdrop"
            className="sign-up-banner-backdrop"
          />
          <div className="sign-up-banner-content">
            <div className="sign-up-banner-top-icon-container">
              <img 
                src={STBannerTop}
                alt="Banner top icon"
                className="sign-up-banner-top-icon"
                />
            </div>
            <p className="sign-up-banner-content-title">Try SuperTokens in under <span className="sign-up-banner-content-title-highlight">5 minutes</span></p>
            <p className="sign-up-banner-content-paragraph">SuperTokens provides open source user authentication that is quick to implement and easy to customize.</p>
            <div className="sign-up-banner-buttons-container">
              <div className="sign-up-banner-button-outer-container">
                <a
                  href="https://supertokens.com"
                  target={"_blank"}
                  className="sign-up-banner-content-cta"
                  id={`sign_up_${idSlug}`}
                >Learn More</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
};

export default BlogPostFooter;
