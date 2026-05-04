document.addEventListener("DOMContentLoaded", () => {
    const modules = document.querySelectorAll(".module");

    modules.forEach(module => {
        const title = module.querySelector(".module-title");
        const info = module.querySelector(".module-info");

        // Ensure closed by default
        info.classList.remove("open");

        title.addEventListener("click", () => {
            const isOpen = info.classList.contains("open");

            info.classList.toggle("open", !isOpen);
            title.classList.toggle("open", !isOpen);
        });
    });
});
