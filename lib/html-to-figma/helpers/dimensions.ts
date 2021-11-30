function getDirectionMostOfElements(
  direction: "left" | "right" | "top" | "bottom",
  elements: Element[]
) {
  if (elements.length === 1) {
    return elements[0];
  }
  return elements.reduce((memo, value) => {
    if (!memo) {
      return value;
    }

    const valueDirection = getBoundingClientRect(value)[direction];
    const memoDirection = getBoundingClientRect(memo)[direction];

    if (direction === "left" || direction === "top") {
      if (valueDirection < memoDirection) {
        return value;
      }
    } else {
      if (valueDirection > memoDirection) {
        return value;
      }
    }
    return memo;
  }, null as Element | null) as Element;
}

function getAggregateRectOfElements(elements: Element[]) {
  if (!elements.length) {
    return null;
  }

  const top = getBoundingClientRect(
    getDirectionMostOfElements("top", elements)
  ).top;
  const left = getBoundingClientRect(
    getDirectionMostOfElements("left", elements)
  ).left;
  const bottom = getBoundingClientRect(
    getDirectionMostOfElements("bottom", elements)
  ).bottom;
  const right = getBoundingClientRect(
    getDirectionMostOfElements("right", elements)
  ).right;
  const width = right - left;
  const height = bottom - top;
  return {
    top,
    left,
    bottom,
    right,
    width,
    height,
  };
}
export function getBoundingClientRect(
  el: Element
): Pick<DOMRect, "top" | "left" | "bottom" | "width" | "right" | "height"> {
  const computed = getComputedStyle(el);
  const display = computed.display;
  if (display?.includes("inline") && el.children.length) {
    const elRect = el.getBoundingClientRect();
    const aggregateRect = getAggregateRectOfElements(Array.from(el.children))!;

    if (elRect.width > aggregateRect.width) {
      return {
        ...aggregateRect,
        width: elRect.width,
        left: elRect.left,
        right: elRect.right,
      };
    }
    return aggregateRect;
  }

  return el.getBoundingClientRect();
}