export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  browser.action.onClicked.addListener(async (tab) => {
    if (tab.windowId === undefined) return;

    await browser.sidePanel.open({ windowId: tab.windowId });
  });
});
