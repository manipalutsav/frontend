exports.onCreatePage = async ({ page, actions }) => {
  if (page.path === "/") {
    page.matchPath = "/*";

    actions.createPage(page);
  }
};
// // For removing build error with html2pdf.js (refer: https://www.gatsbyjs.com/docs/debugging-html-builds/#how-to-check-if-code-classlanguage-textwindowcode-is-defined)
// exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
//   if (stage === "build-html" || stage === "develop-html") {
//     actions.setWebpackConfig({
//       module: {
//         rules: [
//           {
//             test: /html2pdf.js/,
//             use: loaders.null(),
//           },
//         ],
//       },
//     })
//   }
// }