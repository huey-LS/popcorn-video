export function loadStyle (styleString: string): void {
  var head = document.getElementsByTagName('head')[0];
  var styleElement = document.createElement('style') as any;
  if (styleElement.styleSheet) {
     // Support for IE
     styleElement.styleSheet.cssText = styleString;
  } else {
    // Support for the rest
    styleElement.appendChild(document.createTextNode(styleString));
  }

  head.appendChild(styleElement);
}

let lazyTimer: any;
let lazyStyleStringArray: string[] = [];
let lazyTime = 10;

export function loadStyleLazy (styleString: string): void {
  lazyStyleStringArray.push(styleString);
  if (!lazyTimer) {
    lazyTimer = setTimeout(() => {
      if (lazyStyleStringArray.length > 0) {
        loadStyle(lazyStyleStringArray.join('\n'));
        lazyStyleStringArray = [];
      }
      lazyTimer = null;
    }, lazyTime);
  }
}