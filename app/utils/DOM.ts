export const isClient = typeof window !== "undefined";

export function getAppScrollContainer() {
  return isClient ? window : null;
}

export function scrollHeight(y: number) {
  isClient &&
    getAppScrollContainer()?.scrollTo({
      top: y,
      left: 0,
      behavior: "smooth",
    });
}

export function scrollBy(y: number) {
  isClient &&
    getAppScrollContainer()?.scrollBy({
      top: y,
      behavior: "smooth",
    });
}

export function getViewport(): VisualViewport | null {
  return isClient ? window.visualViewport : null;
}

export function setBodyScroll(enable: boolean) {
  if (!isClient) {
    return;
  }

  const scrollContainer = document.body;
  if (enable) {
    scrollContainer.classList.remove("no-scroll");
  } else {
    scrollContainer.classList.add("no-scroll");
  }
}

export function scrollToSection(
  selector: string,
  top: boolean = true,
  offset: number = 0
) {
  const GotoDiv = document.querySelector(selector);
  if (!GotoDiv) {
    console.warn("{scrollToSection} el not found, selector: ", selector);
    return;
  }
  // console.log('{scrollToSection} GotoDiv : ', GotoDiv);
  // GotoDiv?.scrollIntoView({ behavior: "smooth", block: "start" }); // Not stable in target scrolling position
  const rect = GotoDiv.getBoundingClientRect();
  if (top) {
    // @ts-ignore
    scrollHeight(offset + window.scrollY + rect.top); // NOTE: offsetTop is the number of pixels from the top of the closest relatively positioned parent element.
  } else {
    // @ts-ignore
    scrollHeight(
      offset +
        window.scrollY +
        rect.top +
        rect.height -
        // @ts-ignore
        window.visualViewport.height
    ); // NOTE: offsetTop is the number of pixels from the top of the closest relatively positioned parent element.
  }
}

// scrollEventThrottle
export function useScroll(
  onScroll: (scrollTop: number, prev_offset: number) => void
) {
  if (!isClient) {
    return;
  }

  let last_offset = 0;
  let ticking = false;

  const listener = function () {
    let prev_offset = last_offset;
    last_offset = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(function () {
        onScroll(last_offset, prev_offset);
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener("scroll", listener);

  return () => {
    window.removeEventListener("scroll", listener);
  };
}


export function getBottomDistanceFromElToViewport(el: Element): number {
  // @ts-ignore
  return window.visualViewport.height - el.getBoundingClientRect().bottom;
}

export function getTopDistanceFromElToViewport(el: Element): number {
  return el.getBoundingClientRect().top;
}

export function getElPosRelativeToViewPort(el: Element | unknown): { top: number; left: number } {
  // @ts-ignore
  return el.getBoundingClientRect();
}

export function getElPosRelativeToBody(el: Element) {
  const rect = el.getBoundingClientRect();

  // Get the position relative to the <body> element
  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
  }
}

export const fetchJsFromCDN = (src: string, externals: any[] = []) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.setAttribute("src", src);
    script.addEventListener("load", () => {
      resolve(
        externals.map((key) => {
          const ext = window[key];
          typeof ext === "undefined" &&
            console.warn(`No external named '${key}' in window`);
          return ext;
        })
      );
    });
    script.addEventListener("error", reject);
    document.body.appendChild(script);
  });
};
