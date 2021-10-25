let windowCurrentState;

document.addEventListener("DOMContentLoaded", () => {
  const virtualWindow = document.getElementById("window");
  const minimizeButton = document.getElementById("minimize-window");
  const maximizeButton = document.getElementById("maximize-window");

  // Without position values (e.g. for top and left), the growing and shrinking (e.g. by
  // changing width and height) of an element that is a centered flex item (e.g. the
  // virtualWindow) will happen from the center of the element, rather than from the top
  // left corner of the element.
  const virtualWindowInitialPos = virtualWindow.getBoundingClientRect();
  virtualWindow.style.top = `${virtualWindowInitialPos.top}px`;
  virtualWindow.style.left = `${virtualWindowInitialPos.left}px`;

  windowCurrentState = "normal";
  const windowStateMachine = {
    normal: {
      "click-minimize-button": (e) => {
        e.stopPropagation();

        const { left: startTopLeftX, top: startTopLeftY } =
          virtualWindow.getBoundingClientRect();

        const viewportCenterX = document.documentElement.clientWidth / 2;
        const targetTopLeftX = viewportCenterX - 56; // 56 is half the width of the minified window
        const targetTopLeftY = document.documentElement.clientHeight - 122; // 122 is the height of the minified window + 10 for distance from bottom of viewport

        virtualWindow.style.transform = `translate(${
          targetTopLeftX - startTopLeftX
        }px, ${targetTopLeftY - startTopLeftY}px)`;

        virtualWindow.classList.add("minimized");

        windowCurrentState = "minimized";
      },
      "click-maximize-button": (e) => {
        e.stopPropagation();

        // Move virtual window's top left corner to the top left corner of the viewport, so that
        // when the virtual window is maximized (too fullscreen), the virtual window will take
        // up the whole viewport. However, we only do this if the virtual window element has had
        // its top or left properties set. This is because flexbox is used to center the virtual
        // window, which means its top and left values are initially zero; however the left and top
        // values returned from 'getBoundingClientRect' are accurate to where the virtual window is
        // visually positioned and so are non-zero. Without this check, the virtual window would be
        // translated out of the viewport in this initial case.
        if (virtualWindow.style.top && virtualWindow.style.left) {
          const { left, top } = virtualWindow.getBoundingClientRect();
          virtualWindow.style.transform = `translate(${-left}px, ${-top}px)`;
        }

        virtualWindow.classList.add("maximized");

        windowCurrentState = "maximized";
      },
    },
    maximized: {
      "click-minimize-button": (e) => {
        e.stopPropagation();

        const [[translateXStr], [translateYStr]] = Array.from(
          virtualWindow.style.transform.matchAll(/-?\d+/g)
        );

        let { left: startTopLeftX, top: startTopLeftY } =
          virtualWindow.getBoundingClientRect();

        if (translateXStr)
          startTopLeftX = startTopLeftX - Number.parseFloat(translateXStr);
        if (translateXStr)
          startTopLeftY = startTopLeftY - Number.parseFloat(translateYStr);

        const viewportCenterX = document.documentElement.clientWidth / 2;
        const targetTopLeftX = viewportCenterX - 56; // 56 is half the width of the minified window
        const targetTopLeftY = document.documentElement.clientHeight - 122; // 122 is the height of the minified window + 10 for distance from bottom of viewport

        virtualWindow.style.transform = `translate(${
          targetTopLeftX - startTopLeftX
        }px, ${targetTopLeftY - startTopLeftY}px)`;

        virtualWindow.classList.remove("maximized");
        virtualWindow.classList.add("minimized");

        windowCurrentState = "minimized";
      },
      "click-maximize-button": (e) => {
        e.stopPropagation();

        virtualWindow.style.transform = "";
        virtualWindow.classList.remove("maximized");

        windowCurrentState = "normal";
      },
    },
    minimized: {
      "click-window": (e) => {
        virtualWindow.style.transform = "";
        virtualWindow.classList.remove("minimized");

        windowCurrentState = "normal";
      },
    },
  };

  function performAction(eventName, event) {
    const actionFound =
      windowStateMachine &&
      windowStateMachine[windowCurrentState] &&
      windowStateMachine[windowCurrentState][eventName];
    if (actionFound) windowStateMachine[windowCurrentState][eventName](event);
  }

  virtualWindow.addEventListener("click", (e) => {
    const eventName = "click-window";
    performAction(eventName, e);
  });

  minimizeButton.addEventListener("click", (e) => {
    const eventName = "click-minimize-button";
    performAction(eventName, e);
  });

  maximizeButton.addEventListener("click", (e) => {
    const eventName = "click-maximize-button";
    performAction(eventName, e);
  });
});
