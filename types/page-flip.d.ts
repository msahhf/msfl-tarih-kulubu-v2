declare module "page-flip" {
  export type PageFlipOrientation = "portrait" | "landscape";

  export interface PageFlipSettings {
    startPage: number;
    size: "fixed" | "stretch";
    width: number;
    height: number;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    drawShadow: boolean;
    flippingTime: number;
    usePortrait: boolean;
    startZIndex: number;
    autoSize: boolean;
    maxShadowOpacity: number;
    showCover: boolean;
    mobileScrollSupport: boolean;
    clickEventForward: boolean;
    useMouseEvents: boolean;
    swipeDistance: number;
    showPageCorners: boolean;
    disableFlipByClick: boolean;
  }

  export interface PageFlipEvent<T = unknown> {
    data: T;
    object: PageFlip;
  }

  export class PageFlip {
    constructor(element: HTMLElement, settings: Partial<PageFlipSettings>);
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    destroy(): void;
    update(): void;
    clear(): void;
    turnToPage(page: number): void;
    turnToPrevPage(): void;
    turnToNextPage(): void;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    flip(page: number, corner?: "top" | "bottom"): void;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    getOrientation(): PageFlipOrientation;
    on(event: "flip", callback: (event: PageFlipEvent<number>) => void): this;
    on(
      event: "changeOrientation",
      callback: (event: PageFlipEvent<PageFlipOrientation>) => void
    ): this;
    on(
      event: "init" | "update",
      callback: (event: PageFlipEvent<{ page: number; mode: PageFlipOrientation }>) => void
    ): this;
    on(event: "changeState", callback: (event: PageFlipEvent<string>) => void): this;
    off(event: string): void;
  }
}
