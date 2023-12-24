import {
  CommonModule,
  isPlatformBrowser,
  isPlatformServer
} from "./chunk-KCAQBKK2.js";
import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  NgZone,
  Output,
  PLATFORM_ID,
  debounceTime,
  fromEvent,
  setClassMetadata,
  ɵɵdefineDirective,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject
} from "./chunk-XKW2QV4X.js";
import "./chunk-ENBES6XL.js";

// node_modules/@trademe/ng-defer-load/fesm2020/trademe-ng-defer-load.mjs
var DeferLoadDirective = class {
  constructor(_element, _zone, platformId) {
    this._element = _element;
    this._zone = _zone;
    this.platformId = platformId;
    this.preRender = true;
    this.fallbackEnabled = true;
    this.removeListenersAfterLoad = true;
    this.deferLoad = new EventEmitter();
    this.checkForIntersection = (entries) => {
      entries.forEach((entry) => {
        if (this.checkIfIntersecting(entry)) {
          this.load();
          if (this._intersectionObserver && this._element.nativeElement) {
            this._intersectionObserver.unobserve(this._element.nativeElement);
          }
        }
      });
    };
    this.onScroll = () => {
      if (this.isVisible()) {
        this._zone.run(() => this.load());
      }
    };
  }
  ngOnInit() {
    if (isPlatformServer(this.platformId) && this.preRender || isPlatformBrowser(this.platformId) && !this.fallbackEnabled && !this.hasCompatibleBrowser()) {
      this.load();
    }
  }
  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.hasCompatibleBrowser()) {
        this.registerIntersectionObserver();
        if (this._intersectionObserver && this._element.nativeElement) {
          this._intersectionObserver.observe(this._element.nativeElement);
        }
      } else if (this.fallbackEnabled) {
        this.addScrollListeners();
      }
    }
  }
  hasCompatibleBrowser() {
    const hasIntersectionObserver = "IntersectionObserver" in window;
    const userAgent = window.navigator.userAgent;
    const matches = userAgent.match(/Edge\/(\d*)\./i);
    const isEdge = !!matches && matches.length > 1;
    const isEdgeVersion16OrBetter = isEdge && !!matches && parseInt(matches[1], 10) > 15;
    return hasIntersectionObserver && (!isEdge || isEdgeVersion16OrBetter);
  }
  ngOnDestroy() {
    this.removeListeners();
  }
  registerIntersectionObserver() {
    if (!!this._intersectionObserver) {
      return;
    }
    this._intersectionObserver = new IntersectionObserver((entries) => {
      this.checkForIntersection(entries);
    }, {});
  }
  checkIfIntersecting(entry) {
    if (entry && entry.time) {
      return entry.isIntersecting && entry.target === this._element.nativeElement;
    }
    return this.isVisible();
  }
  load() {
    if (this.removeListenersAfterLoad) {
      this.removeListeners();
    }
    this.deferLoad.emit();
  }
  addScrollListeners() {
    if (this.isVisible()) {
      this.load();
      return;
    }
    this._zone.runOutsideAngular(() => {
      this._scrollSubscription = fromEvent(window, "scroll").pipe(debounceTime(50)).subscribe(this.onScroll);
    });
  }
  removeListeners() {
    this._scrollSubscription?.unsubscribe();
    this._intersectionObserver?.disconnect();
  }
  isVisible() {
    let scrollPosition = this.getScrollPosition();
    let elementOffset = this._element.nativeElement.getBoundingClientRect().top + window.scrollY;
    return elementOffset <= scrollPosition;
  }
  getScrollPosition() {
    return window.scrollY + (document.documentElement.clientHeight || document.body.clientHeight);
  }
};
DeferLoadDirective.ɵfac = function DeferLoadDirective_Factory(t) {
  return new (t || DeferLoadDirective)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(NgZone), ɵɵdirectiveInject(PLATFORM_ID));
};
DeferLoadDirective.ɵdir = ɵɵdefineDirective({
  type: DeferLoadDirective,
  selectors: [["", "deferLoad", ""]],
  inputs: {
    preRender: "preRender",
    fallbackEnabled: "fallbackEnabled",
    removeListenersAfterLoad: "removeListenersAfterLoad"
  },
  outputs: {
    deferLoad: "deferLoad"
  }
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DeferLoadDirective, [{
    type: Directive,
    args: [{
      selector: "[deferLoad]"
    }]
  }], function() {
    return [{
      type: ElementRef
    }, {
      type: NgZone
    }, {
      type: Object,
      decorators: [{
        type: Inject,
        args: [PLATFORM_ID]
      }]
    }];
  }, {
    preRender: [{
      type: Input
    }],
    fallbackEnabled: [{
      type: Input
    }],
    removeListenersAfterLoad: [{
      type: Input
    }],
    deferLoad: [{
      type: Output
    }]
  });
})();
var DeferLoadModule = class {
};
DeferLoadModule.ɵfac = function DeferLoadModule_Factory(t) {
  return new (t || DeferLoadModule)();
};
DeferLoadModule.ɵmod = ɵɵdefineNgModule({
  type: DeferLoadModule,
  declarations: [DeferLoadDirective],
  imports: [CommonModule],
  exports: [DeferLoadDirective]
});
DeferLoadModule.ɵinj = ɵɵdefineInjector({
  imports: [CommonModule]
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DeferLoadModule, [{
    type: NgModule,
    args: [{
      imports: [CommonModule],
      declarations: [DeferLoadDirective],
      exports: [DeferLoadDirective]
    }]
  }], null, null);
})();
export {
  DeferLoadDirective,
  DeferLoadModule
};
//# sourceMappingURL=@trademe_ng-defer-load.js.map
