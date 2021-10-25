let menuBarCurrentState;

document.addEventListener("DOMContentLoaded", () => {
  const virtualWindow = document.getElementById("window");
  const menuBar = document.getElementById("menu-bar");

  let innerYDelta, innerXDelta;

  function setVirtualWindowPosition(mousePageX, mousePageY) {
    virtualWindow.style.top = `${mousePageY - innerYDelta}px`;
    virtualWindow.style.left = `${mousePageX - innerXDelta}px`;
  }

  menuBarCurrentState = "not-selected";
  const menuBarStateMachine = {
    "not-selected": {
      "select-menu-bar": (e) => {
        // Only allow the menu bar to be selected if it is in the 'normal' state.
        if (windowCurrentState !== "normal") return;

        const menuBarBB = menuBar.getBoundingClientRect();
        innerYDelta = e.clientY - menuBarBB.top;
        innerXDelta = e.clientX - menuBarBB.left;

        menuBarCurrentState = "selected";
      },
    },
    selected: {
      move: (e) => {
        setVirtualWindowPosition(e.pageX, e.pageY);
      },
      release: (e) => {
        menuBarCurrentState = "not-selected";
      },
    },
  };

  function performAction(eventName, event) {
    const actionFound =
      menuBarStateMachine &&
      menuBarStateMachine[menuBarCurrentState] &&
      menuBarStateMachine[menuBarCurrentState][eventName];
    if (actionFound) menuBarStateMachine[menuBarCurrentState][eventName](event);
  }

  menuBar.addEventListener("mousedown", (e) => {
    const eventName = "select-menu-bar";
    performAction(eventName, e);
  });

  menuBar.addEventListener("mouseup", (e) => {
    const eventName = "release";
    performAction(eventName, e);
  });

  document.addEventListener("mousemove", (e) => {
    const eventName = "move";
    performAction(eventName, e);
  });
});
