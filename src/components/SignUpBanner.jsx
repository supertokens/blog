import React from "react";

import STBannerBackdrop from "../images/supertokens-logo-backdrop.png";

const SignUpBanner = () => {

  return (
    <div className="blog-post-sign-up-banner">
      <img
        src={STBannerBackdrop}
        alt="Blog post sign up banner backdrop"
        className="sign-up-banner-backdrop"
      />

      <div className="sign-up-banner-content">
        <h2 className="sign-up-banner-content-title">Get started for free</h2>
        <p className="sign-up-banner-content-paragraph">SuperTokens' free plan lets you go live and start signing up users (no credit card required)</p>
        <a href="/auth" className="sign-up-banner-content-cta">Sign up</a>
      </div>
    </div>
  )
};

export default SignUpBanner;
