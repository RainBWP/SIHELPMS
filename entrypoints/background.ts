export default defineBackground(() => {

  browser.action.onClicked.addListener(async (tab) => {
    if (tab.windowId === undefined) return;

    await browser.sidePanel.open({ windowId: tab.windowId });
  });
});
