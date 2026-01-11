import { a as getHash, d as dataMediaQueries, s as slideDown, b as setHash, c as slideUp } from "./app.min.js";
import "./slider.min.js";
/* empty css                */
/* empty css               */
import "./watcher.min.js";
/* empty css                     */
/* empty css                */
function tabs() {
  const tabs2 = document.querySelectorAll("[data-fls-tabs]");
  let tabsActiveHash = [];
  if (tabs2.length > 0) {
    const hash = getHash();
    if (hash && hash.startsWith("tab-")) {
      tabsActiveHash = hash.replace("tab-", "").split("-");
    }
    tabs2.forEach((tabsBlock, index) => {
      tabsBlock.classList.add("--tab-init");
      tabsBlock.setAttribute("data-fls-tabs-index", index);
      tabsBlock.addEventListener("click", setTabsAction);
      initTabs(tabsBlock);
    });
    let mdQueriesArray = dataMediaQueries(tabs2, "flsTabs");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach((mdQueriesItem) => {
        mdQueriesItem.matchMedia.addEventListener("change", function() {
          setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
  }
  function setTitlePosition(tabsMediaArray, matchMedia) {
    tabsMediaArray.forEach((tabsMediaItem) => {
      tabsMediaItem = tabsMediaItem.item;
      let tabsTitles = tabsMediaItem.querySelector("[data-fls-tabs-titles]");
      let tabsTitleItems = tabsMediaItem.querySelectorAll("[data-fls-tabs-title]");
      let tabsContent = tabsMediaItem.querySelector("[data-fls-tabs-body]");
      let tabsContentItems = tabsMediaItem.querySelectorAll("[data-fls-tabs-item]");
      tabsTitleItems = Array.from(tabsTitleItems).filter((item) => item.closest("[data-fls-tabs]") === tabsMediaItem);
      tabsContentItems = Array.from(tabsContentItems).filter((item) => item.closest("[data-fls-tabs]") === tabsMediaItem);
      tabsContentItems.forEach((tabsContentItem, index) => {
        if (matchMedia.matches) {
          tabsContent.append(tabsTitleItems[index]);
          tabsContent.append(tabsContentItem);
          tabsMediaItem.classList.add("--tab-spoller");
        } else {
          tabsTitles.append(tabsTitleItems[index]);
          tabsMediaItem.classList.remove("--tab-spoller");
        }
      });
    });
  }
  function initTabs(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll("[data-fls-tabs-titles]>*");
    let tabsContent = tabsBlock.querySelectorAll("[data-fls-tabs-body]>*");
    const tabsBlockIndex = tabsBlock.dataset.flsTabsIndex;
    const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;
    if (tabsActiveHashBlock) {
      const tabsActiveTitle = tabsBlock.querySelector("[data-fls-tabs-titles]>.--tab-active");
      tabsActiveTitle ? tabsActiveTitle.classList.remove("--tab-active") : null;
    }
    if (tabsContent.length) {
      tabsContent.forEach((tabsContentItem, index) => {
        tabsTitles[index].setAttribute("data-fls-tabs-title", "");
        tabsContentItem.setAttribute("data-fls-tabs-item", "");
        if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
          tabsTitles[index].classList.add("--tab-active");
        }
        tabsContentItem.hidden = !tabsTitles[index].classList.contains("--tab-active");
      });
    }
  }
  function setTabsStatus(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll("[data-fls-tabs-title]");
    let tabsContent = tabsBlock.querySelectorAll("[data-fls-tabs-item]");
    const tabsBlockIndex = tabsBlock.dataset.flsTabsIndex;
    function isTabsAnamate(tabsBlock2) {
      if (tabsBlock2.hasAttribute("data-fls-tabs-animate")) {
        return tabsBlock2.dataset.flsTabsAnimate > 0 ? Number(tabsBlock2.dataset.flsTabsAnimate) : 500;
      }
    }
    const tabsBlockAnimate = isTabsAnamate(tabsBlock);
    if (tabsContent.length > 0) {
      const isHash = tabsBlock.hasAttribute("data-fls-tabs-hash");
      tabsContent = Array.from(tabsContent).filter((item) => item.closest("[data-fls-tabs]") === tabsBlock);
      tabsTitles = Array.from(tabsTitles).filter((item) => item.closest("[data-fls-tabs]") === tabsBlock);
      tabsContent.forEach((tabsContentItem, index) => {
        if (tabsTitles[index].classList.contains("--tab-active")) {
          if (tabsBlockAnimate) {
            slideDown(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = false;
          }
          if (isHash && !tabsContentItem.closest(".popup")) {
            setHash(`tab-${tabsBlockIndex}-${index}`);
          }
        } else {
          if (tabsBlockAnimate) {
            slideUp(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = true;
          }
        }
      });
    }
  }
  function setTabsAction(e) {
    const el = e.target;
    if (el.closest("[data-fls-tabs-title]")) {
      const tabTitle = el.closest("[data-fls-tabs-title]");
      const tabsBlock = tabTitle.closest("[data-fls-tabs]");
      if (!tabTitle.classList.contains("--tab-active") && !tabsBlock.querySelector(".--slide")) {
        let tabActiveTitle = tabsBlock.querySelectorAll("[data-fls-tabs-title].--tab-active");
        tabActiveTitle.length ? tabActiveTitle = Array.from(tabActiveTitle).filter((item) => item.closest("[data-fls-tabs]") === tabsBlock) : null;
        tabActiveTitle.length ? tabActiveTitle[0].classList.remove("--tab-active") : null;
        tabTitle.classList.add("--tab-active");
        setTabsStatus(tabsBlock);
      }
      e.preventDefault();
    }
  }
}
window.addEventListener("load", tabs);
const loadMoreBtn = document.getElementById("loadMore");
const STEP = 3;
function getCurrentFilter() {
  const activeTab = document.querySelector(".tabs__title.--tab-active");
  return activeTab ? activeTab.dataset.filter || "all" : "all";
}
function hideAllExcept(count) {
  const body = document.querySelector(".tabs__body");
  if (!body) return;
  const filter = getCurrentFilter();
  const articles = Array.from(body.querySelectorAll(".articleitem, .articleiteminner"));
  let visible = 0;
  articles.forEach((article) => {
    const category = article.dataset.category || "";
    const match = filter === "all" || category === filter;
    if (match && visible < count) {
      article.style.display = "";
      article.classList.add("fade-up");
      setTimeout(() => article.classList.add("show"), 50);
      visible++;
    } else {
      article.style.display = "none";
      article.classList.remove("show");
    }
  });
  body.dataset.visibleCount = visible;
  updateButton();
}
function updateButton() {
  const body = document.querySelector(".tabs__body");
  if (!body || !loadMoreBtn) return;
  const filter = getCurrentFilter();
  const articles = Array.from(body.querySelectorAll(".articleitem, .articleiteminner")).filter((article) => filter === "all" || article.dataset.category === filter);
  const visibleCount = parseInt(body.dataset.visibleCount || STEP, 10);
  loadMoreBtn.style.display = articles.length > visibleCount ? "block" : "none";
}
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".tabs__body")) {
    hideAllExcept(STEP);
  }
});
loadMoreBtn?.addEventListener("click", () => {
  const body = document.querySelector(".tabs__body");
  if (!body) return;
  const filter = getCurrentFilter();
  const articles = Array.from(body.querySelectorAll(".articleitem, .articleiteminner")).filter((article) => filter === "all" || article.dataset.category === filter);
  let visibleCount = parseInt(body.dataset.visibleCount || STEP, 10);
  const newCount = visibleCount + STEP;
  articles.forEach((el, i) => {
    if (i < newCount) {
      el.style.display = "";
      if (i >= visibleCount) {
        el.classList.add("fade-up");
        setTimeout(() => el.classList.add("show"), 50);
      }
    }
  });
  body.dataset.visibleCount = newCount;
  updateButton();
});
document.querySelectorAll(".tabs__title").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tabs__title").forEach((b) => b.classList.remove("--tab-active"));
    btn.classList.add("--tab-active");
    hideAllExcept(STEP);
  });
});
