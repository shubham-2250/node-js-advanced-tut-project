exports.getPageNotFoundPage = (req, res, next) => {
  res.render("404", { pageTitle: "Page Not Found" });
  //   res.status(404).sendFile(path.join(rootDir, "views", "404.html"));
};
