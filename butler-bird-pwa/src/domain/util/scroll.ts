export function scrollToTargetAdjusted(categoryId: number) {
  const element = document.querySelector(`[data-id="${categoryId}"]`);

  if (element) {
    const elementPosition = getOffset(element);
    //offsetPosition = elementPosition - button height - bottom margin - height of shrunk categories
    const offsetPosition = elementPosition - 48 - 36 - 153;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}

function getOffset(el: Element) {
  const rect = el.getBoundingClientRect();
  return rect.top + window.scrollY;
}

export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
