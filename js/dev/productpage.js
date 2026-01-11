const templates = document.querySelectorAll(".color-detail-product__template");
templates.forEach((template) => {
  template.addEventListener("click", () => {
    templates.forEach((t) => t.classList.remove("--active"));
    template.classList.add("--active");
  });
});
