const hiddenSidebarPaths = ["/login"]; // 사이드바 숨길 경로

const HiddenUtils = {
  isSidebarHidden: (path) => hiddenSidebarPaths.includes(path),
};

export default HiddenUtils;