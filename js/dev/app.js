(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const isMobile = { Android: function() {
  return navigator.userAgent.match(/Android/i);
}, BlackBerry: function() {
  return navigator.userAgent.match(/BlackBerry/i);
}, iOS: function() {
  return navigator.userAgent.match(/iPhone|iPad|iPod/i);
}, Opera: function() {
  return navigator.userAgent.match(/Opera Mini/i);
}, Windows: function() {
  return navigator.userAgent.match(/IEMobile/i);
}, any: function() {
  return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
} };
function addTouchAttr() {
  if (isMobile.any()) document.documentElement.setAttribute("data-fls-touch", "");
}
addTouchAttr();
function getHash() {
  if (location.hash) {
    return location.hash.replace("#", "");
  }
}
function setHash(hash) {
  hash = hash ? `#${hash}` : window.location.href.split("#")[0];
  history.pushState("", "", hash);
}
let slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("--slide")) {
    target.classList.add("--slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("--slide");
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target
        }
      }));
    }, duration);
  }
};
let slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("--slide")) {
    target.classList.add("--slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("--slide");
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target
        }
      }));
    }, duration);
  }
};
let slideToggle = (target, duration = 500) => {
  if (target.hidden) {
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
};
let slideUpForce = (target, duration = 500, showmore = 0, options = {}) => {
  const { force = false } = options;
  if (target.slideTimer) {
    clearTimeout(target.slideTimer);
    delete target.slideTimer;
  }
  if (force && target.classList.contains("--slide")) {
    target.style.transition = "none";
    target.style.height = target.offsetHeight + "px";
    target.offsetHeight;
    target.style.removeProperty("transition");
    target.classList.remove("--slide");
  }
  if (!target.classList.contains("--slide")) {
    target.classList.add("--slide");
    target.style.height = `${target.offsetHeight}px`;
    target.style.overflow = "hidden";
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.slideTimer = setTimeout(() => {
      if (!showmore) target.hidden = true;
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      target.classList.remove("--slide");
      delete target.slideTimer;
      document.dispatchEvent(new CustomEvent("slideUpDoneForce", { detail: { target } }));
    }, duration);
  }
};
let slideDownForce = (target, duration = 500, showmore = 0, options = {}) => {
  const { force = false } = options;
  if (target.slideTimer) {
    clearTimeout(target.slideTimer);
    delete target.slideTimer;
  }
  let startFromZero = false;
  if (force && target.classList.contains("--slide")) {
    target.style.transition = "none";
    target.style.height = target.offsetHeight + "px";
    target.offsetHeight;
    target.style.removeProperty("transition");
    target.classList.remove("--slide");
    startFromZero = true;
  }
  if (!target.classList.contains("--slide")) {
    if (target.hidden) target.hidden = false;
    target.classList.add("--slide");
    target.style.removeProperty("height");
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = startFromZero ? `${showmore || 0}px` : `${showmore || 0}px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    target.slideTimer = setTimeout(() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("--slide");
      delete target.slideTimer;
      document.dispatchEvent(new CustomEvent("slideDownDoneForce", { detail: { target } }));
    }, duration);
  }
};
let bodyLockStatus = true;
let bodyLockToggle = (delay = 500) => {
  if (document.documentElement.hasAttribute("data-fls-scrolllock")) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
};
let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
    setTimeout(() => {
      lockPaddingElements.forEach((lockPaddingElement) => {
        lockPaddingElement.style.paddingRight = "";
      });
      document.body.style.paddingRight = "";
      document.documentElement.removeAttribute("data-fls-scrolllock");
    }, delay);
    bodyLockStatus = false;
    setTimeout(function() {
      bodyLockStatus = true;
    }, delay);
  }
};
let bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
    lockPaddingElements.forEach((lockPaddingElement) => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    });
    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.setAttribute("data-fls-scrolllock", "");
    bodyLockStatus = false;
    setTimeout(function() {
      bodyLockStatus = true;
    }, delay);
  }
};
function getDigFormat(item, sepp = " ") {
  return item.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, `$1${sepp}`);
}
function uniqArray(array) {
  return array.filter((item, index, self) => self.indexOf(item) === index);
}
function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array).filter((item) => item.dataset[dataSetValue]).map((item) => {
    const [value, type = "max"] = item.dataset[dataSetValue].split(",");
    return { value, type, item };
  });
  if (media.length === 0) return [];
  const breakpointsArray = media.map(({ value, type }) => `(${type}-width: ${value}px),${value},${type}`);
  const uniqueQueries = [...new Set(breakpointsArray)];
  return uniqueQueries.map((query) => {
    const [mediaQuery, mediaBreakpoint, mediaType] = query.split(",");
    const matchMedia = window.matchMedia(mediaQuery);
    const itemsArray = media.filter((item) => item.value === mediaBreakpoint && item.type === mediaType);
    return { itemsArray, matchMedia };
  });
}
const gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
  const targetBlockElement = document.querySelector(targetBlock);
  if (!targetBlockElement) {
    return;
  }
  let headerItemHeight = 0;
  if (noHeader) {
    const headerElement = document.querySelector("header.header");
    if (headerElement) {
      if (!headerElement.classList.contains("--header-scroll")) {
        headerElement.style.cssText = `transition-duration: 0s;`;
        headerElement.classList.add("--header-scroll");
        headerItemHeight = headerElement.offsetHeight;
        headerElement.classList.remove("--header-scroll");
        setTimeout(() => {
          headerElement.style.cssText = ``;
        }, 0);
      } else {
        headerItemHeight = headerElement.offsetHeight;
      }
    }
  }
  if (document.documentElement.hasAttribute("data-fls-menu-open")) {
    bodyUnlock();
    document.documentElement.removeAttribute("data-fls-menu-open");
  }
  let targetPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
  if (headerItemHeight) targetPosition -= headerItemHeight;
  if (offsetTop) targetPosition -= offsetTop;
  const startY = window.scrollY;
  const distance = targetPosition - startY;
  const startTime = performance.now();
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
  function animateScroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / speed, 1);
    const eased = easeInOutQuad(progress);
    window.scrollTo(0, startY + distance * eased);
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }
  requestAnimationFrame(animateScroll);
};
function spollers() {
  const spollersArray = document.querySelectorAll("[data-fls-spollers]");
  if (spollersArray.length > 0) {
    let initSpollers = function(spollersArray2, matchMedia = false) {
      spollersArray2.forEach((spollersBlock) => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add("--spoller-init");
          initSpollerBody(spollersBlock);
        } else {
          spollersBlock.classList.remove("--spoller-init");
          initSpollerBody(spollersBlock, false);
        }
      });
    }, initSpollerBody = function(spollersBlock, hideSpollerBody = true) {
      let spollerItems = spollersBlock.querySelectorAll("details");
      if (spollerItems.length) {
        spollerItems.forEach((spollerItem) => {
          let spollerTitle = spollerItem.querySelector("summary");
          if (hideSpollerBody) {
            spollerTitle.removeAttribute("tabindex");
            if (!spollerItem.hasAttribute("data-fls-spollers-open")) {
              spollerItem.open = false;
              spollerTitle.nextElementSibling.hidden = true;
            } else {
              spollerTitle.classList.add("--spoller-active");
              spollerItem.open = true;
            }
          } else {
            spollerTitle.classList.remove("--spoller-active");
            spollerItem.open = true;
            spollerTitle.nextElementSibling.hidden = false;
          }
        });
      }
    }, setSpollerAction = function(e) {
      const el = e.target;
      if (el.closest("summary") && el.closest("[data-fls-spollers]")) {
        e.preventDefault();
        if (el.closest("[data-fls-spollers]").classList.contains("--spoller-init")) {
          const spollerTitle = el.closest("summary");
          const spollerBlock = spollerTitle.closest("details");
          const spollersBlock = spollerTitle.closest("[data-fls-spollers]");
          const oneSpoller = spollersBlock.hasAttribute("data-fls-spollers-one");
          const scrollSpoller = spollerBlock.hasAttribute("data-fls-spollers-scroll");
          const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
          if (!spollersBlock.querySelectorAll(".--slide").length) {
            if (oneSpoller && !spollerBlock.open) {
              hideSpollersBody(spollersBlock);
            }
            !spollerBlock.open ? spollerBlock.open = true : setTimeout(() => {
              spollerBlock.open = false;
            }, spollerSpeed);
            spollerTitle.classList.toggle("--spoller-active");
            slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
            if (scrollSpoller && spollerTitle.classList.contains("--spoller-active")) {
              const scrollSpollerValue = spollerBlock.dataset.flsSpollersScroll;
              const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
              const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-fls-spollers-scroll-noheader") ? document.querySelector(".header").offsetHeight : 0;
              window.scrollTo(
                {
                  top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
                  behavior: "smooth"
                }
              );
            }
          }
        }
      }
      if (!el.closest("[data-fls-spollers]")) {
        const spollersClose = document.querySelectorAll("[data-fls-spollers-close]");
        if (spollersClose.length) {
          spollersClose.forEach((spollerClose) => {
            const spollersBlock = spollerClose.closest("[data-fls-spollers]");
            const spollerCloseBlock = spollerClose.parentNode;
            if (spollersBlock.classList.contains("--spoller-init")) {
              const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
              spollerClose.classList.remove("--spoller-active");
              slideUp(spollerClose.nextElementSibling, spollerSpeed);
              setTimeout(() => {
                spollerCloseBlock.open = false;
              }, spollerSpeed);
            }
          });
        }
      }
    }, hideSpollersBody = function(spollersBlock) {
      const spollerActiveBlock = spollersBlock.querySelector("details[open]");
      if (spollerActiveBlock && !spollersBlock.querySelectorAll(".--slide").length) {
        const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
        const spollerSpeed = spollersBlock.dataset.flsSpollersSpeed ? parseInt(spollersBlock.dataset.flsSpollersSpeed) : 500;
        spollerActiveTitle.classList.remove("--spoller-active");
        slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
        setTimeout(() => {
          spollerActiveBlock.open = false;
        }, spollerSpeed);
      }
    };
    document.addEventListener("click", setSpollerAction);
    const spollersRegular = Array.from(spollersArray).filter(function(item, index, self) {
      return !item.dataset.flsSpollers.split(",")[0];
    });
    if (spollersRegular.length) {
      initSpollers(spollersRegular);
    }
    let mdQueriesArray = dataMediaQueries(spollersArray, "flsSpollers");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach((mdQueriesItem) => {
        mdQueriesItem.matchMedia.addEventListener("change", function() {
          initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
  }
}
window.addEventListener("load", spollers);
const menuButton = document.querySelector("[data-fls-menu]");
const menu = document.querySelector(".menu");
function menuInit() {
  setSubmenuInitialState();
  document.addEventListener("click", function(e) {
    if (e.target.closest("[data-fls-menu]") && bodyLockStatus) {
      bodyLockToggle();
      document.documentElement.toggleAttribute("data-fls-menu-open");
      if (!document.documentElement.hasAttribute("data-fls-menu-open")) {
        closeAllSubmenus();
      } else {
        setSubmenuInitialState();
      }
      return;
    }
    if (menu && !menu.contains(e.target)) {
      closeAllSubmenus();
    }
  });
  updateMenuArrowHandlers();
  setupHoverSubmenus();
  window.addEventListener("resize", () => {
    closeAllSubmenus();
    setupHoverSubmenus();
    if (document.documentElement.hasAttribute("data-fls-menu-open")) {
      document.documentElement.removeAttribute("data-fls-menu-open");
      bodyUnlock();
    }
  });
}
function setSubmenuInitialState() {
  const isTouch = document.documentElement.hasAttribute("data-fls-touch");
  const isMobileW = window.innerWidth <= 768;
  document.querySelectorAll(".menu__sub-list").forEach((submenu) => {
    if (isMobileW || isTouch) {
      submenu.hidden = true;
    } else {
      submenu.hidden = false;
      submenu.removeAttribute("hidden");
    }
  });
}
function closeAllSubmenus() {
  const activeItems = document.querySelectorAll(".menu__item._active");
  activeItems.forEach((item) => {
    const submenu = item.querySelector(".menu__sub-list");
    if (!submenu || submenu.classList.contains("is-closing")) return;
    submenu.classList.add("is-closing");
    slideUpForce(submenu, 500, 0, { force: true });
    const onSlideUpDoneForce = (e) => {
      if (e.detail && e.detail.target === submenu) {
        item.classList.remove("_active");
        submenu.classList.remove("is-closing");
        document.removeEventListener("slideUpDoneForce", onSlideUpDoneForce);
      }
    };
    document.addEventListener("slideUpDoneForce", onSlideUpDoneForce);
  });
}
function handleMenuArrowsClick(e) {
  const arrow = e.target.closest(".menu__arrow-box");
  if (!arrow) return;
  e.stopPropagation();
  const clickedItem = arrow.closest(".menu__item");
  if (!clickedItem) return;
  const submenu = clickedItem.querySelector(".menu__sub-list");
  if (!submenu) return;
  if (submenu.classList.contains("is-closing")) return;
  const isActive = clickedItem.classList.contains("_active");
  const isTouch = document.documentElement.hasAttribute("data-fls-touch");
  const isMobileW = window.innerWidth <= 768;
  if (!(isMobileW || isTouch)) return;
  if (isActive) {
    submenu.classList.add("is-closing");
    clickedItem.classList.remove("_active");
    slideUpForce(submenu, 500, 0, { force: true });
    const onSlideUpDoneForce = (e2) => {
      if (e2.detail && e2.detail.target === submenu) {
        submenu.classList.remove("is-closing");
        document.removeEventListener("slideUpDoneForce", onSlideUpDoneForce);
      }
    };
    document.addEventListener("slideUpDoneForce", onSlideUpDoneForce);
  } else {
    if (isTouch && window.innerWidth > 768) {
      document.querySelectorAll(".menu__item._active").forEach((item) => {
        if (item !== clickedItem) {
          item.classList.remove("_active");
          const sub = item.querySelector(".menu__sub-list");
          if (sub) {
            sub.classList.add("is-closing");
            slideUpForce(sub, 500, 0, { force: true });
            const onSlideUpDoneForce = (e2) => {
              if (e2.detail && e2.detail.target === sub) {
                sub.classList.remove("is-closing");
                document.removeEventListener("slideUpDoneForce", onSlideUpDoneForce);
              }
            };
            document.addEventListener("slideUpDoneForce", onSlideUpDoneForce);
          }
        }
      });
    }
    clickedItem.classList.add("_active");
    slideDownForce(submenu, 500, 0, { force: true });
  }
}
function updateMenuArrowHandlers() {
  document.querySelectorAll(".menu__arrow-box").forEach((el) => {
    const clone = el.cloneNode(true);
    el.replaceWith(clone);
    clone.addEventListener("click", handleMenuArrowsClick);
  });
}
function setupHoverSubmenus() {
  const menuItems = document.querySelectorAll(".menu__item");
  menuItems.forEach((item) => {
    if (item.__mouseenterHandler) item.removeEventListener("mouseenter", item.__mouseenterHandler);
    if (item.__mouseleaveHandler) item.removeEventListener("mouseleave", item.__mouseleaveHandler);
    delete item.__mouseenterHandler;
    delete item.__mouseleaveHandler;
  });
  if (window.innerWidth <= 768 || document.documentElement.hasAttribute("data-fls-touch")) return;
  menuItems.forEach((item) => {
    const submenu = item.querySelector(".menu__sub-list");
    if (!submenu) return;
    submenu.hidden = false;
    submenu.removeAttribute("hidden");
    submenu.setAttribute("aria-hidden", "true");
    submenu.querySelectorAll("a, button, [tabindex]").forEach((el) => {
      el.setAttribute("tabindex", "-1");
    });
    function updateSubmenuAccessibility(submenu2, isOpen) {
      const focusable = submenu2.querySelectorAll("a, button, [tabindex]");
      submenu2.setAttribute("aria-hidden", String(!isOpen));
      focusable.forEach((el) => el.setAttribute("tabindex", isOpen ? "0" : "-1"));
      const parentTrigger = item.querySelector(".menu__link");
      if (parentTrigger) {
        parentTrigger.setAttribute("aria-expanded", String(isOpen));
      }
    }
    const mouseEnterHandler = () => {
      menuItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove("_active");
          const sub = other.querySelector(".menu__sub-list");
          if (sub) updateSubmenuAccessibility(sub, false);
        }
      });
      item.classList.add("_active");
      updateSubmenuAccessibility(submenu, true);
    };
    const mouseLeaveHandler = () => {
      item.classList.remove("_active");
      updateSubmenuAccessibility(submenu, false);
    };
    item.__mouseenterHandler = mouseEnterHandler;
    item.__mouseleaveHandler = mouseLeaveHandler;
    item.addEventListener("mouseenter", mouseEnterHandler);
    item.addEventListener("mouseleave", mouseLeaveHandler);
  });
}
document.addEventListener("DOMContentLoaded", () => {
  if (menuButton) {
    menuInit();
  }
});
function headerScroll() {
  const header = document.querySelector("[data-fls-header-scroll]");
  const headerShow = header.hasAttribute("data-fls-header-scroll-show");
  const headerShowTimer = header.dataset.flsHeaderScrollShow ? header.dataset.flsHeaderScrollShow : 500;
  const startPoint = header.dataset.flsHeaderScroll ? header.dataset.flsHeaderScroll : 1;
  let scrollDirection = 0;
  let timer;
  document.addEventListener("scroll", function(e) {
    const scrollTop = window.scrollY;
    clearTimeout(timer);
    if (scrollTop >= startPoint) {
      !header.classList.contains("--header-scroll") ? header.classList.add("--header-scroll") : null;
      if (headerShow) {
        if (scrollTop > scrollDirection) {
          header.classList.contains("--header-show") ? header.classList.remove("--header-show") : null;
        } else {
          !header.classList.contains("--header-show") ? header.classList.add("--header-show") : null;
        }
        timer = setTimeout(() => {
          !header.classList.contains("--header-show") ? header.classList.add("--header-show") : null;
        }, headerShowTimer);
      }
    } else {
      header.classList.contains("--header-scroll") ? header.classList.remove("--header-scroll") : null;
      if (headerShow) {
        header.classList.contains("--header-show") ? header.classList.remove("--header-show") : null;
      }
    }
    scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
  });
}
document.querySelector("[data-fls-header-scroll]") ? window.addEventListener("load", headerScroll) : null;
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
document.addEventListener("DOMContentLoaded", function() {
  const button = document.querySelector("[data-fls-scrolltop]");
  if (!button) return;
  button.addEventListener("click", scrollToTop);
  window.addEventListener("scroll", function() {
    const isVisible = window.scrollY > 200;
    button.classList.toggle("show", isVisible);
  });
});
function preloader() {
  const preloaderImages = document.querySelectorAll("img");
  const htmlDocument = document.documentElement;
  const isPreloaded = localStorage.getItem(location.href) && document.querySelector('[data-fls-preloader="true"]');
  if (preloaderImages.length && !isPreloaded) {
    let setValueProgress = function(progress2) {
      showPecentLoad ? showPecentLoad.innerText = `${progress2}%` : null;
      showLineLoad ? showLineLoad.style.width = `${progress2}%` : null;
    }, imageLoaded = function() {
      imagesLoadedCount++;
      progress = Math.round(100 / preloaderImages.length * imagesLoadedCount);
      const intervalId = setInterval(() => {
        counter >= progress ? clearInterval(intervalId) : setValueProgress(++counter);
        counter >= 100 ? addLoadedClass() : null;
      }, 10);
    };
    const preloaderTemplate = `
			<div class="fls-preloader">
				<div class="fls-preloader__body">
					<div class="fls-preloader__counter">0%</div>
					<div class="fls-preloader__line"><span></span></div>
				</div>
			</div>`;
    document.body.insertAdjacentHTML("beforeend", preloaderTemplate);
    document.querySelector(".fls-preloader");
    const showPecentLoad = document.querySelector(".fls-preloader__counter"), showLineLoad = document.querySelector(".fls-preloader__line span");
    let imagesLoadedCount = 0;
    let counter = 0;
    let progress = 0;
    htmlDocument.setAttribute("data-fls-preloader-loading", "");
    htmlDocument.setAttribute("data-fls-scrolllock", "");
    preloaderImages.forEach((preloaderImage) => {
      const imgClone = document.createElement("img");
      if (imgClone) {
        imgClone.onload = imageLoaded;
        imgClone.onerror = imageLoaded;
        preloaderImage.dataset.src ? imgClone.src = preloaderImage.dataset.src : imgClone.src = preloaderImage.src;
      }
    });
    setValueProgress(progress);
    const preloaderOnce = () => localStorage.setItem(location.href, "preloaded");
    document.querySelector('[data-fls-preloader="true"]') ? preloaderOnce() : null;
  } else {
    addLoadedClass();
  }
  function addLoadedClass() {
    htmlDocument.setAttribute("data-fls-preloader-loaded", "");
    htmlDocument.removeAttribute("data-fls-preloader-loading");
    htmlDocument.removeAttribute("data-fls-scrolllock");
  }
}
document.addEventListener("DOMContentLoaded", preloader);
export {
  getHash as a,
  setHash as b,
  slideUp as c,
  dataMediaQueries as d,
  getDigFormat as e,
  gotoBlock as g,
  slideDown as s,
  uniqArray as u
};
