document.getElementById("year").textContent = new Date().getFullYear();

const slider = document.querySelector("[data-slider]");

if (slider) {
    const track = slider.querySelector(".slider__track");
    const slides = Array.from(track.children);
    const dotsWrap = slider.querySelector(".slider__dots");
    let index = 0;

    const dots = slides.map((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "slider__dot";
        dot.setAttribute("aria-label", `Слайд ${i + 1}`);
        dot.addEventListener("click", () => go(i));
        dotsWrap.append(dot);
        return dot;
    });

    function go(i) {
        index = (i + slides.length) % slides.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, n) => dot.classList.toggle("is-active", n === index));
    }

    slider.querySelector(".slider__btn--prev").addEventListener("click", () => go(index - 1));
    slider.querySelector(".slider__btn--next").addEventListener("click", () => go(index + 1));

    go(0);
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion && "IntersectionObserver" in window) {
    const targets = document.querySelectorAll(".section__title, .section__text, .card, .slider");

    targets.forEach((el) => {
        if (el.classList.contains("card")) {
            const index = Array.from(el.parentElement.children).indexOf(el);
            el.style.setProperty("--reveal-delay", `${index * 0.12}s`);
        }
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                const el = entry.target;
                el.classList.add("reveal", "is-visible");
                observer.unobserve(el);

                el.addEventListener(
                    "animationend",
                    () => {
                        el.classList.remove("reveal", "is-visible");
                        el.style.removeProperty("--reveal-delay");
                    },
                    { once: true }
                );
            });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((el) => observer.observe(el));
}
