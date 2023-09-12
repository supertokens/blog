const webflowPosts = require("./src/blog-details")

const ignorePaths = ['/','/404']


module.exports = {
  siteMetadata: {
    title: `SuperTokens Blog`,
    author: {
      name: `SuperTokens`,
      summary: `Building open source auth.`,
    },
    description: `A starter blog demonstrating what Gatsby can do.`,
    siteUrl: `https://supertokens.com`,
    social: {
      twitter: `supertokensio`,
    },
  },
  trailingSlash: 'never',
  plugins: [
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              destinationDir: `static/blog`
            }
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          {
            resolve: `gatsby-remark-code-buttons`,
            options: {
              toasterText: "Copied!"
            }
          },
          {
            resolve: "gatsby-remark-external-links",
            options: {
              rel: "nofollow"
            }
          },
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-code-titles`,
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
      query:`
        {
          allSitePage {
            nodes {
              path
            }
          }
        }
      `,
        resolveSiteUrl: () => 'https://supertokens.com/',
        resolvePages: ({
          allSitePage: { nodes:allPages }
        }) => {
          const webflowBlogsWithTrailingSlashes = webflowPosts.reduce((acc,currentPage)=>{

            if(currentPage.fields.slug === undefined){
              return acc
            }

            return [...acc , {path: `blog${currentPage.fields.slug}`}, {path:`blog${currentPage.fields.slug}/`}];
          },[])

          const allPagesWithTralingSlashes = allPages.reduce((acc,currentPage)=>{

            if(ignorePaths.includes(currentPage.path)){
              return acc;
            }

            const pathWithTrailingSlash = { path: currentPage.path + '/' }
            return [...acc, currentPage, pathWithTrailingSlash]
          },[])
          
          return [...allPagesWithTralingSlashes, ...webflowBlogsWithTrailingSlashes];
        },
        serialize: ({ path }) => {
          return {
            url: path,
          }
        },
      },
    },
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     trackingId: `ADD YOUR TRACKING ID HERE`,
    //   },
    // },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
