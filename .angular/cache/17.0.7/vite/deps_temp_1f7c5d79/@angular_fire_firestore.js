import {
  Component,
  ErrorFactory,
  FirebaseApp,
  FirebaseApps,
  FirebaseError,
  LogLevel,
  Logger,
  SDK_VERSION,
  VERSION,
  _getProvider,
  _registerComponent,
  _removeServiceInstance,
  base64Decode,
  createMockUserToken,
  createSubscribe,
  deepEqual,
  extractQuerystring,
  getApp,
  getDefaultEmulatorHost,
  getDefaultEmulatorHostnameAndPort,
  getExperimentalSetting,
  getModularInstance,
  getUA,
  isBrowserExtension,
  isEmpty,
  isIE,
  isIndexedDBAvailable,
  isMobileCordova,
  isReactNative,
  isSafari,
  querystring,
  querystringDecode,
  registerVersion,
  ɵAngularFireSchedulers,
  ɵAppCheckInstances,
  ɵgetAllInstancesOf,
  ɵgetDefaultInstanceOf,
  ɵzoneWrap
} from "./chunk-ZB3UVNB6.js";
import {
  InjectionToken,
  Injector,
  NgModule,
  NgZone,
  Observable,
  Optional,
  __rest,
  concatMap,
  distinct,
  distinctUntilChanged,
  filter,
  from,
  map,
  of,
  pairwise,
  pipe,
  scan,
  setClassMetadata,
  startWith,
  switchMap,
  timer,
  ɵɵdefineInjector,
  ɵɵdefineNgModule
} from "./chunk-XKW2QV4X.js";
import {
  __async,
  __superGet
} from "./chunk-ENBES6XL.js";

// node_modules/@firebase/auth/dist/esm2017/index-dd468b12.js
function _prodErrorMap() {
  return {
    [
      "dependent-sdk-initialized-before-auth"
      /* AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH */
    ]: "Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."
  };
}
var prodErrorMap = _prodErrorMap;
var _DEFAULT_AUTH_ERROR_FACTORY = new ErrorFactory("auth", "Firebase", _prodErrorMap());
var logClient = new Logger("@firebase/auth");
function _logWarn(msg, ...args) {
  if (logClient.logLevel <= LogLevel.WARN) {
    logClient.warn(`Auth (${SDK_VERSION}): ${msg}`, ...args);
  }
}
function _logError(msg, ...args) {
  if (logClient.logLevel <= LogLevel.ERROR) {
    logClient.error(`Auth (${SDK_VERSION}): ${msg}`, ...args);
  }
}
function _fail(authOrCode, ...rest) {
  throw createErrorInternal(authOrCode, ...rest);
}
function _createError(authOrCode, ...rest) {
  return createErrorInternal(authOrCode, ...rest);
}
function _errorWithCustomMessage(auth, code, message) {
  const errorMap = Object.assign(Object.assign({}, prodErrorMap()), { [code]: message });
  const factory = new ErrorFactory("auth", "Firebase", errorMap);
  return factory.create(code, {
    appName: auth.name
  });
}
function _assertInstanceOf(auth, object, instance) {
  const constructorInstance = instance;
  if (!(object instanceof constructorInstance)) {
    if (constructorInstance.name !== object.constructor.name) {
      _fail(
        auth,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
    }
    throw _errorWithCustomMessage(auth, "argument-error", `Type of ${object.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`);
  }
}
function createErrorInternal(authOrCode, ...rest) {
  if (typeof authOrCode !== "string") {
    const code = rest[0];
    const fullParams = [...rest.slice(1)];
    if (fullParams[0]) {
      fullParams[0].appName = authOrCode.name;
    }
    return authOrCode._errorFactory.create(code, ...fullParams);
  }
  return _DEFAULT_AUTH_ERROR_FACTORY.create(authOrCode, ...rest);
}
function _assert(assertion, authOrCode, ...rest) {
  if (!assertion) {
    throw createErrorInternal(authOrCode, ...rest);
  }
}
function debugFail(failure) {
  const message = `INTERNAL ASSERTION FAILED: ` + failure;
  _logError(message);
  throw new Error(message);
}
function debugAssert(assertion, message) {
  if (!assertion) {
    debugFail(message);
  }
}
function _getCurrentUrl() {
  var _a;
  return typeof self !== "undefined" && ((_a = self.location) === null || _a === void 0 ? void 0 : _a.href) || "";
}
function _isHttpOrHttps() {
  return _getCurrentScheme() === "http:" || _getCurrentScheme() === "https:";
}
function _getCurrentScheme() {
  var _a;
  return typeof self !== "undefined" && ((_a = self.location) === null || _a === void 0 ? void 0 : _a.protocol) || null;
}
function _isOnline() {
  if (typeof navigator !== "undefined" && navigator && "onLine" in navigator && typeof navigator.onLine === "boolean" && // Apply only for traditional web apps and Chrome extensions.
  // This is especially true for Cordova apps which have unreliable
  // navigator.onLine behavior unless cordova-plugin-network-information is
  // installed which overwrites the native navigator.onLine value and
  // defines navigator.connection.
  (_isHttpOrHttps() || isBrowserExtension() || "connection" in navigator)) {
    return navigator.onLine;
  }
  return true;
}
function _getUserLanguage() {
  if (typeof navigator === "undefined") {
    return null;
  }
  const navigatorLanguage = navigator;
  return (
    // Most reliable, but only supported in Chrome/Firefox.
    navigatorLanguage.languages && navigatorLanguage.languages[0] || // Supported in most browsers, but returns the language of the browser
    // UI, not the language set in browser settings.
    navigatorLanguage.language || // Couldn't determine language.
    null
  );
}
var Delay = class {
  constructor(shortDelay, longDelay) {
    this.shortDelay = shortDelay;
    this.longDelay = longDelay;
    debugAssert(longDelay > shortDelay, "Short delay should be less than long delay!");
    this.isMobile = isMobileCordova() || isReactNative();
  }
  get() {
    if (!_isOnline()) {
      return Math.min(5e3, this.shortDelay);
    }
    return this.isMobile ? this.longDelay : this.shortDelay;
  }
};
function _emulatorUrl(config, path) {
  debugAssert(config.emulator, "Emulator should always be set here");
  const { url } = config.emulator;
  if (!path) {
    return url;
  }
  return `${url}${path.startsWith("/") ? path.slice(1) : path}`;
}
var FetchProvider = class {
  static initialize(fetchImpl, headersImpl, responseImpl) {
    this.fetchImpl = fetchImpl;
    if (headersImpl) {
      this.headersImpl = headersImpl;
    }
    if (responseImpl) {
      this.responseImpl = responseImpl;
    }
  }
  static fetch() {
    if (this.fetchImpl) {
      return this.fetchImpl;
    }
    if (typeof self !== "undefined" && "fetch" in self) {
      return self.fetch;
    }
    if (typeof globalThis !== "undefined" && globalThis.fetch) {
      return globalThis.fetch;
    }
    if (typeof fetch !== "undefined") {
      return fetch;
    }
    debugFail("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
  }
  static headers() {
    if (this.headersImpl) {
      return this.headersImpl;
    }
    if (typeof self !== "undefined" && "Headers" in self) {
      return self.Headers;
    }
    if (typeof globalThis !== "undefined" && globalThis.Headers) {
      return globalThis.Headers;
    }
    if (typeof Headers !== "undefined") {
      return Headers;
    }
    debugFail("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
  }
  static response() {
    if (this.responseImpl) {
      return this.responseImpl;
    }
    if (typeof self !== "undefined" && "Response" in self) {
      return self.Response;
    }
    if (typeof globalThis !== "undefined" && globalThis.Response) {
      return globalThis.Response;
    }
    if (typeof Response !== "undefined") {
      return Response;
    }
    debugFail("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill");
  }
};
var SERVER_ERROR_MAP = {
  // Custom token errors.
  [
    "CREDENTIAL_MISMATCH"
    /* ServerError.CREDENTIAL_MISMATCH */
  ]: "custom-token-mismatch",
  // This can only happen if the SDK sends a bad request.
  [
    "MISSING_CUSTOM_TOKEN"
    /* ServerError.MISSING_CUSTOM_TOKEN */
  ]: "internal-error",
  // Create Auth URI errors.
  [
    "INVALID_IDENTIFIER"
    /* ServerError.INVALID_IDENTIFIER */
  ]: "invalid-email",
  // This can only happen if the SDK sends a bad request.
  [
    "MISSING_CONTINUE_URI"
    /* ServerError.MISSING_CONTINUE_URI */
  ]: "internal-error",
  // Sign in with email and password errors (some apply to sign up too).
  [
    "INVALID_PASSWORD"
    /* ServerError.INVALID_PASSWORD */
  ]: "wrong-password",
  // This can only happen if the SDK sends a bad request.
  [
    "MISSING_PASSWORD"
    /* ServerError.MISSING_PASSWORD */
  ]: "missing-password",
  // Thrown if Email Enumeration Protection is enabled in the project and the email or password is
  // invalid.
  [
    "INVALID_LOGIN_CREDENTIALS"
    /* ServerError.INVALID_LOGIN_CREDENTIALS */
  ]: "invalid-credential",
  // Sign up with email and password errors.
  [
    "EMAIL_EXISTS"
    /* ServerError.EMAIL_EXISTS */
  ]: "email-already-in-use",
  [
    "PASSWORD_LOGIN_DISABLED"
    /* ServerError.PASSWORD_LOGIN_DISABLED */
  ]: "operation-not-allowed",
  // Verify assertion for sign in with credential errors:
  [
    "INVALID_IDP_RESPONSE"
    /* ServerError.INVALID_IDP_RESPONSE */
  ]: "invalid-credential",
  [
    "INVALID_PENDING_TOKEN"
    /* ServerError.INVALID_PENDING_TOKEN */
  ]: "invalid-credential",
  [
    "FEDERATED_USER_ID_ALREADY_LINKED"
    /* ServerError.FEDERATED_USER_ID_ALREADY_LINKED */
  ]: "credential-already-in-use",
  // This can only happen if the SDK sends a bad request.
  [
    "MISSING_REQ_TYPE"
    /* ServerError.MISSING_REQ_TYPE */
  ]: "internal-error",
  // Send Password reset email errors:
  [
    "EMAIL_NOT_FOUND"
    /* ServerError.EMAIL_NOT_FOUND */
  ]: "user-not-found",
  [
    "RESET_PASSWORD_EXCEED_LIMIT"
    /* ServerError.RESET_PASSWORD_EXCEED_LIMIT */
  ]: "too-many-requests",
  [
    "EXPIRED_OOB_CODE"
    /* ServerError.EXPIRED_OOB_CODE */
  ]: "expired-action-code",
  [
    "INVALID_OOB_CODE"
    /* ServerError.INVALID_OOB_CODE */
  ]: "invalid-action-code",
  // This can only happen if the SDK sends a bad request.
  [
    "MISSING_OOB_CODE"
    /* ServerError.MISSING_OOB_CODE */
  ]: "internal-error",
  // Operations that require ID token in request:
  [
    "CREDENTIAL_TOO_OLD_LOGIN_AGAIN"
    /* ServerError.CREDENTIAL_TOO_OLD_LOGIN_AGAIN */
  ]: "requires-recent-login",
  [
    "INVALID_ID_TOKEN"
    /* ServerError.INVALID_ID_TOKEN */
  ]: "invalid-user-token",
  [
    "TOKEN_EXPIRED"
    /* ServerError.TOKEN_EXPIRED */
  ]: "user-token-expired",
  [
    "USER_NOT_FOUND"
    /* ServerError.USER_NOT_FOUND */
  ]: "user-token-expired",
  // Other errors.
  [
    "TOO_MANY_ATTEMPTS_TRY_LATER"
    /* ServerError.TOO_MANY_ATTEMPTS_TRY_LATER */
  ]: "too-many-requests",
  [
    "PASSWORD_DOES_NOT_MEET_REQUIREMENTS"
    /* ServerError.PASSWORD_DOES_NOT_MEET_REQUIREMENTS */
  ]: "password-does-not-meet-requirements",
  // Phone Auth related errors.
  [
    "INVALID_CODE"
    /* ServerError.INVALID_CODE */
  ]: "invalid-verification-code",
  [
    "INVALID_SESSION_INFO"
    /* ServerError.INVALID_SESSION_INFO */
  ]: "invalid-verification-id",
  [
    "INVALID_TEMPORARY_PROOF"
    /* ServerError.INVALID_TEMPORARY_PROOF */
  ]: "invalid-credential",
  [
    "MISSING_SESSION_INFO"
    /* ServerError.MISSING_SESSION_INFO */
  ]: "missing-verification-id",
  [
    "SESSION_EXPIRED"
    /* ServerError.SESSION_EXPIRED */
  ]: "code-expired",
  // Other action code errors when additional settings passed.
  // MISSING_CONTINUE_URI is getting mapped to INTERNAL_ERROR above.
  // This is OK as this error will be caught by client side validation.
  [
    "MISSING_ANDROID_PACKAGE_NAME"
    /* ServerError.MISSING_ANDROID_PACKAGE_NAME */
  ]: "missing-android-pkg-name",
  [
    "UNAUTHORIZED_DOMAIN"
    /* ServerError.UNAUTHORIZED_DOMAIN */
  ]: "unauthorized-continue-uri",
  // getProjectConfig errors when clientId is passed.
  [
    "INVALID_OAUTH_CLIENT_ID"
    /* ServerError.INVALID_OAUTH_CLIENT_ID */
  ]: "invalid-oauth-client-id",
  // User actions (sign-up or deletion) disabled errors.
  [
    "ADMIN_ONLY_OPERATION"
    /* ServerError.ADMIN_ONLY_OPERATION */
  ]: "admin-restricted-operation",
  // Multi factor related errors.
  [
    "INVALID_MFA_PENDING_CREDENTIAL"
    /* ServerError.INVALID_MFA_PENDING_CREDENTIAL */
  ]: "invalid-multi-factor-session",
  [
    "MFA_ENROLLMENT_NOT_FOUND"
    /* ServerError.MFA_ENROLLMENT_NOT_FOUND */
  ]: "multi-factor-info-not-found",
  [
    "MISSING_MFA_ENROLLMENT_ID"
    /* ServerError.MISSING_MFA_ENROLLMENT_ID */
  ]: "missing-multi-factor-info",
  [
    "MISSING_MFA_PENDING_CREDENTIAL"
    /* ServerError.MISSING_MFA_PENDING_CREDENTIAL */
  ]: "missing-multi-factor-session",
  [
    "SECOND_FACTOR_EXISTS"
    /* ServerError.SECOND_FACTOR_EXISTS */
  ]: "second-factor-already-in-use",
  [
    "SECOND_FACTOR_LIMIT_EXCEEDED"
    /* ServerError.SECOND_FACTOR_LIMIT_EXCEEDED */
  ]: "maximum-second-factor-count-exceeded",
  // Blocking functions related errors.
  [
    "BLOCKING_FUNCTION_ERROR_RESPONSE"
    /* ServerError.BLOCKING_FUNCTION_ERROR_RESPONSE */
  ]: "internal-error",
  // Recaptcha related errors.
  [
    "RECAPTCHA_NOT_ENABLED"
    /* ServerError.RECAPTCHA_NOT_ENABLED */
  ]: "recaptcha-not-enabled",
  [
    "MISSING_RECAPTCHA_TOKEN"
    /* ServerError.MISSING_RECAPTCHA_TOKEN */
  ]: "missing-recaptcha-token",
  [
    "INVALID_RECAPTCHA_TOKEN"
    /* ServerError.INVALID_RECAPTCHA_TOKEN */
  ]: "invalid-recaptcha-token",
  [
    "INVALID_RECAPTCHA_ACTION"
    /* ServerError.INVALID_RECAPTCHA_ACTION */
  ]: "invalid-recaptcha-action",
  [
    "MISSING_CLIENT_TYPE"
    /* ServerError.MISSING_CLIENT_TYPE */
  ]: "missing-client-type",
  [
    "MISSING_RECAPTCHA_VERSION"
    /* ServerError.MISSING_RECAPTCHA_VERSION */
  ]: "missing-recaptcha-version",
  [
    "INVALID_RECAPTCHA_VERSION"
    /* ServerError.INVALID_RECAPTCHA_VERSION */
  ]: "invalid-recaptcha-version",
  [
    "INVALID_REQ_TYPE"
    /* ServerError.INVALID_REQ_TYPE */
  ]: "invalid-req-type"
  /* AuthErrorCode.INVALID_REQ_TYPE */
};
var DEFAULT_API_TIMEOUT_MS = new Delay(3e4, 6e4);
function _addTidIfNecessary(auth, request) {
  if (auth.tenantId && !request.tenantId) {
    return Object.assign(Object.assign({}, request), { tenantId: auth.tenantId });
  }
  return request;
}
function _performApiRequest(_0, _1, _2, _3) {
  return __async(this, arguments, function* (auth, method, path, request, customErrorMap = {}) {
    return _performFetchWithErrorHandling(auth, customErrorMap, () => __async(this, null, function* () {
      let body = {};
      let params = {};
      if (request) {
        if (method === "GET") {
          params = request;
        } else {
          body = {
            body: JSON.stringify(request)
          };
        }
      }
      const query3 = querystring(Object.assign({ key: auth.config.apiKey }, params)).slice(1);
      const headers = yield auth._getAdditionalHeaders();
      headers[
        "Content-Type"
        /* HttpHeader.CONTENT_TYPE */
      ] = "application/json";
      if (auth.languageCode) {
        headers[
          "X-Firebase-Locale"
          /* HttpHeader.X_FIREBASE_LOCALE */
        ] = auth.languageCode;
      }
      return FetchProvider.fetch()(_getFinalTarget(auth, auth.config.apiHost, path, query3), Object.assign({
        method,
        headers,
        referrerPolicy: "no-referrer"
      }, body));
    }));
  });
}
function _performFetchWithErrorHandling(auth, customErrorMap, fetchFn) {
  return __async(this, null, function* () {
    auth._canInitEmulator = false;
    const errorMap = Object.assign(Object.assign({}, SERVER_ERROR_MAP), customErrorMap);
    try {
      const networkTimeout = new NetworkTimeout(auth);
      const response = yield Promise.race([
        fetchFn(),
        networkTimeout.promise
      ]);
      networkTimeout.clearNetworkTimeout();
      const json = yield response.json();
      if ("needConfirmation" in json) {
        throw _makeTaggedError(auth, "account-exists-with-different-credential", json);
      }
      if (response.ok && !("errorMessage" in json)) {
        return json;
      } else {
        const errorMessage = response.ok ? json.errorMessage : json.error.message;
        const [serverErrorCode, serverErrorMessage] = errorMessage.split(" : ");
        if (serverErrorCode === "FEDERATED_USER_ID_ALREADY_LINKED") {
          throw _makeTaggedError(auth, "credential-already-in-use", json);
        } else if (serverErrorCode === "EMAIL_EXISTS") {
          throw _makeTaggedError(auth, "email-already-in-use", json);
        } else if (serverErrorCode === "USER_DISABLED") {
          throw _makeTaggedError(auth, "user-disabled", json);
        }
        const authError = errorMap[serverErrorCode] || serverErrorCode.toLowerCase().replace(/[_\s]+/g, "-");
        if (serverErrorMessage) {
          throw _errorWithCustomMessage(auth, authError, serverErrorMessage);
        } else {
          _fail(auth, authError);
        }
      }
    } catch (e) {
      if (e instanceof FirebaseError) {
        throw e;
      }
      _fail(auth, "network-request-failed", { "message": String(e) });
    }
  });
}
function _performSignInRequest(_0, _1, _2, _3) {
  return __async(this, arguments, function* (auth, method, path, request, customErrorMap = {}) {
    const serverResponse = yield _performApiRequest(auth, method, path, request, customErrorMap);
    if ("mfaPendingCredential" in serverResponse) {
      _fail(auth, "multi-factor-auth-required", {
        _serverResponse: serverResponse
      });
    }
    return serverResponse;
  });
}
function _getFinalTarget(auth, host, path, query3) {
  const base = `${host}${path}?${query3}`;
  if (!auth.config.emulator) {
    return `${auth.config.apiScheme}://${base}`;
  }
  return _emulatorUrl(auth.config, base);
}
function _parseEnforcementState(enforcementStateStr) {
  switch (enforcementStateStr) {
    case "ENFORCE":
      return "ENFORCE";
    case "AUDIT":
      return "AUDIT";
    case "OFF":
      return "OFF";
    default:
      return "ENFORCEMENT_STATE_UNSPECIFIED";
  }
}
var NetworkTimeout = class {
  constructor(auth) {
    this.auth = auth;
    this.timer = null;
    this.promise = new Promise((_, reject) => {
      this.timer = setTimeout(() => {
        return reject(_createError(
          this.auth,
          "network-request-failed"
          /* AuthErrorCode.NETWORK_REQUEST_FAILED */
        ));
      }, DEFAULT_API_TIMEOUT_MS.get());
    });
  }
  clearNetworkTimeout() {
    clearTimeout(this.timer);
  }
};
function _makeTaggedError(auth, code, response) {
  const errorParams = {
    appName: auth.name
  };
  if (response.email) {
    errorParams.email = response.email;
  }
  if (response.phoneNumber) {
    errorParams.phoneNumber = response.phoneNumber;
  }
  const error = _createError(auth, code, errorParams);
  error.customData._tokenResponse = response;
  return error;
}
function isEnterprise(grecaptcha) {
  return grecaptcha !== void 0 && grecaptcha.enterprise !== void 0;
}
var RecaptchaConfig = class {
  constructor(response) {
    this.siteKey = "";
    this.recaptchaEnforcementState = [];
    if (response.recaptchaKey === void 0) {
      throw new Error("recaptchaKey undefined");
    }
    this.siteKey = response.recaptchaKey.split("/")[3];
    this.recaptchaEnforcementState = response.recaptchaEnforcementState;
  }
  /**
   * Returns the reCAPTCHA Enterprise enforcement state for the given provider.
   *
   * @param providerStr - The provider whose enforcement state is to be returned.
   * @returns The reCAPTCHA Enterprise enforcement state for the given provider.
   */
  getProviderEnforcementState(providerStr) {
    if (!this.recaptchaEnforcementState || this.recaptchaEnforcementState.length === 0) {
      return null;
    }
    for (const recaptchaEnforcementState of this.recaptchaEnforcementState) {
      if (recaptchaEnforcementState.provider && recaptchaEnforcementState.provider === providerStr) {
        return _parseEnforcementState(recaptchaEnforcementState.enforcementState);
      }
    }
    return null;
  }
  /**
   * Returns true if the reCAPTCHA Enterprise enforcement state for the provider is set to ENFORCE or AUDIT.
   *
   * @param providerStr - The provider whose enablement state is to be returned.
   * @returns Whether or not reCAPTCHA Enterprise protection is enabled for the given provider.
   */
  isProviderEnabled(providerStr) {
    return this.getProviderEnforcementState(providerStr) === "ENFORCE" || this.getProviderEnforcementState(providerStr) === "AUDIT";
  }
};
function getRecaptchaConfig(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "GET", "/v2/recaptchaConfig", _addTidIfNecessary(auth, request));
  });
}
function deleteAccount(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:delete", request);
  });
}
function deleteLinkedAccounts(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:update", request);
  });
}
function getAccountInfo(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:lookup", request);
  });
}
function utcTimestampToDateString(utcTimestamp) {
  if (!utcTimestamp) {
    return void 0;
  }
  try {
    const date = new Date(Number(utcTimestamp));
    if (!isNaN(date.getTime())) {
      return date.toUTCString();
    }
  } catch (e) {
  }
  return void 0;
}
function getIdToken(user3, forceRefresh = false) {
  return getModularInstance(user3).getIdToken(forceRefresh);
}
function getIdTokenResult(user3, forceRefresh = false) {
  return __async(this, null, function* () {
    const userInternal = getModularInstance(user3);
    const token = yield userInternal.getIdToken(forceRefresh);
    const claims = _parseToken(token);
    _assert(
      claims && claims.exp && claims.auth_time && claims.iat,
      userInternal.auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const firebase = typeof claims.firebase === "object" ? claims.firebase : void 0;
    const signInProvider = firebase === null || firebase === void 0 ? void 0 : firebase["sign_in_provider"];
    return {
      claims,
      token,
      authTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.auth_time)),
      issuedAtTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.iat)),
      expirationTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.exp)),
      signInProvider: signInProvider || null,
      signInSecondFactor: (firebase === null || firebase === void 0 ? void 0 : firebase["sign_in_second_factor"]) || null
    };
  });
}
function secondsStringToMilliseconds(seconds) {
  return Number(seconds) * 1e3;
}
function _parseToken(token) {
  const [algorithm, payload, signature] = token.split(".");
  if (algorithm === void 0 || payload === void 0 || signature === void 0) {
    _logError("JWT malformed, contained fewer than 3 sections");
    return null;
  }
  try {
    const decoded = base64Decode(payload);
    if (!decoded) {
      _logError("Failed to decode base64 JWT payload");
      return null;
    }
    return JSON.parse(decoded);
  } catch (e) {
    _logError("Caught error parsing JWT payload as JSON", e === null || e === void 0 ? void 0 : e.toString());
    return null;
  }
}
function _tokenExpiresIn(token) {
  const parsedToken = _parseToken(token);
  _assert(
    parsedToken,
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  );
  _assert(
    typeof parsedToken.exp !== "undefined",
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  );
  _assert(
    typeof parsedToken.iat !== "undefined",
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  );
  return Number(parsedToken.exp) - Number(parsedToken.iat);
}
function _logoutIfInvalidated(user3, promise, bypassAuthState = false) {
  return __async(this, null, function* () {
    if (bypassAuthState) {
      return promise;
    }
    try {
      return yield promise;
    } catch (e) {
      if (e instanceof FirebaseError && isUserInvalidated(e)) {
        if (user3.auth.currentUser === user3) {
          yield user3.auth.signOut();
        }
      }
      throw e;
    }
  });
}
function isUserInvalidated({ code }) {
  return code === `auth/${"user-disabled"}` || code === `auth/${"user-token-expired"}`;
}
var ProactiveRefresh = class {
  constructor(user3) {
    this.user = user3;
    this.isRunning = false;
    this.timerId = null;
    this.errorBackoff = 3e4;
  }
  _start() {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    this.schedule();
  }
  _stop() {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
    }
  }
  getInterval(wasError) {
    var _a;
    if (wasError) {
      const interval = this.errorBackoff;
      this.errorBackoff = Math.min(
        this.errorBackoff * 2,
        96e4
        /* Duration.RETRY_BACKOFF_MAX */
      );
      return interval;
    } else {
      this.errorBackoff = 3e4;
      const expTime = (_a = this.user.stsTokenManager.expirationTime) !== null && _a !== void 0 ? _a : 0;
      const interval = expTime - Date.now() - 3e5;
      return Math.max(0, interval);
    }
  }
  schedule(wasError = false) {
    if (!this.isRunning) {
      return;
    }
    const interval = this.getInterval(wasError);
    this.timerId = setTimeout(() => __async(this, null, function* () {
      yield this.iteration();
    }), interval);
  }
  iteration() {
    return __async(this, null, function* () {
      try {
        yield this.user.getIdToken(true);
      } catch (e) {
        if ((e === null || e === void 0 ? void 0 : e.code) === `auth/${"network-request-failed"}`) {
          this.schedule(
            /* wasError */
            true
          );
        }
        return;
      }
      this.schedule();
    });
  }
};
var UserMetadata = class {
  constructor(createdAt, lastLoginAt) {
    this.createdAt = createdAt;
    this.lastLoginAt = lastLoginAt;
    this._initializeTime();
  }
  _initializeTime() {
    this.lastSignInTime = utcTimestampToDateString(this.lastLoginAt);
    this.creationTime = utcTimestampToDateString(this.createdAt);
  }
  _copy(metadata) {
    this.createdAt = metadata.createdAt;
    this.lastLoginAt = metadata.lastLoginAt;
    this._initializeTime();
  }
  toJSON() {
    return {
      createdAt: this.createdAt,
      lastLoginAt: this.lastLoginAt
    };
  }
};
function _reloadWithoutSaving(user3) {
  return __async(this, null, function* () {
    var _a;
    const auth = user3.auth;
    const idToken3 = yield user3.getIdToken();
    const response = yield _logoutIfInvalidated(user3, getAccountInfo(auth, { idToken: idToken3 }));
    _assert(
      response === null || response === void 0 ? void 0 : response.users.length,
      auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const coreAccount = response.users[0];
    user3._notifyReloadListener(coreAccount);
    const newProviderData = ((_a = coreAccount.providerUserInfo) === null || _a === void 0 ? void 0 : _a.length) ? extractProviderData(coreAccount.providerUserInfo) : [];
    const providerData = mergeProviderData(user3.providerData, newProviderData);
    const oldIsAnonymous = user3.isAnonymous;
    const newIsAnonymous = !(user3.email && coreAccount.passwordHash) && !(providerData === null || providerData === void 0 ? void 0 : providerData.length);
    const isAnonymous = !oldIsAnonymous ? false : newIsAnonymous;
    const updates = {
      uid: coreAccount.localId,
      displayName: coreAccount.displayName || null,
      photoURL: coreAccount.photoUrl || null,
      email: coreAccount.email || null,
      emailVerified: coreAccount.emailVerified || false,
      phoneNumber: coreAccount.phoneNumber || null,
      tenantId: coreAccount.tenantId || null,
      providerData,
      metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
      isAnonymous
    };
    Object.assign(user3, updates);
  });
}
function reload(user3) {
  return __async(this, null, function* () {
    const userInternal = getModularInstance(user3);
    yield _reloadWithoutSaving(userInternal);
    yield userInternal.auth._persistUserIfCurrent(userInternal);
    userInternal.auth._notifyListenersIfCurrent(userInternal);
  });
}
function mergeProviderData(original, newData) {
  const deduped = original.filter((o) => !newData.some((n) => n.providerId === o.providerId));
  return [...deduped, ...newData];
}
function extractProviderData(providers) {
  return providers.map((_a) => {
    var { providerId } = _a, provider = __rest(_a, ["providerId"]);
    return {
      providerId,
      uid: provider.rawId || "",
      displayName: provider.displayName || null,
      email: provider.email || null,
      phoneNumber: provider.phoneNumber || null,
      photoURL: provider.photoUrl || null
    };
  });
}
function requestStsToken(auth, refreshToken) {
  return __async(this, null, function* () {
    const response = yield _performFetchWithErrorHandling(auth, {}, () => __async(this, null, function* () {
      const body = querystring({
        "grant_type": "refresh_token",
        "refresh_token": refreshToken
      }).slice(1);
      const { tokenApiHost, apiKey } = auth.config;
      const url = _getFinalTarget(auth, tokenApiHost, "/v1/token", `key=${apiKey}`);
      const headers = yield auth._getAdditionalHeaders();
      headers[
        "Content-Type"
        /* HttpHeader.CONTENT_TYPE */
      ] = "application/x-www-form-urlencoded";
      return FetchProvider.fetch()(url, {
        method: "POST",
        headers,
        body
      });
    }));
    return {
      accessToken: response.access_token,
      expiresIn: response.expires_in,
      refreshToken: response.refresh_token
    };
  });
}
function revokeToken(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v2/accounts:revokeToken", _addTidIfNecessary(auth, request));
  });
}
var StsTokenManager = class _StsTokenManager {
  constructor() {
    this.refreshToken = null;
    this.accessToken = null;
    this.expirationTime = null;
  }
  get isExpired() {
    return !this.expirationTime || Date.now() > this.expirationTime - 3e4;
  }
  updateFromServerResponse(response) {
    _assert(
      response.idToken,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    _assert(
      typeof response.idToken !== "undefined",
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    _assert(
      typeof response.refreshToken !== "undefined",
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const expiresIn = "expiresIn" in response && typeof response.expiresIn !== "undefined" ? Number(response.expiresIn) : _tokenExpiresIn(response.idToken);
    this.updateTokensAndExpiration(response.idToken, response.refreshToken, expiresIn);
  }
  getToken(auth, forceRefresh = false) {
    return __async(this, null, function* () {
      _assert(
        !this.accessToken || this.refreshToken,
        auth,
        "user-token-expired"
        /* AuthErrorCode.TOKEN_EXPIRED */
      );
      if (!forceRefresh && this.accessToken && !this.isExpired) {
        return this.accessToken;
      }
      if (this.refreshToken) {
        yield this.refresh(auth, this.refreshToken);
        return this.accessToken;
      }
      return null;
    });
  }
  clearRefreshToken() {
    this.refreshToken = null;
  }
  refresh(auth, oldToken) {
    return __async(this, null, function* () {
      const { accessToken, refreshToken, expiresIn } = yield requestStsToken(auth, oldToken);
      this.updateTokensAndExpiration(accessToken, refreshToken, Number(expiresIn));
    });
  }
  updateTokensAndExpiration(accessToken, refreshToken, expiresInSec) {
    this.refreshToken = refreshToken || null;
    this.accessToken = accessToken || null;
    this.expirationTime = Date.now() + expiresInSec * 1e3;
  }
  static fromJSON(appName, object) {
    const { refreshToken, accessToken, expirationTime } = object;
    const manager = new _StsTokenManager();
    if (refreshToken) {
      _assert(typeof refreshToken === "string", "internal-error", {
        appName
      });
      manager.refreshToken = refreshToken;
    }
    if (accessToken) {
      _assert(typeof accessToken === "string", "internal-error", {
        appName
      });
      manager.accessToken = accessToken;
    }
    if (expirationTime) {
      _assert(typeof expirationTime === "number", "internal-error", {
        appName
      });
      manager.expirationTime = expirationTime;
    }
    return manager;
  }
  toJSON() {
    return {
      refreshToken: this.refreshToken,
      accessToken: this.accessToken,
      expirationTime: this.expirationTime
    };
  }
  _assign(stsTokenManager) {
    this.accessToken = stsTokenManager.accessToken;
    this.refreshToken = stsTokenManager.refreshToken;
    this.expirationTime = stsTokenManager.expirationTime;
  }
  _clone() {
    return Object.assign(new _StsTokenManager(), this.toJSON());
  }
  _performRefresh() {
    return debugFail("not implemented");
  }
};
function assertStringOrUndefined(assertion, appName) {
  _assert(typeof assertion === "string" || typeof assertion === "undefined", "internal-error", { appName });
}
var UserImpl = class _UserImpl {
  constructor(_a) {
    var { uid, auth, stsTokenManager } = _a, opt = __rest(_a, ["uid", "auth", "stsTokenManager"]);
    this.providerId = "firebase";
    this.proactiveRefresh = new ProactiveRefresh(this);
    this.reloadUserInfo = null;
    this.reloadListener = null;
    this.uid = uid;
    this.auth = auth;
    this.stsTokenManager = stsTokenManager;
    this.accessToken = stsTokenManager.accessToken;
    this.displayName = opt.displayName || null;
    this.email = opt.email || null;
    this.emailVerified = opt.emailVerified || false;
    this.phoneNumber = opt.phoneNumber || null;
    this.photoURL = opt.photoURL || null;
    this.isAnonymous = opt.isAnonymous || false;
    this.tenantId = opt.tenantId || null;
    this.providerData = opt.providerData ? [...opt.providerData] : [];
    this.metadata = new UserMetadata(opt.createdAt || void 0, opt.lastLoginAt || void 0);
  }
  getIdToken(forceRefresh) {
    return __async(this, null, function* () {
      const accessToken = yield _logoutIfInvalidated(this, this.stsTokenManager.getToken(this.auth, forceRefresh));
      _assert(
        accessToken,
        this.auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      if (this.accessToken !== accessToken) {
        this.accessToken = accessToken;
        yield this.auth._persistUserIfCurrent(this);
        this.auth._notifyListenersIfCurrent(this);
      }
      return accessToken;
    });
  }
  getIdTokenResult(forceRefresh) {
    return getIdTokenResult(this, forceRefresh);
  }
  reload() {
    return reload(this);
  }
  _assign(user3) {
    if (this === user3) {
      return;
    }
    _assert(
      this.uid === user3.uid,
      this.auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    this.displayName = user3.displayName;
    this.photoURL = user3.photoURL;
    this.email = user3.email;
    this.emailVerified = user3.emailVerified;
    this.phoneNumber = user3.phoneNumber;
    this.isAnonymous = user3.isAnonymous;
    this.tenantId = user3.tenantId;
    this.providerData = user3.providerData.map((userInfo) => Object.assign({}, userInfo));
    this.metadata._copy(user3.metadata);
    this.stsTokenManager._assign(user3.stsTokenManager);
  }
  _clone(auth) {
    const newUser = new _UserImpl(Object.assign(Object.assign({}, this), { auth, stsTokenManager: this.stsTokenManager._clone() }));
    newUser.metadata._copy(this.metadata);
    return newUser;
  }
  _onReload(callback) {
    _assert(
      !this.reloadListener,
      this.auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    this.reloadListener = callback;
    if (this.reloadUserInfo) {
      this._notifyReloadListener(this.reloadUserInfo);
      this.reloadUserInfo = null;
    }
  }
  _notifyReloadListener(userInfo) {
    if (this.reloadListener) {
      this.reloadListener(userInfo);
    } else {
      this.reloadUserInfo = userInfo;
    }
  }
  _startProactiveRefresh() {
    this.proactiveRefresh._start();
  }
  _stopProactiveRefresh() {
    this.proactiveRefresh._stop();
  }
  _updateTokensIfNecessary(response, reload3 = false) {
    return __async(this, null, function* () {
      let tokensRefreshed = false;
      if (response.idToken && response.idToken !== this.stsTokenManager.accessToken) {
        this.stsTokenManager.updateFromServerResponse(response);
        tokensRefreshed = true;
      }
      if (reload3) {
        yield _reloadWithoutSaving(this);
      }
      yield this.auth._persistUserIfCurrent(this);
      if (tokensRefreshed) {
        this.auth._notifyListenersIfCurrent(this);
      }
    });
  }
  delete() {
    return __async(this, null, function* () {
      const idToken3 = yield this.getIdToken();
      yield _logoutIfInvalidated(this, deleteAccount(this.auth, { idToken: idToken3 }));
      this.stsTokenManager.clearRefreshToken();
      return this.auth.signOut();
    });
  }
  toJSON() {
    return Object.assign(Object.assign({
      uid: this.uid,
      email: this.email || void 0,
      emailVerified: this.emailVerified,
      displayName: this.displayName || void 0,
      isAnonymous: this.isAnonymous,
      photoURL: this.photoURL || void 0,
      phoneNumber: this.phoneNumber || void 0,
      tenantId: this.tenantId || void 0,
      providerData: this.providerData.map((userInfo) => Object.assign({}, userInfo)),
      stsTokenManager: this.stsTokenManager.toJSON(),
      // Redirect event ID must be maintained in case there is a pending
      // redirect event.
      _redirectEventId: this._redirectEventId
    }, this.metadata.toJSON()), {
      // Required for compatibility with the legacy SDK (go/firebase-auth-sdk-persistence-parsing):
      apiKey: this.auth.config.apiKey,
      appName: this.auth.name
    });
  }
  get refreshToken() {
    return this.stsTokenManager.refreshToken || "";
  }
  static _fromJSON(auth, object) {
    var _a, _b, _c, _d, _e2, _f, _g, _h;
    const displayName = (_a = object.displayName) !== null && _a !== void 0 ? _a : void 0;
    const email = (_b = object.email) !== null && _b !== void 0 ? _b : void 0;
    const phoneNumber = (_c = object.phoneNumber) !== null && _c !== void 0 ? _c : void 0;
    const photoURL = (_d = object.photoURL) !== null && _d !== void 0 ? _d : void 0;
    const tenantId = (_e2 = object.tenantId) !== null && _e2 !== void 0 ? _e2 : void 0;
    const _redirectEventId = (_f = object._redirectEventId) !== null && _f !== void 0 ? _f : void 0;
    const createdAt = (_g = object.createdAt) !== null && _g !== void 0 ? _g : void 0;
    const lastLoginAt = (_h = object.lastLoginAt) !== null && _h !== void 0 ? _h : void 0;
    const { uid, emailVerified, isAnonymous, providerData, stsTokenManager: plainObjectTokenManager } = object;
    _assert(
      uid && plainObjectTokenManager,
      auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const stsTokenManager = StsTokenManager.fromJSON(this.name, plainObjectTokenManager);
    _assert(
      typeof uid === "string",
      auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    assertStringOrUndefined(displayName, auth.name);
    assertStringOrUndefined(email, auth.name);
    _assert(
      typeof emailVerified === "boolean",
      auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    _assert(
      typeof isAnonymous === "boolean",
      auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    assertStringOrUndefined(phoneNumber, auth.name);
    assertStringOrUndefined(photoURL, auth.name);
    assertStringOrUndefined(tenantId, auth.name);
    assertStringOrUndefined(_redirectEventId, auth.name);
    assertStringOrUndefined(createdAt, auth.name);
    assertStringOrUndefined(lastLoginAt, auth.name);
    const user3 = new _UserImpl({
      uid,
      auth,
      email,
      emailVerified,
      displayName,
      isAnonymous,
      photoURL,
      phoneNumber,
      tenantId,
      stsTokenManager,
      createdAt,
      lastLoginAt
    });
    if (providerData && Array.isArray(providerData)) {
      user3.providerData = providerData.map((userInfo) => Object.assign({}, userInfo));
    }
    if (_redirectEventId) {
      user3._redirectEventId = _redirectEventId;
    }
    return user3;
  }
  /**
   * Initialize a User from an idToken server response
   * @param auth
   * @param idTokenResponse
   */
  static _fromIdTokenResponse(auth, idTokenResponse, isAnonymous = false) {
    return __async(this, null, function* () {
      const stsTokenManager = new StsTokenManager();
      stsTokenManager.updateFromServerResponse(idTokenResponse);
      const user3 = new _UserImpl({
        uid: idTokenResponse.localId,
        auth,
        stsTokenManager,
        isAnonymous
      });
      yield _reloadWithoutSaving(user3);
      return user3;
    });
  }
};
var instanceCache = /* @__PURE__ */ new Map();
function _getInstance(cls) {
  debugAssert(cls instanceof Function, "Expected a class definition");
  let instance = instanceCache.get(cls);
  if (instance) {
    debugAssert(instance instanceof cls, "Instance stored in cache mismatched with class");
    return instance;
  }
  instance = new cls();
  instanceCache.set(cls, instance);
  return instance;
}
var InMemoryPersistence = class {
  constructor() {
    this.type = "NONE";
    this.storage = {};
  }
  _isAvailable() {
    return __async(this, null, function* () {
      return true;
    });
  }
  _set(key, value) {
    return __async(this, null, function* () {
      this.storage[key] = value;
    });
  }
  _get(key) {
    return __async(this, null, function* () {
      const value = this.storage[key];
      return value === void 0 ? null : value;
    });
  }
  _remove(key) {
    return __async(this, null, function* () {
      delete this.storage[key];
    });
  }
  _addListener(_key, _listener) {
    return;
  }
  _removeListener(_key, _listener) {
    return;
  }
};
InMemoryPersistence.type = "NONE";
var inMemoryPersistence = InMemoryPersistence;
function _persistenceKeyName(key, apiKey, appName) {
  return `${"firebase"}:${key}:${apiKey}:${appName}`;
}
var PersistenceUserManager = class _PersistenceUserManager {
  constructor(persistence, auth, userKey) {
    this.persistence = persistence;
    this.auth = auth;
    this.userKey = userKey;
    const { config, name: name2 } = this.auth;
    this.fullUserKey = _persistenceKeyName(this.userKey, config.apiKey, name2);
    this.fullPersistenceKey = _persistenceKeyName("persistence", config.apiKey, name2);
    this.boundEventHandler = auth._onStorageEvent.bind(auth);
    this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
  }
  setCurrentUser(user3) {
    return this.persistence._set(this.fullUserKey, user3.toJSON());
  }
  getCurrentUser() {
    return __async(this, null, function* () {
      const blob = yield this.persistence._get(this.fullUserKey);
      return blob ? UserImpl._fromJSON(this.auth, blob) : null;
    });
  }
  removeCurrentUser() {
    return this.persistence._remove(this.fullUserKey);
  }
  savePersistenceForRedirect() {
    return this.persistence._set(this.fullPersistenceKey, this.persistence.type);
  }
  setPersistence(newPersistence) {
    return __async(this, null, function* () {
      if (this.persistence === newPersistence) {
        return;
      }
      const currentUser = yield this.getCurrentUser();
      yield this.removeCurrentUser();
      this.persistence = newPersistence;
      if (currentUser) {
        return this.setCurrentUser(currentUser);
      }
    });
  }
  delete() {
    this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
  }
  static create(auth, persistenceHierarchy, userKey = "authUser") {
    return __async(this, null, function* () {
      if (!persistenceHierarchy.length) {
        return new _PersistenceUserManager(_getInstance(inMemoryPersistence), auth, userKey);
      }
      const availablePersistences = (yield Promise.all(persistenceHierarchy.map((persistence) => __async(this, null, function* () {
        if (yield persistence._isAvailable()) {
          return persistence;
        }
        return void 0;
      })))).filter((persistence) => persistence);
      let selectedPersistence = availablePersistences[0] || _getInstance(inMemoryPersistence);
      const key = _persistenceKeyName(userKey, auth.config.apiKey, auth.name);
      let userToMigrate = null;
      for (const persistence of persistenceHierarchy) {
        try {
          const blob = yield persistence._get(key);
          if (blob) {
            const user3 = UserImpl._fromJSON(auth, blob);
            if (persistence !== selectedPersistence) {
              userToMigrate = user3;
            }
            selectedPersistence = persistence;
            break;
          }
        } catch (_a) {
        }
      }
      const migrationHierarchy = availablePersistences.filter((p2) => p2._shouldAllowMigration);
      if (!selectedPersistence._shouldAllowMigration || !migrationHierarchy.length) {
        return new _PersistenceUserManager(selectedPersistence, auth, userKey);
      }
      selectedPersistence = migrationHierarchy[0];
      if (userToMigrate) {
        yield selectedPersistence._set(key, userToMigrate.toJSON());
      }
      yield Promise.all(persistenceHierarchy.map((persistence) => __async(this, null, function* () {
        if (persistence !== selectedPersistence) {
          try {
            yield persistence._remove(key);
          } catch (_a) {
          }
        }
      })));
      return new _PersistenceUserManager(selectedPersistence, auth, userKey);
    });
  }
};
function _getBrowserName(userAgent) {
  const ua2 = userAgent.toLowerCase();
  if (ua2.includes("opera/") || ua2.includes("opr/") || ua2.includes("opios/")) {
    return "Opera";
  } else if (_isIEMobile(ua2)) {
    return "IEMobile";
  } else if (ua2.includes("msie") || ua2.includes("trident/")) {
    return "IE";
  } else if (ua2.includes("edge/")) {
    return "Edge";
  } else if (_isFirefox(ua2)) {
    return "Firefox";
  } else if (ua2.includes("silk/")) {
    return "Silk";
  } else if (_isBlackBerry(ua2)) {
    return "Blackberry";
  } else if (_isWebOS(ua2)) {
    return "Webos";
  } else if (_isSafari(ua2)) {
    return "Safari";
  } else if ((ua2.includes("chrome/") || _isChromeIOS(ua2)) && !ua2.includes("edge/")) {
    return "Chrome";
  } else if (_isAndroid(ua2)) {
    return "Android";
  } else {
    const re2 = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/;
    const matches = userAgent.match(re2);
    if ((matches === null || matches === void 0 ? void 0 : matches.length) === 2) {
      return matches[1];
    }
  }
  return "Other";
}
function _isFirefox(ua2 = getUA()) {
  return /firefox\//i.test(ua2);
}
function _isSafari(userAgent = getUA()) {
  const ua2 = userAgent.toLowerCase();
  return ua2.includes("safari/") && !ua2.includes("chrome/") && !ua2.includes("crios/") && !ua2.includes("android");
}
function _isChromeIOS(ua2 = getUA()) {
  return /crios\//i.test(ua2);
}
function _isIEMobile(ua2 = getUA()) {
  return /iemobile/i.test(ua2);
}
function _isAndroid(ua2 = getUA()) {
  return /android/i.test(ua2);
}
function _isBlackBerry(ua2 = getUA()) {
  return /blackberry/i.test(ua2);
}
function _isWebOS(ua2 = getUA()) {
  return /webos/i.test(ua2);
}
function _isIOS(ua2 = getUA()) {
  return /iphone|ipad|ipod/i.test(ua2) || /macintosh/i.test(ua2) && /mobile/i.test(ua2);
}
function _isIOSStandalone(ua2 = getUA()) {
  var _a;
  return _isIOS(ua2) && !!((_a = window.navigator) === null || _a === void 0 ? void 0 : _a.standalone);
}
function _isIE10() {
  return isIE() && document.documentMode === 10;
}
function _isMobileBrowser(ua2 = getUA()) {
  return _isIOS(ua2) || _isAndroid(ua2) || _isWebOS(ua2) || _isBlackBerry(ua2) || /windows phone/i.test(ua2) || _isIEMobile(ua2);
}
function _isIframe() {
  try {
    return !!(window && window !== window.top);
  } catch (e) {
    return false;
  }
}
function _getClientVersion(clientPlatform, frameworks = []) {
  let reportedPlatform;
  switch (clientPlatform) {
    case "Browser":
      reportedPlatform = _getBrowserName(getUA());
      break;
    case "Worker":
      reportedPlatform = `${_getBrowserName(getUA())}-${clientPlatform}`;
      break;
    default:
      reportedPlatform = clientPlatform;
  }
  const reportedFrameworks = frameworks.length ? frameworks.join(",") : "FirebaseCore-web";
  return `${reportedPlatform}/${"JsCore"}/${SDK_VERSION}/${reportedFrameworks}`;
}
var AuthMiddlewareQueue = class {
  constructor(auth) {
    this.auth = auth;
    this.queue = [];
  }
  pushCallback(callback, onAbort) {
    const wrappedCallback = (user3) => new Promise((resolve, reject) => {
      try {
        const result = callback(user3);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
    wrappedCallback.onAbort = onAbort;
    this.queue.push(wrappedCallback);
    const index = this.queue.length - 1;
    return () => {
      this.queue[index] = () => Promise.resolve();
    };
  }
  runMiddleware(nextUser) {
    return __async(this, null, function* () {
      if (this.auth.currentUser === nextUser) {
        return;
      }
      const onAbortStack = [];
      try {
        for (const beforeStateCallback of this.queue) {
          yield beforeStateCallback(nextUser);
          if (beforeStateCallback.onAbort) {
            onAbortStack.push(beforeStateCallback.onAbort);
          }
        }
      } catch (e) {
        onAbortStack.reverse();
        for (const onAbort of onAbortStack) {
          try {
            onAbort();
          } catch (_) {
          }
        }
        throw this.auth._errorFactory.create("login-blocked", {
          originalMessage: e === null || e === void 0 ? void 0 : e.message
        });
      }
    });
  }
};
function _getPasswordPolicy(_0) {
  return __async(this, arguments, function* (auth, request = {}) {
    return _performApiRequest(auth, "GET", "/v2/passwordPolicy", _addTidIfNecessary(auth, request));
  });
}
var MINIMUM_MIN_PASSWORD_LENGTH = 6;
var PasswordPolicyImpl = class {
  constructor(response) {
    var _a, _b, _c, _d;
    const responseOptions = response.customStrengthOptions;
    this.customStrengthOptions = {};
    this.customStrengthOptions.minPasswordLength = (_a = responseOptions.minPasswordLength) !== null && _a !== void 0 ? _a : MINIMUM_MIN_PASSWORD_LENGTH;
    if (responseOptions.maxPasswordLength) {
      this.customStrengthOptions.maxPasswordLength = responseOptions.maxPasswordLength;
    }
    if (responseOptions.containsLowercaseCharacter !== void 0) {
      this.customStrengthOptions.containsLowercaseLetter = responseOptions.containsLowercaseCharacter;
    }
    if (responseOptions.containsUppercaseCharacter !== void 0) {
      this.customStrengthOptions.containsUppercaseLetter = responseOptions.containsUppercaseCharacter;
    }
    if (responseOptions.containsNumericCharacter !== void 0) {
      this.customStrengthOptions.containsNumericCharacter = responseOptions.containsNumericCharacter;
    }
    if (responseOptions.containsNonAlphanumericCharacter !== void 0) {
      this.customStrengthOptions.containsNonAlphanumericCharacter = responseOptions.containsNonAlphanumericCharacter;
    }
    this.enforcementState = response.enforcementState;
    if (this.enforcementState === "ENFORCEMENT_STATE_UNSPECIFIED") {
      this.enforcementState = "OFF";
    }
    this.allowedNonAlphanumericCharacters = (_c = (_b = response.allowedNonAlphanumericCharacters) === null || _b === void 0 ? void 0 : _b.join("")) !== null && _c !== void 0 ? _c : "";
    this.forceUpgradeOnSignin = (_d = response.forceUpgradeOnSignin) !== null && _d !== void 0 ? _d : false;
    this.schemaVersion = response.schemaVersion;
  }
  validatePassword(password) {
    var _a, _b, _c, _d, _e2, _f;
    const status = {
      isValid: true,
      passwordPolicy: this
    };
    this.validatePasswordLengthOptions(password, status);
    this.validatePasswordCharacterOptions(password, status);
    status.isValid && (status.isValid = (_a = status.meetsMinPasswordLength) !== null && _a !== void 0 ? _a : true);
    status.isValid && (status.isValid = (_b = status.meetsMaxPasswordLength) !== null && _b !== void 0 ? _b : true);
    status.isValid && (status.isValid = (_c = status.containsLowercaseLetter) !== null && _c !== void 0 ? _c : true);
    status.isValid && (status.isValid = (_d = status.containsUppercaseLetter) !== null && _d !== void 0 ? _d : true);
    status.isValid && (status.isValid = (_e2 = status.containsNumericCharacter) !== null && _e2 !== void 0 ? _e2 : true);
    status.isValid && (status.isValid = (_f = status.containsNonAlphanumericCharacter) !== null && _f !== void 0 ? _f : true);
    return status;
  }
  /**
   * Validates that the password meets the length options for the policy.
   *
   * @param password Password to validate.
   * @param status Validation status.
   */
  validatePasswordLengthOptions(password, status) {
    const minPasswordLength = this.customStrengthOptions.minPasswordLength;
    const maxPasswordLength = this.customStrengthOptions.maxPasswordLength;
    if (minPasswordLength) {
      status.meetsMinPasswordLength = password.length >= minPasswordLength;
    }
    if (maxPasswordLength) {
      status.meetsMaxPasswordLength = password.length <= maxPasswordLength;
    }
  }
  /**
   * Validates that the password meets the character options for the policy.
   *
   * @param password Password to validate.
   * @param status Validation status.
   */
  validatePasswordCharacterOptions(password, status) {
    this.updatePasswordCharacterOptionsStatuses(
      status,
      /* containsLowercaseCharacter= */
      false,
      /* containsUppercaseCharacter= */
      false,
      /* containsNumericCharacter= */
      false,
      /* containsNonAlphanumericCharacter= */
      false
    );
    let passwordChar;
    for (let i = 0; i < password.length; i++) {
      passwordChar = password.charAt(i);
      this.updatePasswordCharacterOptionsStatuses(
        status,
        /* containsLowercaseCharacter= */
        passwordChar >= "a" && passwordChar <= "z",
        /* containsUppercaseCharacter= */
        passwordChar >= "A" && passwordChar <= "Z",
        /* containsNumericCharacter= */
        passwordChar >= "0" && passwordChar <= "9",
        /* containsNonAlphanumericCharacter= */
        this.allowedNonAlphanumericCharacters.includes(passwordChar)
      );
    }
  }
  /**
   * Updates the running validation status with the statuses for the character options.
   * Expected to be called each time a character is processed to update each option status
   * based on the current character.
   *
   * @param status Validation status.
   * @param containsLowercaseCharacter Whether the character is a lowercase letter.
   * @param containsUppercaseCharacter Whether the character is an uppercase letter.
   * @param containsNumericCharacter Whether the character is a numeric character.
   * @param containsNonAlphanumericCharacter Whether the character is a non-alphanumeric character.
   */
  updatePasswordCharacterOptionsStatuses(status, containsLowercaseCharacter, containsUppercaseCharacter, containsNumericCharacter, containsNonAlphanumericCharacter) {
    if (this.customStrengthOptions.containsLowercaseLetter) {
      status.containsLowercaseLetter || (status.containsLowercaseLetter = containsLowercaseCharacter);
    }
    if (this.customStrengthOptions.containsUppercaseLetter) {
      status.containsUppercaseLetter || (status.containsUppercaseLetter = containsUppercaseCharacter);
    }
    if (this.customStrengthOptions.containsNumericCharacter) {
      status.containsNumericCharacter || (status.containsNumericCharacter = containsNumericCharacter);
    }
    if (this.customStrengthOptions.containsNonAlphanumericCharacter) {
      status.containsNonAlphanumericCharacter || (status.containsNonAlphanumericCharacter = containsNonAlphanumericCharacter);
    }
  }
};
var AuthImpl = class {
  constructor(app, heartbeatServiceProvider, appCheckServiceProvider, config) {
    this.app = app;
    this.heartbeatServiceProvider = heartbeatServiceProvider;
    this.appCheckServiceProvider = appCheckServiceProvider;
    this.config = config;
    this.currentUser = null;
    this.emulatorConfig = null;
    this.operations = Promise.resolve();
    this.authStateSubscription = new Subscription(this);
    this.idTokenSubscription = new Subscription(this);
    this.beforeStateQueue = new AuthMiddlewareQueue(this);
    this.redirectUser = null;
    this.isProactiveRefreshEnabled = false;
    this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION = 1;
    this._canInitEmulator = true;
    this._isInitialized = false;
    this._deleted = false;
    this._initializationPromise = null;
    this._popupRedirectResolver = null;
    this._errorFactory = _DEFAULT_AUTH_ERROR_FACTORY;
    this._agentRecaptchaConfig = null;
    this._tenantRecaptchaConfigs = {};
    this._projectPasswordPolicy = null;
    this._tenantPasswordPolicies = {};
    this.lastNotifiedUid = void 0;
    this.languageCode = null;
    this.tenantId = null;
    this.settings = { appVerificationDisabledForTesting: false };
    this.frameworks = [];
    this.name = app.name;
    this.clientVersion = config.sdkClientVersion;
  }
  _initializeWithPersistence(persistenceHierarchy, popupRedirectResolver) {
    if (popupRedirectResolver) {
      this._popupRedirectResolver = _getInstance(popupRedirectResolver);
    }
    this._initializationPromise = this.queue(() => __async(this, null, function* () {
      var _a, _b;
      if (this._deleted) {
        return;
      }
      this.persistenceManager = yield PersistenceUserManager.create(this, persistenceHierarchy);
      if (this._deleted) {
        return;
      }
      if ((_a = this._popupRedirectResolver) === null || _a === void 0 ? void 0 : _a._shouldInitProactively) {
        try {
          yield this._popupRedirectResolver._initialize(this);
        } catch (e) {
        }
      }
      yield this.initializeCurrentUser(popupRedirectResolver);
      this.lastNotifiedUid = ((_b = this.currentUser) === null || _b === void 0 ? void 0 : _b.uid) || null;
      if (this._deleted) {
        return;
      }
      this._isInitialized = true;
    }));
    return this._initializationPromise;
  }
  /**
   * If the persistence is changed in another window, the user manager will let us know
   */
  _onStorageEvent() {
    return __async(this, null, function* () {
      if (this._deleted) {
        return;
      }
      const user3 = yield this.assertedPersistence.getCurrentUser();
      if (!this.currentUser && !user3) {
        return;
      }
      if (this.currentUser && user3 && this.currentUser.uid === user3.uid) {
        this._currentUser._assign(user3);
        yield this.currentUser.getIdToken();
        return;
      }
      yield this._updateCurrentUser(
        user3,
        /* skipBeforeStateCallbacks */
        true
      );
    });
  }
  initializeCurrentUser(popupRedirectResolver) {
    return __async(this, null, function* () {
      var _a;
      const previouslyStoredUser = yield this.assertedPersistence.getCurrentUser();
      let futureCurrentUser = previouslyStoredUser;
      let needsTocheckMiddleware = false;
      if (popupRedirectResolver && this.config.authDomain) {
        yield this.getOrInitRedirectPersistenceManager();
        const redirectUserEventId = (_a = this.redirectUser) === null || _a === void 0 ? void 0 : _a._redirectEventId;
        const storedUserEventId = futureCurrentUser === null || futureCurrentUser === void 0 ? void 0 : futureCurrentUser._redirectEventId;
        const result = yield this.tryRedirectSignIn(popupRedirectResolver);
        if ((!redirectUserEventId || redirectUserEventId === storedUserEventId) && (result === null || result === void 0 ? void 0 : result.user)) {
          futureCurrentUser = result.user;
          needsTocheckMiddleware = true;
        }
      }
      if (!futureCurrentUser) {
        return this.directlySetCurrentUser(null);
      }
      if (!futureCurrentUser._redirectEventId) {
        if (needsTocheckMiddleware) {
          try {
            yield this.beforeStateQueue.runMiddleware(futureCurrentUser);
          } catch (e) {
            futureCurrentUser = previouslyStoredUser;
            this._popupRedirectResolver._overrideRedirectResult(this, () => Promise.reject(e));
          }
        }
        if (futureCurrentUser) {
          return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
        } else {
          return this.directlySetCurrentUser(null);
        }
      }
      _assert(
        this._popupRedirectResolver,
        this,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      yield this.getOrInitRedirectPersistenceManager();
      if (this.redirectUser && this.redirectUser._redirectEventId === futureCurrentUser._redirectEventId) {
        return this.directlySetCurrentUser(futureCurrentUser);
      }
      return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
    });
  }
  tryRedirectSignIn(redirectResolver) {
    return __async(this, null, function* () {
      let result = null;
      try {
        result = yield this._popupRedirectResolver._completeRedirectFn(this, redirectResolver, true);
      } catch (e) {
        yield this._setRedirectUser(null);
      }
      return result;
    });
  }
  reloadAndSetCurrentUserOrClear(user3) {
    return __async(this, null, function* () {
      try {
        yield _reloadWithoutSaving(user3);
      } catch (e) {
        if ((e === null || e === void 0 ? void 0 : e.code) !== `auth/${"network-request-failed"}`) {
          return this.directlySetCurrentUser(null);
        }
      }
      return this.directlySetCurrentUser(user3);
    });
  }
  useDeviceLanguage() {
    this.languageCode = _getUserLanguage();
  }
  _delete() {
    return __async(this, null, function* () {
      this._deleted = true;
    });
  }
  updateCurrentUser(userExtern) {
    return __async(this, null, function* () {
      const user3 = userExtern ? getModularInstance(userExtern) : null;
      if (user3) {
        _assert(
          user3.auth.config.apiKey === this.config.apiKey,
          this,
          "invalid-user-token"
          /* AuthErrorCode.INVALID_AUTH */
        );
      }
      return this._updateCurrentUser(user3 && user3._clone(this));
    });
  }
  _updateCurrentUser(user3, skipBeforeStateCallbacks = false) {
    return __async(this, null, function* () {
      if (this._deleted) {
        return;
      }
      if (user3) {
        _assert(
          this.tenantId === user3.tenantId,
          this,
          "tenant-id-mismatch"
          /* AuthErrorCode.TENANT_ID_MISMATCH */
        );
      }
      if (!skipBeforeStateCallbacks) {
        yield this.beforeStateQueue.runMiddleware(user3);
      }
      return this.queue(() => __async(this, null, function* () {
        yield this.directlySetCurrentUser(user3);
        this.notifyAuthListeners();
      }));
    });
  }
  signOut() {
    return __async(this, null, function* () {
      yield this.beforeStateQueue.runMiddleware(null);
      if (this.redirectPersistenceManager || this._popupRedirectResolver) {
        yield this._setRedirectUser(null);
      }
      return this._updateCurrentUser(
        null,
        /* skipBeforeStateCallbacks */
        true
      );
    });
  }
  setPersistence(persistence) {
    return this.queue(() => __async(this, null, function* () {
      yield this.assertedPersistence.setPersistence(_getInstance(persistence));
    }));
  }
  _getRecaptchaConfig() {
    if (this.tenantId == null) {
      return this._agentRecaptchaConfig;
    } else {
      return this._tenantRecaptchaConfigs[this.tenantId];
    }
  }
  validatePassword(password) {
    return __async(this, null, function* () {
      if (!this._getPasswordPolicyInternal()) {
        yield this._updatePasswordPolicy();
      }
      const passwordPolicy = this._getPasswordPolicyInternal();
      if (passwordPolicy.schemaVersion !== this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION) {
        return Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version", {}));
      }
      return passwordPolicy.validatePassword(password);
    });
  }
  _getPasswordPolicyInternal() {
    if (this.tenantId === null) {
      return this._projectPasswordPolicy;
    } else {
      return this._tenantPasswordPolicies[this.tenantId];
    }
  }
  _updatePasswordPolicy() {
    return __async(this, null, function* () {
      const response = yield _getPasswordPolicy(this);
      const passwordPolicy = new PasswordPolicyImpl(response);
      if (this.tenantId === null) {
        this._projectPasswordPolicy = passwordPolicy;
      } else {
        this._tenantPasswordPolicies[this.tenantId] = passwordPolicy;
      }
    });
  }
  _getPersistence() {
    return this.assertedPersistence.persistence.type;
  }
  _updateErrorMap(errorMap) {
    this._errorFactory = new ErrorFactory("auth", "Firebase", errorMap());
  }
  onAuthStateChanged(nextOrObserver, error, completed) {
    return this.registerStateListener(this.authStateSubscription, nextOrObserver, error, completed);
  }
  beforeAuthStateChanged(callback, onAbort) {
    return this.beforeStateQueue.pushCallback(callback, onAbort);
  }
  onIdTokenChanged(nextOrObserver, error, completed) {
    return this.registerStateListener(this.idTokenSubscription, nextOrObserver, error, completed);
  }
  authStateReady() {
    return new Promise((resolve, reject) => {
      if (this.currentUser) {
        resolve();
      } else {
        const unsubscribe = this.onAuthStateChanged(() => {
          unsubscribe();
          resolve();
        }, reject);
      }
    });
  }
  /**
   * Revokes the given access token. Currently only supports Apple OAuth access tokens.
   */
  revokeAccessToken(token) {
    return __async(this, null, function* () {
      if (this.currentUser) {
        const idToken3 = yield this.currentUser.getIdToken();
        const request = {
          providerId: "apple.com",
          tokenType: "ACCESS_TOKEN",
          token,
          idToken: idToken3
        };
        if (this.tenantId != null) {
          request.tenantId = this.tenantId;
        }
        yield revokeToken(this, request);
      }
    });
  }
  toJSON() {
    var _a;
    return {
      apiKey: this.config.apiKey,
      authDomain: this.config.authDomain,
      appName: this.name,
      currentUser: (_a = this._currentUser) === null || _a === void 0 ? void 0 : _a.toJSON()
    };
  }
  _setRedirectUser(user3, popupRedirectResolver) {
    return __async(this, null, function* () {
      const redirectManager = yield this.getOrInitRedirectPersistenceManager(popupRedirectResolver);
      return user3 === null ? redirectManager.removeCurrentUser() : redirectManager.setCurrentUser(user3);
    });
  }
  getOrInitRedirectPersistenceManager(popupRedirectResolver) {
    return __async(this, null, function* () {
      if (!this.redirectPersistenceManager) {
        const resolver = popupRedirectResolver && _getInstance(popupRedirectResolver) || this._popupRedirectResolver;
        _assert(
          resolver,
          this,
          "argument-error"
          /* AuthErrorCode.ARGUMENT_ERROR */
        );
        this.redirectPersistenceManager = yield PersistenceUserManager.create(
          this,
          [_getInstance(resolver._redirectPersistence)],
          "redirectUser"
          /* KeyName.REDIRECT_USER */
        );
        this.redirectUser = yield this.redirectPersistenceManager.getCurrentUser();
      }
      return this.redirectPersistenceManager;
    });
  }
  _redirectUserForId(id2) {
    return __async(this, null, function* () {
      var _a, _b;
      if (this._isInitialized) {
        yield this.queue(() => __async(this, null, function* () {
        }));
      }
      if (((_a = this._currentUser) === null || _a === void 0 ? void 0 : _a._redirectEventId) === id2) {
        return this._currentUser;
      }
      if (((_b = this.redirectUser) === null || _b === void 0 ? void 0 : _b._redirectEventId) === id2) {
        return this.redirectUser;
      }
      return null;
    });
  }
  _persistUserIfCurrent(user3) {
    return __async(this, null, function* () {
      if (user3 === this.currentUser) {
        return this.queue(() => __async(this, null, function* () {
          return this.directlySetCurrentUser(user3);
        }));
      }
    });
  }
  /** Notifies listeners only if the user is current */
  _notifyListenersIfCurrent(user3) {
    if (user3 === this.currentUser) {
      this.notifyAuthListeners();
    }
  }
  _key() {
    return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
  }
  _startProactiveRefresh() {
    this.isProactiveRefreshEnabled = true;
    if (this.currentUser) {
      this._currentUser._startProactiveRefresh();
    }
  }
  _stopProactiveRefresh() {
    this.isProactiveRefreshEnabled = false;
    if (this.currentUser) {
      this._currentUser._stopProactiveRefresh();
    }
  }
  /** Returns the current user cast as the internal type */
  get _currentUser() {
    return this.currentUser;
  }
  notifyAuthListeners() {
    var _a, _b;
    if (!this._isInitialized) {
      return;
    }
    this.idTokenSubscription.next(this.currentUser);
    const currentUid = (_b = (_a = this.currentUser) === null || _a === void 0 ? void 0 : _a.uid) !== null && _b !== void 0 ? _b : null;
    if (this.lastNotifiedUid !== currentUid) {
      this.lastNotifiedUid = currentUid;
      this.authStateSubscription.next(this.currentUser);
    }
  }
  registerStateListener(subscription, nextOrObserver, error, completed) {
    if (this._deleted) {
      return () => {
      };
    }
    const cb2 = typeof nextOrObserver === "function" ? nextOrObserver : nextOrObserver.next.bind(nextOrObserver);
    let isUnsubscribed = false;
    const promise = this._isInitialized ? Promise.resolve() : this._initializationPromise;
    _assert(
      promise,
      this,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    promise.then(() => {
      if (isUnsubscribed) {
        return;
      }
      cb2(this.currentUser);
    });
    if (typeof nextOrObserver === "function") {
      const unsubscribe = subscription.addObserver(nextOrObserver, error, completed);
      return () => {
        isUnsubscribed = true;
        unsubscribe();
      };
    } else {
      const unsubscribe = subscription.addObserver(nextOrObserver);
      return () => {
        isUnsubscribed = true;
        unsubscribe();
      };
    }
  }
  /**
   * Unprotected (from race conditions) method to set the current user. This
   * should only be called from within a queued callback. This is necessary
   * because the queue shouldn't rely on another queued callback.
   */
  directlySetCurrentUser(user3) {
    return __async(this, null, function* () {
      if (this.currentUser && this.currentUser !== user3) {
        this._currentUser._stopProactiveRefresh();
      }
      if (user3 && this.isProactiveRefreshEnabled) {
        user3._startProactiveRefresh();
      }
      this.currentUser = user3;
      if (user3) {
        yield this.assertedPersistence.setCurrentUser(user3);
      } else {
        yield this.assertedPersistence.removeCurrentUser();
      }
    });
  }
  queue(action) {
    this.operations = this.operations.then(action, action);
    return this.operations;
  }
  get assertedPersistence() {
    _assert(
      this.persistenceManager,
      this,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return this.persistenceManager;
  }
  _logFramework(framework) {
    if (!framework || this.frameworks.includes(framework)) {
      return;
    }
    this.frameworks.push(framework);
    this.frameworks.sort();
    this.clientVersion = _getClientVersion(this.config.clientPlatform, this._getFrameworks());
  }
  _getFrameworks() {
    return this.frameworks;
  }
  _getAdditionalHeaders() {
    return __async(this, null, function* () {
      var _a;
      const headers = {
        [
          "X-Client-Version"
          /* HttpHeader.X_CLIENT_VERSION */
        ]: this.clientVersion
      };
      if (this.app.options.appId) {
        headers[
          "X-Firebase-gmpid"
          /* HttpHeader.X_FIREBASE_GMPID */
        ] = this.app.options.appId;
      }
      const heartbeatsHeader = yield (_a = this.heartbeatServiceProvider.getImmediate({
        optional: true
      })) === null || _a === void 0 ? void 0 : _a.getHeartbeatsHeader();
      if (heartbeatsHeader) {
        headers[
          "X-Firebase-Client"
          /* HttpHeader.X_FIREBASE_CLIENT */
        ] = heartbeatsHeader;
      }
      const appCheckToken = yield this._getAppCheckToken();
      if (appCheckToken) {
        headers[
          "X-Firebase-AppCheck"
          /* HttpHeader.X_FIREBASE_APP_CHECK */
        ] = appCheckToken;
      }
      return headers;
    });
  }
  _getAppCheckToken() {
    return __async(this, null, function* () {
      var _a;
      const appCheckTokenResult = yield (_a = this.appCheckServiceProvider.getImmediate({ optional: true })) === null || _a === void 0 ? void 0 : _a.getToken();
      if (appCheckTokenResult === null || appCheckTokenResult === void 0 ? void 0 : appCheckTokenResult.error) {
        _logWarn(`Error while retrieving App Check token: ${appCheckTokenResult.error}`);
      }
      return appCheckTokenResult === null || appCheckTokenResult === void 0 ? void 0 : appCheckTokenResult.token;
    });
  }
};
function _castAuth(auth) {
  return getModularInstance(auth);
}
var Subscription = class {
  constructor(auth) {
    this.auth = auth;
    this.observer = null;
    this.addObserver = createSubscribe((observer) => this.observer = observer);
  }
  get next() {
    _assert(
      this.observer,
      this.auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return this.observer.next.bind(this.observer);
  }
};
function getScriptParentElement() {
  var _a, _b;
  return (_b = (_a = document.getElementsByTagName("head")) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : document;
}
function _loadJS(url) {
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.setAttribute("src", url);
    el.onload = resolve;
    el.onerror = (e) => {
      const error = _createError(
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      error.customData = e;
      reject(error);
    };
    el.type = "text/javascript";
    el.charset = "UTF-8";
    getScriptParentElement().appendChild(el);
  });
}
function _generateCallbackName(prefix) {
  return `__${prefix}${Math.floor(Math.random() * 1e6)}`;
}
var RECAPTCHA_ENTERPRISE_URL = "https://www.google.com/recaptcha/enterprise.js?render=";
var RECAPTCHA_ENTERPRISE_VERIFIER_TYPE = "recaptcha-enterprise";
var FAKE_TOKEN = "NO_RECAPTCHA";
var RecaptchaEnterpriseVerifier = class {
  /**
   *
   * @param authExtern - The corresponding Firebase {@link Auth} instance.
   *
   */
  constructor(authExtern) {
    this.type = RECAPTCHA_ENTERPRISE_VERIFIER_TYPE;
    this.auth = _castAuth(authExtern);
  }
  /**
   * Executes the verification process.
   *
   * @returns A Promise for a token that can be used to assert the validity of a request.
   */
  verify(action = "verify", forceRefresh = false) {
    return __async(this, null, function* () {
      function retrieveSiteKey(auth) {
        return __async(this, null, function* () {
          if (!forceRefresh) {
            if (auth.tenantId == null && auth._agentRecaptchaConfig != null) {
              return auth._agentRecaptchaConfig.siteKey;
            }
            if (auth.tenantId != null && auth._tenantRecaptchaConfigs[auth.tenantId] !== void 0) {
              return auth._tenantRecaptchaConfigs[auth.tenantId].siteKey;
            }
          }
          return new Promise((resolve, reject) => __async(this, null, function* () {
            getRecaptchaConfig(auth, {
              clientType: "CLIENT_TYPE_WEB",
              version: "RECAPTCHA_ENTERPRISE"
              /* RecaptchaVersion.ENTERPRISE */
            }).then((response) => {
              if (response.recaptchaKey === void 0) {
                reject(new Error("recaptcha Enterprise site key undefined"));
              } else {
                const config = new RecaptchaConfig(response);
                if (auth.tenantId == null) {
                  auth._agentRecaptchaConfig = config;
                } else {
                  auth._tenantRecaptchaConfigs[auth.tenantId] = config;
                }
                return resolve(config.siteKey);
              }
            }).catch((error) => {
              reject(error);
            });
          }));
        });
      }
      function retrieveRecaptchaToken(siteKey, resolve, reject) {
        const grecaptcha = window.grecaptcha;
        if (isEnterprise(grecaptcha)) {
          grecaptcha.enterprise.ready(() => {
            grecaptcha.enterprise.execute(siteKey, { action }).then((token) => {
              resolve(token);
            }).catch(() => {
              resolve(FAKE_TOKEN);
            });
          });
        } else {
          reject(Error("No reCAPTCHA enterprise script loaded."));
        }
      }
      return new Promise((resolve, reject) => {
        retrieveSiteKey(this.auth).then((siteKey) => {
          if (!forceRefresh && isEnterprise(window.grecaptcha)) {
            retrieveRecaptchaToken(siteKey, resolve, reject);
          } else {
            if (typeof window === "undefined") {
              reject(new Error("RecaptchaVerifier is only supported in browser"));
              return;
            }
            _loadJS(RECAPTCHA_ENTERPRISE_URL + siteKey).then(() => {
              retrieveRecaptchaToken(siteKey, resolve, reject);
            }).catch((error) => {
              reject(error);
            });
          }
        }).catch((error) => {
          reject(error);
        });
      });
    });
  }
};
function injectRecaptchaFields(auth, request, action, captchaResp = false) {
  return __async(this, null, function* () {
    const verifier = new RecaptchaEnterpriseVerifier(auth);
    let captchaResponse;
    try {
      captchaResponse = yield verifier.verify(action);
    } catch (error) {
      captchaResponse = yield verifier.verify(action, true);
    }
    const newRequest = Object.assign({}, request);
    if (!captchaResp) {
      Object.assign(newRequest, { captchaResponse });
    } else {
      Object.assign(newRequest, { "captchaResp": captchaResponse });
    }
    Object.assign(newRequest, {
      "clientType": "CLIENT_TYPE_WEB"
      /* RecaptchaClientType.WEB */
    });
    Object.assign(newRequest, {
      "recaptchaVersion": "RECAPTCHA_ENTERPRISE"
      /* RecaptchaVersion.ENTERPRISE */
    });
    return newRequest;
  });
}
function handleRecaptchaFlow(authInstance, request, actionName, actionMethod) {
  return __async(this, null, function* () {
    var _a;
    if ((_a = authInstance._getRecaptchaConfig()) === null || _a === void 0 ? void 0 : _a.isProviderEnabled(
      "EMAIL_PASSWORD_PROVIDER"
      /* RecaptchaProvider.EMAIL_PASSWORD_PROVIDER */
    )) {
      const requestWithRecaptcha = yield injectRecaptchaFields(
        authInstance,
        request,
        actionName,
        actionName === "getOobCode"
        /* RecaptchaActionName.GET_OOB_CODE */
      );
      return actionMethod(authInstance, requestWithRecaptcha);
    } else {
      return actionMethod(authInstance, request).catch((error) => __async(this, null, function* () {
        if (error.code === `auth/${"missing-recaptcha-token"}`) {
          console.log(`${actionName} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);
          const requestWithRecaptcha = yield injectRecaptchaFields(
            authInstance,
            request,
            actionName,
            actionName === "getOobCode"
            /* RecaptchaActionName.GET_OOB_CODE */
          );
          return actionMethod(authInstance, requestWithRecaptcha);
        } else {
          return Promise.reject(error);
        }
      }));
    }
  });
}
function _initializeRecaptchaConfig(auth) {
  return __async(this, null, function* () {
    const authInternal = _castAuth(auth);
    const response = yield getRecaptchaConfig(authInternal, {
      clientType: "CLIENT_TYPE_WEB",
      version: "RECAPTCHA_ENTERPRISE"
      /* RecaptchaVersion.ENTERPRISE */
    });
    const config = new RecaptchaConfig(response);
    if (authInternal.tenantId == null) {
      authInternal._agentRecaptchaConfig = config;
    } else {
      authInternal._tenantRecaptchaConfigs[authInternal.tenantId] = config;
    }
    if (config.isProviderEnabled(
      "EMAIL_PASSWORD_PROVIDER"
      /* RecaptchaProvider.EMAIL_PASSWORD_PROVIDER */
    )) {
      const verifier = new RecaptchaEnterpriseVerifier(authInternal);
      void verifier.verify();
    }
  });
}
function initializeAuth(app, deps) {
  const provider = _getProvider(app, "auth");
  if (provider.isInitialized()) {
    const auth2 = provider.getImmediate();
    const initialOptions = provider.getOptions();
    if (deepEqual(initialOptions, deps !== null && deps !== void 0 ? deps : {})) {
      return auth2;
    } else {
      _fail(
        auth2,
        "already-initialized"
        /* AuthErrorCode.ALREADY_INITIALIZED */
      );
    }
  }
  const auth = provider.initialize({ options: deps });
  return auth;
}
function _initializeAuthInstance(auth, deps) {
  const persistence = (deps === null || deps === void 0 ? void 0 : deps.persistence) || [];
  const hierarchy = (Array.isArray(persistence) ? persistence : [persistence]).map(_getInstance);
  if (deps === null || deps === void 0 ? void 0 : deps.errorMap) {
    auth._updateErrorMap(deps.errorMap);
  }
  auth._initializeWithPersistence(hierarchy, deps === null || deps === void 0 ? void 0 : deps.popupRedirectResolver);
}
function connectAuthEmulator(auth, url, options) {
  const authInternal = _castAuth(auth);
  _assert(
    authInternal._canInitEmulator,
    authInternal,
    "emulator-config-failed"
    /* AuthErrorCode.EMULATOR_CONFIG_FAILED */
  );
  _assert(
    /^https?:\/\//.test(url),
    authInternal,
    "invalid-emulator-scheme"
    /* AuthErrorCode.INVALID_EMULATOR_SCHEME */
  );
  const disableWarnings = !!(options === null || options === void 0 ? void 0 : options.disableWarnings);
  const protocol = extractProtocol(url);
  const { host, port } = extractHostAndPort(url);
  const portStr = port === null ? "" : `:${port}`;
  authInternal.config.emulator = { url: `${protocol}//${host}${portStr}/` };
  authInternal.settings.appVerificationDisabledForTesting = true;
  authInternal.emulatorConfig = Object.freeze({
    host,
    port,
    protocol: protocol.replace(":", ""),
    options: Object.freeze({ disableWarnings })
  });
  if (!disableWarnings) {
    emitEmulatorWarning();
  }
}
function extractProtocol(url) {
  const protocolEnd = url.indexOf(":");
  return protocolEnd < 0 ? "" : url.substr(0, protocolEnd + 1);
}
function extractHostAndPort(url) {
  const protocol = extractProtocol(url);
  const authority = /(\/\/)?([^?#/]+)/.exec(url.substr(protocol.length));
  if (!authority) {
    return { host: "", port: null };
  }
  const hostAndPort = authority[2].split("@").pop() || "";
  const bracketedIPv6 = /^(\[[^\]]+\])(:|$)/.exec(hostAndPort);
  if (bracketedIPv6) {
    const host = bracketedIPv6[1];
    return { host, port: parsePort(hostAndPort.substr(host.length + 1)) };
  } else {
    const [host, port] = hostAndPort.split(":");
    return { host, port: parsePort(port) };
  }
}
function parsePort(portStr) {
  if (!portStr) {
    return null;
  }
  const port = Number(portStr);
  if (isNaN(port)) {
    return null;
  }
  return port;
}
function emitEmulatorWarning() {
  function attachBanner() {
    const el = document.createElement("p");
    const sty = el.style;
    el.innerText = "Running in emulator mode. Do not use with production credentials.";
    sty.position = "fixed";
    sty.width = "100%";
    sty.backgroundColor = "#ffffff";
    sty.border = ".1em solid #000000";
    sty.color = "#b50000";
    sty.bottom = "0px";
    sty.left = "0px";
    sty.margin = "0px";
    sty.zIndex = "10000";
    sty.textAlign = "center";
    el.classList.add("firebase-emulator-warning");
    document.body.appendChild(el);
  }
  if (typeof console !== "undefined" && typeof console.info === "function") {
    console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials.");
  }
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    if (document.readyState === "loading") {
      window.addEventListener("DOMContentLoaded", attachBanner);
    } else {
      attachBanner();
    }
  }
}
var AuthCredential = class {
  /** @internal */
  constructor(providerId, signInMethod) {
    this.providerId = providerId;
    this.signInMethod = signInMethod;
  }
  /**
   * Returns a JSON-serializable representation of this object.
   *
   * @returns a JSON-serializable representation of this object.
   */
  toJSON() {
    return debugFail("not implemented");
  }
  /** @internal */
  _getIdTokenResponse(_auth) {
    return debugFail("not implemented");
  }
  /** @internal */
  _linkToIdToken(_auth, _idToken) {
    return debugFail("not implemented");
  }
  /** @internal */
  _getReauthenticationResolver(_auth) {
    return debugFail("not implemented");
  }
};
function resetPassword(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:resetPassword", _addTidIfNecessary(auth, request));
  });
}
function updateEmailPassword(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:update", request);
  });
}
function linkEmailPassword(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:signUp", request);
  });
}
function applyActionCode$1(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:update", _addTidIfNecessary(auth, request));
  });
}
function signInWithPassword(auth, request) {
  return __async(this, null, function* () {
    return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPassword", _addTidIfNecessary(auth, request));
  });
}
function sendOobCode(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:sendOobCode", _addTidIfNecessary(auth, request));
  });
}
function sendEmailVerification$1(auth, request) {
  return __async(this, null, function* () {
    return sendOobCode(auth, request);
  });
}
function sendPasswordResetEmail$1(auth, request) {
  return __async(this, null, function* () {
    return sendOobCode(auth, request);
  });
}
function sendSignInLinkToEmail$1(auth, request) {
  return __async(this, null, function* () {
    return sendOobCode(auth, request);
  });
}
function verifyAndChangeEmail(auth, request) {
  return __async(this, null, function* () {
    return sendOobCode(auth, request);
  });
}
function signInWithEmailLink$1(auth, request) {
  return __async(this, null, function* () {
    return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth, request));
  });
}
function signInWithEmailLinkForLinking(auth, request) {
  return __async(this, null, function* () {
    return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithEmailLink", _addTidIfNecessary(auth, request));
  });
}
var EmailAuthCredential = class _EmailAuthCredential extends AuthCredential {
  /** @internal */
  constructor(_email, _password, signInMethod, _tenantId = null) {
    super("password", signInMethod);
    this._email = _email;
    this._password = _password;
    this._tenantId = _tenantId;
  }
  /** @internal */
  static _fromEmailAndPassword(email, password) {
    return new _EmailAuthCredential(
      email,
      password,
      "password"
      /* SignInMethod.EMAIL_PASSWORD */
    );
  }
  /** @internal */
  static _fromEmailAndCode(email, oobCode, tenantId = null) {
    return new _EmailAuthCredential(email, oobCode, "emailLink", tenantId);
  }
  /** {@inheritdoc AuthCredential.toJSON} */
  toJSON() {
    return {
      email: this._email,
      password: this._password,
      signInMethod: this.signInMethod,
      tenantId: this._tenantId
    };
  }
  /**
   * Static method to deserialize a JSON representation of an object into an {@link  AuthCredential}.
   *
   * @param json - Either `object` or the stringified representation of the object. When string is
   * provided, `JSON.parse` would be called first.
   *
   * @returns If the JSON input does not represent an {@link AuthCredential}, null is returned.
   */
  static fromJSON(json) {
    const obj = typeof json === "string" ? JSON.parse(json) : json;
    if ((obj === null || obj === void 0 ? void 0 : obj.email) && (obj === null || obj === void 0 ? void 0 : obj.password)) {
      if (obj.signInMethod === "password") {
        return this._fromEmailAndPassword(obj.email, obj.password);
      } else if (obj.signInMethod === "emailLink") {
        return this._fromEmailAndCode(obj.email, obj.password, obj.tenantId);
      }
    }
    return null;
  }
  /** @internal */
  _getIdTokenResponse(auth) {
    return __async(this, null, function* () {
      switch (this.signInMethod) {
        case "password":
          const request = {
            returnSecureToken: true,
            email: this._email,
            password: this._password,
            clientType: "CLIENT_TYPE_WEB"
            /* RecaptchaClientType.WEB */
          };
          return handleRecaptchaFlow(auth, request, "signInWithPassword", signInWithPassword);
        case "emailLink":
          return signInWithEmailLink$1(auth, {
            email: this._email,
            oobCode: this._password
          });
        default:
          _fail(
            auth,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
      }
    });
  }
  /** @internal */
  _linkToIdToken(auth, idToken3) {
    return __async(this, null, function* () {
      switch (this.signInMethod) {
        case "password":
          const request = {
            idToken: idToken3,
            returnSecureToken: true,
            email: this._email,
            password: this._password,
            clientType: "CLIENT_TYPE_WEB"
            /* RecaptchaClientType.WEB */
          };
          return handleRecaptchaFlow(auth, request, "signUpPassword", linkEmailPassword);
        case "emailLink":
          return signInWithEmailLinkForLinking(auth, {
            idToken: idToken3,
            email: this._email,
            oobCode: this._password
          });
        default:
          _fail(
            auth,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
      }
    });
  }
  /** @internal */
  _getReauthenticationResolver(auth) {
    return this._getIdTokenResponse(auth);
  }
};
function signInWithIdp(auth, request) {
  return __async(this, null, function* () {
    return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithIdp", _addTidIfNecessary(auth, request));
  });
}
var IDP_REQUEST_URI$1 = "http://localhost";
var OAuthCredential = class _OAuthCredential extends AuthCredential {
  constructor() {
    super(...arguments);
    this.pendingToken = null;
  }
  /** @internal */
  static _fromParams(params) {
    const cred = new _OAuthCredential(params.providerId, params.signInMethod);
    if (params.idToken || params.accessToken) {
      if (params.idToken) {
        cred.idToken = params.idToken;
      }
      if (params.accessToken) {
        cred.accessToken = params.accessToken;
      }
      if (params.nonce && !params.pendingToken) {
        cred.nonce = params.nonce;
      }
      if (params.pendingToken) {
        cred.pendingToken = params.pendingToken;
      }
    } else if (params.oauthToken && params.oauthTokenSecret) {
      cred.accessToken = params.oauthToken;
      cred.secret = params.oauthTokenSecret;
    } else {
      _fail(
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
    }
    return cred;
  }
  /** {@inheritdoc AuthCredential.toJSON}  */
  toJSON() {
    return {
      idToken: this.idToken,
      accessToken: this.accessToken,
      secret: this.secret,
      nonce: this.nonce,
      pendingToken: this.pendingToken,
      providerId: this.providerId,
      signInMethod: this.signInMethod
    };
  }
  /**
   * Static method to deserialize a JSON representation of an object into an
   * {@link  AuthCredential}.
   *
   * @param json - Input can be either Object or the stringified representation of the object.
   * When string is provided, JSON.parse would be called first.
   *
   * @returns If the JSON input does not represent an {@link  AuthCredential}, null is returned.
   */
  static fromJSON(json) {
    const obj = typeof json === "string" ? JSON.parse(json) : json;
    const { providerId, signInMethod } = obj, rest = __rest(obj, ["providerId", "signInMethod"]);
    if (!providerId || !signInMethod) {
      return null;
    }
    const cred = new _OAuthCredential(providerId, signInMethod);
    cred.idToken = rest.idToken || void 0;
    cred.accessToken = rest.accessToken || void 0;
    cred.secret = rest.secret;
    cred.nonce = rest.nonce;
    cred.pendingToken = rest.pendingToken || null;
    return cred;
  }
  /** @internal */
  _getIdTokenResponse(auth) {
    const request = this.buildRequest();
    return signInWithIdp(auth, request);
  }
  /** @internal */
  _linkToIdToken(auth, idToken3) {
    const request = this.buildRequest();
    request.idToken = idToken3;
    return signInWithIdp(auth, request);
  }
  /** @internal */
  _getReauthenticationResolver(auth) {
    const request = this.buildRequest();
    request.autoCreate = false;
    return signInWithIdp(auth, request);
  }
  buildRequest() {
    const request = {
      requestUri: IDP_REQUEST_URI$1,
      returnSecureToken: true
    };
    if (this.pendingToken) {
      request.pendingToken = this.pendingToken;
    } else {
      const postBody = {};
      if (this.idToken) {
        postBody["id_token"] = this.idToken;
      }
      if (this.accessToken) {
        postBody["access_token"] = this.accessToken;
      }
      if (this.secret) {
        postBody["oauth_token_secret"] = this.secret;
      }
      postBody["providerId"] = this.providerId;
      if (this.nonce && !this.pendingToken) {
        postBody["nonce"] = this.nonce;
      }
      request.postBody = querystring(postBody);
    }
    return request;
  }
};
function sendPhoneVerificationCode(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:sendVerificationCode", _addTidIfNecessary(auth, request));
  });
}
function signInWithPhoneNumber$1(auth, request) {
  return __async(this, null, function* () {
    return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth, request));
  });
}
function linkWithPhoneNumber$1(auth, request) {
  return __async(this, null, function* () {
    const response = yield _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth, request));
    if (response.temporaryProof) {
      throw _makeTaggedError(auth, "account-exists-with-different-credential", response);
    }
    return response;
  });
}
var VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_ = {
  [
    "USER_NOT_FOUND"
    /* ServerError.USER_NOT_FOUND */
  ]: "user-not-found"
  /* AuthErrorCode.USER_DELETED */
};
function verifyPhoneNumberForExisting(auth, request) {
  return __async(this, null, function* () {
    const apiRequest = Object.assign(Object.assign({}, request), { operation: "REAUTH" });
    return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithPhoneNumber", _addTidIfNecessary(auth, apiRequest), VERIFY_PHONE_NUMBER_FOR_EXISTING_ERROR_MAP_);
  });
}
var PhoneAuthCredential = class _PhoneAuthCredential extends AuthCredential {
  constructor(params) {
    super(
      "phone",
      "phone"
      /* SignInMethod.PHONE */
    );
    this.params = params;
  }
  /** @internal */
  static _fromVerification(verificationId, verificationCode) {
    return new _PhoneAuthCredential({ verificationId, verificationCode });
  }
  /** @internal */
  static _fromTokenResponse(phoneNumber, temporaryProof) {
    return new _PhoneAuthCredential({ phoneNumber, temporaryProof });
  }
  /** @internal */
  _getIdTokenResponse(auth) {
    return signInWithPhoneNumber$1(auth, this._makeVerificationRequest());
  }
  /** @internal */
  _linkToIdToken(auth, idToken3) {
    return linkWithPhoneNumber$1(auth, Object.assign({ idToken: idToken3 }, this._makeVerificationRequest()));
  }
  /** @internal */
  _getReauthenticationResolver(auth) {
    return verifyPhoneNumberForExisting(auth, this._makeVerificationRequest());
  }
  /** @internal */
  _makeVerificationRequest() {
    const { temporaryProof, phoneNumber, verificationId, verificationCode } = this.params;
    if (temporaryProof && phoneNumber) {
      return { temporaryProof, phoneNumber };
    }
    return {
      sessionInfo: verificationId,
      code: verificationCode
    };
  }
  /** {@inheritdoc AuthCredential.toJSON} */
  toJSON() {
    const obj = {
      providerId: this.providerId
    };
    if (this.params.phoneNumber) {
      obj.phoneNumber = this.params.phoneNumber;
    }
    if (this.params.temporaryProof) {
      obj.temporaryProof = this.params.temporaryProof;
    }
    if (this.params.verificationCode) {
      obj.verificationCode = this.params.verificationCode;
    }
    if (this.params.verificationId) {
      obj.verificationId = this.params.verificationId;
    }
    return obj;
  }
  /** Generates a phone credential based on a plain object or a JSON string. */
  static fromJSON(json) {
    if (typeof json === "string") {
      json = JSON.parse(json);
    }
    const { verificationId, verificationCode, phoneNumber, temporaryProof } = json;
    if (!verificationCode && !verificationId && !phoneNumber && !temporaryProof) {
      return null;
    }
    return new _PhoneAuthCredential({
      verificationId,
      verificationCode,
      phoneNumber,
      temporaryProof
    });
  }
};
function parseMode(mode) {
  switch (mode) {
    case "recoverEmail":
      return "RECOVER_EMAIL";
    case "resetPassword":
      return "PASSWORD_RESET";
    case "signIn":
      return "EMAIL_SIGNIN";
    case "verifyEmail":
      return "VERIFY_EMAIL";
    case "verifyAndChangeEmail":
      return "VERIFY_AND_CHANGE_EMAIL";
    case "revertSecondFactorAddition":
      return "REVERT_SECOND_FACTOR_ADDITION";
    default:
      return null;
  }
}
function parseDeepLink(url) {
  const link = querystringDecode(extractQuerystring(url))["link"];
  const doubleDeepLink = link ? querystringDecode(extractQuerystring(link))["deep_link_id"] : null;
  const iOSDeepLink = querystringDecode(extractQuerystring(url))["deep_link_id"];
  const iOSDoubleDeepLink = iOSDeepLink ? querystringDecode(extractQuerystring(iOSDeepLink))["link"] : null;
  return iOSDoubleDeepLink || iOSDeepLink || doubleDeepLink || link || url;
}
var ActionCodeURL = class _ActionCodeURL {
  /**
   * @param actionLink - The link from which to extract the URL.
   * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
   *
   * @internal
   */
  constructor(actionLink) {
    var _a, _b, _c, _d, _e2, _f;
    const searchParams = querystringDecode(extractQuerystring(actionLink));
    const apiKey = (_a = searchParams[
      "apiKey"
      /* QueryField.API_KEY */
    ]) !== null && _a !== void 0 ? _a : null;
    const code = (_b = searchParams[
      "oobCode"
      /* QueryField.CODE */
    ]) !== null && _b !== void 0 ? _b : null;
    const operation = parseMode((_c = searchParams[
      "mode"
      /* QueryField.MODE */
    ]) !== null && _c !== void 0 ? _c : null);
    _assert(
      apiKey && code && operation,
      "argument-error"
      /* AuthErrorCode.ARGUMENT_ERROR */
    );
    this.apiKey = apiKey;
    this.operation = operation;
    this.code = code;
    this.continueUrl = (_d = searchParams[
      "continueUrl"
      /* QueryField.CONTINUE_URL */
    ]) !== null && _d !== void 0 ? _d : null;
    this.languageCode = (_e2 = searchParams[
      "languageCode"
      /* QueryField.LANGUAGE_CODE */
    ]) !== null && _e2 !== void 0 ? _e2 : null;
    this.tenantId = (_f = searchParams[
      "tenantId"
      /* QueryField.TENANT_ID */
    ]) !== null && _f !== void 0 ? _f : null;
  }
  /**
   * Parses the email action link string and returns an {@link ActionCodeURL} if the link is valid,
   * otherwise returns null.
   *
   * @param link  - The email action link string.
   * @returns The {@link ActionCodeURL} object, or null if the link is invalid.
   *
   * @public
   */
  static parseLink(link) {
    const actionLink = parseDeepLink(link);
    try {
      return new _ActionCodeURL(actionLink);
    } catch (_a) {
      return null;
    }
  }
};
function parseActionCodeURL(link) {
  return ActionCodeURL.parseLink(link);
}
var EmailAuthProvider = class _EmailAuthProvider {
  constructor() {
    this.providerId = _EmailAuthProvider.PROVIDER_ID;
  }
  /**
   * Initialize an {@link AuthCredential} using an email and password.
   *
   * @example
   * ```javascript
   * const authCredential = EmailAuthProvider.credential(email, password);
   * const userCredential = await signInWithCredential(auth, authCredential);
   * ```
   *
   * @example
   * ```javascript
   * const userCredential = await signInWithEmailAndPassword(auth, email, password);
   * ```
   *
   * @param email - Email address.
   * @param password - User account password.
   * @returns The auth provider credential.
   */
  static credential(email, password) {
    return EmailAuthCredential._fromEmailAndPassword(email, password);
  }
  /**
   * Initialize an {@link AuthCredential} using an email and an email link after a sign in with
   * email link operation.
   *
   * @example
   * ```javascript
   * const authCredential = EmailAuthProvider.credentialWithLink(auth, email, emailLink);
   * const userCredential = await signInWithCredential(auth, authCredential);
   * ```
   *
   * @example
   * ```javascript
   * await sendSignInLinkToEmail(auth, email);
   * // Obtain emailLink from user.
   * const userCredential = await signInWithEmailLink(auth, email, emailLink);
   * ```
   *
   * @param auth - The {@link Auth} instance used to verify the link.
   * @param email - Email address.
   * @param emailLink - Sign-in email link.
   * @returns - The auth provider credential.
   */
  static credentialWithLink(email, emailLink) {
    const actionCodeUrl = ActionCodeURL.parseLink(emailLink);
    _assert(
      actionCodeUrl,
      "argument-error"
      /* AuthErrorCode.ARGUMENT_ERROR */
    );
    return EmailAuthCredential._fromEmailAndCode(email, actionCodeUrl.code, actionCodeUrl.tenantId);
  }
};
EmailAuthProvider.PROVIDER_ID = "password";
EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD = "password";
EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD = "emailLink";
var FederatedAuthProvider = class {
  /**
   * Constructor for generic OAuth providers.
   *
   * @param providerId - Provider for which credentials should be generated.
   */
  constructor(providerId) {
    this.providerId = providerId;
    this.defaultLanguageCode = null;
    this.customParameters = {};
  }
  /**
   * Set the language gode.
   *
   * @param languageCode - language code
   */
  setDefaultLanguage(languageCode) {
    this.defaultLanguageCode = languageCode;
  }
  /**
   * Sets the OAuth custom parameters to pass in an OAuth request for popup and redirect sign-in
   * operations.
   *
   * @remarks
   * For a detailed list, check the reserved required OAuth 2.0 parameters such as `client_id`,
   * `redirect_uri`, `scope`, `response_type`, and `state` are not allowed and will be ignored.
   *
   * @param customOAuthParameters - The custom OAuth parameters to pass in the OAuth request.
   */
  setCustomParameters(customOAuthParameters) {
    this.customParameters = customOAuthParameters;
    return this;
  }
  /**
   * Retrieve the current list of {@link CustomParameters}.
   */
  getCustomParameters() {
    return this.customParameters;
  }
};
var BaseOAuthProvider = class extends FederatedAuthProvider {
  constructor() {
    super(...arguments);
    this.scopes = [];
  }
  /**
   * Add an OAuth scope to the credential.
   *
   * @param scope - Provider OAuth scope to add.
   */
  addScope(scope) {
    if (!this.scopes.includes(scope)) {
      this.scopes.push(scope);
    }
    return this;
  }
  /**
   * Retrieve the current list of OAuth scopes.
   */
  getScopes() {
    return [...this.scopes];
  }
};
var FacebookAuthProvider = class _FacebookAuthProvider extends BaseOAuthProvider {
  constructor() {
    super(
      "facebook.com"
      /* ProviderId.FACEBOOK */
    );
  }
  /**
   * Creates a credential for Facebook.
   *
   * @example
   * ```javascript
   * // `event` from the Facebook auth.authResponseChange callback.
   * const credential = FacebookAuthProvider.credential(event.authResponse.accessToken);
   * const result = await signInWithCredential(credential);
   * ```
   *
   * @param accessToken - Facebook access token.
   */
  static credential(accessToken) {
    return OAuthCredential._fromParams({
      providerId: _FacebookAuthProvider.PROVIDER_ID,
      signInMethod: _FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD,
      accessToken
    });
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromResult(userCredential) {
    return _FacebookAuthProvider.credentialFromTaggedObject(userCredential);
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
   * thrown during a sign-in, link, or reauthenticate operation.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromError(error) {
    return _FacebookAuthProvider.credentialFromTaggedObject(error.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
    if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
      return null;
    }
    if (!tokenResponse.oauthAccessToken) {
      return null;
    }
    try {
      return _FacebookAuthProvider.credential(tokenResponse.oauthAccessToken);
    } catch (_a) {
      return null;
    }
  }
};
FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD = "facebook.com";
FacebookAuthProvider.PROVIDER_ID = "facebook.com";
var GoogleAuthProvider = class _GoogleAuthProvider extends BaseOAuthProvider {
  constructor() {
    super(
      "google.com"
      /* ProviderId.GOOGLE */
    );
    this.addScope("profile");
  }
  /**
   * Creates a credential for Google. At least one of ID token and access token is required.
   *
   * @example
   * ```javascript
   * // \`googleUser\` from the onsuccess Google Sign In callback.
   * const credential = GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
   * const result = await signInWithCredential(credential);
   * ```
   *
   * @param idToken - Google ID token.
   * @param accessToken - Google access token.
   */
  static credential(idToken3, accessToken) {
    return OAuthCredential._fromParams({
      providerId: _GoogleAuthProvider.PROVIDER_ID,
      signInMethod: _GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
      idToken: idToken3,
      accessToken
    });
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromResult(userCredential) {
    return _GoogleAuthProvider.credentialFromTaggedObject(userCredential);
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
   * thrown during a sign-in, link, or reauthenticate operation.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromError(error) {
    return _GoogleAuthProvider.credentialFromTaggedObject(error.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
    if (!tokenResponse) {
      return null;
    }
    const { oauthIdToken, oauthAccessToken } = tokenResponse;
    if (!oauthIdToken && !oauthAccessToken) {
      return null;
    }
    try {
      return _GoogleAuthProvider.credential(oauthIdToken, oauthAccessToken);
    } catch (_a) {
      return null;
    }
  }
};
GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD = "google.com";
GoogleAuthProvider.PROVIDER_ID = "google.com";
var GithubAuthProvider = class _GithubAuthProvider extends BaseOAuthProvider {
  constructor() {
    super(
      "github.com"
      /* ProviderId.GITHUB */
    );
  }
  /**
   * Creates a credential for Github.
   *
   * @param accessToken - Github access token.
   */
  static credential(accessToken) {
    return OAuthCredential._fromParams({
      providerId: _GithubAuthProvider.PROVIDER_ID,
      signInMethod: _GithubAuthProvider.GITHUB_SIGN_IN_METHOD,
      accessToken
    });
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromResult(userCredential) {
    return _GithubAuthProvider.credentialFromTaggedObject(userCredential);
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
   * thrown during a sign-in, link, or reauthenticate operation.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromError(error) {
    return _GithubAuthProvider.credentialFromTaggedObject(error.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
    if (!tokenResponse || !("oauthAccessToken" in tokenResponse)) {
      return null;
    }
    if (!tokenResponse.oauthAccessToken) {
      return null;
    }
    try {
      return _GithubAuthProvider.credential(tokenResponse.oauthAccessToken);
    } catch (_a) {
      return null;
    }
  }
};
GithubAuthProvider.GITHUB_SIGN_IN_METHOD = "github.com";
GithubAuthProvider.PROVIDER_ID = "github.com";
var TwitterAuthProvider = class _TwitterAuthProvider extends BaseOAuthProvider {
  constructor() {
    super(
      "twitter.com"
      /* ProviderId.TWITTER */
    );
  }
  /**
   * Creates a credential for Twitter.
   *
   * @param token - Twitter access token.
   * @param secret - Twitter secret.
   */
  static credential(token, secret) {
    return OAuthCredential._fromParams({
      providerId: _TwitterAuthProvider.PROVIDER_ID,
      signInMethod: _TwitterAuthProvider.TWITTER_SIGN_IN_METHOD,
      oauthToken: token,
      oauthTokenSecret: secret
    });
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromResult(userCredential) {
    return _TwitterAuthProvider.credentialFromTaggedObject(userCredential);
  }
  /**
   * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
   * thrown during a sign-in, link, or reauthenticate operation.
   *
   * @param userCredential - The user credential.
   */
  static credentialFromError(error) {
    return _TwitterAuthProvider.credentialFromTaggedObject(error.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
    if (!tokenResponse) {
      return null;
    }
    const { oauthAccessToken, oauthTokenSecret } = tokenResponse;
    if (!oauthAccessToken || !oauthTokenSecret) {
      return null;
    }
    try {
      return _TwitterAuthProvider.credential(oauthAccessToken, oauthTokenSecret);
    } catch (_a) {
      return null;
    }
  }
};
TwitterAuthProvider.TWITTER_SIGN_IN_METHOD = "twitter.com";
TwitterAuthProvider.PROVIDER_ID = "twitter.com";
function signUp(auth, request) {
  return __async(this, null, function* () {
    return _performSignInRequest(auth, "POST", "/v1/accounts:signUp", _addTidIfNecessary(auth, request));
  });
}
var UserCredentialImpl = class _UserCredentialImpl {
  constructor(params) {
    this.user = params.user;
    this.providerId = params.providerId;
    this._tokenResponse = params._tokenResponse;
    this.operationType = params.operationType;
  }
  static _fromIdTokenResponse(auth, operationType, idTokenResponse, isAnonymous = false) {
    return __async(this, null, function* () {
      const user3 = yield UserImpl._fromIdTokenResponse(auth, idTokenResponse, isAnonymous);
      const providerId = providerIdForResponse(idTokenResponse);
      const userCred = new _UserCredentialImpl({
        user: user3,
        providerId,
        _tokenResponse: idTokenResponse,
        operationType
      });
      return userCred;
    });
  }
  static _forOperation(user3, operationType, response) {
    return __async(this, null, function* () {
      yield user3._updateTokensIfNecessary(
        response,
        /* reload */
        true
      );
      const providerId = providerIdForResponse(response);
      return new _UserCredentialImpl({
        user: user3,
        providerId,
        _tokenResponse: response,
        operationType
      });
    });
  }
};
function providerIdForResponse(response) {
  if (response.providerId) {
    return response.providerId;
  }
  if ("phoneNumber" in response) {
    return "phone";
  }
  return null;
}
function signInAnonymously(auth) {
  return __async(this, null, function* () {
    var _a;
    const authInternal = _castAuth(auth);
    yield authInternal._initializationPromise;
    if ((_a = authInternal.currentUser) === null || _a === void 0 ? void 0 : _a.isAnonymous) {
      return new UserCredentialImpl({
        user: authInternal.currentUser,
        providerId: null,
        operationType: "signIn"
        /* OperationType.SIGN_IN */
      });
    }
    const response = yield signUp(authInternal, {
      returnSecureToken: true
    });
    const userCredential = yield UserCredentialImpl._fromIdTokenResponse(authInternal, "signIn", response, true);
    yield authInternal._updateCurrentUser(userCredential.user);
    return userCredential;
  });
}
var MultiFactorError = class _MultiFactorError extends FirebaseError {
  constructor(auth, error, operationType, user3) {
    var _a;
    super(error.code, error.message);
    this.operationType = operationType;
    this.user = user3;
    Object.setPrototypeOf(this, _MultiFactorError.prototype);
    this.customData = {
      appName: auth.name,
      tenantId: (_a = auth.tenantId) !== null && _a !== void 0 ? _a : void 0,
      _serverResponse: error.customData._serverResponse,
      operationType
    };
  }
  static _fromErrorAndOperation(auth, error, operationType, user3) {
    return new _MultiFactorError(auth, error, operationType, user3);
  }
};
function _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential, user3) {
  const idTokenProvider = operationType === "reauthenticate" ? credential._getReauthenticationResolver(auth) : credential._getIdTokenResponse(auth);
  return idTokenProvider.catch((error) => {
    if (error.code === `auth/${"multi-factor-auth-required"}`) {
      throw MultiFactorError._fromErrorAndOperation(auth, error, operationType, user3);
    }
    throw error;
  });
}
function providerDataAsNames(providerData) {
  return new Set(providerData.map(({ providerId }) => providerId).filter((pid) => !!pid));
}
function unlink(user3, providerId) {
  return __async(this, null, function* () {
    const userInternal = getModularInstance(user3);
    yield _assertLinkedStatus(true, userInternal, providerId);
    const { providerUserInfo } = yield deleteLinkedAccounts(userInternal.auth, {
      idToken: yield userInternal.getIdToken(),
      deleteProvider: [providerId]
    });
    const providersLeft = providerDataAsNames(providerUserInfo || []);
    userInternal.providerData = userInternal.providerData.filter((pd2) => providersLeft.has(pd2.providerId));
    if (!providersLeft.has(
      "phone"
      /* ProviderId.PHONE */
    )) {
      userInternal.phoneNumber = null;
    }
    yield userInternal.auth._persistUserIfCurrent(userInternal);
    return userInternal;
  });
}
function _link$1(user3, credential, bypassAuthState = false) {
  return __async(this, null, function* () {
    const response = yield _logoutIfInvalidated(user3, credential._linkToIdToken(user3.auth, yield user3.getIdToken()), bypassAuthState);
    return UserCredentialImpl._forOperation(user3, "link", response);
  });
}
function _assertLinkedStatus(expected, user3, provider) {
  return __async(this, null, function* () {
    yield _reloadWithoutSaving(user3);
    const providerIds = providerDataAsNames(user3.providerData);
    const code = expected === false ? "provider-already-linked" : "no-such-provider";
    _assert(providerIds.has(provider) === expected, user3.auth, code);
  });
}
function _reauthenticate(user3, credential, bypassAuthState = false) {
  return __async(this, null, function* () {
    const { auth } = user3;
    const operationType = "reauthenticate";
    try {
      const response = yield _logoutIfInvalidated(user3, _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential, user3), bypassAuthState);
      _assert(
        response.idToken,
        auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const parsed = _parseToken(response.idToken);
      _assert(
        parsed,
        auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const { sub: localId } = parsed;
      _assert(
        user3.uid === localId,
        auth,
        "user-mismatch"
        /* AuthErrorCode.USER_MISMATCH */
      );
      return UserCredentialImpl._forOperation(user3, operationType, response);
    } catch (e) {
      if ((e === null || e === void 0 ? void 0 : e.code) === `auth/${"user-not-found"}`) {
        _fail(
          auth,
          "user-mismatch"
          /* AuthErrorCode.USER_MISMATCH */
        );
      }
      throw e;
    }
  });
}
function _signInWithCredential(auth, credential, bypassAuthState = false) {
  return __async(this, null, function* () {
    const operationType = "signIn";
    const response = yield _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential);
    const userCredential = yield UserCredentialImpl._fromIdTokenResponse(auth, operationType, response);
    if (!bypassAuthState) {
      yield auth._updateCurrentUser(userCredential.user);
    }
    return userCredential;
  });
}
function signInWithCredential(auth, credential) {
  return __async(this, null, function* () {
    return _signInWithCredential(_castAuth(auth), credential);
  });
}
function linkWithCredential(user3, credential) {
  return __async(this, null, function* () {
    const userInternal = getModularInstance(user3);
    yield _assertLinkedStatus(false, userInternal, credential.providerId);
    return _link$1(userInternal, credential);
  });
}
function reauthenticateWithCredential(user3, credential) {
  return __async(this, null, function* () {
    return _reauthenticate(getModularInstance(user3), credential);
  });
}
function signInWithCustomToken$1(auth, request) {
  return __async(this, null, function* () {
    return _performSignInRequest(auth, "POST", "/v1/accounts:signInWithCustomToken", _addTidIfNecessary(auth, request));
  });
}
function signInWithCustomToken(auth, customToken) {
  return __async(this, null, function* () {
    const authInternal = _castAuth(auth);
    const response = yield signInWithCustomToken$1(authInternal, {
      token: customToken,
      returnSecureToken: true
    });
    const cred = yield UserCredentialImpl._fromIdTokenResponse(authInternal, "signIn", response);
    yield authInternal._updateCurrentUser(cred.user);
    return cred;
  });
}
var MultiFactorInfoImpl = class {
  constructor(factorId, response) {
    this.factorId = factorId;
    this.uid = response.mfaEnrollmentId;
    this.enrollmentTime = new Date(response.enrolledAt).toUTCString();
    this.displayName = response.displayName;
  }
  static _fromServerResponse(auth, enrollment) {
    if ("phoneInfo" in enrollment) {
      return PhoneMultiFactorInfoImpl._fromServerResponse(auth, enrollment);
    } else if ("totpInfo" in enrollment) {
      return TotpMultiFactorInfoImpl._fromServerResponse(auth, enrollment);
    }
    return _fail(
      auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
  }
};
var PhoneMultiFactorInfoImpl = class _PhoneMultiFactorInfoImpl extends MultiFactorInfoImpl {
  constructor(response) {
    super("phone", response);
    this.phoneNumber = response.phoneInfo;
  }
  static _fromServerResponse(_auth, enrollment) {
    return new _PhoneMultiFactorInfoImpl(enrollment);
  }
};
var TotpMultiFactorInfoImpl = class _TotpMultiFactorInfoImpl extends MultiFactorInfoImpl {
  constructor(response) {
    super("totp", response);
  }
  static _fromServerResponse(_auth, enrollment) {
    return new _TotpMultiFactorInfoImpl(enrollment);
  }
};
function _setActionCodeSettingsOnRequest(auth, request, actionCodeSettings) {
  var _a;
  _assert(
    ((_a = actionCodeSettings.url) === null || _a === void 0 ? void 0 : _a.length) > 0,
    auth,
    "invalid-continue-uri"
    /* AuthErrorCode.INVALID_CONTINUE_URI */
  );
  _assert(
    typeof actionCodeSettings.dynamicLinkDomain === "undefined" || actionCodeSettings.dynamicLinkDomain.length > 0,
    auth,
    "invalid-dynamic-link-domain"
    /* AuthErrorCode.INVALID_DYNAMIC_LINK_DOMAIN */
  );
  request.continueUrl = actionCodeSettings.url;
  request.dynamicLinkDomain = actionCodeSettings.dynamicLinkDomain;
  request.canHandleCodeInApp = actionCodeSettings.handleCodeInApp;
  if (actionCodeSettings.iOS) {
    _assert(
      actionCodeSettings.iOS.bundleId.length > 0,
      auth,
      "missing-ios-bundle-id"
      /* AuthErrorCode.MISSING_IOS_BUNDLE_ID */
    );
    request.iOSBundleId = actionCodeSettings.iOS.bundleId;
  }
  if (actionCodeSettings.android) {
    _assert(
      actionCodeSettings.android.packageName.length > 0,
      auth,
      "missing-android-pkg-name"
      /* AuthErrorCode.MISSING_ANDROID_PACKAGE_NAME */
    );
    request.androidInstallApp = actionCodeSettings.android.installApp;
    request.androidMinimumVersionCode = actionCodeSettings.android.minimumVersion;
    request.androidPackageName = actionCodeSettings.android.packageName;
  }
}
function recachePasswordPolicy(auth) {
  return __async(this, null, function* () {
    const authInternal = _castAuth(auth);
    if (authInternal._getPasswordPolicyInternal()) {
      yield authInternal._updatePasswordPolicy();
    }
  });
}
function sendPasswordResetEmail(auth, email, actionCodeSettings) {
  return __async(this, null, function* () {
    const authInternal = _castAuth(auth);
    const request = {
      requestType: "PASSWORD_RESET",
      email,
      clientType: "CLIENT_TYPE_WEB"
      /* RecaptchaClientType.WEB */
    };
    if (actionCodeSettings) {
      _setActionCodeSettingsOnRequest(authInternal, request, actionCodeSettings);
    }
    yield handleRecaptchaFlow(authInternal, request, "getOobCode", sendPasswordResetEmail$1);
  });
}
function confirmPasswordReset(auth, oobCode, newPassword) {
  return __async(this, null, function* () {
    yield resetPassword(getModularInstance(auth), {
      oobCode,
      newPassword
    }).catch((error) => __async(this, null, function* () {
      if (error.code === `auth/${"password-does-not-meet-requirements"}`) {
        void recachePasswordPolicy(auth);
      }
      throw error;
    }));
  });
}
function applyActionCode(auth, oobCode) {
  return __async(this, null, function* () {
    yield applyActionCode$1(getModularInstance(auth), { oobCode });
  });
}
function checkActionCode(auth, oobCode) {
  return __async(this, null, function* () {
    const authModular = getModularInstance(auth);
    const response = yield resetPassword(authModular, { oobCode });
    const operation = response.requestType;
    _assert(
      operation,
      authModular,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    switch (operation) {
      case "EMAIL_SIGNIN":
        break;
      case "VERIFY_AND_CHANGE_EMAIL":
        _assert(
          response.newEmail,
          authModular,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
        break;
      case "REVERT_SECOND_FACTOR_ADDITION":
        _assert(
          response.mfaInfo,
          authModular,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
      default:
        _assert(
          response.email,
          authModular,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
    }
    let multiFactorInfo = null;
    if (response.mfaInfo) {
      multiFactorInfo = MultiFactorInfoImpl._fromServerResponse(_castAuth(authModular), response.mfaInfo);
    }
    return {
      data: {
        email: (response.requestType === "VERIFY_AND_CHANGE_EMAIL" ? response.newEmail : response.email) || null,
        previousEmail: (response.requestType === "VERIFY_AND_CHANGE_EMAIL" ? response.email : response.newEmail) || null,
        multiFactorInfo
      },
      operation
    };
  });
}
function verifyPasswordResetCode(auth, code) {
  return __async(this, null, function* () {
    const { data } = yield checkActionCode(getModularInstance(auth), code);
    return data.email;
  });
}
function createUserWithEmailAndPassword(auth, email, password) {
  return __async(this, null, function* () {
    const authInternal = _castAuth(auth);
    const request = {
      returnSecureToken: true,
      email,
      password,
      clientType: "CLIENT_TYPE_WEB"
      /* RecaptchaClientType.WEB */
    };
    const signUpResponse = handleRecaptchaFlow(authInternal, request, "signUpPassword", signUp);
    const response = yield signUpResponse.catch((error) => {
      if (error.code === `auth/${"password-does-not-meet-requirements"}`) {
        void recachePasswordPolicy(auth);
      }
      throw error;
    });
    const userCredential = yield UserCredentialImpl._fromIdTokenResponse(authInternal, "signIn", response);
    yield authInternal._updateCurrentUser(userCredential.user);
    return userCredential;
  });
}
function signInWithEmailAndPassword(auth, email, password) {
  return signInWithCredential(getModularInstance(auth), EmailAuthProvider.credential(email, password)).catch((error) => __async(this, null, function* () {
    if (error.code === `auth/${"password-does-not-meet-requirements"}`) {
      void recachePasswordPolicy(auth);
    }
    throw error;
  }));
}
function sendSignInLinkToEmail(auth, email, actionCodeSettings) {
  return __async(this, null, function* () {
    const authInternal = _castAuth(auth);
    const request = {
      requestType: "EMAIL_SIGNIN",
      email,
      clientType: "CLIENT_TYPE_WEB"
      /* RecaptchaClientType.WEB */
    };
    function setActionCodeSettings(request2, actionCodeSettings2) {
      _assert(
        actionCodeSettings2.handleCodeInApp,
        authInternal,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      if (actionCodeSettings2) {
        _setActionCodeSettingsOnRequest(authInternal, request2, actionCodeSettings2);
      }
    }
    setActionCodeSettings(request, actionCodeSettings);
    yield handleRecaptchaFlow(authInternal, request, "getOobCode", sendSignInLinkToEmail$1);
  });
}
function isSignInWithEmailLink(auth, emailLink) {
  const actionCodeUrl = ActionCodeURL.parseLink(emailLink);
  return (actionCodeUrl === null || actionCodeUrl === void 0 ? void 0 : actionCodeUrl.operation) === "EMAIL_SIGNIN";
}
function signInWithEmailLink(auth, email, emailLink) {
  return __async(this, null, function* () {
    const authModular = getModularInstance(auth);
    const credential = EmailAuthProvider.credentialWithLink(email, emailLink || _getCurrentUrl());
    _assert(
      credential._tenantId === (authModular.tenantId || null),
      authModular,
      "tenant-id-mismatch"
      /* AuthErrorCode.TENANT_ID_MISMATCH */
    );
    return signInWithCredential(authModular, credential);
  });
}
function createAuthUri(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:createAuthUri", _addTidIfNecessary(auth, request));
  });
}
function fetchSignInMethodsForEmail(auth, email) {
  return __async(this, null, function* () {
    const continueUri = _isHttpOrHttps() ? _getCurrentUrl() : "http://localhost";
    const request = {
      identifier: email,
      continueUri
    };
    const { signinMethods } = yield createAuthUri(getModularInstance(auth), request);
    return signinMethods || [];
  });
}
function sendEmailVerification(user3, actionCodeSettings) {
  return __async(this, null, function* () {
    const userInternal = getModularInstance(user3);
    const idToken3 = yield user3.getIdToken();
    const request = {
      requestType: "VERIFY_EMAIL",
      idToken: idToken3
    };
    if (actionCodeSettings) {
      _setActionCodeSettingsOnRequest(userInternal.auth, request, actionCodeSettings);
    }
    const { email } = yield sendEmailVerification$1(userInternal.auth, request);
    if (email !== user3.email) {
      yield user3.reload();
    }
  });
}
function verifyBeforeUpdateEmail(user3, newEmail, actionCodeSettings) {
  return __async(this, null, function* () {
    const userInternal = getModularInstance(user3);
    const idToken3 = yield user3.getIdToken();
    const request = {
      requestType: "VERIFY_AND_CHANGE_EMAIL",
      idToken: idToken3,
      newEmail
    };
    if (actionCodeSettings) {
      _setActionCodeSettingsOnRequest(userInternal.auth, request, actionCodeSettings);
    }
    const { email } = yield verifyAndChangeEmail(userInternal.auth, request);
    if (email !== user3.email) {
      yield user3.reload();
    }
  });
}
function updateProfile$1(auth, request) {
  return __async(this, null, function* () {
    return _performApiRequest(auth, "POST", "/v1/accounts:update", request);
  });
}
function updateProfile(_0, _1) {
  return __async(this, arguments, function* (user3, { displayName, photoURL: photoUrl }) {
    if (displayName === void 0 && photoUrl === void 0) {
      return;
    }
    const userInternal = getModularInstance(user3);
    const idToken3 = yield userInternal.getIdToken();
    const profileRequest = {
      idToken: idToken3,
      displayName,
      photoUrl,
      returnSecureToken: true
    };
    const response = yield _logoutIfInvalidated(userInternal, updateProfile$1(userInternal.auth, profileRequest));
    userInternal.displayName = response.displayName || null;
    userInternal.photoURL = response.photoUrl || null;
    const passwordProvider = userInternal.providerData.find(
      ({ providerId }) => providerId === "password"
      /* ProviderId.PASSWORD */
    );
    if (passwordProvider) {
      passwordProvider.displayName = userInternal.displayName;
      passwordProvider.photoURL = userInternal.photoURL;
    }
    yield userInternal._updateTokensIfNecessary(response);
  });
}
function updateEmail(user3, newEmail) {
  return updateEmailOrPassword(getModularInstance(user3), newEmail, null);
}
function updatePassword(user3, newPassword) {
  return updateEmailOrPassword(getModularInstance(user3), null, newPassword);
}
function updateEmailOrPassword(user3, email, password) {
  return __async(this, null, function* () {
    const { auth } = user3;
    const idToken3 = yield user3.getIdToken();
    const request = {
      idToken: idToken3,
      returnSecureToken: true
    };
    if (email) {
      request.email = email;
    }
    if (password) {
      request.password = password;
    }
    const response = yield _logoutIfInvalidated(user3, updateEmailPassword(auth, request));
    yield user3._updateTokensIfNecessary(
      response,
      /* reload */
      true
    );
  });
}
function _fromIdTokenResponse(idTokenResponse) {
  var _a, _b;
  if (!idTokenResponse) {
    return null;
  }
  const { providerId } = idTokenResponse;
  const profile = idTokenResponse.rawUserInfo ? JSON.parse(idTokenResponse.rawUserInfo) : {};
  const isNewUser = idTokenResponse.isNewUser || idTokenResponse.kind === "identitytoolkit#SignupNewUserResponse";
  if (!providerId && (idTokenResponse === null || idTokenResponse === void 0 ? void 0 : idTokenResponse.idToken)) {
    const signInProvider = (_b = (_a = _parseToken(idTokenResponse.idToken)) === null || _a === void 0 ? void 0 : _a.firebase) === null || _b === void 0 ? void 0 : _b["sign_in_provider"];
    if (signInProvider) {
      const filteredProviderId = signInProvider !== "anonymous" && signInProvider !== "custom" ? signInProvider : null;
      return new GenericAdditionalUserInfo(isNewUser, filteredProviderId);
    }
  }
  if (!providerId) {
    return null;
  }
  switch (providerId) {
    case "facebook.com":
      return new FacebookAdditionalUserInfo(isNewUser, profile);
    case "github.com":
      return new GithubAdditionalUserInfo(isNewUser, profile);
    case "google.com":
      return new GoogleAdditionalUserInfo(isNewUser, profile);
    case "twitter.com":
      return new TwitterAdditionalUserInfo(isNewUser, profile, idTokenResponse.screenName || null);
    case "custom":
    case "anonymous":
      return new GenericAdditionalUserInfo(isNewUser, null);
    default:
      return new GenericAdditionalUserInfo(isNewUser, providerId, profile);
  }
}
var GenericAdditionalUserInfo = class {
  constructor(isNewUser, providerId, profile = {}) {
    this.isNewUser = isNewUser;
    this.providerId = providerId;
    this.profile = profile;
  }
};
var FederatedAdditionalUserInfoWithUsername = class extends GenericAdditionalUserInfo {
  constructor(isNewUser, providerId, profile, username) {
    super(isNewUser, providerId, profile);
    this.username = username;
  }
};
var FacebookAdditionalUserInfo = class extends GenericAdditionalUserInfo {
  constructor(isNewUser, profile) {
    super(isNewUser, "facebook.com", profile);
  }
};
var GithubAdditionalUserInfo = class extends FederatedAdditionalUserInfoWithUsername {
  constructor(isNewUser, profile) {
    super(isNewUser, "github.com", profile, typeof (profile === null || profile === void 0 ? void 0 : profile.login) === "string" ? profile === null || profile === void 0 ? void 0 : profile.login : null);
  }
};
var GoogleAdditionalUserInfo = class extends GenericAdditionalUserInfo {
  constructor(isNewUser, profile) {
    super(isNewUser, "google.com", profile);
  }
};
var TwitterAdditionalUserInfo = class extends FederatedAdditionalUserInfoWithUsername {
  constructor(isNewUser, profile, screenName) {
    super(isNewUser, "twitter.com", profile, screenName);
  }
};
function getAdditionalUserInfo(userCredential) {
  const { user: user3, _tokenResponse } = userCredential;
  if (user3.isAnonymous && !_tokenResponse) {
    return {
      providerId: null,
      isNewUser: false,
      profile: null
    };
  }
  return _fromIdTokenResponse(_tokenResponse);
}
function setPersistence(auth, persistence) {
  return getModularInstance(auth).setPersistence(persistence);
}
function initializeRecaptchaConfig(auth) {
  return _initializeRecaptchaConfig(auth);
}
function validatePassword(auth, password) {
  return __async(this, null, function* () {
    const authInternal = _castAuth(auth);
    return authInternal.validatePassword(password);
  });
}
function onIdTokenChanged(auth, nextOrObserver, error, completed) {
  return getModularInstance(auth).onIdTokenChanged(nextOrObserver, error, completed);
}
function beforeAuthStateChanged(auth, callback, onAbort) {
  return getModularInstance(auth).beforeAuthStateChanged(callback, onAbort);
}
function onAuthStateChanged(auth, nextOrObserver, error, completed) {
  return getModularInstance(auth).onAuthStateChanged(nextOrObserver, error, completed);
}
function useDeviceLanguage(auth) {
  getModularInstance(auth).useDeviceLanguage();
}
function updateCurrentUser(auth, user3) {
  return getModularInstance(auth).updateCurrentUser(user3);
}
function signOut(auth) {
  return getModularInstance(auth).signOut();
}
function revokeAccessToken(auth, token) {
  const authInternal = _castAuth(auth);
  return authInternal.revokeAccessToken(token);
}
function deleteUser(user3) {
  return __async(this, null, function* () {
    return getModularInstance(user3).delete();
  });
}
var MultiFactorSessionImpl = class _MultiFactorSessionImpl {
  constructor(type, credential, user3) {
    this.type = type;
    this.credential = credential;
    this.user = user3;
  }
  static _fromIdtoken(idToken3, user3) {
    return new _MultiFactorSessionImpl("enroll", idToken3, user3);
  }
  static _fromMfaPendingCredential(mfaPendingCredential) {
    return new _MultiFactorSessionImpl("signin", mfaPendingCredential);
  }
  toJSON() {
    const key = this.type === "enroll" ? "idToken" : "pendingCredential";
    return {
      multiFactorSession: {
        [key]: this.credential
      }
    };
  }
  static fromJSON(obj) {
    var _a, _b;
    if (obj === null || obj === void 0 ? void 0 : obj.multiFactorSession) {
      if ((_a = obj.multiFactorSession) === null || _a === void 0 ? void 0 : _a.pendingCredential) {
        return _MultiFactorSessionImpl._fromMfaPendingCredential(obj.multiFactorSession.pendingCredential);
      } else if ((_b = obj.multiFactorSession) === null || _b === void 0 ? void 0 : _b.idToken) {
        return _MultiFactorSessionImpl._fromIdtoken(obj.multiFactorSession.idToken);
      }
    }
    return null;
  }
};
var MultiFactorResolverImpl = class _MultiFactorResolverImpl {
  constructor(session, hints, signInResolver) {
    this.session = session;
    this.hints = hints;
    this.signInResolver = signInResolver;
  }
  /** @internal */
  static _fromError(authExtern, error) {
    const auth = _castAuth(authExtern);
    const serverResponse = error.customData._serverResponse;
    const hints = (serverResponse.mfaInfo || []).map((enrollment) => MultiFactorInfoImpl._fromServerResponse(auth, enrollment));
    _assert(
      serverResponse.mfaPendingCredential,
      auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    const session = MultiFactorSessionImpl._fromMfaPendingCredential(serverResponse.mfaPendingCredential);
    return new _MultiFactorResolverImpl(session, hints, (assertion) => __async(this, null, function* () {
      const mfaResponse = yield assertion._process(auth, session);
      delete serverResponse.mfaInfo;
      delete serverResponse.mfaPendingCredential;
      const idTokenResponse = Object.assign(Object.assign({}, serverResponse), { idToken: mfaResponse.idToken, refreshToken: mfaResponse.refreshToken });
      switch (error.operationType) {
        case "signIn":
          const userCredential = yield UserCredentialImpl._fromIdTokenResponse(auth, error.operationType, idTokenResponse);
          yield auth._updateCurrentUser(userCredential.user);
          return userCredential;
        case "reauthenticate":
          _assert(
            error.user,
            auth,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          return UserCredentialImpl._forOperation(error.user, error.operationType, idTokenResponse);
        default:
          _fail(
            auth,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
      }
    }));
  }
  resolveSignIn(assertionExtern) {
    return __async(this, null, function* () {
      const assertion = assertionExtern;
      return this.signInResolver(assertion);
    });
  }
};
function getMultiFactorResolver(auth, error) {
  var _a;
  const authModular = getModularInstance(auth);
  const errorInternal = error;
  _assert(
    error.customData.operationType,
    authModular,
    "argument-error"
    /* AuthErrorCode.ARGUMENT_ERROR */
  );
  _assert(
    (_a = errorInternal.customData._serverResponse) === null || _a === void 0 ? void 0 : _a.mfaPendingCredential,
    authModular,
    "argument-error"
    /* AuthErrorCode.ARGUMENT_ERROR */
  );
  return MultiFactorResolverImpl._fromError(authModular, errorInternal);
}
function startEnrollPhoneMfa(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:start", _addTidIfNecessary(auth, request));
}
function finalizeEnrollPhoneMfa(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:finalize", _addTidIfNecessary(auth, request));
}
function startEnrollTotpMfa(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:start", _addTidIfNecessary(auth, request));
}
function finalizeEnrollTotpMfa(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:finalize", _addTidIfNecessary(auth, request));
}
function withdrawMfa(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaEnrollment:withdraw", _addTidIfNecessary(auth, request));
}
var MultiFactorUserImpl = class _MultiFactorUserImpl {
  constructor(user3) {
    this.user = user3;
    this.enrolledFactors = [];
    user3._onReload((userInfo) => {
      if (userInfo.mfaInfo) {
        this.enrolledFactors = userInfo.mfaInfo.map((enrollment) => MultiFactorInfoImpl._fromServerResponse(user3.auth, enrollment));
      }
    });
  }
  static _fromUser(user3) {
    return new _MultiFactorUserImpl(user3);
  }
  getSession() {
    return __async(this, null, function* () {
      return MultiFactorSessionImpl._fromIdtoken(yield this.user.getIdToken(), this.user);
    });
  }
  enroll(assertionExtern, displayName) {
    return __async(this, null, function* () {
      const assertion = assertionExtern;
      const session = yield this.getSession();
      const finalizeMfaResponse = yield _logoutIfInvalidated(this.user, assertion._process(this.user.auth, session, displayName));
      yield this.user._updateTokensIfNecessary(finalizeMfaResponse);
      return this.user.reload();
    });
  }
  unenroll(infoOrUid) {
    return __async(this, null, function* () {
      const mfaEnrollmentId = typeof infoOrUid === "string" ? infoOrUid : infoOrUid.uid;
      const idToken3 = yield this.user.getIdToken();
      try {
        const idTokenResponse = yield _logoutIfInvalidated(this.user, withdrawMfa(this.user.auth, {
          idToken: idToken3,
          mfaEnrollmentId
        }));
        this.enrolledFactors = this.enrolledFactors.filter(({ uid }) => uid !== mfaEnrollmentId);
        yield this.user._updateTokensIfNecessary(idTokenResponse);
        yield this.user.reload();
      } catch (e) {
        throw e;
      }
    });
  }
};
var multiFactorUserCache = /* @__PURE__ */ new WeakMap();
function multiFactor(user3) {
  const userModular = getModularInstance(user3);
  if (!multiFactorUserCache.has(userModular)) {
    multiFactorUserCache.set(userModular, MultiFactorUserImpl._fromUser(userModular));
  }
  return multiFactorUserCache.get(userModular);
}
var STORAGE_AVAILABLE_KEY = "__sak";
var BrowserPersistenceClass = class {
  constructor(storageRetriever, type) {
    this.storageRetriever = storageRetriever;
    this.type = type;
  }
  _isAvailable() {
    try {
      if (!this.storage) {
        return Promise.resolve(false);
      }
      this.storage.setItem(STORAGE_AVAILABLE_KEY, "1");
      this.storage.removeItem(STORAGE_AVAILABLE_KEY);
      return Promise.resolve(true);
    } catch (_a) {
      return Promise.resolve(false);
    }
  }
  _set(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
    return Promise.resolve();
  }
  _get(key) {
    const json = this.storage.getItem(key);
    return Promise.resolve(json ? JSON.parse(json) : null);
  }
  _remove(key) {
    this.storage.removeItem(key);
    return Promise.resolve();
  }
  get storage() {
    return this.storageRetriever();
  }
};
function _iframeCannotSyncWebStorage() {
  const ua2 = getUA();
  return _isSafari(ua2) || _isIOS(ua2);
}
var _POLLING_INTERVAL_MS$1 = 1e3;
var IE10_LOCAL_STORAGE_SYNC_DELAY = 10;
var BrowserLocalPersistence = class _BrowserLocalPersistence extends BrowserPersistenceClass {
  constructor() {
    super(
      () => window.localStorage,
      "LOCAL"
      /* PersistenceType.LOCAL */
    );
    this.boundEventHandler = (event, poll) => this.onStorageEvent(event, poll);
    this.listeners = {};
    this.localCache = {};
    this.pollTimer = null;
    this.safariLocalStorageNotSynced = _iframeCannotSyncWebStorage() && _isIframe();
    this.fallbackToPolling = _isMobileBrowser();
    this._shouldAllowMigration = true;
  }
  forAllChangedKeys(cb2) {
    for (const key of Object.keys(this.listeners)) {
      const newValue = this.storage.getItem(key);
      const oldValue = this.localCache[key];
      if (newValue !== oldValue) {
        cb2(key, oldValue, newValue);
      }
    }
  }
  onStorageEvent(event, poll = false) {
    if (!event.key) {
      this.forAllChangedKeys((key2, _oldValue, newValue) => {
        this.notifyListeners(key2, newValue);
      });
      return;
    }
    const key = event.key;
    if (poll) {
      this.detachListener();
    } else {
      this.stopPolling();
    }
    if (this.safariLocalStorageNotSynced) {
      const storedValue2 = this.storage.getItem(key);
      if (event.newValue !== storedValue2) {
        if (event.newValue !== null) {
          this.storage.setItem(key, event.newValue);
        } else {
          this.storage.removeItem(key);
        }
      } else if (this.localCache[key] === event.newValue && !poll) {
        return;
      }
    }
    const triggerListeners = () => {
      const storedValue2 = this.storage.getItem(key);
      if (!poll && this.localCache[key] === storedValue2) {
        return;
      }
      this.notifyListeners(key, storedValue2);
    };
    const storedValue = this.storage.getItem(key);
    if (_isIE10() && storedValue !== event.newValue && event.newValue !== event.oldValue) {
      setTimeout(triggerListeners, IE10_LOCAL_STORAGE_SYNC_DELAY);
    } else {
      triggerListeners();
    }
  }
  notifyListeners(key, value) {
    this.localCache[key] = value;
    const listeners = this.listeners[key];
    if (listeners) {
      for (const listener of Array.from(listeners)) {
        listener(value ? JSON.parse(value) : value);
      }
    }
  }
  startPolling() {
    this.stopPolling();
    this.pollTimer = setInterval(() => {
      this.forAllChangedKeys((key, oldValue, newValue) => {
        this.onStorageEvent(
          new StorageEvent("storage", {
            key,
            oldValue,
            newValue
          }),
          /* poll */
          true
        );
      });
    }, _POLLING_INTERVAL_MS$1);
  }
  stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }
  attachListener() {
    window.addEventListener("storage", this.boundEventHandler);
  }
  detachListener() {
    window.removeEventListener("storage", this.boundEventHandler);
  }
  _addListener(key, listener) {
    if (Object.keys(this.listeners).length === 0) {
      if (this.fallbackToPolling) {
        this.startPolling();
      } else {
        this.attachListener();
      }
    }
    if (!this.listeners[key]) {
      this.listeners[key] = /* @__PURE__ */ new Set();
      this.localCache[key] = this.storage.getItem(key);
    }
    this.listeners[key].add(listener);
  }
  _removeListener(key, listener) {
    if (this.listeners[key]) {
      this.listeners[key].delete(listener);
      if (this.listeners[key].size === 0) {
        delete this.listeners[key];
      }
    }
    if (Object.keys(this.listeners).length === 0) {
      this.detachListener();
      this.stopPolling();
    }
  }
  // Update local cache on base operations:
  _set(key, value) {
    return __async(this, null, function* () {
      yield __superGet(_BrowserLocalPersistence.prototype, this, "_set").call(this, key, value);
      this.localCache[key] = JSON.stringify(value);
    });
  }
  _get(key) {
    return __async(this, null, function* () {
      const value = yield __superGet(_BrowserLocalPersistence.prototype, this, "_get").call(this, key);
      this.localCache[key] = JSON.stringify(value);
      return value;
    });
  }
  _remove(key) {
    return __async(this, null, function* () {
      yield __superGet(_BrowserLocalPersistence.prototype, this, "_remove").call(this, key);
      delete this.localCache[key];
    });
  }
};
BrowserLocalPersistence.type = "LOCAL";
var browserLocalPersistence = BrowserLocalPersistence;
var BrowserSessionPersistence = class extends BrowserPersistenceClass {
  constructor() {
    super(
      () => window.sessionStorage,
      "SESSION"
      /* PersistenceType.SESSION */
    );
  }
  _addListener(_key, _listener) {
    return;
  }
  _removeListener(_key, _listener) {
    return;
  }
};
BrowserSessionPersistence.type = "SESSION";
var browserSessionPersistence = BrowserSessionPersistence;
function _allSettled(promises) {
  return Promise.all(promises.map((promise) => __async(this, null, function* () {
    try {
      const value = yield promise;
      return {
        fulfilled: true,
        value
      };
    } catch (reason) {
      return {
        fulfilled: false,
        reason
      };
    }
  })));
}
var Receiver = class _Receiver {
  constructor(eventTarget) {
    this.eventTarget = eventTarget;
    this.handlersMap = {};
    this.boundEventHandler = this.handleEvent.bind(this);
  }
  /**
   * Obtain an instance of a Receiver for a given event target, if none exists it will be created.
   *
   * @param eventTarget - An event target (such as window or self) through which the underlying
   * messages will be received.
   */
  static _getInstance(eventTarget) {
    const existingInstance = this.receivers.find((receiver) => receiver.isListeningto(eventTarget));
    if (existingInstance) {
      return existingInstance;
    }
    const newInstance = new _Receiver(eventTarget);
    this.receivers.push(newInstance);
    return newInstance;
  }
  isListeningto(eventTarget) {
    return this.eventTarget === eventTarget;
  }
  /**
   * Fans out a MessageEvent to the appropriate listeners.
   *
   * @remarks
   * Sends an {@link Status.ACK} upon receipt and a {@link Status.DONE} once all handlers have
   * finished processing.
   *
   * @param event - The MessageEvent.
   *
   */
  handleEvent(event) {
    return __async(this, null, function* () {
      const messageEvent = event;
      const { eventId, eventType, data } = messageEvent.data;
      const handlers = this.handlersMap[eventType];
      if (!(handlers === null || handlers === void 0 ? void 0 : handlers.size)) {
        return;
      }
      messageEvent.ports[0].postMessage({
        status: "ack",
        eventId,
        eventType
      });
      const promises = Array.from(handlers).map((handler) => __async(this, null, function* () {
        return handler(messageEvent.origin, data);
      }));
      const response = yield _allSettled(promises);
      messageEvent.ports[0].postMessage({
        status: "done",
        eventId,
        eventType,
        response
      });
    });
  }
  /**
   * Subscribe an event handler for a particular event.
   *
   * @param eventType - Event name to subscribe to.
   * @param eventHandler - The event handler which should receive the events.
   *
   */
  _subscribe(eventType, eventHandler) {
    if (Object.keys(this.handlersMap).length === 0) {
      this.eventTarget.addEventListener("message", this.boundEventHandler);
    }
    if (!this.handlersMap[eventType]) {
      this.handlersMap[eventType] = /* @__PURE__ */ new Set();
    }
    this.handlersMap[eventType].add(eventHandler);
  }
  /**
   * Unsubscribe an event handler from a particular event.
   *
   * @param eventType - Event name to unsubscribe from.
   * @param eventHandler - Optinoal event handler, if none provided, unsubscribe all handlers on this event.
   *
   */
  _unsubscribe(eventType, eventHandler) {
    if (this.handlersMap[eventType] && eventHandler) {
      this.handlersMap[eventType].delete(eventHandler);
    }
    if (!eventHandler || this.handlersMap[eventType].size === 0) {
      delete this.handlersMap[eventType];
    }
    if (Object.keys(this.handlersMap).length === 0) {
      this.eventTarget.removeEventListener("message", this.boundEventHandler);
    }
  }
};
Receiver.receivers = [];
function _generateEventId(prefix = "", digits = 10) {
  let random = "";
  for (let i = 0; i < digits; i++) {
    random += Math.floor(Math.random() * 10);
  }
  return prefix + random;
}
var Sender = class {
  constructor(target) {
    this.target = target;
    this.handlers = /* @__PURE__ */ new Set();
  }
  /**
   * Unsubscribe the handler and remove it from our tracking Set.
   *
   * @param handler - The handler to unsubscribe.
   */
  removeMessageHandler(handler) {
    if (handler.messageChannel) {
      handler.messageChannel.port1.removeEventListener("message", handler.onMessage);
      handler.messageChannel.port1.close();
    }
    this.handlers.delete(handler);
  }
  /**
   * Send a message to the Receiver located at {@link target}.
   *
   * @remarks
   * We'll first wait a bit for an ACK , if we get one we will wait significantly longer until the
   * receiver has had a chance to fully process the event.
   *
   * @param eventType - Type of event to send.
   * @param data - The payload of the event.
   * @param timeout - Timeout for waiting on an ACK from the receiver.
   *
   * @returns An array of settled promises from all the handlers that were listening on the receiver.
   */
  _send(eventType, data, timeout = 50) {
    return __async(this, null, function* () {
      const messageChannel = typeof MessageChannel !== "undefined" ? new MessageChannel() : null;
      if (!messageChannel) {
        throw new Error(
          "connection_unavailable"
          /* _MessageError.CONNECTION_UNAVAILABLE */
        );
      }
      let completionTimer;
      let handler;
      return new Promise((resolve, reject) => {
        const eventId = _generateEventId("", 20);
        messageChannel.port1.start();
        const ackTimer = setTimeout(() => {
          reject(new Error(
            "unsupported_event"
            /* _MessageError.UNSUPPORTED_EVENT */
          ));
        }, timeout);
        handler = {
          messageChannel,
          onMessage(event) {
            const messageEvent = event;
            if (messageEvent.data.eventId !== eventId) {
              return;
            }
            switch (messageEvent.data.status) {
              case "ack":
                clearTimeout(ackTimer);
                completionTimer = setTimeout(
                  () => {
                    reject(new Error(
                      "timeout"
                      /* _MessageError.TIMEOUT */
                    ));
                  },
                  3e3
                  /* _TimeoutDuration.COMPLETION */
                );
                break;
              case "done":
                clearTimeout(completionTimer);
                resolve(messageEvent.data.response);
                break;
              default:
                clearTimeout(ackTimer);
                clearTimeout(completionTimer);
                reject(new Error(
                  "invalid_response"
                  /* _MessageError.INVALID_RESPONSE */
                ));
                break;
            }
          }
        };
        this.handlers.add(handler);
        messageChannel.port1.addEventListener("message", handler.onMessage);
        this.target.postMessage({
          eventType,
          eventId,
          data
        }, [messageChannel.port2]);
      }).finally(() => {
        if (handler) {
          this.removeMessageHandler(handler);
        }
      });
    });
  }
};
function _window() {
  return window;
}
function _setWindowLocation(url) {
  _window().location.href = url;
}
function _isWorker() {
  return typeof _window()["WorkerGlobalScope"] !== "undefined" && typeof _window()["importScripts"] === "function";
}
function _getActiveServiceWorker() {
  return __async(this, null, function* () {
    if (!(navigator === null || navigator === void 0 ? void 0 : navigator.serviceWorker)) {
      return null;
    }
    try {
      const registration = yield navigator.serviceWorker.ready;
      return registration.active;
    } catch (_a) {
      return null;
    }
  });
}
function _getServiceWorkerController() {
  var _a;
  return ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.serviceWorker) === null || _a === void 0 ? void 0 : _a.controller) || null;
}
function _getWorkerGlobalScope() {
  return _isWorker() ? self : null;
}
var DB_NAME = "firebaseLocalStorageDb";
var DB_VERSION = 1;
var DB_OBJECTSTORE_NAME = "firebaseLocalStorage";
var DB_DATA_KEYPATH = "fbase_key";
var DBPromise = class {
  constructor(request) {
    this.request = request;
  }
  toPromise() {
    return new Promise((resolve, reject) => {
      this.request.addEventListener("success", () => {
        resolve(this.request.result);
      });
      this.request.addEventListener("error", () => {
        reject(this.request.error);
      });
    });
  }
};
function getObjectStore(db2, isReadWrite) {
  return db2.transaction([DB_OBJECTSTORE_NAME], isReadWrite ? "readwrite" : "readonly").objectStore(DB_OBJECTSTORE_NAME);
}
function _deleteDatabase() {
  const request = indexedDB.deleteDatabase(DB_NAME);
  return new DBPromise(request).toPromise();
}
function _openDatabase() {
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  return new Promise((resolve, reject) => {
    request.addEventListener("error", () => {
      reject(request.error);
    });
    request.addEventListener("upgradeneeded", () => {
      const db2 = request.result;
      try {
        db2.createObjectStore(DB_OBJECTSTORE_NAME, { keyPath: DB_DATA_KEYPATH });
      } catch (e) {
        reject(e);
      }
    });
    request.addEventListener("success", () => __async(this, null, function* () {
      const db2 = request.result;
      if (!db2.objectStoreNames.contains(DB_OBJECTSTORE_NAME)) {
        db2.close();
        yield _deleteDatabase();
        resolve(yield _openDatabase());
      } else {
        resolve(db2);
      }
    }));
  });
}
function _putObject(db2, key, value) {
  return __async(this, null, function* () {
    const request = getObjectStore(db2, true).put({
      [DB_DATA_KEYPATH]: key,
      value
    });
    return new DBPromise(request).toPromise();
  });
}
function getObject(db2, key) {
  return __async(this, null, function* () {
    const request = getObjectStore(db2, false).get(key);
    const data = yield new DBPromise(request).toPromise();
    return data === void 0 ? null : data.value;
  });
}
function _deleteObject(db2, key) {
  const request = getObjectStore(db2, true).delete(key);
  return new DBPromise(request).toPromise();
}
var _POLLING_INTERVAL_MS = 800;
var _TRANSACTION_RETRY_COUNT = 3;
var IndexedDBLocalPersistence = class {
  constructor() {
    this.type = "LOCAL";
    this._shouldAllowMigration = true;
    this.listeners = {};
    this.localCache = {};
    this.pollTimer = null;
    this.pendingWrites = 0;
    this.receiver = null;
    this.sender = null;
    this.serviceWorkerReceiverAvailable = false;
    this.activeServiceWorker = null;
    this._workerInitializationPromise = this.initializeServiceWorkerMessaging().then(() => {
    }, () => {
    });
  }
  _openDb() {
    return __async(this, null, function* () {
      if (this.db) {
        return this.db;
      }
      this.db = yield _openDatabase();
      return this.db;
    });
  }
  _withRetries(op) {
    return __async(this, null, function* () {
      let numAttempts = 0;
      while (true) {
        try {
          const db2 = yield this._openDb();
          return yield op(db2);
        } catch (e) {
          if (numAttempts++ > _TRANSACTION_RETRY_COUNT) {
            throw e;
          }
          if (this.db) {
            this.db.close();
            this.db = void 0;
          }
        }
      }
    });
  }
  /**
   * IndexedDB events do not propagate from the main window to the worker context.  We rely on a
   * postMessage interface to send these events to the worker ourselves.
   */
  initializeServiceWorkerMessaging() {
    return __async(this, null, function* () {
      return _isWorker() ? this.initializeReceiver() : this.initializeSender();
    });
  }
  /**
   * As the worker we should listen to events from the main window.
   */
  initializeReceiver() {
    return __async(this, null, function* () {
      this.receiver = Receiver._getInstance(_getWorkerGlobalScope());
      this.receiver._subscribe("keyChanged", (_origin, data) => __async(this, null, function* () {
        const keys = yield this._poll();
        return {
          keyProcessed: keys.includes(data.key)
        };
      }));
      this.receiver._subscribe("ping", (_origin, _data) => __async(this, null, function* () {
        return [
          "keyChanged"
          /* _EventType.KEY_CHANGED */
        ];
      }));
    });
  }
  /**
   * As the main window, we should let the worker know when keys change (set and remove).
   *
   * @remarks
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/ready | ServiceWorkerContainer.ready}
   * may not resolve.
   */
  initializeSender() {
    return __async(this, null, function* () {
      var _a, _b;
      this.activeServiceWorker = yield _getActiveServiceWorker();
      if (!this.activeServiceWorker) {
        return;
      }
      this.sender = new Sender(this.activeServiceWorker);
      const results = yield this.sender._send(
        "ping",
        {},
        800
        /* _TimeoutDuration.LONG_ACK */
      );
      if (!results) {
        return;
      }
      if (((_a = results[0]) === null || _a === void 0 ? void 0 : _a.fulfilled) && ((_b = results[0]) === null || _b === void 0 ? void 0 : _b.value.includes(
        "keyChanged"
        /* _EventType.KEY_CHANGED */
      ))) {
        this.serviceWorkerReceiverAvailable = true;
      }
    });
  }
  /**
   * Let the worker know about a changed key, the exact key doesn't technically matter since the
   * worker will just trigger a full sync anyway.
   *
   * @remarks
   * For now, we only support one service worker per page.
   *
   * @param key - Storage key which changed.
   */
  notifyServiceWorker(key) {
    return __async(this, null, function* () {
      if (!this.sender || !this.activeServiceWorker || _getServiceWorkerController() !== this.activeServiceWorker) {
        return;
      }
      try {
        yield this.sender._send(
          "keyChanged",
          { key },
          // Use long timeout if receiver has previously responded to a ping from us.
          this.serviceWorkerReceiverAvailable ? 800 : 50
          /* _TimeoutDuration.ACK */
        );
      } catch (_a) {
      }
    });
  }
  _isAvailable() {
    return __async(this, null, function* () {
      try {
        if (!indexedDB) {
          return false;
        }
        const db2 = yield _openDatabase();
        yield _putObject(db2, STORAGE_AVAILABLE_KEY, "1");
        yield _deleteObject(db2, STORAGE_AVAILABLE_KEY);
        return true;
      } catch (_a) {
      }
      return false;
    });
  }
  _withPendingWrite(write) {
    return __async(this, null, function* () {
      this.pendingWrites++;
      try {
        yield write();
      } finally {
        this.pendingWrites--;
      }
    });
  }
  _set(key, value) {
    return __async(this, null, function* () {
      return this._withPendingWrite(() => __async(this, null, function* () {
        yield this._withRetries((db2) => _putObject(db2, key, value));
        this.localCache[key] = value;
        return this.notifyServiceWorker(key);
      }));
    });
  }
  _get(key) {
    return __async(this, null, function* () {
      const obj = yield this._withRetries((db2) => getObject(db2, key));
      this.localCache[key] = obj;
      return obj;
    });
  }
  _remove(key) {
    return __async(this, null, function* () {
      return this._withPendingWrite(() => __async(this, null, function* () {
        yield this._withRetries((db2) => _deleteObject(db2, key));
        delete this.localCache[key];
        return this.notifyServiceWorker(key);
      }));
    });
  }
  _poll() {
    return __async(this, null, function* () {
      const result = yield this._withRetries((db2) => {
        const getAllRequest = getObjectStore(db2, false).getAll();
        return new DBPromise(getAllRequest).toPromise();
      });
      if (!result) {
        return [];
      }
      if (this.pendingWrites !== 0) {
        return [];
      }
      const keys = [];
      const keysInResult = /* @__PURE__ */ new Set();
      if (result.length !== 0) {
        for (const { fbase_key: key, value } of result) {
          keysInResult.add(key);
          if (JSON.stringify(this.localCache[key]) !== JSON.stringify(value)) {
            this.notifyListeners(key, value);
            keys.push(key);
          }
        }
      }
      for (const localKey of Object.keys(this.localCache)) {
        if (this.localCache[localKey] && !keysInResult.has(localKey)) {
          this.notifyListeners(localKey, null);
          keys.push(localKey);
        }
      }
      return keys;
    });
  }
  notifyListeners(key, newValue) {
    this.localCache[key] = newValue;
    const listeners = this.listeners[key];
    if (listeners) {
      for (const listener of Array.from(listeners)) {
        listener(newValue);
      }
    }
  }
  startPolling() {
    this.stopPolling();
    this.pollTimer = setInterval(() => __async(this, null, function* () {
      return this._poll();
    }), _POLLING_INTERVAL_MS);
  }
  stopPolling() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  }
  _addListener(key, listener) {
    if (Object.keys(this.listeners).length === 0) {
      this.startPolling();
    }
    if (!this.listeners[key]) {
      this.listeners[key] = /* @__PURE__ */ new Set();
      void this._get(key);
    }
    this.listeners[key].add(listener);
  }
  _removeListener(key, listener) {
    if (this.listeners[key]) {
      this.listeners[key].delete(listener);
      if (this.listeners[key].size === 0) {
        delete this.listeners[key];
      }
    }
    if (Object.keys(this.listeners).length === 0) {
      this.stopPolling();
    }
  }
};
IndexedDBLocalPersistence.type = "LOCAL";
var indexedDBLocalPersistence = IndexedDBLocalPersistence;
function startSignInPhoneMfa(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaSignIn:start", _addTidIfNecessary(auth, request));
}
function finalizeSignInPhoneMfa(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaSignIn:finalize", _addTidIfNecessary(auth, request));
}
function finalizeSignInTotpMfa(auth, request) {
  return _performApiRequest(auth, "POST", "/v2/accounts/mfaSignIn:finalize", _addTidIfNecessary(auth, request));
}
var _JSLOAD_CALLBACK = _generateCallbackName("rcb");
var NETWORK_TIMEOUT_DELAY = new Delay(3e4, 6e4);
var RECAPTCHA_VERIFIER_TYPE = "recaptcha";
var ConfirmationResultImpl = class {
  constructor(verificationId, onConfirmation) {
    this.verificationId = verificationId;
    this.onConfirmation = onConfirmation;
  }
  confirm(verificationCode) {
    const authCredential = PhoneAuthCredential._fromVerification(this.verificationId, verificationCode);
    return this.onConfirmation(authCredential);
  }
};
function signInWithPhoneNumber(auth, phoneNumber, appVerifier) {
  return __async(this, null, function* () {
    const authInternal = _castAuth(auth);
    const verificationId = yield _verifyPhoneNumber(authInternal, phoneNumber, getModularInstance(appVerifier));
    return new ConfirmationResultImpl(verificationId, (cred) => signInWithCredential(authInternal, cred));
  });
}
function linkWithPhoneNumber(user3, phoneNumber, appVerifier) {
  return __async(this, null, function* () {
    const userInternal = getModularInstance(user3);
    yield _assertLinkedStatus(
      false,
      userInternal,
      "phone"
      /* ProviderId.PHONE */
    );
    const verificationId = yield _verifyPhoneNumber(userInternal.auth, phoneNumber, getModularInstance(appVerifier));
    return new ConfirmationResultImpl(verificationId, (cred) => linkWithCredential(userInternal, cred));
  });
}
function reauthenticateWithPhoneNumber(user3, phoneNumber, appVerifier) {
  return __async(this, null, function* () {
    const userInternal = getModularInstance(user3);
    const verificationId = yield _verifyPhoneNumber(userInternal.auth, phoneNumber, getModularInstance(appVerifier));
    return new ConfirmationResultImpl(verificationId, (cred) => reauthenticateWithCredential(userInternal, cred));
  });
}
function _verifyPhoneNumber(auth, options, verifier) {
  return __async(this, null, function* () {
    var _a;
    const recaptchaToken = yield verifier.verify();
    try {
      _assert(
        typeof recaptchaToken === "string",
        auth,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      _assert(
        verifier.type === RECAPTCHA_VERIFIER_TYPE,
        auth,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      let phoneInfoOptions;
      if (typeof options === "string") {
        phoneInfoOptions = {
          phoneNumber: options
        };
      } else {
        phoneInfoOptions = options;
      }
      if ("session" in phoneInfoOptions) {
        const session = phoneInfoOptions.session;
        if ("phoneNumber" in phoneInfoOptions) {
          _assert(
            session.type === "enroll",
            auth,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          const response = yield startEnrollPhoneMfa(auth, {
            idToken: session.credential,
            phoneEnrollmentInfo: {
              phoneNumber: phoneInfoOptions.phoneNumber,
              recaptchaToken
            }
          });
          return response.phoneSessionInfo.sessionInfo;
        } else {
          _assert(
            session.type === "signin",
            auth,
            "internal-error"
            /* AuthErrorCode.INTERNAL_ERROR */
          );
          const mfaEnrollmentId = ((_a = phoneInfoOptions.multiFactorHint) === null || _a === void 0 ? void 0 : _a.uid) || phoneInfoOptions.multiFactorUid;
          _assert(
            mfaEnrollmentId,
            auth,
            "missing-multi-factor-info"
            /* AuthErrorCode.MISSING_MFA_INFO */
          );
          const response = yield startSignInPhoneMfa(auth, {
            mfaPendingCredential: session.credential,
            mfaEnrollmentId,
            phoneSignInInfo: {
              recaptchaToken
            }
          });
          return response.phoneResponseInfo.sessionInfo;
        }
      } else {
        const { sessionInfo } = yield sendPhoneVerificationCode(auth, {
          phoneNumber: phoneInfoOptions.phoneNumber,
          recaptchaToken
        });
        return sessionInfo;
      }
    } finally {
      verifier._reset();
    }
  });
}
function updatePhoneNumber(user3, credential) {
  return __async(this, null, function* () {
    yield _link$1(getModularInstance(user3), credential);
  });
}
var PhoneAuthProvider = class _PhoneAuthProvider {
  /**
   * @param auth - The Firebase {@link Auth} instance in which sign-ins should occur.
   *
   */
  constructor(auth) {
    this.providerId = _PhoneAuthProvider.PROVIDER_ID;
    this.auth = _castAuth(auth);
  }
  /**
   *
   * Starts a phone number authentication flow by sending a verification code to the given phone
   * number.
   *
   * @example
   * ```javascript
   * const provider = new PhoneAuthProvider(auth);
   * const verificationId = await provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
   * // Obtain verificationCode from the user.
   * const authCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
   * const userCredential = await signInWithCredential(auth, authCredential);
   * ```
   *
   * @example
   * An alternative flow is provided using the `signInWithPhoneNumber` method.
   * ```javascript
   * const confirmationResult = signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
   * // Obtain verificationCode from the user.
   * const userCredential = confirmationResult.confirm(verificationCode);
   * ```
   *
   * @param phoneInfoOptions - The user's {@link PhoneInfoOptions}. The phone number should be in
   * E.164 format (e.g. +16505550101).
   * @param applicationVerifier - For abuse prevention, this method also requires a
   * {@link ApplicationVerifier}. This SDK includes a reCAPTCHA-based implementation,
   * {@link RecaptchaVerifier}.
   *
   * @returns A Promise for a verification ID that can be passed to
   * {@link PhoneAuthProvider.credential} to identify this flow..
   */
  verifyPhoneNumber(phoneOptions, applicationVerifier) {
    return _verifyPhoneNumber(this.auth, phoneOptions, getModularInstance(applicationVerifier));
  }
  /**
   * Creates a phone auth credential, given the verification ID from
   * {@link PhoneAuthProvider.verifyPhoneNumber} and the code that was sent to the user's
   * mobile device.
   *
   * @example
   * ```javascript
   * const provider = new PhoneAuthProvider(auth);
   * const verificationId = provider.verifyPhoneNumber(phoneNumber, applicationVerifier);
   * // Obtain verificationCode from the user.
   * const authCredential = PhoneAuthProvider.credential(verificationId, verificationCode);
   * const userCredential = signInWithCredential(auth, authCredential);
   * ```
   *
   * @example
   * An alternative flow is provided using the `signInWithPhoneNumber` method.
   * ```javascript
   * const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, applicationVerifier);
   * // Obtain verificationCode from the user.
   * const userCredential = await confirmationResult.confirm(verificationCode);
   * ```
   *
   * @param verificationId - The verification ID returned from {@link PhoneAuthProvider.verifyPhoneNumber}.
   * @param verificationCode - The verification code sent to the user's mobile device.
   *
   * @returns The auth provider credential.
   */
  static credential(verificationId, verificationCode) {
    return PhoneAuthCredential._fromVerification(verificationId, verificationCode);
  }
  /**
   * Generates an {@link AuthCredential} from a {@link UserCredential}.
   * @param userCredential - The user credential.
   */
  static credentialFromResult(userCredential) {
    const credential = userCredential;
    return _PhoneAuthProvider.credentialFromTaggedObject(credential);
  }
  /**
   * Returns an {@link AuthCredential} when passed an error.
   *
   * @remarks
   *
   * This method works for errors like
   * `auth/account-exists-with-different-credentials`. This is useful for
   * recovering when attempting to set a user's phone number but the number
   * in question is already tied to another account. For example, the following
   * code tries to update the current user's phone number, and if that
   * fails, links the user with the account associated with that number:
   *
   * ```js
   * const provider = new PhoneAuthProvider(auth);
   * const verificationId = await provider.verifyPhoneNumber(number, verifier);
   * try {
   *   const code = ''; // Prompt the user for the verification code
   *   await updatePhoneNumber(
   *       auth.currentUser,
   *       PhoneAuthProvider.credential(verificationId, code));
   * } catch (e) {
   *   if ((e as FirebaseError)?.code === 'auth/account-exists-with-different-credential') {
   *     const cred = PhoneAuthProvider.credentialFromError(e);
   *     await linkWithCredential(auth.currentUser, cred);
   *   }
   * }
   *
   * // At this point, auth.currentUser.phoneNumber === number.
   * ```
   *
   * @param error - The error to generate a credential from.
   */
  static credentialFromError(error) {
    return _PhoneAuthProvider.credentialFromTaggedObject(error.customData || {});
  }
  static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
    if (!tokenResponse) {
      return null;
    }
    const { phoneNumber, temporaryProof } = tokenResponse;
    if (phoneNumber && temporaryProof) {
      return PhoneAuthCredential._fromTokenResponse(phoneNumber, temporaryProof);
    }
    return null;
  }
};
PhoneAuthProvider.PROVIDER_ID = "phone";
PhoneAuthProvider.PHONE_SIGN_IN_METHOD = "phone";
function _withDefaultResolver(auth, resolverOverride) {
  if (resolverOverride) {
    return _getInstance(resolverOverride);
  }
  _assert(
    auth._popupRedirectResolver,
    auth,
    "argument-error"
    /* AuthErrorCode.ARGUMENT_ERROR */
  );
  return auth._popupRedirectResolver;
}
var IdpCredential = class extends AuthCredential {
  constructor(params) {
    super(
      "custom",
      "custom"
      /* ProviderId.CUSTOM */
    );
    this.params = params;
  }
  _getIdTokenResponse(auth) {
    return signInWithIdp(auth, this._buildIdpRequest());
  }
  _linkToIdToken(auth, idToken3) {
    return signInWithIdp(auth, this._buildIdpRequest(idToken3));
  }
  _getReauthenticationResolver(auth) {
    return signInWithIdp(auth, this._buildIdpRequest());
  }
  _buildIdpRequest(idToken3) {
    const request = {
      requestUri: this.params.requestUri,
      sessionId: this.params.sessionId,
      postBody: this.params.postBody,
      tenantId: this.params.tenantId,
      pendingToken: this.params.pendingToken,
      returnSecureToken: true,
      returnIdpCredential: true
    };
    if (idToken3) {
      request.idToken = idToken3;
    }
    return request;
  }
};
function _signIn(params) {
  return _signInWithCredential(params.auth, new IdpCredential(params), params.bypassAuthState);
}
function _reauth(params) {
  const { auth, user: user3 } = params;
  _assert(
    user3,
    auth,
    "internal-error"
    /* AuthErrorCode.INTERNAL_ERROR */
  );
  return _reauthenticate(user3, new IdpCredential(params), params.bypassAuthState);
}
function _link(params) {
  return __async(this, null, function* () {
    const { auth, user: user3 } = params;
    _assert(
      user3,
      auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return _link$1(user3, new IdpCredential(params), params.bypassAuthState);
  });
}
var AbstractPopupRedirectOperation = class {
  constructor(auth, filter2, resolver, user3, bypassAuthState = false) {
    this.auth = auth;
    this.resolver = resolver;
    this.user = user3;
    this.bypassAuthState = bypassAuthState;
    this.pendingPromise = null;
    this.eventManager = null;
    this.filter = Array.isArray(filter2) ? filter2 : [filter2];
  }
  execute() {
    return new Promise((resolve, reject) => __async(this, null, function* () {
      this.pendingPromise = { resolve, reject };
      try {
        this.eventManager = yield this.resolver._initialize(this.auth);
        yield this.onExecution();
        this.eventManager.registerConsumer(this);
      } catch (e) {
        this.reject(e);
      }
    }));
  }
  onAuthEvent(event) {
    return __async(this, null, function* () {
      const { urlResponse, sessionId, postBody, tenantId, error, type } = event;
      if (error) {
        this.reject(error);
        return;
      }
      const params = {
        auth: this.auth,
        requestUri: urlResponse,
        sessionId,
        tenantId: tenantId || void 0,
        postBody: postBody || void 0,
        user: this.user,
        bypassAuthState: this.bypassAuthState
      };
      try {
        this.resolve(yield this.getIdpTask(type)(params));
      } catch (e) {
        this.reject(e);
      }
    });
  }
  onError(error) {
    this.reject(error);
  }
  getIdpTask(type) {
    switch (type) {
      case "signInViaPopup":
      case "signInViaRedirect":
        return _signIn;
      case "linkViaPopup":
      case "linkViaRedirect":
        return _link;
      case "reauthViaPopup":
      case "reauthViaRedirect":
        return _reauth;
      default:
        _fail(
          this.auth,
          "internal-error"
          /* AuthErrorCode.INTERNAL_ERROR */
        );
    }
  }
  resolve(cred) {
    debugAssert(this.pendingPromise, "Pending promise was never set");
    this.pendingPromise.resolve(cred);
    this.unregisterAndCleanUp();
  }
  reject(error) {
    debugAssert(this.pendingPromise, "Pending promise was never set");
    this.pendingPromise.reject(error);
    this.unregisterAndCleanUp();
  }
  unregisterAndCleanUp() {
    if (this.eventManager) {
      this.eventManager.unregisterConsumer(this);
    }
    this.pendingPromise = null;
    this.cleanUp();
  }
};
var _POLL_WINDOW_CLOSE_TIMEOUT = new Delay(2e3, 1e4);
function signInWithPopup(auth, provider, resolver) {
  return __async(this, null, function* () {
    const authInternal = _castAuth(auth);
    _assertInstanceOf(auth, provider, FederatedAuthProvider);
    const resolverInternal = _withDefaultResolver(authInternal, resolver);
    const action = new PopupOperation(authInternal, "signInViaPopup", provider, resolverInternal);
    return action.executeNotNull();
  });
}
function reauthenticateWithPopup(user3, provider, resolver) {
  return __async(this, null, function* () {
    const userInternal = getModularInstance(user3);
    _assertInstanceOf(userInternal.auth, provider, FederatedAuthProvider);
    const resolverInternal = _withDefaultResolver(userInternal.auth, resolver);
    const action = new PopupOperation(userInternal.auth, "reauthViaPopup", provider, resolverInternal, userInternal);
    return action.executeNotNull();
  });
}
function linkWithPopup(user3, provider, resolver) {
  return __async(this, null, function* () {
    const userInternal = getModularInstance(user3);
    _assertInstanceOf(userInternal.auth, provider, FederatedAuthProvider);
    const resolverInternal = _withDefaultResolver(userInternal.auth, resolver);
    const action = new PopupOperation(userInternal.auth, "linkViaPopup", provider, resolverInternal, userInternal);
    return action.executeNotNull();
  });
}
var PopupOperation = class _PopupOperation extends AbstractPopupRedirectOperation {
  constructor(auth, filter2, provider, resolver, user3) {
    super(auth, filter2, resolver, user3);
    this.provider = provider;
    this.authWindow = null;
    this.pollId = null;
    if (_PopupOperation.currentPopupAction) {
      _PopupOperation.currentPopupAction.cancel();
    }
    _PopupOperation.currentPopupAction = this;
  }
  executeNotNull() {
    return __async(this, null, function* () {
      const result = yield this.execute();
      _assert(
        result,
        this.auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      return result;
    });
  }
  onExecution() {
    return __async(this, null, function* () {
      debugAssert(this.filter.length === 1, "Popup operations only handle one event");
      const eventId = _generateEventId();
      this.authWindow = yield this.resolver._openPopup(
        this.auth,
        this.provider,
        this.filter[0],
        // There's always one, see constructor
        eventId
      );
      this.authWindow.associatedEvent = eventId;
      this.resolver._originValidation(this.auth).catch((e) => {
        this.reject(e);
      });
      this.resolver._isIframeWebStorageSupported(this.auth, (isSupported) => {
        if (!isSupported) {
          this.reject(_createError(
            this.auth,
            "web-storage-unsupported"
            /* AuthErrorCode.WEB_STORAGE_UNSUPPORTED */
          ));
        }
      });
      this.pollUserCancellation();
    });
  }
  get eventId() {
    var _a;
    return ((_a = this.authWindow) === null || _a === void 0 ? void 0 : _a.associatedEvent) || null;
  }
  cancel() {
    this.reject(_createError(
      this.auth,
      "cancelled-popup-request"
      /* AuthErrorCode.EXPIRED_POPUP_REQUEST */
    ));
  }
  cleanUp() {
    if (this.authWindow) {
      this.authWindow.close();
    }
    if (this.pollId) {
      window.clearTimeout(this.pollId);
    }
    this.authWindow = null;
    this.pollId = null;
    _PopupOperation.currentPopupAction = null;
  }
  pollUserCancellation() {
    const poll = () => {
      var _a, _b;
      if ((_b = (_a = this.authWindow) === null || _a === void 0 ? void 0 : _a.window) === null || _b === void 0 ? void 0 : _b.closed) {
        this.pollId = window.setTimeout(
          () => {
            this.pollId = null;
            this.reject(_createError(
              this.auth,
              "popup-closed-by-user"
              /* AuthErrorCode.POPUP_CLOSED_BY_USER */
            ));
          },
          8e3
          /* _Timeout.AUTH_EVENT */
        );
        return;
      }
      this.pollId = window.setTimeout(poll, _POLL_WINDOW_CLOSE_TIMEOUT.get());
    };
    poll();
  }
};
PopupOperation.currentPopupAction = null;
var PENDING_REDIRECT_KEY = "pendingRedirect";
var redirectOutcomeMap = /* @__PURE__ */ new Map();
var RedirectAction = class _RedirectAction extends AbstractPopupRedirectOperation {
  constructor(auth, resolver, bypassAuthState = false) {
    super(auth, [
      "signInViaRedirect",
      "linkViaRedirect",
      "reauthViaRedirect",
      "unknown"
      /* AuthEventType.UNKNOWN */
    ], resolver, void 0, bypassAuthState);
    this.eventId = null;
  }
  /**
   * Override the execute function; if we already have a redirect result, then
   * just return it.
   */
  execute() {
    return __async(this, null, function* () {
      let readyOutcome = redirectOutcomeMap.get(this.auth._key());
      if (!readyOutcome) {
        try {
          const hasPendingRedirect = yield _getAndClearPendingRedirectStatus(this.resolver, this.auth);
          const result = hasPendingRedirect ? yield __superGet(_RedirectAction.prototype, this, "execute").call(this) : null;
          readyOutcome = () => Promise.resolve(result);
        } catch (e) {
          readyOutcome = () => Promise.reject(e);
        }
        redirectOutcomeMap.set(this.auth._key(), readyOutcome);
      }
      if (!this.bypassAuthState) {
        redirectOutcomeMap.set(this.auth._key(), () => Promise.resolve(null));
      }
      return readyOutcome();
    });
  }
  onAuthEvent(event) {
    return __async(this, null, function* () {
      if (event.type === "signInViaRedirect") {
        return __superGet(_RedirectAction.prototype, this, "onAuthEvent").call(this, event);
      } else if (event.type === "unknown") {
        this.resolve(null);
        return;
      }
      if (event.eventId) {
        const user3 = yield this.auth._redirectUserForId(event.eventId);
        if (user3) {
          this.user = user3;
          return __superGet(_RedirectAction.prototype, this, "onAuthEvent").call(this, event);
        } else {
          this.resolve(null);
        }
      }
    });
  }
  onExecution() {
    return __async(this, null, function* () {
    });
  }
  cleanUp() {
  }
};
function _getAndClearPendingRedirectStatus(resolver, auth) {
  return __async(this, null, function* () {
    const key = pendingRedirectKey(auth);
    const persistence = resolverPersistence(resolver);
    if (!(yield persistence._isAvailable())) {
      return false;
    }
    const hasPendingRedirect = (yield persistence._get(key)) === "true";
    yield persistence._remove(key);
    return hasPendingRedirect;
  });
}
function _setPendingRedirectStatus(resolver, auth) {
  return __async(this, null, function* () {
    return resolverPersistence(resolver)._set(pendingRedirectKey(auth), "true");
  });
}
function _overrideRedirectResult(auth, result) {
  redirectOutcomeMap.set(auth._key(), result);
}
function resolverPersistence(resolver) {
  return _getInstance(resolver._redirectPersistence);
}
function pendingRedirectKey(auth) {
  return _persistenceKeyName(PENDING_REDIRECT_KEY, auth.config.apiKey, auth.name);
}
function signInWithRedirect(auth, provider, resolver) {
  return _signInWithRedirect(auth, provider, resolver);
}
function _signInWithRedirect(auth, provider, resolver) {
  return __async(this, null, function* () {
    const authInternal = _castAuth(auth);
    _assertInstanceOf(auth, provider, FederatedAuthProvider);
    yield authInternal._initializationPromise;
    const resolverInternal = _withDefaultResolver(authInternal, resolver);
    yield _setPendingRedirectStatus(resolverInternal, authInternal);
    return resolverInternal._openRedirect(
      authInternal,
      provider,
      "signInViaRedirect"
      /* AuthEventType.SIGN_IN_VIA_REDIRECT */
    );
  });
}
function reauthenticateWithRedirect(user3, provider, resolver) {
  return _reauthenticateWithRedirect(user3, provider, resolver);
}
function _reauthenticateWithRedirect(user3, provider, resolver) {
  return __async(this, null, function* () {
    const userInternal = getModularInstance(user3);
    _assertInstanceOf(userInternal.auth, provider, FederatedAuthProvider);
    yield userInternal.auth._initializationPromise;
    const resolverInternal = _withDefaultResolver(userInternal.auth, resolver);
    yield _setPendingRedirectStatus(resolverInternal, userInternal.auth);
    const eventId = yield prepareUserForRedirect(userInternal);
    return resolverInternal._openRedirect(userInternal.auth, provider, "reauthViaRedirect", eventId);
  });
}
function linkWithRedirect(user3, provider, resolver) {
  return _linkWithRedirect(user3, provider, resolver);
}
function _linkWithRedirect(user3, provider, resolver) {
  return __async(this, null, function* () {
    const userInternal = getModularInstance(user3);
    _assertInstanceOf(userInternal.auth, provider, FederatedAuthProvider);
    yield userInternal.auth._initializationPromise;
    const resolverInternal = _withDefaultResolver(userInternal.auth, resolver);
    yield _assertLinkedStatus(false, userInternal, provider.providerId);
    yield _setPendingRedirectStatus(resolverInternal, userInternal.auth);
    const eventId = yield prepareUserForRedirect(userInternal);
    return resolverInternal._openRedirect(userInternal.auth, provider, "linkViaRedirect", eventId);
  });
}
function getRedirectResult(auth, resolver) {
  return __async(this, null, function* () {
    yield _castAuth(auth)._initializationPromise;
    return _getRedirectResult(auth, resolver, false);
  });
}
function _getRedirectResult(auth, resolverExtern, bypassAuthState = false) {
  return __async(this, null, function* () {
    const authInternal = _castAuth(auth);
    const resolver = _withDefaultResolver(authInternal, resolverExtern);
    const action = new RedirectAction(authInternal, resolver, bypassAuthState);
    const result = yield action.execute();
    if (result && !bypassAuthState) {
      delete result.user._redirectEventId;
      yield authInternal._persistUserIfCurrent(result.user);
      yield authInternal._setRedirectUser(null, resolverExtern);
    }
    return result;
  });
}
function prepareUserForRedirect(user3) {
  return __async(this, null, function* () {
    const eventId = _generateEventId(`${user3.uid}:::`);
    user3._redirectEventId = eventId;
    yield user3.auth._setRedirectUser(user3);
    yield user3.auth._persistUserIfCurrent(user3);
    return eventId;
  });
}
var EVENT_DUPLICATION_CACHE_DURATION_MS = 10 * 60 * 1e3;
var AuthEventManager = class {
  constructor(auth) {
    this.auth = auth;
    this.cachedEventUids = /* @__PURE__ */ new Set();
    this.consumers = /* @__PURE__ */ new Set();
    this.queuedRedirectEvent = null;
    this.hasHandledPotentialRedirect = false;
    this.lastProcessedEventTime = Date.now();
  }
  registerConsumer(authEventConsumer) {
    this.consumers.add(authEventConsumer);
    if (this.queuedRedirectEvent && this.isEventForConsumer(this.queuedRedirectEvent, authEventConsumer)) {
      this.sendToConsumer(this.queuedRedirectEvent, authEventConsumer);
      this.saveEventToCache(this.queuedRedirectEvent);
      this.queuedRedirectEvent = null;
    }
  }
  unregisterConsumer(authEventConsumer) {
    this.consumers.delete(authEventConsumer);
  }
  onEvent(event) {
    if (this.hasEventBeenHandled(event)) {
      return false;
    }
    let handled = false;
    this.consumers.forEach((consumer) => {
      if (this.isEventForConsumer(event, consumer)) {
        handled = true;
        this.sendToConsumer(event, consumer);
        this.saveEventToCache(event);
      }
    });
    if (this.hasHandledPotentialRedirect || !isRedirectEvent(event)) {
      return handled;
    }
    this.hasHandledPotentialRedirect = true;
    if (!handled) {
      this.queuedRedirectEvent = event;
      handled = true;
    }
    return handled;
  }
  sendToConsumer(event, consumer) {
    var _a;
    if (event.error && !isNullRedirectEvent(event)) {
      const code = ((_a = event.error.code) === null || _a === void 0 ? void 0 : _a.split("auth/")[1]) || "internal-error";
      consumer.onError(_createError(this.auth, code));
    } else {
      consumer.onAuthEvent(event);
    }
  }
  isEventForConsumer(event, consumer) {
    const eventIdMatches = consumer.eventId === null || !!event.eventId && event.eventId === consumer.eventId;
    return consumer.filter.includes(event.type) && eventIdMatches;
  }
  hasEventBeenHandled(event) {
    if (Date.now() - this.lastProcessedEventTime >= EVENT_DUPLICATION_CACHE_DURATION_MS) {
      this.cachedEventUids.clear();
    }
    return this.cachedEventUids.has(eventUid(event));
  }
  saveEventToCache(event) {
    this.cachedEventUids.add(eventUid(event));
    this.lastProcessedEventTime = Date.now();
  }
};
function eventUid(e) {
  return [e.type, e.eventId, e.sessionId, e.tenantId].filter((v3) => v3).join("-");
}
function isNullRedirectEvent({ type, error }) {
  return type === "unknown" && (error === null || error === void 0 ? void 0 : error.code) === `auth/${"no-auth-event"}`;
}
function isRedirectEvent(event) {
  switch (event.type) {
    case "signInViaRedirect":
    case "linkViaRedirect":
    case "reauthViaRedirect":
      return true;
    case "unknown":
      return isNullRedirectEvent(event);
    default:
      return false;
  }
}
function _getProjectConfig(_0) {
  return __async(this, arguments, function* (auth, request = {}) {
    return _performApiRequest(auth, "GET", "/v1/projects", request);
  });
}
var IP_ADDRESS_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
var HTTP_REGEX = /^https?/;
function _validateOrigin(auth) {
  return __async(this, null, function* () {
    if (auth.config.emulator) {
      return;
    }
    const { authorizedDomains } = yield _getProjectConfig(auth);
    for (const domain of authorizedDomains) {
      try {
        if (matchDomain(domain)) {
          return;
        }
      } catch (_a) {
      }
    }
    _fail(
      auth,
      "unauthorized-domain"
      /* AuthErrorCode.INVALID_ORIGIN */
    );
  });
}
function matchDomain(expected) {
  const currentUrl = _getCurrentUrl();
  const { protocol, hostname } = new URL(currentUrl);
  if (expected.startsWith("chrome-extension://")) {
    const ceUrl = new URL(expected);
    if (ceUrl.hostname === "" && hostname === "") {
      return protocol === "chrome-extension:" && expected.replace("chrome-extension://", "") === currentUrl.replace("chrome-extension://", "");
    }
    return protocol === "chrome-extension:" && ceUrl.hostname === hostname;
  }
  if (!HTTP_REGEX.test(protocol)) {
    return false;
  }
  if (IP_ADDRESS_REGEX.test(expected)) {
    return hostname === expected;
  }
  const escapedDomainPattern = expected.replace(/\./g, "\\.");
  const re2 = new RegExp("^(.+\\." + escapedDomainPattern + "|" + escapedDomainPattern + ")$", "i");
  return re2.test(hostname);
}
var NETWORK_TIMEOUT = new Delay(3e4, 6e4);
function resetUnloadedGapiModules() {
  const beacon = _window().___jsl;
  if (beacon === null || beacon === void 0 ? void 0 : beacon.H) {
    for (const hint of Object.keys(beacon.H)) {
      beacon.H[hint].r = beacon.H[hint].r || [];
      beacon.H[hint].L = beacon.H[hint].L || [];
      beacon.H[hint].r = [...beacon.H[hint].L];
      if (beacon.CP) {
        for (let i = 0; i < beacon.CP.length; i++) {
          beacon.CP[i] = null;
        }
      }
    }
  }
}
function loadGapi(auth) {
  return new Promise((resolve, reject) => {
    var _a, _b, _c;
    function loadGapiIframe() {
      resetUnloadedGapiModules();
      gapi.load("gapi.iframes", {
        callback: () => {
          resolve(gapi.iframes.getContext());
        },
        ontimeout: () => {
          resetUnloadedGapiModules();
          reject(_createError(
            auth,
            "network-request-failed"
            /* AuthErrorCode.NETWORK_REQUEST_FAILED */
          ));
        },
        timeout: NETWORK_TIMEOUT.get()
      });
    }
    if ((_b = (_a = _window().gapi) === null || _a === void 0 ? void 0 : _a.iframes) === null || _b === void 0 ? void 0 : _b.Iframe) {
      resolve(gapi.iframes.getContext());
    } else if (!!((_c = _window().gapi) === null || _c === void 0 ? void 0 : _c.load)) {
      loadGapiIframe();
    } else {
      const cbName = _generateCallbackName("iframefcb");
      _window()[cbName] = () => {
        if (!!gapi.load) {
          loadGapiIframe();
        } else {
          reject(_createError(
            auth,
            "network-request-failed"
            /* AuthErrorCode.NETWORK_REQUEST_FAILED */
          ));
        }
      };
      return _loadJS(`https://apis.google.com/js/api.js?onload=${cbName}`).catch((e) => reject(e));
    }
  }).catch((error) => {
    cachedGApiLoader = null;
    throw error;
  });
}
var cachedGApiLoader = null;
function _loadGapi(auth) {
  cachedGApiLoader = cachedGApiLoader || loadGapi(auth);
  return cachedGApiLoader;
}
var PING_TIMEOUT = new Delay(5e3, 15e3);
var IFRAME_PATH = "__/auth/iframe";
var EMULATED_IFRAME_PATH = "emulator/auth/iframe";
var IFRAME_ATTRIBUTES = {
  style: {
    position: "absolute",
    top: "-100px",
    width: "1px",
    height: "1px"
  },
  "aria-hidden": "true",
  tabindex: "-1"
};
var EID_FROM_APIHOST = /* @__PURE__ */ new Map([
  ["identitytoolkit.googleapis.com", "p"],
  ["staging-identitytoolkit.sandbox.googleapis.com", "s"],
  ["test-identitytoolkit.sandbox.googleapis.com", "t"]
  // test
]);
function getIframeUrl(auth) {
  const config = auth.config;
  _assert(
    config.authDomain,
    auth,
    "auth-domain-config-required"
    /* AuthErrorCode.MISSING_AUTH_DOMAIN */
  );
  const url = config.emulator ? _emulatorUrl(config, EMULATED_IFRAME_PATH) : `https://${auth.config.authDomain}/${IFRAME_PATH}`;
  const params = {
    apiKey: config.apiKey,
    appName: auth.name,
    v: SDK_VERSION
  };
  const eid = EID_FROM_APIHOST.get(auth.config.apiHost);
  if (eid) {
    params.eid = eid;
  }
  const frameworks = auth._getFrameworks();
  if (frameworks.length) {
    params.fw = frameworks.join(",");
  }
  return `${url}?${querystring(params).slice(1)}`;
}
function _openIframe(auth) {
  return __async(this, null, function* () {
    const context = yield _loadGapi(auth);
    const gapi2 = _window().gapi;
    _assert(
      gapi2,
      auth,
      "internal-error"
      /* AuthErrorCode.INTERNAL_ERROR */
    );
    return context.open({
      where: document.body,
      url: getIframeUrl(auth),
      messageHandlersFilter: gapi2.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
      attributes: IFRAME_ATTRIBUTES,
      dontclear: true
    }, (iframe) => new Promise((resolve, reject) => __async(this, null, function* () {
      yield iframe.restyle({
        // Prevent iframe from closing on mouse out.
        setHideOnLeave: false
      });
      const networkError = _createError(
        auth,
        "network-request-failed"
        /* AuthErrorCode.NETWORK_REQUEST_FAILED */
      );
      const networkErrorTimer = _window().setTimeout(() => {
        reject(networkError);
      }, PING_TIMEOUT.get());
      function clearTimerAndResolve() {
        _window().clearTimeout(networkErrorTimer);
        resolve(iframe);
      }
      iframe.ping(clearTimerAndResolve).then(clearTimerAndResolve, () => {
        reject(networkError);
      });
    })));
  });
}
var BASE_POPUP_OPTIONS = {
  location: "yes",
  resizable: "yes",
  statusbar: "yes",
  toolbar: "no"
};
var DEFAULT_WIDTH = 500;
var DEFAULT_HEIGHT = 600;
var TARGET_BLANK = "_blank";
var FIREFOX_EMPTY_URL = "http://localhost";
var AuthPopup = class {
  constructor(window2) {
    this.window = window2;
    this.associatedEvent = null;
  }
  close() {
    if (this.window) {
      try {
        this.window.close();
      } catch (e) {
      }
    }
  }
};
function _open(auth, url, name2, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
  const top = Math.max((window.screen.availHeight - height) / 2, 0).toString();
  const left = Math.max((window.screen.availWidth - width) / 2, 0).toString();
  let target = "";
  const options = Object.assign(Object.assign({}, BASE_POPUP_OPTIONS), {
    width: width.toString(),
    height: height.toString(),
    top,
    left
  });
  const ua2 = getUA().toLowerCase();
  if (name2) {
    target = _isChromeIOS(ua2) ? TARGET_BLANK : name2;
  }
  if (_isFirefox(ua2)) {
    url = url || FIREFOX_EMPTY_URL;
    options.scrollbars = "yes";
  }
  const optionsString = Object.entries(options).reduce((accum, [key, value]) => `${accum}${key}=${value},`, "");
  if (_isIOSStandalone(ua2) && target !== "_self") {
    openAsNewWindowIOS(url || "", target);
    return new AuthPopup(null);
  }
  const newWin = window.open(url || "", target, optionsString);
  _assert(
    newWin,
    auth,
    "popup-blocked"
    /* AuthErrorCode.POPUP_BLOCKED */
  );
  try {
    newWin.focus();
  } catch (e) {
  }
  return new AuthPopup(newWin);
}
function openAsNewWindowIOS(url, target) {
  const el = document.createElement("a");
  el.href = url;
  el.target = target;
  const click = document.createEvent("MouseEvent");
  click.initMouseEvent("click", true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 1, null);
  el.dispatchEvent(click);
}
var WIDGET_PATH = "__/auth/handler";
var EMULATOR_WIDGET_PATH = "emulator/auth/handler";
var FIREBASE_APP_CHECK_FRAGMENT_ID = encodeURIComponent("fac");
function _getRedirectUrl(auth, provider, authType, redirectUrl, eventId, additionalParams) {
  return __async(this, null, function* () {
    _assert(
      auth.config.authDomain,
      auth,
      "auth-domain-config-required"
      /* AuthErrorCode.MISSING_AUTH_DOMAIN */
    );
    _assert(
      auth.config.apiKey,
      auth,
      "invalid-api-key"
      /* AuthErrorCode.INVALID_API_KEY */
    );
    const params = {
      apiKey: auth.config.apiKey,
      appName: auth.name,
      authType,
      redirectUrl,
      v: SDK_VERSION,
      eventId
    };
    if (provider instanceof FederatedAuthProvider) {
      provider.setDefaultLanguage(auth.languageCode);
      params.providerId = provider.providerId || "";
      if (!isEmpty(provider.getCustomParameters())) {
        params.customParameters = JSON.stringify(provider.getCustomParameters());
      }
      for (const [key, value] of Object.entries(additionalParams || {})) {
        params[key] = value;
      }
    }
    if (provider instanceof BaseOAuthProvider) {
      const scopes = provider.getScopes().filter((scope) => scope !== "");
      if (scopes.length > 0) {
        params.scopes = scopes.join(",");
      }
    }
    if (auth.tenantId) {
      params.tid = auth.tenantId;
    }
    const paramsDict = params;
    for (const key of Object.keys(paramsDict)) {
      if (paramsDict[key] === void 0) {
        delete paramsDict[key];
      }
    }
    const appCheckToken = yield auth._getAppCheckToken();
    const appCheckTokenFragment = appCheckToken ? `#${FIREBASE_APP_CHECK_FRAGMENT_ID}=${encodeURIComponent(appCheckToken)}` : "";
    return `${getHandlerBase(auth)}?${querystring(paramsDict).slice(1)}${appCheckTokenFragment}`;
  });
}
function getHandlerBase({ config }) {
  if (!config.emulator) {
    return `https://${config.authDomain}/${WIDGET_PATH}`;
  }
  return _emulatorUrl(config, EMULATOR_WIDGET_PATH);
}
var WEB_STORAGE_SUPPORT_KEY = "webStorageSupport";
var BrowserPopupRedirectResolver = class {
  constructor() {
    this.eventManagers = {};
    this.iframes = {};
    this.originValidationPromises = {};
    this._redirectPersistence = browserSessionPersistence;
    this._completeRedirectFn = _getRedirectResult;
    this._overrideRedirectResult = _overrideRedirectResult;
  }
  // Wrapping in async even though we don't await anywhere in order
  // to make sure errors are raised as promise rejections
  _openPopup(auth, provider, authType, eventId) {
    return __async(this, null, function* () {
      var _a;
      debugAssert((_a = this.eventManagers[auth._key()]) === null || _a === void 0 ? void 0 : _a.manager, "_initialize() not called before _openPopup()");
      const url = yield _getRedirectUrl(auth, provider, authType, _getCurrentUrl(), eventId);
      return _open(auth, url, _generateEventId());
    });
  }
  _openRedirect(auth, provider, authType, eventId) {
    return __async(this, null, function* () {
      yield this._originValidation(auth);
      const url = yield _getRedirectUrl(auth, provider, authType, _getCurrentUrl(), eventId);
      _setWindowLocation(url);
      return new Promise(() => {
      });
    });
  }
  _initialize(auth) {
    const key = auth._key();
    if (this.eventManagers[key]) {
      const { manager, promise: promise2 } = this.eventManagers[key];
      if (manager) {
        return Promise.resolve(manager);
      } else {
        debugAssert(promise2, "If manager is not set, promise should be");
        return promise2;
      }
    }
    const promise = this.initAndGetManager(auth);
    this.eventManagers[key] = { promise };
    promise.catch(() => {
      delete this.eventManagers[key];
    });
    return promise;
  }
  initAndGetManager(auth) {
    return __async(this, null, function* () {
      const iframe = yield _openIframe(auth);
      const manager = new AuthEventManager(auth);
      iframe.register("authEvent", (iframeEvent) => {
        _assert(
          iframeEvent === null || iframeEvent === void 0 ? void 0 : iframeEvent.authEvent,
          auth,
          "invalid-auth-event"
          /* AuthErrorCode.INVALID_AUTH_EVENT */
        );
        const handled = manager.onEvent(iframeEvent.authEvent);
        return {
          status: handled ? "ACK" : "ERROR"
          /* GapiOutcome.ERROR */
        };
      }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
      this.eventManagers[auth._key()] = { manager };
      this.iframes[auth._key()] = iframe;
      return manager;
    });
  }
  _isIframeWebStorageSupported(auth, cb2) {
    const iframe = this.iframes[auth._key()];
    iframe.send(WEB_STORAGE_SUPPORT_KEY, { type: WEB_STORAGE_SUPPORT_KEY }, (result) => {
      var _a;
      const isSupported = (_a = result === null || result === void 0 ? void 0 : result[0]) === null || _a === void 0 ? void 0 : _a[WEB_STORAGE_SUPPORT_KEY];
      if (isSupported !== void 0) {
        cb2(!!isSupported);
      }
      _fail(
        auth,
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
    }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
  }
  _originValidation(auth) {
    const key = auth._key();
    if (!this.originValidationPromises[key]) {
      this.originValidationPromises[key] = _validateOrigin(auth);
    }
    return this.originValidationPromises[key];
  }
  get _shouldInitProactively() {
    return _isMobileBrowser() || _isSafari() || _isIOS();
  }
};
var browserPopupRedirectResolver = BrowserPopupRedirectResolver;
var MultiFactorAssertionImpl = class {
  constructor(factorId) {
    this.factorId = factorId;
  }
  _process(auth, session, displayName) {
    switch (session.type) {
      case "enroll":
        return this._finalizeEnroll(auth, session.credential, displayName);
      case "signin":
        return this._finalizeSignIn(auth, session.credential);
      default:
        return debugFail("unexpected MultiFactorSessionType");
    }
  }
};
var PhoneMultiFactorAssertionImpl = class _PhoneMultiFactorAssertionImpl extends MultiFactorAssertionImpl {
  constructor(credential) {
    super(
      "phone"
      /* FactorId.PHONE */
    );
    this.credential = credential;
  }
  /** @internal */
  static _fromCredential(credential) {
    return new _PhoneMultiFactorAssertionImpl(credential);
  }
  /** @internal */
  _finalizeEnroll(auth, idToken3, displayName) {
    return finalizeEnrollPhoneMfa(auth, {
      idToken: idToken3,
      displayName,
      phoneVerificationInfo: this.credential._makeVerificationRequest()
    });
  }
  /** @internal */
  _finalizeSignIn(auth, mfaPendingCredential) {
    return finalizeSignInPhoneMfa(auth, {
      mfaPendingCredential,
      phoneVerificationInfo: this.credential._makeVerificationRequest()
    });
  }
};
var PhoneMultiFactorGenerator = class {
  constructor() {
  }
  /**
   * Provides a {@link PhoneMultiFactorAssertion} to confirm ownership of the phone second factor.
   *
   * @remarks
   * This method does not work in a Node.js environment.
   *
   * @param phoneAuthCredential - A credential provided by {@link PhoneAuthProvider.credential}.
   * @returns A {@link PhoneMultiFactorAssertion} which can be used with
   * {@link MultiFactorResolver.resolveSignIn}
   */
  static assertion(credential) {
    return PhoneMultiFactorAssertionImpl._fromCredential(credential);
  }
};
PhoneMultiFactorGenerator.FACTOR_ID = "phone";
var TotpMultiFactorGenerator = class {
  /**
   * Provides a {@link TotpMultiFactorAssertion} to confirm ownership of
   * the TOTP (time-based one-time password) second factor.
   * This assertion is used to complete enrollment in TOTP second factor.
   *
   * @param secret A {@link TotpSecret} containing the shared secret key and other TOTP parameters.
   * @param oneTimePassword One-time password from TOTP App.
   * @returns A {@link TotpMultiFactorAssertion} which can be used with
   * {@link MultiFactorUser.enroll}.
   */
  static assertionForEnrollment(secret, oneTimePassword) {
    return TotpMultiFactorAssertionImpl._fromSecret(secret, oneTimePassword);
  }
  /**
   * Provides a {@link TotpMultiFactorAssertion} to confirm ownership of the TOTP second factor.
   * This assertion is used to complete signIn with TOTP as the second factor.
   *
   * @param enrollmentId identifies the enrolled TOTP second factor.
   * @param oneTimePassword One-time password from TOTP App.
   * @returns A {@link TotpMultiFactorAssertion} which can be used with
   * {@link MultiFactorResolver.resolveSignIn}.
   */
  static assertionForSignIn(enrollmentId, oneTimePassword) {
    return TotpMultiFactorAssertionImpl._fromEnrollmentId(enrollmentId, oneTimePassword);
  }
  /**
   * Returns a promise to {@link TotpSecret} which contains the TOTP shared secret key and other parameters.
   * Creates a TOTP secret as part of enrolling a TOTP second factor.
   * Used for generating a QR code URL or inputting into a TOTP app.
   * This method uses the auth instance corresponding to the user in the multiFactorSession.
   *
   * @param session The {@link MultiFactorSession} that the user is part of.
   * @returns A promise to {@link TotpSecret}.
   */
  static generateSecret(session) {
    return __async(this, null, function* () {
      var _a;
      const mfaSession = session;
      _assert(
        typeof ((_a = mfaSession.user) === null || _a === void 0 ? void 0 : _a.auth) !== "undefined",
        "internal-error"
        /* AuthErrorCode.INTERNAL_ERROR */
      );
      const response = yield startEnrollTotpMfa(mfaSession.user.auth, {
        idToken: mfaSession.credential,
        totpEnrollmentInfo: {}
      });
      return TotpSecret._fromStartTotpMfaEnrollmentResponse(response, mfaSession.user.auth);
    });
  }
};
TotpMultiFactorGenerator.FACTOR_ID = "totp";
var TotpMultiFactorAssertionImpl = class _TotpMultiFactorAssertionImpl extends MultiFactorAssertionImpl {
  constructor(otp, enrollmentId, secret) {
    super(
      "totp"
      /* FactorId.TOTP */
    );
    this.otp = otp;
    this.enrollmentId = enrollmentId;
    this.secret = secret;
  }
  /** @internal */
  static _fromSecret(secret, otp) {
    return new _TotpMultiFactorAssertionImpl(otp, void 0, secret);
  }
  /** @internal */
  static _fromEnrollmentId(enrollmentId, otp) {
    return new _TotpMultiFactorAssertionImpl(otp, enrollmentId);
  }
  /** @internal */
  _finalizeEnroll(auth, idToken3, displayName) {
    return __async(this, null, function* () {
      _assert(
        typeof this.secret !== "undefined",
        auth,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      return finalizeEnrollTotpMfa(auth, {
        idToken: idToken3,
        displayName,
        totpVerificationInfo: this.secret._makeTotpVerificationInfo(this.otp)
      });
    });
  }
  /** @internal */
  _finalizeSignIn(auth, mfaPendingCredential) {
    return __async(this, null, function* () {
      _assert(
        this.enrollmentId !== void 0 && this.otp !== void 0,
        auth,
        "argument-error"
        /* AuthErrorCode.ARGUMENT_ERROR */
      );
      const totpVerificationInfo = { verificationCode: this.otp };
      return finalizeSignInTotpMfa(auth, {
        mfaPendingCredential,
        mfaEnrollmentId: this.enrollmentId,
        totpVerificationInfo
      });
    });
  }
};
var TotpSecret = class _TotpSecret {
  // The public members are declared outside the constructor so the docs can be generated.
  constructor(secretKey, hashingAlgorithm, codeLength, codeIntervalSeconds, enrollmentCompletionDeadline, sessionInfo, auth) {
    this.sessionInfo = sessionInfo;
    this.auth = auth;
    this.secretKey = secretKey;
    this.hashingAlgorithm = hashingAlgorithm;
    this.codeLength = codeLength;
    this.codeIntervalSeconds = codeIntervalSeconds;
    this.enrollmentCompletionDeadline = enrollmentCompletionDeadline;
  }
  /** @internal */
  static _fromStartTotpMfaEnrollmentResponse(response, auth) {
    return new _TotpSecret(response.totpSessionInfo.sharedSecretKey, response.totpSessionInfo.hashingAlgorithm, response.totpSessionInfo.verificationCodeLength, response.totpSessionInfo.periodSec, new Date(response.totpSessionInfo.finalizeEnrollmentTime).toUTCString(), response.totpSessionInfo.sessionInfo, auth);
  }
  /** @internal */
  _makeTotpVerificationInfo(otp) {
    return { sessionInfo: this.sessionInfo, verificationCode: otp };
  }
  /**
   * Returns a QR code URL as described in
   * https://github.com/google/google-authenticator/wiki/Key-Uri-Format
   * This can be displayed to the user as a QR code to be scanned into a TOTP app like Google Authenticator.
   * If the optional parameters are unspecified, an accountName of <userEmail> and issuer of <firebaseAppName> are used.
   *
   * @param accountName the name of the account/app along with a user identifier.
   * @param issuer issuer of the TOTP (likely the app name).
   * @returns A QR code URL string.
   */
  generateQrCodeUrl(accountName, issuer) {
    var _a;
    let useDefaults = false;
    if (_isEmptyString(accountName) || _isEmptyString(issuer)) {
      useDefaults = true;
    }
    if (useDefaults) {
      if (_isEmptyString(accountName)) {
        accountName = ((_a = this.auth.currentUser) === null || _a === void 0 ? void 0 : _a.email) || "unknownuser";
      }
      if (_isEmptyString(issuer)) {
        issuer = this.auth.name;
      }
    }
    return `otpauth://totp/${issuer}:${accountName}?secret=${this.secretKey}&issuer=${issuer}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`;
  }
};
function _isEmptyString(input) {
  return typeof input === "undefined" || (input === null || input === void 0 ? void 0 : input.length) === 0;
}
var name = "@firebase/auth";
var version = "1.5.1";
var AuthInterop = class {
  constructor(auth) {
    this.auth = auth;
    this.internalListeners = /* @__PURE__ */ new Map();
  }
  getUid() {
    var _a;
    this.assertAuthConfigured();
    return ((_a = this.auth.currentUser) === null || _a === void 0 ? void 0 : _a.uid) || null;
  }
  getToken(forceRefresh) {
    return __async(this, null, function* () {
      this.assertAuthConfigured();
      yield this.auth._initializationPromise;
      if (!this.auth.currentUser) {
        return null;
      }
      const accessToken = yield this.auth.currentUser.getIdToken(forceRefresh);
      return { accessToken };
    });
  }
  addAuthTokenListener(listener) {
    this.assertAuthConfigured();
    if (this.internalListeners.has(listener)) {
      return;
    }
    const unsubscribe = this.auth.onIdTokenChanged((user3) => {
      listener((user3 === null || user3 === void 0 ? void 0 : user3.stsTokenManager.accessToken) || null);
    });
    this.internalListeners.set(listener, unsubscribe);
    this.updateProactiveRefresh();
  }
  removeAuthTokenListener(listener) {
    this.assertAuthConfigured();
    const unsubscribe = this.internalListeners.get(listener);
    if (!unsubscribe) {
      return;
    }
    this.internalListeners.delete(listener);
    unsubscribe();
    this.updateProactiveRefresh();
  }
  assertAuthConfigured() {
    _assert(
      this.auth._initializationPromise,
      "dependent-sdk-initialized-before-auth"
      /* AuthErrorCode.DEPENDENT_SDK_INIT_BEFORE_AUTH */
    );
  }
  updateProactiveRefresh() {
    if (this.internalListeners.size > 0) {
      this.auth._startProactiveRefresh();
    } else {
      this.auth._stopProactiveRefresh();
    }
  }
};
function getVersionForPlatform(clientPlatform) {
  switch (clientPlatform) {
    case "Node":
      return "node";
    case "ReactNative":
      return "rn";
    case "Worker":
      return "webworker";
    case "Cordova":
      return "cordova";
    default:
      return void 0;
  }
}
function registerAuth(clientPlatform) {
  _registerComponent(new Component(
    "auth",
    (container, { options: deps }) => {
      const app = container.getProvider("app").getImmediate();
      const heartbeatServiceProvider = container.getProvider("heartbeat");
      const appCheckServiceProvider = container.getProvider("app-check-internal");
      const { apiKey, authDomain } = app.options;
      _assert(apiKey && !apiKey.includes(":"), "invalid-api-key", { appName: app.name });
      const config = {
        apiKey,
        authDomain,
        clientPlatform,
        apiHost: "identitytoolkit.googleapis.com",
        tokenApiHost: "securetoken.googleapis.com",
        apiScheme: "https",
        sdkClientVersion: _getClientVersion(clientPlatform)
      };
      const authInstance = new AuthImpl(app, heartbeatServiceProvider, appCheckServiceProvider, config);
      _initializeAuthInstance(authInstance, deps);
      return authInstance;
    },
    "PUBLIC"
    /* ComponentType.PUBLIC */
  ).setInstantiationMode(
    "EXPLICIT"
    /* InstantiationMode.EXPLICIT */
  ).setInstanceCreatedCallback((container, _instanceIdentifier, _instance) => {
    const authInternalProvider = container.getProvider(
      "auth-internal"
      /* _ComponentName.AUTH_INTERNAL */
    );
    authInternalProvider.initialize();
  }));
  _registerComponent(new Component(
    "auth-internal",
    (container) => {
      const auth = _castAuth(container.getProvider(
        "auth"
        /* _ComponentName.AUTH */
      ).getImmediate());
      return ((auth2) => new AuthInterop(auth2))(auth);
    },
    "PRIVATE"
    /* ComponentType.PRIVATE */
  ).setInstantiationMode(
    "EXPLICIT"
    /* InstantiationMode.EXPLICIT */
  ));
  registerVersion(name, version, getVersionForPlatform(clientPlatform));
  registerVersion(name, version, "esm2017");
}
var DEFAULT_ID_TOKEN_MAX_AGE = 5 * 60;
var authIdTokenMaxAge = getExperimentalSetting("authIdTokenMaxAge") || DEFAULT_ID_TOKEN_MAX_AGE;
var lastPostedIdToken = null;
var mintCookieFactory = (url) => (user3) => __async(void 0, null, function* () {
  const idTokenResult = user3 && (yield user3.getIdTokenResult());
  const idTokenAge = idTokenResult && ((/* @__PURE__ */ new Date()).getTime() - Date.parse(idTokenResult.issuedAtTime)) / 1e3;
  if (idTokenAge && idTokenAge > authIdTokenMaxAge) {
    return;
  }
  const idToken3 = idTokenResult === null || idTokenResult === void 0 ? void 0 : idTokenResult.token;
  if (lastPostedIdToken === idToken3) {
    return;
  }
  lastPostedIdToken = idToken3;
  yield fetch(url, {
    method: idToken3 ? "POST" : "DELETE",
    headers: idToken3 ? {
      "Authorization": `Bearer ${idToken3}`
    } : {}
  });
});
function getAuth(app = getApp()) {
  const provider = _getProvider(app, "auth");
  if (provider.isInitialized()) {
    return provider.getImmediate();
  }
  const auth = initializeAuth(app, {
    popupRedirectResolver: browserPopupRedirectResolver,
    persistence: [
      indexedDBLocalPersistence,
      browserLocalPersistence,
      browserSessionPersistence
    ]
  });
  const authTokenSyncUrl = getExperimentalSetting("authTokenSyncURL");
  if (authTokenSyncUrl) {
    const mintCookie = mintCookieFactory(authTokenSyncUrl);
    beforeAuthStateChanged(auth, mintCookie, () => mintCookie(auth.currentUser));
    onIdTokenChanged(auth, (user3) => mintCookie(user3));
  }
  const authEmulatorHost = getDefaultEmulatorHost("auth");
  if (authEmulatorHost) {
    connectAuthEmulator(auth, `http://${authEmulatorHost}`);
  }
  return auth;
}
registerAuth(
  "Browser"
  /* ClientPlatform.BROWSER */
);

// node_modules/rxfire/auth/index.esm.js
function authState(auth) {
  return new Observable(function(subscriber) {
    var unsubscribe = onAuthStateChanged(auth, subscriber.next.bind(subscriber), subscriber.error.bind(subscriber), subscriber.complete.bind(subscriber));
    return { unsubscribe };
  });
}
function user(auth) {
  return new Observable(function(subscriber) {
    var unsubscribe = onIdTokenChanged(auth, subscriber.next.bind(subscriber), subscriber.error.bind(subscriber), subscriber.complete.bind(subscriber));
    return { unsubscribe };
  });
}
function idToken(auth) {
  return user(auth).pipe(switchMap(function(user3) {
    return user3 ? from(getIdToken(user3)) : of(null);
  }));
}

// node_modules/@angular/fire/fesm2022/angular-fire-auth.mjs
var AUTH_PROVIDER_NAME = "auth";
var Auth = class {
  constructor(auth) {
    return auth;
  }
};
var AuthInstances = class {
  constructor() {
    return ɵgetAllInstancesOf(AUTH_PROVIDER_NAME);
  }
};
var authInstance$ = timer(0, 300).pipe(concatMap(() => from(ɵgetAllInstancesOf(AUTH_PROVIDER_NAME))), distinct());
var PROVIDED_AUTH_INSTANCES = new InjectionToken("angularfire2.auth-instances");
function defaultAuthInstanceFactory(provided, defaultApp) {
  const defaultAuth = ɵgetDefaultInstanceOf(AUTH_PROVIDER_NAME, provided, defaultApp);
  return defaultAuth && new Auth(defaultAuth);
}
var AUTH_INSTANCES_PROVIDER = {
  provide: AuthInstances,
  deps: [[new Optional(), PROVIDED_AUTH_INSTANCES]]
};
var DEFAULT_AUTH_INSTANCE_PROVIDER = {
  provide: Auth,
  useFactory: defaultAuthInstanceFactory,
  deps: [[new Optional(), PROVIDED_AUTH_INSTANCES], FirebaseApp]
};
var AuthModule = class _AuthModule {
  constructor() {
    registerVersion("angularfire", VERSION.full, "auth");
  }
  static ɵfac = function AuthModule_Factory(t) {
    return new (t || _AuthModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _AuthModule
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [DEFAULT_AUTH_INSTANCE_PROVIDER, AUTH_INSTANCES_PROVIDER]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AuthModule, [{
    type: NgModule,
    args: [{
      providers: [DEFAULT_AUTH_INSTANCE_PROVIDER, AUTH_INSTANCES_PROVIDER]
    }]
  }], () => [], null);
})();
var authState2 = ɵzoneWrap(authState, true);
var user2 = ɵzoneWrap(user, true);
var idToken2 = ɵzoneWrap(idToken, true);
var applyActionCode2 = ɵzoneWrap(applyActionCode, true);
var beforeAuthStateChanged2 = ɵzoneWrap(beforeAuthStateChanged, true);
var checkActionCode2 = ɵzoneWrap(checkActionCode, true);
var confirmPasswordReset2 = ɵzoneWrap(confirmPasswordReset, true);
var connectAuthEmulator2 = ɵzoneWrap(connectAuthEmulator, true);
var createUserWithEmailAndPassword2 = ɵzoneWrap(createUserWithEmailAndPassword, true);
var deleteUser2 = ɵzoneWrap(deleteUser, true);
var fetchSignInMethodsForEmail2 = ɵzoneWrap(fetchSignInMethodsForEmail, true);
var getAdditionalUserInfo2 = ɵzoneWrap(getAdditionalUserInfo, true);
var getAuth2 = ɵzoneWrap(getAuth, true);
var getIdToken2 = ɵzoneWrap(getIdToken, true);
var getIdTokenResult2 = ɵzoneWrap(getIdTokenResult, true);
var getMultiFactorResolver2 = ɵzoneWrap(getMultiFactorResolver, true);
var getRedirectResult2 = ɵzoneWrap(getRedirectResult, true);
var initializeAuth2 = ɵzoneWrap(initializeAuth, true);
var initializeRecaptchaConfig2 = ɵzoneWrap(initializeRecaptchaConfig, true);
var isSignInWithEmailLink2 = ɵzoneWrap(isSignInWithEmailLink, true);
var linkWithCredential2 = ɵzoneWrap(linkWithCredential, true);
var linkWithPhoneNumber2 = ɵzoneWrap(linkWithPhoneNumber, true);
var linkWithPopup2 = ɵzoneWrap(linkWithPopup, true);
var linkWithRedirect2 = ɵzoneWrap(linkWithRedirect, true);
var multiFactor2 = ɵzoneWrap(multiFactor, true);
var onAuthStateChanged2 = ɵzoneWrap(onAuthStateChanged, true);
var onIdTokenChanged2 = ɵzoneWrap(onIdTokenChanged, true);
var parseActionCodeURL2 = ɵzoneWrap(parseActionCodeURL, true);
var reauthenticateWithCredential2 = ɵzoneWrap(reauthenticateWithCredential, true);
var reauthenticateWithPhoneNumber2 = ɵzoneWrap(reauthenticateWithPhoneNumber, true);
var reauthenticateWithPopup2 = ɵzoneWrap(reauthenticateWithPopup, true);
var reauthenticateWithRedirect2 = ɵzoneWrap(reauthenticateWithRedirect, true);
var reload2 = ɵzoneWrap(reload, true);
var revokeAccessToken2 = ɵzoneWrap(revokeAccessToken, true);
var sendEmailVerification2 = ɵzoneWrap(sendEmailVerification, true);
var sendPasswordResetEmail2 = ɵzoneWrap(sendPasswordResetEmail, true);
var sendSignInLinkToEmail2 = ɵzoneWrap(sendSignInLinkToEmail, true);
var setPersistence2 = ɵzoneWrap(setPersistence, true);
var signInAnonymously2 = ɵzoneWrap(signInAnonymously, true);
var signInWithCredential2 = ɵzoneWrap(signInWithCredential, true);
var signInWithCustomToken2 = ɵzoneWrap(signInWithCustomToken, true);
var signInWithEmailAndPassword2 = ɵzoneWrap(signInWithEmailAndPassword, true);
var signInWithEmailLink2 = ɵzoneWrap(signInWithEmailLink, true);
var signInWithPhoneNumber2 = ɵzoneWrap(signInWithPhoneNumber, true);
var signInWithPopup2 = ɵzoneWrap(signInWithPopup, true);
var signInWithRedirect2 = ɵzoneWrap(signInWithRedirect, true);
var signOut2 = ɵzoneWrap(signOut, true);
var unlink2 = ɵzoneWrap(unlink, true);
var updateCurrentUser2 = ɵzoneWrap(updateCurrentUser, true);
var updateEmail2 = ɵzoneWrap(updateEmail, true);
var updatePassword2 = ɵzoneWrap(updatePassword, true);
var updatePhoneNumber2 = ɵzoneWrap(updatePhoneNumber, true);
var updateProfile2 = ɵzoneWrap(updateProfile, true);
var useDeviceLanguage2 = ɵzoneWrap(useDeviceLanguage, true);
var validatePassword2 = ɵzoneWrap(validatePassword, true);
var verifyBeforeUpdateEmail2 = ɵzoneWrap(verifyBeforeUpdateEmail, true);
var verifyPasswordResetCode2 = ɵzoneWrap(verifyPasswordResetCode, true);

// node_modules/@firebase/webchannel-wrapper/dist/esm/index.esm2017.js
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var esm = {};
var k;
var goog = goog || {};
var l = commonjsGlobal || self;
function aa(a) {
  var b2 = typeof a;
  b2 = "object" != b2 ? b2 : a ? Array.isArray(a) ? "array" : b2 : "null";
  return "array" == b2 || "object" == b2 && "number" == typeof a.length;
}
function p(a) {
  var b2 = typeof a;
  return "object" == b2 && null != a || "function" == b2;
}
function ba(a) {
  return Object.prototype.hasOwnProperty.call(a, ca) && a[ca] || (a[ca] = ++da);
}
var ca = "closure_uid_" + (1e9 * Math.random() >>> 0);
var da = 0;
function ea(a, b2, c) {
  return a.call.apply(a.bind, arguments);
}
function fa(a, b2, c) {
  if (!a)
    throw Error();
  if (2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var e = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(e, d);
      return a.apply(b2, e);
    };
  }
  return function() {
    return a.apply(b2, arguments);
  };
}
function q(a, b2, c) {
  Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? q = ea : q = fa;
  return q.apply(null, arguments);
}
function ha(a, b2) {
  var c = Array.prototype.slice.call(arguments, 1);
  return function() {
    var d = c.slice();
    d.push.apply(d, arguments);
    return a.apply(this, d);
  };
}
function r(a, b2) {
  function c() {
  }
  c.prototype = b2.prototype;
  a.$ = b2.prototype;
  a.prototype = new c();
  a.prototype.constructor = a;
  a.ac = function(d, e, f) {
    for (var h = Array(arguments.length - 2), n = 2; n < arguments.length; n++)
      h[n - 2] = arguments[n];
    return b2.prototype[e].apply(d, h);
  };
}
function v() {
  this.s = this.s;
  this.o = this.o;
}
var ia = 0;
v.prototype.s = false;
v.prototype.sa = function() {
  if (!this.s && (this.s = true, this.N(), 0 != ia)) {
    ba(this);
  }
};
v.prototype.N = function() {
  if (this.o)
    for (; this.o.length; )
      this.o.shift()();
};
var ka = Array.prototype.indexOf ? function(a, b2) {
  return Array.prototype.indexOf.call(a, b2, void 0);
} : function(a, b2) {
  if ("string" === typeof a)
    return "string" !== typeof b2 || 1 != b2.length ? -1 : a.indexOf(b2, 0);
  for (let c = 0; c < a.length; c++)
    if (c in a && a[c] === b2)
      return c;
  return -1;
};
function ma(a) {
  const b2 = a.length;
  if (0 < b2) {
    const c = Array(b2);
    for (let d = 0; d < b2; d++)
      c[d] = a[d];
    return c;
  }
  return [];
}
function na(a, b2) {
  for (let c = 1; c < arguments.length; c++) {
    const d = arguments[c];
    if (aa(d)) {
      const e = a.length || 0, f = d.length || 0;
      a.length = e + f;
      for (let h = 0; h < f; h++)
        a[e + h] = d[h];
    } else
      a.push(d);
  }
}
function w(a, b2) {
  this.type = a;
  this.g = this.target = b2;
  this.defaultPrevented = false;
}
w.prototype.h = function() {
  this.defaultPrevented = true;
};
var oa = function() {
  if (!l.addEventListener || !Object.defineProperty)
    return false;
  var a = false, b2 = Object.defineProperty({}, "passive", { get: function() {
    a = true;
  } });
  try {
    const c = () => {
    };
    l.addEventListener("test", c, b2);
    l.removeEventListener("test", c, b2);
  } catch (c) {
  }
  return a;
}();
function x(a) {
  return /^[\s\xa0]*$/.test(a);
}
function pa() {
  var a = l.navigator;
  return a && (a = a.userAgent) ? a : "";
}
function y(a) {
  return -1 != pa().indexOf(a);
}
function qa(a) {
  qa[" "](a);
  return a;
}
qa[" "] = function() {
};
function ra(a, b2) {
  var c = sa;
  return Object.prototype.hasOwnProperty.call(c, a) ? c[a] : c[a] = b2(a);
}
var ta = y("Opera");
var z = y("Trident") || y("MSIE");
var ua = y("Edge");
var va = ua || z;
var wa = y("Gecko") && !(-1 != pa().toLowerCase().indexOf("webkit") && !y("Edge")) && !(y("Trident") || y("MSIE")) && !y("Edge");
var xa = -1 != pa().toLowerCase().indexOf("webkit") && !y("Edge");
function ya() {
  var a = l.document;
  return a ? a.documentMode : void 0;
}
var za;
a: {
  Aa = "", Ba = function() {
    var a = pa();
    if (wa)
      return /rv:([^\);]+)(\)|;)/.exec(a);
    if (ua)
      return /Edge\/([\d\.]+)/.exec(a);
    if (z)
      return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
    if (xa)
      return /WebKit\/(\S+)/.exec(a);
    if (ta)
      return /(?:Version)[ \/]?(\S+)/.exec(a);
  }();
  Ba && (Aa = Ba ? Ba[1] : "");
  if (z) {
    Ca = ya();
    if (null != Ca && Ca > parseFloat(Aa)) {
      za = String(Ca);
      break a;
    }
  }
  za = Aa;
}
var Aa;
var Ba;
var Ca;
var Da;
if (l.document && z) {
  Ea = ya();
  Da = Ea ? Ea : parseInt(za, 10) || void 0;
} else
  Da = void 0;
var Ea;
var Fa = Da;
function A(a, b2) {
  w.call(this, a ? a.type : "");
  this.relatedTarget = this.g = this.target = null;
  this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;
  this.key = "";
  this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = false;
  this.state = null;
  this.pointerId = 0;
  this.pointerType = "";
  this.i = null;
  if (a) {
    var c = this.type = a.type, d = a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : null;
    this.target = a.target || a.srcElement;
    this.g = b2;
    if (b2 = a.relatedTarget) {
      if (wa) {
        a: {
          try {
            qa(b2.nodeName);
            var e = true;
            break a;
          } catch (f) {
          }
          e = false;
        }
        e || (b2 = null);
      }
    } else
      "mouseover" == c ? b2 = a.fromElement : "mouseout" == c && (b2 = a.toElement);
    this.relatedTarget = b2;
    d ? (this.clientX = void 0 !== d.clientX ? d.clientX : d.pageX, this.clientY = void 0 !== d.clientY ? d.clientY : d.pageY, this.screenX = d.screenX || 0, this.screenY = d.screenY || 0) : (this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX, this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY, this.screenX = a.screenX || 0, this.screenY = a.screenY || 0);
    this.button = a.button;
    this.key = a.key || "";
    this.ctrlKey = a.ctrlKey;
    this.altKey = a.altKey;
    this.shiftKey = a.shiftKey;
    this.metaKey = a.metaKey;
    this.pointerId = a.pointerId || 0;
    this.pointerType = "string" === typeof a.pointerType ? a.pointerType : Ga[a.pointerType] || "";
    this.state = a.state;
    this.i = a;
    a.defaultPrevented && A.$.h.call(this);
  }
}
r(A, w);
var Ga = { 2: "touch", 3: "pen", 4: "mouse" };
A.prototype.h = function() {
  A.$.h.call(this);
  var a = this.i;
  a.preventDefault ? a.preventDefault() : a.returnValue = false;
};
var Ha = "closure_listenable_" + (1e6 * Math.random() | 0);
var Ia = 0;
function Ja(a, b2, c, d, e) {
  this.listener = a;
  this.proxy = null;
  this.src = b2;
  this.type = c;
  this.capture = !!d;
  this.la = e;
  this.key = ++Ia;
  this.fa = this.ia = false;
}
function Ma(a) {
  a.fa = true;
  a.listener = null;
  a.proxy = null;
  a.src = null;
  a.la = null;
}
function Na(a, b2, c) {
  for (const d in a)
    b2.call(c, a[d], d, a);
}
function Oa(a, b2) {
  for (const c in a)
    b2.call(void 0, a[c], c, a);
}
function Pa(a) {
  const b2 = {};
  for (const c in a)
    b2[c] = a[c];
  return b2;
}
var Qa = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function Ra(a, b2) {
  let c, d;
  for (let e = 1; e < arguments.length; e++) {
    d = arguments[e];
    for (c in d)
      a[c] = d[c];
    for (let f = 0; f < Qa.length; f++)
      c = Qa[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
  }
}
function Sa(a) {
  this.src = a;
  this.g = {};
  this.h = 0;
}
Sa.prototype.add = function(a, b2, c, d, e) {
  var f = a.toString();
  a = this.g[f];
  a || (a = this.g[f] = [], this.h++);
  var h = Ta(a, b2, d, e);
  -1 < h ? (b2 = a[h], c || (b2.ia = false)) : (b2 = new Ja(b2, this.src, f, !!d, e), b2.ia = c, a.push(b2));
  return b2;
};
function Ua(a, b2) {
  var c = b2.type;
  if (c in a.g) {
    var d = a.g[c], e = ka(d, b2), f;
    (f = 0 <= e) && Array.prototype.splice.call(d, e, 1);
    f && (Ma(b2), 0 == a.g[c].length && (delete a.g[c], a.h--));
  }
}
function Ta(a, b2, c, d) {
  for (var e = 0; e < a.length; ++e) {
    var f = a[e];
    if (!f.fa && f.listener == b2 && f.capture == !!c && f.la == d)
      return e;
  }
  return -1;
}
var Va = "closure_lm_" + (1e6 * Math.random() | 0);
var Wa = {};
function Ya(a, b2, c, d, e) {
  if (d && d.once)
    return Za(a, b2, c, d, e);
  if (Array.isArray(b2)) {
    for (var f = 0; f < b2.length; f++)
      Ya(a, b2[f], c, d, e);
    return null;
  }
  c = $a(c);
  return a && a[Ha] ? a.O(b2, c, p(d) ? !!d.capture : !!d, e) : ab(a, b2, c, false, d, e);
}
function ab(a, b2, c, d, e, f) {
  if (!b2)
    throw Error("Invalid event type");
  var h = p(e) ? !!e.capture : !!e, n = bb(a);
  n || (a[Va] = n = new Sa(a));
  c = n.add(b2, c, d, h, f);
  if (c.proxy)
    return c;
  d = cb();
  c.proxy = d;
  d.src = a;
  d.listener = c;
  if (a.addEventListener)
    oa || (e = h), void 0 === e && (e = false), a.addEventListener(b2.toString(), d, e);
  else if (a.attachEvent)
    a.attachEvent(db(b2.toString()), d);
  else if (a.addListener && a.removeListener)
    a.addListener(d);
  else
    throw Error("addEventListener and attachEvent are unavailable.");
  return c;
}
function cb() {
  function a(c) {
    return b2.call(a.src, a.listener, c);
  }
  const b2 = eb;
  return a;
}
function Za(a, b2, c, d, e) {
  if (Array.isArray(b2)) {
    for (var f = 0; f < b2.length; f++)
      Za(a, b2[f], c, d, e);
    return null;
  }
  c = $a(c);
  return a && a[Ha] ? a.P(b2, c, p(d) ? !!d.capture : !!d, e) : ab(a, b2, c, true, d, e);
}
function fb(a, b2, c, d, e) {
  if (Array.isArray(b2))
    for (var f = 0; f < b2.length; f++)
      fb(a, b2[f], c, d, e);
  else
    (d = p(d) ? !!d.capture : !!d, c = $a(c), a && a[Ha]) ? (a = a.i, b2 = String(b2).toString(), b2 in a.g && (f = a.g[b2], c = Ta(f, c, d, e), -1 < c && (Ma(f[c]), Array.prototype.splice.call(f, c, 1), 0 == f.length && (delete a.g[b2], a.h--)))) : a && (a = bb(a)) && (b2 = a.g[b2.toString()], a = -1, b2 && (a = Ta(b2, c, d, e)), (c = -1 < a ? b2[a] : null) && gb(c));
}
function gb(a) {
  if ("number" !== typeof a && a && !a.fa) {
    var b2 = a.src;
    if (b2 && b2[Ha])
      Ua(b2.i, a);
    else {
      var c = a.type, d = a.proxy;
      b2.removeEventListener ? b2.removeEventListener(c, d, a.capture) : b2.detachEvent ? b2.detachEvent(db(c), d) : b2.addListener && b2.removeListener && b2.removeListener(d);
      (c = bb(b2)) ? (Ua(c, a), 0 == c.h && (c.src = null, b2[Va] = null)) : Ma(a);
    }
  }
}
function db(a) {
  return a in Wa ? Wa[a] : Wa[a] = "on" + a;
}
function eb(a, b2) {
  if (a.fa)
    a = true;
  else {
    b2 = new A(b2, this);
    var c = a.listener, d = a.la || a.src;
    a.ia && gb(a);
    a = c.call(d, b2);
  }
  return a;
}
function bb(a) {
  a = a[Va];
  return a instanceof Sa ? a : null;
}
var hb = "__closure_events_fn_" + (1e9 * Math.random() >>> 0);
function $a(a) {
  if ("function" === typeof a)
    return a;
  a[hb] || (a[hb] = function(b2) {
    return a.handleEvent(b2);
  });
  return a[hb];
}
function B() {
  v.call(this);
  this.i = new Sa(this);
  this.S = this;
  this.J = null;
}
r(B, v);
B.prototype[Ha] = true;
B.prototype.removeEventListener = function(a, b2, c, d) {
  fb(this, a, b2, c, d);
};
function C(a, b2) {
  var c, d = a.J;
  if (d)
    for (c = []; d; d = d.J)
      c.push(d);
  a = a.S;
  d = b2.type || b2;
  if ("string" === typeof b2)
    b2 = new w(b2, a);
  else if (b2 instanceof w)
    b2.target = b2.target || a;
  else {
    var e = b2;
    b2 = new w(d, a);
    Ra(b2, e);
  }
  e = true;
  if (c)
    for (var f = c.length - 1; 0 <= f; f--) {
      var h = b2.g = c[f];
      e = ib(h, d, true, b2) && e;
    }
  h = b2.g = a;
  e = ib(h, d, true, b2) && e;
  e = ib(h, d, false, b2) && e;
  if (c)
    for (f = 0; f < c.length; f++)
      h = b2.g = c[f], e = ib(h, d, false, b2) && e;
}
B.prototype.N = function() {
  B.$.N.call(this);
  if (this.i) {
    var a = this.i, c;
    for (c in a.g) {
      for (var d = a.g[c], e = 0; e < d.length; e++)
        Ma(d[e]);
      delete a.g[c];
      a.h--;
    }
  }
  this.J = null;
};
B.prototype.O = function(a, b2, c, d) {
  return this.i.add(String(a), b2, false, c, d);
};
B.prototype.P = function(a, b2, c, d) {
  return this.i.add(String(a), b2, true, c, d);
};
function ib(a, b2, c, d) {
  b2 = a.i.g[String(b2)];
  if (!b2)
    return true;
  b2 = b2.concat();
  for (var e = true, f = 0; f < b2.length; ++f) {
    var h = b2[f];
    if (h && !h.fa && h.capture == c) {
      var n = h.listener, t = h.la || h.src;
      h.ia && Ua(a.i, h);
      e = false !== n.call(t, d) && e;
    }
  }
  return e && !d.defaultPrevented;
}
var jb = l.JSON.stringify;
var kb = class {
  constructor(a, b2) {
    this.i = a;
    this.j = b2;
    this.h = 0;
    this.g = null;
  }
  get() {
    let a;
    0 < this.h ? (this.h--, a = this.g, this.g = a.next, a.next = null) : a = this.i();
    return a;
  }
};
function lb() {
  var a = mb;
  let b2 = null;
  a.g && (b2 = a.g, a.g = a.g.next, a.g || (a.h = null), b2.next = null);
  return b2;
}
var nb = class {
  constructor() {
    this.h = this.g = null;
  }
  add(a, b2) {
    const c = ob.get();
    c.set(a, b2);
    this.h ? this.h.next = c : this.g = c;
    this.h = c;
  }
};
var ob = new kb(() => new pb(), (a) => a.reset());
var pb = class {
  constructor() {
    this.next = this.g = this.h = null;
  }
  set(a, b2) {
    this.h = a;
    this.g = b2;
    this.next = null;
  }
  reset() {
    this.next = this.g = this.h = null;
  }
};
function qb(a) {
  var b2 = 1;
  a = a.split(":");
  const c = [];
  for (; 0 < b2 && a.length; )
    c.push(a.shift()), b2--;
  a.length && c.push(a.join(":"));
  return c;
}
function rb(a) {
  l.setTimeout(() => {
    throw a;
  }, 0);
}
var sb;
var tb = false;
var mb = new nb();
var vb = () => {
  const a = l.Promise.resolve(void 0);
  sb = () => {
    a.then(ub);
  };
};
var ub = () => {
  for (var a; a = lb(); ) {
    try {
      a.h.call(a.g);
    } catch (c) {
      rb(c);
    }
    var b2 = ob;
    b2.j(a);
    100 > b2.h && (b2.h++, a.next = b2.g, b2.g = a);
  }
  tb = false;
};
function wb(a, b2) {
  B.call(this);
  this.h = a || 1;
  this.g = b2 || l;
  this.j = q(this.qb, this);
  this.l = Date.now();
}
r(wb, B);
k = wb.prototype;
k.ga = false;
k.T = null;
k.qb = function() {
  if (this.ga) {
    var a = Date.now() - this.l;
    0 < a && a < 0.8 * this.h ? this.T = this.g.setTimeout(this.j, this.h - a) : (this.T && (this.g.clearTimeout(this.T), this.T = null), C(this, "tick"), this.ga && (xb(this), this.start()));
  }
};
k.start = function() {
  this.ga = true;
  this.T || (this.T = this.g.setTimeout(this.j, this.h), this.l = Date.now());
};
function xb(a) {
  a.ga = false;
  a.T && (a.g.clearTimeout(a.T), a.T = null);
}
k.N = function() {
  wb.$.N.call(this);
  xb(this);
  delete this.g;
};
function yb(a, b2, c) {
  if ("function" === typeof a)
    c && (a = q(a, c));
  else if (a && "function" == typeof a.handleEvent)
    a = q(a.handleEvent, a);
  else
    throw Error("Invalid listener argument");
  return 2147483647 < Number(b2) ? -1 : l.setTimeout(a, b2 || 0);
}
function zb(a) {
  a.g = yb(() => {
    a.g = null;
    a.i && (a.i = false, zb(a));
  }, a.j);
  const b2 = a.h;
  a.h = null;
  a.m.apply(null, b2);
}
var Ab = class extends v {
  constructor(a, b2) {
    super();
    this.m = a;
    this.j = b2;
    this.h = null;
    this.i = false;
    this.g = null;
  }
  l(a) {
    this.h = arguments;
    this.g ? this.i = true : zb(this);
  }
  N() {
    super.N();
    this.g && (l.clearTimeout(this.g), this.g = null, this.i = false, this.h = null);
  }
};
function Bb(a) {
  v.call(this);
  this.h = a;
  this.g = {};
}
r(Bb, v);
var Cb = [];
function Eb(a, b2, c, d) {
  Array.isArray(c) || (c && (Cb[0] = c.toString()), c = Cb);
  for (var e = 0; e < c.length; e++) {
    var f = Ya(b2, c[e], d || a.handleEvent, false, a.h || a);
    if (!f)
      break;
    a.g[f.key] = f;
  }
}
function Fb(a) {
  Na(a.g, function(b2, c) {
    this.g.hasOwnProperty(c) && gb(b2);
  }, a);
  a.g = {};
}
Bb.prototype.N = function() {
  Bb.$.N.call(this);
  Fb(this);
};
Bb.prototype.handleEvent = function() {
  throw Error("EventHandler.handleEvent not implemented");
};
function Gb() {
  this.g = true;
}
Gb.prototype.Ea = function() {
  this.g = false;
};
function Hb(a, b2, c, d, e, f) {
  a.info(function() {
    if (a.g)
      if (f) {
        var h = "";
        for (var n = f.split("&"), t = 0; t < n.length; t++) {
          var m = n[t].split("=");
          if (1 < m.length) {
            var u = m[0];
            m = m[1];
            var L2 = u.split("_");
            h = 2 <= L2.length && "type" == L2[1] ? h + (u + "=" + m + "&") : h + (u + "=redacted&");
          }
        }
      } else
        h = null;
    else
      h = f;
    return "XMLHTTP REQ (" + d + ") [attempt " + e + "]: " + b2 + "\n" + c + "\n" + h;
  });
}
function Ib(a, b2, c, d, e, f, h) {
  a.info(function() {
    return "XMLHTTP RESP (" + d + ") [ attempt " + e + "]: " + b2 + "\n" + c + "\n" + f + " " + h;
  });
}
function D(a, b2, c, d) {
  a.info(function() {
    return "XMLHTTP TEXT (" + b2 + "): " + Jb(a, c) + (d ? " " + d : "");
  });
}
function Kb(a, b2) {
  a.info(function() {
    return "TIMEOUT: " + b2;
  });
}
Gb.prototype.info = function() {
};
function Jb(a, b2) {
  if (!a.g)
    return b2;
  if (!b2)
    return null;
  try {
    var c = JSON.parse(b2);
    if (c) {
      for (a = 0; a < c.length; a++)
        if (Array.isArray(c[a])) {
          var d = c[a];
          if (!(2 > d.length)) {
            var e = d[1];
            if (Array.isArray(e) && !(1 > e.length)) {
              var f = e[0];
              if ("noop" != f && "stop" != f && "close" != f)
                for (var h = 1; h < e.length; h++)
                  e[h] = "";
            }
          }
        }
    }
    return jb(c);
  } catch (n) {
    return b2;
  }
}
var E = {};
var Lb = null;
function Mb() {
  return Lb = Lb || new B();
}
E.Ta = "serverreachability";
function Nb(a) {
  w.call(this, E.Ta, a);
}
r(Nb, w);
function Ob(a) {
  const b2 = Mb();
  C(b2, new Nb(b2));
}
E.STAT_EVENT = "statevent";
function Pb(a, b2) {
  w.call(this, E.STAT_EVENT, a);
  this.stat = b2;
}
r(Pb, w);
function F(a) {
  const b2 = Mb();
  C(b2, new Pb(b2, a));
}
E.Ua = "timingevent";
function Qb(a, b2) {
  w.call(this, E.Ua, a);
  this.size = b2;
}
r(Qb, w);
function Rb(a, b2) {
  if ("function" !== typeof a)
    throw Error("Fn must not be null and must be a function");
  return l.setTimeout(function() {
    a();
  }, b2);
}
var Sb = { NO_ERROR: 0, rb: 1, Eb: 2, Db: 3, yb: 4, Cb: 5, Fb: 6, Qa: 7, TIMEOUT: 8, Ib: 9 };
var Tb = { wb: "complete", Sb: "success", Ra: "error", Qa: "abort", Kb: "ready", Lb: "readystatechange", TIMEOUT: "timeout", Gb: "incrementaldata", Jb: "progress", zb: "downloadprogress", $b: "uploadprogress" };
function Ub() {
}
Ub.prototype.h = null;
function Vb(a) {
  return a.h || (a.h = a.i());
}
function Wb() {
}
var Xb = { OPEN: "a", vb: "b", Ra: "c", Hb: "d" };
function Yb() {
  w.call(this, "d");
}
r(Yb, w);
function Zb() {
  w.call(this, "c");
}
r(Zb, w);
var $b;
function ac() {
}
r(ac, Ub);
ac.prototype.g = function() {
  return new XMLHttpRequest();
};
ac.prototype.i = function() {
  return {};
};
$b = new ac();
function bc(a, b2, c, d) {
  this.l = a;
  this.j = b2;
  this.m = c;
  this.W = d || 1;
  this.U = new Bb(this);
  this.P = cc;
  a = va ? 125 : void 0;
  this.V = new wb(a);
  this.I = null;
  this.i = false;
  this.u = this.B = this.A = this.L = this.G = this.Y = this.C = null;
  this.F = [];
  this.g = null;
  this.o = 0;
  this.s = this.v = null;
  this.ca = -1;
  this.J = false;
  this.O = 0;
  this.M = null;
  this.ba = this.K = this.aa = this.S = false;
  this.h = new dc();
}
function dc() {
  this.i = null;
  this.g = "";
  this.h = false;
}
var cc = 45e3;
var ec = {};
var fc = {};
k = bc.prototype;
k.setTimeout = function(a) {
  this.P = a;
};
function gc(a, b2, c) {
  a.L = 1;
  a.A = hc(G(b2));
  a.u = c;
  a.S = true;
  ic(a, null);
}
function ic(a, b2) {
  a.G = Date.now();
  jc(a);
  a.B = G(a.A);
  var c = a.B, d = a.W;
  Array.isArray(d) || (d = [String(d)]);
  kc(c.i, "t", d);
  a.o = 0;
  c = a.l.J;
  a.h = new dc();
  a.g = lc(a.l, c ? b2 : null, !a.u);
  0 < a.O && (a.M = new Ab(q(a.Pa, a, a.g), a.O));
  Eb(a.U, a.g, "readystatechange", a.nb);
  b2 = a.I ? Pa(a.I) : {};
  a.u ? (a.v || (a.v = "POST"), b2["Content-Type"] = "application/x-www-form-urlencoded", a.g.ha(a.B, a.v, a.u, b2)) : (a.v = "GET", a.g.ha(a.B, a.v, null, b2));
  Ob();
  Hb(a.j, a.v, a.B, a.m, a.W, a.u);
}
k.nb = function(a) {
  a = a.target;
  const b2 = this.M;
  b2 && 3 == H(a) ? b2.l() : this.Pa(a);
};
k.Pa = function(a) {
  try {
    if (a == this.g)
      a: {
        const u = H(this.g);
        var b2 = this.g.Ia();
        const L2 = this.g.da();
        if (!(3 > u) && (3 != u || va || this.g && (this.h.h || this.g.ja() || mc(this.g)))) {
          this.J || 4 != u || 7 == b2 || (8 == b2 || 0 >= L2 ? Ob(3) : Ob(2));
          nc(this);
          var c = this.g.da();
          this.ca = c;
          b:
            if (oc(this)) {
              var d = mc(this.g);
              a = "";
              var e = d.length, f = 4 == H(this.g);
              if (!this.h.i) {
                if ("undefined" === typeof TextDecoder) {
                  I(this);
                  pc(this);
                  var h = "";
                  break b;
                }
                this.h.i = new l.TextDecoder();
              }
              for (b2 = 0; b2 < e; b2++)
                this.h.h = true, a += this.h.i.decode(d[b2], { stream: f && b2 == e - 1 });
              d.length = 0;
              this.h.g += a;
              this.o = 0;
              h = this.h.g;
            } else
              h = this.g.ja();
          this.i = 200 == c;
          Ib(this.j, this.v, this.B, this.m, this.W, u, c);
          if (this.i) {
            if (this.aa && !this.K) {
              b: {
                if (this.g) {
                  var n, t = this.g;
                  if ((n = t.g ? t.g.getResponseHeader("X-HTTP-Initial-Response") : null) && !x(n)) {
                    var m = n;
                    break b;
                  }
                }
                m = null;
              }
              if (c = m)
                D(this.j, this.m, c, "Initial handshake response via X-HTTP-Initial-Response"), this.K = true, qc(this, c);
              else {
                this.i = false;
                this.s = 3;
                F(12);
                I(this);
                pc(this);
                break a;
              }
            }
            this.S ? (rc(this, u, h), va && this.i && 3 == u && (Eb(this.U, this.V, "tick", this.mb), this.V.start())) : (D(this.j, this.m, h, null), qc(this, h));
            4 == u && I(this);
            this.i && !this.J && (4 == u ? sc(this.l, this) : (this.i = false, jc(this)));
          } else
            tc(this.g), 400 == c && 0 < h.indexOf("Unknown SID") ? (this.s = 3, F(12)) : (this.s = 0, F(13)), I(this), pc(this);
        }
      }
  } catch (u) {
  } finally {
  }
};
function oc(a) {
  return a.g ? "GET" == a.v && 2 != a.L && a.l.Ha : false;
}
function rc(a, b2, c) {
  let d = true, e;
  for (; !a.J && a.o < c.length; )
    if (e = uc(a, c), e == fc) {
      4 == b2 && (a.s = 4, F(14), d = false);
      D(a.j, a.m, null, "[Incomplete Response]");
      break;
    } else if (e == ec) {
      a.s = 4;
      F(15);
      D(a.j, a.m, c, "[Invalid Chunk]");
      d = false;
      break;
    } else
      D(a.j, a.m, e, null), qc(a, e);
  oc(a) && 0 != a.o && (a.h.g = a.h.g.slice(a.o), a.o = 0);
  4 != b2 || 0 != c.length || a.h.h || (a.s = 1, F(16), d = false);
  a.i = a.i && d;
  d ? 0 < c.length && !a.ba && (a.ba = true, b2 = a.l, b2.g == a && b2.ca && !b2.M && (b2.l.info("Great, no buffering proxy detected. Bytes received: " + c.length), vc(b2), b2.M = true, F(11))) : (D(
    a.j,
    a.m,
    c,
    "[Invalid Chunked Response]"
  ), I(a), pc(a));
}
k.mb = function() {
  if (this.g) {
    var a = H(this.g), b2 = this.g.ja();
    this.o < b2.length && (nc(this), rc(this, a, b2), this.i && 4 != a && jc(this));
  }
};
function uc(a, b2) {
  var c = a.o, d = b2.indexOf("\n", c);
  if (-1 == d)
    return fc;
  c = Number(b2.substring(c, d));
  if (isNaN(c))
    return ec;
  d += 1;
  if (d + c > b2.length)
    return fc;
  b2 = b2.slice(d, d + c);
  a.o = d + c;
  return b2;
}
k.cancel = function() {
  this.J = true;
  I(this);
};
function jc(a) {
  a.Y = Date.now() + a.P;
  wc(a, a.P);
}
function wc(a, b2) {
  if (null != a.C)
    throw Error("WatchDog timer not null");
  a.C = Rb(q(a.lb, a), b2);
}
function nc(a) {
  a.C && (l.clearTimeout(a.C), a.C = null);
}
k.lb = function() {
  this.C = null;
  const a = Date.now();
  0 <= a - this.Y ? (Kb(this.j, this.B), 2 != this.L && (Ob(), F(17)), I(this), this.s = 2, pc(this)) : wc(this, this.Y - a);
};
function pc(a) {
  0 == a.l.H || a.J || sc(a.l, a);
}
function I(a) {
  nc(a);
  var b2 = a.M;
  b2 && "function" == typeof b2.sa && b2.sa();
  a.M = null;
  xb(a.V);
  Fb(a.U);
  a.g && (b2 = a.g, a.g = null, b2.abort(), b2.sa());
}
function qc(a, b2) {
  try {
    var c = a.l;
    if (0 != c.H && (c.g == a || xc(c.i, a))) {
      if (!a.K && xc(c.i, a) && 3 == c.H) {
        try {
          var d = c.Ja.g.parse(b2);
        } catch (m) {
          d = null;
        }
        if (Array.isArray(d) && 3 == d.length) {
          var e = d;
          if (0 == e[0])
            a: {
              if (!c.u) {
                if (c.g)
                  if (c.g.G + 3e3 < a.G)
                    yc(c), zc(c);
                  else
                    break a;
                Ac(c);
                F(18);
              }
            }
          else
            c.Fa = e[1], 0 < c.Fa - c.V && 37500 > e[2] && c.G && 0 == c.A && !c.v && (c.v = Rb(q(c.ib, c), 6e3));
          if (1 >= Bc(c.i) && c.oa) {
            try {
              c.oa();
            } catch (m) {
            }
            c.oa = void 0;
          }
        } else
          J(c, 11);
      } else if ((a.K || c.g == a) && yc(c), !x(b2))
        for (e = c.Ja.g.parse(b2), b2 = 0; b2 < e.length; b2++) {
          let m = e[b2];
          c.V = m[0];
          m = m[1];
          if (2 == c.H)
            if ("c" == m[0]) {
              c.K = m[1];
              c.pa = m[2];
              const u = m[3];
              null != u && (c.ra = u, c.l.info("VER=" + c.ra));
              const L2 = m[4];
              null != L2 && (c.Ga = L2, c.l.info("SVER=" + c.Ga));
              const Ka = m[5];
              null != Ka && "number" === typeof Ka && 0 < Ka && (d = 1.5 * Ka, c.L = d, c.l.info("backChannelRequestTimeoutMs_=" + d));
              d = c;
              const la = a.g;
              if (la) {
                const La = la.g ? la.g.getResponseHeader("X-Client-Wire-Protocol") : null;
                if (La) {
                  var f = d.i;
                  f.g || -1 == La.indexOf("spdy") && -1 == La.indexOf("quic") && -1 == La.indexOf("h2") || (f.j = f.l, f.g = /* @__PURE__ */ new Set(), f.h && (Cc(f, f.h), f.h = null));
                }
                if (d.F) {
                  const Db = la.g ? la.g.getResponseHeader("X-HTTP-Session-Id") : null;
                  Db && (d.Da = Db, K(d.I, d.F, Db));
                }
              }
              c.H = 3;
              c.h && c.h.Ba();
              c.ca && (c.S = Date.now() - a.G, c.l.info("Handshake RTT: " + c.S + "ms"));
              d = c;
              var h = a;
              d.wa = Dc(d, d.J ? d.pa : null, d.Y);
              if (h.K) {
                Ec(d.i, h);
                var n = h, t = d.L;
                t && n.setTimeout(t);
                n.C && (nc(n), jc(n));
                d.g = h;
              } else
                Fc(d);
              0 < c.j.length && Gc(c);
            } else
              "stop" != m[0] && "close" != m[0] || J(c, 7);
          else
            3 == c.H && ("stop" == m[0] || "close" == m[0] ? "stop" == m[0] ? J(c, 7) : Hc(c) : "noop" != m[0] && c.h && c.h.Aa(m), c.A = 0);
        }
    }
    Ob(4);
  } catch (m) {
  }
}
function Ic(a) {
  if (a.Z && "function" == typeof a.Z)
    return a.Z();
  if ("undefined" !== typeof Map && a instanceof Map || "undefined" !== typeof Set && a instanceof Set)
    return Array.from(a.values());
  if ("string" === typeof a)
    return a.split("");
  if (aa(a)) {
    for (var b2 = [], c = a.length, d = 0; d < c; d++)
      b2.push(a[d]);
    return b2;
  }
  b2 = [];
  c = 0;
  for (d in a)
    b2[c++] = a[d];
  return b2;
}
function Jc(a) {
  if (a.ta && "function" == typeof a.ta)
    return a.ta();
  if (!a.Z || "function" != typeof a.Z) {
    if ("undefined" !== typeof Map && a instanceof Map)
      return Array.from(a.keys());
    if (!("undefined" !== typeof Set && a instanceof Set)) {
      if (aa(a) || "string" === typeof a) {
        var b2 = [];
        a = a.length;
        for (var c = 0; c < a; c++)
          b2.push(c);
        return b2;
      }
      b2 = [];
      c = 0;
      for (const d in a)
        b2[c++] = d;
      return b2;
    }
  }
}
function Kc(a, b2) {
  if (a.forEach && "function" == typeof a.forEach)
    a.forEach(b2, void 0);
  else if (aa(a) || "string" === typeof a)
    Array.prototype.forEach.call(a, b2, void 0);
  else
    for (var c = Jc(a), d = Ic(a), e = d.length, f = 0; f < e; f++)
      b2.call(void 0, d[f], c && c[f], a);
}
var Lc = RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");
function Mc(a, b2) {
  if (a) {
    a = a.split("&");
    for (var c = 0; c < a.length; c++) {
      var d = a[c].indexOf("="), e = null;
      if (0 <= d) {
        var f = a[c].substring(0, d);
        e = a[c].substring(d + 1);
      } else
        f = a[c];
      b2(f, e ? decodeURIComponent(e.replace(/\+/g, " ")) : "");
    }
  }
}
function M(a) {
  this.g = this.s = this.j = "";
  this.m = null;
  this.o = this.l = "";
  this.h = false;
  if (a instanceof M) {
    this.h = a.h;
    Nc(this, a.j);
    this.s = a.s;
    this.g = a.g;
    Oc(this, a.m);
    this.l = a.l;
    var b2 = a.i;
    var c = new Pc();
    c.i = b2.i;
    b2.g && (c.g = new Map(b2.g), c.h = b2.h);
    Qc(this, c);
    this.o = a.o;
  } else
    a && (b2 = String(a).match(Lc)) ? (this.h = false, Nc(this, b2[1] || "", true), this.s = Rc(b2[2] || ""), this.g = Rc(b2[3] || "", true), Oc(this, b2[4]), this.l = Rc(b2[5] || "", true), Qc(this, b2[6] || "", true), this.o = Rc(b2[7] || "")) : (this.h = false, this.i = new Pc(null, this.h));
}
M.prototype.toString = function() {
  var a = [], b2 = this.j;
  b2 && a.push(Sc(b2, Tc, true), ":");
  var c = this.g;
  if (c || "file" == b2)
    a.push("//"), (b2 = this.s) && a.push(Sc(b2, Tc, true), "@"), a.push(encodeURIComponent(String(c)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), c = this.m, null != c && a.push(":", String(c));
  if (c = this.l)
    this.g && "/" != c.charAt(0) && a.push("/"), a.push(Sc(c, "/" == c.charAt(0) ? Uc : Vc, true));
  (c = this.i.toString()) && a.push("?", c);
  (c = this.o) && a.push("#", Sc(c, Wc));
  return a.join("");
};
function G(a) {
  return new M(a);
}
function Nc(a, b2, c) {
  a.j = c ? Rc(b2, true) : b2;
  a.j && (a.j = a.j.replace(/:$/, ""));
}
function Oc(a, b2) {
  if (b2) {
    b2 = Number(b2);
    if (isNaN(b2) || 0 > b2)
      throw Error("Bad port number " + b2);
    a.m = b2;
  } else
    a.m = null;
}
function Qc(a, b2, c) {
  b2 instanceof Pc ? (a.i = b2, Xc(a.i, a.h)) : (c || (b2 = Sc(b2, Yc)), a.i = new Pc(b2, a.h));
}
function K(a, b2, c) {
  a.i.set(b2, c);
}
function hc(a) {
  K(a, "zx", Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ Date.now()).toString(36));
  return a;
}
function Rc(a, b2) {
  return a ? b2 ? decodeURI(a.replace(/%25/g, "%2525")) : decodeURIComponent(a) : "";
}
function Sc(a, b2, c) {
  return "string" === typeof a ? (a = encodeURI(a).replace(b2, Zc), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null;
}
function Zc(a) {
  a = a.charCodeAt(0);
  return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16);
}
var Tc = /[#\/\?@]/g;
var Vc = /[#\?:]/g;
var Uc = /[#\?]/g;
var Yc = /[#\?@]/g;
var Wc = /#/g;
function Pc(a, b2) {
  this.h = this.g = null;
  this.i = a || null;
  this.j = !!b2;
}
function N(a) {
  a.g || (a.g = /* @__PURE__ */ new Map(), a.h = 0, a.i && Mc(a.i, function(b2, c) {
    a.add(decodeURIComponent(b2.replace(/\+/g, " ")), c);
  }));
}
k = Pc.prototype;
k.add = function(a, b2) {
  N(this);
  this.i = null;
  a = O(this, a);
  var c = this.g.get(a);
  c || this.g.set(a, c = []);
  c.push(b2);
  this.h += 1;
  return this;
};
function $c(a, b2) {
  N(a);
  b2 = O(a, b2);
  a.g.has(b2) && (a.i = null, a.h -= a.g.get(b2).length, a.g.delete(b2));
}
function ad(a, b2) {
  N(a);
  b2 = O(a, b2);
  return a.g.has(b2);
}
k.forEach = function(a, b2) {
  N(this);
  this.g.forEach(function(c, d) {
    c.forEach(function(e) {
      a.call(b2, e, d, this);
    }, this);
  }, this);
};
k.ta = function() {
  N(this);
  const a = Array.from(this.g.values()), b2 = Array.from(this.g.keys()), c = [];
  for (let d = 0; d < b2.length; d++) {
    const e = a[d];
    for (let f = 0; f < e.length; f++)
      c.push(b2[d]);
  }
  return c;
};
k.Z = function(a) {
  N(this);
  let b2 = [];
  if ("string" === typeof a)
    ad(this, a) && (b2 = b2.concat(this.g.get(O(this, a))));
  else {
    a = Array.from(this.g.values());
    for (let c = 0; c < a.length; c++)
      b2 = b2.concat(a[c]);
  }
  return b2;
};
k.set = function(a, b2) {
  N(this);
  this.i = null;
  a = O(this, a);
  ad(this, a) && (this.h -= this.g.get(a).length);
  this.g.set(a, [b2]);
  this.h += 1;
  return this;
};
k.get = function(a, b2) {
  if (!a)
    return b2;
  a = this.Z(a);
  return 0 < a.length ? String(a[0]) : b2;
};
function kc(a, b2, c) {
  $c(a, b2);
  0 < c.length && (a.i = null, a.g.set(O(a, b2), ma(c)), a.h += c.length);
}
k.toString = function() {
  if (this.i)
    return this.i;
  if (!this.g)
    return "";
  const a = [], b2 = Array.from(this.g.keys());
  for (var c = 0; c < b2.length; c++) {
    var d = b2[c];
    const f = encodeURIComponent(String(d)), h = this.Z(d);
    for (d = 0; d < h.length; d++) {
      var e = f;
      "" !== h[d] && (e += "=" + encodeURIComponent(String(h[d])));
      a.push(e);
    }
  }
  return this.i = a.join("&");
};
function O(a, b2) {
  b2 = String(b2);
  a.j && (b2 = b2.toLowerCase());
  return b2;
}
function Xc(a, b2) {
  b2 && !a.j && (N(a), a.i = null, a.g.forEach(function(c, d) {
    var e = d.toLowerCase();
    d != e && ($c(this, d), kc(this, e, c));
  }, a));
  a.j = b2;
}
var bd = class {
  constructor(a, b2) {
    this.g = a;
    this.map = b2;
  }
};
function cd(a) {
  this.l = a || dd;
  l.PerformanceNavigationTiming ? (a = l.performance.getEntriesByType("navigation"), a = 0 < a.length && ("hq" == a[0].nextHopProtocol || "h2" == a[0].nextHopProtocol)) : a = !!(l.g && l.g.Ka && l.g.Ka() && l.g.Ka().dc);
  this.j = a ? this.l : 1;
  this.g = null;
  1 < this.j && (this.g = /* @__PURE__ */ new Set());
  this.h = null;
  this.i = [];
}
var dd = 10;
function ed(a) {
  return a.h ? true : a.g ? a.g.size >= a.j : false;
}
function Bc(a) {
  return a.h ? 1 : a.g ? a.g.size : 0;
}
function xc(a, b2) {
  return a.h ? a.h == b2 : a.g ? a.g.has(b2) : false;
}
function Cc(a, b2) {
  a.g ? a.g.add(b2) : a.h = b2;
}
function Ec(a, b2) {
  a.h && a.h == b2 ? a.h = null : a.g && a.g.has(b2) && a.g.delete(b2);
}
cd.prototype.cancel = function() {
  this.i = fd(this);
  if (this.h)
    this.h.cancel(), this.h = null;
  else if (this.g && 0 !== this.g.size) {
    for (const a of this.g.values())
      a.cancel();
    this.g.clear();
  }
};
function fd(a) {
  if (null != a.h)
    return a.i.concat(a.h.F);
  if (null != a.g && 0 !== a.g.size) {
    let b2 = a.i;
    for (const c of a.g.values())
      b2 = b2.concat(c.F);
    return b2;
  }
  return ma(a.i);
}
var gd = class {
  stringify(a) {
    return l.JSON.stringify(a, void 0);
  }
  parse(a) {
    return l.JSON.parse(a, void 0);
  }
};
function hd() {
  this.g = new gd();
}
function id(a, b2, c) {
  const d = c || "";
  try {
    Kc(a, function(e, f) {
      let h = e;
      p(e) && (h = jb(e));
      b2.push(d + f + "=" + encodeURIComponent(h));
    });
  } catch (e) {
    throw b2.push(d + "type=" + encodeURIComponent("_badmap")), e;
  }
}
function jd(a, b2) {
  const c = new Gb();
  if (l.Image) {
    const d = new Image();
    d.onload = ha(kd, c, d, "TestLoadImage: loaded", true, b2);
    d.onerror = ha(kd, c, d, "TestLoadImage: error", false, b2);
    d.onabort = ha(kd, c, d, "TestLoadImage: abort", false, b2);
    d.ontimeout = ha(kd, c, d, "TestLoadImage: timeout", false, b2);
    l.setTimeout(function() {
      if (d.ontimeout)
        d.ontimeout();
    }, 1e4);
    d.src = a;
  } else
    b2(false);
}
function kd(a, b2, c, d, e) {
  try {
    b2.onload = null, b2.onerror = null, b2.onabort = null, b2.ontimeout = null, e(d);
  } catch (f) {
  }
}
function ld(a) {
  this.l = a.ec || null;
  this.j = a.ob || false;
}
r(ld, Ub);
ld.prototype.g = function() {
  return new md(this.l, this.j);
};
ld.prototype.i = function(a) {
  return function() {
    return a;
  };
}({});
function md(a, b2) {
  B.call(this);
  this.F = a;
  this.u = b2;
  this.m = void 0;
  this.readyState = nd;
  this.status = 0;
  this.responseType = this.responseText = this.response = this.statusText = "";
  this.onreadystatechange = null;
  this.v = new Headers();
  this.h = null;
  this.C = "GET";
  this.B = "";
  this.g = false;
  this.A = this.j = this.l = null;
}
r(md, B);
var nd = 0;
k = md.prototype;
k.open = function(a, b2) {
  if (this.readyState != nd)
    throw this.abort(), Error("Error reopening a connection");
  this.C = a;
  this.B = b2;
  this.readyState = 1;
  od(this);
};
k.send = function(a) {
  if (1 != this.readyState)
    throw this.abort(), Error("need to call open() first. ");
  this.g = true;
  const b2 = { headers: this.v, method: this.C, credentials: this.m, cache: void 0 };
  a && (b2.body = a);
  (this.F || l).fetch(new Request(this.B, b2)).then(this.$a.bind(this), this.ka.bind(this));
};
k.abort = function() {
  this.response = this.responseText = "";
  this.v = new Headers();
  this.status = 0;
  this.j && this.j.cancel("Request was aborted.").catch(() => {
  });
  1 <= this.readyState && this.g && 4 != this.readyState && (this.g = false, pd(this));
  this.readyState = nd;
};
k.$a = function(a) {
  if (this.g && (this.l = a, this.h || (this.status = this.l.status, this.statusText = this.l.statusText, this.h = a.headers, this.readyState = 2, od(this)), this.g && (this.readyState = 3, od(this), this.g)))
    if ("arraybuffer" === this.responseType)
      a.arrayBuffer().then(this.Ya.bind(this), this.ka.bind(this));
    else if ("undefined" !== typeof l.ReadableStream && "body" in a) {
      this.j = a.body.getReader();
      if (this.u) {
        if (this.responseType)
          throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');
        this.response = [];
      } else
        this.response = this.responseText = "", this.A = new TextDecoder();
      qd(this);
    } else
      a.text().then(this.Za.bind(this), this.ka.bind(this));
};
function qd(a) {
  a.j.read().then(a.Xa.bind(a)).catch(a.ka.bind(a));
}
k.Xa = function(a) {
  if (this.g) {
    if (this.u && a.value)
      this.response.push(a.value);
    else if (!this.u) {
      var b2 = a.value ? a.value : new Uint8Array(0);
      if (b2 = this.A.decode(b2, { stream: !a.done }))
        this.response = this.responseText += b2;
    }
    a.done ? pd(this) : od(this);
    3 == this.readyState && qd(this);
  }
};
k.Za = function(a) {
  this.g && (this.response = this.responseText = a, pd(this));
};
k.Ya = function(a) {
  this.g && (this.response = a, pd(this));
};
k.ka = function() {
  this.g && pd(this);
};
function pd(a) {
  a.readyState = 4;
  a.l = null;
  a.j = null;
  a.A = null;
  od(a);
}
k.setRequestHeader = function(a, b2) {
  this.v.append(a, b2);
};
k.getResponseHeader = function(a) {
  return this.h ? this.h.get(a.toLowerCase()) || "" : "";
};
k.getAllResponseHeaders = function() {
  if (!this.h)
    return "";
  const a = [], b2 = this.h.entries();
  for (var c = b2.next(); !c.done; )
    c = c.value, a.push(c[0] + ": " + c[1]), c = b2.next();
  return a.join("\r\n");
};
function od(a) {
  a.onreadystatechange && a.onreadystatechange.call(a);
}
Object.defineProperty(md.prototype, "withCredentials", { get: function() {
  return "include" === this.m;
}, set: function(a) {
  this.m = a ? "include" : "same-origin";
} });
var rd = l.JSON.parse;
function P(a) {
  B.call(this);
  this.headers = /* @__PURE__ */ new Map();
  this.u = a || null;
  this.h = false;
  this.C = this.g = null;
  this.I = "";
  this.m = 0;
  this.j = "";
  this.l = this.G = this.v = this.F = false;
  this.B = 0;
  this.A = null;
  this.K = sd;
  this.L = this.M = false;
}
r(P, B);
var sd = "";
var td = /^https?$/i;
var ud = ["POST", "PUT"];
k = P.prototype;
k.Oa = function(a) {
  this.M = a;
};
k.ha = function(a, b2, c, d) {
  if (this.g)
    throw Error("[goog.net.XhrIo] Object is active with another request=" + this.I + "; newUri=" + a);
  b2 = b2 ? b2.toUpperCase() : "GET";
  this.I = a;
  this.j = "";
  this.m = 0;
  this.F = false;
  this.h = true;
  this.g = this.u ? this.u.g() : $b.g();
  this.C = this.u ? Vb(this.u) : Vb($b);
  this.g.onreadystatechange = q(this.La, this);
  try {
    this.G = true, this.g.open(b2, String(a), true), this.G = false;
  } catch (f) {
    vd(this, f);
    return;
  }
  a = c || "";
  c = new Map(this.headers);
  if (d)
    if (Object.getPrototypeOf(d) === Object.prototype)
      for (var e in d)
        c.set(e, d[e]);
    else if ("function" === typeof d.keys && "function" === typeof d.get)
      for (const f of d.keys())
        c.set(f, d.get(f));
    else
      throw Error("Unknown input type for opt_headers: " + String(d));
  d = Array.from(c.keys()).find((f) => "content-type" == f.toLowerCase());
  e = l.FormData && a instanceof l.FormData;
  !(0 <= ka(ud, b2)) || d || e || c.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
  for (const [f, h] of c)
    this.g.setRequestHeader(f, h);
  this.K && (this.g.responseType = this.K);
  "withCredentials" in this.g && this.g.withCredentials !== this.M && (this.g.withCredentials = this.M);
  try {
    wd(this), 0 < this.B && ((this.L = xd(this.g)) ? (this.g.timeout = this.B, this.g.ontimeout = q(this.ua, this)) : this.A = yb(this.ua, this.B, this)), this.v = true, this.g.send(a), this.v = false;
  } catch (f) {
    vd(this, f);
  }
};
function xd(a) {
  return z && "number" === typeof a.timeout && void 0 !== a.ontimeout;
}
k.ua = function() {
  "undefined" != typeof goog && this.g && (this.j = "Timed out after " + this.B + "ms, aborting", this.m = 8, C(this, "timeout"), this.abort(8));
};
function vd(a, b2) {
  a.h = false;
  a.g && (a.l = true, a.g.abort(), a.l = false);
  a.j = b2;
  a.m = 5;
  yd(a);
  zd(a);
}
function yd(a) {
  a.F || (a.F = true, C(a, "complete"), C(a, "error"));
}
k.abort = function(a) {
  this.g && this.h && (this.h = false, this.l = true, this.g.abort(), this.l = false, this.m = a || 7, C(this, "complete"), C(this, "abort"), zd(this));
};
k.N = function() {
  this.g && (this.h && (this.h = false, this.l = true, this.g.abort(), this.l = false), zd(this, true));
  P.$.N.call(this);
};
k.La = function() {
  this.s || (this.G || this.v || this.l ? Ad(this) : this.kb());
};
k.kb = function() {
  Ad(this);
};
function Ad(a) {
  if (a.h && "undefined" != typeof goog && (!a.C[1] || 4 != H(a) || 2 != a.da())) {
    if (a.v && 4 == H(a))
      yb(a.La, 0, a);
    else if (C(a, "readystatechange"), 4 == H(a)) {
      a.h = false;
      try {
        const h = a.da();
        a:
          switch (h) {
            case 200:
            case 201:
            case 202:
            case 204:
            case 206:
            case 304:
            case 1223:
              var b2 = true;
              break a;
            default:
              b2 = false;
          }
        var c;
        if (!(c = b2)) {
          var d;
          if (d = 0 === h) {
            var e = String(a.I).match(Lc)[1] || null;
            !e && l.self && l.self.location && (e = l.self.location.protocol.slice(0, -1));
            d = !td.test(e ? e.toLowerCase() : "");
          }
          c = d;
        }
        if (c)
          C(a, "complete"), C(a, "success");
        else {
          a.m = 6;
          try {
            var f = 2 < H(a) ? a.g.statusText : "";
          } catch (n) {
            f = "";
          }
          a.j = f + " [" + a.da() + "]";
          yd(a);
        }
      } finally {
        zd(a);
      }
    }
  }
}
function zd(a, b2) {
  if (a.g) {
    wd(a);
    const c = a.g, d = a.C[0] ? () => {
    } : null;
    a.g = null;
    a.C = null;
    b2 || C(a, "ready");
    try {
      c.onreadystatechange = d;
    } catch (e) {
    }
  }
}
function wd(a) {
  a.g && a.L && (a.g.ontimeout = null);
  a.A && (l.clearTimeout(a.A), a.A = null);
}
k.isActive = function() {
  return !!this.g;
};
function H(a) {
  return a.g ? a.g.readyState : 0;
}
k.da = function() {
  try {
    return 2 < H(this) ? this.g.status : -1;
  } catch (a) {
    return -1;
  }
};
k.ja = function() {
  try {
    return this.g ? this.g.responseText : "";
  } catch (a) {
    return "";
  }
};
k.Wa = function(a) {
  if (this.g) {
    var b2 = this.g.responseText;
    a && 0 == b2.indexOf(a) && (b2 = b2.substring(a.length));
    return rd(b2);
  }
};
function mc(a) {
  try {
    if (!a.g)
      return null;
    if ("response" in a.g)
      return a.g.response;
    switch (a.K) {
      case sd:
      case "text":
        return a.g.responseText;
      case "arraybuffer":
        if ("mozResponseArrayBuffer" in a.g)
          return a.g.mozResponseArrayBuffer;
    }
    return null;
  } catch (b2) {
    return null;
  }
}
function tc(a) {
  const b2 = {};
  a = (a.g && 2 <= H(a) ? a.g.getAllResponseHeaders() || "" : "").split("\r\n");
  for (let d = 0; d < a.length; d++) {
    if (x(a[d]))
      continue;
    var c = qb(a[d]);
    const e = c[0];
    c = c[1];
    if ("string" !== typeof c)
      continue;
    c = c.trim();
    const f = b2[e] || [];
    b2[e] = f;
    f.push(c);
  }
  Oa(b2, function(d) {
    return d.join(", ");
  });
}
k.Ia = function() {
  return this.m;
};
k.Sa = function() {
  return "string" === typeof this.j ? this.j : String(this.j);
};
function Bd(a) {
  let b2 = "";
  Na(a, function(c, d) {
    b2 += d;
    b2 += ":";
    b2 += c;
    b2 += "\r\n";
  });
  return b2;
}
function Cd(a, b2, c) {
  a: {
    for (d in c) {
      var d = false;
      break a;
    }
    d = true;
  }
  d || (c = Bd(c), "string" === typeof a ? null != c && encodeURIComponent(String(c)) : K(a, b2, c));
}
function Dd(a, b2, c) {
  return c && c.internalChannelParams ? c.internalChannelParams[a] || b2 : b2;
}
function Ed(a) {
  this.Ga = 0;
  this.j = [];
  this.l = new Gb();
  this.pa = this.wa = this.I = this.Y = this.g = this.Da = this.F = this.na = this.o = this.U = this.s = null;
  this.fb = this.W = 0;
  this.cb = Dd("failFast", false, a);
  this.G = this.v = this.u = this.m = this.h = null;
  this.aa = true;
  this.Fa = this.V = -1;
  this.ba = this.A = this.C = 0;
  this.ab = Dd("baseRetryDelayMs", 5e3, a);
  this.hb = Dd("retryDelaySeedMs", 1e4, a);
  this.eb = Dd("forwardChannelMaxRetries", 2, a);
  this.xa = Dd("forwardChannelRequestTimeoutMs", 2e4, a);
  this.va = a && a.xmlHttpFactory || void 0;
  this.Ha = a && a.useFetchStreams || false;
  this.L = void 0;
  this.J = a && a.supportsCrossDomainXhr || false;
  this.K = "";
  this.i = new cd(a && a.concurrentRequestLimit);
  this.Ja = new hd();
  this.P = a && a.fastHandshake || false;
  this.O = a && a.encodeInitMessageHeaders || false;
  this.P && this.O && (this.O = false);
  this.bb = a && a.bc || false;
  a && a.Ea && this.l.Ea();
  a && a.forceLongPolling && (this.aa = false);
  this.ca = !this.P && this.aa && a && a.detectBufferingProxy || false;
  this.qa = void 0;
  a && a.longPollingTimeout && 0 < a.longPollingTimeout && (this.qa = a.longPollingTimeout);
  this.oa = void 0;
  this.S = 0;
  this.M = false;
  this.ma = this.B = null;
}
k = Ed.prototype;
k.ra = 8;
k.H = 1;
function Hc(a) {
  Fd(a);
  if (3 == a.H) {
    var b2 = a.W++, c = G(a.I);
    K(c, "SID", a.K);
    K(c, "RID", b2);
    K(c, "TYPE", "terminate");
    Gd(a, c);
    b2 = new bc(a, a.l, b2);
    b2.L = 2;
    b2.A = hc(G(c));
    c = false;
    if (l.navigator && l.navigator.sendBeacon)
      try {
        c = l.navigator.sendBeacon(b2.A.toString(), "");
      } catch (d) {
      }
    !c && l.Image && (new Image().src = b2.A, c = true);
    c || (b2.g = lc(b2.l, null), b2.g.ha(b2.A));
    b2.G = Date.now();
    jc(b2);
  }
  Hd(a);
}
function zc(a) {
  a.g && (vc(a), a.g.cancel(), a.g = null);
}
function Fd(a) {
  zc(a);
  a.u && (l.clearTimeout(a.u), a.u = null);
  yc(a);
  a.i.cancel();
  a.m && ("number" === typeof a.m && l.clearTimeout(a.m), a.m = null);
}
function Gc(a) {
  if (!ed(a.i) && !a.m) {
    a.m = true;
    var b2 = a.Na;
    sb || vb();
    tb || (sb(), tb = true);
    mb.add(b2, a);
    a.C = 0;
  }
}
function Id(a, b2) {
  if (Bc(a.i) >= a.i.j - (a.m ? 1 : 0))
    return false;
  if (a.m)
    return a.j = b2.F.concat(a.j), true;
  if (1 == a.H || 2 == a.H || a.C >= (a.cb ? 0 : a.eb))
    return false;
  a.m = Rb(q(a.Na, a, b2), Jd(a, a.C));
  a.C++;
  return true;
}
k.Na = function(a) {
  if (this.m)
    if (this.m = null, 1 == this.H) {
      if (!a) {
        this.W = Math.floor(1e5 * Math.random());
        a = this.W++;
        const e = new bc(this, this.l, a);
        let f = this.s;
        this.U && (f ? (f = Pa(f), Ra(f, this.U)) : f = this.U);
        null !== this.o || this.O || (e.I = f, f = null);
        if (this.P)
          a: {
            var b2 = 0;
            for (var c = 0; c < this.j.length; c++) {
              b: {
                var d = this.j[c];
                if ("__data__" in d.map && (d = d.map.__data__, "string" === typeof d)) {
                  d = d.length;
                  break b;
                }
                d = void 0;
              }
              if (void 0 === d)
                break;
              b2 += d;
              if (4096 < b2) {
                b2 = c;
                break a;
              }
              if (4096 === b2 || c === this.j.length - 1) {
                b2 = c + 1;
                break a;
              }
            }
            b2 = 1e3;
          }
        else
          b2 = 1e3;
        b2 = Kd(this, e, b2);
        c = G(this.I);
        K(c, "RID", a);
        K(c, "CVER", 22);
        this.F && K(c, "X-HTTP-Session-Id", this.F);
        Gd(this, c);
        f && (this.O ? b2 = "headers=" + encodeURIComponent(String(Bd(f))) + "&" + b2 : this.o && Cd(c, this.o, f));
        Cc(this.i, e);
        this.bb && K(c, "TYPE", "init");
        this.P ? (K(c, "$req", b2), K(c, "SID", "null"), e.aa = true, gc(e, c, null)) : gc(e, c, b2);
        this.H = 2;
      }
    } else
      3 == this.H && (a ? Ld(this, a) : 0 == this.j.length || ed(this.i) || Ld(this));
};
function Ld(a, b2) {
  var c;
  b2 ? c = b2.m : c = a.W++;
  const d = G(a.I);
  K(d, "SID", a.K);
  K(d, "RID", c);
  K(d, "AID", a.V);
  Gd(a, d);
  a.o && a.s && Cd(d, a.o, a.s);
  c = new bc(a, a.l, c, a.C + 1);
  null === a.o && (c.I = a.s);
  b2 && (a.j = b2.F.concat(a.j));
  b2 = Kd(a, c, 1e3);
  c.setTimeout(Math.round(0.5 * a.xa) + Math.round(0.5 * a.xa * Math.random()));
  Cc(a.i, c);
  gc(c, d, b2);
}
function Gd(a, b2) {
  a.na && Na(a.na, function(c, d) {
    K(b2, d, c);
  });
  a.h && Kc({}, function(c, d) {
    K(b2, d, c);
  });
}
function Kd(a, b2, c) {
  c = Math.min(a.j.length, c);
  var d = a.h ? q(a.h.Va, a.h, a) : null;
  a: {
    var e = a.j;
    let f = -1;
    for (; ; ) {
      const h = ["count=" + c];
      -1 == f ? 0 < c ? (f = e[0].g, h.push("ofs=" + f)) : f = 0 : h.push("ofs=" + f);
      let n = true;
      for (let t = 0; t < c; t++) {
        let m = e[t].g;
        const u = e[t].map;
        m -= f;
        if (0 > m)
          f = Math.max(0, e[t].g - 100), n = false;
        else
          try {
            id(u, h, "req" + m + "_");
          } catch (L2) {
            d && d(u);
          }
      }
      if (n) {
        d = h.join("&");
        break a;
      }
    }
  }
  a = a.j.splice(0, c);
  b2.F = a;
  return d;
}
function Fc(a) {
  if (!a.g && !a.u) {
    a.ba = 1;
    var b2 = a.Ma;
    sb || vb();
    tb || (sb(), tb = true);
    mb.add(b2, a);
    a.A = 0;
  }
}
function Ac(a) {
  if (a.g || a.u || 3 <= a.A)
    return false;
  a.ba++;
  a.u = Rb(q(a.Ma, a), Jd(a, a.A));
  a.A++;
  return true;
}
k.Ma = function() {
  this.u = null;
  Md(this);
  if (this.ca && !(this.M || null == this.g || 0 >= this.S)) {
    var a = 2 * this.S;
    this.l.info("BP detection timer enabled: " + a);
    this.B = Rb(q(this.jb, this), a);
  }
};
k.jb = function() {
  this.B && (this.B = null, this.l.info("BP detection timeout reached."), this.l.info("Buffering proxy detected and switch to long-polling!"), this.G = false, this.M = true, F(10), zc(this), Md(this));
};
function vc(a) {
  null != a.B && (l.clearTimeout(a.B), a.B = null);
}
function Md(a) {
  a.g = new bc(a, a.l, "rpc", a.ba);
  null === a.o && (a.g.I = a.s);
  a.g.O = 0;
  var b2 = G(a.wa);
  K(b2, "RID", "rpc");
  K(b2, "SID", a.K);
  K(b2, "AID", a.V);
  K(b2, "CI", a.G ? "0" : "1");
  !a.G && a.qa && K(b2, "TO", a.qa);
  K(b2, "TYPE", "xmlhttp");
  Gd(a, b2);
  a.o && a.s && Cd(b2, a.o, a.s);
  a.L && a.g.setTimeout(a.L);
  var c = a.g;
  a = a.pa;
  c.L = 1;
  c.A = hc(G(b2));
  c.u = null;
  c.S = true;
  ic(c, a);
}
k.ib = function() {
  null != this.v && (this.v = null, zc(this), Ac(this), F(19));
};
function yc(a) {
  null != a.v && (l.clearTimeout(a.v), a.v = null);
}
function sc(a, b2) {
  var c = null;
  if (a.g == b2) {
    yc(a);
    vc(a);
    a.g = null;
    var d = 2;
  } else if (xc(a.i, b2))
    c = b2.F, Ec(a.i, b2), d = 1;
  else
    return;
  if (0 != a.H) {
    if (b2.i)
      if (1 == d) {
        c = b2.u ? b2.u.length : 0;
        b2 = Date.now() - b2.G;
        var e = a.C;
        d = Mb();
        C(d, new Qb(d, c));
        Gc(a);
      } else
        Fc(a);
    else if (e = b2.s, 3 == e || 0 == e && 0 < b2.ca || !(1 == d && Id(a, b2) || 2 == d && Ac(a)))
      switch (c && 0 < c.length && (b2 = a.i, b2.i = b2.i.concat(c)), e) {
        case 1:
          J(a, 5);
          break;
        case 4:
          J(a, 10);
          break;
        case 3:
          J(a, 6);
          break;
        default:
          J(a, 2);
      }
  }
}
function Jd(a, b2) {
  let c = a.ab + Math.floor(Math.random() * a.hb);
  a.isActive() || (c *= 2);
  return c * b2;
}
function J(a, b2) {
  a.l.info("Error code " + b2);
  if (2 == b2) {
    var c = null;
    a.h && (c = null);
    var d = q(a.pb, a);
    c || (c = new M("//www.google.com/images/cleardot.gif"), l.location && "http" == l.location.protocol || Nc(c, "https"), hc(c));
    jd(c.toString(), d);
  } else
    F(2);
  a.H = 0;
  a.h && a.h.za(b2);
  Hd(a);
  Fd(a);
}
k.pb = function(a) {
  a ? (this.l.info("Successfully pinged google.com"), F(2)) : (this.l.info("Failed to ping google.com"), F(1));
};
function Hd(a) {
  a.H = 0;
  a.ma = [];
  if (a.h) {
    const b2 = fd(a.i);
    if (0 != b2.length || 0 != a.j.length)
      na(a.ma, b2), na(a.ma, a.j), a.i.i.length = 0, ma(a.j), a.j.length = 0;
    a.h.ya();
  }
}
function Dc(a, b2, c) {
  var d = c instanceof M ? G(c) : new M(c);
  if ("" != d.g)
    b2 && (d.g = b2 + "." + d.g), Oc(d, d.m);
  else {
    var e = l.location;
    d = e.protocol;
    b2 = b2 ? b2 + "." + e.hostname : e.hostname;
    e = +e.port;
    var f = new M(null);
    d && Nc(f, d);
    b2 && (f.g = b2);
    e && Oc(f, e);
    c && (f.l = c);
    d = f;
  }
  c = a.F;
  b2 = a.Da;
  c && b2 && K(d, c, b2);
  K(d, "VER", a.ra);
  Gd(a, d);
  return d;
}
function lc(a, b2, c) {
  if (b2 && !a.J)
    throw Error("Can't create secondary domain capable XhrIo object.");
  b2 = a.Ha && !a.va ? new P(new ld({ ob: c })) : new P(a.va);
  b2.Oa(a.J);
  return b2;
}
k.isActive = function() {
  return !!this.h && this.h.isActive(this);
};
function Nd() {
}
k = Nd.prototype;
k.Ba = function() {
};
k.Aa = function() {
};
k.za = function() {
};
k.ya = function() {
};
k.isActive = function() {
  return true;
};
k.Va = function() {
};
function Od() {
  if (z && !(10 <= Number(Fa)))
    throw Error("Environmental error: no available transport.");
}
Od.prototype.g = function(a, b2) {
  return new Q(a, b2);
};
function Q(a, b2) {
  B.call(this);
  this.g = new Ed(b2);
  this.l = a;
  this.h = b2 && b2.messageUrlParams || null;
  a = b2 && b2.messageHeaders || null;
  b2 && b2.clientProtocolHeaderRequired && (a ? a["X-Client-Protocol"] = "webchannel" : a = { "X-Client-Protocol": "webchannel" });
  this.g.s = a;
  a = b2 && b2.initMessageHeaders || null;
  b2 && b2.messageContentType && (a ? a["X-WebChannel-Content-Type"] = b2.messageContentType : a = { "X-WebChannel-Content-Type": b2.messageContentType });
  b2 && b2.Ca && (a ? a["X-WebChannel-Client-Profile"] = b2.Ca : a = { "X-WebChannel-Client-Profile": b2.Ca });
  this.g.U = a;
  (a = b2 && b2.cc) && !x(a) && (this.g.o = a);
  this.A = b2 && b2.supportsCrossDomainXhr || false;
  this.v = b2 && b2.sendRawJson || false;
  (b2 = b2 && b2.httpSessionIdParam) && !x(b2) && (this.g.F = b2, a = this.h, null !== a && b2 in a && (a = this.h, b2 in a && delete a[b2]));
  this.j = new R(this);
}
r(Q, B);
Q.prototype.m = function() {
  this.g.h = this.j;
  this.A && (this.g.J = true);
  var a = this.g, b2 = this.l, c = this.h || void 0;
  F(0);
  a.Y = b2;
  a.na = c || {};
  a.G = a.aa;
  a.I = Dc(a, null, a.Y);
  Gc(a);
};
Q.prototype.close = function() {
  Hc(this.g);
};
Q.prototype.u = function(a) {
  var b2 = this.g;
  if ("string" === typeof a) {
    var c = {};
    c.__data__ = a;
    a = c;
  } else
    this.v && (c = {}, c.__data__ = jb(a), a = c);
  b2.j.push(new bd(b2.fb++, a));
  3 == b2.H && Gc(b2);
};
Q.prototype.N = function() {
  this.g.h = null;
  delete this.j;
  Hc(this.g);
  delete this.g;
  Q.$.N.call(this);
};
function Pd(a) {
  Yb.call(this);
  a.__headers__ && (this.headers = a.__headers__, this.statusCode = a.__status__, delete a.__headers__, delete a.__status__);
  var b2 = a.__sm__;
  if (b2) {
    a: {
      for (const c in b2) {
        a = c;
        break a;
      }
      a = void 0;
    }
    if (this.i = a)
      a = this.i, b2 = null !== b2 && a in b2 ? b2[a] : void 0;
    this.data = b2;
  } else
    this.data = a;
}
r(Pd, Yb);
function Qd() {
  Zb.call(this);
  this.status = 1;
}
r(Qd, Zb);
function R(a) {
  this.g = a;
}
r(R, Nd);
R.prototype.Ba = function() {
  C(this.g, "a");
};
R.prototype.Aa = function(a) {
  C(this.g, new Pd(a));
};
R.prototype.za = function(a) {
  C(this.g, new Qd());
};
R.prototype.ya = function() {
  C(this.g, "b");
};
function Rd() {
  this.blockSize = -1;
}
function S() {
  this.blockSize = -1;
  this.blockSize = 64;
  this.g = Array(4);
  this.m = Array(this.blockSize);
  this.i = this.h = 0;
  this.reset();
}
r(S, Rd);
S.prototype.reset = function() {
  this.g[0] = 1732584193;
  this.g[1] = 4023233417;
  this.g[2] = 2562383102;
  this.g[3] = 271733878;
  this.i = this.h = 0;
};
function Sd(a, b2, c) {
  c || (c = 0);
  var d = Array(16);
  if ("string" === typeof b2)
    for (var e = 0; 16 > e; ++e)
      d[e] = b2.charCodeAt(c++) | b2.charCodeAt(c++) << 8 | b2.charCodeAt(c++) << 16 | b2.charCodeAt(c++) << 24;
  else
    for (e = 0; 16 > e; ++e)
      d[e] = b2[c++] | b2[c++] << 8 | b2[c++] << 16 | b2[c++] << 24;
  b2 = a.g[0];
  c = a.g[1];
  e = a.g[2];
  var f = a.g[3];
  var h = b2 + (f ^ c & (e ^ f)) + d[0] + 3614090360 & 4294967295;
  b2 = c + (h << 7 & 4294967295 | h >>> 25);
  h = f + (e ^ b2 & (c ^ e)) + d[1] + 3905402710 & 4294967295;
  f = b2 + (h << 12 & 4294967295 | h >>> 20);
  h = e + (c ^ f & (b2 ^ c)) + d[2] + 606105819 & 4294967295;
  e = f + (h << 17 & 4294967295 | h >>> 15);
  h = c + (b2 ^ e & (f ^ b2)) + d[3] + 3250441966 & 4294967295;
  c = e + (h << 22 & 4294967295 | h >>> 10);
  h = b2 + (f ^ c & (e ^ f)) + d[4] + 4118548399 & 4294967295;
  b2 = c + (h << 7 & 4294967295 | h >>> 25);
  h = f + (e ^ b2 & (c ^ e)) + d[5] + 1200080426 & 4294967295;
  f = b2 + (h << 12 & 4294967295 | h >>> 20);
  h = e + (c ^ f & (b2 ^ c)) + d[6] + 2821735955 & 4294967295;
  e = f + (h << 17 & 4294967295 | h >>> 15);
  h = c + (b2 ^ e & (f ^ b2)) + d[7] + 4249261313 & 4294967295;
  c = e + (h << 22 & 4294967295 | h >>> 10);
  h = b2 + (f ^ c & (e ^ f)) + d[8] + 1770035416 & 4294967295;
  b2 = c + (h << 7 & 4294967295 | h >>> 25);
  h = f + (e ^ b2 & (c ^ e)) + d[9] + 2336552879 & 4294967295;
  f = b2 + (h << 12 & 4294967295 | h >>> 20);
  h = e + (c ^ f & (b2 ^ c)) + d[10] + 4294925233 & 4294967295;
  e = f + (h << 17 & 4294967295 | h >>> 15);
  h = c + (b2 ^ e & (f ^ b2)) + d[11] + 2304563134 & 4294967295;
  c = e + (h << 22 & 4294967295 | h >>> 10);
  h = b2 + (f ^ c & (e ^ f)) + d[12] + 1804603682 & 4294967295;
  b2 = c + (h << 7 & 4294967295 | h >>> 25);
  h = f + (e ^ b2 & (c ^ e)) + d[13] + 4254626195 & 4294967295;
  f = b2 + (h << 12 & 4294967295 | h >>> 20);
  h = e + (c ^ f & (b2 ^ c)) + d[14] + 2792965006 & 4294967295;
  e = f + (h << 17 & 4294967295 | h >>> 15);
  h = c + (b2 ^ e & (f ^ b2)) + d[15] + 1236535329 & 4294967295;
  c = e + (h << 22 & 4294967295 | h >>> 10);
  h = b2 + (e ^ f & (c ^ e)) + d[1] + 4129170786 & 4294967295;
  b2 = c + (h << 5 & 4294967295 | h >>> 27);
  h = f + (c ^ e & (b2 ^ c)) + d[6] + 3225465664 & 4294967295;
  f = b2 + (h << 9 & 4294967295 | h >>> 23);
  h = e + (b2 ^ c & (f ^ b2)) + d[11] + 643717713 & 4294967295;
  e = f + (h << 14 & 4294967295 | h >>> 18);
  h = c + (f ^ b2 & (e ^ f)) + d[0] + 3921069994 & 4294967295;
  c = e + (h << 20 & 4294967295 | h >>> 12);
  h = b2 + (e ^ f & (c ^ e)) + d[5] + 3593408605 & 4294967295;
  b2 = c + (h << 5 & 4294967295 | h >>> 27);
  h = f + (c ^ e & (b2 ^ c)) + d[10] + 38016083 & 4294967295;
  f = b2 + (h << 9 & 4294967295 | h >>> 23);
  h = e + (b2 ^ c & (f ^ b2)) + d[15] + 3634488961 & 4294967295;
  e = f + (h << 14 & 4294967295 | h >>> 18);
  h = c + (f ^ b2 & (e ^ f)) + d[4] + 3889429448 & 4294967295;
  c = e + (h << 20 & 4294967295 | h >>> 12);
  h = b2 + (e ^ f & (c ^ e)) + d[9] + 568446438 & 4294967295;
  b2 = c + (h << 5 & 4294967295 | h >>> 27);
  h = f + (c ^ e & (b2 ^ c)) + d[14] + 3275163606 & 4294967295;
  f = b2 + (h << 9 & 4294967295 | h >>> 23);
  h = e + (b2 ^ c & (f ^ b2)) + d[3] + 4107603335 & 4294967295;
  e = f + (h << 14 & 4294967295 | h >>> 18);
  h = c + (f ^ b2 & (e ^ f)) + d[8] + 1163531501 & 4294967295;
  c = e + (h << 20 & 4294967295 | h >>> 12);
  h = b2 + (e ^ f & (c ^ e)) + d[13] + 2850285829 & 4294967295;
  b2 = c + (h << 5 & 4294967295 | h >>> 27);
  h = f + (c ^ e & (b2 ^ c)) + d[2] + 4243563512 & 4294967295;
  f = b2 + (h << 9 & 4294967295 | h >>> 23);
  h = e + (b2 ^ c & (f ^ b2)) + d[7] + 1735328473 & 4294967295;
  e = f + (h << 14 & 4294967295 | h >>> 18);
  h = c + (f ^ b2 & (e ^ f)) + d[12] + 2368359562 & 4294967295;
  c = e + (h << 20 & 4294967295 | h >>> 12);
  h = b2 + (c ^ e ^ f) + d[5] + 4294588738 & 4294967295;
  b2 = c + (h << 4 & 4294967295 | h >>> 28);
  h = f + (b2 ^ c ^ e) + d[8] + 2272392833 & 4294967295;
  f = b2 + (h << 11 & 4294967295 | h >>> 21);
  h = e + (f ^ b2 ^ c) + d[11] + 1839030562 & 4294967295;
  e = f + (h << 16 & 4294967295 | h >>> 16);
  h = c + (e ^ f ^ b2) + d[14] + 4259657740 & 4294967295;
  c = e + (h << 23 & 4294967295 | h >>> 9);
  h = b2 + (c ^ e ^ f) + d[1] + 2763975236 & 4294967295;
  b2 = c + (h << 4 & 4294967295 | h >>> 28);
  h = f + (b2 ^ c ^ e) + d[4] + 1272893353 & 4294967295;
  f = b2 + (h << 11 & 4294967295 | h >>> 21);
  h = e + (f ^ b2 ^ c) + d[7] + 4139469664 & 4294967295;
  e = f + (h << 16 & 4294967295 | h >>> 16);
  h = c + (e ^ f ^ b2) + d[10] + 3200236656 & 4294967295;
  c = e + (h << 23 & 4294967295 | h >>> 9);
  h = b2 + (c ^ e ^ f) + d[13] + 681279174 & 4294967295;
  b2 = c + (h << 4 & 4294967295 | h >>> 28);
  h = f + (b2 ^ c ^ e) + d[0] + 3936430074 & 4294967295;
  f = b2 + (h << 11 & 4294967295 | h >>> 21);
  h = e + (f ^ b2 ^ c) + d[3] + 3572445317 & 4294967295;
  e = f + (h << 16 & 4294967295 | h >>> 16);
  h = c + (e ^ f ^ b2) + d[6] + 76029189 & 4294967295;
  c = e + (h << 23 & 4294967295 | h >>> 9);
  h = b2 + (c ^ e ^ f) + d[9] + 3654602809 & 4294967295;
  b2 = c + (h << 4 & 4294967295 | h >>> 28);
  h = f + (b2 ^ c ^ e) + d[12] + 3873151461 & 4294967295;
  f = b2 + (h << 11 & 4294967295 | h >>> 21);
  h = e + (f ^ b2 ^ c) + d[15] + 530742520 & 4294967295;
  e = f + (h << 16 & 4294967295 | h >>> 16);
  h = c + (e ^ f ^ b2) + d[2] + 3299628645 & 4294967295;
  c = e + (h << 23 & 4294967295 | h >>> 9);
  h = b2 + (e ^ (c | ~f)) + d[0] + 4096336452 & 4294967295;
  b2 = c + (h << 6 & 4294967295 | h >>> 26);
  h = f + (c ^ (b2 | ~e)) + d[7] + 1126891415 & 4294967295;
  f = b2 + (h << 10 & 4294967295 | h >>> 22);
  h = e + (b2 ^ (f | ~c)) + d[14] + 2878612391 & 4294967295;
  e = f + (h << 15 & 4294967295 | h >>> 17);
  h = c + (f ^ (e | ~b2)) + d[5] + 4237533241 & 4294967295;
  c = e + (h << 21 & 4294967295 | h >>> 11);
  h = b2 + (e ^ (c | ~f)) + d[12] + 1700485571 & 4294967295;
  b2 = c + (h << 6 & 4294967295 | h >>> 26);
  h = f + (c ^ (b2 | ~e)) + d[3] + 2399980690 & 4294967295;
  f = b2 + (h << 10 & 4294967295 | h >>> 22);
  h = e + (b2 ^ (f | ~c)) + d[10] + 4293915773 & 4294967295;
  e = f + (h << 15 & 4294967295 | h >>> 17);
  h = c + (f ^ (e | ~b2)) + d[1] + 2240044497 & 4294967295;
  c = e + (h << 21 & 4294967295 | h >>> 11);
  h = b2 + (e ^ (c | ~f)) + d[8] + 1873313359 & 4294967295;
  b2 = c + (h << 6 & 4294967295 | h >>> 26);
  h = f + (c ^ (b2 | ~e)) + d[15] + 4264355552 & 4294967295;
  f = b2 + (h << 10 & 4294967295 | h >>> 22);
  h = e + (b2 ^ (f | ~c)) + d[6] + 2734768916 & 4294967295;
  e = f + (h << 15 & 4294967295 | h >>> 17);
  h = c + (f ^ (e | ~b2)) + d[13] + 1309151649 & 4294967295;
  c = e + (h << 21 & 4294967295 | h >>> 11);
  h = b2 + (e ^ (c | ~f)) + d[4] + 4149444226 & 4294967295;
  b2 = c + (h << 6 & 4294967295 | h >>> 26);
  h = f + (c ^ (b2 | ~e)) + d[11] + 3174756917 & 4294967295;
  f = b2 + (h << 10 & 4294967295 | h >>> 22);
  h = e + (b2 ^ (f | ~c)) + d[2] + 718787259 & 4294967295;
  e = f + (h << 15 & 4294967295 | h >>> 17);
  h = c + (f ^ (e | ~b2)) + d[9] + 3951481745 & 4294967295;
  a.g[0] = a.g[0] + b2 & 4294967295;
  a.g[1] = a.g[1] + (e + (h << 21 & 4294967295 | h >>> 11)) & 4294967295;
  a.g[2] = a.g[2] + e & 4294967295;
  a.g[3] = a.g[3] + f & 4294967295;
}
S.prototype.j = function(a, b2) {
  void 0 === b2 && (b2 = a.length);
  for (var c = b2 - this.blockSize, d = this.m, e = this.h, f = 0; f < b2; ) {
    if (0 == e)
      for (; f <= c; )
        Sd(this, a, f), f += this.blockSize;
    if ("string" === typeof a)
      for (; f < b2; ) {
        if (d[e++] = a.charCodeAt(f++), e == this.blockSize) {
          Sd(this, d);
          e = 0;
          break;
        }
      }
    else
      for (; f < b2; )
        if (d[e++] = a[f++], e == this.blockSize) {
          Sd(this, d);
          e = 0;
          break;
        }
  }
  this.h = e;
  this.i += b2;
};
S.prototype.l = function() {
  var a = Array((56 > this.h ? this.blockSize : 2 * this.blockSize) - this.h);
  a[0] = 128;
  for (var b2 = 1; b2 < a.length - 8; ++b2)
    a[b2] = 0;
  var c = 8 * this.i;
  for (b2 = a.length - 8; b2 < a.length; ++b2)
    a[b2] = c & 255, c /= 256;
  this.j(a);
  a = Array(16);
  for (b2 = c = 0; 4 > b2; ++b2)
    for (var d = 0; 32 > d; d += 8)
      a[c++] = this.g[b2] >>> d & 255;
  return a;
};
function T(a, b2) {
  this.h = b2;
  for (var c = [], d = true, e = a.length - 1; 0 <= e; e--) {
    var f = a[e] | 0;
    d && f == b2 || (c[e] = f, d = false);
  }
  this.g = c;
}
var sa = {};
function Td(a) {
  return -128 <= a && 128 > a ? ra(a, function(b2) {
    return new T([b2 | 0], 0 > b2 ? -1 : 0);
  }) : new T([a | 0], 0 > a ? -1 : 0);
}
function U(a) {
  if (isNaN(a) || !isFinite(a))
    return V;
  if (0 > a)
    return W(U(-a));
  for (var b2 = [], c = 1, d = 0; a >= c; d++)
    b2[d] = a / c | 0, c *= Ud;
  return new T(b2, 0);
}
function Vd(a, b2) {
  if (0 == a.length)
    throw Error("number format error: empty string");
  b2 = b2 || 10;
  if (2 > b2 || 36 < b2)
    throw Error("radix out of range: " + b2);
  if ("-" == a.charAt(0))
    return W(Vd(a.substring(1), b2));
  if (0 <= a.indexOf("-"))
    throw Error('number format error: interior "-" character');
  for (var c = U(Math.pow(b2, 8)), d = V, e = 0; e < a.length; e += 8) {
    var f = Math.min(8, a.length - e), h = parseInt(a.substring(e, e + f), b2);
    8 > f ? (f = U(Math.pow(b2, f)), d = d.R(f).add(U(h))) : (d = d.R(c), d = d.add(U(h)));
  }
  return d;
}
var Ud = 4294967296;
var V = Td(0);
var Wd = Td(1);
var Xd = Td(16777216);
k = T.prototype;
k.ea = function() {
  if (X(this))
    return -W(this).ea();
  for (var a = 0, b2 = 1, c = 0; c < this.g.length; c++) {
    var d = this.D(c);
    a += (0 <= d ? d : Ud + d) * b2;
    b2 *= Ud;
  }
  return a;
};
k.toString = function(a) {
  a = a || 10;
  if (2 > a || 36 < a)
    throw Error("radix out of range: " + a);
  if (Y(this))
    return "0";
  if (X(this))
    return "-" + W(this).toString(a);
  for (var b2 = U(Math.pow(a, 6)), c = this, d = ""; ; ) {
    var e = Yd(c, b2).g;
    c = Zd(c, e.R(b2));
    var f = ((0 < c.g.length ? c.g[0] : c.h) >>> 0).toString(a);
    c = e;
    if (Y(c))
      return f + d;
    for (; 6 > f.length; )
      f = "0" + f;
    d = f + d;
  }
};
k.D = function(a) {
  return 0 > a ? 0 : a < this.g.length ? this.g[a] : this.h;
};
function Y(a) {
  if (0 != a.h)
    return false;
  for (var b2 = 0; b2 < a.g.length; b2++)
    if (0 != a.g[b2])
      return false;
  return true;
}
function X(a) {
  return -1 == a.h;
}
k.X = function(a) {
  a = Zd(this, a);
  return X(a) ? -1 : Y(a) ? 0 : 1;
};
function W(a) {
  for (var b2 = a.g.length, c = [], d = 0; d < b2; d++)
    c[d] = ~a.g[d];
  return new T(c, ~a.h).add(Wd);
}
k.abs = function() {
  return X(this) ? W(this) : this;
};
k.add = function(a) {
  for (var b2 = Math.max(this.g.length, a.g.length), c = [], d = 0, e = 0; e <= b2; e++) {
    var f = d + (this.D(e) & 65535) + (a.D(e) & 65535), h = (f >>> 16) + (this.D(e) >>> 16) + (a.D(e) >>> 16);
    d = h >>> 16;
    f &= 65535;
    h &= 65535;
    c[e] = h << 16 | f;
  }
  return new T(c, c[c.length - 1] & -2147483648 ? -1 : 0);
};
function Zd(a, b2) {
  return a.add(W(b2));
}
k.R = function(a) {
  if (Y(this) || Y(a))
    return V;
  if (X(this))
    return X(a) ? W(this).R(W(a)) : W(W(this).R(a));
  if (X(a))
    return W(this.R(W(a)));
  if (0 > this.X(Xd) && 0 > a.X(Xd))
    return U(this.ea() * a.ea());
  for (var b2 = this.g.length + a.g.length, c = [], d = 0; d < 2 * b2; d++)
    c[d] = 0;
  for (d = 0; d < this.g.length; d++)
    for (var e = 0; e < a.g.length; e++) {
      var f = this.D(d) >>> 16, h = this.D(d) & 65535, n = a.D(e) >>> 16, t = a.D(e) & 65535;
      c[2 * d + 2 * e] += h * t;
      $d(c, 2 * d + 2 * e);
      c[2 * d + 2 * e + 1] += f * t;
      $d(c, 2 * d + 2 * e + 1);
      c[2 * d + 2 * e + 1] += h * n;
      $d(c, 2 * d + 2 * e + 1);
      c[2 * d + 2 * e + 2] += f * n;
      $d(c, 2 * d + 2 * e + 2);
    }
  for (d = 0; d < b2; d++)
    c[d] = c[2 * d + 1] << 16 | c[2 * d];
  for (d = b2; d < 2 * b2; d++)
    c[d] = 0;
  return new T(c, 0);
};
function $d(a, b2) {
  for (; (a[b2] & 65535) != a[b2]; )
    a[b2 + 1] += a[b2] >>> 16, a[b2] &= 65535, b2++;
}
function ae(a, b2) {
  this.g = a;
  this.h = b2;
}
function Yd(a, b2) {
  if (Y(b2))
    throw Error("division by zero");
  if (Y(a))
    return new ae(V, V);
  if (X(a))
    return b2 = Yd(W(a), b2), new ae(W(b2.g), W(b2.h));
  if (X(b2))
    return b2 = Yd(a, W(b2)), new ae(W(b2.g), b2.h);
  if (30 < a.g.length) {
    if (X(a) || X(b2))
      throw Error("slowDivide_ only works with positive integers.");
    for (var c = Wd, d = b2; 0 >= d.X(a); )
      c = be(c), d = be(d);
    var e = Z(c, 1), f = Z(d, 1);
    d = Z(d, 2);
    for (c = Z(c, 2); !Y(d); ) {
      var h = f.add(d);
      0 >= h.X(a) && (e = e.add(c), f = h);
      d = Z(d, 1);
      c = Z(c, 1);
    }
    b2 = Zd(a, e.R(b2));
    return new ae(e, b2);
  }
  for (e = V; 0 <= a.X(b2); ) {
    c = Math.max(1, Math.floor(a.ea() / b2.ea()));
    d = Math.ceil(Math.log(c) / Math.LN2);
    d = 48 >= d ? 1 : Math.pow(2, d - 48);
    f = U(c);
    for (h = f.R(b2); X(h) || 0 < h.X(a); )
      c -= d, f = U(c), h = f.R(b2);
    Y(f) && (f = Wd);
    e = e.add(f);
    a = Zd(a, h);
  }
  return new ae(e, a);
}
k.gb = function(a) {
  return Yd(this, a).h;
};
k.and = function(a) {
  for (var b2 = Math.max(this.g.length, a.g.length), c = [], d = 0; d < b2; d++)
    c[d] = this.D(d) & a.D(d);
  return new T(c, this.h & a.h);
};
k.or = function(a) {
  for (var b2 = Math.max(this.g.length, a.g.length), c = [], d = 0; d < b2; d++)
    c[d] = this.D(d) | a.D(d);
  return new T(c, this.h | a.h);
};
k.xor = function(a) {
  for (var b2 = Math.max(this.g.length, a.g.length), c = [], d = 0; d < b2; d++)
    c[d] = this.D(d) ^ a.D(d);
  return new T(c, this.h ^ a.h);
};
function be(a) {
  for (var b2 = a.g.length + 1, c = [], d = 0; d < b2; d++)
    c[d] = a.D(d) << 1 | a.D(d - 1) >>> 31;
  return new T(c, a.h);
}
function Z(a, b2) {
  var c = b2 >> 5;
  b2 %= 32;
  for (var d = a.g.length - c, e = [], f = 0; f < d; f++)
    e[f] = 0 < b2 ? a.D(f + c) >>> b2 | a.D(f + c + 1) << 32 - b2 : a.D(f + c);
  return new T(e, a.h);
}
Od.prototype.createWebChannel = Od.prototype.g;
Q.prototype.send = Q.prototype.u;
Q.prototype.open = Q.prototype.m;
Q.prototype.close = Q.prototype.close;
Sb.NO_ERROR = 0;
Sb.TIMEOUT = 8;
Sb.HTTP_ERROR = 6;
Tb.COMPLETE = "complete";
Wb.EventType = Xb;
Xb.OPEN = "a";
Xb.CLOSE = "b";
Xb.ERROR = "c";
Xb.MESSAGE = "d";
B.prototype.listen = B.prototype.O;
P.prototype.listenOnce = P.prototype.P;
P.prototype.getLastError = P.prototype.Sa;
P.prototype.getLastErrorCode = P.prototype.Ia;
P.prototype.getStatus = P.prototype.da;
P.prototype.getResponseJson = P.prototype.Wa;
P.prototype.getResponseText = P.prototype.ja;
P.prototype.send = P.prototype.ha;
P.prototype.setWithCredentials = P.prototype.Oa;
S.prototype.digest = S.prototype.l;
S.prototype.reset = S.prototype.reset;
S.prototype.update = S.prototype.j;
T.prototype.add = T.prototype.add;
T.prototype.multiply = T.prototype.R;
T.prototype.modulo = T.prototype.gb;
T.prototype.compare = T.prototype.X;
T.prototype.toNumber = T.prototype.ea;
T.prototype.toString = T.prototype.toString;
T.prototype.getBits = T.prototype.D;
T.fromNumber = U;
T.fromString = Vd;
var createWebChannelTransport = esm.createWebChannelTransport = function() {
  return new Od();
};
var getStatEventTarget = esm.getStatEventTarget = function() {
  return Mb();
};
var ErrorCode = esm.ErrorCode = Sb;
var EventType = esm.EventType = Tb;
var Event = esm.Event = E;
var Stat = esm.Stat = { xb: 0, Ab: 1, Bb: 2, Ub: 3, Zb: 4, Wb: 5, Xb: 6, Vb: 7, Tb: 8, Yb: 9, PROXY: 10, NOPROXY: 11, Rb: 12, Nb: 13, Ob: 14, Mb: 15, Pb: 16, Qb: 17, tb: 18, sb: 19, ub: 20 };
var FetchXmlHttpFactory = esm.FetchXmlHttpFactory = ld;
var WebChannel = esm.WebChannel = Wb;
var XhrIo = esm.XhrIo = P;
var Md5 = esm.Md5 = S;
var Integer = esm.Integer = T;

// node_modules/@firebase/firestore/dist/index.esm2017.js
var w2 = "@firebase/firestore";
var User = class {
  constructor(e) {
    this.uid = e;
  }
  isAuthenticated() {
    return null != this.uid;
  }
  /**
   * Returns a key representing this user, suitable for inclusion in a
   * dictionary.
   */
  toKey() {
    return this.isAuthenticated() ? "uid:" + this.uid : "anonymous-user";
  }
  isEqual(e) {
    return e.uid === this.uid;
  }
};
User.UNAUTHENTICATED = new User(null), // TODO(mikelehen): Look into getting a proper uid-equivalent for
// non-FirebaseAuth providers.
User.GOOGLE_CREDENTIALS = new User("google-credentials-uid"), User.FIRST_PARTY = new User("first-party-uid"), User.MOCK_USER = new User("mock-user");
var S2 = "10.7.0";
var b = new Logger("@firebase/firestore");
function __PRIVATE_getLogLevel() {
  return b.logLevel;
}
function setLogLevel(e) {
  b.setLogLevel(e);
}
function __PRIVATE_logDebug(e, ...t) {
  if (b.logLevel <= LogLevel.DEBUG) {
    const n = t.map(__PRIVATE_argToString);
    b.debug(`Firestore (${S2}): ${e}`, ...n);
  }
}
function __PRIVATE_logError(e, ...t) {
  if (b.logLevel <= LogLevel.ERROR) {
    const n = t.map(__PRIVATE_argToString);
    b.error(`Firestore (${S2}): ${e}`, ...n);
  }
}
function __PRIVATE_logWarn(e, ...t) {
  if (b.logLevel <= LogLevel.WARN) {
    const n = t.map(__PRIVATE_argToString);
    b.warn(`Firestore (${S2}): ${e}`, ...n);
  }
}
function __PRIVATE_argToString(e) {
  if ("string" == typeof e)
    return e;
  try {
    return function __PRIVATE_formatJSON(e2) {
      return JSON.stringify(e2);
    }(e);
  } catch (t) {
    return e;
  }
}
function fail(e = "Unexpected state") {
  const t = `FIRESTORE (${S2}) INTERNAL ASSERTION FAILED: ` + e;
  throw __PRIVATE_logError(t), new Error(t);
}
function __PRIVATE_hardAssert(e, t) {
  e || fail();
}
function __PRIVATE_debugAssert(e, t) {
  e || fail();
}
function __PRIVATE_debugCast(e, t) {
  return e;
}
var D2 = {
  // Causes are copied from:
  // https://github.com/grpc/grpc/blob/bceec94ea4fc5f0085d81235d8e1c06798dc341a/include/grpc%2B%2B/impl/codegen/status_code_enum.h
  /** Not an error; returned on success. */
  OK: "ok",
  /** The operation was cancelled (typically by the caller). */
  CANCELLED: "cancelled",
  /** Unknown error or an error from a different error domain. */
  UNKNOWN: "unknown",
  /**
   * Client specified an invalid argument. Note that this differs from
   * FAILED_PRECONDITION. INVALID_ARGUMENT indicates arguments that are
   * problematic regardless of the state of the system (e.g., a malformed file
   * name).
   */
  INVALID_ARGUMENT: "invalid-argument",
  /**
   * Deadline expired before operation could complete. For operations that
   * change the state of the system, this error may be returned even if the
   * operation has completed successfully. For example, a successful response
   * from a server could have been delayed long enough for the deadline to
   * expire.
   */
  DEADLINE_EXCEEDED: "deadline-exceeded",
  /** Some requested entity (e.g., file or directory) was not found. */
  NOT_FOUND: "not-found",
  /**
   * Some entity that we attempted to create (e.g., file or directory) already
   * exists.
   */
  ALREADY_EXISTS: "already-exists",
  /**
   * The caller does not have permission to execute the specified operation.
   * PERMISSION_DENIED must not be used for rejections caused by exhausting
   * some resource (use RESOURCE_EXHAUSTED instead for those errors).
   * PERMISSION_DENIED must not be used if the caller can not be identified
   * (use UNAUTHENTICATED instead for those errors).
   */
  PERMISSION_DENIED: "permission-denied",
  /**
   * The request does not have valid authentication credentials for the
   * operation.
   */
  UNAUTHENTICATED: "unauthenticated",
  /**
   * Some resource has been exhausted, perhaps a per-user quota, or perhaps the
   * entire file system is out of space.
   */
  RESOURCE_EXHAUSTED: "resource-exhausted",
  /**
   * Operation was rejected because the system is not in a state required for
   * the operation's execution. For example, directory to be deleted may be
   * non-empty, an rmdir operation is applied to a non-directory, etc.
   *
   * A litmus test that may help a service implementor in deciding
   * between FAILED_PRECONDITION, ABORTED, and UNAVAILABLE:
   *  (a) Use UNAVAILABLE if the client can retry just the failing call.
   *  (b) Use ABORTED if the client should retry at a higher-level
   *      (e.g., restarting a read-modify-write sequence).
   *  (c) Use FAILED_PRECONDITION if the client should not retry until
   *      the system state has been explicitly fixed. E.g., if an "rmdir"
   *      fails because the directory is non-empty, FAILED_PRECONDITION
   *      should be returned since the client should not retry unless
   *      they have first fixed up the directory by deleting files from it.
   *  (d) Use FAILED_PRECONDITION if the client performs conditional
   *      REST Get/Update/Delete on a resource and the resource on the
   *      server does not match the condition. E.g., conflicting
   *      read-modify-write on the same resource.
   */
  FAILED_PRECONDITION: "failed-precondition",
  /**
   * The operation was aborted, typically due to a concurrency issue like
   * sequencer check failures, transaction aborts, etc.
   *
   * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
   * and UNAVAILABLE.
   */
  ABORTED: "aborted",
  /**
   * Operation was attempted past the valid range. E.g., seeking or reading
   * past end of file.
   *
   * Unlike INVALID_ARGUMENT, this error indicates a problem that may be fixed
   * if the system state changes. For example, a 32-bit file system will
   * generate INVALID_ARGUMENT if asked to read at an offset that is not in the
   * range [0,2^32-1], but it will generate OUT_OF_RANGE if asked to read from
   * an offset past the current file size.
   *
   * There is a fair bit of overlap between FAILED_PRECONDITION and
   * OUT_OF_RANGE. We recommend using OUT_OF_RANGE (the more specific error)
   * when it applies so that callers who are iterating through a space can
   * easily look for an OUT_OF_RANGE error to detect when they are done.
   */
  OUT_OF_RANGE: "out-of-range",
  /** Operation is not implemented or not supported/enabled in this service. */
  UNIMPLEMENTED: "unimplemented",
  /**
   * Internal errors. Means some invariants expected by underlying System has
   * been broken. If you see one of these errors, Something is very broken.
   */
  INTERNAL: "internal",
  /**
   * The service is currently unavailable. This is a most likely a transient
   * condition and may be corrected by retrying with a backoff.
   *
   * See litmus test above for deciding between FAILED_PRECONDITION, ABORTED,
   * and UNAVAILABLE.
   */
  UNAVAILABLE: "unavailable",
  /** Unrecoverable data loss or corruption. */
  DATA_LOSS: "data-loss"
};
var FirestoreError = class extends FirebaseError {
  /** @hideconstructor */
  constructor(e, t) {
    super(e, t), this.code = e, this.message = t, // HACK: We write a toString property directly because Error is not a real
    // class and so inheritance does not work correctly. We could alternatively
    // do the same "back-door inheritance" trick that FirebaseError does.
    this.toString = () => `${this.name}: [code=${this.code}]: ${this.message}`;
  }
};
var __PRIVATE_Deferred = class {
  constructor() {
    this.promise = new Promise((e, t) => {
      this.resolve = e, this.reject = t;
    });
  }
};
var __PRIVATE_OAuthToken = class {
  constructor(e, t) {
    this.user = t, this.type = "OAuth", this.headers = /* @__PURE__ */ new Map(), this.headers.set("Authorization", `Bearer ${e}`);
  }
};
var __PRIVATE_EmptyAuthCredentialsProvider = class {
  getToken() {
    return Promise.resolve(null);
  }
  invalidateToken() {
  }
  start(e, t) {
    e.enqueueRetryable(() => t(User.UNAUTHENTICATED));
  }
  shutdown() {
  }
};
var __PRIVATE_EmulatorAuthCredentialsProvider = class {
  constructor(e) {
    this.token = e, /**
     * Stores the listener registered with setChangeListener()
     * This isn't actually necessary since the UID never changes, but we use this
     * to verify the listen contract is adhered to in tests.
     */
    this.changeListener = null;
  }
  getToken() {
    return Promise.resolve(this.token);
  }
  invalidateToken() {
  }
  start(e, t) {
    this.changeListener = t, // Fire with initial user.
    e.enqueueRetryable(() => t(this.token.user));
  }
  shutdown() {
    this.changeListener = null;
  }
};
var __PRIVATE_FirebaseAuthCredentialsProvider = class {
  constructor(e) {
    this.t = e, /** Tracks the current User. */
    this.currentUser = User.UNAUTHENTICATED, /**
     * Counter used to detect if the token changed while a getToken request was
     * outstanding.
     */
    this.i = 0, this.forceRefresh = false, this.auth = null;
  }
  start(e, t) {
    let n = this.i;
    const __PRIVATE_guardedChangeListener = (e2) => this.i !== n ? (n = this.i, t(e2)) : Promise.resolve();
    let r2 = new __PRIVATE_Deferred();
    this.o = () => {
      this.i++, this.currentUser = this.u(), r2.resolve(), r2 = new __PRIVATE_Deferred(), e.enqueueRetryable(() => __PRIVATE_guardedChangeListener(this.currentUser));
    };
    const __PRIVATE_awaitNextToken = () => {
      const t2 = r2;
      e.enqueueRetryable(() => __async(this, null, function* () {
        yield t2.promise, yield __PRIVATE_guardedChangeListener(this.currentUser);
      }));
    }, __PRIVATE_registerAuth = (e2) => {
      __PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth detected"), this.auth = e2, this.auth.addAuthTokenListener(this.o), __PRIVATE_awaitNextToken();
    };
    this.t.onInit((e2) => __PRIVATE_registerAuth(e2)), // Our users can initialize Auth right after Firestore, so we give it
    // a chance to register itself with the component framework before we
    // determine whether to start up in unauthenticated mode.
    setTimeout(() => {
      if (!this.auth) {
        const e2 = this.t.getImmediate({
          optional: true
        });
        e2 ? __PRIVATE_registerAuth(e2) : (
          // If auth is still not available, proceed with `null` user
          (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "Auth not yet detected"), r2.resolve(), r2 = new __PRIVATE_Deferred())
        );
      }
    }, 0), __PRIVATE_awaitNextToken();
  }
  getToken() {
    const e = this.i, t = this.forceRefresh;
    return this.forceRefresh = false, this.auth ? this.auth.getToken(t).then((t2) => (
      // Cancel the request since the token changed while the request was
      // outstanding so the response is potentially for a previous user (which
      // user, we can't be sure).
      this.i !== e ? (__PRIVATE_logDebug("FirebaseAuthCredentialsProvider", "getToken aborted due to token change."), this.getToken()) : t2 ? (__PRIVATE_hardAssert("string" == typeof t2.accessToken), new __PRIVATE_OAuthToken(t2.accessToken, this.currentUser)) : null
    )) : Promise.resolve(null);
  }
  invalidateToken() {
    this.forceRefresh = true;
  }
  shutdown() {
    this.auth && this.auth.removeAuthTokenListener(this.o);
  }
  // Auth.getUid() can return null even with a user logged in. It is because
  // getUid() is synchronous, but the auth code populating Uid is asynchronous.
  // This method should only be called in the AuthTokenListener callback
  // to guarantee to get the actual user.
  u() {
    const e = this.auth && this.auth.getUid();
    return __PRIVATE_hardAssert(null === e || "string" == typeof e), new User(e);
  }
};
var __PRIVATE_FirstPartyToken = class {
  constructor(e, t, n) {
    this.l = e, this.h = t, this.P = n, this.type = "FirstParty", this.user = User.FIRST_PARTY, this.I = /* @__PURE__ */ new Map();
  }
  /**
   * Gets an authorization token, using a provided factory function, or return
   * null.
   */
  T() {
    return this.P ? this.P() : null;
  }
  get headers() {
    this.I.set("X-Goog-AuthUser", this.l);
    const e = this.T();
    return e && this.I.set("Authorization", e), this.h && this.I.set("X-Goog-Iam-Authorization-Token", this.h), this.I;
  }
};
var __PRIVATE_FirstPartyAuthCredentialsProvider = class {
  constructor(e, t, n) {
    this.l = e, this.h = t, this.P = n;
  }
  getToken() {
    return Promise.resolve(new __PRIVATE_FirstPartyToken(this.l, this.h, this.P));
  }
  start(e, t) {
    e.enqueueRetryable(() => t(User.FIRST_PARTY));
  }
  shutdown() {
  }
  invalidateToken() {
  }
};
var AppCheckToken = class {
  constructor(e) {
    this.value = e, this.type = "AppCheck", this.headers = /* @__PURE__ */ new Map(), e && e.length > 0 && this.headers.set("x-firebase-appcheck", this.value);
  }
};
var __PRIVATE_FirebaseAppCheckTokenProvider = class {
  constructor(e) {
    this.A = e, this.forceRefresh = false, this.appCheck = null, this.R = null;
  }
  start(e, t) {
    const onTokenChanged = (e2) => {
      null != e2.error && __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Error getting App Check token; using placeholder token instead. Error: ${e2.error.message}`);
      const n = e2.token !== this.R;
      return this.R = e2.token, __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", `Received ${n ? "new" : "existing"} token.`), n ? t(e2.token) : Promise.resolve();
    };
    this.o = (t2) => {
      e.enqueueRetryable(() => onTokenChanged(t2));
    };
    const __PRIVATE_registerAppCheck = (e2) => {
      __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck detected"), this.appCheck = e2, this.appCheck.addTokenListener(this.o);
    };
    this.A.onInit((e2) => __PRIVATE_registerAppCheck(e2)), // Our users can initialize AppCheck after Firestore, so we give it
    // a chance to register itself with the component framework.
    setTimeout(() => {
      if (!this.appCheck) {
        const e2 = this.A.getImmediate({
          optional: true
        });
        e2 ? __PRIVATE_registerAppCheck(e2) : (
          // If AppCheck is still not available, proceed without it.
          __PRIVATE_logDebug("FirebaseAppCheckTokenProvider", "AppCheck not yet detected")
        );
      }
    }, 0);
  }
  getToken() {
    const e = this.forceRefresh;
    return this.forceRefresh = false, this.appCheck ? this.appCheck.getToken(e).then((e2) => e2 ? (__PRIVATE_hardAssert("string" == typeof e2.token), this.R = e2.token, new AppCheckToken(e2.token)) : null) : Promise.resolve(null);
  }
  invalidateToken() {
    this.forceRefresh = true;
  }
  shutdown() {
    this.appCheck && this.appCheck.removeTokenListener(this.o);
  }
};
var __PRIVATE_EmptyAppCheckTokenProvider = class {
  getToken() {
    return Promise.resolve(new AppCheckToken(""));
  }
  invalidateToken() {
  }
  start(e, t) {
  }
  shutdown() {
  }
};
function __PRIVATE_randomBytes(e) {
  const t = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    "undefined" != typeof self && (self.crypto || self.msCrypto)
  ), n = new Uint8Array(e);
  if (t && "function" == typeof t.getRandomValues)
    t.getRandomValues(n);
  else
    for (let t2 = 0; t2 < e; t2++)
      n[t2] = Math.floor(256 * Math.random());
  return n;
}
var __PRIVATE_AutoId = class {
  static newId() {
    const e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", t = Math.floor(256 / e.length) * e.length;
    let n = "";
    for (; n.length < 20; ) {
      const r2 = __PRIVATE_randomBytes(40);
      for (let i = 0; i < r2.length; ++i)
        n.length < 20 && r2[i] < t && (n += e.charAt(r2[i] % e.length));
    }
    return n;
  }
};
function __PRIVATE_primitiveComparator(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
function __PRIVATE_arrayEquals(e, t, n) {
  return e.length === t.length && e.every((e2, r2) => n(e2, t[r2]));
}
function __PRIVATE_immediateSuccessor(e) {
  return e + "\0";
}
var Timestamp = class _Timestamp {
  /**
   * Creates a new timestamp.
   *
   * @param seconds - The number of seconds of UTC time since Unix epoch
   *     1970-01-01T00:00:00Z. Must be from 0001-01-01T00:00:00Z to
   *     9999-12-31T23:59:59Z inclusive.
   * @param nanoseconds - The non-negative fractions of a second at nanosecond
   *     resolution. Negative second values with fractions must still have
   *     non-negative nanoseconds values that count forward in time. Must be
   *     from 0 to 999,999,999 inclusive.
   */
  constructor(e, t) {
    if (this.seconds = e, this.nanoseconds = t, t < 0)
      throw new FirestoreError(D2.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
    if (t >= 1e9)
      throw new FirestoreError(D2.INVALID_ARGUMENT, "Timestamp nanoseconds out of range: " + t);
    if (e < -62135596800)
      throw new FirestoreError(D2.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
    if (e >= 253402300800)
      throw new FirestoreError(D2.INVALID_ARGUMENT, "Timestamp seconds out of range: " + e);
  }
  /**
   * Creates a new timestamp with the current date, with millisecond precision.
   *
   * @returns a new timestamp representing the current date.
   */
  static now() {
    return _Timestamp.fromMillis(Date.now());
  }
  /**
   * Creates a new timestamp from the given date.
   *
   * @param date - The date to initialize the `Timestamp` from.
   * @returns A new `Timestamp` representing the same point in time as the given
   *     date.
   */
  static fromDate(e) {
    return _Timestamp.fromMillis(e.getTime());
  }
  /**
   * Creates a new timestamp from the given number of milliseconds.
   *
   * @param milliseconds - Number of milliseconds since Unix epoch
   *     1970-01-01T00:00:00Z.
   * @returns A new `Timestamp` representing the same point in time as the given
   *     number of milliseconds.
   */
  static fromMillis(e) {
    const t = Math.floor(e / 1e3), n = Math.floor(1e6 * (e - 1e3 * t));
    return new _Timestamp(t, n);
  }
  /**
   * Converts a `Timestamp` to a JavaScript `Date` object. This conversion
   * causes a loss of precision since `Date` objects only support millisecond
   * precision.
   *
   * @returns JavaScript `Date` object representing the same point in time as
   *     this `Timestamp`, with millisecond precision.
   */
  toDate() {
    return new Date(this.toMillis());
  }
  /**
   * Converts a `Timestamp` to a numeric timestamp (in milliseconds since
   * epoch). This operation causes a loss of precision.
   *
   * @returns The point in time corresponding to this timestamp, represented as
   *     the number of milliseconds since Unix epoch 1970-01-01T00:00:00Z.
   */
  toMillis() {
    return 1e3 * this.seconds + this.nanoseconds / 1e6;
  }
  _compareTo(e) {
    return this.seconds === e.seconds ? __PRIVATE_primitiveComparator(this.nanoseconds, e.nanoseconds) : __PRIVATE_primitiveComparator(this.seconds, e.seconds);
  }
  /**
   * Returns true if this `Timestamp` is equal to the provided one.
   *
   * @param other - The `Timestamp` to compare against.
   * @returns true if this `Timestamp` is equal to the provided one.
   */
  isEqual(e) {
    return e.seconds === this.seconds && e.nanoseconds === this.nanoseconds;
  }
  /** Returns a textual representation of this `Timestamp`. */
  toString() {
    return "Timestamp(seconds=" + this.seconds + ", nanoseconds=" + this.nanoseconds + ")";
  }
  /** Returns a JSON-serializable representation of this `Timestamp`. */
  toJSON() {
    return {
      seconds: this.seconds,
      nanoseconds: this.nanoseconds
    };
  }
  /**
   * Converts this object to a primitive string, which allows `Timestamp` objects
   * to be compared using the `>`, `<=`, `>=` and `>` operators.
   */
  valueOf() {
    const e = this.seconds - -62135596800;
    return String(e).padStart(12, "0") + "." + String(this.nanoseconds).padStart(9, "0");
  }
};
var SnapshotVersion = class _SnapshotVersion {
  constructor(e) {
    this.timestamp = e;
  }
  static fromTimestamp(e) {
    return new _SnapshotVersion(e);
  }
  static min() {
    return new _SnapshotVersion(new Timestamp(0, 0));
  }
  static max() {
    return new _SnapshotVersion(new Timestamp(253402300799, 999999999));
  }
  compareTo(e) {
    return this.timestamp._compareTo(e.timestamp);
  }
  isEqual(e) {
    return this.timestamp.isEqual(e.timestamp);
  }
  /** Returns a number representation of the version for use in spec tests. */
  toMicroseconds() {
    return 1e6 * this.timestamp.seconds + this.timestamp.nanoseconds / 1e3;
  }
  toString() {
    return "SnapshotVersion(" + this.timestamp.toString() + ")";
  }
  toTimestamp() {
    return this.timestamp;
  }
};
var BasePath = class _BasePath {
  constructor(e, t, n) {
    void 0 === t ? t = 0 : t > e.length && fail(), void 0 === n ? n = e.length - t : n > e.length - t && fail(), this.segments = e, this.offset = t, this.len = n;
  }
  get length() {
    return this.len;
  }
  isEqual(e) {
    return 0 === _BasePath.comparator(this, e);
  }
  child(e) {
    const t = this.segments.slice(this.offset, this.limit());
    return e instanceof _BasePath ? e.forEach((e2) => {
      t.push(e2);
    }) : t.push(e), this.construct(t);
  }
  /** The index of one past the last segment of the path. */
  limit() {
    return this.offset + this.length;
  }
  popFirst(e) {
    return e = void 0 === e ? 1 : e, this.construct(this.segments, this.offset + e, this.length - e);
  }
  popLast() {
    return this.construct(this.segments, this.offset, this.length - 1);
  }
  firstSegment() {
    return this.segments[this.offset];
  }
  lastSegment() {
    return this.get(this.length - 1);
  }
  get(e) {
    return this.segments[this.offset + e];
  }
  isEmpty() {
    return 0 === this.length;
  }
  isPrefixOf(e) {
    if (e.length < this.length)
      return false;
    for (let t = 0; t < this.length; t++)
      if (this.get(t) !== e.get(t))
        return false;
    return true;
  }
  isImmediateParentOf(e) {
    if (this.length + 1 !== e.length)
      return false;
    for (let t = 0; t < this.length; t++)
      if (this.get(t) !== e.get(t))
        return false;
    return true;
  }
  forEach(e) {
    for (let t = this.offset, n = this.limit(); t < n; t++)
      e(this.segments[t]);
  }
  toArray() {
    return this.segments.slice(this.offset, this.limit());
  }
  static comparator(e, t) {
    const n = Math.min(e.length, t.length);
    for (let r2 = 0; r2 < n; r2++) {
      const n2 = e.get(r2), i = t.get(r2);
      if (n2 < i)
        return -1;
      if (n2 > i)
        return 1;
    }
    return e.length < t.length ? -1 : e.length > t.length ? 1 : 0;
  }
};
var ResourcePath = class _ResourcePath extends BasePath {
  construct(e, t, n) {
    return new _ResourcePath(e, t, n);
  }
  canonicalString() {
    return this.toArray().join("/");
  }
  toString() {
    return this.canonicalString();
  }
  /**
   * Creates a resource path from the given slash-delimited string. If multiple
   * arguments are provided, all components are combined. Leading and trailing
   * slashes from all components are ignored.
   */
  static fromString(...e) {
    const t = [];
    for (const n of e) {
      if (n.indexOf("//") >= 0)
        throw new FirestoreError(D2.INVALID_ARGUMENT, `Invalid segment (${n}). Paths must not contain // in them.`);
      t.push(...n.split("/").filter((e2) => e2.length > 0));
    }
    return new _ResourcePath(t);
  }
  static emptyPath() {
    return new _ResourcePath([]);
  }
};
var C2 = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
var FieldPath$1 = class _FieldPath$1 extends BasePath {
  construct(e, t, n) {
    return new _FieldPath$1(e, t, n);
  }
  /**
   * Returns true if the string could be used as a segment in a field path
   * without escaping.
   */
  static isValidIdentifier(e) {
    return C2.test(e);
  }
  canonicalString() {
    return this.toArray().map((e) => (e = e.replace(/\\/g, "\\\\").replace(/`/g, "\\`"), _FieldPath$1.isValidIdentifier(e) || (e = "`" + e + "`"), e)).join(".");
  }
  toString() {
    return this.canonicalString();
  }
  /**
   * Returns true if this field references the key of a document.
   */
  isKeyField() {
    return 1 === this.length && "__name__" === this.get(0);
  }
  /**
   * The field designating the key of a document.
   */
  static keyField() {
    return new _FieldPath$1(["__name__"]);
  }
  /**
   * Parses a field string from the given server-formatted string.
   *
   * - Splitting the empty string is not allowed (for now at least).
   * - Empty segments within the string (e.g. if there are two consecutive
   *   separators) are not allowed.
   *
   * TODO(b/37244157): we should make this more strict. Right now, it allows
   * non-identifier path components, even if they aren't escaped.
   */
  static fromServerFormat(e) {
    const t = [];
    let n = "", r2 = 0;
    const __PRIVATE_addCurrentSegment = () => {
      if (0 === n.length)
        throw new FirestoreError(D2.INVALID_ARGUMENT, `Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);
      t.push(n), n = "";
    };
    let i = false;
    for (; r2 < e.length; ) {
      const t2 = e[r2];
      if ("\\" === t2) {
        if (r2 + 1 === e.length)
          throw new FirestoreError(D2.INVALID_ARGUMENT, "Path has trailing escape character: " + e);
        const t3 = e[r2 + 1];
        if ("\\" !== t3 && "." !== t3 && "`" !== t3)
          throw new FirestoreError(D2.INVALID_ARGUMENT, "Path has invalid escape sequence: " + e);
        n += t3, r2 += 2;
      } else
        "`" === t2 ? (i = !i, r2++) : "." !== t2 || i ? (n += t2, r2++) : (__PRIVATE_addCurrentSegment(), r2++);
    }
    if (__PRIVATE_addCurrentSegment(), i)
      throw new FirestoreError(D2.INVALID_ARGUMENT, "Unterminated ` in path: " + e);
    return new _FieldPath$1(t);
  }
  static emptyPath() {
    return new _FieldPath$1([]);
  }
};
var DocumentKey = class _DocumentKey {
  constructor(e) {
    this.path = e;
  }
  static fromPath(e) {
    return new _DocumentKey(ResourcePath.fromString(e));
  }
  static fromName(e) {
    return new _DocumentKey(ResourcePath.fromString(e).popFirst(5));
  }
  static empty() {
    return new _DocumentKey(ResourcePath.emptyPath());
  }
  get collectionGroup() {
    return this.path.popLast().lastSegment();
  }
  /** Returns true if the document is in the specified collectionId. */
  hasCollectionId(e) {
    return this.path.length >= 2 && this.path.get(this.path.length - 2) === e;
  }
  /** Returns the collection group (i.e. the name of the parent collection) for this key. */
  getCollectionGroup() {
    return this.path.get(this.path.length - 2);
  }
  /** Returns the fully qualified path to the parent collection. */
  getCollectionPath() {
    return this.path.popLast();
  }
  isEqual(e) {
    return null !== e && 0 === ResourcePath.comparator(this.path, e.path);
  }
  toString() {
    return this.path.toString();
  }
  static comparator(e, t) {
    return ResourcePath.comparator(e.path, t.path);
  }
  static isDocumentKey(e) {
    return e.length % 2 == 0;
  }
  /**
   * Creates and returns a new document key with the given segments.
   *
   * @param segments - The segments of the path to the document
   * @returns A new instance of DocumentKey
   */
  static fromSegments(e) {
    return new _DocumentKey(new ResourcePath(e.slice()));
  }
};
var FieldIndex = class {
  constructor(e, t, n, r2) {
    this.indexId = e, this.collectionGroup = t, this.fields = n, this.indexState = r2;
  }
};
function __PRIVATE_fieldIndexGetArraySegment(e) {
  return e.fields.find((e2) => 2 === e2.kind);
}
function __PRIVATE_fieldIndexGetDirectionalSegments(e) {
  return e.fields.filter((e2) => 2 !== e2.kind);
}
function __PRIVATE_fieldIndexSemanticComparator(e, t) {
  let n = __PRIVATE_primitiveComparator(e.collectionGroup, t.collectionGroup);
  if (0 !== n)
    return n;
  for (let r2 = 0; r2 < Math.min(e.fields.length, t.fields.length); ++r2)
    if (n = __PRIVATE_indexSegmentComparator(e.fields[r2], t.fields[r2]), 0 !== n)
      return n;
  return __PRIVATE_primitiveComparator(e.fields.length, t.fields.length);
}
FieldIndex.UNKNOWN_ID = -1;
var IndexSegment = class {
  constructor(e, t) {
    this.fieldPath = e, this.kind = t;
  }
};
function __PRIVATE_indexSegmentComparator(e, t) {
  const n = FieldPath$1.comparator(e.fieldPath, t.fieldPath);
  return 0 !== n ? n : __PRIVATE_primitiveComparator(e.kind, t.kind);
}
var IndexState = class _IndexState {
  constructor(e, t) {
    this.sequenceNumber = e, this.offset = t;
  }
  /** The state of an index that has not yet been backfilled. */
  static empty() {
    return new _IndexState(0, IndexOffset.min());
  }
};
function __PRIVATE_newIndexOffsetSuccessorFromReadTime(e, t) {
  const n = e.toTimestamp().seconds, r2 = e.toTimestamp().nanoseconds + 1, i = SnapshotVersion.fromTimestamp(1e9 === r2 ? new Timestamp(n + 1, 0) : new Timestamp(n, r2));
  return new IndexOffset(i, DocumentKey.empty(), t);
}
function __PRIVATE_newIndexOffsetFromDocument(e) {
  return new IndexOffset(e.readTime, e.key, -1);
}
var IndexOffset = class _IndexOffset {
  constructor(e, t, n) {
    this.readTime = e, this.documentKey = t, this.largestBatchId = n;
  }
  /** Returns an offset that sorts before all regular offsets. */
  static min() {
    return new _IndexOffset(SnapshotVersion.min(), DocumentKey.empty(), -1);
  }
  /** Returns an offset that sorts after all regular offsets. */
  static max() {
    return new _IndexOffset(SnapshotVersion.max(), DocumentKey.empty(), -1);
  }
};
function __PRIVATE_indexOffsetComparator(e, t) {
  let n = e.readTime.compareTo(t.readTime);
  return 0 !== n ? n : (n = DocumentKey.comparator(e.documentKey, t.documentKey), 0 !== n ? n : __PRIVATE_primitiveComparator(e.largestBatchId, t.largestBatchId));
}
var v2 = "The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";
var PersistenceTransaction = class {
  constructor() {
    this.onCommittedListeners = [];
  }
  addOnCommittedListener(e) {
    this.onCommittedListeners.push(e);
  }
  raiseOnCommittedEvent() {
    this.onCommittedListeners.forEach((e) => e());
  }
};
function __PRIVATE_ignoreIfPrimaryLeaseLoss(e) {
  return __async(this, null, function* () {
    if (e.code !== D2.FAILED_PRECONDITION || e.message !== v2)
      throw e;
    __PRIVATE_logDebug("LocalStore", "Unexpectedly lost primary lease");
  });
}
var PersistencePromise = class _PersistencePromise {
  constructor(e) {
    this.nextCallback = null, this.catchCallback = null, // When the operation resolves, we'll set result or error and mark isDone.
    this.result = void 0, this.error = void 0, this.isDone = false, // Set to true when .then() or .catch() are called and prevents additional
    // chaining.
    this.callbackAttached = false, e((e2) => {
      this.isDone = true, this.result = e2, this.nextCallback && // value should be defined unless T is Void, but we can't express
      // that in the type system.
      this.nextCallback(e2);
    }, (e2) => {
      this.isDone = true, this.error = e2, this.catchCallback && this.catchCallback(e2);
    });
  }
  catch(e) {
    return this.next(void 0, e);
  }
  next(e, t) {
    return this.callbackAttached && fail(), this.callbackAttached = true, this.isDone ? this.error ? this.wrapFailure(t, this.error) : this.wrapSuccess(e, this.result) : new _PersistencePromise((n, r2) => {
      this.nextCallback = (t2) => {
        this.wrapSuccess(e, t2).next(n, r2);
      }, this.catchCallback = (e2) => {
        this.wrapFailure(t, e2).next(n, r2);
      };
    });
  }
  toPromise() {
    return new Promise((e, t) => {
      this.next(e, t);
    });
  }
  wrapUserFunction(e) {
    try {
      const t = e();
      return t instanceof _PersistencePromise ? t : _PersistencePromise.resolve(t);
    } catch (e2) {
      return _PersistencePromise.reject(e2);
    }
  }
  wrapSuccess(e, t) {
    return e ? this.wrapUserFunction(() => e(t)) : _PersistencePromise.resolve(t);
  }
  wrapFailure(e, t) {
    return e ? this.wrapUserFunction(() => e(t)) : _PersistencePromise.reject(t);
  }
  static resolve(e) {
    return new _PersistencePromise((t, n) => {
      t(e);
    });
  }
  static reject(e) {
    return new _PersistencePromise((t, n) => {
      n(e);
    });
  }
  static waitFor(e) {
    return new _PersistencePromise((t, n) => {
      let r2 = 0, i = 0, s = false;
      e.forEach((e2) => {
        ++r2, e2.next(() => {
          ++i, s && i === r2 && t();
        }, (e3) => n(e3));
      }), s = true, i === r2 && t();
    });
  }
  /**
   * Given an array of predicate functions that asynchronously evaluate to a
   * boolean, implements a short-circuiting `or` between the results. Predicates
   * will be evaluated until one of them returns `true`, then stop. The final
   * result will be whether any of them returned `true`.
   */
  static or(e) {
    let t = _PersistencePromise.resolve(false);
    for (const n of e)
      t = t.next((e2) => e2 ? _PersistencePromise.resolve(e2) : n());
    return t;
  }
  static forEach(e, t) {
    const n = [];
    return e.forEach((e2, r2) => {
      n.push(t.call(this, e2, r2));
    }), this.waitFor(n);
  }
  /**
   * Concurrently map all array elements through asynchronous function.
   */
  static mapArray(e, t) {
    return new _PersistencePromise((n, r2) => {
      const i = e.length, s = new Array(i);
      let o = 0;
      for (let _ = 0; _ < i; _++) {
        const a = _;
        t(e[a]).next((e2) => {
          s[a] = e2, ++o, o === i && n(s);
        }, (e2) => r2(e2));
      }
    });
  }
  /**
   * An alternative to recursive PersistencePromise calls, that avoids
   * potential memory problems from unbounded chains of promises.
   *
   * The `action` will be called repeatedly while `condition` is true.
   */
  static doWhile(e, t) {
    return new _PersistencePromise((n, r2) => {
      const process2 = () => {
        true === e() ? t().next(() => {
          process2();
        }, r2) : n();
      };
      process2();
    });
  }
};
var __PRIVATE_SimpleDbTransaction = class ___PRIVATE_SimpleDbTransaction {
  constructor(e, t) {
    this.action = e, this.transaction = t, this.aborted = false, /**
     * A `Promise` that resolves with the result of the IndexedDb transaction.
     */
    this.V = new __PRIVATE_Deferred(), this.transaction.oncomplete = () => {
      this.V.resolve();
    }, this.transaction.onabort = () => {
      t.error ? this.V.reject(new __PRIVATE_IndexedDbTransactionError(e, t.error)) : this.V.resolve();
    }, this.transaction.onerror = (t2) => {
      const n = __PRIVATE_checkForAndReportiOSError(t2.target.error);
      this.V.reject(new __PRIVATE_IndexedDbTransactionError(e, n));
    };
  }
  static open(e, t, n, r2) {
    try {
      return new ___PRIVATE_SimpleDbTransaction(t, e.transaction(r2, n));
    } catch (e2) {
      throw new __PRIVATE_IndexedDbTransactionError(t, e2);
    }
  }
  get m() {
    return this.V.promise;
  }
  abort(e) {
    e && this.V.reject(e), this.aborted || (__PRIVATE_logDebug("SimpleDb", "Aborting transaction:", e ? e.message : "Client-initiated abort"), this.aborted = true, this.transaction.abort());
  }
  g() {
    const e = this.transaction;
    this.aborted || "function" != typeof e.commit || e.commit();
  }
  /**
   * Returns a SimpleDbStore<KeyType, ValueType> for the specified store. All
   * operations performed on the SimpleDbStore happen within the context of this
   * transaction and it cannot be used anymore once the transaction is
   * completed.
   *
   * Note that we can't actually enforce that the KeyType and ValueType are
   * correct, but they allow type safety through the rest of the consuming code.
   */
  store(e) {
    const t = this.transaction.objectStore(e);
    return new __PRIVATE_SimpleDbStore(t);
  }
};
var __PRIVATE_SimpleDb = class ___PRIVATE_SimpleDb {
  /*
   * Creates a new SimpleDb wrapper for IndexedDb database `name`.
   *
   * Note that `version` must not be a downgrade. IndexedDB does not support
   * downgrading the schema version. We currently do not support any way to do
   * versioning outside of IndexedDB's versioning mechanism, as only
   * version-upgrade transactions are allowed to do things like create
   * objectstores.
   */
  constructor(e, t, n) {
    this.name = e, this.version = t, this.p = n;
    12.2 === ___PRIVATE_SimpleDb.S(getUA()) && __PRIVATE_logError("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.");
  }
  /** Deletes the specified database. */
  static delete(e) {
    return __PRIVATE_logDebug("SimpleDb", "Removing database:", e), __PRIVATE_wrapRequest(window.indexedDB.deleteDatabase(e)).toPromise();
  }
  /** Returns true if IndexedDB is available in the current environment. */
  static D() {
    if (!isIndexedDBAvailable())
      return false;
    if (___PRIVATE_SimpleDb.C())
      return true;
    const e = getUA(), t = ___PRIVATE_SimpleDb.S(e), n = 0 < t && t < 10, r2 = ___PRIVATE_SimpleDb.v(e), i = 0 < r2 && r2 < 4.5;
    return !(e.indexOf("MSIE ") > 0 || e.indexOf("Trident/") > 0 || e.indexOf("Edge/") > 0 || n || i);
  }
  /**
   * Returns true if the backing IndexedDB store is the Node IndexedDBShim
   * (see https://github.com/axemclion/IndexedDBShim).
   */
  static C() {
    var e;
    return "undefined" != typeof process && "YES" === (null === (e = process.env) || void 0 === e ? void 0 : e.F);
  }
  /** Helper to get a typed SimpleDbStore from a transaction. */
  static M(e, t) {
    return e.store(t);
  }
  // visible for testing
  /** Parse User Agent to determine iOS version. Returns -1 if not found. */
  static S(e) {
    const t = e.match(/i(?:phone|pad|pod) os ([\d_]+)/i), n = t ? t[1].split("_").slice(0, 2).join(".") : "-1";
    return Number(n);
  }
  // visible for testing
  /** Parse User Agent to determine Android version. Returns -1 if not found. */
  static v(e) {
    const t = e.match(/Android ([\d.]+)/i), n = t ? t[1].split(".").slice(0, 2).join(".") : "-1";
    return Number(n);
  }
  /**
   * Opens the specified database, creating or upgrading it if necessary.
   */
  O(e) {
    return __async(this, null, function* () {
      return this.db || (__PRIVATE_logDebug("SimpleDb", "Opening database:", this.name), this.db = yield new Promise((t, n) => {
        const r2 = indexedDB.open(this.name, this.version);
        r2.onsuccess = (e2) => {
          const n2 = e2.target.result;
          t(n2);
        }, r2.onblocked = () => {
          n(new __PRIVATE_IndexedDbTransactionError(e, "Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."));
        }, r2.onerror = (t2) => {
          const r3 = t2.target.error;
          "VersionError" === r3.name ? n(new FirestoreError(D2.FAILED_PRECONDITION, "A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")) : "InvalidStateError" === r3.name ? n(new FirestoreError(D2.FAILED_PRECONDITION, "Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: " + r3)) : n(new __PRIVATE_IndexedDbTransactionError(e, r3));
        }, r2.onupgradeneeded = (e2) => {
          __PRIVATE_logDebug("SimpleDb", 'Database "' + this.name + '" requires upgrade from version:', e2.oldVersion);
          const t2 = e2.target.result;
          this.p.N(t2, r2.transaction, e2.oldVersion, this.version).next(() => {
            __PRIVATE_logDebug("SimpleDb", "Database upgrade to version " + this.version + " complete");
          });
        };
      })), this.B && (this.db.onversionchange = (e2) => this.B(e2)), this.db;
    });
  }
  L(e) {
    this.B = e, this.db && (this.db.onversionchange = (t) => e(t));
  }
  runTransaction(e, t, n, r2) {
    return __async(this, null, function* () {
      const i = "readonly" === t;
      let s = 0;
      for (; ; ) {
        ++s;
        try {
          this.db = yield this.O(e);
          const t2 = __PRIVATE_SimpleDbTransaction.open(this.db, e, i ? "readonly" : "readwrite", n), s2 = r2(t2).next((e2) => (t2.g(), e2)).catch((e2) => (
            // Abort the transaction if there was an error.
            (t2.abort(e2), PersistencePromise.reject(e2))
          )).toPromise();
          return s2.catch(() => {
          }), // Wait for the transaction to complete (i.e. IndexedDb's onsuccess event to
          // fire), but still return the original transactionFnResult back to the
          // caller.
          yield t2.m, s2;
        } catch (e2) {
          const t2 = e2, n2 = "FirebaseError" !== t2.name && s < 3;
          if (__PRIVATE_logDebug("SimpleDb", "Transaction failed with error:", t2.message, "Retrying:", n2), this.close(), !n2)
            return Promise.reject(t2);
        }
      }
    });
  }
  close() {
    this.db && this.db.close(), this.db = void 0;
  }
};
var __PRIVATE_IterationController = class {
  constructor(e) {
    this.k = e, this.q = false, this.K = null;
  }
  get isDone() {
    return this.q;
  }
  get $() {
    return this.K;
  }
  set cursor(e) {
    this.k = e;
  }
  /**
   * This function can be called to stop iteration at any point.
   */
  done() {
    this.q = true;
  }
  /**
   * This function can be called to skip to that next key, which could be
   * an index or a primary key.
   */
  U(e) {
    this.K = e;
  }
  /**
   * Delete the current cursor value from the object store.
   *
   * NOTE: You CANNOT do this with a keysOnly query.
   */
  delete() {
    return __PRIVATE_wrapRequest(this.k.delete());
  }
};
var __PRIVATE_IndexedDbTransactionError = class extends FirestoreError {
  constructor(e, t) {
    super(D2.UNAVAILABLE, `IndexedDB transaction '${e}' failed: ${t}`), this.name = "IndexedDbTransactionError";
  }
};
function __PRIVATE_isIndexedDbTransactionError(e) {
  return "IndexedDbTransactionError" === e.name;
}
var __PRIVATE_SimpleDbStore = class {
  constructor(e) {
    this.store = e;
  }
  put(e, t) {
    let n;
    return void 0 !== t ? (__PRIVATE_logDebug("SimpleDb", "PUT", this.store.name, e, t), n = this.store.put(t, e)) : (__PRIVATE_logDebug("SimpleDb", "PUT", this.store.name, "<auto-key>", e), n = this.store.put(e)), __PRIVATE_wrapRequest(n);
  }
  /**
   * Adds a new value into an Object Store and returns the new key. Similar to
   * IndexedDb's `add()`, this method will fail on primary key collisions.
   *
   * @param value - The object to write.
   * @returns The key of the value to add.
   */
  add(e) {
    __PRIVATE_logDebug("SimpleDb", "ADD", this.store.name, e, e);
    return __PRIVATE_wrapRequest(this.store.add(e));
  }
  /**
   * Gets the object with the specified key from the specified store, or null
   * if no object exists with the specified key.
   *
   * @key The key of the object to get.
   * @returns The object with the specified key or null if no object exists.
   */
  get(e) {
    return __PRIVATE_wrapRequest(this.store.get(e)).next((t) => (
      // Normalize nonexistence to null.
      (void 0 === t && (t = null), __PRIVATE_logDebug("SimpleDb", "GET", this.store.name, e, t), t)
    ));
  }
  delete(e) {
    __PRIVATE_logDebug("SimpleDb", "DELETE", this.store.name, e);
    return __PRIVATE_wrapRequest(this.store.delete(e));
  }
  /**
   * If we ever need more of the count variants, we can add overloads. For now,
   * all we need is to count everything in a store.
   *
   * Returns the number of rows in the store.
   */
  count() {
    __PRIVATE_logDebug("SimpleDb", "COUNT", this.store.name);
    return __PRIVATE_wrapRequest(this.store.count());
  }
  W(e, t) {
    const n = this.options(e, t);
    if (n.index || "function" != typeof this.store.getAll) {
      const e2 = this.cursor(n), t2 = [];
      return this.G(e2, (e3, n2) => {
        t2.push(n2);
      }).next(() => t2);
    }
    {
      const e2 = this.store.getAll(n.range);
      return new PersistencePromise((t2, n2) => {
        e2.onerror = (e3) => {
          n2(e3.target.error);
        }, e2.onsuccess = (e3) => {
          t2(e3.target.result);
        };
      });
    }
  }
  /**
   * Loads the first `count` elements from the provided index range. Loads all
   * elements if no limit is provided.
   */
  j(e, t) {
    const n = this.store.getAll(e, null === t ? void 0 : t);
    return new PersistencePromise((e2, t2) => {
      n.onerror = (e3) => {
        t2(e3.target.error);
      }, n.onsuccess = (t3) => {
        e2(t3.target.result);
      };
    });
  }
  H(e, t) {
    __PRIVATE_logDebug("SimpleDb", "DELETE ALL", this.store.name);
    const n = this.options(e, t);
    n.J = false;
    const r2 = this.cursor(n);
    return this.G(r2, (e2, t2, n2) => n2.delete());
  }
  Y(e, t) {
    let n;
    t ? n = e : (n = {}, t = e);
    const r2 = this.cursor(n);
    return this.G(r2, t);
  }
  /**
   * Iterates over a store, but waits for the given callback to complete for
   * each entry before iterating the next entry. This allows the callback to do
   * asynchronous work to determine if this iteration should continue.
   *
   * The provided callback should return `true` to continue iteration, and
   * `false` otherwise.
   */
  Z(e) {
    const t = this.cursor({});
    return new PersistencePromise((n, r2) => {
      t.onerror = (e2) => {
        const t2 = __PRIVATE_checkForAndReportiOSError(e2.target.error);
        r2(t2);
      }, t.onsuccess = (t2) => {
        const r3 = t2.target.result;
        r3 ? e(r3.primaryKey, r3.value).next((e2) => {
          e2 ? r3.continue() : n();
        }) : n();
      };
    });
  }
  G(e, t) {
    const n = [];
    return new PersistencePromise((r2, i) => {
      e.onerror = (e2) => {
        i(e2.target.error);
      }, e.onsuccess = (e2) => {
        const i2 = e2.target.result;
        if (!i2)
          return void r2();
        const s = new __PRIVATE_IterationController(i2), o = t(i2.primaryKey, i2.value, s);
        if (o instanceof PersistencePromise) {
          const e3 = o.catch((e4) => (s.done(), PersistencePromise.reject(e4)));
          n.push(e3);
        }
        s.isDone ? r2() : null === s.$ ? i2.continue() : i2.continue(s.$);
      };
    }).next(() => PersistencePromise.waitFor(n));
  }
  options(e, t) {
    let n;
    return void 0 !== e && ("string" == typeof e ? n = e : t = e), {
      index: n,
      range: t
    };
  }
  cursor(e) {
    let t = "next";
    if (e.reverse && (t = "prev"), e.index) {
      const n = this.store.index(e.index);
      return e.J ? n.openKeyCursor(e.range, t) : n.openCursor(e.range, t);
    }
    return this.store.openCursor(e.range, t);
  }
};
function __PRIVATE_wrapRequest(e) {
  return new PersistencePromise((t, n) => {
    e.onsuccess = (e2) => {
      const n2 = e2.target.result;
      t(n2);
    }, e.onerror = (e2) => {
      const t2 = __PRIVATE_checkForAndReportiOSError(e2.target.error);
      n(t2);
    };
  });
}
var F2 = false;
function __PRIVATE_checkForAndReportiOSError(e) {
  const t = __PRIVATE_SimpleDb.S(getUA());
  if (t >= 12.2 && t < 13) {
    const t2 = "An internal error was encountered in the Indexed Database server";
    if (e.message.indexOf(t2) >= 0) {
      const e2 = new FirestoreError("internal", `IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t2}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);
      return F2 || (F2 = true, // Throw a global exception outside of this promise chain, for the user to
      // potentially catch.
      setTimeout(() => {
        throw e2;
      }, 0)), e2;
    }
  }
  return e;
}
var __PRIVATE_IndexBackfillerScheduler = class {
  constructor(e, t) {
    this.asyncQueue = e, this.X = t, this.task = null;
  }
  start() {
    this.ee(15e3);
  }
  stop() {
    this.task && (this.task.cancel(), this.task = null);
  }
  get started() {
    return null !== this.task;
  }
  ee(e) {
    __PRIVATE_logDebug("IndexBackiller", `Scheduled in ${e}ms`), this.task = this.asyncQueue.enqueueAfterDelay("index_backfill", e, () => __async(this, null, function* () {
      this.task = null;
      try {
        __PRIVATE_logDebug("IndexBackiller", `Documents written: ${yield this.X.te()}`);
      } catch (e2) {
        __PRIVATE_isIndexedDbTransactionError(e2) ? __PRIVATE_logDebug("IndexBackiller", "Ignoring IndexedDB error during index backfill: ", e2) : yield __PRIVATE_ignoreIfPrimaryLeaseLoss(e2);
      }
      yield this.ee(6e4);
    }));
  }
};
var __PRIVATE_IndexBackfiller = class {
  constructor(e, t) {
    this.localStore = e, this.persistence = t;
  }
  te(e = 50) {
    return __async(this, null, function* () {
      return this.persistence.runTransaction("Backfill Indexes", "readwrite-primary", (t) => this.ne(t, e));
    });
  }
  /** Writes index entries until the cap is reached. Returns the number of documents processed. */
  ne(e, t) {
    const n = /* @__PURE__ */ new Set();
    let r2 = t, i = true;
    return PersistencePromise.doWhile(() => true === i && r2 > 0, () => this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next((t2) => {
      if (null !== t2 && !n.has(t2))
        return __PRIVATE_logDebug("IndexBackiller", `Processing collection: ${t2}`), this.re(e, t2, r2).next((e2) => {
          r2 -= e2, n.add(t2);
        });
      i = false;
    })).next(() => t - r2);
  }
  /**
   * Writes entries for the provided collection group. Returns the number of documents processed.
   */
  re(e, t, n) {
    return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e, t).next((r2) => this.localStore.localDocuments.getNextDocuments(e, t, r2, n).next((n2) => {
      const i = n2.changes;
      return this.localStore.indexManager.updateIndexEntries(e, i).next(() => this.ie(r2, n2)).next((n3) => (__PRIVATE_logDebug("IndexBackiller", `Updating offset: ${n3}`), this.localStore.indexManager.updateCollectionGroup(e, t, n3))).next(() => i.size);
    }));
  }
  /** Returns the next offset based on the provided documents. */
  ie(e, t) {
    let n = e;
    return t.changes.forEach((e2, t2) => {
      const r2 = __PRIVATE_newIndexOffsetFromDocument(t2);
      __PRIVATE_indexOffsetComparator(r2, n) > 0 && (n = r2);
    }), new IndexOffset(n.readTime, n.documentKey, Math.max(t.batchId, e.largestBatchId));
  }
};
var __PRIVATE_ListenSequence = class {
  constructor(e, t) {
    this.previousValue = e, t && (t.sequenceNumberHandler = (e2) => this.se(e2), this.oe = (e2) => t.writeSequenceNumber(e2));
  }
  se(e) {
    return this.previousValue = Math.max(e, this.previousValue), this.previousValue;
  }
  next() {
    const e = ++this.previousValue;
    return this.oe && this.oe(e), e;
  }
};
__PRIVATE_ListenSequence._e = -1;
function __PRIVATE_isNullOrUndefined(e) {
  return null == e;
}
function __PRIVATE_isNegativeZero(e) {
  return 0 === e && 1 / e == -1 / 0;
}
function isSafeInteger(e) {
  return "number" == typeof e && Number.isInteger(e) && !__PRIVATE_isNegativeZero(e) && e <= Number.MAX_SAFE_INTEGER && e >= Number.MIN_SAFE_INTEGER;
}
function __PRIVATE_encodeResourcePath(e) {
  let t = "";
  for (let n = 0; n < e.length; n++)
    t.length > 0 && (t = __PRIVATE_encodeSeparator(t)), t = __PRIVATE_encodeSegment(e.get(n), t);
  return __PRIVATE_encodeSeparator(t);
}
function __PRIVATE_encodeSegment(e, t) {
  let n = t;
  const r2 = e.length;
  for (let t2 = 0; t2 < r2; t2++) {
    const r3 = e.charAt(t2);
    switch (r3) {
      case "\0":
        n += "";
        break;
      case "":
        n += "";
        break;
      default:
        n += r3;
    }
  }
  return n;
}
function __PRIVATE_encodeSeparator(e) {
  return e + "";
}
function __PRIVATE_decodeResourcePath(e) {
  const t = e.length;
  if (__PRIVATE_hardAssert(t >= 2), 2 === t)
    return __PRIVATE_hardAssert("" === e.charAt(0) && "" === e.charAt(1)), ResourcePath.emptyPath();
  const __PRIVATE_lastReasonableEscapeIndex = t - 2, n = [];
  let r2 = "";
  for (let i = 0; i < t; ) {
    const t2 = e.indexOf("", i);
    (t2 < 0 || t2 > __PRIVATE_lastReasonableEscapeIndex) && fail();
    switch (e.charAt(t2 + 1)) {
      case "":
        const s = e.substring(i, t2);
        let o;
        0 === r2.length ? (
          // Avoid copying for the common case of a segment that excludes \0
          // and \001
          o = s
        ) : (r2 += s, o = r2, r2 = ""), n.push(o);
        break;
      case "":
        r2 += e.substring(i, t2), r2 += "\0";
        break;
      case "":
        r2 += e.substring(i, t2 + 1);
        break;
      default:
        fail();
    }
    i = t2 + 2;
  }
  return new ResourcePath(n);
}
var M2 = ["userId", "batchId"];
function __PRIVATE_newDbDocumentMutationPrefixForPath(e, t) {
  return [e, __PRIVATE_encodeResourcePath(t)];
}
function __PRIVATE_newDbDocumentMutationKey(e, t, n) {
  return [e, __PRIVATE_encodeResourcePath(t), n];
}
var x2 = {};
var O2 = ["prefixPath", "collectionGroup", "readTime", "documentId"];
var N2 = ["prefixPath", "collectionGroup", "documentId"];
var B2 = ["collectionGroup", "readTime", "prefixPath", "documentId"];
var L = ["canonicalId", "targetId"];
var k2 = ["targetId", "path"];
var q2 = ["path", "targetId"];
var Q2 = ["collectionId", "parent"];
var K2 = ["indexId", "uid"];
var $ = ["uid", "sequenceNumber"];
var U2 = ["indexId", "uid", "arrayValue", "directionalValue", "orderedDocumentKey", "documentKey"];
var W2 = ["indexId", "uid", "orderedDocumentKey"];
var G2 = ["userId", "collectionPath", "documentId"];
var z2 = ["userId", "collectionPath", "largestBatchId"];
var j = ["userId", "collectionGroup", "largestBatchId"];
var H2 = [...[...[...[...["mutationQueues", "mutations", "documentMutations", "remoteDocuments", "targets", "owner", "targetGlobal", "targetDocuments"], "clientMetadata"], "remoteDocumentGlobal"], "collectionParents"], "bundles", "namedQueries"];
var J2 = [...H2, "documentOverlays"];
var Y2 = ["mutationQueues", "mutations", "documentMutations", "remoteDocumentsV14", "targets", "owner", "targetGlobal", "targetDocuments", "clientMetadata", "remoteDocumentGlobal", "collectionParents", "bundles", "namedQueries", "documentOverlays"];
var Z2 = Y2;
var X2 = [...Z2, "indexConfiguration", "indexState", "indexEntries"];
var __PRIVATE_IndexedDbTransaction = class extends PersistenceTransaction {
  constructor(e, t) {
    super(), this.ae = e, this.currentSequenceNumber = t;
  }
};
function __PRIVATE_getStore(e, t) {
  const n = __PRIVATE_debugCast(e);
  return __PRIVATE_SimpleDb.M(n.ae, t);
}
function __PRIVATE_objectSize(e) {
  let t = 0;
  for (const n in e)
    Object.prototype.hasOwnProperty.call(e, n) && t++;
  return t;
}
function forEach(e, t) {
  for (const n in e)
    Object.prototype.hasOwnProperty.call(e, n) && t(n, e[n]);
}
function isEmpty2(e) {
  for (const t in e)
    if (Object.prototype.hasOwnProperty.call(e, t))
      return false;
  return true;
}
var SortedMap = class _SortedMap {
  constructor(e, t) {
    this.comparator = e, this.root = t || LLRBNode.EMPTY;
  }
  // Returns a copy of the map, with the specified key/value added or replaced.
  insert(e, t) {
    return new _SortedMap(this.comparator, this.root.insert(e, t, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
  }
  // Returns a copy of the map, with the specified key removed.
  remove(e) {
    return new _SortedMap(this.comparator, this.root.remove(e, this.comparator).copy(null, null, LLRBNode.BLACK, null, null));
  }
  // Returns the value of the node with the given key, or null.
  get(e) {
    let t = this.root;
    for (; !t.isEmpty(); ) {
      const n = this.comparator(e, t.key);
      if (0 === n)
        return t.value;
      n < 0 ? t = t.left : n > 0 && (t = t.right);
    }
    return null;
  }
  // Returns the index of the element in this sorted map, or -1 if it doesn't
  // exist.
  indexOf(e) {
    let t = 0, n = this.root;
    for (; !n.isEmpty(); ) {
      const r2 = this.comparator(e, n.key);
      if (0 === r2)
        return t + n.left.size;
      r2 < 0 ? n = n.left : (
        // Count all nodes left of the node plus the node itself
        (t += n.left.size + 1, n = n.right)
      );
    }
    return -1;
  }
  isEmpty() {
    return this.root.isEmpty();
  }
  // Returns the total number of nodes in the map.
  get size() {
    return this.root.size;
  }
  // Returns the minimum key in the map.
  minKey() {
    return this.root.minKey();
  }
  // Returns the maximum key in the map.
  maxKey() {
    return this.root.maxKey();
  }
  // Traverses the map in key order and calls the specified action function
  // for each key/value pair. If action returns true, traversal is aborted.
  // Returns the first truthy value returned by action, or the last falsey
  // value returned by action.
  inorderTraversal(e) {
    return this.root.inorderTraversal(e);
  }
  forEach(e) {
    this.inorderTraversal((t, n) => (e(t, n), false));
  }
  toString() {
    const e = [];
    return this.inorderTraversal((t, n) => (e.push(`${t}:${n}`), false)), `{${e.join(", ")}}`;
  }
  // Traverses the map in reverse key order and calls the specified action
  // function for each key/value pair. If action returns true, traversal is
  // aborted.
  // Returns the first truthy value returned by action, or the last falsey
  // value returned by action.
  reverseTraversal(e) {
    return this.root.reverseTraversal(e);
  }
  // Returns an iterator over the SortedMap.
  getIterator() {
    return new SortedMapIterator(this.root, null, this.comparator, false);
  }
  getIteratorFrom(e) {
    return new SortedMapIterator(this.root, e, this.comparator, false);
  }
  getReverseIterator() {
    return new SortedMapIterator(this.root, null, this.comparator, true);
  }
  getReverseIteratorFrom(e) {
    return new SortedMapIterator(this.root, e, this.comparator, true);
  }
};
var SortedMapIterator = class {
  constructor(e, t, n, r2) {
    this.isReverse = r2, this.nodeStack = [];
    let i = 1;
    for (; !e.isEmpty(); )
      if (i = t ? n(e.key, t) : 1, // flip the comparison if we're going in reverse
      t && r2 && (i *= -1), i < 0)
        e = this.isReverse ? e.left : e.right;
      else {
        if (0 === i) {
          this.nodeStack.push(e);
          break;
        }
        this.nodeStack.push(e), e = this.isReverse ? e.right : e.left;
      }
  }
  getNext() {
    let e = this.nodeStack.pop();
    const t = {
      key: e.key,
      value: e.value
    };
    if (this.isReverse)
      for (e = e.left; !e.isEmpty(); )
        this.nodeStack.push(e), e = e.right;
    else
      for (e = e.right; !e.isEmpty(); )
        this.nodeStack.push(e), e = e.left;
    return t;
  }
  hasNext() {
    return this.nodeStack.length > 0;
  }
  peek() {
    if (0 === this.nodeStack.length)
      return null;
    const e = this.nodeStack[this.nodeStack.length - 1];
    return {
      key: e.key,
      value: e.value
    };
  }
};
var LLRBNode = class _LLRBNode {
  constructor(e, t, n, r2, i) {
    this.key = e, this.value = t, this.color = null != n ? n : _LLRBNode.RED, this.left = null != r2 ? r2 : _LLRBNode.EMPTY, this.right = null != i ? i : _LLRBNode.EMPTY, this.size = this.left.size + 1 + this.right.size;
  }
  // Returns a copy of the current node, optionally replacing pieces of it.
  copy(e, t, n, r2, i) {
    return new _LLRBNode(null != e ? e : this.key, null != t ? t : this.value, null != n ? n : this.color, null != r2 ? r2 : this.left, null != i ? i : this.right);
  }
  isEmpty() {
    return false;
  }
  // Traverses the tree in key order and calls the specified action function
  // for each node. If action returns true, traversal is aborted.
  // Returns the first truthy value returned by action, or the last falsey
  // value returned by action.
  inorderTraversal(e) {
    return this.left.inorderTraversal(e) || e(this.key, this.value) || this.right.inorderTraversal(e);
  }
  // Traverses the tree in reverse key order and calls the specified action
  // function for each node. If action returns true, traversal is aborted.
  // Returns the first truthy value returned by action, or the last falsey
  // value returned by action.
  reverseTraversal(e) {
    return this.right.reverseTraversal(e) || e(this.key, this.value) || this.left.reverseTraversal(e);
  }
  // Returns the minimum node in the tree.
  min() {
    return this.left.isEmpty() ? this : this.left.min();
  }
  // Returns the maximum key in the tree.
  minKey() {
    return this.min().key;
  }
  // Returns the maximum key in the tree.
  maxKey() {
    return this.right.isEmpty() ? this.key : this.right.maxKey();
  }
  // Returns new tree, with the key/value added.
  insert(e, t, n) {
    let r2 = this;
    const i = n(e, r2.key);
    return r2 = i < 0 ? r2.copy(null, null, null, r2.left.insert(e, t, n), null) : 0 === i ? r2.copy(null, t, null, null, null) : r2.copy(null, null, null, null, r2.right.insert(e, t, n)), r2.fixUp();
  }
  removeMin() {
    if (this.left.isEmpty())
      return _LLRBNode.EMPTY;
    let e = this;
    return e.left.isRed() || e.left.left.isRed() || (e = e.moveRedLeft()), e = e.copy(null, null, null, e.left.removeMin(), null), e.fixUp();
  }
  // Returns new tree, with the specified item removed.
  remove(e, t) {
    let n, r2 = this;
    if (t(e, r2.key) < 0)
      r2.left.isEmpty() || r2.left.isRed() || r2.left.left.isRed() || (r2 = r2.moveRedLeft()), r2 = r2.copy(null, null, null, r2.left.remove(e, t), null);
    else {
      if (r2.left.isRed() && (r2 = r2.rotateRight()), r2.right.isEmpty() || r2.right.isRed() || r2.right.left.isRed() || (r2 = r2.moveRedRight()), 0 === t(e, r2.key)) {
        if (r2.right.isEmpty())
          return _LLRBNode.EMPTY;
        n = r2.right.min(), r2 = r2.copy(n.key, n.value, null, null, r2.right.removeMin());
      }
      r2 = r2.copy(null, null, null, null, r2.right.remove(e, t));
    }
    return r2.fixUp();
  }
  isRed() {
    return this.color;
  }
  // Returns new tree after performing any needed rotations.
  fixUp() {
    let e = this;
    return e.right.isRed() && !e.left.isRed() && (e = e.rotateLeft()), e.left.isRed() && e.left.left.isRed() && (e = e.rotateRight()), e.left.isRed() && e.right.isRed() && (e = e.colorFlip()), e;
  }
  moveRedLeft() {
    let e = this.colorFlip();
    return e.right.left.isRed() && (e = e.copy(null, null, null, null, e.right.rotateRight()), e = e.rotateLeft(), e = e.colorFlip()), e;
  }
  moveRedRight() {
    let e = this.colorFlip();
    return e.left.left.isRed() && (e = e.rotateRight(), e = e.colorFlip()), e;
  }
  rotateLeft() {
    const e = this.copy(null, null, _LLRBNode.RED, null, this.right.left);
    return this.right.copy(null, null, this.color, e, null);
  }
  rotateRight() {
    const e = this.copy(null, null, _LLRBNode.RED, this.left.right, null);
    return this.left.copy(null, null, this.color, null, e);
  }
  colorFlip() {
    const e = this.left.copy(null, null, !this.left.color, null, null), t = this.right.copy(null, null, !this.right.color, null, null);
    return this.copy(null, null, !this.color, e, t);
  }
  // For testing.
  checkMaxDepth() {
    const e = this.check();
    return Math.pow(2, e) <= this.size + 1;
  }
  // In a balanced RB tree, the black-depth (number of black nodes) from root to
  // leaves is equal on both sides.  This function verifies that or asserts.
  check() {
    if (this.isRed() && this.left.isRed())
      throw fail();
    if (this.right.isRed())
      throw fail();
    const e = this.left.check();
    if (e !== this.right.check())
      throw fail();
    return e + (this.isRed() ? 0 : 1);
  }
};
LLRBNode.EMPTY = null, LLRBNode.RED = true, LLRBNode.BLACK = false;
LLRBNode.EMPTY = new // Represents an empty node (a leaf node in the Red-Black Tree).
class LLRBEmptyNode {
  constructor() {
    this.size = 0;
  }
  get key() {
    throw fail();
  }
  get value() {
    throw fail();
  }
  get color() {
    throw fail();
  }
  get left() {
    throw fail();
  }
  get right() {
    throw fail();
  }
  // Returns a copy of the current node.
  copy(e, t, n, r2, i) {
    return this;
  }
  // Returns a copy of the tree, with the specified key/value added.
  insert(e, t, n) {
    return new LLRBNode(e, t);
  }
  // Returns a copy of the tree, with the specified key removed.
  remove(e, t) {
    return this;
  }
  isEmpty() {
    return true;
  }
  inorderTraversal(e) {
    return false;
  }
  reverseTraversal(e) {
    return false;
  }
  minKey() {
    return null;
  }
  maxKey() {
    return null;
  }
  isRed() {
    return false;
  }
  // For testing.
  checkMaxDepth() {
    return true;
  }
  check() {
    return 0;
  }
}();
var SortedSet = class _SortedSet {
  constructor(e) {
    this.comparator = e, this.data = new SortedMap(this.comparator);
  }
  has(e) {
    return null !== this.data.get(e);
  }
  first() {
    return this.data.minKey();
  }
  last() {
    return this.data.maxKey();
  }
  get size() {
    return this.data.size;
  }
  indexOf(e) {
    return this.data.indexOf(e);
  }
  /** Iterates elements in order defined by "comparator" */
  forEach(e) {
    this.data.inorderTraversal((t, n) => (e(t), false));
  }
  /** Iterates over `elem`s such that: range[0] &lt;= elem &lt; range[1]. */
  forEachInRange(e, t) {
    const n = this.data.getIteratorFrom(e[0]);
    for (; n.hasNext(); ) {
      const r2 = n.getNext();
      if (this.comparator(r2.key, e[1]) >= 0)
        return;
      t(r2.key);
    }
  }
  /**
   * Iterates over `elem`s such that: start &lt;= elem until false is returned.
   */
  forEachWhile(e, t) {
    let n;
    for (n = void 0 !== t ? this.data.getIteratorFrom(t) : this.data.getIterator(); n.hasNext(); ) {
      if (!e(n.getNext().key))
        return;
    }
  }
  /** Finds the least element greater than or equal to `elem`. */
  firstAfterOrEqual(e) {
    const t = this.data.getIteratorFrom(e);
    return t.hasNext() ? t.getNext().key : null;
  }
  getIterator() {
    return new SortedSetIterator(this.data.getIterator());
  }
  getIteratorFrom(e) {
    return new SortedSetIterator(this.data.getIteratorFrom(e));
  }
  /** Inserts or updates an element */
  add(e) {
    return this.copy(this.data.remove(e).insert(e, true));
  }
  /** Deletes an element */
  delete(e) {
    return this.has(e) ? this.copy(this.data.remove(e)) : this;
  }
  isEmpty() {
    return this.data.isEmpty();
  }
  unionWith(e) {
    let t = this;
    return t.size < e.size && (t = e, e = this), e.forEach((e2) => {
      t = t.add(e2);
    }), t;
  }
  isEqual(e) {
    if (!(e instanceof _SortedSet))
      return false;
    if (this.size !== e.size)
      return false;
    const t = this.data.getIterator(), n = e.data.getIterator();
    for (; t.hasNext(); ) {
      const e2 = t.getNext().key, r2 = n.getNext().key;
      if (0 !== this.comparator(e2, r2))
        return false;
    }
    return true;
  }
  toArray() {
    const e = [];
    return this.forEach((t) => {
      e.push(t);
    }), e;
  }
  toString() {
    const e = [];
    return this.forEach((t) => e.push(t)), "SortedSet(" + e.toString() + ")";
  }
  copy(e) {
    const t = new _SortedSet(this.comparator);
    return t.data = e, t;
  }
};
var SortedSetIterator = class {
  constructor(e) {
    this.iter = e;
  }
  getNext() {
    return this.iter.getNext().key;
  }
  hasNext() {
    return this.iter.hasNext();
  }
};
function __PRIVATE_advanceIterator(e) {
  return e.hasNext() ? e.getNext() : void 0;
}
var FieldMask = class _FieldMask {
  constructor(e) {
    this.fields = e, // TODO(dimond): validation of FieldMask
    // Sort the field mask to support `FieldMask.isEqual()` and assert below.
    e.sort(FieldPath$1.comparator);
  }
  static empty() {
    return new _FieldMask([]);
  }
  /**
   * Returns a new FieldMask object that is the result of adding all the given
   * fields paths to this field mask.
   */
  unionWith(e) {
    let t = new SortedSet(FieldPath$1.comparator);
    for (const e2 of this.fields)
      t = t.add(e2);
    for (const n of e)
      t = t.add(n);
    return new _FieldMask(t.toArray());
  }
  /**
   * Verifies that `fieldPath` is included by at least one field in this field
   * mask.
   *
   * This is an O(n) operation, where `n` is the size of the field mask.
   */
  covers(e) {
    for (const t of this.fields)
      if (t.isPrefixOf(e))
        return true;
    return false;
  }
  isEqual(e) {
    return __PRIVATE_arrayEquals(this.fields, e.fields, (e2, t) => e2.isEqual(t));
  }
};
var __PRIVATE_Base64DecodeError = class extends Error {
  constructor() {
    super(...arguments), this.name = "Base64DecodeError";
  }
};
function __PRIVATE_isBase64Available() {
  return "undefined" != typeof atob;
}
var ByteString = class _ByteString {
  constructor(e) {
    this.binaryString = e;
  }
  static fromBase64String(e) {
    const t = function __PRIVATE_decodeBase64(e2) {
      try {
        return atob(e2);
      } catch (e3) {
        throw "undefined" != typeof DOMException && e3 instanceof DOMException ? new __PRIVATE_Base64DecodeError("Invalid base64 string: " + e3) : e3;
      }
    }(e);
    return new _ByteString(t);
  }
  static fromUint8Array(e) {
    const t = (
      /**
      * Helper function to convert an Uint8array to a binary string.
      */
      function __PRIVATE_binaryStringFromUint8Array(e2) {
        let t2 = "";
        for (let n = 0; n < e2.length; ++n)
          t2 += String.fromCharCode(e2[n]);
        return t2;
      }(e)
    );
    return new _ByteString(t);
  }
  [Symbol.iterator]() {
    let e = 0;
    return {
      next: () => e < this.binaryString.length ? {
        value: this.binaryString.charCodeAt(e++),
        done: false
      } : {
        value: void 0,
        done: true
      }
    };
  }
  toBase64() {
    return function __PRIVATE_encodeBase64(e) {
      return btoa(e);
    }(this.binaryString);
  }
  toUint8Array() {
    return function __PRIVATE_uint8ArrayFromBinaryString(e) {
      const t = new Uint8Array(e.length);
      for (let n = 0; n < e.length; n++)
        t[n] = e.charCodeAt(n);
      return t;
    }(this.binaryString);
  }
  approximateByteSize() {
    return 2 * this.binaryString.length;
  }
  compareTo(e) {
    return __PRIVATE_primitiveComparator(this.binaryString, e.binaryString);
  }
  isEqual(e) {
    return this.binaryString === e.binaryString;
  }
};
ByteString.EMPTY_BYTE_STRING = new ByteString("");
var ee = new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);
function __PRIVATE_normalizeTimestamp(e) {
  if (__PRIVATE_hardAssert(!!e), "string" == typeof e) {
    let t = 0;
    const n = ee.exec(e);
    if (__PRIVATE_hardAssert(!!n), n[1]) {
      let e2 = n[1];
      e2 = (e2 + "000000000").substr(0, 9), t = Number(e2);
    }
    const r2 = new Date(e);
    return {
      seconds: Math.floor(r2.getTime() / 1e3),
      nanos: t
    };
  }
  return {
    seconds: __PRIVATE_normalizeNumber(e.seconds),
    nanos: __PRIVATE_normalizeNumber(e.nanos)
  };
}
function __PRIVATE_normalizeNumber(e) {
  return "number" == typeof e ? e : "string" == typeof e ? Number(e) : 0;
}
function __PRIVATE_normalizeByteString(e) {
  return "string" == typeof e ? ByteString.fromBase64String(e) : ByteString.fromUint8Array(e);
}
function __PRIVATE_isServerTimestamp(e) {
  var t, n;
  return "server_timestamp" === (null === (n = ((null === (t = null == e ? void 0 : e.mapValue) || void 0 === t ? void 0 : t.fields) || {}).__type__) || void 0 === n ? void 0 : n.stringValue);
}
function __PRIVATE_getPreviousValue(e) {
  const t = e.mapValue.fields.__previous_value__;
  return __PRIVATE_isServerTimestamp(t) ? __PRIVATE_getPreviousValue(t) : t;
}
function __PRIVATE_getLocalWriteTime(e) {
  const t = __PRIVATE_normalizeTimestamp(e.mapValue.fields.__local_write_time__.timestampValue);
  return new Timestamp(t.seconds, t.nanos);
}
var DatabaseInfo = class {
  /**
   * Constructs a DatabaseInfo using the provided host, databaseId and
   * persistenceKey.
   *
   * @param databaseId - The database to use.
   * @param appId - The Firebase App Id.
   * @param persistenceKey - A unique identifier for this Firestore's local
   * storage (used in conjunction with the databaseId).
   * @param host - The Firestore backend host to connect to.
   * @param ssl - Whether to use SSL when connecting.
   * @param forceLongPolling - Whether to use the forceLongPolling option
   * when using WebChannel as the network transport.
   * @param autoDetectLongPolling - Whether to use the detectBufferingProxy
   * option when using WebChannel as the network transport.
   * @param longPollingOptions Options that configure long-polling.
   * @param useFetchStreams Whether to use the Fetch API instead of
   * XMLHTTPRequest
   */
  constructor(e, t, n, r2, i, s, o, _, a) {
    this.databaseId = e, this.appId = t, this.persistenceKey = n, this.host = r2, this.ssl = i, this.forceLongPolling = s, this.autoDetectLongPolling = o, this.longPollingOptions = _, this.useFetchStreams = a;
  }
};
var DatabaseId = class _DatabaseId {
  constructor(e, t) {
    this.projectId = e, this.database = t || "(default)";
  }
  static empty() {
    return new _DatabaseId("", "");
  }
  get isDefaultDatabase() {
    return "(default)" === this.database;
  }
  isEqual(e) {
    return e instanceof _DatabaseId && e.projectId === this.projectId && e.database === this.database;
  }
};
var te = {
  mapValue: {
    fields: {
      __type__: {
        stringValue: "__max__"
      }
    }
  }
};
var ne = {
  nullValue: "NULL_VALUE"
};
function __PRIVATE_typeOrder(e) {
  return "nullValue" in e ? 0 : "booleanValue" in e ? 1 : "integerValue" in e || "doubleValue" in e ? 2 : "timestampValue" in e ? 3 : "stringValue" in e ? 5 : "bytesValue" in e ? 6 : "referenceValue" in e ? 7 : "geoPointValue" in e ? 8 : "arrayValue" in e ? 9 : "mapValue" in e ? __PRIVATE_isServerTimestamp(e) ? 4 : __PRIVATE_isMaxValue(e) ? 9007199254740991 : 10 : fail();
}
function __PRIVATE_valueEquals(e, t) {
  if (e === t)
    return true;
  const n = __PRIVATE_typeOrder(e);
  if (n !== __PRIVATE_typeOrder(t))
    return false;
  switch (n) {
    case 0:
    case 9007199254740991:
      return true;
    case 1:
      return e.booleanValue === t.booleanValue;
    case 4:
      return __PRIVATE_getLocalWriteTime(e).isEqual(__PRIVATE_getLocalWriteTime(t));
    case 3:
      return function __PRIVATE_timestampEquals(e2, t2) {
        if ("string" == typeof e2.timestampValue && "string" == typeof t2.timestampValue && e2.timestampValue.length === t2.timestampValue.length)
          return e2.timestampValue === t2.timestampValue;
        const n2 = __PRIVATE_normalizeTimestamp(e2.timestampValue), r2 = __PRIVATE_normalizeTimestamp(t2.timestampValue);
        return n2.seconds === r2.seconds && n2.nanos === r2.nanos;
      }(e, t);
    case 5:
      return e.stringValue === t.stringValue;
    case 6:
      return function __PRIVATE_blobEquals(e2, t2) {
        return __PRIVATE_normalizeByteString(e2.bytesValue).isEqual(__PRIVATE_normalizeByteString(t2.bytesValue));
      }(e, t);
    case 7:
      return e.referenceValue === t.referenceValue;
    case 8:
      return function __PRIVATE_geoPointEquals(e2, t2) {
        return __PRIVATE_normalizeNumber(e2.geoPointValue.latitude) === __PRIVATE_normalizeNumber(t2.geoPointValue.latitude) && __PRIVATE_normalizeNumber(e2.geoPointValue.longitude) === __PRIVATE_normalizeNumber(t2.geoPointValue.longitude);
      }(e, t);
    case 2:
      return function __PRIVATE_numberEquals(e2, t2) {
        if ("integerValue" in e2 && "integerValue" in t2)
          return __PRIVATE_normalizeNumber(e2.integerValue) === __PRIVATE_normalizeNumber(t2.integerValue);
        if ("doubleValue" in e2 && "doubleValue" in t2) {
          const n2 = __PRIVATE_normalizeNumber(e2.doubleValue), r2 = __PRIVATE_normalizeNumber(t2.doubleValue);
          return n2 === r2 ? __PRIVATE_isNegativeZero(n2) === __PRIVATE_isNegativeZero(r2) : isNaN(n2) && isNaN(r2);
        }
        return false;
      }(e, t);
    case 9:
      return __PRIVATE_arrayEquals(e.arrayValue.values || [], t.arrayValue.values || [], __PRIVATE_valueEquals);
    case 10:
      return function __PRIVATE_objectEquals(e2, t2) {
        const n2 = e2.mapValue.fields || {}, r2 = t2.mapValue.fields || {};
        if (__PRIVATE_objectSize(n2) !== __PRIVATE_objectSize(r2))
          return false;
        for (const e3 in n2)
          if (n2.hasOwnProperty(e3) && (void 0 === r2[e3] || !__PRIVATE_valueEquals(n2[e3], r2[e3])))
            return false;
        return true;
      }(e, t);
    default:
      return fail();
  }
}
function __PRIVATE_arrayValueContains(e, t) {
  return void 0 !== (e.values || []).find((e2) => __PRIVATE_valueEquals(e2, t));
}
function __PRIVATE_valueCompare(e, t) {
  if (e === t)
    return 0;
  const n = __PRIVATE_typeOrder(e), r2 = __PRIVATE_typeOrder(t);
  if (n !== r2)
    return __PRIVATE_primitiveComparator(n, r2);
  switch (n) {
    case 0:
    case 9007199254740991:
      return 0;
    case 1:
      return __PRIVATE_primitiveComparator(e.booleanValue, t.booleanValue);
    case 2:
      return function __PRIVATE_compareNumbers(e2, t2) {
        const n2 = __PRIVATE_normalizeNumber(e2.integerValue || e2.doubleValue), r3 = __PRIVATE_normalizeNumber(t2.integerValue || t2.doubleValue);
        return n2 < r3 ? -1 : n2 > r3 ? 1 : n2 === r3 ? 0 : (
          // one or both are NaN.
          isNaN(n2) ? isNaN(r3) ? 0 : -1 : 1
        );
      }(e, t);
    case 3:
      return __PRIVATE_compareTimestamps(e.timestampValue, t.timestampValue);
    case 4:
      return __PRIVATE_compareTimestamps(__PRIVATE_getLocalWriteTime(e), __PRIVATE_getLocalWriteTime(t));
    case 5:
      return __PRIVATE_primitiveComparator(e.stringValue, t.stringValue);
    case 6:
      return function __PRIVATE_compareBlobs(e2, t2) {
        const n2 = __PRIVATE_normalizeByteString(e2), r3 = __PRIVATE_normalizeByteString(t2);
        return n2.compareTo(r3);
      }(e.bytesValue, t.bytesValue);
    case 7:
      return function __PRIVATE_compareReferences(e2, t2) {
        const n2 = e2.split("/"), r3 = t2.split("/");
        for (let e3 = 0; e3 < n2.length && e3 < r3.length; e3++) {
          const t3 = __PRIVATE_primitiveComparator(n2[e3], r3[e3]);
          if (0 !== t3)
            return t3;
        }
        return __PRIVATE_primitiveComparator(n2.length, r3.length);
      }(e.referenceValue, t.referenceValue);
    case 8:
      return function __PRIVATE_compareGeoPoints(e2, t2) {
        const n2 = __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e2.latitude), __PRIVATE_normalizeNumber(t2.latitude));
        if (0 !== n2)
          return n2;
        return __PRIVATE_primitiveComparator(__PRIVATE_normalizeNumber(e2.longitude), __PRIVATE_normalizeNumber(t2.longitude));
      }(e.geoPointValue, t.geoPointValue);
    case 9:
      return function __PRIVATE_compareArrays(e2, t2) {
        const n2 = e2.values || [], r3 = t2.values || [];
        for (let e3 = 0; e3 < n2.length && e3 < r3.length; ++e3) {
          const t3 = __PRIVATE_valueCompare(n2[e3], r3[e3]);
          if (t3)
            return t3;
        }
        return __PRIVATE_primitiveComparator(n2.length, r3.length);
      }(e.arrayValue, t.arrayValue);
    case 10:
      return function __PRIVATE_compareMaps(e2, t2) {
        if (e2 === te.mapValue && t2 === te.mapValue)
          return 0;
        if (e2 === te.mapValue)
          return 1;
        if (t2 === te.mapValue)
          return -1;
        const n2 = e2.fields || {}, r3 = Object.keys(n2), i = t2.fields || {}, s = Object.keys(i);
        r3.sort(), s.sort();
        for (let e3 = 0; e3 < r3.length && e3 < s.length; ++e3) {
          const t3 = __PRIVATE_primitiveComparator(r3[e3], s[e3]);
          if (0 !== t3)
            return t3;
          const o = __PRIVATE_valueCompare(n2[r3[e3]], i[s[e3]]);
          if (0 !== o)
            return o;
        }
        return __PRIVATE_primitiveComparator(r3.length, s.length);
      }(e.mapValue, t.mapValue);
    default:
      throw fail();
  }
}
function __PRIVATE_compareTimestamps(e, t) {
  if ("string" == typeof e && "string" == typeof t && e.length === t.length)
    return __PRIVATE_primitiveComparator(e, t);
  const n = __PRIVATE_normalizeTimestamp(e), r2 = __PRIVATE_normalizeTimestamp(t), i = __PRIVATE_primitiveComparator(n.seconds, r2.seconds);
  return 0 !== i ? i : __PRIVATE_primitiveComparator(n.nanos, r2.nanos);
}
function canonicalId(e) {
  return __PRIVATE_canonifyValue(e);
}
function __PRIVATE_canonifyValue(e) {
  return "nullValue" in e ? "null" : "booleanValue" in e ? "" + e.booleanValue : "integerValue" in e ? "" + e.integerValue : "doubleValue" in e ? "" + e.doubleValue : "timestampValue" in e ? function __PRIVATE_canonifyTimestamp(e2) {
    const t = __PRIVATE_normalizeTimestamp(e2);
    return `time(${t.seconds},${t.nanos})`;
  }(e.timestampValue) : "stringValue" in e ? e.stringValue : "bytesValue" in e ? function __PRIVATE_canonifyByteString(e2) {
    return __PRIVATE_normalizeByteString(e2).toBase64();
  }(e.bytesValue) : "referenceValue" in e ? function __PRIVATE_canonifyReference(e2) {
    return DocumentKey.fromName(e2).toString();
  }(e.referenceValue) : "geoPointValue" in e ? function __PRIVATE_canonifyGeoPoint(e2) {
    return `geo(${e2.latitude},${e2.longitude})`;
  }(e.geoPointValue) : "arrayValue" in e ? function __PRIVATE_canonifyArray(e2) {
    let t = "[", n = true;
    for (const r2 of e2.values || [])
      n ? n = false : t += ",", t += __PRIVATE_canonifyValue(r2);
    return t + "]";
  }(e.arrayValue) : "mapValue" in e ? function __PRIVATE_canonifyMap(e2) {
    const t = Object.keys(e2.fields || {}).sort();
    let n = "{", r2 = true;
    for (const i of t)
      r2 ? r2 = false : n += ",", n += `${i}:${__PRIVATE_canonifyValue(e2.fields[i])}`;
    return n + "}";
  }(e.mapValue) : fail();
}
function __PRIVATE_estimateByteSize(e) {
  switch (__PRIVATE_typeOrder(e)) {
    case 0:
    case 1:
      return 4;
    case 2:
      return 8;
    case 3:
    case 8:
      return 16;
    case 4:
      const t = __PRIVATE_getPreviousValue(e);
      return t ? 16 + __PRIVATE_estimateByteSize(t) : 16;
    case 5:
      return 2 * e.stringValue.length;
    case 6:
      return __PRIVATE_normalizeByteString(e.bytesValue).approximateByteSize();
    case 7:
      return e.referenceValue.length;
    case 9:
      return function __PRIVATE_estimateArrayByteSize(e2) {
        return (e2.values || []).reduce((e3, t2) => e3 + __PRIVATE_estimateByteSize(t2), 0);
      }(e.arrayValue);
    case 10:
      return function __PRIVATE_estimateMapByteSize(e2) {
        let t2 = 0;
        return forEach(e2.fields, (e3, n) => {
          t2 += e3.length + __PRIVATE_estimateByteSize(n);
        }), t2;
      }(e.mapValue);
    default:
      throw fail();
  }
}
function __PRIVATE_refValue(e, t) {
  return {
    referenceValue: `projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`
  };
}
function isInteger(e) {
  return !!e && "integerValue" in e;
}
function isArray(e) {
  return !!e && "arrayValue" in e;
}
function __PRIVATE_isNullValue(e) {
  return !!e && "nullValue" in e;
}
function __PRIVATE_isNanValue(e) {
  return !!e && "doubleValue" in e && isNaN(Number(e.doubleValue));
}
function __PRIVATE_isMapValue(e) {
  return !!e && "mapValue" in e;
}
function __PRIVATE_deepClone(e) {
  if (e.geoPointValue)
    return {
      geoPointValue: Object.assign({}, e.geoPointValue)
    };
  if (e.timestampValue && "object" == typeof e.timestampValue)
    return {
      timestampValue: Object.assign({}, e.timestampValue)
    };
  if (e.mapValue) {
    const t = {
      mapValue: {
        fields: {}
      }
    };
    return forEach(e.mapValue.fields, (e2, n) => t.mapValue.fields[e2] = __PRIVATE_deepClone(n)), t;
  }
  if (e.arrayValue) {
    const t = {
      arrayValue: {
        values: []
      }
    };
    for (let n = 0; n < (e.arrayValue.values || []).length; ++n)
      t.arrayValue.values[n] = __PRIVATE_deepClone(e.arrayValue.values[n]);
    return t;
  }
  return Object.assign({}, e);
}
function __PRIVATE_isMaxValue(e) {
  return "__max__" === (((e.mapValue || {}).fields || {}).__type__ || {}).stringValue;
}
function __PRIVATE_valuesGetLowerBound(e) {
  return "nullValue" in e ? ne : "booleanValue" in e ? {
    booleanValue: false
  } : "integerValue" in e || "doubleValue" in e ? {
    doubleValue: NaN
  } : "timestampValue" in e ? {
    timestampValue: {
      seconds: Number.MIN_SAFE_INTEGER
    }
  } : "stringValue" in e ? {
    stringValue: ""
  } : "bytesValue" in e ? {
    bytesValue: ""
  } : "referenceValue" in e ? __PRIVATE_refValue(DatabaseId.empty(), DocumentKey.empty()) : "geoPointValue" in e ? {
    geoPointValue: {
      latitude: -90,
      longitude: -180
    }
  } : "arrayValue" in e ? {
    arrayValue: {}
  } : "mapValue" in e ? {
    mapValue: {}
  } : fail();
}
function __PRIVATE_valuesGetUpperBound(e) {
  return "nullValue" in e ? {
    booleanValue: false
  } : "booleanValue" in e ? {
    doubleValue: NaN
  } : "integerValue" in e || "doubleValue" in e ? {
    timestampValue: {
      seconds: Number.MIN_SAFE_INTEGER
    }
  } : "timestampValue" in e ? {
    stringValue: ""
  } : "stringValue" in e ? {
    bytesValue: ""
  } : "bytesValue" in e ? __PRIVATE_refValue(DatabaseId.empty(), DocumentKey.empty()) : "referenceValue" in e ? {
    geoPointValue: {
      latitude: -90,
      longitude: -180
    }
  } : "geoPointValue" in e ? {
    arrayValue: {}
  } : "arrayValue" in e ? {
    mapValue: {}
  } : "mapValue" in e ? te : fail();
}
function __PRIVATE_lowerBoundCompare(e, t) {
  const n = __PRIVATE_valueCompare(e.value, t.value);
  return 0 !== n ? n : e.inclusive && !t.inclusive ? -1 : !e.inclusive && t.inclusive ? 1 : 0;
}
function __PRIVATE_upperBoundCompare(e, t) {
  const n = __PRIVATE_valueCompare(e.value, t.value);
  return 0 !== n ? n : e.inclusive && !t.inclusive ? 1 : !e.inclusive && t.inclusive ? -1 : 0;
}
var ObjectValue = class _ObjectValue {
  constructor(e) {
    this.value = e;
  }
  static empty() {
    return new _ObjectValue({
      mapValue: {}
    });
  }
  /**
   * Returns the value at the given path or null.
   *
   * @param path - the path to search
   * @returns The value at the path or null if the path is not set.
   */
  field(e) {
    if (e.isEmpty())
      return this.value;
    {
      let t = this.value;
      for (let n = 0; n < e.length - 1; ++n)
        if (t = (t.mapValue.fields || {})[e.get(n)], !__PRIVATE_isMapValue(t))
          return null;
      return t = (t.mapValue.fields || {})[e.lastSegment()], t || null;
    }
  }
  /**
   * Sets the field to the provided value.
   *
   * @param path - The field path to set.
   * @param value - The value to set.
   */
  set(e, t) {
    this.getFieldsMap(e.popLast())[e.lastSegment()] = __PRIVATE_deepClone(t);
  }
  /**
   * Sets the provided fields to the provided values.
   *
   * @param data - A map of fields to values (or null for deletes).
   */
  setAll(e) {
    let t = FieldPath$1.emptyPath(), n = {}, r2 = [];
    e.forEach((e2, i2) => {
      if (!t.isImmediateParentOf(i2)) {
        const e3 = this.getFieldsMap(t);
        this.applyChanges(e3, n, r2), n = {}, r2 = [], t = i2.popLast();
      }
      e2 ? n[i2.lastSegment()] = __PRIVATE_deepClone(e2) : r2.push(i2.lastSegment());
    });
    const i = this.getFieldsMap(t);
    this.applyChanges(i, n, r2);
  }
  /**
   * Removes the field at the specified path. If there is no field at the
   * specified path, nothing is changed.
   *
   * @param path - The field path to remove.
   */
  delete(e) {
    const t = this.field(e.popLast());
    __PRIVATE_isMapValue(t) && t.mapValue.fields && delete t.mapValue.fields[e.lastSegment()];
  }
  isEqual(e) {
    return __PRIVATE_valueEquals(this.value, e.value);
  }
  /**
   * Returns the map that contains the leaf element of `path`. If the parent
   * entry does not yet exist, or if it is not a map, a new map will be created.
   */
  getFieldsMap(e) {
    let t = this.value;
    t.mapValue.fields || (t.mapValue = {
      fields: {}
    });
    for (let n = 0; n < e.length; ++n) {
      let r2 = t.mapValue.fields[e.get(n)];
      __PRIVATE_isMapValue(r2) && r2.mapValue.fields || (r2 = {
        mapValue: {
          fields: {}
        }
      }, t.mapValue.fields[e.get(n)] = r2), t = r2;
    }
    return t.mapValue.fields;
  }
  /**
   * Modifies `fieldsMap` by adding, replacing or deleting the specified
   * entries.
   */
  applyChanges(e, t, n) {
    forEach(t, (t2, n2) => e[t2] = n2);
    for (const t2 of n)
      delete e[t2];
  }
  clone() {
    return new _ObjectValue(__PRIVATE_deepClone(this.value));
  }
};
function __PRIVATE_extractFieldMask(e) {
  const t = [];
  return forEach(e.fields, (e2, n) => {
    const r2 = new FieldPath$1([e2]);
    if (__PRIVATE_isMapValue(n)) {
      const e3 = __PRIVATE_extractFieldMask(n.mapValue).fields;
      if (0 === e3.length)
        t.push(r2);
      else
        for (const n2 of e3)
          t.push(r2.child(n2));
    } else
      t.push(r2);
  }), new FieldMask(t);
}
var MutableDocument = class _MutableDocument {
  constructor(e, t, n, r2, i, s, o) {
    this.key = e, this.documentType = t, this.version = n, this.readTime = r2, this.createTime = i, this.data = s, this.documentState = o;
  }
  /**
   * Creates a document with no known version or data, but which can serve as
   * base document for mutations.
   */
  static newInvalidDocument(e) {
    return new _MutableDocument(
      e,
      0,
      /* version */
      SnapshotVersion.min(),
      /* readTime */
      SnapshotVersion.min(),
      /* createTime */
      SnapshotVersion.min(),
      ObjectValue.empty(),
      0
      /* DocumentState.SYNCED */
    );
  }
  /**
   * Creates a new document that is known to exist with the given data at the
   * given version.
   */
  static newFoundDocument(e, t, n, r2) {
    return new _MutableDocument(
      e,
      1,
      /* version */
      t,
      /* readTime */
      SnapshotVersion.min(),
      /* createTime */
      n,
      r2,
      0
      /* DocumentState.SYNCED */
    );
  }
  /** Creates a new document that is known to not exist at the given version. */
  static newNoDocument(e, t) {
    return new _MutableDocument(
      e,
      2,
      /* version */
      t,
      /* readTime */
      SnapshotVersion.min(),
      /* createTime */
      SnapshotVersion.min(),
      ObjectValue.empty(),
      0
      /* DocumentState.SYNCED */
    );
  }
  /**
   * Creates a new document that is known to exist at the given version but
   * whose data is not known (e.g. a document that was updated without a known
   * base document).
   */
  static newUnknownDocument(e, t) {
    return new _MutableDocument(
      e,
      3,
      /* version */
      t,
      /* readTime */
      SnapshotVersion.min(),
      /* createTime */
      SnapshotVersion.min(),
      ObjectValue.empty(),
      2
      /* DocumentState.HAS_COMMITTED_MUTATIONS */
    );
  }
  /**
   * Changes the document type to indicate that it exists and that its version
   * and data are known.
   */
  convertToFoundDocument(e, t) {
    return !this.createTime.isEqual(SnapshotVersion.min()) || 2 !== this.documentType && 0 !== this.documentType || (this.createTime = e), this.version = e, this.documentType = 1, this.data = t, this.documentState = 0, this;
  }
  /**
   * Changes the document type to indicate that it doesn't exist at the given
   * version.
   */
  convertToNoDocument(e) {
    return this.version = e, this.documentType = 2, this.data = ObjectValue.empty(), this.documentState = 0, this;
  }
  /**
   * Changes the document type to indicate that it exists at a given version but
   * that its data is not known (e.g. a document that was updated without a known
   * base document).
   */
  convertToUnknownDocument(e) {
    return this.version = e, this.documentType = 3, this.data = ObjectValue.empty(), this.documentState = 2, this;
  }
  setHasCommittedMutations() {
    return this.documentState = 2, this;
  }
  setHasLocalMutations() {
    return this.documentState = 1, this.version = SnapshotVersion.min(), this;
  }
  setReadTime(e) {
    return this.readTime = e, this;
  }
  get hasLocalMutations() {
    return 1 === this.documentState;
  }
  get hasCommittedMutations() {
    return 2 === this.documentState;
  }
  get hasPendingWrites() {
    return this.hasLocalMutations || this.hasCommittedMutations;
  }
  isValidDocument() {
    return 0 !== this.documentType;
  }
  isFoundDocument() {
    return 1 === this.documentType;
  }
  isNoDocument() {
    return 2 === this.documentType;
  }
  isUnknownDocument() {
    return 3 === this.documentType;
  }
  isEqual(e) {
    return e instanceof _MutableDocument && this.key.isEqual(e.key) && this.version.isEqual(e.version) && this.documentType === e.documentType && this.documentState === e.documentState && this.data.isEqual(e.data);
  }
  mutableCopy() {
    return new _MutableDocument(this.key, this.documentType, this.version, this.readTime, this.createTime, this.data.clone(), this.documentState);
  }
  toString() {
    return `Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`;
  }
};
var Bound = class {
  constructor(e, t) {
    this.position = e, this.inclusive = t;
  }
};
function __PRIVATE_boundCompareToDocument(e, t, n) {
  let r2 = 0;
  for (let i = 0; i < e.position.length; i++) {
    const s = t[i], o = e.position[i];
    if (s.field.isKeyField())
      r2 = DocumentKey.comparator(DocumentKey.fromName(o.referenceValue), n.key);
    else {
      r2 = __PRIVATE_valueCompare(o, n.data.field(s.field));
    }
    if ("desc" === s.dir && (r2 *= -1), 0 !== r2)
      break;
  }
  return r2;
}
function __PRIVATE_boundEquals(e, t) {
  if (null === e)
    return null === t;
  if (null === t)
    return false;
  if (e.inclusive !== t.inclusive || e.position.length !== t.position.length)
    return false;
  for (let n = 0; n < e.position.length; n++) {
    if (!__PRIVATE_valueEquals(e.position[n], t.position[n]))
      return false;
  }
  return true;
}
var OrderBy = class {
  constructor(e, t = "asc") {
    this.field = e, this.dir = t;
  }
};
function __PRIVATE_orderByEquals(e, t) {
  return e.dir === t.dir && e.field.isEqual(t.field);
}
var Filter = class {
};
var FieldFilter = class _FieldFilter extends Filter {
  constructor(e, t, n) {
    super(), this.field = e, this.op = t, this.value = n;
  }
  /**
   * Creates a filter based on the provided arguments.
   */
  static create(e, t, n) {
    return e.isKeyField() ? "in" === t || "not-in" === t ? this.createKeyFieldInFilter(e, t, n) : new __PRIVATE_KeyFieldFilter(e, t, n) : "array-contains" === t ? new __PRIVATE_ArrayContainsFilter(e, n) : "in" === t ? new __PRIVATE_InFilter(e, n) : "not-in" === t ? new __PRIVATE_NotInFilter(e, n) : "array-contains-any" === t ? new __PRIVATE_ArrayContainsAnyFilter(e, n) : new _FieldFilter(e, t, n);
  }
  static createKeyFieldInFilter(e, t, n) {
    return "in" === t ? new __PRIVATE_KeyFieldInFilter(e, n) : new __PRIVATE_KeyFieldNotInFilter(e, n);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return "!=" === this.op ? null !== t && this.matchesComparison(__PRIVATE_valueCompare(t, this.value)) : null !== t && __PRIVATE_typeOrder(this.value) === __PRIVATE_typeOrder(t) && this.matchesComparison(__PRIVATE_valueCompare(t, this.value));
  }
  matchesComparison(e) {
    switch (this.op) {
      case "<":
        return e < 0;
      case "<=":
        return e <= 0;
      case "==":
        return 0 === e;
      case "!=":
        return 0 !== e;
      case ">":
        return e > 0;
      case ">=":
        return e >= 0;
      default:
        return fail();
    }
  }
  isInequality() {
    return [
      "<",
      "<=",
      ">",
      ">=",
      "!=",
      "not-in"
      /* Operator.NOT_IN */
    ].indexOf(this.op) >= 0;
  }
  getFlattenedFilters() {
    return [this];
  }
  getFilters() {
    return [this];
  }
};
var CompositeFilter = class _CompositeFilter extends Filter {
  constructor(e, t) {
    super(), this.filters = e, this.op = t, this.ue = null;
  }
  /**
   * Creates a filter based on the provided arguments.
   */
  static create(e, t) {
    return new _CompositeFilter(e, t);
  }
  matches(e) {
    return __PRIVATE_compositeFilterIsConjunction(this) ? void 0 === this.filters.find((t) => !t.matches(e)) : void 0 !== this.filters.find((t) => t.matches(e));
  }
  getFlattenedFilters() {
    return null !== this.ue || (this.ue = this.filters.reduce((e, t) => e.concat(t.getFlattenedFilters()), [])), this.ue;
  }
  // Returns a mutable copy of `this.filters`
  getFilters() {
    return Object.assign([], this.filters);
  }
};
function __PRIVATE_compositeFilterIsConjunction(e) {
  return "and" === e.op;
}
function __PRIVATE_compositeFilterIsDisjunction(e) {
  return "or" === e.op;
}
function __PRIVATE_compositeFilterIsFlatConjunction(e) {
  return __PRIVATE_compositeFilterIsFlat(e) && __PRIVATE_compositeFilterIsConjunction(e);
}
function __PRIVATE_compositeFilterIsFlat(e) {
  for (const t of e.filters)
    if (t instanceof CompositeFilter)
      return false;
  return true;
}
function __PRIVATE_canonifyFilter(e) {
  if (e instanceof FieldFilter)
    return e.field.canonicalString() + e.op.toString() + canonicalId(e.value);
  if (__PRIVATE_compositeFilterIsFlatConjunction(e))
    return e.filters.map((e2) => __PRIVATE_canonifyFilter(e2)).join(",");
  {
    const t = e.filters.map((e2) => __PRIVATE_canonifyFilter(e2)).join(",");
    return `${e.op}(${t})`;
  }
}
function __PRIVATE_filterEquals(e, t) {
  return e instanceof FieldFilter ? function __PRIVATE_fieldFilterEquals(e2, t2) {
    return t2 instanceof FieldFilter && e2.op === t2.op && e2.field.isEqual(t2.field) && __PRIVATE_valueEquals(e2.value, t2.value);
  }(e, t) : e instanceof CompositeFilter ? function __PRIVATE_compositeFilterEquals(e2, t2) {
    if (t2 instanceof CompositeFilter && e2.op === t2.op && e2.filters.length === t2.filters.length) {
      return e2.filters.reduce((e3, n, r2) => e3 && __PRIVATE_filterEquals(n, t2.filters[r2]), true);
    }
    return false;
  }(e, t) : void fail();
}
function __PRIVATE_compositeFilterWithAddedFilters(e, t) {
  const n = e.filters.concat(t);
  return CompositeFilter.create(n, e.op);
}
function __PRIVATE_stringifyFilter(e) {
  return e instanceof FieldFilter ? function __PRIVATE_stringifyFieldFilter(e2) {
    return `${e2.field.canonicalString()} ${e2.op} ${canonicalId(e2.value)}`;
  }(e) : e instanceof CompositeFilter ? function __PRIVATE_stringifyCompositeFilter(e2) {
    return e2.op.toString() + " {" + e2.getFilters().map(__PRIVATE_stringifyFilter).join(" ,") + "}";
  }(e) : "Filter";
}
var __PRIVATE_KeyFieldFilter = class extends FieldFilter {
  constructor(e, t, n) {
    super(e, t, n), this.key = DocumentKey.fromName(n.referenceValue);
  }
  matches(e) {
    const t = DocumentKey.comparator(e.key, this.key);
    return this.matchesComparison(t);
  }
};
var __PRIVATE_KeyFieldInFilter = class extends FieldFilter {
  constructor(e, t) {
    super(e, "in", t), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("in", t);
  }
  matches(e) {
    return this.keys.some((t) => t.isEqual(e.key));
  }
};
var __PRIVATE_KeyFieldNotInFilter = class extends FieldFilter {
  constructor(e, t) {
    super(e, "not-in", t), this.keys = __PRIVATE_extractDocumentKeysFromArrayValue("not-in", t);
  }
  matches(e) {
    return !this.keys.some((t) => t.isEqual(e.key));
  }
};
function __PRIVATE_extractDocumentKeysFromArrayValue(e, t) {
  var n;
  return ((null === (n = t.arrayValue) || void 0 === n ? void 0 : n.values) || []).map((e2) => DocumentKey.fromName(e2.referenceValue));
}
var __PRIVATE_ArrayContainsFilter = class extends FieldFilter {
  constructor(e, t) {
    super(e, "array-contains", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return isArray(t) && __PRIVATE_arrayValueContains(t.arrayValue, this.value);
  }
};
var __PRIVATE_InFilter = class extends FieldFilter {
  constructor(e, t) {
    super(e, "in", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return null !== t && __PRIVATE_arrayValueContains(this.value.arrayValue, t);
  }
};
var __PRIVATE_NotInFilter = class extends FieldFilter {
  constructor(e, t) {
    super(e, "not-in", t);
  }
  matches(e) {
    if (__PRIVATE_arrayValueContains(this.value.arrayValue, {
      nullValue: "NULL_VALUE"
    }))
      return false;
    const t = e.data.field(this.field);
    return null !== t && !__PRIVATE_arrayValueContains(this.value.arrayValue, t);
  }
};
var __PRIVATE_ArrayContainsAnyFilter = class extends FieldFilter {
  constructor(e, t) {
    super(e, "array-contains-any", t);
  }
  matches(e) {
    const t = e.data.field(this.field);
    return !(!isArray(t) || !t.arrayValue.values) && t.arrayValue.values.some((e2) => __PRIVATE_arrayValueContains(this.value.arrayValue, e2));
  }
};
var __PRIVATE_TargetImpl = class {
  constructor(e, t = null, n = [], r2 = [], i = null, s = null, o = null) {
    this.path = e, this.collectionGroup = t, this.orderBy = n, this.filters = r2, this.limit = i, this.startAt = s, this.endAt = o, this.ce = null;
  }
};
function __PRIVATE_newTarget(e, t = null, n = [], r2 = [], i = null, s = null, o = null) {
  return new __PRIVATE_TargetImpl(e, t, n, r2, i, s, o);
}
function __PRIVATE_canonifyTarget(e) {
  const t = __PRIVATE_debugCast(e);
  if (null === t.ce) {
    let e2 = t.path.canonicalString();
    null !== t.collectionGroup && (e2 += "|cg:" + t.collectionGroup), e2 += "|f:", e2 += t.filters.map((e3) => __PRIVATE_canonifyFilter(e3)).join(","), e2 += "|ob:", e2 += t.orderBy.map((e3) => function __PRIVATE_canonifyOrderBy(e4) {
      return e4.field.canonicalString() + e4.dir;
    }(e3)).join(","), __PRIVATE_isNullOrUndefined(t.limit) || (e2 += "|l:", e2 += t.limit), t.startAt && (e2 += "|lb:", e2 += t.startAt.inclusive ? "b:" : "a:", e2 += t.startAt.position.map((e3) => canonicalId(e3)).join(",")), t.endAt && (e2 += "|ub:", e2 += t.endAt.inclusive ? "a:" : "b:", e2 += t.endAt.position.map((e3) => canonicalId(e3)).join(",")), t.ce = e2;
  }
  return t.ce;
}
function __PRIVATE_targetEquals(e, t) {
  if (e.limit !== t.limit)
    return false;
  if (e.orderBy.length !== t.orderBy.length)
    return false;
  for (let n = 0; n < e.orderBy.length; n++)
    if (!__PRIVATE_orderByEquals(e.orderBy[n], t.orderBy[n]))
      return false;
  if (e.filters.length !== t.filters.length)
    return false;
  for (let n = 0; n < e.filters.length; n++)
    if (!__PRIVATE_filterEquals(e.filters[n], t.filters[n]))
      return false;
  return e.collectionGroup === t.collectionGroup && (!!e.path.isEqual(t.path) && (!!__PRIVATE_boundEquals(e.startAt, t.startAt) && __PRIVATE_boundEquals(e.endAt, t.endAt)));
}
function __PRIVATE_targetIsDocumentTarget(e) {
  return DocumentKey.isDocumentKey(e.path) && null === e.collectionGroup && 0 === e.filters.length;
}
function __PRIVATE_targetGetFieldFiltersForPath(e, t) {
  return e.filters.filter((e2) => e2 instanceof FieldFilter && e2.field.isEqual(t));
}
function __PRIVATE_targetGetAscendingBound(e, t, n) {
  let r2 = ne, i = true;
  for (const n2 of __PRIVATE_targetGetFieldFiltersForPath(e, t)) {
    let e2 = ne, t2 = true;
    switch (n2.op) {
      case "<":
      case "<=":
        e2 = __PRIVATE_valuesGetLowerBound(n2.value);
        break;
      case "==":
      case "in":
      case ">=":
        e2 = n2.value;
        break;
      case ">":
        e2 = n2.value, t2 = false;
        break;
      case "!=":
      case "not-in":
        e2 = ne;
    }
    __PRIVATE_lowerBoundCompare({
      value: r2,
      inclusive: i
    }, {
      value: e2,
      inclusive: t2
    }) < 0 && (r2 = e2, i = t2);
  }
  if (null !== n)
    for (let s = 0; s < e.orderBy.length; ++s) {
      if (e.orderBy[s].field.isEqual(t)) {
        const e2 = n.position[s];
        __PRIVATE_lowerBoundCompare({
          value: r2,
          inclusive: i
        }, {
          value: e2,
          inclusive: n.inclusive
        }) < 0 && (r2 = e2, i = n.inclusive);
        break;
      }
    }
  return {
    value: r2,
    inclusive: i
  };
}
function __PRIVATE_targetGetDescendingBound(e, t, n) {
  let r2 = te, i = true;
  for (const n2 of __PRIVATE_targetGetFieldFiltersForPath(e, t)) {
    let e2 = te, t2 = true;
    switch (n2.op) {
      case ">=":
      case ">":
        e2 = __PRIVATE_valuesGetUpperBound(n2.value), t2 = false;
        break;
      case "==":
      case "in":
      case "<=":
        e2 = n2.value;
        break;
      case "<":
        e2 = n2.value, t2 = false;
        break;
      case "!=":
      case "not-in":
        e2 = te;
    }
    __PRIVATE_upperBoundCompare({
      value: r2,
      inclusive: i
    }, {
      value: e2,
      inclusive: t2
    }) > 0 && (r2 = e2, i = t2);
  }
  if (null !== n)
    for (let s = 0; s < e.orderBy.length; ++s) {
      if (e.orderBy[s].field.isEqual(t)) {
        const e2 = n.position[s];
        __PRIVATE_upperBoundCompare({
          value: r2,
          inclusive: i
        }, {
          value: e2,
          inclusive: n.inclusive
        }) > 0 && (r2 = e2, i = n.inclusive);
        break;
      }
    }
  return {
    value: r2,
    inclusive: i
  };
}
var __PRIVATE_QueryImpl = class {
  /**
   * Initializes a Query with a path and optional additional query constraints.
   * Path must currently be empty if this is a collection group query.
   */
  constructor(e, t = null, n = [], r2 = [], i = null, s = "F", o = null, _ = null) {
    this.path = e, this.collectionGroup = t, this.explicitOrderBy = n, this.filters = r2, this.limit = i, this.limitType = s, this.startAt = o, this.endAt = _, this.le = null, // The corresponding `Target` of this `Query` instance, for use with
    // non-aggregate queries.
    this.he = null, // The corresponding `Target` of this `Query` instance, for use with
    // aggregate queries. Unlike targets for non-aggregate queries,
    // aggregate query targets do not contain normalized order-bys, they only
    // contain explicit order-bys.
    this.Pe = null, this.startAt, this.endAt;
  }
};
function __PRIVATE_newQuery(e, t, n, r2, i, s, o, _) {
  return new __PRIVATE_QueryImpl(e, t, n, r2, i, s, o, _);
}
function __PRIVATE_newQueryForPath(e) {
  return new __PRIVATE_QueryImpl(e);
}
function __PRIVATE_queryMatchesAllDocuments(e) {
  return 0 === e.filters.length && null === e.limit && null == e.startAt && null == e.endAt && (0 === e.explicitOrderBy.length || 1 === e.explicitOrderBy.length && e.explicitOrderBy[0].field.isKeyField());
}
function __PRIVATE_isCollectionGroupQuery(e) {
  return null !== e.collectionGroup;
}
function __PRIVATE_queryNormalizedOrderBy(e) {
  const t = __PRIVATE_debugCast(e);
  if (null === t.le) {
    t.le = [];
    const e2 = /* @__PURE__ */ new Set();
    for (const n2 of t.explicitOrderBy)
      t.le.push(n2), e2.add(n2.field.canonicalString());
    const n = t.explicitOrderBy.length > 0 ? t.explicitOrderBy[t.explicitOrderBy.length - 1].dir : "asc", r2 = function __PRIVATE_getInequalityFilterFields(e3) {
      let t2 = new SortedSet(FieldPath$1.comparator);
      return e3.filters.forEach((e4) => {
        e4.getFlattenedFilters().forEach((e5) => {
          e5.isInequality() && (t2 = t2.add(e5.field));
        });
      }), t2;
    }(t);
    r2.forEach((r3) => {
      e2.has(r3.canonicalString()) || r3.isKeyField() || t.le.push(new OrderBy(r3, n));
    }), // Add the document key field to the last if it is not explicitly ordered.
    e2.has(FieldPath$1.keyField().canonicalString()) || t.le.push(new OrderBy(FieldPath$1.keyField(), n));
  }
  return t.le;
}
function __PRIVATE_queryToTarget(e) {
  const t = __PRIVATE_debugCast(e);
  return t.he || (t.he = __PRIVATE__queryToTarget(t, __PRIVATE_queryNormalizedOrderBy(e))), t.he;
}
function __PRIVATE__queryToTarget(e, t) {
  if ("F" === e.limitType)
    return __PRIVATE_newTarget(e.path, e.collectionGroup, t, e.filters, e.limit, e.startAt, e.endAt);
  {
    t = t.map((e2) => {
      const t2 = "desc" === e2.dir ? "asc" : "desc";
      return new OrderBy(e2.field, t2);
    });
    const n = e.endAt ? new Bound(e.endAt.position, e.endAt.inclusive) : null, r2 = e.startAt ? new Bound(e.startAt.position, e.startAt.inclusive) : null;
    return __PRIVATE_newTarget(e.path, e.collectionGroup, t, e.filters, e.limit, n, r2);
  }
}
function __PRIVATE_queryWithAddedFilter(e, t) {
  const n = e.filters.concat([t]);
  return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), n, e.limit, e.limitType, e.startAt, e.endAt);
}
function __PRIVATE_queryWithLimit(e, t, n) {
  return new __PRIVATE_QueryImpl(e.path, e.collectionGroup, e.explicitOrderBy.slice(), e.filters.slice(), t, n, e.startAt, e.endAt);
}
function __PRIVATE_queryEquals(e, t) {
  return __PRIVATE_targetEquals(__PRIVATE_queryToTarget(e), __PRIVATE_queryToTarget(t)) && e.limitType === t.limitType;
}
function __PRIVATE_canonifyQuery(e) {
  return `${__PRIVATE_canonifyTarget(__PRIVATE_queryToTarget(e))}|lt:${e.limitType}`;
}
function __PRIVATE_stringifyQuery(e) {
  return `Query(target=${function __PRIVATE_stringifyTarget(e2) {
    let t = e2.path.canonicalString();
    return null !== e2.collectionGroup && (t += " collectionGroup=" + e2.collectionGroup), e2.filters.length > 0 && (t += `, filters: [${e2.filters.map((e3) => __PRIVATE_stringifyFilter(e3)).join(", ")}]`), __PRIVATE_isNullOrUndefined(e2.limit) || (t += ", limit: " + e2.limit), e2.orderBy.length > 0 && (t += `, orderBy: [${e2.orderBy.map((e3) => function __PRIVATE_stringifyOrderBy(e4) {
      return `${e4.field.canonicalString()} (${e4.dir})`;
    }(e3)).join(", ")}]`), e2.startAt && (t += ", startAt: ", t += e2.startAt.inclusive ? "b:" : "a:", t += e2.startAt.position.map((e3) => canonicalId(e3)).join(",")), e2.endAt && (t += ", endAt: ", t += e2.endAt.inclusive ? "a:" : "b:", t += e2.endAt.position.map((e3) => canonicalId(e3)).join(",")), `Target(${t})`;
  }(__PRIVATE_queryToTarget(e))}; limitType=${e.limitType})`;
}
function __PRIVATE_queryMatches(e, t) {
  return t.isFoundDocument() && function __PRIVATE_queryMatchesPathAndCollectionGroup(e2, t2) {
    const n = t2.key.path;
    return null !== e2.collectionGroup ? t2.key.hasCollectionId(e2.collectionGroup) && e2.path.isPrefixOf(n) : DocumentKey.isDocumentKey(e2.path) ? e2.path.isEqual(n) : e2.path.isImmediateParentOf(n);
  }(e, t) && function __PRIVATE_queryMatchesOrderBy(e2, t2) {
    for (const n of __PRIVATE_queryNormalizedOrderBy(e2))
      if (!n.field.isKeyField() && null === t2.data.field(n.field))
        return false;
    return true;
  }(e, t) && function __PRIVATE_queryMatchesFilters(e2, t2) {
    for (const n of e2.filters)
      if (!n.matches(t2))
        return false;
    return true;
  }(e, t) && function __PRIVATE_queryMatchesBounds(e2, t2) {
    if (e2.startAt && !/**
    * Returns true if a document sorts before a bound using the provided sort
    * order.
    */
    function __PRIVATE_boundSortsBeforeDocument(e3, t3, n) {
      const r2 = __PRIVATE_boundCompareToDocument(e3, t3, n);
      return e3.inclusive ? r2 <= 0 : r2 < 0;
    }(e2.startAt, __PRIVATE_queryNormalizedOrderBy(e2), t2))
      return false;
    if (e2.endAt && !function __PRIVATE_boundSortsAfterDocument(e3, t3, n) {
      const r2 = __PRIVATE_boundCompareToDocument(e3, t3, n);
      return e3.inclusive ? r2 >= 0 : r2 > 0;
    }(e2.endAt, __PRIVATE_queryNormalizedOrderBy(e2), t2))
      return false;
    return true;
  }(e, t);
}
function __PRIVATE_queryCollectionGroup(e) {
  return e.collectionGroup || (e.path.length % 2 == 1 ? e.path.lastSegment() : e.path.get(e.path.length - 2));
}
function __PRIVATE_newQueryComparator(e) {
  return (t, n) => {
    let r2 = false;
    for (const i of __PRIVATE_queryNormalizedOrderBy(e)) {
      const e2 = __PRIVATE_compareDocs(i, t, n);
      if (0 !== e2)
        return e2;
      r2 = r2 || i.field.isKeyField();
    }
    return 0;
  };
}
function __PRIVATE_compareDocs(e, t, n) {
  const r2 = e.field.isKeyField() ? DocumentKey.comparator(t.key, n.key) : function __PRIVATE_compareDocumentsByField(e2, t2, n2) {
    const r3 = t2.data.field(e2), i = n2.data.field(e2);
    return null !== r3 && null !== i ? __PRIVATE_valueCompare(r3, i) : fail();
  }(e.field, t, n);
  switch (e.dir) {
    case "asc":
      return r2;
    case "desc":
      return -1 * r2;
    default:
      return fail();
  }
}
var ObjectMap = class {
  constructor(e, t) {
    this.mapKeyFn = e, this.equalsFn = t, /**
     * The inner map for a key/value pair. Due to the possibility of collisions we
     * keep a list of entries that we do a linear search through to find an actual
     * match. Note that collisions should be rare, so we still expect near
     * constant time lookups in practice.
     */
    this.inner = {}, /** The number of entries stored in the map */
    this.innerSize = 0;
  }
  /** Get a value for this key, or undefined if it does not exist. */
  get(e) {
    const t = this.mapKeyFn(e), n = this.inner[t];
    if (void 0 !== n) {
      for (const [t2, r2] of n)
        if (this.equalsFn(t2, e))
          return r2;
    }
  }
  has(e) {
    return void 0 !== this.get(e);
  }
  /** Put this key and value in the map. */
  set(e, t) {
    const n = this.mapKeyFn(e), r2 = this.inner[n];
    if (void 0 === r2)
      return this.inner[n] = [[e, t]], void this.innerSize++;
    for (let n2 = 0; n2 < r2.length; n2++)
      if (this.equalsFn(r2[n2][0], e))
        return void (r2[n2] = [e, t]);
    r2.push([e, t]), this.innerSize++;
  }
  /**
   * Remove this key from the map. Returns a boolean if anything was deleted.
   */
  delete(e) {
    const t = this.mapKeyFn(e), n = this.inner[t];
    if (void 0 === n)
      return false;
    for (let r2 = 0; r2 < n.length; r2++)
      if (this.equalsFn(n[r2][0], e))
        return 1 === n.length ? delete this.inner[t] : n.splice(r2, 1), this.innerSize--, true;
    return false;
  }
  forEach(e) {
    forEach(this.inner, (t, n) => {
      for (const [t2, r2] of n)
        e(t2, r2);
    });
  }
  isEmpty() {
    return isEmpty2(this.inner);
  }
  size() {
    return this.innerSize;
  }
};
var re = new SortedMap(DocumentKey.comparator);
function __PRIVATE_mutableDocumentMap() {
  return re;
}
var ie = new SortedMap(DocumentKey.comparator);
function documentMap(...e) {
  let t = ie;
  for (const n of e)
    t = t.insert(n.key, n);
  return t;
}
function __PRIVATE_convertOverlayedDocumentMapToDocumentMap(e) {
  let t = ie;
  return e.forEach((e2, n) => t = t.insert(e2, n.overlayedDocument)), t;
}
function __PRIVATE_newOverlayMap() {
  return __PRIVATE_newDocumentKeyMap();
}
function __PRIVATE_newMutationMap() {
  return __PRIVATE_newDocumentKeyMap();
}
function __PRIVATE_newDocumentKeyMap() {
  return new ObjectMap((e) => e.toString(), (e, t) => e.isEqual(t));
}
var se = new SortedMap(DocumentKey.comparator);
var oe = new SortedSet(DocumentKey.comparator);
function __PRIVATE_documentKeySet(...e) {
  let t = oe;
  for (const n of e)
    t = t.add(n);
  return t;
}
var _e = new SortedSet(__PRIVATE_primitiveComparator);
function __PRIVATE_targetIdSet() {
  return _e;
}
function __PRIVATE_toDouble(e, t) {
  if (e.useProto3Json) {
    if (isNaN(t))
      return {
        doubleValue: "NaN"
      };
    if (t === 1 / 0)
      return {
        doubleValue: "Infinity"
      };
    if (t === -1 / 0)
      return {
        doubleValue: "-Infinity"
      };
  }
  return {
    doubleValue: __PRIVATE_isNegativeZero(t) ? "-0" : t
  };
}
function __PRIVATE_toInteger(e) {
  return {
    integerValue: "" + e
  };
}
function toNumber(e, t) {
  return isSafeInteger(t) ? __PRIVATE_toInteger(t) : __PRIVATE_toDouble(e, t);
}
var TransformOperation = class {
  constructor() {
    this._ = void 0;
  }
};
function __PRIVATE_applyTransformOperationToLocalView(e, t, n) {
  return e instanceof __PRIVATE_ServerTimestampTransform ? function serverTimestamp$1(e2, t2) {
    const n2 = {
      fields: {
        __type__: {
          stringValue: "server_timestamp"
        },
        __local_write_time__: {
          timestampValue: {
            seconds: e2.seconds,
            nanos: e2.nanoseconds
          }
        }
      }
    };
    return t2 && __PRIVATE_isServerTimestamp(t2) && (t2 = __PRIVATE_getPreviousValue(t2)), t2 && (n2.fields.__previous_value__ = t2), {
      mapValue: n2
    };
  }(n, t) : e instanceof __PRIVATE_ArrayUnionTransformOperation ? __PRIVATE_applyArrayUnionTransformOperation(e, t) : e instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_applyArrayRemoveTransformOperation(e, t) : function __PRIVATE_applyNumericIncrementTransformOperationToLocalView(e2, t2) {
    const n2 = __PRIVATE_computeTransformOperationBaseValue(e2, t2), r2 = asNumber(n2) + asNumber(e2.Ie);
    return isInteger(n2) && isInteger(e2.Ie) ? __PRIVATE_toInteger(r2) : __PRIVATE_toDouble(e2.serializer, r2);
  }(e, t);
}
function __PRIVATE_applyTransformOperationToRemoteDocument(e, t, n) {
  return e instanceof __PRIVATE_ArrayUnionTransformOperation ? __PRIVATE_applyArrayUnionTransformOperation(e, t) : e instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_applyArrayRemoveTransformOperation(e, t) : n;
}
function __PRIVATE_computeTransformOperationBaseValue(e, t) {
  return e instanceof __PRIVATE_NumericIncrementTransformOperation ? (
    /** Returns true if `value` is either an IntegerValue or a DoubleValue. */
    function __PRIVATE_isNumber(e2) {
      return isInteger(e2) || function __PRIVATE_isDouble(e3) {
        return !!e3 && "doubleValue" in e3;
      }(e2);
    }(t) ? t : {
      integerValue: 0
    }
  ) : null;
}
var __PRIVATE_ServerTimestampTransform = class extends TransformOperation {
};
var __PRIVATE_ArrayUnionTransformOperation = class extends TransformOperation {
  constructor(e) {
    super(), this.elements = e;
  }
};
function __PRIVATE_applyArrayUnionTransformOperation(e, t) {
  const n = __PRIVATE_coercedFieldValuesArray(t);
  for (const t2 of e.elements)
    n.some((e2) => __PRIVATE_valueEquals(e2, t2)) || n.push(t2);
  return {
    arrayValue: {
      values: n
    }
  };
}
var __PRIVATE_ArrayRemoveTransformOperation = class extends TransformOperation {
  constructor(e) {
    super(), this.elements = e;
  }
};
function __PRIVATE_applyArrayRemoveTransformOperation(e, t) {
  let n = __PRIVATE_coercedFieldValuesArray(t);
  for (const t2 of e.elements)
    n = n.filter((e2) => !__PRIVATE_valueEquals(e2, t2));
  return {
    arrayValue: {
      values: n
    }
  };
}
var __PRIVATE_NumericIncrementTransformOperation = class extends TransformOperation {
  constructor(e, t) {
    super(), this.serializer = e, this.Ie = t;
  }
};
function asNumber(e) {
  return __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue);
}
function __PRIVATE_coercedFieldValuesArray(e) {
  return isArray(e) && e.arrayValue.values ? e.arrayValue.values.slice() : [];
}
var FieldTransform = class {
  constructor(e, t) {
    this.field = e, this.transform = t;
  }
};
function __PRIVATE_fieldTransformEquals(e, t) {
  return e.field.isEqual(t.field) && function __PRIVATE_transformOperationEquals(e2, t2) {
    return e2 instanceof __PRIVATE_ArrayUnionTransformOperation && t2 instanceof __PRIVATE_ArrayUnionTransformOperation || e2 instanceof __PRIVATE_ArrayRemoveTransformOperation && t2 instanceof __PRIVATE_ArrayRemoveTransformOperation ? __PRIVATE_arrayEquals(e2.elements, t2.elements, __PRIVATE_valueEquals) : e2 instanceof __PRIVATE_NumericIncrementTransformOperation && t2 instanceof __PRIVATE_NumericIncrementTransformOperation ? __PRIVATE_valueEquals(e2.Ie, t2.Ie) : e2 instanceof __PRIVATE_ServerTimestampTransform && t2 instanceof __PRIVATE_ServerTimestampTransform;
  }(e.transform, t.transform);
}
var MutationResult = class {
  constructor(e, t) {
    this.version = e, this.transformResults = t;
  }
};
var Precondition = class _Precondition {
  constructor(e, t) {
    this.updateTime = e, this.exists = t;
  }
  /** Creates a new empty Precondition. */
  static none() {
    return new _Precondition();
  }
  /** Creates a new Precondition with an exists flag. */
  static exists(e) {
    return new _Precondition(void 0, e);
  }
  /** Creates a new Precondition based on a version a document exists at. */
  static updateTime(e) {
    return new _Precondition(e);
  }
  /** Returns whether this Precondition is empty. */
  get isNone() {
    return void 0 === this.updateTime && void 0 === this.exists;
  }
  isEqual(e) {
    return this.exists === e.exists && (this.updateTime ? !!e.updateTime && this.updateTime.isEqual(e.updateTime) : !e.updateTime);
  }
};
function __PRIVATE_preconditionIsValidForDocument(e, t) {
  return void 0 !== e.updateTime ? t.isFoundDocument() && t.version.isEqual(e.updateTime) : void 0 === e.exists || e.exists === t.isFoundDocument();
}
var Mutation = class {
};
function __PRIVATE_calculateOverlayMutation(e, t) {
  if (!e.hasLocalMutations || t && 0 === t.fields.length)
    return null;
  if (null === t)
    return e.isNoDocument() ? new __PRIVATE_DeleteMutation(e.key, Precondition.none()) : new __PRIVATE_SetMutation(e.key, e.data, Precondition.none());
  {
    const n = e.data, r2 = ObjectValue.empty();
    let i = new SortedSet(FieldPath$1.comparator);
    for (let e2 of t.fields)
      if (!i.has(e2)) {
        let t2 = n.field(e2);
        null === t2 && e2.length > 1 && (e2 = e2.popLast(), t2 = n.field(e2)), null === t2 ? r2.delete(e2) : r2.set(e2, t2), i = i.add(e2);
      }
    return new __PRIVATE_PatchMutation(e.key, r2, new FieldMask(i.toArray()), Precondition.none());
  }
}
function __PRIVATE_mutationApplyToRemoteDocument(e, t, n) {
  e instanceof __PRIVATE_SetMutation ? function __PRIVATE_setMutationApplyToRemoteDocument(e2, t2, n2) {
    const r2 = e2.value.clone(), i = __PRIVATE_serverTransformResults(e2.fieldTransforms, t2, n2.transformResults);
    r2.setAll(i), t2.convertToFoundDocument(n2.version, r2).setHasCommittedMutations();
  }(e, t, n) : e instanceof __PRIVATE_PatchMutation ? function __PRIVATE_patchMutationApplyToRemoteDocument(e2, t2, n2) {
    if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2))
      return void t2.convertToUnknownDocument(n2.version);
    const r2 = __PRIVATE_serverTransformResults(e2.fieldTransforms, t2, n2.transformResults), i = t2.data;
    i.setAll(__PRIVATE_getPatch(e2)), i.setAll(r2), t2.convertToFoundDocument(n2.version, i).setHasCommittedMutations();
  }(e, t, n) : function __PRIVATE_deleteMutationApplyToRemoteDocument(e2, t2, n2) {
    t2.convertToNoDocument(n2.version).setHasCommittedMutations();
  }(0, t, n);
}
function __PRIVATE_mutationApplyToLocalView(e, t, n, r2) {
  return e instanceof __PRIVATE_SetMutation ? function __PRIVATE_setMutationApplyToLocalView(e2, t2, n2, r3) {
    if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2))
      return n2;
    const i = e2.value.clone(), s = __PRIVATE_localTransformResults(e2.fieldTransforms, r3, t2);
    return i.setAll(s), t2.convertToFoundDocument(t2.version, i).setHasLocalMutations(), null;
  }(e, t, n, r2) : e instanceof __PRIVATE_PatchMutation ? function __PRIVATE_patchMutationApplyToLocalView(e2, t2, n2, r3) {
    if (!__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2))
      return n2;
    const i = __PRIVATE_localTransformResults(e2.fieldTransforms, r3, t2), s = t2.data;
    if (s.setAll(__PRIVATE_getPatch(e2)), s.setAll(i), t2.convertToFoundDocument(t2.version, s).setHasLocalMutations(), null === n2)
      return null;
    return n2.unionWith(e2.fieldMask.fields).unionWith(e2.fieldTransforms.map((e3) => e3.field));
  }(e, t, n, r2) : function __PRIVATE_deleteMutationApplyToLocalView(e2, t2, n2) {
    if (__PRIVATE_preconditionIsValidForDocument(e2.precondition, t2))
      return t2.convertToNoDocument(t2.version).setHasLocalMutations(), null;
    return n2;
  }(e, t, n);
}
function __PRIVATE_mutationExtractBaseValue(e, t) {
  let n = null;
  for (const r2 of e.fieldTransforms) {
    const e2 = t.data.field(r2.field), i = __PRIVATE_computeTransformOperationBaseValue(r2.transform, e2 || null);
    null != i && (null === n && (n = ObjectValue.empty()), n.set(r2.field, i));
  }
  return n || null;
}
function __PRIVATE_mutationEquals(e, t) {
  return e.type === t.type && (!!e.key.isEqual(t.key) && (!!e.precondition.isEqual(t.precondition) && (!!function __PRIVATE_fieldTransformsAreEqual(e2, t2) {
    return void 0 === e2 && void 0 === t2 || !(!e2 || !t2) && __PRIVATE_arrayEquals(e2, t2, (e3, t3) => __PRIVATE_fieldTransformEquals(e3, t3));
  }(e.fieldTransforms, t.fieldTransforms) && (0 === e.type ? e.value.isEqual(t.value) : 1 !== e.type || e.data.isEqual(t.data) && e.fieldMask.isEqual(t.fieldMask)))));
}
var __PRIVATE_SetMutation = class extends Mutation {
  constructor(e, t, n, r2 = []) {
    super(), this.key = e, this.value = t, this.precondition = n, this.fieldTransforms = r2, this.type = 0;
  }
  getFieldMask() {
    return null;
  }
};
var __PRIVATE_PatchMutation = class extends Mutation {
  constructor(e, t, n, r2, i = []) {
    super(), this.key = e, this.data = t, this.fieldMask = n, this.precondition = r2, this.fieldTransforms = i, this.type = 1;
  }
  getFieldMask() {
    return this.fieldMask;
  }
};
function __PRIVATE_getPatch(e) {
  const t = /* @__PURE__ */ new Map();
  return e.fieldMask.fields.forEach((n) => {
    if (!n.isEmpty()) {
      const r2 = e.data.field(n);
      t.set(n, r2);
    }
  }), t;
}
function __PRIVATE_serverTransformResults(e, t, n) {
  const r2 = /* @__PURE__ */ new Map();
  __PRIVATE_hardAssert(e.length === n.length);
  for (let i = 0; i < n.length; i++) {
    const s = e[i], o = s.transform, _ = t.data.field(s.field);
    r2.set(s.field, __PRIVATE_applyTransformOperationToRemoteDocument(o, _, n[i]));
  }
  return r2;
}
function __PRIVATE_localTransformResults(e, t, n) {
  const r2 = /* @__PURE__ */ new Map();
  for (const i of e) {
    const e2 = i.transform, s = n.data.field(i.field);
    r2.set(i.field, __PRIVATE_applyTransformOperationToLocalView(e2, s, t));
  }
  return r2;
}
var __PRIVATE_DeleteMutation = class extends Mutation {
  constructor(e, t) {
    super(), this.key = e, this.precondition = t, this.type = 2, this.fieldTransforms = [];
  }
  getFieldMask() {
    return null;
  }
};
var __PRIVATE_VerifyMutation = class extends Mutation {
  constructor(e, t) {
    super(), this.key = e, this.precondition = t, this.type = 3, this.fieldTransforms = [];
  }
  getFieldMask() {
    return null;
  }
};
var MutationBatch = class {
  /**
   * @param batchId - The unique ID of this mutation batch.
   * @param localWriteTime - The original write time of this mutation.
   * @param baseMutations - Mutations that are used to populate the base
   * values when this mutation is applied locally. This can be used to locally
   * overwrite values that are persisted in the remote document cache. Base
   * mutations are never sent to the backend.
   * @param mutations - The user-provided mutations in this mutation batch.
   * User-provided mutations are applied both locally and remotely on the
   * backend.
   */
  constructor(e, t, n, r2) {
    this.batchId = e, this.localWriteTime = t, this.baseMutations = n, this.mutations = r2;
  }
  /**
   * Applies all the mutations in this MutationBatch to the specified document
   * to compute the state of the remote document
   *
   * @param document - The document to apply mutations to.
   * @param batchResult - The result of applying the MutationBatch to the
   * backend.
   */
  applyToRemoteDocument(e, t) {
    const n = t.mutationResults;
    for (let t2 = 0; t2 < this.mutations.length; t2++) {
      const r2 = this.mutations[t2];
      if (r2.key.isEqual(e.key)) {
        __PRIVATE_mutationApplyToRemoteDocument(r2, e, n[t2]);
      }
    }
  }
  /**
   * Computes the local view of a document given all the mutations in this
   * batch.
   *
   * @param document - The document to apply mutations to.
   * @param mutatedFields - Fields that have been updated before applying this mutation batch.
   * @returns A `FieldMask` representing all the fields that are mutated.
   */
  applyToLocalView(e, t) {
    for (const n of this.baseMutations)
      n.key.isEqual(e.key) && (t = __PRIVATE_mutationApplyToLocalView(n, e, t, this.localWriteTime));
    for (const n of this.mutations)
      n.key.isEqual(e.key) && (t = __PRIVATE_mutationApplyToLocalView(n, e, t, this.localWriteTime));
    return t;
  }
  /**
   * Computes the local view for all provided documents given the mutations in
   * this batch. Returns a `DocumentKey` to `Mutation` map which can be used to
   * replace all the mutation applications.
   */
  applyToLocalDocumentSet(e, t) {
    const n = __PRIVATE_newMutationMap();
    return this.mutations.forEach((r2) => {
      const i = e.get(r2.key), s = i.overlayedDocument;
      let o = this.applyToLocalView(s, i.mutatedFields);
      o = t.has(r2.key) ? null : o;
      const _ = __PRIVATE_calculateOverlayMutation(s, o);
      null !== _ && n.set(r2.key, _), s.isValidDocument() || s.convertToNoDocument(SnapshotVersion.min());
    }), n;
  }
  keys() {
    return this.mutations.reduce((e, t) => e.add(t.key), __PRIVATE_documentKeySet());
  }
  isEqual(e) {
    return this.batchId === e.batchId && __PRIVATE_arrayEquals(this.mutations, e.mutations, (e2, t) => __PRIVATE_mutationEquals(e2, t)) && __PRIVATE_arrayEquals(this.baseMutations, e.baseMutations, (e2, t) => __PRIVATE_mutationEquals(e2, t));
  }
};
var MutationBatchResult = class _MutationBatchResult {
  constructor(e, t, n, r2) {
    this.batch = e, this.commitVersion = t, this.mutationResults = n, this.docVersions = r2;
  }
  /**
   * Creates a new MutationBatchResult for the given batch and results. There
   * must be one result for each mutation in the batch. This static factory
   * caches a document=&gt;version mapping (docVersions).
   */
  static from(e, t, n) {
    __PRIVATE_hardAssert(e.mutations.length === n.length);
    let r2 = function __PRIVATE_documentVersionMap() {
      return se;
    }();
    const i = e.mutations;
    for (let e2 = 0; e2 < i.length; e2++)
      r2 = r2.insert(i[e2].key, n[e2].version);
    return new _MutationBatchResult(e, t, n, r2);
  }
};
var Overlay = class {
  constructor(e, t) {
    this.largestBatchId = e, this.mutation = t;
  }
  getKey() {
    return this.mutation.key;
  }
  isEqual(e) {
    return null !== e && this.mutation === e.mutation;
  }
  toString() {
    return `Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`;
  }
};
var __PRIVATE_AggregateImpl = class {
  constructor(e, t, n) {
    this.alias = e, this.aggregateType = t, this.fieldPath = n;
  }
};
var ExistenceFilter = class {
  constructor(e, t) {
    this.count = e, this.unchangedNames = t;
  }
};
var ae2;
var ue;
function __PRIVATE_isPermanentError(e) {
  switch (e) {
    default:
      return fail();
    case D2.CANCELLED:
    case D2.UNKNOWN:
    case D2.DEADLINE_EXCEEDED:
    case D2.RESOURCE_EXHAUSTED:
    case D2.INTERNAL:
    case D2.UNAVAILABLE:
    case D2.UNAUTHENTICATED:
      return false;
    case D2.INVALID_ARGUMENT:
    case D2.NOT_FOUND:
    case D2.ALREADY_EXISTS:
    case D2.PERMISSION_DENIED:
    case D2.FAILED_PRECONDITION:
    case D2.ABORTED:
    case D2.OUT_OF_RANGE:
    case D2.UNIMPLEMENTED:
    case D2.DATA_LOSS:
      return true;
  }
}
function __PRIVATE_mapCodeFromRpcCode(e) {
  if (void 0 === e)
    return __PRIVATE_logError("GRPC error has no .code"), D2.UNKNOWN;
  switch (e) {
    case ae2.OK:
      return D2.OK;
    case ae2.CANCELLED:
      return D2.CANCELLED;
    case ae2.UNKNOWN:
      return D2.UNKNOWN;
    case ae2.DEADLINE_EXCEEDED:
      return D2.DEADLINE_EXCEEDED;
    case ae2.RESOURCE_EXHAUSTED:
      return D2.RESOURCE_EXHAUSTED;
    case ae2.INTERNAL:
      return D2.INTERNAL;
    case ae2.UNAVAILABLE:
      return D2.UNAVAILABLE;
    case ae2.UNAUTHENTICATED:
      return D2.UNAUTHENTICATED;
    case ae2.INVALID_ARGUMENT:
      return D2.INVALID_ARGUMENT;
    case ae2.NOT_FOUND:
      return D2.NOT_FOUND;
    case ae2.ALREADY_EXISTS:
      return D2.ALREADY_EXISTS;
    case ae2.PERMISSION_DENIED:
      return D2.PERMISSION_DENIED;
    case ae2.FAILED_PRECONDITION:
      return D2.FAILED_PRECONDITION;
    case ae2.ABORTED:
      return D2.ABORTED;
    case ae2.OUT_OF_RANGE:
      return D2.OUT_OF_RANGE;
    case ae2.UNIMPLEMENTED:
      return D2.UNIMPLEMENTED;
    case ae2.DATA_LOSS:
      return D2.DATA_LOSS;
    default:
      return fail();
  }
}
(ue = ae2 || (ae2 = {}))[ue.OK = 0] = "OK", ue[ue.CANCELLED = 1] = "CANCELLED", ue[ue.UNKNOWN = 2] = "UNKNOWN", ue[ue.INVALID_ARGUMENT = 3] = "INVALID_ARGUMENT", ue[ue.DEADLINE_EXCEEDED = 4] = "DEADLINE_EXCEEDED", ue[ue.NOT_FOUND = 5] = "NOT_FOUND", ue[ue.ALREADY_EXISTS = 6] = "ALREADY_EXISTS", ue[ue.PERMISSION_DENIED = 7] = "PERMISSION_DENIED", ue[ue.UNAUTHENTICATED = 16] = "UNAUTHENTICATED", ue[ue.RESOURCE_EXHAUSTED = 8] = "RESOURCE_EXHAUSTED", ue[ue.FAILED_PRECONDITION = 9] = "FAILED_PRECONDITION", ue[ue.ABORTED = 10] = "ABORTED", ue[ue.OUT_OF_RANGE = 11] = "OUT_OF_RANGE", ue[ue.UNIMPLEMENTED = 12] = "UNIMPLEMENTED", ue[ue.INTERNAL = 13] = "INTERNAL", ue[ue.UNAVAILABLE = 14] = "UNAVAILABLE", ue[ue.DATA_LOSS = 15] = "DATA_LOSS";
var ce = null;
function __PRIVATE_newTextEncoder() {
  return new TextEncoder();
}
var le = new Integer([4294967295, 4294967295], 0);
function __PRIVATE_getMd5HashValue(e) {
  const t = __PRIVATE_newTextEncoder().encode(e), n = new Md5();
  return n.update(t), new Uint8Array(n.digest());
}
function __PRIVATE_get64BitUints(e) {
  const t = new DataView(e.buffer), n = t.getUint32(
    0,
    /* littleEndian= */
    true
  ), r2 = t.getUint32(
    4,
    /* littleEndian= */
    true
  ), i = t.getUint32(
    8,
    /* littleEndian= */
    true
  ), s = t.getUint32(
    12,
    /* littleEndian= */
    true
  );
  return [new Integer([n, r2], 0), new Integer([i, s], 0)];
}
var BloomFilter = class _BloomFilter {
  constructor(e, t, n) {
    if (this.bitmap = e, this.padding = t, this.hashCount = n, t < 0 || t >= 8)
      throw new __PRIVATE_BloomFilterError(`Invalid padding: ${t}`);
    if (n < 0)
      throw new __PRIVATE_BloomFilterError(`Invalid hash count: ${n}`);
    if (e.length > 0 && 0 === this.hashCount)
      throw new __PRIVATE_BloomFilterError(`Invalid hash count: ${n}`);
    if (0 === e.length && 0 !== t)
      throw new __PRIVATE_BloomFilterError(`Invalid padding when bitmap length is 0: ${t}`);
    this.Te = 8 * e.length - t, // Set the bit count in Integer to avoid repetition in mightContain().
    this.Ee = Integer.fromNumber(this.Te);
  }
  // Calculate the ith hash value based on the hashed 64bit integers,
  // and calculate its corresponding bit index in the bitmap to be checked.
  de(e, t, n) {
    let r2 = e.add(t.multiply(Integer.fromNumber(n)));
    return 1 === r2.compare(le) && (r2 = new Integer([r2.getBits(0), r2.getBits(1)], 0)), r2.modulo(this.Ee).toNumber();
  }
  // Return whether the bit on the given index in the bitmap is set to 1.
  Ae(e) {
    return 0 != (this.bitmap[Math.floor(e / 8)] & 1 << e % 8);
  }
  mightContain(e) {
    if (0 === this.Te)
      return false;
    const t = __PRIVATE_getMd5HashValue(e), [n, r2] = __PRIVATE_get64BitUints(t);
    for (let e2 = 0; e2 < this.hashCount; e2++) {
      const t2 = this.de(n, r2, e2);
      if (!this.Ae(t2))
        return false;
    }
    return true;
  }
  /** Create bloom filter for testing purposes only. */
  static create(e, t, n) {
    const r2 = e % 8 == 0 ? 0 : 8 - e % 8, i = new Uint8Array(Math.ceil(e / 8)), s = new _BloomFilter(i, r2, t);
    return n.forEach((e2) => s.insert(e2)), s;
  }
  insert(e) {
    if (0 === this.Te)
      return;
    const t = __PRIVATE_getMd5HashValue(e), [n, r2] = __PRIVATE_get64BitUints(t);
    for (let e2 = 0; e2 < this.hashCount; e2++) {
      const t2 = this.de(n, r2, e2);
      this.Re(t2);
    }
  }
  Re(e) {
    const t = Math.floor(e / 8), n = e % 8;
    this.bitmap[t] |= 1 << n;
  }
};
var __PRIVATE_BloomFilterError = class extends Error {
  constructor() {
    super(...arguments), this.name = "BloomFilterError";
  }
};
var RemoteEvent = class _RemoteEvent {
  constructor(e, t, n, r2, i) {
    this.snapshotVersion = e, this.targetChanges = t, this.targetMismatches = n, this.documentUpdates = r2, this.resolvedLimboDocuments = i;
  }
  /**
   * HACK: Views require RemoteEvents in order to determine whether the view is
   * CURRENT, but secondary tabs don't receive remote events. So this method is
   * used to create a synthesized RemoteEvent that can be used to apply a
   * CURRENT status change to a View, for queries executed in a different tab.
   */
  // PORTING NOTE: Multi-tab only
  static createSynthesizedRemoteEventForCurrentChange(e, t, n) {
    const r2 = /* @__PURE__ */ new Map();
    return r2.set(e, TargetChange.createSynthesizedTargetChangeForCurrentChange(e, t, n)), new _RemoteEvent(SnapshotVersion.min(), r2, new SortedMap(__PRIVATE_primitiveComparator), __PRIVATE_mutableDocumentMap(), __PRIVATE_documentKeySet());
  }
};
var TargetChange = class _TargetChange {
  constructor(e, t, n, r2, i) {
    this.resumeToken = e, this.current = t, this.addedDocuments = n, this.modifiedDocuments = r2, this.removedDocuments = i;
  }
  /**
   * This method is used to create a synthesized TargetChanges that can be used to
   * apply a CURRENT status change to a View (for queries executed in a different
   * tab) or for new queries (to raise snapshots with correct CURRENT status).
   */
  static createSynthesizedTargetChangeForCurrentChange(e, t, n) {
    return new _TargetChange(n, t, __PRIVATE_documentKeySet(), __PRIVATE_documentKeySet(), __PRIVATE_documentKeySet());
  }
};
var __PRIVATE_DocumentWatchChange = class {
  constructor(e, t, n, r2) {
    this.Ve = e, this.removedTargetIds = t, this.key = n, this.me = r2;
  }
};
var __PRIVATE_ExistenceFilterChange = class {
  constructor(e, t) {
    this.targetId = e, this.fe = t;
  }
};
var __PRIVATE_WatchTargetChange = class {
  constructor(e, t, n = ByteString.EMPTY_BYTE_STRING, r2 = null) {
    this.state = e, this.targetIds = t, this.resumeToken = n, this.cause = r2;
  }
};
var __PRIVATE_TargetState = class {
  constructor() {
    this.ge = 0, /**
     * Keeps track of the document changes since the last raised snapshot.
     *
     * These changes are continuously updated as we receive document updates and
     * always reflect the current set of changes against the last issued snapshot.
     */
    this.pe = __PRIVATE_snapshotChangesMap(), /** See public getters for explanations of these fields. */
    this.ye = ByteString.EMPTY_BYTE_STRING, this.we = false, /**
     * Whether this target state should be included in the next snapshot. We
     * initialize to true so that newly-added targets are included in the next
     * RemoteEvent.
     */
    this.Se = true;
  }
  /**
   * Whether this target has been marked 'current'.
   *
   * 'Current' has special meaning in the RPC protocol: It implies that the
   * Watch backend has sent us all changes up to the point at which the target
   * was added and that the target is consistent with the rest of the watch
   * stream.
   */
  get current() {
    return this.we;
  }
  /** The last resume token sent to us for this target. */
  get resumeToken() {
    return this.ye;
  }
  /** Whether this target has pending target adds or target removes. */
  get be() {
    return 0 !== this.ge;
  }
  /** Whether we have modified any state that should trigger a snapshot. */
  get De() {
    return this.Se;
  }
  /**
   * Applies the resume token to the TargetChange, but only when it has a new
   * value. Empty resumeTokens are discarded.
   */
  Ce(e) {
    e.approximateByteSize() > 0 && (this.Se = true, this.ye = e);
  }
  /**
   * Creates a target change from the current set of changes.
   *
   * To reset the document changes after raising this snapshot, call
   * `clearPendingChanges()`.
   */
  ve() {
    let e = __PRIVATE_documentKeySet(), t = __PRIVATE_documentKeySet(), n = __PRIVATE_documentKeySet();
    return this.pe.forEach((r2, i) => {
      switch (i) {
        case 0:
          e = e.add(r2);
          break;
        case 2:
          t = t.add(r2);
          break;
        case 1:
          n = n.add(r2);
          break;
        default:
          fail();
      }
    }), new TargetChange(this.ye, this.we, e, t, n);
  }
  /**
   * Resets the document changes and sets `hasPendingChanges` to false.
   */
  Fe() {
    this.Se = false, this.pe = __PRIVATE_snapshotChangesMap();
  }
  Me(e, t) {
    this.Se = true, this.pe = this.pe.insert(e, t);
  }
  xe(e) {
    this.Se = true, this.pe = this.pe.remove(e);
  }
  Oe() {
    this.ge += 1;
  }
  Ne() {
    this.ge -= 1, __PRIVATE_hardAssert(this.ge >= 0);
  }
  Be() {
    this.Se = true, this.we = true;
  }
};
var __PRIVATE_WatchChangeAggregator = class {
  constructor(e) {
    this.Le = e, /** The internal state of all tracked targets. */
    this.ke = /* @__PURE__ */ new Map(), /** Keeps track of the documents to update since the last raised snapshot. */
    this.qe = __PRIVATE_mutableDocumentMap(), /** A mapping of document keys to their set of target IDs. */
    this.Qe = __PRIVATE_documentTargetMap(), /**
     * A map of targets with existence filter mismatches. These targets are
     * known to be inconsistent and their listens needs to be re-established by
     * RemoteStore.
     */
    this.Ke = new SortedMap(__PRIVATE_primitiveComparator);
  }
  /**
   * Processes and adds the DocumentWatchChange to the current set of changes.
   */
  $e(e) {
    for (const t of e.Ve)
      e.me && e.me.isFoundDocument() ? this.Ue(t, e.me) : this.We(t, e.key, e.me);
    for (const t of e.removedTargetIds)
      this.We(t, e.key, e.me);
  }
  /** Processes and adds the WatchTargetChange to the current set of changes. */
  Ge(e) {
    this.forEachTarget(e, (t) => {
      const n = this.ze(t);
      switch (e.state) {
        case 0:
          this.je(t) && n.Ce(e.resumeToken);
          break;
        case 1:
          n.Ne(), n.be || // We have a freshly added target, so we need to reset any state
          // that we had previously. This can happen e.g. when remove and add
          // back a target for existence filter mismatches.
          n.Fe(), n.Ce(e.resumeToken);
          break;
        case 2:
          n.Ne(), n.be || this.removeTarget(t);
          break;
        case 3:
          this.je(t) && (n.Be(), n.Ce(e.resumeToken));
          break;
        case 4:
          this.je(t) && // Reset the target and synthesizes removes for all existing
          // documents. The backend will re-add any documents that still
          // match the target before it sends the next global snapshot.
          (this.He(t), n.Ce(e.resumeToken));
          break;
        default:
          fail();
      }
    });
  }
  /**
   * Iterates over all targetIds that the watch change applies to: either the
   * targetIds explicitly listed in the change or the targetIds of all currently
   * active targets.
   */
  forEachTarget(e, t) {
    e.targetIds.length > 0 ? e.targetIds.forEach(t) : this.ke.forEach((e2, n) => {
      this.je(n) && t(n);
    });
  }
  /**
   * Handles existence filters and synthesizes deletes for filter mismatches.
   * Targets that are invalidated by filter mismatches are added to
   * `pendingTargetResets`.
   */
  Je(e) {
    const t = e.targetId, n = e.fe.count, r2 = this.Ye(t);
    if (r2) {
      const i = r2.target;
      if (__PRIVATE_targetIsDocumentTarget(i))
        if (0 === n) {
          const e2 = new DocumentKey(i.path);
          this.We(t, e2, MutableDocument.newNoDocument(e2, SnapshotVersion.min()));
        } else
          __PRIVATE_hardAssert(1 === n);
      else {
        const r3 = this.Ze(t);
        if (r3 !== n) {
          const n2 = this.Xe(e), i2 = n2 ? this.et(n2, e, r3) : 1;
          if (0 !== i2) {
            this.He(t);
            const e2 = 2 === i2 ? "TargetPurposeExistenceFilterMismatchBloom" : "TargetPurposeExistenceFilterMismatch";
            this.Ke = this.Ke.insert(t, e2);
          }
          null == ce || ce.tt(function __PRIVATE_createExistenceFilterMismatchInfoForTestingHooks(e2, t2, n3, r4, i3) {
            var s, o, _, a, u, c;
            const l2 = {
              localCacheCount: e2,
              existenceFilterCount: t2.count,
              databaseId: n3.database,
              projectId: n3.projectId
            }, h = t2.unchangedNames;
            h && (l2.bloomFilter = {
              applied: 0 === i3,
              hashCount: null !== (s = null == h ? void 0 : h.hashCount) && void 0 !== s ? s : 0,
              bitmapLength: null !== (a = null === (_ = null === (o = null == h ? void 0 : h.bits) || void 0 === o ? void 0 : o.bitmap) || void 0 === _ ? void 0 : _.length) && void 0 !== a ? a : 0,
              padding: null !== (c = null === (u = null == h ? void 0 : h.bits) || void 0 === u ? void 0 : u.padding) && void 0 !== c ? c : 0,
              mightContain: (e3) => {
                var t3;
                return null !== (t3 = null == r4 ? void 0 : r4.mightContain(e3)) && void 0 !== t3 && t3;
              }
            });
            return l2;
          }(r3, e.fe, this.Le.nt(), n2, i2));
        }
      }
    }
  }
  /**
   * Parse the bloom filter from the "unchanged_names" field of an existence
   * filter.
   */
  Xe(e) {
    const t = e.fe.unchangedNames;
    if (!t || !t.bits)
      return null;
    const { bits: { bitmap: n = "", padding: r2 = 0 }, hashCount: i = 0 } = t;
    let s, o;
    try {
      s = __PRIVATE_normalizeByteString(n).toUint8Array();
    } catch (e2) {
      if (e2 instanceof __PRIVATE_Base64DecodeError)
        return __PRIVATE_logWarn("Decoding the base64 bloom filter in existence filter failed (" + e2.message + "); ignoring the bloom filter and falling back to full re-query."), null;
      throw e2;
    }
    try {
      o = new BloomFilter(s, r2, i);
    } catch (e2) {
      return __PRIVATE_logWarn(e2 instanceof __PRIVATE_BloomFilterError ? "BloomFilter error: " : "Applying bloom filter failed: ", e2), null;
    }
    return 0 === o.Te ? null : o;
  }
  /**
   * Apply bloom filter to remove the deleted documents, and return the
   * application status.
   */
  et(e, t, n) {
    return t.fe.count === n - this.rt(e, t.targetId) ? 0 : 2;
  }
  /**
   * Filter out removed documents based on bloom filter membership result and
   * return number of documents removed.
   */
  rt(e, t) {
    const n = this.Le.getRemoteKeysForTarget(t);
    let r2 = 0;
    return n.forEach((n2) => {
      const i = this.Le.nt(), s = `projects/${i.projectId}/databases/${i.database}/documents/${n2.path.canonicalString()}`;
      e.mightContain(s) || (this.We(
        t,
        n2,
        /*updatedDocument=*/
        null
      ), r2++);
    }), r2;
  }
  /**
   * Converts the currently accumulated state into a remote event at the
   * provided snapshot version. Resets the accumulated changes before returning.
   */
  it(e) {
    const t = /* @__PURE__ */ new Map();
    this.ke.forEach((n2, r3) => {
      const i = this.Ye(r3);
      if (i) {
        if (n2.current && __PRIVATE_targetIsDocumentTarget(i.target)) {
          const t2 = new DocumentKey(i.target.path);
          null !== this.qe.get(t2) || this.st(r3, t2) || this.We(r3, t2, MutableDocument.newNoDocument(t2, e));
        }
        n2.De && (t.set(r3, n2.ve()), n2.Fe());
      }
    });
    let n = __PRIVATE_documentKeySet();
    this.Qe.forEach((e2, t2) => {
      let r3 = true;
      t2.forEachWhile((e3) => {
        const t3 = this.Ye(e3);
        return !t3 || "TargetPurposeLimboResolution" === t3.purpose || (r3 = false, false);
      }), r3 && (n = n.add(e2));
    }), this.qe.forEach((t2, n2) => n2.setReadTime(e));
    const r2 = new RemoteEvent(e, t, this.Ke, this.qe, n);
    return this.qe = __PRIVATE_mutableDocumentMap(), this.Qe = __PRIVATE_documentTargetMap(), this.Ke = new SortedMap(__PRIVATE_primitiveComparator), r2;
  }
  /**
   * Adds the provided document to the internal list of document updates and
   * its document key to the given target's mapping.
   */
  // Visible for testing.
  Ue(e, t) {
    if (!this.je(e))
      return;
    const n = this.st(e, t.key) ? 2 : 0;
    this.ze(e).Me(t.key, n), this.qe = this.qe.insert(t.key, t), this.Qe = this.Qe.insert(t.key, this.ot(t.key).add(e));
  }
  /**
   * Removes the provided document from the target mapping. If the
   * document no longer matches the target, but the document's state is still
   * known (e.g. we know that the document was deleted or we received the change
   * that caused the filter mismatch), the new document can be provided
   * to update the remote document cache.
   */
  // Visible for testing.
  We(e, t, n) {
    if (!this.je(e))
      return;
    const r2 = this.ze(e);
    this.st(e, t) ? r2.Me(
      t,
      1
      /* ChangeType.Removed */
    ) : (
      // The document may have entered and left the target before we raised a
      // snapshot, so we can just ignore the change.
      r2.xe(t)
    ), this.Qe = this.Qe.insert(t, this.ot(t).delete(e)), n && (this.qe = this.qe.insert(t, n));
  }
  removeTarget(e) {
    this.ke.delete(e);
  }
  /**
   * Returns the current count of documents in the target. This includes both
   * the number of documents that the LocalStore considers to be part of the
   * target as well as any accumulated changes.
   */
  Ze(e) {
    const t = this.ze(e).ve();
    return this.Le.getRemoteKeysForTarget(e).size + t.addedDocuments.size - t.removedDocuments.size;
  }
  /**
   * Increment the number of acks needed from watch before we can consider the
   * server to be 'in-sync' with the client's active targets.
   */
  Oe(e) {
    this.ze(e).Oe();
  }
  ze(e) {
    let t = this.ke.get(e);
    return t || (t = new __PRIVATE_TargetState(), this.ke.set(e, t)), t;
  }
  ot(e) {
    let t = this.Qe.get(e);
    return t || (t = new SortedSet(__PRIVATE_primitiveComparator), this.Qe = this.Qe.insert(e, t)), t;
  }
  /**
   * Verifies that the user is still interested in this target (by calling
   * `getTargetDataForTarget()`) and that we are not waiting for pending ADDs
   * from watch.
   */
  je(e) {
    const t = null !== this.Ye(e);
    return t || __PRIVATE_logDebug("WatchChangeAggregator", "Detected inactive target", e), t;
  }
  /**
   * Returns the TargetData for an active target (i.e. a target that the user
   * is still interested in that has no outstanding target change requests).
   */
  Ye(e) {
    const t = this.ke.get(e);
    return t && t.be ? null : this.Le._t(e);
  }
  /**
   * Resets the state of a Watch target to its initial state (e.g. sets
   * 'current' to false, clears the resume token and removes its target mapping
   * from all documents).
   */
  He(e) {
    this.ke.set(e, new __PRIVATE_TargetState());
    this.Le.getRemoteKeysForTarget(e).forEach((t) => {
      this.We(
        e,
        t,
        /*updatedDocument=*/
        null
      );
    });
  }
  /**
   * Returns whether the LocalStore considers the document to be part of the
   * specified target.
   */
  st(e, t) {
    return this.Le.getRemoteKeysForTarget(e).has(t);
  }
};
function __PRIVATE_documentTargetMap() {
  return new SortedMap(DocumentKey.comparator);
}
function __PRIVATE_snapshotChangesMap() {
  return new SortedMap(DocumentKey.comparator);
}
var he = (() => {
  const e = {
    asc: "ASCENDING",
    desc: "DESCENDING"
  };
  return e;
})();
var Pe = (() => {
  const e = {
    "<": "LESS_THAN",
    "<=": "LESS_THAN_OR_EQUAL",
    ">": "GREATER_THAN",
    ">=": "GREATER_THAN_OR_EQUAL",
    "==": "EQUAL",
    "!=": "NOT_EQUAL",
    "array-contains": "ARRAY_CONTAINS",
    in: "IN",
    "not-in": "NOT_IN",
    "array-contains-any": "ARRAY_CONTAINS_ANY"
  };
  return e;
})();
var Ie = (() => {
  const e = {
    and: "AND",
    or: "OR"
  };
  return e;
})();
var JsonProtoSerializer = class {
  constructor(e, t) {
    this.databaseId = e, this.useProto3Json = t;
  }
};
function __PRIVATE_toInt32Proto(e, t) {
  return e.useProto3Json || __PRIVATE_isNullOrUndefined(t) ? t : {
    value: t
  };
}
function toTimestamp(e, t) {
  if (e.useProto3Json) {
    return `${new Date(1e3 * t.seconds).toISOString().replace(/\.\d*/, "").replace("Z", "")}.${("000000000" + t.nanoseconds).slice(-9)}Z`;
  }
  return {
    seconds: "" + t.seconds,
    nanos: t.nanoseconds
  };
}
function __PRIVATE_toBytes(e, t) {
  return e.useProto3Json ? t.toBase64() : t.toUint8Array();
}
function __PRIVATE_toVersion(e, t) {
  return toTimestamp(e, t.toTimestamp());
}
function __PRIVATE_fromVersion(e) {
  return __PRIVATE_hardAssert(!!e), SnapshotVersion.fromTimestamp(function fromTimestamp(e2) {
    const t = __PRIVATE_normalizeTimestamp(e2);
    return new Timestamp(t.seconds, t.nanos);
  }(e));
}
function __PRIVATE_toResourceName(e, t) {
  return function __PRIVATE_fullyQualifiedPrefixPath(e2) {
    return new ResourcePath(["projects", e2.projectId, "databases", e2.database]);
  }(e).child("documents").child(t).canonicalString();
}
function __PRIVATE_fromResourceName(e) {
  const t = ResourcePath.fromString(e);
  return __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(t)), t;
}
function __PRIVATE_toName(e, t) {
  return __PRIVATE_toResourceName(e.databaseId, t.path);
}
function fromName(e, t) {
  const n = __PRIVATE_fromResourceName(t);
  if (n.get(1) !== e.databaseId.projectId)
    throw new FirestoreError(D2.INVALID_ARGUMENT, "Tried to deserialize key from different project: " + n.get(1) + " vs " + e.databaseId.projectId);
  if (n.get(3) !== e.databaseId.database)
    throw new FirestoreError(D2.INVALID_ARGUMENT, "Tried to deserialize key from different database: " + n.get(3) + " vs " + e.databaseId.database);
  return new DocumentKey(__PRIVATE_extractLocalPathFromResourceName(n));
}
function __PRIVATE_toQueryPath(e, t) {
  return __PRIVATE_toResourceName(e.databaseId, t);
}
function __PRIVATE_fromQueryPath(e) {
  const t = __PRIVATE_fromResourceName(e);
  return 4 === t.length ? ResourcePath.emptyPath() : __PRIVATE_extractLocalPathFromResourceName(t);
}
function __PRIVATE_getEncodedDatabaseId(e) {
  return new ResourcePath(["projects", e.databaseId.projectId, "databases", e.databaseId.database]).canonicalString();
}
function __PRIVATE_extractLocalPathFromResourceName(e) {
  return __PRIVATE_hardAssert(e.length > 4 && "documents" === e.get(4)), e.popFirst(5);
}
function __PRIVATE_toMutationDocument(e, t, n) {
  return {
    name: __PRIVATE_toName(e, t),
    fields: n.value.mapValue.fields
  };
}
function __PRIVATE_fromDocument(e, t, n) {
  const r2 = fromName(e, t.name), i = __PRIVATE_fromVersion(t.updateTime), s = t.createTime ? __PRIVATE_fromVersion(t.createTime) : SnapshotVersion.min(), o = new ObjectValue({
    mapValue: {
      fields: t.fields
    }
  }), _ = MutableDocument.newFoundDocument(r2, i, s, o);
  return n && _.setHasCommittedMutations(), n ? _.setHasCommittedMutations() : _;
}
function __PRIVATE_fromBatchGetDocumentsResponse(e, t) {
  return "found" in t ? function __PRIVATE_fromFound(e2, t2) {
    __PRIVATE_hardAssert(!!t2.found), t2.found.name, t2.found.updateTime;
    const n = fromName(e2, t2.found.name), r2 = __PRIVATE_fromVersion(t2.found.updateTime), i = t2.found.createTime ? __PRIVATE_fromVersion(t2.found.createTime) : SnapshotVersion.min(), s = new ObjectValue({
      mapValue: {
        fields: t2.found.fields
      }
    });
    return MutableDocument.newFoundDocument(n, r2, i, s);
  }(e, t) : "missing" in t ? function __PRIVATE_fromMissing(e2, t2) {
    __PRIVATE_hardAssert(!!t2.missing), __PRIVATE_hardAssert(!!t2.readTime);
    const n = fromName(e2, t2.missing), r2 = __PRIVATE_fromVersion(t2.readTime);
    return MutableDocument.newNoDocument(n, r2);
  }(e, t) : fail();
}
function __PRIVATE_fromWatchChange(e, t) {
  let n;
  if ("targetChange" in t) {
    t.targetChange;
    const r2 = function __PRIVATE_fromWatchTargetChangeState(e2) {
      return "NO_CHANGE" === e2 ? 0 : "ADD" === e2 ? 1 : "REMOVE" === e2 ? 2 : "CURRENT" === e2 ? 3 : "RESET" === e2 ? 4 : fail();
    }(t.targetChange.targetChangeType || "NO_CHANGE"), i = t.targetChange.targetIds || [], s = function __PRIVATE_fromBytes(e2, t2) {
      return e2.useProto3Json ? (__PRIVATE_hardAssert(void 0 === t2 || "string" == typeof t2), ByteString.fromBase64String(t2 || "")) : (__PRIVATE_hardAssert(void 0 === t2 || t2 instanceof Uint8Array), ByteString.fromUint8Array(t2 || new Uint8Array()));
    }(e, t.targetChange.resumeToken), o = t.targetChange.cause, _ = o && function __PRIVATE_fromRpcStatus(e2) {
      const t2 = void 0 === e2.code ? D2.UNKNOWN : __PRIVATE_mapCodeFromRpcCode(e2.code);
      return new FirestoreError(t2, e2.message || "");
    }(o);
    n = new __PRIVATE_WatchTargetChange(r2, i, s, _ || null);
  } else if ("documentChange" in t) {
    t.documentChange;
    const r2 = t.documentChange;
    r2.document, r2.document.name, r2.document.updateTime;
    const i = fromName(e, r2.document.name), s = __PRIVATE_fromVersion(r2.document.updateTime), o = r2.document.createTime ? __PRIVATE_fromVersion(r2.document.createTime) : SnapshotVersion.min(), _ = new ObjectValue({
      mapValue: {
        fields: r2.document.fields
      }
    }), a = MutableDocument.newFoundDocument(i, s, o, _), u = r2.targetIds || [], c = r2.removedTargetIds || [];
    n = new __PRIVATE_DocumentWatchChange(u, c, a.key, a);
  } else if ("documentDelete" in t) {
    t.documentDelete;
    const r2 = t.documentDelete;
    r2.document;
    const i = fromName(e, r2.document), s = r2.readTime ? __PRIVATE_fromVersion(r2.readTime) : SnapshotVersion.min(), o = MutableDocument.newNoDocument(i, s), _ = r2.removedTargetIds || [];
    n = new __PRIVATE_DocumentWatchChange([], _, o.key, o);
  } else if ("documentRemove" in t) {
    t.documentRemove;
    const r2 = t.documentRemove;
    r2.document;
    const i = fromName(e, r2.document), s = r2.removedTargetIds || [];
    n = new __PRIVATE_DocumentWatchChange([], s, i, null);
  } else {
    if (!("filter" in t))
      return fail();
    {
      t.filter;
      const e2 = t.filter;
      e2.targetId;
      const { count: r2 = 0, unchangedNames: i } = e2, s = new ExistenceFilter(r2, i), o = e2.targetId;
      n = new __PRIVATE_ExistenceFilterChange(o, s);
    }
  }
  return n;
}
function toMutation(e, t) {
  let n;
  if (t instanceof __PRIVATE_SetMutation)
    n = {
      update: __PRIVATE_toMutationDocument(e, t.key, t.value)
    };
  else if (t instanceof __PRIVATE_DeleteMutation)
    n = {
      delete: __PRIVATE_toName(e, t.key)
    };
  else if (t instanceof __PRIVATE_PatchMutation)
    n = {
      update: __PRIVATE_toMutationDocument(e, t.key, t.data),
      updateMask: __PRIVATE_toDocumentMask(t.fieldMask)
    };
  else {
    if (!(t instanceof __PRIVATE_VerifyMutation))
      return fail();
    n = {
      verify: __PRIVATE_toName(e, t.key)
    };
  }
  return t.fieldTransforms.length > 0 && (n.updateTransforms = t.fieldTransforms.map((e2) => function __PRIVATE_toFieldTransform(e3, t2) {
    const n2 = t2.transform;
    if (n2 instanceof __PRIVATE_ServerTimestampTransform)
      return {
        fieldPath: t2.field.canonicalString(),
        setToServerValue: "REQUEST_TIME"
      };
    if (n2 instanceof __PRIVATE_ArrayUnionTransformOperation)
      return {
        fieldPath: t2.field.canonicalString(),
        appendMissingElements: {
          values: n2.elements
        }
      };
    if (n2 instanceof __PRIVATE_ArrayRemoveTransformOperation)
      return {
        fieldPath: t2.field.canonicalString(),
        removeAllFromArray: {
          values: n2.elements
        }
      };
    if (n2 instanceof __PRIVATE_NumericIncrementTransformOperation)
      return {
        fieldPath: t2.field.canonicalString(),
        increment: n2.Ie
      };
    throw fail();
  }(0, e2))), t.precondition.isNone || (n.currentDocument = function __PRIVATE_toPrecondition(e2, t2) {
    return void 0 !== t2.updateTime ? {
      updateTime: __PRIVATE_toVersion(e2, t2.updateTime)
    } : void 0 !== t2.exists ? {
      exists: t2.exists
    } : fail();
  }(e, t.precondition)), n;
}
function __PRIVATE_fromMutation(e, t) {
  const n = t.currentDocument ? function __PRIVATE_fromPrecondition(e2) {
    return void 0 !== e2.updateTime ? Precondition.updateTime(__PRIVATE_fromVersion(e2.updateTime)) : void 0 !== e2.exists ? Precondition.exists(e2.exists) : Precondition.none();
  }(t.currentDocument) : Precondition.none(), r2 = t.updateTransforms ? t.updateTransforms.map((t2) => function __PRIVATE_fromFieldTransform(e2, t3) {
    let n2 = null;
    if ("setToServerValue" in t3)
      __PRIVATE_hardAssert("REQUEST_TIME" === t3.setToServerValue), n2 = new __PRIVATE_ServerTimestampTransform();
    else if ("appendMissingElements" in t3) {
      const e3 = t3.appendMissingElements.values || [];
      n2 = new __PRIVATE_ArrayUnionTransformOperation(e3);
    } else if ("removeAllFromArray" in t3) {
      const e3 = t3.removeAllFromArray.values || [];
      n2 = new __PRIVATE_ArrayRemoveTransformOperation(e3);
    } else
      "increment" in t3 ? n2 = new __PRIVATE_NumericIncrementTransformOperation(e2, t3.increment) : fail();
    const r3 = FieldPath$1.fromServerFormat(t3.fieldPath);
    return new FieldTransform(r3, n2);
  }(e, t2)) : [];
  if (t.update) {
    t.update.name;
    const i = fromName(e, t.update.name), s = new ObjectValue({
      mapValue: {
        fields: t.update.fields
      }
    });
    if (t.updateMask) {
      const e2 = function __PRIVATE_fromDocumentMask(e3) {
        const t2 = e3.fieldPaths || [];
        return new FieldMask(t2.map((e4) => FieldPath$1.fromServerFormat(e4)));
      }(t.updateMask);
      return new __PRIVATE_PatchMutation(i, s, e2, n, r2);
    }
    return new __PRIVATE_SetMutation(i, s, n, r2);
  }
  if (t.delete) {
    const r3 = fromName(e, t.delete);
    return new __PRIVATE_DeleteMutation(r3, n);
  }
  if (t.verify) {
    const r3 = fromName(e, t.verify);
    return new __PRIVATE_VerifyMutation(r3, n);
  }
  return fail();
}
function __PRIVATE_fromWriteResults(e, t) {
  return e && e.length > 0 ? (__PRIVATE_hardAssert(void 0 !== t), e.map((e2) => function __PRIVATE_fromWriteResult(e3, t2) {
    let n = e3.updateTime ? __PRIVATE_fromVersion(e3.updateTime) : __PRIVATE_fromVersion(t2);
    return n.isEqual(SnapshotVersion.min()) && // The Firestore Emulator currently returns an update time of 0 for
    // deletes of non-existing documents (rather than null). This breaks the
    // test "get deleted doc while offline with source=cache" as NoDocuments
    // with version 0 are filtered by IndexedDb's RemoteDocumentCache.
    // TODO(#2149): Remove this when Emulator is fixed
    (n = __PRIVATE_fromVersion(t2)), new MutationResult(n, e3.transformResults || []);
  }(e2, t))) : [];
}
function __PRIVATE_toDocumentsTarget(e, t) {
  return {
    documents: [__PRIVATE_toQueryPath(e, t.path)]
  };
}
function __PRIVATE_toQueryTarget(e, t) {
  const n = {
    structuredQuery: {}
  }, r2 = t.path;
  null !== t.collectionGroup ? (n.parent = __PRIVATE_toQueryPath(e, r2), n.structuredQuery.from = [{
    collectionId: t.collectionGroup,
    allDescendants: true
  }]) : (n.parent = __PRIVATE_toQueryPath(e, r2.popLast()), n.structuredQuery.from = [{
    collectionId: r2.lastSegment()
  }]);
  const i = function __PRIVATE_toFilters(e2) {
    if (0 === e2.length)
      return;
    return __PRIVATE_toFilter(CompositeFilter.create(
      e2,
      "and"
      /* CompositeOperator.AND */
    ));
  }(t.filters);
  i && (n.structuredQuery.where = i);
  const s = function __PRIVATE_toOrder(e2) {
    if (0 === e2.length)
      return;
    return e2.map((e3) => (
      // visible for testing
      function __PRIVATE_toPropertyOrder(e4) {
        return {
          field: __PRIVATE_toFieldPathReference(e4.field),
          direction: __PRIVATE_toDirection(e4.dir)
        };
      }(e3)
    ));
  }(t.orderBy);
  s && (n.structuredQuery.orderBy = s);
  const o = __PRIVATE_toInt32Proto(e, t.limit);
  return null !== o && (n.structuredQuery.limit = o), t.startAt && (n.structuredQuery.startAt = function __PRIVATE_toStartAtCursor(e2) {
    return {
      before: e2.inclusive,
      values: e2.position
    };
  }(t.startAt)), t.endAt && (n.structuredQuery.endAt = function __PRIVATE_toEndAtCursor(e2) {
    return {
      before: !e2.inclusive,
      values: e2.position
    };
  }(t.endAt)), n;
}
function __PRIVATE_convertQueryTargetToQuery(e) {
  let t = __PRIVATE_fromQueryPath(e.parent);
  const n = e.structuredQuery, r2 = n.from ? n.from.length : 0;
  let i = null;
  if (r2 > 0) {
    __PRIVATE_hardAssert(1 === r2);
    const e2 = n.from[0];
    e2.allDescendants ? i = e2.collectionId : t = t.child(e2.collectionId);
  }
  let s = [];
  n.where && (s = function __PRIVATE_fromFilters(e2) {
    const t2 = __PRIVATE_fromFilter(e2);
    if (t2 instanceof CompositeFilter && __PRIVATE_compositeFilterIsFlatConjunction(t2))
      return t2.getFilters();
    return [t2];
  }(n.where));
  let o = [];
  n.orderBy && (o = function __PRIVATE_fromOrder(e2) {
    return e2.map((e3) => function __PRIVATE_fromPropertyOrder(e4) {
      return new OrderBy(
        __PRIVATE_fromFieldPathReference(e4.field),
        // visible for testing
        function __PRIVATE_fromDirection(e5) {
          switch (e5) {
            case "ASCENDING":
              return "asc";
            case "DESCENDING":
              return "desc";
            default:
              return;
          }
        }(e4.direction)
      );
    }(e3));
  }(n.orderBy));
  let _ = null;
  n.limit && (_ = function __PRIVATE_fromInt32Proto(e2) {
    let t2;
    return t2 = "object" == typeof e2 ? e2.value : e2, __PRIVATE_isNullOrUndefined(t2) ? null : t2;
  }(n.limit));
  let a = null;
  n.startAt && (a = function __PRIVATE_fromStartAtCursor(e2) {
    const t2 = !!e2.before, n2 = e2.values || [];
    return new Bound(n2, t2);
  }(n.startAt));
  let u = null;
  return n.endAt && (u = function __PRIVATE_fromEndAtCursor(e2) {
    const t2 = !e2.before, n2 = e2.values || [];
    return new Bound(n2, t2);
  }(n.endAt)), __PRIVATE_newQuery(t, i, o, s, _, "F", a, u);
}
function __PRIVATE_toListenRequestLabels(e, t) {
  const n = function __PRIVATE_toLabel(e2) {
    switch (e2) {
      case "TargetPurposeListen":
        return null;
      case "TargetPurposeExistenceFilterMismatch":
        return "existence-filter-mismatch";
      case "TargetPurposeExistenceFilterMismatchBloom":
        return "existence-filter-mismatch-bloom";
      case "TargetPurposeLimboResolution":
        return "limbo-document";
      default:
        return fail();
    }
  }(t.purpose);
  return null == n ? null : {
    "goog-listen-tags": n
  };
}
function __PRIVATE_fromFilter(e) {
  return void 0 !== e.unaryFilter ? function __PRIVATE_fromUnaryFilter(e2) {
    switch (e2.unaryFilter.op) {
      case "IS_NAN":
        const t = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(t, "==", {
          doubleValue: NaN
        });
      case "IS_NULL":
        const n = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(n, "==", {
          nullValue: "NULL_VALUE"
        });
      case "IS_NOT_NAN":
        const r2 = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(r2, "!=", {
          doubleValue: NaN
        });
      case "IS_NOT_NULL":
        const i = __PRIVATE_fromFieldPathReference(e2.unaryFilter.field);
        return FieldFilter.create(i, "!=", {
          nullValue: "NULL_VALUE"
        });
      default:
        return fail();
    }
  }(e) : void 0 !== e.fieldFilter ? function __PRIVATE_fromFieldFilter(e2) {
    return FieldFilter.create(__PRIVATE_fromFieldPathReference(e2.fieldFilter.field), function __PRIVATE_fromOperatorName(e3) {
      switch (e3) {
        case "EQUAL":
          return "==";
        case "NOT_EQUAL":
          return "!=";
        case "GREATER_THAN":
          return ">";
        case "GREATER_THAN_OR_EQUAL":
          return ">=";
        case "LESS_THAN":
          return "<";
        case "LESS_THAN_OR_EQUAL":
          return "<=";
        case "ARRAY_CONTAINS":
          return "array-contains";
        case "IN":
          return "in";
        case "NOT_IN":
          return "not-in";
        case "ARRAY_CONTAINS_ANY":
          return "array-contains-any";
        default:
          return fail();
      }
    }(e2.fieldFilter.op), e2.fieldFilter.value);
  }(e) : void 0 !== e.compositeFilter ? function __PRIVATE_fromCompositeFilter(e2) {
    return CompositeFilter.create(e2.compositeFilter.filters.map((e3) => __PRIVATE_fromFilter(e3)), function __PRIVATE_fromCompositeOperatorName(e3) {
      switch (e3) {
        case "AND":
          return "and";
        case "OR":
          return "or";
        default:
          return fail();
      }
    }(e2.compositeFilter.op));
  }(e) : fail();
}
function __PRIVATE_toDirection(e) {
  return he[e];
}
function __PRIVATE_toOperatorName(e) {
  return Pe[e];
}
function __PRIVATE_toCompositeOperatorName(e) {
  return Ie[e];
}
function __PRIVATE_toFieldPathReference(e) {
  return {
    fieldPath: e.canonicalString()
  };
}
function __PRIVATE_fromFieldPathReference(e) {
  return FieldPath$1.fromServerFormat(e.fieldPath);
}
function __PRIVATE_toFilter(e) {
  return e instanceof FieldFilter ? function __PRIVATE_toUnaryOrFieldFilter(e2) {
    if ("==" === e2.op) {
      if (__PRIVATE_isNanValue(e2.value))
        return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e2.field),
            op: "IS_NAN"
          }
        };
      if (__PRIVATE_isNullValue(e2.value))
        return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e2.field),
            op: "IS_NULL"
          }
        };
    } else if ("!=" === e2.op) {
      if (__PRIVATE_isNanValue(e2.value))
        return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e2.field),
            op: "IS_NOT_NAN"
          }
        };
      if (__PRIVATE_isNullValue(e2.value))
        return {
          unaryFilter: {
            field: __PRIVATE_toFieldPathReference(e2.field),
            op: "IS_NOT_NULL"
          }
        };
    }
    return {
      fieldFilter: {
        field: __PRIVATE_toFieldPathReference(e2.field),
        op: __PRIVATE_toOperatorName(e2.op),
        value: e2.value
      }
    };
  }(e) : e instanceof CompositeFilter ? function __PRIVATE_toCompositeFilter(e2) {
    const t = e2.getFilters().map((e3) => __PRIVATE_toFilter(e3));
    if (1 === t.length)
      return t[0];
    return {
      compositeFilter: {
        op: __PRIVATE_toCompositeOperatorName(e2.op),
        filters: t
      }
    };
  }(e) : fail();
}
function __PRIVATE_toDocumentMask(e) {
  const t = [];
  return e.fields.forEach((e2) => t.push(e2.canonicalString())), {
    fieldPaths: t
  };
}
function __PRIVATE_isValidResourceName(e) {
  return e.length >= 4 && "projects" === e.get(0) && "databases" === e.get(2);
}
var TargetData = class _TargetData {
  constructor(e, t, n, r2, i = SnapshotVersion.min(), s = SnapshotVersion.min(), o = ByteString.EMPTY_BYTE_STRING, _ = null) {
    this.target = e, this.targetId = t, this.purpose = n, this.sequenceNumber = r2, this.snapshotVersion = i, this.lastLimboFreeSnapshotVersion = s, this.resumeToken = o, this.expectedCount = _;
  }
  /** Creates a new target data instance with an updated sequence number. */
  withSequenceNumber(e) {
    return new _TargetData(this.target, this.targetId, this.purpose, e, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, this.expectedCount);
  }
  /**
   * Creates a new target data instance with an updated resume token and
   * snapshot version.
   */
  withResumeToken(e, t) {
    return new _TargetData(
      this.target,
      this.targetId,
      this.purpose,
      this.sequenceNumber,
      t,
      this.lastLimboFreeSnapshotVersion,
      e,
      /* expectedCount= */
      null
    );
  }
  /**
   * Creates a new target data instance with an updated expected count.
   */
  withExpectedCount(e) {
    return new _TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, this.lastLimboFreeSnapshotVersion, this.resumeToken, e);
  }
  /**
   * Creates a new target data instance with an updated last limbo free
   * snapshot version number.
   */
  withLastLimboFreeSnapshotVersion(e) {
    return new _TargetData(this.target, this.targetId, this.purpose, this.sequenceNumber, this.snapshotVersion, e, this.resumeToken, this.expectedCount);
  }
};
var __PRIVATE_LocalSerializer = class {
  constructor(e) {
    this.ut = e;
  }
};
function __PRIVATE_fromDbRemoteDocument(e, t) {
  let n;
  if (t.document)
    n = __PRIVATE_fromDocument(e.ut, t.document, !!t.hasCommittedMutations);
  else if (t.noDocument) {
    const e2 = DocumentKey.fromSegments(t.noDocument.path), r2 = __PRIVATE_fromDbTimestamp(t.noDocument.readTime);
    n = MutableDocument.newNoDocument(e2, r2), t.hasCommittedMutations && n.setHasCommittedMutations();
  } else {
    if (!t.unknownDocument)
      return fail();
    {
      const e2 = DocumentKey.fromSegments(t.unknownDocument.path), r2 = __PRIVATE_fromDbTimestamp(t.unknownDocument.version);
      n = MutableDocument.newUnknownDocument(e2, r2);
    }
  }
  return t.readTime && n.setReadTime(function __PRIVATE_fromDbTimestampKey(e2) {
    const t2 = new Timestamp(e2[0], e2[1]);
    return SnapshotVersion.fromTimestamp(t2);
  }(t.readTime)), n;
}
function __PRIVATE_toDbRemoteDocument(e, t) {
  const n = t.key, r2 = {
    prefixPath: n.getCollectionPath().popLast().toArray(),
    collectionGroup: n.collectionGroup,
    documentId: n.path.lastSegment(),
    readTime: __PRIVATE_toDbTimestampKey(t.readTime),
    hasCommittedMutations: t.hasCommittedMutations
  };
  if (t.isFoundDocument())
    r2.document = function __PRIVATE_toDocument(e2, t2) {
      return {
        name: __PRIVATE_toName(e2, t2.key),
        fields: t2.data.value.mapValue.fields,
        updateTime: toTimestamp(e2, t2.version.toTimestamp()),
        createTime: toTimestamp(e2, t2.createTime.toTimestamp())
      };
    }(e.ut, t);
  else if (t.isNoDocument())
    r2.noDocument = {
      path: n.path.toArray(),
      readTime: __PRIVATE_toDbTimestamp(t.version)
    };
  else {
    if (!t.isUnknownDocument())
      return fail();
    r2.unknownDocument = {
      path: n.path.toArray(),
      version: __PRIVATE_toDbTimestamp(t.version)
    };
  }
  return r2;
}
function __PRIVATE_toDbTimestampKey(e) {
  const t = e.toTimestamp();
  return [t.seconds, t.nanoseconds];
}
function __PRIVATE_toDbTimestamp(e) {
  const t = e.toTimestamp();
  return {
    seconds: t.seconds,
    nanoseconds: t.nanoseconds
  };
}
function __PRIVATE_fromDbTimestamp(e) {
  const t = new Timestamp(e.seconds, e.nanoseconds);
  return SnapshotVersion.fromTimestamp(t);
}
function __PRIVATE_fromDbMutationBatch(e, t) {
  const n = (t.baseMutations || []).map((t2) => __PRIVATE_fromMutation(e.ut, t2));
  for (let e2 = 0; e2 < t.mutations.length - 1; ++e2) {
    const n2 = t.mutations[e2];
    if (e2 + 1 < t.mutations.length && void 0 !== t.mutations[e2 + 1].transform) {
      const r3 = t.mutations[e2 + 1];
      n2.updateTransforms = r3.transform.fieldTransforms, t.mutations.splice(e2 + 1, 1), ++e2;
    }
  }
  const r2 = t.mutations.map((t2) => __PRIVATE_fromMutation(e.ut, t2)), i = Timestamp.fromMillis(t.localWriteTimeMs);
  return new MutationBatch(t.batchId, i, n, r2);
}
function __PRIVATE_fromDbTarget(e) {
  const t = __PRIVATE_fromDbTimestamp(e.readTime), n = void 0 !== e.lastLimboFreeSnapshotVersion ? __PRIVATE_fromDbTimestamp(e.lastLimboFreeSnapshotVersion) : SnapshotVersion.min();
  let r2;
  return r2 = /**
  * A helper function for figuring out what kind of query has been stored.
  */
  function __PRIVATE_isDocumentQuery(e2) {
    return void 0 !== e2.documents;
  }(e.query) ? function __PRIVATE_fromDocumentsTarget(e2) {
    return __PRIVATE_hardAssert(1 === e2.documents.length), __PRIVATE_queryToTarget(__PRIVATE_newQueryForPath(__PRIVATE_fromQueryPath(e2.documents[0])));
  }(e.query) : function __PRIVATE_fromQueryTarget(e2) {
    return __PRIVATE_queryToTarget(__PRIVATE_convertQueryTargetToQuery(e2));
  }(e.query), new TargetData(r2, e.targetId, "TargetPurposeListen", e.lastListenSequenceNumber, t, n, ByteString.fromBase64String(e.resumeToken));
}
function __PRIVATE_toDbTarget(e, t) {
  const n = __PRIVATE_toDbTimestamp(t.snapshotVersion), r2 = __PRIVATE_toDbTimestamp(t.lastLimboFreeSnapshotVersion);
  let i;
  i = __PRIVATE_targetIsDocumentTarget(t.target) ? __PRIVATE_toDocumentsTarget(e.ut, t.target) : __PRIVATE_toQueryTarget(e.ut, t.target);
  const s = t.resumeToken.toBase64();
  return {
    targetId: t.targetId,
    canonicalId: __PRIVATE_canonifyTarget(t.target),
    readTime: n,
    resumeToken: s,
    lastListenSequenceNumber: t.sequenceNumber,
    lastLimboFreeSnapshotVersion: r2,
    query: i
  };
}
function __PRIVATE_fromBundledQuery(e) {
  const t = __PRIVATE_convertQueryTargetToQuery({
    parent: e.parent,
    structuredQuery: e.structuredQuery
  });
  return "LAST" === e.limitType ? __PRIVATE_queryWithLimit(
    t,
    t.limit,
    "L"
    /* LimitType.Last */
  ) : t;
}
function __PRIVATE_fromDbDocumentOverlay(e, t) {
  return new Overlay(t.largestBatchId, __PRIVATE_fromMutation(e.ut, t.overlayMutation));
}
function __PRIVATE_toDbDocumentOverlayKey(e, t) {
  const n = t.path.lastSegment();
  return [e, __PRIVATE_encodeResourcePath(t.path.popLast()), n];
}
function __PRIVATE_toDbIndexState(e, t, n, r2) {
  return {
    indexId: e,
    uid: t.uid || "",
    sequenceNumber: n,
    readTime: __PRIVATE_toDbTimestamp(r2.readTime),
    documentKey: __PRIVATE_encodeResourcePath(r2.documentKey.path),
    largestBatchId: r2.largestBatchId
  };
}
var __PRIVATE_IndexedDbBundleCache = class {
  getBundleMetadata(e, t) {
    return __PRIVATE_bundlesStore(e).get(t).next((e2) => {
      if (e2)
        return function __PRIVATE_fromDbBundle(e3) {
          return {
            id: e3.bundleId,
            createTime: __PRIVATE_fromDbTimestamp(e3.createTime),
            version: e3.version
          };
        }(e2);
    });
  }
  saveBundleMetadata(e, t) {
    return __PRIVATE_bundlesStore(e).put(function __PRIVATE_toDbBundle(e2) {
      return {
        bundleId: e2.id,
        createTime: __PRIVATE_toDbTimestamp(__PRIVATE_fromVersion(e2.createTime)),
        version: e2.version
      };
    }(t));
  }
  getNamedQuery(e, t) {
    return __PRIVATE_namedQueriesStore(e).get(t).next((e2) => {
      if (e2)
        return function __PRIVATE_fromDbNamedQuery(e3) {
          return {
            name: e3.name,
            query: __PRIVATE_fromBundledQuery(e3.bundledQuery),
            readTime: __PRIVATE_fromDbTimestamp(e3.readTime)
          };
        }(e2);
    });
  }
  saveNamedQuery(e, t) {
    return __PRIVATE_namedQueriesStore(e).put(function __PRIVATE_toDbNamedQuery(e2) {
      return {
        name: e2.name,
        readTime: __PRIVATE_toDbTimestamp(__PRIVATE_fromVersion(e2.readTime)),
        bundledQuery: e2.bundledQuery
      };
    }(t));
  }
};
function __PRIVATE_bundlesStore(e) {
  return __PRIVATE_getStore(e, "bundles");
}
function __PRIVATE_namedQueriesStore(e) {
  return __PRIVATE_getStore(e, "namedQueries");
}
var __PRIVATE_IndexedDbDocumentOverlayCache = class ___PRIVATE_IndexedDbDocumentOverlayCache {
  /**
   * @param serializer - The document serializer.
   * @param userId - The userId for which we are accessing overlays.
   */
  constructor(e, t) {
    this.serializer = e, this.userId = t;
  }
  static ct(e, t) {
    const n = t.uid || "";
    return new ___PRIVATE_IndexedDbDocumentOverlayCache(e, n);
  }
  getOverlay(e, t) {
    return __PRIVATE_documentOverlayStore(e).get(__PRIVATE_toDbDocumentOverlayKey(this.userId, t)).next((e2) => e2 ? __PRIVATE_fromDbDocumentOverlay(this.serializer, e2) : null);
  }
  getOverlays(e, t) {
    const n = __PRIVATE_newOverlayMap();
    return PersistencePromise.forEach(t, (t2) => this.getOverlay(e, t2).next((e2) => {
      null !== e2 && n.set(t2, e2);
    })).next(() => n);
  }
  saveOverlays(e, t, n) {
    const r2 = [];
    return n.forEach((n2, i) => {
      const s = new Overlay(t, i);
      r2.push(this.lt(e, s));
    }), PersistencePromise.waitFor(r2);
  }
  removeOverlaysForBatchId(e, t, n) {
    const r2 = /* @__PURE__ */ new Set();
    t.forEach((e2) => r2.add(__PRIVATE_encodeResourcePath(e2.getCollectionPath())));
    const i = [];
    return r2.forEach((t2) => {
      const r3 = IDBKeyRange.bound(
        [this.userId, t2, n],
        [this.userId, t2, n + 1],
        /*lowerOpen=*/
        false,
        /*upperOpen=*/
        true
      );
      i.push(__PRIVATE_documentOverlayStore(e).H("collectionPathOverlayIndex", r3));
    }), PersistencePromise.waitFor(i);
  }
  getOverlaysForCollection(e, t, n) {
    const r2 = __PRIVATE_newOverlayMap(), i = __PRIVATE_encodeResourcePath(t), s = IDBKeyRange.bound(
      [this.userId, i, n],
      [this.userId, i, Number.POSITIVE_INFINITY],
      /*lowerOpen=*/
      true
    );
    return __PRIVATE_documentOverlayStore(e).W("collectionPathOverlayIndex", s).next((e2) => {
      for (const t2 of e2) {
        const e3 = __PRIVATE_fromDbDocumentOverlay(this.serializer, t2);
        r2.set(e3.getKey(), e3);
      }
      return r2;
    });
  }
  getOverlaysForCollectionGroup(e, t, n, r2) {
    const i = __PRIVATE_newOverlayMap();
    let s;
    const o = IDBKeyRange.bound(
      [this.userId, t, n],
      [this.userId, t, Number.POSITIVE_INFINITY],
      /*lowerOpen=*/
      true
    );
    return __PRIVATE_documentOverlayStore(e).Y({
      index: "collectionGroupOverlayIndex",
      range: o
    }, (e2, t2, n2) => {
      const o2 = __PRIVATE_fromDbDocumentOverlay(this.serializer, t2);
      i.size() < r2 || o2.largestBatchId === s ? (i.set(o2.getKey(), o2), s = o2.largestBatchId) : n2.done();
    }).next(() => i);
  }
  lt(e, t) {
    return __PRIVATE_documentOverlayStore(e).put(function __PRIVATE_toDbDocumentOverlay(e2, t2, n) {
      const [r2, i, s] = __PRIVATE_toDbDocumentOverlayKey(t2, n.mutation.key);
      return {
        userId: t2,
        collectionPath: i,
        documentId: s,
        collectionGroup: n.mutation.key.getCollectionGroup(),
        largestBatchId: n.largestBatchId,
        overlayMutation: toMutation(e2.ut, n.mutation)
      };
    }(this.serializer, this.userId, t));
  }
};
function __PRIVATE_documentOverlayStore(e) {
  return __PRIVATE_getStore(e, "documentOverlays");
}
var __PRIVATE_FirestoreIndexValueWriter = class {
  constructor() {
  }
  // The write methods below short-circuit writing terminators for values
  // containing a (terminating) truncated value.
  // As an example, consider the resulting encoding for:
  // ["bar", [2, "foo"]] -> (STRING, "bar", TERM, ARRAY, NUMBER, 2, STRING, "foo", TERM, TERM, TERM)
  // ["bar", [2, truncated("foo")]] -> (STRING, "bar", TERM, ARRAY, NUMBER, 2, STRING, "foo", TRUNC)
  // ["bar", truncated(["foo"])] -> (STRING, "bar", TERM, ARRAY. STRING, "foo", TERM, TRUNC)
  /** Writes an index value.  */
  ht(e, t) {
    this.Pt(e, t), // Write separator to split index values
    // (see go/firestore-storage-format#encodings).
    t.It();
  }
  Pt(e, t) {
    if ("nullValue" in e)
      this.Tt(t, 5);
    else if ("booleanValue" in e)
      this.Tt(t, 10), t.Et(e.booleanValue ? 1 : 0);
    else if ("integerValue" in e)
      this.Tt(t, 15), t.Et(__PRIVATE_normalizeNumber(e.integerValue));
    else if ("doubleValue" in e) {
      const n = __PRIVATE_normalizeNumber(e.doubleValue);
      isNaN(n) ? this.Tt(t, 13) : (this.Tt(t, 15), __PRIVATE_isNegativeZero(n) ? (
        // -0.0, 0 and 0.0 are all considered the same
        t.Et(0)
      ) : t.Et(n));
    } else if ("timestampValue" in e) {
      const n = e.timestampValue;
      this.Tt(t, 20), "string" == typeof n ? t.dt(n) : (t.dt(`${n.seconds || ""}`), t.Et(n.nanos || 0));
    } else if ("stringValue" in e)
      this.At(e.stringValue, t), this.Rt(t);
    else if ("bytesValue" in e)
      this.Tt(t, 30), t.Vt(__PRIVATE_normalizeByteString(e.bytesValue)), this.Rt(t);
    else if ("referenceValue" in e)
      this.ft(e.referenceValue, t);
    else if ("geoPointValue" in e) {
      const n = e.geoPointValue;
      this.Tt(t, 45), t.Et(n.latitude || 0), t.Et(n.longitude || 0);
    } else
      "mapValue" in e ? __PRIVATE_isMaxValue(e) ? this.Tt(t, Number.MAX_SAFE_INTEGER) : (this.gt(e.mapValue, t), this.Rt(t)) : "arrayValue" in e ? (this.yt(e.arrayValue, t), this.Rt(t)) : fail();
  }
  At(e, t) {
    this.Tt(t, 25), this.wt(e, t);
  }
  wt(e, t) {
    t.dt(e);
  }
  gt(e, t) {
    const n = e.fields || {};
    this.Tt(t, 55);
    for (const e2 of Object.keys(n))
      this.At(e2, t), this.Pt(n[e2], t);
  }
  yt(e, t) {
    const n = e.values || [];
    this.Tt(t, 50);
    for (const e2 of n)
      this.Pt(e2, t);
  }
  ft(e, t) {
    this.Tt(t, 37);
    DocumentKey.fromName(e).path.forEach((e2) => {
      this.Tt(t, 60), this.wt(e2, t);
    });
  }
  Tt(e, t) {
    e.Et(t);
  }
  Rt(e) {
    e.Et(2);
  }
};
__PRIVATE_FirestoreIndexValueWriter.St = new __PRIVATE_FirestoreIndexValueWriter();
function __PRIVATE_numberOfLeadingZerosInByte(e) {
  if (0 === e)
    return 8;
  let t = 0;
  return e >> 4 == 0 && // Test if the first four bits are zero.
  (t += 4, e <<= 4), e >> 6 == 0 && // Test if the first two (or next two) bits are zero.
  (t += 2, e <<= 2), e >> 7 == 0 && // Test if the remaining bit is zero.
  (t += 1), t;
}
function __PRIVATE_unsignedNumLength(e) {
  const t = 64 - function __PRIVATE_numberOfLeadingZeros(e2) {
    let t2 = 0;
    for (let n = 0; n < 8; ++n) {
      const r2 = __PRIVATE_numberOfLeadingZerosInByte(255 & e2[n]);
      if (t2 += r2, 8 !== r2)
        break;
    }
    return t2;
  }(e);
  return Math.ceil(t / 8);
}
var __PRIVATE_OrderedCodeWriter = class {
  constructor() {
    this.buffer = new Uint8Array(1024), this.position = 0;
  }
  bt(e) {
    const t = e[Symbol.iterator]();
    let n = t.next();
    for (; !n.done; )
      this.Dt(n.value), n = t.next();
    this.Ct();
  }
  vt(e) {
    const t = e[Symbol.iterator]();
    let n = t.next();
    for (; !n.done; )
      this.Ft(n.value), n = t.next();
    this.Mt();
  }
  /** Writes utf8 bytes into this byte sequence, ascending. */
  xt(e) {
    for (const t of e) {
      const e2 = t.charCodeAt(0);
      if (e2 < 128)
        this.Dt(e2);
      else if (e2 < 2048)
        this.Dt(960 | e2 >>> 6), this.Dt(128 | 63 & e2);
      else if (t < "\uD800" || "\uDBFF" < t)
        this.Dt(480 | e2 >>> 12), this.Dt(128 | 63 & e2 >>> 6), this.Dt(128 | 63 & e2);
      else {
        const e3 = t.codePointAt(0);
        this.Dt(240 | e3 >>> 18), this.Dt(128 | 63 & e3 >>> 12), this.Dt(128 | 63 & e3 >>> 6), this.Dt(128 | 63 & e3);
      }
    }
    this.Ct();
  }
  /** Writes utf8 bytes into this byte sequence, descending */
  Ot(e) {
    for (const t of e) {
      const e2 = t.charCodeAt(0);
      if (e2 < 128)
        this.Ft(e2);
      else if (e2 < 2048)
        this.Ft(960 | e2 >>> 6), this.Ft(128 | 63 & e2);
      else if (t < "\uD800" || "\uDBFF" < t)
        this.Ft(480 | e2 >>> 12), this.Ft(128 | 63 & e2 >>> 6), this.Ft(128 | 63 & e2);
      else {
        const e3 = t.codePointAt(0);
        this.Ft(240 | e3 >>> 18), this.Ft(128 | 63 & e3 >>> 12), this.Ft(128 | 63 & e3 >>> 6), this.Ft(128 | 63 & e3);
      }
    }
    this.Mt();
  }
  Nt(e) {
    const t = this.Bt(e), n = __PRIVATE_unsignedNumLength(t);
    this.Lt(1 + n), this.buffer[this.position++] = 255 & n;
    for (let e2 = t.length - n; e2 < t.length; ++e2)
      this.buffer[this.position++] = 255 & t[e2];
  }
  kt(e) {
    const t = this.Bt(e), n = __PRIVATE_unsignedNumLength(t);
    this.Lt(1 + n), this.buffer[this.position++] = ~(255 & n);
    for (let e2 = t.length - n; e2 < t.length; ++e2)
      this.buffer[this.position++] = ~(255 & t[e2]);
  }
  /**
   * Writes the "infinity" byte sequence that sorts after all other byte
   * sequences written in ascending order.
   */
  qt() {
    this.Qt(255), this.Qt(255);
  }
  /**
   * Writes the "infinity" byte sequence that sorts before all other byte
   * sequences written in descending order.
   */
  Kt() {
    this.$t(255), this.$t(255);
  }
  /**
   * Resets the buffer such that it is the same as when it was newly
   * constructed.
   */
  reset() {
    this.position = 0;
  }
  seed(e) {
    this.Lt(e.length), this.buffer.set(e, this.position), this.position += e.length;
  }
  /** Makes a copy of the encoded bytes in this buffer.  */
  Ut() {
    return this.buffer.slice(0, this.position);
  }
  /**
   * Encodes `val` into an encoding so that the order matches the IEEE 754
   * floating-point comparison results with the following exceptions:
   *   -0.0 < 0.0
   *   all non-NaN < NaN
   *   NaN = NaN
   */
  Bt(e) {
    const t = (
      /** Converts a JavaScript number to a byte array (using big endian encoding). */
      function __PRIVATE_doubleToLongBits(e2) {
        const t2 = new DataView(new ArrayBuffer(8));
        return t2.setFloat64(
          0,
          e2,
          /* littleEndian= */
          false
        ), new Uint8Array(t2.buffer);
      }(e)
    ), n = 0 != (128 & t[0]);
    t[0] ^= n ? 255 : 128;
    for (let e2 = 1; e2 < t.length; ++e2)
      t[e2] ^= n ? 255 : 0;
    return t;
  }
  /** Writes a single byte ascending to the buffer. */
  Dt(e) {
    const t = 255 & e;
    0 === t ? (this.Qt(0), this.Qt(255)) : 255 === t ? (this.Qt(255), this.Qt(0)) : this.Qt(t);
  }
  /** Writes a single byte descending to the buffer.  */
  Ft(e) {
    const t = 255 & e;
    0 === t ? (this.$t(0), this.$t(255)) : 255 === t ? (this.$t(255), this.$t(0)) : this.$t(e);
  }
  Ct() {
    this.Qt(0), this.Qt(1);
  }
  Mt() {
    this.$t(0), this.$t(1);
  }
  Qt(e) {
    this.Lt(1), this.buffer[this.position++] = e;
  }
  $t(e) {
    this.Lt(1), this.buffer[this.position++] = ~e;
  }
  Lt(e) {
    const t = e + this.position;
    if (t <= this.buffer.length)
      return;
    let n = 2 * this.buffer.length;
    n < t && (n = t);
    const r2 = new Uint8Array(n);
    r2.set(this.buffer), // copy old data
    this.buffer = r2;
  }
};
var __PRIVATE_AscendingIndexByteEncoder = class {
  constructor(e) {
    this.Wt = e;
  }
  Vt(e) {
    this.Wt.bt(e);
  }
  dt(e) {
    this.Wt.xt(e);
  }
  Et(e) {
    this.Wt.Nt(e);
  }
  It() {
    this.Wt.qt();
  }
};
var __PRIVATE_DescendingIndexByteEncoder = class {
  constructor(e) {
    this.Wt = e;
  }
  Vt(e) {
    this.Wt.vt(e);
  }
  dt(e) {
    this.Wt.Ot(e);
  }
  Et(e) {
    this.Wt.kt(e);
  }
  It() {
    this.Wt.Kt();
  }
};
var __PRIVATE_IndexByteEncoder = class {
  constructor() {
    this.Wt = new __PRIVATE_OrderedCodeWriter(), this.Gt = new __PRIVATE_AscendingIndexByteEncoder(this.Wt), this.zt = new __PRIVATE_DescendingIndexByteEncoder(this.Wt);
  }
  seed(e) {
    this.Wt.seed(e);
  }
  jt(e) {
    return 0 === e ? this.Gt : this.zt;
  }
  Ut() {
    return this.Wt.Ut();
  }
  reset() {
    this.Wt.reset();
  }
};
var __PRIVATE_IndexEntry = class ___PRIVATE_IndexEntry {
  constructor(e, t, n, r2) {
    this.indexId = e, this.documentKey = t, this.arrayValue = n, this.directionalValue = r2;
  }
  /**
   * Returns an IndexEntry entry that sorts immediately after the current
   * directional value.
   */
  Ht() {
    const e = this.directionalValue.length, t = 0 === e || 255 === this.directionalValue[e - 1] ? e + 1 : e, n = new Uint8Array(t);
    return n.set(this.directionalValue, 0), t !== e ? n.set([0], this.directionalValue.length) : ++n[n.length - 1], new ___PRIVATE_IndexEntry(this.indexId, this.documentKey, this.arrayValue, n);
  }
};
function __PRIVATE_indexEntryComparator(e, t) {
  let n = e.indexId - t.indexId;
  return 0 !== n ? n : (n = __PRIVATE_compareByteArrays(e.arrayValue, t.arrayValue), 0 !== n ? n : (n = __PRIVATE_compareByteArrays(e.directionalValue, t.directionalValue), 0 !== n ? n : DocumentKey.comparator(e.documentKey, t.documentKey)));
}
function __PRIVATE_compareByteArrays(e, t) {
  for (let n = 0; n < e.length && n < t.length; ++n) {
    const r2 = e[n] - t[n];
    if (0 !== r2)
      return r2;
  }
  return e.length - t.length;
}
var __PRIVATE_TargetIndexMatcher = class {
  constructor(e) {
    this.Jt = new SortedSet((e2, t) => FieldPath$1.comparator(e2.field, t.field)), this.collectionId = null != e.collectionGroup ? e.collectionGroup : e.path.lastSegment(), this.Yt = e.orderBy, this.Zt = [];
    for (const t of e.filters) {
      const e2 = t;
      e2.isInequality() ? this.Jt = this.Jt.add(e2) : this.Zt.push(e2);
    }
  }
  get Xt() {
    return this.Jt.size > 1;
  }
  /**
   * Returns whether the index can be used to serve the TargetIndexMatcher's
   * target.
   *
   * An index is considered capable of serving the target when:
   * - The target uses all index segments for its filters and orderBy clauses.
   *   The target can have additional filter and orderBy clauses, but not
   *   fewer.
   * - If an ArrayContains/ArrayContainsAnyfilter is used, the index must also
   *   have a corresponding `CONTAINS` segment.
   * - All directional index segments can be mapped to the target as a series of
   *   equality filters, a single inequality filter and a series of orderBy
   *   clauses.
   * - The segments that represent the equality filters may appear out of order.
   * - The optional segment for the inequality filter must appear after all
   *   equality segments.
   * - The segments that represent that orderBy clause of the target must appear
   *   in order after all equality and inequality segments. Single orderBy
   *   clauses cannot be skipped, but a continuous orderBy suffix may be
   *   omitted.
   */
  en(e) {
    if (__PRIVATE_hardAssert(e.collectionGroup === this.collectionId), this.Xt)
      return false;
    const t = __PRIVATE_fieldIndexGetArraySegment(e);
    if (void 0 !== t && !this.tn(t))
      return false;
    const n = __PRIVATE_fieldIndexGetDirectionalSegments(e);
    let r2 = /* @__PURE__ */ new Set(), i = 0, s = 0;
    for (; i < n.length && this.tn(n[i]); ++i)
      r2 = r2.add(n[i].fieldPath.canonicalString());
    if (i === n.length)
      return true;
    if (this.Jt.size > 0) {
      const e2 = this.Jt.getIterator().getNext();
      if (!r2.has(e2.field.canonicalString())) {
        const t2 = n[i];
        if (!this.nn(e2, t2) || !this.rn(this.Yt[s++], t2))
          return false;
      }
      ++i;
    }
    for (; i < n.length; ++i) {
      const e2 = n[i];
      if (s >= this.Yt.length || !this.rn(this.Yt[s++], e2))
        return false;
    }
    return true;
  }
  /**
   * Returns a full matched field index for this target. Currently multiple
   * inequality query is not supported so function returns null.
   */
  sn() {
    if (this.Xt)
      return null;
    let e = new SortedSet(FieldPath$1.comparator);
    const t = [];
    for (const n of this.Zt) {
      if (n.field.isKeyField())
        continue;
      if ("array-contains" === n.op || "array-contains-any" === n.op)
        t.push(new IndexSegment(
          n.field,
          2
          /* IndexKind.CONTAINS */
        ));
      else {
        if (e.has(n.field))
          continue;
        e = e.add(n.field), t.push(new IndexSegment(
          n.field,
          0
          /* IndexKind.ASCENDING */
        ));
      }
    }
    for (const n of this.Yt)
      n.field.isKeyField() || e.has(n.field) || (e = e.add(n.field), t.push(new IndexSegment(
        n.field,
        "asc" === n.dir ? 0 : 1
        /* IndexKind.DESCENDING */
      )));
    return new FieldIndex(FieldIndex.UNKNOWN_ID, this.collectionId, t, IndexState.empty());
  }
  tn(e) {
    for (const t of this.Zt)
      if (this.nn(t, e))
        return true;
    return false;
  }
  nn(e, t) {
    if (void 0 === e || !e.field.isEqual(t.fieldPath))
      return false;
    const n = "array-contains" === e.op || "array-contains-any" === e.op;
    return 2 === t.kind === n;
  }
  rn(e, t) {
    return !!e.field.isEqual(t.fieldPath) && (0 === t.kind && "asc" === e.dir || 1 === t.kind && "desc" === e.dir);
  }
};
function __PRIVATE_computeInExpansion(e) {
  var t, n;
  if (__PRIVATE_hardAssert(e instanceof FieldFilter || e instanceof CompositeFilter), e instanceof FieldFilter) {
    if (e instanceof __PRIVATE_InFilter) {
      const r3 = (null === (n = null === (t = e.value.arrayValue) || void 0 === t ? void 0 : t.values) || void 0 === n ? void 0 : n.map((t2) => FieldFilter.create(e.field, "==", t2))) || [];
      return CompositeFilter.create(
        r3,
        "or"
        /* CompositeOperator.OR */
      );
    }
    return e;
  }
  const r2 = e.filters.map((e2) => __PRIVATE_computeInExpansion(e2));
  return CompositeFilter.create(r2, e.op);
}
function __PRIVATE_getDnfTerms(e) {
  if (0 === e.getFilters().length)
    return [];
  const t = __PRIVATE_computeDistributedNormalForm(__PRIVATE_computeInExpansion(e));
  return __PRIVATE_hardAssert(__PRIVATE_isDisjunctiveNormalForm(t)), __PRIVATE_isSingleFieldFilter(t) || __PRIVATE_isFlatConjunction(t) ? [t] : t.getFilters();
}
function __PRIVATE_isSingleFieldFilter(e) {
  return e instanceof FieldFilter;
}
function __PRIVATE_isFlatConjunction(e) {
  return e instanceof CompositeFilter && __PRIVATE_compositeFilterIsFlatConjunction(e);
}
function __PRIVATE_isDisjunctiveNormalForm(e) {
  return __PRIVATE_isSingleFieldFilter(e) || __PRIVATE_isFlatConjunction(e) || /**
  * Returns true if the given filter is the disjunction of one or more "flat conjunctions" and
  * field filters. e.g. (a == 10) || (b==20 && c==30)
  */
  function __PRIVATE_isDisjunctionOfFieldFiltersAndFlatConjunctions(e2) {
    if (e2 instanceof CompositeFilter && __PRIVATE_compositeFilterIsDisjunction(e2)) {
      for (const t of e2.getFilters())
        if (!__PRIVATE_isSingleFieldFilter(t) && !__PRIVATE_isFlatConjunction(t))
          return false;
      return true;
    }
    return false;
  }(e);
}
function __PRIVATE_computeDistributedNormalForm(e) {
  if (__PRIVATE_hardAssert(e instanceof FieldFilter || e instanceof CompositeFilter), e instanceof FieldFilter)
    return e;
  if (1 === e.filters.length)
    return __PRIVATE_computeDistributedNormalForm(e.filters[0]);
  const t = e.filters.map((e2) => __PRIVATE_computeDistributedNormalForm(e2));
  let n = CompositeFilter.create(t, e.op);
  return n = __PRIVATE_applyAssociation(n), __PRIVATE_isDisjunctiveNormalForm(n) ? n : (__PRIVATE_hardAssert(n instanceof CompositeFilter), __PRIVATE_hardAssert(__PRIVATE_compositeFilterIsConjunction(n)), __PRIVATE_hardAssert(n.filters.length > 1), n.filters.reduce((e2, t2) => __PRIVATE_applyDistribution(e2, t2)));
}
function __PRIVATE_applyDistribution(e, t) {
  let n;
  return __PRIVATE_hardAssert(e instanceof FieldFilter || e instanceof CompositeFilter), __PRIVATE_hardAssert(t instanceof FieldFilter || t instanceof CompositeFilter), // FieldFilter FieldFilter
  n = e instanceof FieldFilter ? t instanceof FieldFilter ? function __PRIVATE_applyDistributionFieldFilters(e2, t2) {
    return CompositeFilter.create(
      [e2, t2],
      "and"
      /* CompositeOperator.AND */
    );
  }(e, t) : __PRIVATE_applyDistributionFieldAndCompositeFilters(e, t) : t instanceof FieldFilter ? __PRIVATE_applyDistributionFieldAndCompositeFilters(t, e) : function __PRIVATE_applyDistributionCompositeFilters(e2, t2) {
    if (__PRIVATE_hardAssert(e2.filters.length > 0 && t2.filters.length > 0), __PRIVATE_compositeFilterIsConjunction(e2) && __PRIVATE_compositeFilterIsConjunction(t2))
      return __PRIVATE_compositeFilterWithAddedFilters(e2, t2.getFilters());
    const n2 = __PRIVATE_compositeFilterIsDisjunction(e2) ? e2 : t2, r2 = __PRIVATE_compositeFilterIsDisjunction(e2) ? t2 : e2, i = n2.filters.map((e3) => __PRIVATE_applyDistribution(e3, r2));
    return CompositeFilter.create(
      i,
      "or"
      /* CompositeOperator.OR */
    );
  }(e, t), __PRIVATE_applyAssociation(n);
}
function __PRIVATE_applyDistributionFieldAndCompositeFilters(e, t) {
  if (__PRIVATE_compositeFilterIsConjunction(t))
    return __PRIVATE_compositeFilterWithAddedFilters(t, e.getFilters());
  {
    const n = t.filters.map((t2) => __PRIVATE_applyDistribution(e, t2));
    return CompositeFilter.create(
      n,
      "or"
      /* CompositeOperator.OR */
    );
  }
}
function __PRIVATE_applyAssociation(e) {
  if (__PRIVATE_hardAssert(e instanceof FieldFilter || e instanceof CompositeFilter), e instanceof FieldFilter)
    return e;
  const t = e.getFilters();
  if (1 === t.length)
    return __PRIVATE_applyAssociation(t[0]);
  if (__PRIVATE_compositeFilterIsFlat(e))
    return e;
  const n = t.map((e2) => __PRIVATE_applyAssociation(e2)), r2 = [];
  return n.forEach((t2) => {
    t2 instanceof FieldFilter ? r2.push(t2) : t2 instanceof CompositeFilter && (t2.op === e.op ? (
      // compositeFilter: (A | (B | C))
      // compositeSubfilter: (B | C)
      // Result: (A | B | C)
      r2.push(...t2.filters)
    ) : (
      // compositeFilter: (A | (B & C))
      // compositeSubfilter: (B & C)
      // Result: (A | (B & C))
      r2.push(t2)
    ));
  }), 1 === r2.length ? r2[0] : CompositeFilter.create(r2, e.op);
}
var __PRIVATE_MemoryIndexManager = class {
  constructor() {
    this.on = new __PRIVATE_MemoryCollectionParentIndex();
  }
  addToCollectionParentIndex(e, t) {
    return this.on.add(t), PersistencePromise.resolve();
  }
  getCollectionParents(e, t) {
    return PersistencePromise.resolve(this.on.getEntries(t));
  }
  addFieldIndex(e, t) {
    return PersistencePromise.resolve();
  }
  deleteFieldIndex(e, t) {
    return PersistencePromise.resolve();
  }
  deleteAllFieldIndexes(e) {
    return PersistencePromise.resolve();
  }
  createTargetIndexes(e, t) {
    return PersistencePromise.resolve();
  }
  getDocumentsMatchingTarget(e, t) {
    return PersistencePromise.resolve(null);
  }
  getIndexType(e, t) {
    return PersistencePromise.resolve(
      0
      /* IndexType.NONE */
    );
  }
  getFieldIndexes(e, t) {
    return PersistencePromise.resolve([]);
  }
  getNextCollectionGroupToUpdate(e) {
    return PersistencePromise.resolve(null);
  }
  getMinOffset(e, t) {
    return PersistencePromise.resolve(IndexOffset.min());
  }
  getMinOffsetFromCollectionGroup(e, t) {
    return PersistencePromise.resolve(IndexOffset.min());
  }
  updateCollectionGroup(e, t, n) {
    return PersistencePromise.resolve();
  }
  updateIndexEntries(e, t) {
    return PersistencePromise.resolve();
  }
};
var __PRIVATE_MemoryCollectionParentIndex = class {
  constructor() {
    this.index = {};
  }
  // Returns false if the entry already existed.
  add(e) {
    const t = e.lastSegment(), n = e.popLast(), r2 = this.index[t] || new SortedSet(ResourcePath.comparator), i = !r2.has(n);
    return this.index[t] = r2.add(n), i;
  }
  has(e) {
    const t = e.lastSegment(), n = e.popLast(), r2 = this.index[t];
    return r2 && r2.has(n);
  }
  getEntries(e) {
    return (this.index[e] || new SortedSet(ResourcePath.comparator)).toArray();
  }
};
var Te = new Uint8Array(0);
var __PRIVATE_IndexedDbIndexManager = class {
  constructor(e, t) {
    this.user = e, this.databaseId = t, /**
     * An in-memory copy of the index entries we've already written since the SDK
     * launched. Used to avoid re-writing the same entry repeatedly.
     *
     * This is *NOT* a complete cache of what's in persistence and so can never be
     * used to satisfy reads.
     */
    this._n = new __PRIVATE_MemoryCollectionParentIndex(), /**
     * Maps from a target to its equivalent list of sub-targets. Each sub-target
     * contains only one term from the target's disjunctive normal form (DNF).
     */
    this.an = new ObjectMap((e2) => __PRIVATE_canonifyTarget(e2), (e2, t2) => __PRIVATE_targetEquals(e2, t2)), this.uid = e.uid || "";
  }
  /**
   * Adds a new entry to the collection parent index.
   *
   * Repeated calls for the same collectionPath should be avoided within a
   * transaction as IndexedDbIndexManager only caches writes once a transaction
   * has been committed.
   */
  addToCollectionParentIndex(e, t) {
    if (!this._n.has(t)) {
      const n = t.lastSegment(), r2 = t.popLast();
      e.addOnCommittedListener(() => {
        this._n.add(t);
      });
      const i = {
        collectionId: n,
        parent: __PRIVATE_encodeResourcePath(r2)
      };
      return __PRIVATE_collectionParentsStore(e).put(i);
    }
    return PersistencePromise.resolve();
  }
  getCollectionParents(e, t) {
    const n = [], r2 = IDBKeyRange.bound(
      [t, ""],
      [__PRIVATE_immediateSuccessor(t), ""],
      /*lowerOpen=*/
      false,
      /*upperOpen=*/
      true
    );
    return __PRIVATE_collectionParentsStore(e).W(r2).next((e2) => {
      for (const r3 of e2) {
        if (r3.collectionId !== t)
          break;
        n.push(__PRIVATE_decodeResourcePath(r3.parent));
      }
      return n;
    });
  }
  addFieldIndex(e, t) {
    const n = __PRIVATE_indexConfigurationStore(e), r2 = function __PRIVATE_toDbIndexConfiguration(e2) {
      return {
        indexId: e2.indexId,
        collectionGroup: e2.collectionGroup,
        fields: e2.fields.map((e3) => [e3.fieldPath.canonicalString(), e3.kind])
      };
    }(t);
    delete r2.indexId;
    const i = n.add(r2);
    if (t.indexState) {
      const n2 = __PRIVATE_indexStateStore(e);
      return i.next((e2) => {
        n2.put(__PRIVATE_toDbIndexState(e2, this.user, t.indexState.sequenceNumber, t.indexState.offset));
      });
    }
    return i.next();
  }
  deleteFieldIndex(e, t) {
    const n = __PRIVATE_indexConfigurationStore(e), r2 = __PRIVATE_indexStateStore(e), i = __PRIVATE_indexEntriesStore(e);
    return n.delete(t.indexId).next(() => r2.delete(IDBKeyRange.bound(
      [t.indexId],
      [t.indexId + 1],
      /*lowerOpen=*/
      false,
      /*upperOpen=*/
      true
    ))).next(() => i.delete(IDBKeyRange.bound(
      [t.indexId],
      [t.indexId + 1],
      /*lowerOpen=*/
      false,
      /*upperOpen=*/
      true
    )));
  }
  deleteAllFieldIndexes(e) {
    const t = __PRIVATE_indexConfigurationStore(e), n = __PRIVATE_indexEntriesStore(e), r2 = __PRIVATE_indexStateStore(e);
    return t.H().next(() => n.H()).next(() => r2.H());
  }
  createTargetIndexes(e, t) {
    return PersistencePromise.forEach(this.un(t), (t2) => this.getIndexType(e, t2).next((n) => {
      if (0 === n || 1 === n) {
        const n2 = new __PRIVATE_TargetIndexMatcher(t2).sn();
        if (null != n2)
          return this.addFieldIndex(e, n2);
      }
    }));
  }
  getDocumentsMatchingTarget(e, t) {
    const n = __PRIVATE_indexEntriesStore(e);
    let r2 = true;
    const i = /* @__PURE__ */ new Map();
    return PersistencePromise.forEach(this.un(t), (t2) => this.cn(e, t2).next((e2) => {
      r2 && (r2 = !!e2), i.set(t2, e2);
    })).next(() => {
      if (r2) {
        let e2 = __PRIVATE_documentKeySet();
        const r3 = [];
        return PersistencePromise.forEach(i, (i2, s) => {
          __PRIVATE_logDebug("IndexedDbIndexManager", `Using index ${function __PRIVATE_fieldIndexToString(e3) {
            return `id=${e3.indexId}|cg=${e3.collectionGroup}|f=${e3.fields.map((e4) => `${e4.fieldPath}:${e4.kind}`).join(",")}`;
          }(i2)} to execute ${__PRIVATE_canonifyTarget(t)}`);
          const o = function __PRIVATE_targetGetArrayValues(e3, t2) {
            const n2 = __PRIVATE_fieldIndexGetArraySegment(t2);
            if (void 0 === n2)
              return null;
            for (const t3 of __PRIVATE_targetGetFieldFiltersForPath(e3, n2.fieldPath))
              switch (t3.op) {
                case "array-contains-any":
                  return t3.value.arrayValue.values || [];
                case "array-contains":
                  return [t3.value];
              }
            return null;
          }(s, i2), _ = function __PRIVATE_targetGetNotInValues(e3, t2) {
            const n2 = /* @__PURE__ */ new Map();
            for (const r4 of __PRIVATE_fieldIndexGetDirectionalSegments(t2))
              for (const t3 of __PRIVATE_targetGetFieldFiltersForPath(e3, r4.fieldPath))
                switch (t3.op) {
                  case "==":
                  case "in":
                    n2.set(r4.fieldPath.canonicalString(), t3.value);
                    break;
                  case "not-in":
                  case "!=":
                    return n2.set(r4.fieldPath.canonicalString(), t3.value), Array.from(n2.values());
                }
            return null;
          }(s, i2), a = function __PRIVATE_targetGetLowerBound(e3, t2) {
            const n2 = [];
            let r4 = true;
            for (const i3 of __PRIVATE_fieldIndexGetDirectionalSegments(t2)) {
              const t3 = 0 === i3.kind ? __PRIVATE_targetGetAscendingBound(e3, i3.fieldPath, e3.startAt) : __PRIVATE_targetGetDescendingBound(e3, i3.fieldPath, e3.startAt);
              n2.push(t3.value), r4 && (r4 = t3.inclusive);
            }
            return new Bound(n2, r4);
          }(s, i2), u = function __PRIVATE_targetGetUpperBound(e3, t2) {
            const n2 = [];
            let r4 = true;
            for (const i3 of __PRIVATE_fieldIndexGetDirectionalSegments(t2)) {
              const t3 = 0 === i3.kind ? __PRIVATE_targetGetDescendingBound(e3, i3.fieldPath, e3.endAt) : __PRIVATE_targetGetAscendingBound(e3, i3.fieldPath, e3.endAt);
              n2.push(t3.value), r4 && (r4 = t3.inclusive);
            }
            return new Bound(n2, r4);
          }(s, i2), c = this.ln(i2, s, a), l2 = this.ln(i2, s, u), h = this.hn(i2, s, _), P2 = this.Pn(i2.indexId, o, c, a.inclusive, l2, u.inclusive, h);
          return PersistencePromise.forEach(P2, (i3) => n.j(i3, t.limit).next((t2) => {
            t2.forEach((t3) => {
              const n2 = DocumentKey.fromSegments(t3.documentKey);
              e2.has(n2) || (e2 = e2.add(n2), r3.push(n2));
            });
          }));
        }).next(() => r3);
      }
      return PersistencePromise.resolve(null);
    });
  }
  un(e) {
    let t = this.an.get(e);
    if (t)
      return t;
    if (0 === e.filters.length)
      t = [e];
    else {
      t = __PRIVATE_getDnfTerms(CompositeFilter.create(
        e.filters,
        "and"
        /* CompositeOperator.AND */
      )).map((t2) => __PRIVATE_newTarget(e.path, e.collectionGroup, e.orderBy, t2.getFilters(), e.limit, e.startAt, e.endAt));
    }
    return this.an.set(e, t), t;
  }
  /**
   * Constructs a key range query on `DbIndexEntryStore` that unions all
   * bounds.
   */
  Pn(e, t, n, r2, i, s, o) {
    const _ = (null != t ? t.length : 1) * Math.max(n.length, i.length), a = _ / (null != t ? t.length : 1), u = [];
    for (let c = 0; c < _; ++c) {
      const _2 = t ? this.In(t[c / a]) : Te, l2 = this.Tn(e, _2, n[c % a], r2), h = this.En(e, _2, i[c % a], s), P2 = o.map((t2) => this.Tn(
        e,
        _2,
        t2,
        /* inclusive= */
        true
      ));
      u.push(...this.createRange(l2, h, P2));
    }
    return u;
  }
  /** Generates the lower bound for `arrayValue` and `directionalValue`. */
  Tn(e, t, n, r2) {
    const i = new __PRIVATE_IndexEntry(e, DocumentKey.empty(), t, n);
    return r2 ? i : i.Ht();
  }
  /** Generates the upper bound for `arrayValue` and `directionalValue`. */
  En(e, t, n, r2) {
    const i = new __PRIVATE_IndexEntry(e, DocumentKey.empty(), t, n);
    return r2 ? i.Ht() : i;
  }
  cn(e, t) {
    const n = new __PRIVATE_TargetIndexMatcher(t), r2 = null != t.collectionGroup ? t.collectionGroup : t.path.lastSegment();
    return this.getFieldIndexes(e, r2).next((e2) => {
      let t2 = null;
      for (const r3 of e2) {
        n.en(r3) && (!t2 || r3.fields.length > t2.fields.length) && (t2 = r3);
      }
      return t2;
    });
  }
  getIndexType(e, t) {
    let n = 2;
    const r2 = this.un(t);
    return PersistencePromise.forEach(r2, (t2) => this.cn(e, t2).next((e2) => {
      e2 ? 0 !== n && e2.fields.length < function __PRIVATE_targetGetSegmentCount(e3) {
        let t3 = new SortedSet(FieldPath$1.comparator), n2 = false;
        for (const r3 of e3.filters)
          for (const e4 of r3.getFlattenedFilters())
            e4.field.isKeyField() || // ARRAY_CONTAINS or ARRAY_CONTAINS_ANY filters must be counted separately.
            // For instance, it is possible to have an index for "a ARRAY a ASC". Even
            // though these are on the same field, they should be counted as two
            // separate segments in an index.
            ("array-contains" === e4.op || "array-contains-any" === e4.op ? n2 = true : t3 = t3.add(e4.field));
        for (const n3 of e3.orderBy)
          n3.field.isKeyField() || (t3 = t3.add(n3.field));
        return t3.size + (n2 ? 1 : 0);
      }(t2) && (n = 1) : n = 0;
    })).next(() => (
      // OR queries have more than one sub-target (one sub-target per DNF term). We currently consider
      // OR queries that have a `limit` to have a partial index. For such queries we perform sorting
      // and apply the limit in memory as a post-processing step.
      function __PRIVATE_targetHasLimit(e2) {
        return null !== e2.limit;
      }(t) && r2.length > 1 && 2 === n ? 1 : n
    ));
  }
  /**
   * Returns the byte encoded form of the directional values in the field index.
   * Returns `null` if the document does not have all fields specified in the
   * index.
   */
  dn(e, t) {
    const n = new __PRIVATE_IndexByteEncoder();
    for (const r2 of __PRIVATE_fieldIndexGetDirectionalSegments(e)) {
      const e2 = t.data.field(r2.fieldPath);
      if (null == e2)
        return null;
      const i = n.jt(r2.kind);
      __PRIVATE_FirestoreIndexValueWriter.St.ht(e2, i);
    }
    return n.Ut();
  }
  /** Encodes a single value to the ascending index format. */
  In(e) {
    const t = new __PRIVATE_IndexByteEncoder();
    return __PRIVATE_FirestoreIndexValueWriter.St.ht(e, t.jt(
      0
      /* IndexKind.ASCENDING */
    )), t.Ut();
  }
  /**
   * Returns an encoded form of the document key that sorts based on the key
   * ordering of the field index.
   */
  An(e, t) {
    const n = new __PRIVATE_IndexByteEncoder();
    return __PRIVATE_FirestoreIndexValueWriter.St.ht(__PRIVATE_refValue(this.databaseId, t), n.jt(function __PRIVATE_fieldIndexGetKeyOrder(e2) {
      const t2 = __PRIVATE_fieldIndexGetDirectionalSegments(e2);
      return 0 === t2.length ? 0 : t2[t2.length - 1].kind;
    }(e))), n.Ut();
  }
  /**
   * Encodes the given field values according to the specification in `target`.
   * For IN queries, a list of possible values is returned.
   */
  hn(e, t, n) {
    if (null === n)
      return [];
    let r2 = [];
    r2.push(new __PRIVATE_IndexByteEncoder());
    let i = 0;
    for (const s of __PRIVATE_fieldIndexGetDirectionalSegments(e)) {
      const e2 = n[i++];
      for (const n2 of r2)
        if (this.Rn(t, s.fieldPath) && isArray(e2))
          r2 = this.Vn(r2, s, e2);
        else {
          const t2 = n2.jt(s.kind);
          __PRIVATE_FirestoreIndexValueWriter.St.ht(e2, t2);
        }
    }
    return this.mn(r2);
  }
  /**
   * Encodes the given bounds according to the specification in `target`. For IN
   * queries, a list of possible values is returned.
   */
  ln(e, t, n) {
    return this.hn(e, t, n.position);
  }
  /** Returns the byte representation for the provided encoders. */
  mn(e) {
    const t = [];
    for (let n = 0; n < e.length; ++n)
      t[n] = e[n].Ut();
    return t;
  }
  /**
   * Creates a separate encoder for each element of an array.
   *
   * The method appends each value to all existing encoders (e.g. filter("a",
   * "==", "a1").filter("b", "in", ["b1", "b2"]) becomes ["a1,b1", "a1,b2"]). A
   * list of new encoders is returned.
   */
  Vn(e, t, n) {
    const r2 = [...e], i = [];
    for (const e2 of n.arrayValue.values || [])
      for (const n2 of r2) {
        const r3 = new __PRIVATE_IndexByteEncoder();
        r3.seed(n2.Ut()), __PRIVATE_FirestoreIndexValueWriter.St.ht(e2, r3.jt(t.kind)), i.push(r3);
      }
    return i;
  }
  Rn(e, t) {
    return !!e.filters.find((e2) => e2 instanceof FieldFilter && e2.field.isEqual(t) && ("in" === e2.op || "not-in" === e2.op));
  }
  getFieldIndexes(e, t) {
    const n = __PRIVATE_indexConfigurationStore(e), r2 = __PRIVATE_indexStateStore(e);
    return (t ? n.W("collectionGroupIndex", IDBKeyRange.bound(t, t)) : n.W()).next((e2) => {
      const t2 = [];
      return PersistencePromise.forEach(e2, (e3) => r2.get([e3.indexId, this.uid]).next((n2) => {
        t2.push(function __PRIVATE_fromDbIndexConfiguration(e4, t3) {
          const n3 = t3 ? new IndexState(t3.sequenceNumber, new IndexOffset(__PRIVATE_fromDbTimestamp(t3.readTime), new DocumentKey(__PRIVATE_decodeResourcePath(t3.documentKey)), t3.largestBatchId)) : IndexState.empty(), r3 = e4.fields.map(([e5, t4]) => new IndexSegment(FieldPath$1.fromServerFormat(e5), t4));
          return new FieldIndex(e4.indexId, e4.collectionGroup, r3, n3);
        }(e3, n2));
      })).next(() => t2);
    });
  }
  getNextCollectionGroupToUpdate(e) {
    return this.getFieldIndexes(e).next((e2) => 0 === e2.length ? null : (e2.sort((e3, t) => {
      const n = e3.indexState.sequenceNumber - t.indexState.sequenceNumber;
      return 0 !== n ? n : __PRIVATE_primitiveComparator(e3.collectionGroup, t.collectionGroup);
    }), e2[0].collectionGroup));
  }
  updateCollectionGroup(e, t, n) {
    const r2 = __PRIVATE_indexConfigurationStore(e), i = __PRIVATE_indexStateStore(e);
    return this.fn(e).next((e2) => r2.W("collectionGroupIndex", IDBKeyRange.bound(t, t)).next((t2) => PersistencePromise.forEach(t2, (t3) => i.put(__PRIVATE_toDbIndexState(t3.indexId, this.user, e2, n)))));
  }
  updateIndexEntries(e, t) {
    const n = /* @__PURE__ */ new Map();
    return PersistencePromise.forEach(t, (t2, r2) => {
      const i = n.get(t2.collectionGroup);
      return (i ? PersistencePromise.resolve(i) : this.getFieldIndexes(e, t2.collectionGroup)).next((i2) => (n.set(t2.collectionGroup, i2), PersistencePromise.forEach(i2, (n2) => this.gn(e, t2, n2).next((t3) => {
        const i3 = this.pn(r2, n2);
        return t3.isEqual(i3) ? PersistencePromise.resolve() : this.yn(e, r2, n2, t3, i3);
      }))));
    });
  }
  wn(e, t, n, r2) {
    return __PRIVATE_indexEntriesStore(e).put({
      indexId: r2.indexId,
      uid: this.uid,
      arrayValue: r2.arrayValue,
      directionalValue: r2.directionalValue,
      orderedDocumentKey: this.An(n, t.key),
      documentKey: t.key.path.toArray()
    });
  }
  Sn(e, t, n, r2) {
    return __PRIVATE_indexEntriesStore(e).delete([r2.indexId, this.uid, r2.arrayValue, r2.directionalValue, this.An(n, t.key), t.key.path.toArray()]);
  }
  gn(e, t, n) {
    const r2 = __PRIVATE_indexEntriesStore(e);
    let i = new SortedSet(__PRIVATE_indexEntryComparator);
    return r2.Y({
      index: "documentKeyIndex",
      range: IDBKeyRange.only([n.indexId, this.uid, this.An(n, t)])
    }, (e2, r3) => {
      i = i.add(new __PRIVATE_IndexEntry(n.indexId, t, r3.arrayValue, r3.directionalValue));
    }).next(() => i);
  }
  /** Creates the index entries for the given document. */
  pn(e, t) {
    let n = new SortedSet(__PRIVATE_indexEntryComparator);
    const r2 = this.dn(t, e);
    if (null == r2)
      return n;
    const i = __PRIVATE_fieldIndexGetArraySegment(t);
    if (null != i) {
      const s = e.data.field(i.fieldPath);
      if (isArray(s))
        for (const i2 of s.arrayValue.values || [])
          n = n.add(new __PRIVATE_IndexEntry(t.indexId, e.key, this.In(i2), r2));
    } else
      n = n.add(new __PRIVATE_IndexEntry(t.indexId, e.key, Te, r2));
    return n;
  }
  /**
   * Updates the index entries for the provided document by deleting entries
   * that are no longer referenced in `newEntries` and adding all newly added
   * entries.
   */
  yn(e, t, n, r2, i) {
    __PRIVATE_logDebug("IndexedDbIndexManager", "Updating index entries for document '%s'", t.key);
    const s = [];
    return function __PRIVATE_diffSortedSets(e2, t2, n2, r3, i2) {
      const s2 = e2.getIterator(), o = t2.getIterator();
      let _ = __PRIVATE_advanceIterator(s2), a = __PRIVATE_advanceIterator(o);
      for (; _ || a; ) {
        let e3 = false, t3 = false;
        if (_ && a) {
          const r4 = n2(_, a);
          r4 < 0 ? (
            // The element was removed if the next element in our ordered
            // walkthrough is only in `before`.
            t3 = true
          ) : r4 > 0 && // The element was added if the next element in our ordered walkthrough
          // is only in `after`.
          (e3 = true);
        } else
          null != _ ? t3 = true : e3 = true;
        e3 ? (r3(a), a = __PRIVATE_advanceIterator(o)) : t3 ? (i2(_), _ = __PRIVATE_advanceIterator(s2)) : (_ = __PRIVATE_advanceIterator(s2), a = __PRIVATE_advanceIterator(o));
      }
    }(
      r2,
      i,
      __PRIVATE_indexEntryComparator,
      /* onAdd= */
      (r3) => {
        s.push(this.wn(e, t, n, r3));
      },
      /* onRemove= */
      (r3) => {
        s.push(this.Sn(e, t, n, r3));
      }
    ), PersistencePromise.waitFor(s);
  }
  fn(e) {
    let t = 1;
    return __PRIVATE_indexStateStore(e).Y({
      index: "sequenceNumberIndex",
      reverse: true,
      range: IDBKeyRange.upperBound([this.uid, Number.MAX_SAFE_INTEGER])
    }, (e2, n, r2) => {
      r2.done(), t = n.sequenceNumber + 1;
    }).next(() => t);
  }
  /**
   * Returns a new set of IDB ranges that splits the existing range and excludes
   * any values that match the `notInValue` from these ranges. As an example,
   * '[foo > 2 && foo != 3]` becomes  `[foo > 2 && < 3, foo > 3]`.
   */
  createRange(e, t, n) {
    n = n.sort((e2, t2) => __PRIVATE_indexEntryComparator(e2, t2)).filter((e2, t2, n2) => !t2 || 0 !== __PRIVATE_indexEntryComparator(e2, n2[t2 - 1]));
    const r2 = [];
    r2.push(e);
    for (const i2 of n) {
      const n2 = __PRIVATE_indexEntryComparator(i2, e), s = __PRIVATE_indexEntryComparator(i2, t);
      if (0 === n2)
        r2[0] = e.Ht();
      else if (n2 > 0 && s < 0)
        r2.push(i2), r2.push(i2.Ht());
      else if (s > 0)
        break;
    }
    r2.push(t);
    const i = [];
    for (let e2 = 0; e2 < r2.length; e2 += 2) {
      if (this.bn(r2[e2], r2[e2 + 1]))
        return [];
      const t2 = [r2[e2].indexId, this.uid, r2[e2].arrayValue, r2[e2].directionalValue, Te, []], n2 = [r2[e2 + 1].indexId, this.uid, r2[e2 + 1].arrayValue, r2[e2 + 1].directionalValue, Te, []];
      i.push(IDBKeyRange.bound(t2, n2));
    }
    return i;
  }
  bn(e, t) {
    return __PRIVATE_indexEntryComparator(e, t) > 0;
  }
  getMinOffsetFromCollectionGroup(e, t) {
    return this.getFieldIndexes(e, t).next(__PRIVATE_getMinOffsetFromFieldIndexes);
  }
  getMinOffset(e, t) {
    return PersistencePromise.mapArray(this.un(t), (t2) => this.cn(e, t2).next((e2) => e2 || fail())).next(__PRIVATE_getMinOffsetFromFieldIndexes);
  }
};
function __PRIVATE_collectionParentsStore(e) {
  return __PRIVATE_getStore(e, "collectionParents");
}
function __PRIVATE_indexEntriesStore(e) {
  return __PRIVATE_getStore(e, "indexEntries");
}
function __PRIVATE_indexConfigurationStore(e) {
  return __PRIVATE_getStore(e, "indexConfiguration");
}
function __PRIVATE_indexStateStore(e) {
  return __PRIVATE_getStore(e, "indexState");
}
function __PRIVATE_getMinOffsetFromFieldIndexes(e) {
  __PRIVATE_hardAssert(0 !== e.length);
  let t = e[0].indexState.offset, n = t.largestBatchId;
  for (let r2 = 1; r2 < e.length; r2++) {
    const i = e[r2].indexState.offset;
    __PRIVATE_indexOffsetComparator(i, t) < 0 && (t = i), n < i.largestBatchId && (n = i.largestBatchId);
  }
  return new IndexOffset(t.readTime, t.documentKey, n);
}
var Ee = {
  didRun: false,
  sequenceNumbersCollected: 0,
  targetsRemoved: 0,
  documentsRemoved: 0
};
var LruParams = class _LruParams {
  constructor(e, t, n) {
    this.cacheSizeCollectionThreshold = e, this.percentileToCollect = t, this.maximumSequenceNumbersToCollect = n;
  }
  static withCacheSize(e) {
    return new _LruParams(e, _LruParams.DEFAULT_COLLECTION_PERCENTILE, _LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT);
  }
};
function removeMutationBatch(e, t, n) {
  const r2 = e.store("mutations"), i = e.store("documentMutations"), s = [], o = IDBKeyRange.only(n.batchId);
  let _ = 0;
  const a = r2.Y({
    range: o
  }, (e2, t2, n2) => (_++, n2.delete()));
  s.push(a.next(() => {
    __PRIVATE_hardAssert(1 === _);
  }));
  const u = [];
  for (const e2 of n.mutations) {
    const r3 = __PRIVATE_newDbDocumentMutationKey(t, e2.key.path, n.batchId);
    s.push(i.delete(r3)), u.push(e2.key);
  }
  return PersistencePromise.waitFor(s).next(() => u);
}
function __PRIVATE_dbDocumentSize(e) {
  if (!e)
    return 0;
  let t;
  if (e.document)
    t = e.document;
  else if (e.unknownDocument)
    t = e.unknownDocument;
  else {
    if (!e.noDocument)
      throw fail();
    t = e.noDocument;
  }
  return JSON.stringify(t).length;
}
LruParams.DEFAULT_COLLECTION_PERCENTILE = 10, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT = 1e3, LruParams.DEFAULT = new LruParams(41943040, LruParams.DEFAULT_COLLECTION_PERCENTILE, LruParams.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT), LruParams.DISABLED = new LruParams(-1, 0, 0);
var __PRIVATE_IndexedDbMutationQueue = class ___PRIVATE_IndexedDbMutationQueue {
  constructor(e, t, n, r2) {
    this.userId = e, this.serializer = t, this.indexManager = n, this.referenceDelegate = r2, /**
     * Caches the document keys for pending mutation batches. If the mutation
     * has been removed from IndexedDb, the cached value may continue to
     * be used to retrieve the batch's document keys. To remove a cached value
     * locally, `removeCachedMutationKeys()` should be invoked either directly
     * or through `removeMutationBatches()`.
     *
     * With multi-tab, when the primary client acknowledges or rejects a mutation,
     * this cache is used by secondary clients to invalidate the local
     * view of the documents that were previously affected by the mutation.
     */
    // PORTING NOTE: Multi-tab only.
    this.Dn = {};
  }
  /**
   * Creates a new mutation queue for the given user.
   * @param user - The user for which to create a mutation queue.
   * @param serializer - The serializer to use when persisting to IndexedDb.
   */
  static ct(e, t, n, r2) {
    __PRIVATE_hardAssert("" !== e.uid);
    const i = e.isAuthenticated() ? e.uid : "";
    return new ___PRIVATE_IndexedDbMutationQueue(i, t, n, r2);
  }
  checkEmpty(e) {
    let t = true;
    const n = IDBKeyRange.bound([this.userId, Number.NEGATIVE_INFINITY], [this.userId, Number.POSITIVE_INFINITY]);
    return __PRIVATE_mutationsStore(e).Y({
      index: "userMutationsIndex",
      range: n
    }, (e2, n2, r2) => {
      t = false, r2.done();
    }).next(() => t);
  }
  addMutationBatch(e, t, n, r2) {
    const i = __PRIVATE_documentMutationsStore(e), s = __PRIVATE_mutationsStore(e);
    return s.add({}).next((o) => {
      __PRIVATE_hardAssert("number" == typeof o);
      const _ = new MutationBatch(o, t, n, r2), a = function __PRIVATE_toDbMutationBatch(e2, t2, n2) {
        const r3 = n2.baseMutations.map((t3) => toMutation(e2.ut, t3)), i2 = n2.mutations.map((t3) => toMutation(e2.ut, t3));
        return {
          userId: t2,
          batchId: n2.batchId,
          localWriteTimeMs: n2.localWriteTime.toMillis(),
          baseMutations: r3,
          mutations: i2
        };
      }(this.serializer, this.userId, _), u = [];
      let c = new SortedSet((e2, t2) => __PRIVATE_primitiveComparator(e2.canonicalString(), t2.canonicalString()));
      for (const e2 of r2) {
        const t2 = __PRIVATE_newDbDocumentMutationKey(this.userId, e2.key.path, o);
        c = c.add(e2.key.path.popLast()), u.push(s.put(a)), u.push(i.put(t2, x2));
      }
      return c.forEach((t2) => {
        u.push(this.indexManager.addToCollectionParentIndex(e, t2));
      }), e.addOnCommittedListener(() => {
        this.Dn[o] = _.keys();
      }), PersistencePromise.waitFor(u).next(() => _);
    });
  }
  lookupMutationBatch(e, t) {
    return __PRIVATE_mutationsStore(e).get(t).next((e2) => e2 ? (__PRIVATE_hardAssert(e2.userId === this.userId), __PRIVATE_fromDbMutationBatch(this.serializer, e2)) : null);
  }
  /**
   * Returns the document keys for the mutation batch with the given batchId.
   * For primary clients, this method returns `null` after
   * `removeMutationBatches()` has been called. Secondary clients return a
   * cached result until `removeCachedMutationKeys()` is invoked.
   */
  // PORTING NOTE: Multi-tab only.
  Cn(e, t) {
    return this.Dn[t] ? PersistencePromise.resolve(this.Dn[t]) : this.lookupMutationBatch(e, t).next((e2) => {
      if (e2) {
        const n = e2.keys();
        return this.Dn[t] = n, n;
      }
      return null;
    });
  }
  getNextMutationBatchAfterBatchId(e, t) {
    const n = t + 1, r2 = IDBKeyRange.lowerBound([this.userId, n]);
    let i = null;
    return __PRIVATE_mutationsStore(e).Y({
      index: "userMutationsIndex",
      range: r2
    }, (e2, t2, r3) => {
      t2.userId === this.userId && (__PRIVATE_hardAssert(t2.batchId >= n), i = __PRIVATE_fromDbMutationBatch(this.serializer, t2)), r3.done();
    }).next(() => i);
  }
  getHighestUnacknowledgedBatchId(e) {
    const t = IDBKeyRange.upperBound([this.userId, Number.POSITIVE_INFINITY]);
    let n = -1;
    return __PRIVATE_mutationsStore(e).Y({
      index: "userMutationsIndex",
      range: t,
      reverse: true
    }, (e2, t2, r2) => {
      n = t2.batchId, r2.done();
    }).next(() => n);
  }
  getAllMutationBatches(e) {
    const t = IDBKeyRange.bound([this.userId, -1], [this.userId, Number.POSITIVE_INFINITY]);
    return __PRIVATE_mutationsStore(e).W("userMutationsIndex", t).next((e2) => e2.map((e3) => __PRIVATE_fromDbMutationBatch(this.serializer, e3)));
  }
  getAllMutationBatchesAffectingDocumentKey(e, t) {
    const n = __PRIVATE_newDbDocumentMutationPrefixForPath(this.userId, t.path), r2 = IDBKeyRange.lowerBound(n), i = [];
    return __PRIVATE_documentMutationsStore(e).Y({
      range: r2
    }, (n2, r3, s) => {
      const [o, _, a] = n2, u = __PRIVATE_decodeResourcePath(_);
      if (o === this.userId && t.path.isEqual(u))
        return __PRIVATE_mutationsStore(e).get(a).next((e2) => {
          if (!e2)
            throw fail();
          __PRIVATE_hardAssert(e2.userId === this.userId), i.push(__PRIVATE_fromDbMutationBatch(this.serializer, e2));
        });
      s.done();
    }).next(() => i);
  }
  getAllMutationBatchesAffectingDocumentKeys(e, t) {
    let n = new SortedSet(__PRIVATE_primitiveComparator);
    const r2 = [];
    return t.forEach((t2) => {
      const i = __PRIVATE_newDbDocumentMutationPrefixForPath(this.userId, t2.path), s = IDBKeyRange.lowerBound(i), o = __PRIVATE_documentMutationsStore(e).Y({
        range: s
      }, (e2, r3, i2) => {
        const [s2, o2, _] = e2, a = __PRIVATE_decodeResourcePath(o2);
        s2 === this.userId && t2.path.isEqual(a) ? n = n.add(_) : i2.done();
      });
      r2.push(o);
    }), PersistencePromise.waitFor(r2).next(() => this.vn(e, n));
  }
  getAllMutationBatchesAffectingQuery(e, t) {
    const n = t.path, r2 = n.length + 1, i = __PRIVATE_newDbDocumentMutationPrefixForPath(this.userId, n), s = IDBKeyRange.lowerBound(i);
    let o = new SortedSet(__PRIVATE_primitiveComparator);
    return __PRIVATE_documentMutationsStore(e).Y({
      range: s
    }, (e2, t2, i2) => {
      const [s2, _, a] = e2, u = __PRIVATE_decodeResourcePath(_);
      s2 === this.userId && n.isPrefixOf(u) ? (
        // Rows with document keys more than one segment longer than the
        // query path can't be matches. For example, a query on 'rooms'
        // can't match the document /rooms/abc/messages/xyx.
        // TODO(mcg): we'll need a different scanner when we implement
        // ancestor queries.
        u.length === r2 && (o = o.add(a))
      ) : i2.done();
    }).next(() => this.vn(e, o));
  }
  vn(e, t) {
    const n = [], r2 = [];
    return t.forEach((t2) => {
      r2.push(__PRIVATE_mutationsStore(e).get(t2).next((e2) => {
        if (null === e2)
          throw fail();
        __PRIVATE_hardAssert(e2.userId === this.userId), n.push(__PRIVATE_fromDbMutationBatch(this.serializer, e2));
      }));
    }), PersistencePromise.waitFor(r2).next(() => n);
  }
  removeMutationBatch(e, t) {
    return removeMutationBatch(e.ae, this.userId, t).next((n) => (e.addOnCommittedListener(() => {
      this.Fn(t.batchId);
    }), PersistencePromise.forEach(n, (t2) => this.referenceDelegate.markPotentiallyOrphaned(e, t2))));
  }
  /**
   * Clears the cached keys for a mutation batch. This method should be
   * called by secondary clients after they process mutation updates.
   *
   * Note that this method does not have to be called from primary clients as
   * the corresponding cache entries are cleared when an acknowledged or
   * rejected batch is removed from the mutation queue.
   */
  // PORTING NOTE: Multi-tab only
  Fn(e) {
    delete this.Dn[e];
  }
  performConsistencyCheck(e) {
    return this.checkEmpty(e).next((t) => {
      if (!t)
        return PersistencePromise.resolve();
      const n = IDBKeyRange.lowerBound(
        /**
        * Creates a [userId] key for use in the DbDocumentMutations index to iterate
        * over all of a user's document mutations.
        */
        function __PRIVATE_newDbDocumentMutationPrefixForUser(e2) {
          return [e2];
        }(this.userId)
      ), r2 = [];
      return __PRIVATE_documentMutationsStore(e).Y({
        range: n
      }, (e2, t2, n2) => {
        if (e2[0] === this.userId) {
          const t3 = __PRIVATE_decodeResourcePath(e2[1]);
          r2.push(t3);
        } else
          n2.done();
      }).next(() => {
        __PRIVATE_hardAssert(0 === r2.length);
      });
    });
  }
  containsKey(e, t) {
    return __PRIVATE_mutationQueueContainsKey(e, this.userId, t);
  }
  // PORTING NOTE: Multi-tab only (state is held in memory in other clients).
  /** Returns the mutation queue's metadata from IndexedDb. */
  Mn(e) {
    return __PRIVATE_mutationQueuesStore(e).get(this.userId).next((e2) => e2 || {
      userId: this.userId,
      lastAcknowledgedBatchId: -1,
      lastStreamToken: ""
    });
  }
};
function __PRIVATE_mutationQueueContainsKey(e, t, n) {
  const r2 = __PRIVATE_newDbDocumentMutationPrefixForPath(t, n.path), i = r2[1], s = IDBKeyRange.lowerBound(r2);
  let o = false;
  return __PRIVATE_documentMutationsStore(e).Y({
    range: s,
    J: true
  }, (e2, n2, r3) => {
    const [
      s2,
      _,
      /*batchID*/
      a
    ] = e2;
    s2 === t && _ === i && (o = true), r3.done();
  }).next(() => o);
}
function __PRIVATE_mutationsStore(e) {
  return __PRIVATE_getStore(e, "mutations");
}
function __PRIVATE_documentMutationsStore(e) {
  return __PRIVATE_getStore(e, "documentMutations");
}
function __PRIVATE_mutationQueuesStore(e) {
  return __PRIVATE_getStore(e, "mutationQueues");
}
var __PRIVATE_TargetIdGenerator = class ___PRIVATE_TargetIdGenerator {
  constructor(e) {
    this.xn = e;
  }
  next() {
    return this.xn += 2, this.xn;
  }
  static On() {
    return new ___PRIVATE_TargetIdGenerator(0);
  }
  static Nn() {
    return new ___PRIVATE_TargetIdGenerator(-1);
  }
};
var __PRIVATE_IndexedDbTargetCache = class {
  constructor(e, t) {
    this.referenceDelegate = e, this.serializer = t;
  }
  // PORTING NOTE: We don't cache global metadata for the target cache, since
  // some of it (in particular `highestTargetId`) can be modified by secondary
  // tabs. We could perhaps be more granular (and e.g. still cache
  // `lastRemoteSnapshotVersion` in memory) but for simplicity we currently go
  // to IndexedDb whenever we need to read metadata. We can revisit if it turns
  // out to have a meaningful performance impact.
  allocateTargetId(e) {
    return this.Bn(e).next((t) => {
      const n = new __PRIVATE_TargetIdGenerator(t.highestTargetId);
      return t.highestTargetId = n.next(), this.Ln(e, t).next(() => t.highestTargetId);
    });
  }
  getLastRemoteSnapshotVersion(e) {
    return this.Bn(e).next((e2) => SnapshotVersion.fromTimestamp(new Timestamp(e2.lastRemoteSnapshotVersion.seconds, e2.lastRemoteSnapshotVersion.nanoseconds)));
  }
  getHighestSequenceNumber(e) {
    return this.Bn(e).next((e2) => e2.highestListenSequenceNumber);
  }
  setTargetsMetadata(e, t, n) {
    return this.Bn(e).next((r2) => (r2.highestListenSequenceNumber = t, n && (r2.lastRemoteSnapshotVersion = n.toTimestamp()), t > r2.highestListenSequenceNumber && (r2.highestListenSequenceNumber = t), this.Ln(e, r2)));
  }
  addTargetData(e, t) {
    return this.kn(e, t).next(() => this.Bn(e).next((n) => (n.targetCount += 1, this.qn(t, n), this.Ln(e, n))));
  }
  updateTargetData(e, t) {
    return this.kn(e, t);
  }
  removeTargetData(e, t) {
    return this.removeMatchingKeysForTargetId(e, t.targetId).next(() => __PRIVATE_targetsStore(e).delete(t.targetId)).next(() => this.Bn(e)).next((t2) => (__PRIVATE_hardAssert(t2.targetCount > 0), t2.targetCount -= 1, this.Ln(e, t2)));
  }
  /**
   * Drops any targets with sequence number less than or equal to the upper bound, excepting those
   * present in `activeTargetIds`. Document associations for the removed targets are also removed.
   * Returns the number of targets removed.
   */
  removeTargets(e, t, n) {
    let r2 = 0;
    const i = [];
    return __PRIVATE_targetsStore(e).Y((s, o) => {
      const _ = __PRIVATE_fromDbTarget(o);
      _.sequenceNumber <= t && null === n.get(_.targetId) && (r2++, i.push(this.removeTargetData(e, _)));
    }).next(() => PersistencePromise.waitFor(i)).next(() => r2);
  }
  /**
   * Call provided function with each `TargetData` that we have cached.
   */
  forEachTarget(e, t) {
    return __PRIVATE_targetsStore(e).Y((e2, n) => {
      const r2 = __PRIVATE_fromDbTarget(n);
      t(r2);
    });
  }
  Bn(e) {
    return __PRIVATE_globalTargetStore(e).get("targetGlobalKey").next((e2) => (__PRIVATE_hardAssert(null !== e2), e2));
  }
  Ln(e, t) {
    return __PRIVATE_globalTargetStore(e).put("targetGlobalKey", t);
  }
  kn(e, t) {
    return __PRIVATE_targetsStore(e).put(__PRIVATE_toDbTarget(this.serializer, t));
  }
  /**
   * In-place updates the provided metadata to account for values in the given
   * TargetData. Saving is done separately. Returns true if there were any
   * changes to the metadata.
   */
  qn(e, t) {
    let n = false;
    return e.targetId > t.highestTargetId && (t.highestTargetId = e.targetId, n = true), e.sequenceNumber > t.highestListenSequenceNumber && (t.highestListenSequenceNumber = e.sequenceNumber, n = true), n;
  }
  getTargetCount(e) {
    return this.Bn(e).next((e2) => e2.targetCount);
  }
  getTargetData(e, t) {
    const n = __PRIVATE_canonifyTarget(t), r2 = IDBKeyRange.bound([n, Number.NEGATIVE_INFINITY], [n, Number.POSITIVE_INFINITY]);
    let i = null;
    return __PRIVATE_targetsStore(e).Y({
      range: r2,
      index: "queryTargetsIndex"
    }, (e2, n2, r3) => {
      const s = __PRIVATE_fromDbTarget(n2);
      __PRIVATE_targetEquals(t, s.target) && (i = s, r3.done());
    }).next(() => i);
  }
  addMatchingKeys(e, t, n) {
    const r2 = [], i = __PRIVATE_documentTargetStore(e);
    return t.forEach((t2) => {
      const s = __PRIVATE_encodeResourcePath(t2.path);
      r2.push(i.put({
        targetId: n,
        path: s
      })), r2.push(this.referenceDelegate.addReference(e, n, t2));
    }), PersistencePromise.waitFor(r2);
  }
  removeMatchingKeys(e, t, n) {
    const r2 = __PRIVATE_documentTargetStore(e);
    return PersistencePromise.forEach(t, (t2) => {
      const i = __PRIVATE_encodeResourcePath(t2.path);
      return PersistencePromise.waitFor([r2.delete([n, i]), this.referenceDelegate.removeReference(e, n, t2)]);
    });
  }
  removeMatchingKeysForTargetId(e, t) {
    const n = __PRIVATE_documentTargetStore(e), r2 = IDBKeyRange.bound(
      [t],
      [t + 1],
      /*lowerOpen=*/
      false,
      /*upperOpen=*/
      true
    );
    return n.delete(r2);
  }
  getMatchingKeysForTargetId(e, t) {
    const n = IDBKeyRange.bound(
      [t],
      [t + 1],
      /*lowerOpen=*/
      false,
      /*upperOpen=*/
      true
    ), r2 = __PRIVATE_documentTargetStore(e);
    let i = __PRIVATE_documentKeySet();
    return r2.Y({
      range: n,
      J: true
    }, (e2, t2, n2) => {
      const r3 = __PRIVATE_decodeResourcePath(e2[1]), s = new DocumentKey(r3);
      i = i.add(s);
    }).next(() => i);
  }
  containsKey(e, t) {
    const n = __PRIVATE_encodeResourcePath(t.path), r2 = IDBKeyRange.bound(
      [n],
      [__PRIVATE_immediateSuccessor(n)],
      /*lowerOpen=*/
      false,
      /*upperOpen=*/
      true
    );
    let i = 0;
    return __PRIVATE_documentTargetStore(e).Y({
      index: "documentTargetsIndex",
      J: true,
      range: r2
    }, ([e2, t2], n2, r3) => {
      0 !== e2 && (i++, r3.done());
    }).next(() => i > 0);
  }
  /**
   * Looks up a TargetData entry by target ID.
   *
   * @param targetId - The target ID of the TargetData entry to look up.
   * @returns The cached TargetData entry, or null if the cache has no entry for
   * the target.
   */
  // PORTING NOTE: Multi-tab only.
  _t(e, t) {
    return __PRIVATE_targetsStore(e).get(t).next((e2) => e2 ? __PRIVATE_fromDbTarget(e2) : null);
  }
};
function __PRIVATE_targetsStore(e) {
  return __PRIVATE_getStore(e, "targets");
}
function __PRIVATE_globalTargetStore(e) {
  return __PRIVATE_getStore(e, "targetGlobal");
}
function __PRIVATE_documentTargetStore(e) {
  return __PRIVATE_getStore(e, "targetDocuments");
}
function __PRIVATE_bufferEntryComparator([e, t], [n, r2]) {
  const i = __PRIVATE_primitiveComparator(e, n);
  return 0 === i ? __PRIVATE_primitiveComparator(t, r2) : i;
}
var __PRIVATE_RollingSequenceNumberBuffer = class {
  constructor(e) {
    this.Qn = e, this.buffer = new SortedSet(__PRIVATE_bufferEntryComparator), this.Kn = 0;
  }
  $n() {
    return ++this.Kn;
  }
  Un(e) {
    const t = [e, this.$n()];
    if (this.buffer.size < this.Qn)
      this.buffer = this.buffer.add(t);
    else {
      const e2 = this.buffer.last();
      __PRIVATE_bufferEntryComparator(t, e2) < 0 && (this.buffer = this.buffer.delete(e2).add(t));
    }
  }
  get maxValue() {
    return this.buffer.last()[0];
  }
};
var __PRIVATE_LruScheduler = class {
  constructor(e, t, n) {
    this.garbageCollector = e, this.asyncQueue = t, this.localStore = n, this.Wn = null;
  }
  start() {
    -1 !== this.garbageCollector.params.cacheSizeCollectionThreshold && this.Gn(6e4);
  }
  stop() {
    this.Wn && (this.Wn.cancel(), this.Wn = null);
  }
  get started() {
    return null !== this.Wn;
  }
  Gn(e) {
    __PRIVATE_logDebug("LruGarbageCollector", `Garbage collection scheduled in ${e}ms`), this.Wn = this.asyncQueue.enqueueAfterDelay("lru_garbage_collection", e, () => __async(this, null, function* () {
      this.Wn = null;
      try {
        yield this.localStore.collectGarbage(this.garbageCollector);
      } catch (e2) {
        __PRIVATE_isIndexedDbTransactionError(e2) ? __PRIVATE_logDebug("LruGarbageCollector", "Ignoring IndexedDB error during garbage collection: ", e2) : yield __PRIVATE_ignoreIfPrimaryLeaseLoss(e2);
      }
      yield this.Gn(3e5);
    }));
  }
};
var __PRIVATE_LruGarbageCollectorImpl = class {
  constructor(e, t) {
    this.zn = e, this.params = t;
  }
  calculateTargetCount(e, t) {
    return this.zn.jn(e).next((e2) => Math.floor(t / 100 * e2));
  }
  nthSequenceNumber(e, t) {
    if (0 === t)
      return PersistencePromise.resolve(__PRIVATE_ListenSequence._e);
    const n = new __PRIVATE_RollingSequenceNumberBuffer(t);
    return this.zn.forEachTarget(e, (e2) => n.Un(e2.sequenceNumber)).next(() => this.zn.Hn(e, (e2) => n.Un(e2))).next(() => n.maxValue);
  }
  removeTargets(e, t, n) {
    return this.zn.removeTargets(e, t, n);
  }
  removeOrphanedDocuments(e, t) {
    return this.zn.removeOrphanedDocuments(e, t);
  }
  collect(e, t) {
    return -1 === this.params.cacheSizeCollectionThreshold ? (__PRIVATE_logDebug("LruGarbageCollector", "Garbage collection skipped; disabled"), PersistencePromise.resolve(Ee)) : this.getCacheSize(e).next((n) => n < this.params.cacheSizeCollectionThreshold ? (__PRIVATE_logDebug("LruGarbageCollector", `Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`), Ee) : this.Jn(e, t));
  }
  getCacheSize(e) {
    return this.zn.getCacheSize(e);
  }
  Jn(e, t) {
    let n, r2, i, s, o, a, u;
    const c = Date.now();
    return this.calculateTargetCount(e, this.params.percentileToCollect).next((t2) => (
      // Cap at the configured max
      (t2 > this.params.maximumSequenceNumbersToCollect ? (__PRIVATE_logDebug("LruGarbageCollector", `Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t2}`), r2 = this.params.maximumSequenceNumbersToCollect) : r2 = t2, s = Date.now(), this.nthSequenceNumber(e, r2))
    )).next((r3) => (n = r3, o = Date.now(), this.removeTargets(e, n, t))).next((t2) => (i = t2, a = Date.now(), this.removeOrphanedDocuments(e, n))).next((e2) => {
      if (u = Date.now(), __PRIVATE_getLogLevel() <= LogLevel.DEBUG) {
        __PRIVATE_logDebug("LruGarbageCollector", `LRU Garbage Collection
	Counted targets in ${s - c}ms
	Determined least recently used ${r2} in ` + (o - s) + `ms
	Removed ${i} targets in ` + (a - o) + `ms
	Removed ${e2} documents in ` + (u - a) + `ms
Total Duration: ${u - c}ms`);
      }
      return PersistencePromise.resolve({
        didRun: true,
        sequenceNumbersCollected: r2,
        targetsRemoved: i,
        documentsRemoved: e2
      });
    });
  }
};
function __PRIVATE_newLruGarbageCollector(e, t) {
  return new __PRIVATE_LruGarbageCollectorImpl(e, t);
}
var __PRIVATE_IndexedDbLruDelegateImpl = class {
  constructor(e, t) {
    this.db = e, this.garbageCollector = __PRIVATE_newLruGarbageCollector(this, t);
  }
  jn(e) {
    const t = this.Yn(e);
    return this.db.getTargetCache().getTargetCount(e).next((e2) => t.next((t2) => e2 + t2));
  }
  Yn(e) {
    let t = 0;
    return this.Hn(e, (e2) => {
      t++;
    }).next(() => t);
  }
  forEachTarget(e, t) {
    return this.db.getTargetCache().forEachTarget(e, t);
  }
  Hn(e, t) {
    return this.Zn(e, (e2, n) => t(n));
  }
  addReference(e, t, n) {
    return __PRIVATE_writeSentinelKey(e, n);
  }
  removeReference(e, t, n) {
    return __PRIVATE_writeSentinelKey(e, n);
  }
  removeTargets(e, t, n) {
    return this.db.getTargetCache().removeTargets(e, t, n);
  }
  markPotentiallyOrphaned(e, t) {
    return __PRIVATE_writeSentinelKey(e, t);
  }
  /**
   * Returns true if anything would prevent this document from being garbage
   * collected, given that the document in question is not present in any
   * targets and has a sequence number less than or equal to the upper bound for
   * the collection run.
   */
  Xn(e, t) {
    return function __PRIVATE_mutationQueuesContainKey(e2, t2) {
      let n = false;
      return __PRIVATE_mutationQueuesStore(e2).Z((r2) => __PRIVATE_mutationQueueContainsKey(e2, r2, t2).next((e3) => (e3 && (n = true), PersistencePromise.resolve(!e3)))).next(() => n);
    }(e, t);
  }
  removeOrphanedDocuments(e, t) {
    const n = this.db.getRemoteDocumentCache().newChangeBuffer(), r2 = [];
    let i = 0;
    return this.Zn(e, (s, o) => {
      if (o <= t) {
        const t2 = this.Xn(e, s).next((t3) => {
          if (!t3)
            return i++, n.getEntry(e, s).next(() => (n.removeEntry(s, SnapshotVersion.min()), __PRIVATE_documentTargetStore(e).delete(function __PRIVATE_sentinelKey$1(e2) {
              return [0, __PRIVATE_encodeResourcePath(e2.path)];
            }(s))));
        });
        r2.push(t2);
      }
    }).next(() => PersistencePromise.waitFor(r2)).next(() => n.apply(e)).next(() => i);
  }
  removeTarget(e, t) {
    const n = t.withSequenceNumber(e.currentSequenceNumber);
    return this.db.getTargetCache().updateTargetData(e, n);
  }
  updateLimboDocument(e, t) {
    return __PRIVATE_writeSentinelKey(e, t);
  }
  /**
   * Call provided function for each document in the cache that is 'orphaned'. Orphaned
   * means not a part of any target, so the only entry in the target-document index for
   * that document will be the sentinel row (targetId 0), which will also have the sequence
   * number for the last time the document was accessed.
   */
  Zn(e, t) {
    const n = __PRIVATE_documentTargetStore(e);
    let r2, i = __PRIVATE_ListenSequence._e;
    return n.Y({
      index: "documentTargetsIndex"
    }, ([e2, n2], { path: s, sequenceNumber: o }) => {
      0 === e2 ? (
        // if nextToReport is valid, report it, this is a new key so the
        // last one must not be a member of any targets.
        (i !== __PRIVATE_ListenSequence._e && t(new DocumentKey(__PRIVATE_decodeResourcePath(r2)), i), // set nextToReport to be this sequence number. It's the next one we
        // might report, if we don't find any targets for this document.
        // Note that the sequence number must be defined when the targetId
        // is 0.
        i = o, r2 = s)
      ) : (
        // set nextToReport to be invalid, we know we don't need to report
        // this one since we found a target for it.
        i = __PRIVATE_ListenSequence._e
      );
    }).next(() => {
      i !== __PRIVATE_ListenSequence._e && t(new DocumentKey(__PRIVATE_decodeResourcePath(r2)), i);
    });
  }
  getCacheSize(e) {
    return this.db.getRemoteDocumentCache().getSize(e);
  }
};
function __PRIVATE_writeSentinelKey(e, t) {
  return __PRIVATE_documentTargetStore(e).put(function __PRIVATE_sentinelRow(e2, t2) {
    return {
      targetId: 0,
      path: __PRIVATE_encodeResourcePath(e2.path),
      sequenceNumber: t2
    };
  }(t, e.currentSequenceNumber));
}
var RemoteDocumentChangeBuffer = class {
  constructor() {
    this.changes = new ObjectMap((e) => e.toString(), (e, t) => e.isEqual(t)), this.changesApplied = false;
  }
  /**
   * Buffers a `RemoteDocumentCache.addEntry()` call.
   *
   * You can only modify documents that have already been retrieved via
   * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
   */
  addEntry(e) {
    this.assertNotApplied(), this.changes.set(e.key, e);
  }
  /**
   * Buffers a `RemoteDocumentCache.removeEntry()` call.
   *
   * You can only remove documents that have already been retrieved via
   * `getEntry()/getEntries()` (enforced via IndexedDbs `apply()`).
   */
  removeEntry(e, t) {
    this.assertNotApplied(), this.changes.set(e, MutableDocument.newInvalidDocument(e).setReadTime(t));
  }
  /**
   * Looks up an entry in the cache. The buffered changes will first be checked,
   * and if no buffered change applies, this will forward to
   * `RemoteDocumentCache.getEntry()`.
   *
   * @param transaction - The transaction in which to perform any persistence
   *     operations.
   * @param documentKey - The key of the entry to look up.
   * @returns The cached document or an invalid document if we have nothing
   * cached.
   */
  getEntry(e, t) {
    this.assertNotApplied();
    const n = this.changes.get(t);
    return void 0 !== n ? PersistencePromise.resolve(n) : this.getFromCache(e, t);
  }
  /**
   * Looks up several entries in the cache, forwarding to
   * `RemoteDocumentCache.getEntry()`.
   *
   * @param transaction - The transaction in which to perform any persistence
   *     operations.
   * @param documentKeys - The keys of the entries to look up.
   * @returns A map of cached documents, indexed by key. If an entry cannot be
   *     found, the corresponding key will be mapped to an invalid document.
   */
  getEntries(e, t) {
    return this.getAllFromCache(e, t);
  }
  /**
   * Applies buffered changes to the underlying RemoteDocumentCache, using
   * the provided transaction.
   */
  apply(e) {
    return this.assertNotApplied(), this.changesApplied = true, this.applyChanges(e);
  }
  /** Helper to assert this.changes is not null  */
  assertNotApplied() {
  }
};
var __PRIVATE_IndexedDbRemoteDocumentCacheImpl = class {
  constructor(e) {
    this.serializer = e;
  }
  setIndexManager(e) {
    this.indexManager = e;
  }
  /**
   * Adds the supplied entries to the cache.
   *
   * All calls of `addEntry` are required to go through the RemoteDocumentChangeBuffer
   * returned by `newChangeBuffer()` to ensure proper accounting of metadata.
   */
  addEntry(e, t, n) {
    return __PRIVATE_remoteDocumentsStore(e).put(n);
  }
  /**
   * Removes a document from the cache.
   *
   * All calls of `removeEntry`  are required to go through the RemoteDocumentChangeBuffer
   * returned by `newChangeBuffer()` to ensure proper accounting of metadata.
   */
  removeEntry(e, t, n) {
    return __PRIVATE_remoteDocumentsStore(e).delete(
      /**
      * Returns a key that can be used for document lookups via the primary key of
      * the DbRemoteDocument object store.
      */
      function __PRIVATE_dbReadTimeKey(e2, t2) {
        const n2 = e2.path.toArray();
        return [
          /* prefix path */
          n2.slice(0, n2.length - 2),
          /* collection id */
          n2[n2.length - 2],
          __PRIVATE_toDbTimestampKey(t2),
          /* document id */
          n2[n2.length - 1]
        ];
      }(t, n)
    );
  }
  /**
   * Updates the current cache size.
   *
   * Callers to `addEntry()` and `removeEntry()` *must* call this afterwards to update the
   * cache's metadata.
   */
  updateMetadata(e, t) {
    return this.getMetadata(e).next((n) => (n.byteSize += t, this.er(e, n)));
  }
  getEntry(e, t) {
    let n = MutableDocument.newInvalidDocument(t);
    return __PRIVATE_remoteDocumentsStore(e).Y({
      index: "documentKeyIndex",
      range: IDBKeyRange.only(__PRIVATE_dbKey(t))
    }, (e2, r2) => {
      n = this.tr(t, r2);
    }).next(() => n);
  }
  /**
   * Looks up an entry in the cache.
   *
   * @param documentKey - The key of the entry to look up.
   * @returns The cached document entry and its size.
   */
  nr(e, t) {
    let n = {
      size: 0,
      document: MutableDocument.newInvalidDocument(t)
    };
    return __PRIVATE_remoteDocumentsStore(e).Y({
      index: "documentKeyIndex",
      range: IDBKeyRange.only(__PRIVATE_dbKey(t))
    }, (e2, r2) => {
      n = {
        document: this.tr(t, r2),
        size: __PRIVATE_dbDocumentSize(r2)
      };
    }).next(() => n);
  }
  getEntries(e, t) {
    let n = __PRIVATE_mutableDocumentMap();
    return this.rr(e, t, (e2, t2) => {
      const r2 = this.tr(e2, t2);
      n = n.insert(e2, r2);
    }).next(() => n);
  }
  /**
   * Looks up several entries in the cache.
   *
   * @param documentKeys - The set of keys entries to look up.
   * @returns A map of documents indexed by key and a map of sizes indexed by
   *     key (zero if the document does not exist).
   */
  ir(e, t) {
    let n = __PRIVATE_mutableDocumentMap(), r2 = new SortedMap(DocumentKey.comparator);
    return this.rr(e, t, (e2, t2) => {
      const i = this.tr(e2, t2);
      n = n.insert(e2, i), r2 = r2.insert(e2, __PRIVATE_dbDocumentSize(t2));
    }).next(() => ({
      documents: n,
      sr: r2
    }));
  }
  rr(e, t, n) {
    if (t.isEmpty())
      return PersistencePromise.resolve();
    let r2 = new SortedSet(__PRIVATE_dbKeyComparator);
    t.forEach((e2) => r2 = r2.add(e2));
    const i = IDBKeyRange.bound(__PRIVATE_dbKey(r2.first()), __PRIVATE_dbKey(r2.last())), s = r2.getIterator();
    let o = s.getNext();
    return __PRIVATE_remoteDocumentsStore(e).Y({
      index: "documentKeyIndex",
      range: i
    }, (e2, t2, r3) => {
      const i2 = DocumentKey.fromSegments([...t2.prefixPath, t2.collectionGroup, t2.documentId]);
      for (; o && __PRIVATE_dbKeyComparator(o, i2) < 0; )
        n(o, null), o = s.getNext();
      o && o.isEqual(i2) && // Key found in cache.
      (n(o, t2), o = s.hasNext() ? s.getNext() : null), // Skip to the next key (if there is one).
      o ? r3.U(__PRIVATE_dbKey(o)) : r3.done();
    }).next(() => {
      for (; o; )
        n(o, null), o = s.hasNext() ? s.getNext() : null;
    });
  }
  getDocumentsMatchingQuery(e, t, n, r2, i) {
    const s = t.path, o = [s.popLast().toArray(), s.lastSegment(), __PRIVATE_toDbTimestampKey(n.readTime), n.documentKey.path.isEmpty() ? "" : n.documentKey.path.lastSegment()], _ = [s.popLast().toArray(), s.lastSegment(), [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], ""];
    return __PRIVATE_remoteDocumentsStore(e).W(IDBKeyRange.bound(o, _, true)).next((e2) => {
      null == i || i.incrementDocumentReadCount(e2.length);
      let n2 = __PRIVATE_mutableDocumentMap();
      for (const i2 of e2) {
        const e3 = this.tr(DocumentKey.fromSegments(i2.prefixPath.concat(i2.collectionGroup, i2.documentId)), i2);
        e3.isFoundDocument() && (__PRIVATE_queryMatches(t, e3) || r2.has(e3.key)) && // Either the document matches the given query, or it is mutated.
        (n2 = n2.insert(e3.key, e3));
      }
      return n2;
    });
  }
  getAllFromCollectionGroup(e, t, n, r2) {
    let i = __PRIVATE_mutableDocumentMap();
    const s = __PRIVATE_dbCollectionGroupKey(t, n), o = __PRIVATE_dbCollectionGroupKey(t, IndexOffset.max());
    return __PRIVATE_remoteDocumentsStore(e).Y({
      index: "collectionGroupIndex",
      range: IDBKeyRange.bound(s, o, true)
    }, (e2, t2, n2) => {
      const s2 = this.tr(DocumentKey.fromSegments(t2.prefixPath.concat(t2.collectionGroup, t2.documentId)), t2);
      i = i.insert(s2.key, s2), i.size === r2 && n2.done();
    }).next(() => i);
  }
  newChangeBuffer(e) {
    return new __PRIVATE_IndexedDbRemoteDocumentChangeBuffer(this, !!e && e.trackRemovals);
  }
  getSize(e) {
    return this.getMetadata(e).next((e2) => e2.byteSize);
  }
  getMetadata(e) {
    return __PRIVATE_documentGlobalStore(e).get("remoteDocumentGlobalKey").next((e2) => (__PRIVATE_hardAssert(!!e2), e2));
  }
  er(e, t) {
    return __PRIVATE_documentGlobalStore(e).put("remoteDocumentGlobalKey", t);
  }
  /**
   * Decodes `dbRemoteDoc` and returns the document (or an invalid document if
   * the document corresponds to the format used for sentinel deletes).
   */
  tr(e, t) {
    if (t) {
      const e2 = __PRIVATE_fromDbRemoteDocument(this.serializer, t);
      if (!(e2.isNoDocument() && e2.version.isEqual(SnapshotVersion.min())))
        return e2;
    }
    return MutableDocument.newInvalidDocument(e);
  }
};
function __PRIVATE_newIndexedDbRemoteDocumentCache(e) {
  return new __PRIVATE_IndexedDbRemoteDocumentCacheImpl(e);
}
var __PRIVATE_IndexedDbRemoteDocumentChangeBuffer = class extends RemoteDocumentChangeBuffer {
  /**
   * @param documentCache - The IndexedDbRemoteDocumentCache to apply the changes to.
   * @param trackRemovals - Whether to create sentinel deletes that can be tracked by
   * `getNewDocumentChanges()`.
   */
  constructor(e, t) {
    super(), this._r = e, this.trackRemovals = t, // A map of document sizes and read times prior to applying the changes in
    // this buffer.
    this.ar = new ObjectMap((e2) => e2.toString(), (e2, t2) => e2.isEqual(t2));
  }
  applyChanges(e) {
    const t = [];
    let n = 0, r2 = new SortedSet((e2, t2) => __PRIVATE_primitiveComparator(e2.canonicalString(), t2.canonicalString()));
    return this.changes.forEach((i, s) => {
      const o = this.ar.get(i);
      if (t.push(this._r.removeEntry(e, i, o.readTime)), s.isValidDocument()) {
        const _ = __PRIVATE_toDbRemoteDocument(this._r.serializer, s);
        r2 = r2.add(i.path.popLast());
        const a = __PRIVATE_dbDocumentSize(_);
        n += a - o.size, t.push(this._r.addEntry(e, i, _));
      } else if (n -= o.size, this.trackRemovals) {
        const n2 = __PRIVATE_toDbRemoteDocument(this._r.serializer, s.convertToNoDocument(SnapshotVersion.min()));
        t.push(this._r.addEntry(e, i, n2));
      }
    }), r2.forEach((n2) => {
      t.push(this._r.indexManager.addToCollectionParentIndex(e, n2));
    }), t.push(this._r.updateMetadata(e, n)), PersistencePromise.waitFor(t);
  }
  getFromCache(e, t) {
    return this._r.nr(e, t).next((e2) => (this.ar.set(t, {
      size: e2.size,
      readTime: e2.document.readTime
    }), e2.document));
  }
  getAllFromCache(e, t) {
    return this._r.ir(e, t).next(({ documents: e2, sr: t2 }) => (
      // Note: `getAllFromCache` returns two maps instead of a single map from
      // keys to `DocumentSizeEntry`s. This is to allow returning the
      // `MutableDocumentMap` directly, without a conversion.
      (t2.forEach((t3, n) => {
        this.ar.set(t3, {
          size: n,
          readTime: e2.get(t3).readTime
        });
      }), e2)
    ));
  }
};
function __PRIVATE_documentGlobalStore(e) {
  return __PRIVATE_getStore(e, "remoteDocumentGlobal");
}
function __PRIVATE_remoteDocumentsStore(e) {
  return __PRIVATE_getStore(e, "remoteDocumentsV14");
}
function __PRIVATE_dbKey(e) {
  const t = e.path.toArray();
  return [
    /* prefix path */
    t.slice(0, t.length - 2),
    /* collection id */
    t[t.length - 2],
    /* document id */
    t[t.length - 1]
  ];
}
function __PRIVATE_dbCollectionGroupKey(e, t) {
  const n = t.documentKey.path.toArray();
  return [
    /* collection id */
    e,
    __PRIVATE_toDbTimestampKey(t.readTime),
    /* prefix path */
    n.slice(0, n.length - 2),
    /* document id */
    n.length > 0 ? n[n.length - 1] : ""
  ];
}
function __PRIVATE_dbKeyComparator(e, t) {
  const n = e.path.toArray(), r2 = t.path.toArray();
  let i = 0;
  for (let e2 = 0; e2 < n.length - 2 && e2 < r2.length - 2; ++e2)
    if (i = __PRIVATE_primitiveComparator(n[e2], r2[e2]), i)
      return i;
  return i = __PRIVATE_primitiveComparator(n.length, r2.length), i || (i = __PRIVATE_primitiveComparator(n[n.length - 2], r2[r2.length - 2]), i || __PRIVATE_primitiveComparator(n[n.length - 1], r2[r2.length - 1]));
}
var OverlayedDocument = class {
  constructor(e, t) {
    this.overlayedDocument = e, this.mutatedFields = t;
  }
};
var LocalDocumentsView = class {
  constructor(e, t, n, r2) {
    this.remoteDocumentCache = e, this.mutationQueue = t, this.documentOverlayCache = n, this.indexManager = r2;
  }
  /**
   * Get the local view of the document identified by `key`.
   *
   * @returns Local view of the document or null if we don't have any cached
   * state for it.
   */
  getDocument(e, t) {
    let n = null;
    return this.documentOverlayCache.getOverlay(e, t).next((r2) => (n = r2, this.remoteDocumentCache.getEntry(e, t))).next((e2) => (null !== n && __PRIVATE_mutationApplyToLocalView(n.mutation, e2, FieldMask.empty(), Timestamp.now()), e2));
  }
  /**
   * Gets the local view of the documents identified by `keys`.
   *
   * If we don't have cached state for a document in `keys`, a NoDocument will
   * be stored for that key in the resulting set.
   */
  getDocuments(e, t) {
    return this.remoteDocumentCache.getEntries(e, t).next((t2) => this.getLocalViewOfDocuments(e, t2, __PRIVATE_documentKeySet()).next(() => t2));
  }
  /**
   * Similar to `getDocuments`, but creates the local view from the given
   * `baseDocs` without retrieving documents from the local store.
   *
   * @param transaction - The transaction this operation is scoped to.
   * @param docs - The documents to apply local mutations to get the local views.
   * @param existenceStateChanged - The set of document keys whose existence state
   *   is changed. This is useful to determine if some documents overlay needs
   *   to be recalculated.
   */
  getLocalViewOfDocuments(e, t, n = __PRIVATE_documentKeySet()) {
    const r2 = __PRIVATE_newOverlayMap();
    return this.populateOverlays(e, r2, t).next(() => this.computeViews(e, t, r2, n).next((e2) => {
      let t2 = documentMap();
      return e2.forEach((e3, n2) => {
        t2 = t2.insert(e3, n2.overlayedDocument);
      }), t2;
    }));
  }
  /**
   * Gets the overlayed documents for the given document map, which will include
   * the local view of those documents and a `FieldMask` indicating which fields
   * are mutated locally, `null` if overlay is a Set or Delete mutation.
   */
  getOverlayedDocuments(e, t) {
    const n = __PRIVATE_newOverlayMap();
    return this.populateOverlays(e, n, t).next(() => this.computeViews(e, t, n, __PRIVATE_documentKeySet()));
  }
  /**
   * Fetches the overlays for {@code docs} and adds them to provided overlay map
   * if the map does not already contain an entry for the given document key.
   */
  populateOverlays(e, t, n) {
    const r2 = [];
    return n.forEach((e2) => {
      t.has(e2) || r2.push(e2);
    }), this.documentOverlayCache.getOverlays(e, r2).next((e2) => {
      e2.forEach((e3, n2) => {
        t.set(e3, n2);
      });
    });
  }
  /**
   * Computes the local view for the given documents.
   *
   * @param docs - The documents to compute views for. It also has the base
   *   version of the documents.
   * @param overlays - The overlays that need to be applied to the given base
   *   version of the documents.
   * @param existenceStateChanged - A set of documents whose existence states
   *   might have changed. This is used to determine if we need to re-calculate
   *   overlays from mutation queues.
   * @return A map represents the local documents view.
   */
  computeViews(e, t, n, r2) {
    let i = __PRIVATE_mutableDocumentMap();
    const s = __PRIVATE_newDocumentKeyMap(), o = function __PRIVATE_newOverlayedDocumentMap() {
      return __PRIVATE_newDocumentKeyMap();
    }();
    return t.forEach((e2, t2) => {
      const o2 = n.get(t2.key);
      r2.has(t2.key) && (void 0 === o2 || o2.mutation instanceof __PRIVATE_PatchMutation) ? i = i.insert(t2.key, t2) : void 0 !== o2 ? (s.set(t2.key, o2.mutation.getFieldMask()), __PRIVATE_mutationApplyToLocalView(o2.mutation, t2, o2.mutation.getFieldMask(), Timestamp.now())) : (
        // no overlay exists
        // Using EMPTY to indicate there is no overlay for the document.
        s.set(t2.key, FieldMask.empty())
      );
    }), this.recalculateAndSaveOverlays(e, i).next((e2) => (e2.forEach((e3, t2) => s.set(e3, t2)), t.forEach((e3, t2) => {
      var n2;
      return o.set(e3, new OverlayedDocument(t2, null !== (n2 = s.get(e3)) && void 0 !== n2 ? n2 : null));
    }), o));
  }
  recalculateAndSaveOverlays(e, t) {
    const n = __PRIVATE_newDocumentKeyMap();
    let r2 = new SortedMap((e2, t2) => e2 - t2), i = __PRIVATE_documentKeySet();
    return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e, t).next((e2) => {
      for (const i2 of e2)
        i2.keys().forEach((e3) => {
          const s = t.get(e3);
          if (null === s)
            return;
          let o = n.get(e3) || FieldMask.empty();
          o = i2.applyToLocalView(s, o), n.set(e3, o);
          const _ = (r2.get(i2.batchId) || __PRIVATE_documentKeySet()).add(e3);
          r2 = r2.insert(i2.batchId, _);
        });
    }).next(() => {
      const s = [], o = r2.getReverseIterator();
      for (; o.hasNext(); ) {
        const r3 = o.getNext(), _ = r3.key, a = r3.value, u = __PRIVATE_newMutationMap();
        a.forEach((e2) => {
          if (!i.has(e2)) {
            const r4 = __PRIVATE_calculateOverlayMutation(t.get(e2), n.get(e2));
            null !== r4 && u.set(e2, r4), i = i.add(e2);
          }
        }), s.push(this.documentOverlayCache.saveOverlays(e, _, u));
      }
      return PersistencePromise.waitFor(s);
    }).next(() => n);
  }
  /**
   * Recalculates overlays by reading the documents from remote document cache
   * first, and saves them after they are calculated.
   */
  recalculateAndSaveOverlaysForDocumentKeys(e, t) {
    return this.remoteDocumentCache.getEntries(e, t).next((t2) => this.recalculateAndSaveOverlays(e, t2));
  }
  /**
   * Performs a query against the local view of all documents.
   *
   * @param transaction - The persistence transaction.
   * @param query - The query to match documents against.
   * @param offset - Read time and key to start scanning by (exclusive).
   * @param context - A optional tracker to keep a record of important details
   *   during database local query execution.
   */
  getDocumentsMatchingQuery(e, t, n, r2) {
    return function __PRIVATE_isDocumentQuery$1(e2) {
      return DocumentKey.isDocumentKey(e2.path) && null === e2.collectionGroup && 0 === e2.filters.length;
    }(t) ? this.getDocumentsMatchingDocumentQuery(e, t.path) : __PRIVATE_isCollectionGroupQuery(t) ? this.getDocumentsMatchingCollectionGroupQuery(e, t, n, r2) : this.getDocumentsMatchingCollectionQuery(e, t, n, r2);
  }
  /**
   * Given a collection group, returns the next documents that follow the provided offset, along
   * with an updated batch ID.
   *
   * <p>The documents returned by this method are ordered by remote version from the provided
   * offset. If there are no more remote documents after the provided offset, documents with
   * mutations in order of batch id from the offset are returned. Since all documents in a batch are
   * returned together, the total number of documents returned can exceed {@code count}.
   *
   * @param transaction
   * @param collectionGroup The collection group for the documents.
   * @param offset The offset to index into.
   * @param count The number of documents to return
   * @return A LocalWriteResult with the documents that follow the provided offset and the last processed batch id.
   */
  getNextDocuments(e, t, n, r2) {
    return this.remoteDocumentCache.getAllFromCollectionGroup(e, t, n, r2).next((i) => {
      const s = r2 - i.size > 0 ? this.documentOverlayCache.getOverlaysForCollectionGroup(e, t, n.largestBatchId, r2 - i.size) : PersistencePromise.resolve(__PRIVATE_newOverlayMap());
      let o = -1, _ = i;
      return s.next((t2) => PersistencePromise.forEach(t2, (t3, n2) => (o < n2.largestBatchId && (o = n2.largestBatchId), i.get(t3) ? PersistencePromise.resolve() : this.remoteDocumentCache.getEntry(e, t3).next((e2) => {
        _ = _.insert(t3, e2);
      }))).next(() => this.populateOverlays(e, t2, i)).next(() => this.computeViews(e, _, t2, __PRIVATE_documentKeySet())).next((e2) => ({
        batchId: o,
        changes: __PRIVATE_convertOverlayedDocumentMapToDocumentMap(e2)
      })));
    });
  }
  getDocumentsMatchingDocumentQuery(e, t) {
    return this.getDocument(e, new DocumentKey(t)).next((e2) => {
      let t2 = documentMap();
      return e2.isFoundDocument() && (t2 = t2.insert(e2.key, e2)), t2;
    });
  }
  getDocumentsMatchingCollectionGroupQuery(e, t, n, r2) {
    const i = t.collectionGroup;
    let s = documentMap();
    return this.indexManager.getCollectionParents(e, i).next((o) => PersistencePromise.forEach(o, (o2) => {
      const _ = function __PRIVATE_asCollectionQueryAtPath(e2, t2) {
        return new __PRIVATE_QueryImpl(
          t2,
          /*collectionGroup=*/
          null,
          e2.explicitOrderBy.slice(),
          e2.filters.slice(),
          e2.limit,
          e2.limitType,
          e2.startAt,
          e2.endAt
        );
      }(t, o2.child(i));
      return this.getDocumentsMatchingCollectionQuery(e, _, n, r2).next((e2) => {
        e2.forEach((e3, t2) => {
          s = s.insert(e3, t2);
        });
      });
    }).next(() => s));
  }
  getDocumentsMatchingCollectionQuery(e, t, n, r2) {
    let i;
    return this.documentOverlayCache.getOverlaysForCollection(e, t.path, n.largestBatchId).next((s) => (i = s, this.remoteDocumentCache.getDocumentsMatchingQuery(e, t, n, i, r2))).next((e2) => {
      i.forEach((t2, n3) => {
        const r3 = n3.getKey();
        null === e2.get(r3) && (e2 = e2.insert(r3, MutableDocument.newInvalidDocument(r3)));
      });
      let n2 = documentMap();
      return e2.forEach((e3, r3) => {
        const s = i.get(e3);
        void 0 !== s && __PRIVATE_mutationApplyToLocalView(s.mutation, r3, FieldMask.empty(), Timestamp.now()), // Finally, insert the documents that still match the query
        __PRIVATE_queryMatches(t, r3) && (n2 = n2.insert(e3, r3));
      }), n2;
    });
  }
};
var __PRIVATE_MemoryBundleCache = class {
  constructor(e) {
    this.serializer = e, this.ur = /* @__PURE__ */ new Map(), this.cr = /* @__PURE__ */ new Map();
  }
  getBundleMetadata(e, t) {
    return PersistencePromise.resolve(this.ur.get(t));
  }
  saveBundleMetadata(e, t) {
    return this.ur.set(
      t.id,
      /** Decodes a BundleMetadata proto into a BundleMetadata object. */
      function __PRIVATE_fromBundleMetadata(e2) {
        return {
          id: e2.id,
          version: e2.version,
          createTime: __PRIVATE_fromVersion(e2.createTime)
        };
      }(t)
    ), PersistencePromise.resolve();
  }
  getNamedQuery(e, t) {
    return PersistencePromise.resolve(this.cr.get(t));
  }
  saveNamedQuery(e, t) {
    return this.cr.set(t.name, function __PRIVATE_fromProtoNamedQuery(e2) {
      return {
        name: e2.name,
        query: __PRIVATE_fromBundledQuery(e2.bundledQuery),
        readTime: __PRIVATE_fromVersion(e2.readTime)
      };
    }(t)), PersistencePromise.resolve();
  }
};
var __PRIVATE_MemoryDocumentOverlayCache = class {
  constructor() {
    this.overlays = new SortedMap(DocumentKey.comparator), this.lr = /* @__PURE__ */ new Map();
  }
  getOverlay(e, t) {
    return PersistencePromise.resolve(this.overlays.get(t));
  }
  getOverlays(e, t) {
    const n = __PRIVATE_newOverlayMap();
    return PersistencePromise.forEach(t, (t2) => this.getOverlay(e, t2).next((e2) => {
      null !== e2 && n.set(t2, e2);
    })).next(() => n);
  }
  saveOverlays(e, t, n) {
    return n.forEach((n2, r2) => {
      this.lt(e, t, r2);
    }), PersistencePromise.resolve();
  }
  removeOverlaysForBatchId(e, t, n) {
    const r2 = this.lr.get(n);
    return void 0 !== r2 && (r2.forEach((e2) => this.overlays = this.overlays.remove(e2)), this.lr.delete(n)), PersistencePromise.resolve();
  }
  getOverlaysForCollection(e, t, n) {
    const r2 = __PRIVATE_newOverlayMap(), i = t.length + 1, s = new DocumentKey(t.child("")), o = this.overlays.getIteratorFrom(s);
    for (; o.hasNext(); ) {
      const e2 = o.getNext().value, s2 = e2.getKey();
      if (!t.isPrefixOf(s2.path))
        break;
      s2.path.length === i && (e2.largestBatchId > n && r2.set(e2.getKey(), e2));
    }
    return PersistencePromise.resolve(r2);
  }
  getOverlaysForCollectionGroup(e, t, n, r2) {
    let i = new SortedMap((e2, t2) => e2 - t2);
    const s = this.overlays.getIterator();
    for (; s.hasNext(); ) {
      const e2 = s.getNext().value;
      if (e2.getKey().getCollectionGroup() === t && e2.largestBatchId > n) {
        let t2 = i.get(e2.largestBatchId);
        null === t2 && (t2 = __PRIVATE_newOverlayMap(), i = i.insert(e2.largestBatchId, t2)), t2.set(e2.getKey(), e2);
      }
    }
    const o = __PRIVATE_newOverlayMap(), _ = i.getIterator();
    for (; _.hasNext(); ) {
      if (_.getNext().value.forEach((e2, t2) => o.set(e2, t2)), o.size() >= r2)
        break;
    }
    return PersistencePromise.resolve(o);
  }
  lt(e, t, n) {
    const r2 = this.overlays.get(n.key);
    if (null !== r2) {
      const e2 = this.lr.get(r2.largestBatchId).delete(n.key);
      this.lr.set(r2.largestBatchId, e2);
    }
    this.overlays = this.overlays.insert(n.key, new Overlay(t, n));
    let i = this.lr.get(t);
    void 0 === i && (i = __PRIVATE_documentKeySet(), this.lr.set(t, i)), this.lr.set(t, i.add(n.key));
  }
};
var __PRIVATE_ReferenceSet = class {
  constructor() {
    this.hr = new SortedSet(__PRIVATE_DocReference.Pr), // A set of outstanding references to a document sorted by target id.
    this.Ir = new SortedSet(__PRIVATE_DocReference.Tr);
  }
  /** Returns true if the reference set contains no references. */
  isEmpty() {
    return this.hr.isEmpty();
  }
  /** Adds a reference to the given document key for the given ID. */
  addReference(e, t) {
    const n = new __PRIVATE_DocReference(e, t);
    this.hr = this.hr.add(n), this.Ir = this.Ir.add(n);
  }
  /** Add references to the given document keys for the given ID. */
  Er(e, t) {
    e.forEach((e2) => this.addReference(e2, t));
  }
  /**
   * Removes a reference to the given document key for the given
   * ID.
   */
  removeReference(e, t) {
    this.dr(new __PRIVATE_DocReference(e, t));
  }
  Ar(e, t) {
    e.forEach((e2) => this.removeReference(e2, t));
  }
  /**
   * Clears all references with a given ID. Calls removeRef() for each key
   * removed.
   */
  Rr(e) {
    const t = new DocumentKey(new ResourcePath([])), n = new __PRIVATE_DocReference(t, e), r2 = new __PRIVATE_DocReference(t, e + 1), i = [];
    return this.Ir.forEachInRange([n, r2], (e2) => {
      this.dr(e2), i.push(e2.key);
    }), i;
  }
  Vr() {
    this.hr.forEach((e) => this.dr(e));
  }
  dr(e) {
    this.hr = this.hr.delete(e), this.Ir = this.Ir.delete(e);
  }
  mr(e) {
    const t = new DocumentKey(new ResourcePath([])), n = new __PRIVATE_DocReference(t, e), r2 = new __PRIVATE_DocReference(t, e + 1);
    let i = __PRIVATE_documentKeySet();
    return this.Ir.forEachInRange([n, r2], (e2) => {
      i = i.add(e2.key);
    }), i;
  }
  containsKey(e) {
    const t = new __PRIVATE_DocReference(e, 0), n = this.hr.firstAfterOrEqual(t);
    return null !== n && e.isEqual(n.key);
  }
};
var __PRIVATE_DocReference = class {
  constructor(e, t) {
    this.key = e, this.gr = t;
  }
  /** Compare by key then by ID */
  static Pr(e, t) {
    return DocumentKey.comparator(e.key, t.key) || __PRIVATE_primitiveComparator(e.gr, t.gr);
  }
  /** Compare by ID then by key */
  static Tr(e, t) {
    return __PRIVATE_primitiveComparator(e.gr, t.gr) || DocumentKey.comparator(e.key, t.key);
  }
};
var __PRIVATE_MemoryMutationQueue = class {
  constructor(e, t) {
    this.indexManager = e, this.referenceDelegate = t, /**
     * The set of all mutations that have been sent but not yet been applied to
     * the backend.
     */
    this.mutationQueue = [], /** Next value to use when assigning sequential IDs to each mutation batch. */
    this.pr = 1, /** An ordered mapping between documents and the mutations batch IDs. */
    this.yr = new SortedSet(__PRIVATE_DocReference.Pr);
  }
  checkEmpty(e) {
    return PersistencePromise.resolve(0 === this.mutationQueue.length);
  }
  addMutationBatch(e, t, n, r2) {
    const i = this.pr;
    this.pr++, this.mutationQueue.length > 0 && this.mutationQueue[this.mutationQueue.length - 1];
    const s = new MutationBatch(i, t, n, r2);
    this.mutationQueue.push(s);
    for (const t2 of r2)
      this.yr = this.yr.add(new __PRIVATE_DocReference(t2.key, i)), this.indexManager.addToCollectionParentIndex(e, t2.key.path.popLast());
    return PersistencePromise.resolve(s);
  }
  lookupMutationBatch(e, t) {
    return PersistencePromise.resolve(this.wr(t));
  }
  getNextMutationBatchAfterBatchId(e, t) {
    const n = t + 1, r2 = this.Sr(n), i = r2 < 0 ? 0 : r2;
    return PersistencePromise.resolve(this.mutationQueue.length > i ? this.mutationQueue[i] : null);
  }
  getHighestUnacknowledgedBatchId() {
    return PersistencePromise.resolve(0 === this.mutationQueue.length ? -1 : this.pr - 1);
  }
  getAllMutationBatches(e) {
    return PersistencePromise.resolve(this.mutationQueue.slice());
  }
  getAllMutationBatchesAffectingDocumentKey(e, t) {
    const n = new __PRIVATE_DocReference(t, 0), r2 = new __PRIVATE_DocReference(t, Number.POSITIVE_INFINITY), i = [];
    return this.yr.forEachInRange([n, r2], (e2) => {
      const t2 = this.wr(e2.gr);
      i.push(t2);
    }), PersistencePromise.resolve(i);
  }
  getAllMutationBatchesAffectingDocumentKeys(e, t) {
    let n = new SortedSet(__PRIVATE_primitiveComparator);
    return t.forEach((e2) => {
      const t2 = new __PRIVATE_DocReference(e2, 0), r2 = new __PRIVATE_DocReference(e2, Number.POSITIVE_INFINITY);
      this.yr.forEachInRange([t2, r2], (e3) => {
        n = n.add(e3.gr);
      });
    }), PersistencePromise.resolve(this.br(n));
  }
  getAllMutationBatchesAffectingQuery(e, t) {
    const n = t.path, r2 = n.length + 1;
    let i = n;
    DocumentKey.isDocumentKey(i) || (i = i.child(""));
    const s = new __PRIVATE_DocReference(new DocumentKey(i), 0);
    let o = new SortedSet(__PRIVATE_primitiveComparator);
    return this.yr.forEachWhile((e2) => {
      const t2 = e2.key.path;
      return !!n.isPrefixOf(t2) && // Rows with document keys more than one segment longer than the query
      // path can't be matches. For example, a query on 'rooms' can't match
      // the document /rooms/abc/messages/xyx.
      // TODO(mcg): we'll need a different scanner when we implement
      // ancestor queries.
      (t2.length === r2 && (o = o.add(e2.gr)), true);
    }, s), PersistencePromise.resolve(this.br(o));
  }
  br(e) {
    const t = [];
    return e.forEach((e2) => {
      const n = this.wr(e2);
      null !== n && t.push(n);
    }), t;
  }
  removeMutationBatch(e, t) {
    __PRIVATE_hardAssert(0 === this.Dr(t.batchId, "removed")), this.mutationQueue.shift();
    let n = this.yr;
    return PersistencePromise.forEach(t.mutations, (r2) => {
      const i = new __PRIVATE_DocReference(r2.key, t.batchId);
      return n = n.delete(i), this.referenceDelegate.markPotentiallyOrphaned(e, r2.key);
    }).next(() => {
      this.yr = n;
    });
  }
  Fn(e) {
  }
  containsKey(e, t) {
    const n = new __PRIVATE_DocReference(t, 0), r2 = this.yr.firstAfterOrEqual(n);
    return PersistencePromise.resolve(t.isEqual(r2 && r2.key));
  }
  performConsistencyCheck(e) {
    return this.mutationQueue.length, PersistencePromise.resolve();
  }
  /**
   * Finds the index of the given batchId in the mutation queue and asserts that
   * the resulting index is within the bounds of the queue.
   *
   * @param batchId - The batchId to search for
   * @param action - A description of what the caller is doing, phrased in passive
   * form (e.g. "acknowledged" in a routine that acknowledges batches).
   */
  Dr(e, t) {
    return this.Sr(e);
  }
  /**
   * Finds the index of the given batchId in the mutation queue. This operation
   * is O(1).
   *
   * @returns The computed index of the batch with the given batchId, based on
   * the state of the queue. Note this index can be negative if the requested
   * batchId has already been remvoed from the queue or past the end of the
   * queue if the batchId is larger than the last added batch.
   */
  Sr(e) {
    if (0 === this.mutationQueue.length)
      return 0;
    return e - this.mutationQueue[0].batchId;
  }
  /**
   * A version of lookupMutationBatch that doesn't return a promise, this makes
   * other functions that uses this code easier to read and more efficent.
   */
  wr(e) {
    const t = this.Sr(e);
    if (t < 0 || t >= this.mutationQueue.length)
      return null;
    return this.mutationQueue[t];
  }
};
var __PRIVATE_MemoryRemoteDocumentCacheImpl = class {
  /**
   * @param sizer - Used to assess the size of a document. For eager GC, this is
   * expected to just return 0 to avoid unnecessarily doing the work of
   * calculating the size.
   */
  constructor(e) {
    this.Cr = e, /** Underlying cache of documents and their read times. */
    this.docs = function __PRIVATE_documentEntryMap() {
      return new SortedMap(DocumentKey.comparator);
    }(), /** Size of all cached documents. */
    this.size = 0;
  }
  setIndexManager(e) {
    this.indexManager = e;
  }
  /**
   * Adds the supplied entry to the cache and updates the cache size as appropriate.
   *
   * All calls of `addEntry`  are required to go through the RemoteDocumentChangeBuffer
   * returned by `newChangeBuffer()`.
   */
  addEntry(e, t) {
    const n = t.key, r2 = this.docs.get(n), i = r2 ? r2.size : 0, s = this.Cr(t);
    return this.docs = this.docs.insert(n, {
      document: t.mutableCopy(),
      size: s
    }), this.size += s - i, this.indexManager.addToCollectionParentIndex(e, n.path.popLast());
  }
  /**
   * Removes the specified entry from the cache and updates the cache size as appropriate.
   *
   * All calls of `removeEntry` are required to go through the RemoteDocumentChangeBuffer
   * returned by `newChangeBuffer()`.
   */
  removeEntry(e) {
    const t = this.docs.get(e);
    t && (this.docs = this.docs.remove(e), this.size -= t.size);
  }
  getEntry(e, t) {
    const n = this.docs.get(t);
    return PersistencePromise.resolve(n ? n.document.mutableCopy() : MutableDocument.newInvalidDocument(t));
  }
  getEntries(e, t) {
    let n = __PRIVATE_mutableDocumentMap();
    return t.forEach((e2) => {
      const t2 = this.docs.get(e2);
      n = n.insert(e2, t2 ? t2.document.mutableCopy() : MutableDocument.newInvalidDocument(e2));
    }), PersistencePromise.resolve(n);
  }
  getDocumentsMatchingQuery(e, t, n, r2) {
    let i = __PRIVATE_mutableDocumentMap();
    const s = t.path, o = new DocumentKey(s.child("")), _ = this.docs.getIteratorFrom(o);
    for (; _.hasNext(); ) {
      const { key: e2, value: { document: o2 } } = _.getNext();
      if (!s.isPrefixOf(e2.path))
        break;
      e2.path.length > s.length + 1 || (__PRIVATE_indexOffsetComparator(__PRIVATE_newIndexOffsetFromDocument(o2), n) <= 0 || (r2.has(o2.key) || __PRIVATE_queryMatches(t, o2)) && (i = i.insert(o2.key, o2.mutableCopy())));
    }
    return PersistencePromise.resolve(i);
  }
  getAllFromCollectionGroup(e, t, n, r2) {
    fail();
  }
  vr(e, t) {
    return PersistencePromise.forEach(this.docs, (e2) => t(e2));
  }
  newChangeBuffer(e) {
    return new __PRIVATE_MemoryRemoteDocumentChangeBuffer(this);
  }
  getSize(e) {
    return PersistencePromise.resolve(this.size);
  }
};
var __PRIVATE_MemoryRemoteDocumentChangeBuffer = class extends RemoteDocumentChangeBuffer {
  constructor(e) {
    super(), this._r = e;
  }
  applyChanges(e) {
    const t = [];
    return this.changes.forEach((n, r2) => {
      r2.isValidDocument() ? t.push(this._r.addEntry(e, r2)) : this._r.removeEntry(n);
    }), PersistencePromise.waitFor(t);
  }
  getFromCache(e, t) {
    return this._r.getEntry(e, t);
  }
  getAllFromCache(e, t) {
    return this._r.getEntries(e, t);
  }
};
var __PRIVATE_MemoryTargetCache = class {
  constructor(e) {
    this.persistence = e, /**
     * Maps a target to the data about that target
     */
    this.Fr = new ObjectMap((e2) => __PRIVATE_canonifyTarget(e2), __PRIVATE_targetEquals), /** The last received snapshot version. */
    this.lastRemoteSnapshotVersion = SnapshotVersion.min(), /** The highest numbered target ID encountered. */
    this.highestTargetId = 0, /** The highest sequence number encountered. */
    this.Mr = 0, /**
     * A ordered bidirectional mapping between documents and the remote target
     * IDs.
     */
    this.Or = new __PRIVATE_ReferenceSet(), this.targetCount = 0, this.Nr = __PRIVATE_TargetIdGenerator.On();
  }
  forEachTarget(e, t) {
    return this.Fr.forEach((e2, n) => t(n)), PersistencePromise.resolve();
  }
  getLastRemoteSnapshotVersion(e) {
    return PersistencePromise.resolve(this.lastRemoteSnapshotVersion);
  }
  getHighestSequenceNumber(e) {
    return PersistencePromise.resolve(this.Mr);
  }
  allocateTargetId(e) {
    return this.highestTargetId = this.Nr.next(), PersistencePromise.resolve(this.highestTargetId);
  }
  setTargetsMetadata(e, t, n) {
    return n && (this.lastRemoteSnapshotVersion = n), t > this.Mr && (this.Mr = t), PersistencePromise.resolve();
  }
  kn(e) {
    this.Fr.set(e.target, e);
    const t = e.targetId;
    t > this.highestTargetId && (this.Nr = new __PRIVATE_TargetIdGenerator(t), this.highestTargetId = t), e.sequenceNumber > this.Mr && (this.Mr = e.sequenceNumber);
  }
  addTargetData(e, t) {
    return this.kn(t), this.targetCount += 1, PersistencePromise.resolve();
  }
  updateTargetData(e, t) {
    return this.kn(t), PersistencePromise.resolve();
  }
  removeTargetData(e, t) {
    return this.Fr.delete(t.target), this.Or.Rr(t.targetId), this.targetCount -= 1, PersistencePromise.resolve();
  }
  removeTargets(e, t, n) {
    let r2 = 0;
    const i = [];
    return this.Fr.forEach((s, o) => {
      o.sequenceNumber <= t && null === n.get(o.targetId) && (this.Fr.delete(s), i.push(this.removeMatchingKeysForTargetId(e, o.targetId)), r2++);
    }), PersistencePromise.waitFor(i).next(() => r2);
  }
  getTargetCount(e) {
    return PersistencePromise.resolve(this.targetCount);
  }
  getTargetData(e, t) {
    const n = this.Fr.get(t) || null;
    return PersistencePromise.resolve(n);
  }
  addMatchingKeys(e, t, n) {
    return this.Or.Er(t, n), PersistencePromise.resolve();
  }
  removeMatchingKeys(e, t, n) {
    this.Or.Ar(t, n);
    const r2 = this.persistence.referenceDelegate, i = [];
    return r2 && t.forEach((t2) => {
      i.push(r2.markPotentiallyOrphaned(e, t2));
    }), PersistencePromise.waitFor(i);
  }
  removeMatchingKeysForTargetId(e, t) {
    return this.Or.Rr(t), PersistencePromise.resolve();
  }
  getMatchingKeysForTargetId(e, t) {
    const n = this.Or.mr(t);
    return PersistencePromise.resolve(n);
  }
  containsKey(e, t) {
    return PersistencePromise.resolve(this.Or.containsKey(t));
  }
};
var __PRIVATE_MemoryPersistence = class {
  /**
   * The constructor accepts a factory for creating a reference delegate. This
   * allows both the delegate and this instance to have strong references to
   * each other without having nullable fields that would then need to be
   * checked or asserted on every access.
   */
  constructor(e, t) {
    this.Br = {}, this.overlays = {}, this.Lr = new __PRIVATE_ListenSequence(0), this.kr = false, this.kr = true, this.referenceDelegate = e(this), this.qr = new __PRIVATE_MemoryTargetCache(this);
    this.indexManager = new __PRIVATE_MemoryIndexManager(), this.remoteDocumentCache = function __PRIVATE_newMemoryRemoteDocumentCache(e2) {
      return new __PRIVATE_MemoryRemoteDocumentCacheImpl(e2);
    }((e2) => this.referenceDelegate.Qr(e2)), this.serializer = new __PRIVATE_LocalSerializer(t), this.Kr = new __PRIVATE_MemoryBundleCache(this.serializer);
  }
  start() {
    return Promise.resolve();
  }
  shutdown() {
    return this.kr = false, Promise.resolve();
  }
  get started() {
    return this.kr;
  }
  setDatabaseDeletedListener() {
  }
  setNetworkEnabled() {
  }
  getIndexManager(e) {
    return this.indexManager;
  }
  getDocumentOverlayCache(e) {
    let t = this.overlays[e.toKey()];
    return t || (t = new __PRIVATE_MemoryDocumentOverlayCache(), this.overlays[e.toKey()] = t), t;
  }
  getMutationQueue(e, t) {
    let n = this.Br[e.toKey()];
    return n || (n = new __PRIVATE_MemoryMutationQueue(t, this.referenceDelegate), this.Br[e.toKey()] = n), n;
  }
  getTargetCache() {
    return this.qr;
  }
  getRemoteDocumentCache() {
    return this.remoteDocumentCache;
  }
  getBundleCache() {
    return this.Kr;
  }
  runTransaction(e, t, n) {
    __PRIVATE_logDebug("MemoryPersistence", "Starting transaction:", e);
    const r2 = new __PRIVATE_MemoryTransaction(this.Lr.next());
    return this.referenceDelegate.$r(), n(r2).next((e2) => this.referenceDelegate.Ur(r2).next(() => e2)).toPromise().then((e2) => (r2.raiseOnCommittedEvent(), e2));
  }
  Wr(e, t) {
    return PersistencePromise.or(Object.values(this.Br).map((n) => () => n.containsKey(e, t)));
  }
};
var __PRIVATE_MemoryTransaction = class extends PersistenceTransaction {
  constructor(e) {
    super(), this.currentSequenceNumber = e;
  }
};
var __PRIVATE_MemoryEagerDelegate = class ___PRIVATE_MemoryEagerDelegate {
  constructor(e) {
    this.persistence = e, /** Tracks all documents that are active in Query views. */
    this.Gr = new __PRIVATE_ReferenceSet(), /** The list of documents that are potentially GCed after each transaction. */
    this.zr = null;
  }
  static jr(e) {
    return new ___PRIVATE_MemoryEagerDelegate(e);
  }
  get Hr() {
    if (this.zr)
      return this.zr;
    throw fail();
  }
  addReference(e, t, n) {
    return this.Gr.addReference(n, t), this.Hr.delete(n.toString()), PersistencePromise.resolve();
  }
  removeReference(e, t, n) {
    return this.Gr.removeReference(n, t), this.Hr.add(n.toString()), PersistencePromise.resolve();
  }
  markPotentiallyOrphaned(e, t) {
    return this.Hr.add(t.toString()), PersistencePromise.resolve();
  }
  removeTarget(e, t) {
    this.Gr.Rr(t.targetId).forEach((e2) => this.Hr.add(e2.toString()));
    const n = this.persistence.getTargetCache();
    return n.getMatchingKeysForTargetId(e, t.targetId).next((e2) => {
      e2.forEach((e3) => this.Hr.add(e3.toString()));
    }).next(() => n.removeTargetData(e, t));
  }
  $r() {
    this.zr = /* @__PURE__ */ new Set();
  }
  Ur(e) {
    const t = this.persistence.getRemoteDocumentCache().newChangeBuffer();
    return PersistencePromise.forEach(this.Hr, (n) => {
      const r2 = DocumentKey.fromPath(n);
      return this.Jr(e, r2).next((e2) => {
        e2 || t.removeEntry(r2, SnapshotVersion.min());
      });
    }).next(() => (this.zr = null, t.apply(e)));
  }
  updateLimboDocument(e, t) {
    return this.Jr(e, t).next((e2) => {
      e2 ? this.Hr.delete(t.toString()) : this.Hr.add(t.toString());
    });
  }
  Qr(e) {
    return 0;
  }
  Jr(e, t) {
    return PersistencePromise.or([() => PersistencePromise.resolve(this.Gr.containsKey(t)), () => this.persistence.getTargetCache().containsKey(e, t), () => this.persistence.Wr(e, t)]);
  }
};
var __PRIVATE_MemoryLruDelegate = class ___PRIVATE_MemoryLruDelegate {
  constructor(e, t) {
    this.persistence = e, this.Yr = new ObjectMap((e2) => __PRIVATE_encodeResourcePath(e2.path), (e2, t2) => e2.isEqual(t2)), this.garbageCollector = __PRIVATE_newLruGarbageCollector(this, t);
  }
  static jr(e, t) {
    return new ___PRIVATE_MemoryLruDelegate(e, t);
  }
  // No-ops, present so memory persistence doesn't have to care which delegate
  // it has.
  $r() {
  }
  Ur(e) {
    return PersistencePromise.resolve();
  }
  forEachTarget(e, t) {
    return this.persistence.getTargetCache().forEachTarget(e, t);
  }
  jn(e) {
    const t = this.Yn(e);
    return this.persistence.getTargetCache().getTargetCount(e).next((e2) => t.next((t2) => e2 + t2));
  }
  Yn(e) {
    let t = 0;
    return this.Hn(e, (e2) => {
      t++;
    }).next(() => t);
  }
  Hn(e, t) {
    return PersistencePromise.forEach(this.Yr, (n, r2) => this.Xn(e, n, r2).next((e2) => e2 ? PersistencePromise.resolve() : t(r2)));
  }
  removeTargets(e, t, n) {
    return this.persistence.getTargetCache().removeTargets(e, t, n);
  }
  removeOrphanedDocuments(e, t) {
    let n = 0;
    const r2 = this.persistence.getRemoteDocumentCache(), i = r2.newChangeBuffer();
    return r2.vr(e, (r3) => this.Xn(e, r3, t).next((e2) => {
      e2 || (n++, i.removeEntry(r3, SnapshotVersion.min()));
    })).next(() => i.apply(e)).next(() => n);
  }
  markPotentiallyOrphaned(e, t) {
    return this.Yr.set(t, e.currentSequenceNumber), PersistencePromise.resolve();
  }
  removeTarget(e, t) {
    const n = t.withSequenceNumber(e.currentSequenceNumber);
    return this.persistence.getTargetCache().updateTargetData(e, n);
  }
  addReference(e, t, n) {
    return this.Yr.set(n, e.currentSequenceNumber), PersistencePromise.resolve();
  }
  removeReference(e, t, n) {
    return this.Yr.set(n, e.currentSequenceNumber), PersistencePromise.resolve();
  }
  updateLimboDocument(e, t) {
    return this.Yr.set(t, e.currentSequenceNumber), PersistencePromise.resolve();
  }
  Qr(e) {
    let t = e.key.toString().length;
    return e.isFoundDocument() && (t += __PRIVATE_estimateByteSize(e.data.value)), t;
  }
  Xn(e, t, n) {
    return PersistencePromise.or([() => this.persistence.Wr(e, t), () => this.persistence.getTargetCache().containsKey(e, t), () => {
      const e2 = this.Yr.get(t);
      return PersistencePromise.resolve(void 0 !== e2 && e2 > n);
    }]);
  }
  getCacheSize(e) {
    return this.persistence.getRemoteDocumentCache().getSize(e);
  }
};
var __PRIVATE_SchemaConverter = class {
  constructor(e) {
    this.serializer = e;
  }
  /**
   * Performs database creation and schema upgrades.
   *
   * Note that in production, this method is only ever used to upgrade the schema
   * to SCHEMA_VERSION. Different values of toVersion are only used for testing
   * and local feature development.
   */
  N(e, t, n, r2) {
    const i = new __PRIVATE_SimpleDbTransaction("createOrUpgrade", t);
    n < 1 && r2 >= 1 && (!function __PRIVATE_createPrimaryClientStore(e2) {
      e2.createObjectStore("owner");
    }(e), function __PRIVATE_createMutationQueue(e2) {
      e2.createObjectStore("mutationQueues", {
        keyPath: "userId"
      });
      e2.createObjectStore("mutations", {
        keyPath: "batchId",
        autoIncrement: true
      }).createIndex("userMutationsIndex", M2, {
        unique: true
      }), e2.createObjectStore("documentMutations");
    }(e), __PRIVATE_createQueryCache(e), function __PRIVATE_createLegacyRemoteDocumentCache(e2) {
      e2.createObjectStore("remoteDocuments");
    }(e));
    let s = PersistencePromise.resolve();
    return n < 3 && r2 >= 3 && // Brand new clients don't need to drop and recreate--only clients that
    // potentially have corrupt data.
    (0 !== n && (!function __PRIVATE_dropQueryCache(e2) {
      e2.deleteObjectStore("targetDocuments"), e2.deleteObjectStore("targets"), e2.deleteObjectStore("targetGlobal");
    }(e), __PRIVATE_createQueryCache(e)), s = s.next(() => (
      /**
      * Creates the target global singleton row.
      *
      * @param txn - The version upgrade transaction for indexeddb
      */
      function __PRIVATE_writeEmptyTargetGlobalEntry(e2) {
        const t2 = e2.store("targetGlobal"), n2 = {
          highestTargetId: 0,
          highestListenSequenceNumber: 0,
          lastRemoteSnapshotVersion: SnapshotVersion.min().toTimestamp(),
          targetCount: 0
        };
        return t2.put("targetGlobalKey", n2);
      }(i)
    ))), n < 4 && r2 >= 4 && (0 !== n && // Schema version 3 uses auto-generated keys to generate globally unique
    // mutation batch IDs (this was previously ensured internally by the
    // client). To migrate to the new schema, we have to read all mutations
    // and write them back out. We preserve the existing batch IDs to guarantee
    // consistency with other object stores. Any further mutation batch IDs will
    // be auto-generated.
    (s = s.next(() => function __PRIVATE_upgradeMutationBatchSchemaAndMigrateData(e2, t2) {
      return t2.store("mutations").W().next((n2) => {
        e2.deleteObjectStore("mutations");
        e2.createObjectStore("mutations", {
          keyPath: "batchId",
          autoIncrement: true
        }).createIndex("userMutationsIndex", M2, {
          unique: true
        });
        const r3 = t2.store("mutations"), i2 = n2.map((e3) => r3.put(e3));
        return PersistencePromise.waitFor(i2);
      });
    }(e, i))), s = s.next(() => {
      !function __PRIVATE_createClientMetadataStore(e2) {
        e2.createObjectStore("clientMetadata", {
          keyPath: "clientId"
        });
      }(e);
    })), n < 5 && r2 >= 5 && (s = s.next(() => this.Zr(i))), n < 6 && r2 >= 6 && (s = s.next(() => (function __PRIVATE_createDocumentGlobalStore(e2) {
      e2.createObjectStore("remoteDocumentGlobal");
    }(e), this.Xr(i)))), n < 7 && r2 >= 7 && (s = s.next(() => this.ei(i))), n < 8 && r2 >= 8 && (s = s.next(() => this.ti(e, i))), n < 9 && r2 >= 9 && (s = s.next(() => {
      !function __PRIVATE_dropRemoteDocumentChangesStore(e2) {
        e2.objectStoreNames.contains("remoteDocumentChanges") && e2.deleteObjectStore("remoteDocumentChanges");
      }(e);
    })), n < 10 && r2 >= 10 && (s = s.next(() => this.ni(i))), n < 11 && r2 >= 11 && (s = s.next(() => {
      !function __PRIVATE_createBundlesStore(e2) {
        e2.createObjectStore("bundles", {
          keyPath: "bundleId"
        });
      }(e), function __PRIVATE_createNamedQueriesStore(e2) {
        e2.createObjectStore("namedQueries", {
          keyPath: "name"
        });
      }(e);
    })), n < 12 && r2 >= 12 && (s = s.next(() => {
      !function __PRIVATE_createDocumentOverlayStore(e2) {
        const t2 = e2.createObjectStore("documentOverlays", {
          keyPath: G2
        });
        t2.createIndex("collectionPathOverlayIndex", z2, {
          unique: false
        }), t2.createIndex("collectionGroupOverlayIndex", j, {
          unique: false
        });
      }(e);
    })), n < 13 && r2 >= 13 && (s = s.next(() => function __PRIVATE_createRemoteDocumentCache(e2) {
      const t2 = e2.createObjectStore("remoteDocumentsV14", {
        keyPath: O2
      });
      t2.createIndex("documentKeyIndex", N2), t2.createIndex("collectionGroupIndex", B2);
    }(e)).next(() => this.ri(e, i)).next(() => e.deleteObjectStore("remoteDocuments"))), n < 14 && r2 >= 14 && (s = s.next(() => this.ii(e, i))), n < 15 && r2 >= 15 && (s = s.next(() => function __PRIVATE_createFieldIndex(e2) {
      e2.createObjectStore("indexConfiguration", {
        keyPath: "indexId",
        autoIncrement: true
      }).createIndex("collectionGroupIndex", "collectionGroup", {
        unique: false
      });
      e2.createObjectStore("indexState", {
        keyPath: K2
      }).createIndex("sequenceNumberIndex", $, {
        unique: false
      });
      e2.createObjectStore("indexEntries", {
        keyPath: U2
      }).createIndex("documentKeyIndex", W2, {
        unique: false
      });
    }(e))), s;
  }
  Xr(e) {
    let t = 0;
    return e.store("remoteDocuments").Y((e2, n) => {
      t += __PRIVATE_dbDocumentSize(n);
    }).next(() => {
      const n = {
        byteSize: t
      };
      return e.store("remoteDocumentGlobal").put("remoteDocumentGlobalKey", n);
    });
  }
  Zr(e) {
    const t = e.store("mutationQueues"), n = e.store("mutations");
    return t.W().next((t2) => PersistencePromise.forEach(t2, (t3) => {
      const r2 = IDBKeyRange.bound([t3.userId, -1], [t3.userId, t3.lastAcknowledgedBatchId]);
      return n.W("userMutationsIndex", r2).next((n2) => PersistencePromise.forEach(n2, (n3) => {
        __PRIVATE_hardAssert(n3.userId === t3.userId);
        const r3 = __PRIVATE_fromDbMutationBatch(this.serializer, n3);
        return removeMutationBatch(e, t3.userId, r3).next(() => {
        });
      }));
    }));
  }
  /**
   * Ensures that every document in the remote document cache has a corresponding sentinel row
   * with a sequence number. Missing rows are given the most recently used sequence number.
   */
  ei(e) {
    const t = e.store("targetDocuments"), n = e.store("remoteDocuments");
    return e.store("targetGlobal").get("targetGlobalKey").next((e2) => {
      const r2 = [];
      return n.Y((n2, i) => {
        const s = new ResourcePath(n2), o = function __PRIVATE_sentinelKey(e3) {
          return [0, __PRIVATE_encodeResourcePath(e3)];
        }(s);
        r2.push(t.get(o).next((n3) => n3 ? PersistencePromise.resolve() : ((n4) => t.put({
          targetId: 0,
          path: __PRIVATE_encodeResourcePath(n4),
          sequenceNumber: e2.highestListenSequenceNumber
        }))(s)));
      }).next(() => PersistencePromise.waitFor(r2));
    });
  }
  ti(e, t) {
    e.createObjectStore("collectionParents", {
      keyPath: Q2
    });
    const n = t.store("collectionParents"), r2 = new __PRIVATE_MemoryCollectionParentIndex(), addEntry = (e2) => {
      if (r2.add(e2)) {
        const t2 = e2.lastSegment(), r3 = e2.popLast();
        return n.put({
          collectionId: t2,
          parent: __PRIVATE_encodeResourcePath(r3)
        });
      }
    };
    return t.store("remoteDocuments").Y({
      J: true
    }, (e2, t2) => {
      const n2 = new ResourcePath(e2);
      return addEntry(n2.popLast());
    }).next(() => t.store("documentMutations").Y({
      J: true
    }, ([e2, t2, n2], r3) => {
      const i = __PRIVATE_decodeResourcePath(t2);
      return addEntry(i.popLast());
    }));
  }
  ni(e) {
    const t = e.store("targets");
    return t.Y((e2, n) => {
      const r2 = __PRIVATE_fromDbTarget(n), i = __PRIVATE_toDbTarget(this.serializer, r2);
      return t.put(i);
    });
  }
  ri(e, t) {
    const n = t.store("remoteDocuments"), r2 = [];
    return n.Y((e2, n2) => {
      const i = t.store("remoteDocumentsV14"), s = function __PRIVATE_extractKey(e3) {
        return e3.document ? new DocumentKey(ResourcePath.fromString(e3.document.name).popFirst(5)) : e3.noDocument ? DocumentKey.fromSegments(e3.noDocument.path) : e3.unknownDocument ? DocumentKey.fromSegments(e3.unknownDocument.path) : fail();
      }(n2).path.toArray(), o = {
        prefixPath: s.slice(0, s.length - 2),
        collectionGroup: s[s.length - 2],
        documentId: s[s.length - 1],
        readTime: n2.readTime || [0, 0],
        unknownDocument: n2.unknownDocument,
        noDocument: n2.noDocument,
        document: n2.document,
        hasCommittedMutations: !!n2.hasCommittedMutations
      };
      r2.push(i.put(o));
    }).next(() => PersistencePromise.waitFor(r2));
  }
  ii(e, t) {
    const n = t.store("mutations"), r2 = __PRIVATE_newIndexedDbRemoteDocumentCache(this.serializer), i = new __PRIVATE_MemoryPersistence(__PRIVATE_MemoryEagerDelegate.jr, this.serializer.ut);
    return n.W().next((e2) => {
      const n2 = /* @__PURE__ */ new Map();
      return e2.forEach((e3) => {
        var t2;
        let r3 = null !== (t2 = n2.get(e3.userId)) && void 0 !== t2 ? t2 : __PRIVATE_documentKeySet();
        __PRIVATE_fromDbMutationBatch(this.serializer, e3).keys().forEach((e4) => r3 = r3.add(e4)), n2.set(e3.userId, r3);
      }), PersistencePromise.forEach(n2, (e3, n3) => {
        const s = new User(n3), o = __PRIVATE_IndexedDbDocumentOverlayCache.ct(this.serializer, s), _ = i.getIndexManager(s), a = __PRIVATE_IndexedDbMutationQueue.ct(s, this.serializer, _, i.referenceDelegate);
        return new LocalDocumentsView(r2, a, o, _).recalculateAndSaveOverlaysForDocumentKeys(new __PRIVATE_IndexedDbTransaction(t, __PRIVATE_ListenSequence._e), e3).next();
      });
    });
  }
};
function __PRIVATE_createQueryCache(e) {
  e.createObjectStore("targetDocuments", {
    keyPath: k2
  }).createIndex("documentTargetsIndex", q2, {
    unique: true
  });
  e.createObjectStore("targets", {
    keyPath: "targetId"
  }).createIndex("queryTargetsIndex", L, {
    unique: true
  }), e.createObjectStore("targetGlobal");
}
var de = "Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";
var __PRIVATE_IndexedDbPersistence = class ___PRIVATE_IndexedDbPersistence {
  constructor(e, t, n, r2, i, s, o, _, a, u, c = 15) {
    if (this.allowTabSynchronization = e, this.persistenceKey = t, this.clientId = n, this.si = i, this.window = s, this.document = o, this.oi = a, this._i = u, this.ai = c, this.Lr = null, this.kr = false, this.isPrimary = false, this.networkEnabled = true, /** Our window.unload handler, if registered. */
    this.ui = null, this.inForeground = false, /** Our 'visibilitychange' listener if registered. */
    this.ci = null, /** The client metadata refresh task. */
    this.li = null, /** The last time we garbage collected the client metadata object store. */
    this.hi = Number.NEGATIVE_INFINITY, /** A listener to notify on primary state changes. */
    this.Pi = (e2) => Promise.resolve(), !___PRIVATE_IndexedDbPersistence.D())
      throw new FirestoreError(D2.UNIMPLEMENTED, "This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");
    this.referenceDelegate = new __PRIVATE_IndexedDbLruDelegateImpl(this, r2), this.Ii = t + "main", this.serializer = new __PRIVATE_LocalSerializer(_), this.Ti = new __PRIVATE_SimpleDb(this.Ii, this.ai, new __PRIVATE_SchemaConverter(this.serializer)), this.qr = new __PRIVATE_IndexedDbTargetCache(this.referenceDelegate, this.serializer), this.remoteDocumentCache = __PRIVATE_newIndexedDbRemoteDocumentCache(this.serializer), this.Kr = new __PRIVATE_IndexedDbBundleCache(), this.window && this.window.localStorage ? this.Ei = this.window.localStorage : (this.Ei = null, false === u && __PRIVATE_logError("IndexedDbPersistence", "LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."));
  }
  /**
   * Attempt to start IndexedDb persistence.
   *
   * @returns Whether persistence was enabled.
   */
  start() {
    return this.di().then(() => {
      if (!this.isPrimary && !this.allowTabSynchronization)
        throw new FirestoreError(D2.FAILED_PRECONDITION, de);
      return this.Ai(), this.Ri(), this.Vi(), this.runTransaction("getHighestListenSequenceNumber", "readonly", (e) => this.qr.getHighestSequenceNumber(e));
    }).then((e) => {
      this.Lr = new __PRIVATE_ListenSequence(e, this.oi);
    }).then(() => {
      this.kr = true;
    }).catch((e) => (this.Ti && this.Ti.close(), Promise.reject(e)));
  }
  /**
   * Registers a listener that gets called when the primary state of the
   * instance changes. Upon registering, this listener is invoked immediately
   * with the current primary state.
   *
   * PORTING NOTE: This is only used for Web multi-tab.
   */
  mi(e) {
    return this.Pi = (t) => __async(this, null, function* () {
      if (this.started)
        return e(t);
    }), e(this.isPrimary);
  }
  /**
   * Registers a listener that gets called when the database receives a
   * version change event indicating that it has deleted.
   *
   * PORTING NOTE: This is only used for Web multi-tab.
   */
  setDatabaseDeletedListener(e) {
    this.Ti.L((t) => __async(this, null, function* () {
      null === t.newVersion && (yield e());
    }));
  }
  /**
   * Adjusts the current network state in the client's metadata, potentially
   * affecting the primary lease.
   *
   * PORTING NOTE: This is only used for Web multi-tab.
   */
  setNetworkEnabled(e) {
    this.networkEnabled !== e && (this.networkEnabled = e, // Schedule a primary lease refresh for immediate execution. The eventual
    // lease update will be propagated via `primaryStateListener`.
    this.si.enqueueAndForget(() => __async(this, null, function* () {
      this.started && (yield this.di());
    })));
  }
  /**
   * Updates the client metadata in IndexedDb and attempts to either obtain or
   * extend the primary lease for the local client. Asynchronously notifies the
   * primary state listener if the client either newly obtained or released its
   * primary lease.
   */
  di() {
    return this.runTransaction("updateClientMetadataAndTryBecomePrimary", "readwrite", (e) => __PRIVATE_clientMetadataStore(e).put({
      clientId: this.clientId,
      updateTimeMs: Date.now(),
      networkEnabled: this.networkEnabled,
      inForeground: this.inForeground
    }).next(() => {
      if (this.isPrimary)
        return this.fi(e).next((e2) => {
          e2 || (this.isPrimary = false, this.si.enqueueRetryable(() => this.Pi(false)));
        });
    }).next(() => this.gi(e)).next((t) => this.isPrimary && !t ? this.pi(e).next(() => false) : !!t && this.yi(e).next(() => true))).catch((e) => {
      if (__PRIVATE_isIndexedDbTransactionError(e))
        return __PRIVATE_logDebug("IndexedDbPersistence", "Failed to extend owner lease: ", e), this.isPrimary;
      if (!this.allowTabSynchronization)
        throw e;
      return __PRIVATE_logDebug("IndexedDbPersistence", "Releasing owner lease after error during lease refresh", e), /* isPrimary= */
      false;
    }).then((e) => {
      this.isPrimary !== e && this.si.enqueueRetryable(() => this.Pi(e)), this.isPrimary = e;
    });
  }
  fi(e) {
    return __PRIVATE_primaryClientStore(e).get("owner").next((e2) => PersistencePromise.resolve(this.wi(e2)));
  }
  Si(e) {
    return __PRIVATE_clientMetadataStore(e).delete(this.clientId);
  }
  /**
   * If the garbage collection threshold has passed, prunes the
   * RemoteDocumentChanges and the ClientMetadata store based on the last update
   * time of all clients.
   */
  bi() {
    return __async(this, null, function* () {
      if (this.isPrimary && !this.Di(this.hi, 18e5)) {
        this.hi = Date.now();
        const e = yield this.runTransaction("maybeGarbageCollectMultiClientState", "readwrite-primary", (e2) => {
          const t = __PRIVATE_getStore(e2, "clientMetadata");
          return t.W().next((e3) => {
            const n = this.Ci(e3, 18e5), r2 = e3.filter((e4) => -1 === n.indexOf(e4));
            return PersistencePromise.forEach(r2, (e4) => t.delete(e4.clientId)).next(() => r2);
          });
        }).catch(() => []);
        if (this.Ei)
          for (const t of e)
            this.Ei.removeItem(this.vi(t.clientId));
      }
    });
  }
  /**
   * Schedules a recurring timer to update the client metadata and to either
   * extend or acquire the primary lease if the client is eligible.
   */
  Vi() {
    this.li = this.si.enqueueAfterDelay("client_metadata_refresh", 4e3, () => this.di().then(() => this.bi()).then(() => this.Vi()));
  }
  /** Checks whether `client` is the local client. */
  wi(e) {
    return !!e && e.ownerId === this.clientId;
  }
  /**
   * Evaluate the state of all active clients and determine whether the local
   * client is or can act as the holder of the primary lease. Returns whether
   * the client is eligible for the lease, but does not actually acquire it.
   * May return 'false' even if there is no active leaseholder and another
   * (foreground) client should become leaseholder instead.
   */
  gi(e) {
    if (this._i)
      return PersistencePromise.resolve(true);
    return __PRIVATE_primaryClientStore(e).get("owner").next((t) => {
      if (null !== t && this.Di(t.leaseTimestampMs, 5e3) && !this.Fi(t.ownerId)) {
        if (this.wi(t) && this.networkEnabled)
          return true;
        if (!this.wi(t)) {
          if (!t.allowTabSynchronization)
            throw new FirestoreError(D2.FAILED_PRECONDITION, de);
          return false;
        }
      }
      return !(!this.networkEnabled || !this.inForeground) || __PRIVATE_clientMetadataStore(e).W().next((e2) => void 0 === this.Ci(e2, 5e3).find((e3) => {
        if (this.clientId !== e3.clientId) {
          const t2 = !this.networkEnabled && e3.networkEnabled, n = !this.inForeground && e3.inForeground, r2 = this.networkEnabled === e3.networkEnabled;
          if (t2 || n && r2)
            return true;
        }
        return false;
      }));
    }).next((e2) => (this.isPrimary !== e2 && __PRIVATE_logDebug("IndexedDbPersistence", `Client ${e2 ? "is" : "is not"} eligible for a primary lease.`), e2));
  }
  shutdown() {
    return __async(this, null, function* () {
      this.kr = false, this.Mi(), this.li && (this.li.cancel(), this.li = null), this.xi(), this.Oi(), // Use `SimpleDb.runTransaction` directly to avoid failing if another tab
      // has obtained the primary lease.
      yield this.Ti.runTransaction("shutdown", "readwrite", ["owner", "clientMetadata"], (e) => {
        const t = new __PRIVATE_IndexedDbTransaction(e, __PRIVATE_ListenSequence._e);
        return this.pi(t).next(() => this.Si(t));
      }), this.Ti.close(), // Remove the entry marking the client as zombied from LocalStorage since
      // we successfully deleted its metadata from IndexedDb.
      this.Ni();
    });
  }
  /**
   * Returns clients that are not zombied and have an updateTime within the
   * provided threshold.
   */
  Ci(e, t) {
    return e.filter((e2) => this.Di(e2.updateTimeMs, t) && !this.Fi(e2.clientId));
  }
  /**
   * Returns the IDs of the clients that are currently active. If multi-tab
   * is not supported, returns an array that only contains the local client's
   * ID.
   *
   * PORTING NOTE: This is only used for Web multi-tab.
   */
  Bi() {
    return this.runTransaction("getActiveClients", "readonly", (e) => __PRIVATE_clientMetadataStore(e).W().next((e2) => this.Ci(e2, 18e5).map((e3) => e3.clientId)));
  }
  get started() {
    return this.kr;
  }
  getMutationQueue(e, t) {
    return __PRIVATE_IndexedDbMutationQueue.ct(e, this.serializer, t, this.referenceDelegate);
  }
  getTargetCache() {
    return this.qr;
  }
  getRemoteDocumentCache() {
    return this.remoteDocumentCache;
  }
  getIndexManager(e) {
    return new __PRIVATE_IndexedDbIndexManager(e, this.serializer.ut.databaseId);
  }
  getDocumentOverlayCache(e) {
    return __PRIVATE_IndexedDbDocumentOverlayCache.ct(this.serializer, e);
  }
  getBundleCache() {
    return this.Kr;
  }
  runTransaction(e, t, n) {
    __PRIVATE_logDebug("IndexedDbPersistence", "Starting transaction:", e);
    const r2 = "readonly" === t ? "readonly" : "readwrite", i = (
      /** Returns the object stores for the provided schema. */
      function __PRIVATE_getObjectStores(e2) {
        return 15 === e2 ? X2 : 14 === e2 ? Z2 : 13 === e2 ? Y2 : 12 === e2 ? J2 : 11 === e2 ? H2 : void fail();
      }(this.ai)
    );
    let s;
    return this.Ti.runTransaction(e, r2, i, (r3) => (s = new __PRIVATE_IndexedDbTransaction(r3, this.Lr ? this.Lr.next() : __PRIVATE_ListenSequence._e), "readwrite-primary" === t ? this.fi(s).next((e2) => !!e2 || this.gi(s)).next((t2) => {
      if (!t2)
        throw __PRIVATE_logError(`Failed to obtain primary lease for action '${e}'.`), this.isPrimary = false, this.si.enqueueRetryable(() => this.Pi(false)), new FirestoreError(D2.FAILED_PRECONDITION, v2);
      return n(s);
    }).next((e2) => this.yi(s).next(() => e2)) : this.Li(s).next(() => n(s)))).then((e2) => (s.raiseOnCommittedEvent(), e2));
  }
  /**
   * Verifies that the current tab is the primary leaseholder or alternatively
   * that the leaseholder has opted into multi-tab synchronization.
   */
  // TODO(b/114226234): Remove this check when `synchronizeTabs` can no longer
  // be turned off.
  Li(e) {
    return __PRIVATE_primaryClientStore(e).get("owner").next((e2) => {
      if (null !== e2 && this.Di(e2.leaseTimestampMs, 5e3) && !this.Fi(e2.ownerId) && !this.wi(e2) && !(this._i || this.allowTabSynchronization && e2.allowTabSynchronization))
        throw new FirestoreError(D2.FAILED_PRECONDITION, de);
    });
  }
  /**
   * Obtains or extends the new primary lease for the local client. This
   * method does not verify that the client is eligible for this lease.
   */
  yi(e) {
    const t = {
      ownerId: this.clientId,
      allowTabSynchronization: this.allowTabSynchronization,
      leaseTimestampMs: Date.now()
    };
    return __PRIVATE_primaryClientStore(e).put("owner", t);
  }
  static D() {
    return __PRIVATE_SimpleDb.D();
  }
  /** Checks the primary lease and removes it if we are the current primary. */
  pi(e) {
    const t = __PRIVATE_primaryClientStore(e);
    return t.get("owner").next((e2) => this.wi(e2) ? (__PRIVATE_logDebug("IndexedDbPersistence", "Releasing primary lease."), t.delete("owner")) : PersistencePromise.resolve());
  }
  /** Verifies that `updateTimeMs` is within `maxAgeMs`. */
  Di(e, t) {
    const n = Date.now();
    return !(e < n - t) && (!(e > n) || (__PRIVATE_logError(`Detected an update time that is in the future: ${e} > ${n}`), false));
  }
  Ai() {
    null !== this.document && "function" == typeof this.document.addEventListener && (this.ci = () => {
      this.si.enqueueAndForget(() => (this.inForeground = "visible" === this.document.visibilityState, this.di()));
    }, this.document.addEventListener("visibilitychange", this.ci), this.inForeground = "visible" === this.document.visibilityState);
  }
  xi() {
    this.ci && (this.document.removeEventListener("visibilitychange", this.ci), this.ci = null);
  }
  /**
   * Attaches a window.unload handler that will synchronously write our
   * clientId to a "zombie client id" location in LocalStorage. This can be used
   * by tabs trying to acquire the primary lease to determine that the lease
   * is no longer valid even if the timestamp is recent. This is particularly
   * important for the refresh case (so the tab correctly re-acquires the
   * primary lease). LocalStorage is used for this rather than IndexedDb because
   * it is a synchronous API and so can be used reliably from  an unload
   * handler.
   */
  Ri() {
    var e;
    "function" == typeof (null === (e = this.window) || void 0 === e ? void 0 : e.addEventListener) && (this.ui = () => {
      this.Mi();
      const e2 = /(?:Version|Mobile)\/1[456]/;
      isSafari() && (navigator.appVersion.match(e2) || navigator.userAgent.match(e2)) && // On Safari 14, 15, and 16, we do not run any cleanup actions as it might
      // trigger a bug that prevents Safari from re-opening IndexedDB during
      // the next page load.
      // See https://bugs.webkit.org/show_bug.cgi?id=226547
      this.si.enterRestrictedMode(
        /* purgeExistingTasks= */
        true
      ), this.si.enqueueAndForget(() => this.shutdown());
    }, this.window.addEventListener("pagehide", this.ui));
  }
  Oi() {
    this.ui && (this.window.removeEventListener("pagehide", this.ui), this.ui = null);
  }
  /**
   * Returns whether a client is "zombied" based on its LocalStorage entry.
   * Clients become zombied when their tab closes without running all of the
   * cleanup logic in `shutdown()`.
   */
  Fi(e) {
    var t;
    try {
      const n = null !== (null === (t = this.Ei) || void 0 === t ? void 0 : t.getItem(this.vi(e)));
      return __PRIVATE_logDebug("IndexedDbPersistence", `Client '${e}' ${n ? "is" : "is not"} zombied in LocalStorage`), n;
    } catch (e2) {
      return __PRIVATE_logError("IndexedDbPersistence", "Failed to get zombied client id.", e2), false;
    }
  }
  /**
   * Record client as zombied (a client that had its tab closed). Zombied
   * clients are ignored during primary tab selection.
   */
  Mi() {
    if (this.Ei)
      try {
        this.Ei.setItem(this.vi(this.clientId), String(Date.now()));
      } catch (e) {
        __PRIVATE_logError("Failed to set zombie client id.", e);
      }
  }
  /** Removes the zombied client entry if it exists. */
  Ni() {
    if (this.Ei)
      try {
        this.Ei.removeItem(this.vi(this.clientId));
      } catch (e) {
      }
  }
  vi(e) {
    return `firestore_zombie_${this.persistenceKey}_${e}`;
  }
};
function __PRIVATE_primaryClientStore(e) {
  return __PRIVATE_getStore(e, "owner");
}
function __PRIVATE_clientMetadataStore(e) {
  return __PRIVATE_getStore(e, "clientMetadata");
}
function __PRIVATE_indexedDbStoragePrefix(e, t) {
  let n = e.projectId;
  return e.isDefaultDatabase || (n += "." + e.database), "firestore/" + t + "/" + n + "/";
}
var __PRIVATE_LocalViewChanges = class ___PRIVATE_LocalViewChanges {
  constructor(e, t, n, r2) {
    this.targetId = e, this.fromCache = t, this.ki = n, this.qi = r2;
  }
  static Qi(e, t) {
    let n = __PRIVATE_documentKeySet(), r2 = __PRIVATE_documentKeySet();
    for (const e2 of t.docChanges)
      switch (e2.type) {
        case 0:
          n = n.add(e2.doc.key);
          break;
        case 1:
          r2 = r2.add(e2.doc.key);
      }
    return new ___PRIVATE_LocalViewChanges(e, t.fromCache, n, r2);
  }
};
var QueryContext = class {
  constructor() {
    this._documentReadCount = 0;
  }
  get documentReadCount() {
    return this._documentReadCount;
  }
  incrementDocumentReadCount(e) {
    this._documentReadCount += e;
  }
};
var __PRIVATE_QueryEngine = class {
  constructor() {
    this.Ki = false, this.$i = false, /**
     * SDK only decides whether it should create index when collection size is
     * larger than this.
     */
    this.Ui = 100, this.Wi = 8;
  }
  /** Sets the document view to query against. */
  initialize(e, t) {
    this.Gi = e, this.indexManager = t, this.Ki = true;
  }
  /** Returns all local documents matching the specified query. */
  getDocumentsMatchingQuery(e, t, n, r2) {
    const i = {
      result: null
    };
    return this.zi(e, t).next((e2) => {
      i.result = e2;
    }).next(() => {
      if (!i.result)
        return this.ji(e, t, r2, n).next((e2) => {
          i.result = e2;
        });
    }).next(() => {
      if (i.result)
        return;
      const n2 = new QueryContext();
      return this.Hi(e, t, n2).next((r3) => {
        if (i.result = r3, this.$i)
          return this.Ji(e, t, n2, r3.size);
      });
    }).next(() => i.result);
  }
  Ji(e, t, n, r2) {
    return n.documentReadCount < this.Ui ? (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "SDK will not create cache indexes for query:", __PRIVATE_stringifyQuery(t), "since it only creates cache indexes for collection contains", "more than or equal to", this.Ui, "documents"), PersistencePromise.resolve()) : (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Query:", __PRIVATE_stringifyQuery(t), "scans", n.documentReadCount, "local documents and returns", r2, "documents as results."), n.documentReadCount > this.Wi * r2 ? (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "The SDK decides to create cache indexes for query:", __PRIVATE_stringifyQuery(t), "as using cache indexes may help improve performance."), this.indexManager.createTargetIndexes(e, __PRIVATE_queryToTarget(t))) : PersistencePromise.resolve());
  }
  /**
   * Performs an indexed query that evaluates the query based on a collection's
   * persisted index values. Returns `null` if an index is not available.
   */
  zi(e, t) {
    if (__PRIVATE_queryMatchesAllDocuments(t))
      return PersistencePromise.resolve(null);
    let n = __PRIVATE_queryToTarget(t);
    return this.indexManager.getIndexType(e, n).next((r2) => 0 === r2 ? null : (null !== t.limit && 1 === r2 && // We cannot apply a limit for targets that are served using a partial
    // index. If a partial index will be used to serve the target, the
    // query may return a superset of documents that match the target
    // (e.g. if the index doesn't include all the target's filters), or
    // may return the correct set of documents in the wrong order (e.g. if
    // the index doesn't include a segment for one of the orderBys).
    // Therefore, a limit should not be applied in such cases.
    (t = __PRIVATE_queryWithLimit(
      t,
      null,
      "F"
      /* LimitType.First */
    ), n = __PRIVATE_queryToTarget(t)), this.indexManager.getDocumentsMatchingTarget(e, n).next((r3) => {
      const i = __PRIVATE_documentKeySet(...r3);
      return this.Gi.getDocuments(e, i).next((r4) => this.indexManager.getMinOffset(e, n).next((n2) => {
        const s = this.Yi(t, r4);
        return this.Zi(t, s, i, n2.readTime) ? this.zi(e, __PRIVATE_queryWithLimit(
          t,
          null,
          "F"
          /* LimitType.First */
        )) : this.Xi(e, s, t, n2);
      }));
    })));
  }
  /**
   * Performs a query based on the target's persisted query mapping. Returns
   * `null` if the mapping is not available or cannot be used.
   */
  ji(e, t, n, r2) {
    return __PRIVATE_queryMatchesAllDocuments(t) || r2.isEqual(SnapshotVersion.min()) ? PersistencePromise.resolve(null) : this.Gi.getDocuments(e, n).next((i) => {
      const s = this.Yi(t, i);
      return this.Zi(t, s, n, r2) ? PersistencePromise.resolve(null) : (__PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Re-using previous result from %s to execute query: %s", r2.toString(), __PRIVATE_stringifyQuery(t)), this.Xi(e, s, t, __PRIVATE_newIndexOffsetSuccessorFromReadTime(r2, -1)).next((e2) => e2));
    });
  }
  /** Applies the query filter and sorting to the provided documents.  */
  Yi(e, t) {
    let n = new SortedSet(__PRIVATE_newQueryComparator(e));
    return t.forEach((t2, r2) => {
      __PRIVATE_queryMatches(e, r2) && (n = n.add(r2));
    }), n;
  }
  /**
   * Determines if a limit query needs to be refilled from cache, making it
   * ineligible for index-free execution.
   *
   * @param query - The query.
   * @param sortedPreviousResults - The documents that matched the query when it
   * was last synchronized, sorted by the query's comparator.
   * @param remoteKeys - The document keys that matched the query at the last
   * snapshot.
   * @param limboFreeSnapshotVersion - The version of the snapshot when the
   * query was last synchronized.
   */
  Zi(e, t, n, r2) {
    if (null === e.limit)
      return false;
    if (n.size !== t.size)
      return true;
    const i = "F" === e.limitType ? t.last() : t.first();
    return !!i && (i.hasPendingWrites || i.version.compareTo(r2) > 0);
  }
  Hi(e, t, n) {
    return __PRIVATE_getLogLevel() <= LogLevel.DEBUG && __PRIVATE_logDebug("QueryEngine", "Using full collection scan to execute query:", __PRIVATE_stringifyQuery(t)), this.Gi.getDocumentsMatchingQuery(e, t, IndexOffset.min(), n);
  }
  /**
   * Combines the results from an indexed execution with the remaining documents
   * that have not yet been indexed.
   */
  Xi(e, t, n, r2) {
    return this.Gi.getDocumentsMatchingQuery(e, n, r2).next((e2) => (
      // Merge with existing results
      (t.forEach((t2) => {
        e2 = e2.insert(t2.key, t2);
      }), e2)
    ));
  }
};
var __PRIVATE_LocalStoreImpl = class {
  constructor(e, t, n, r2) {
    this.persistence = e, this.es = t, this.serializer = r2, /**
     * Maps a targetID to data about its target.
     *
     * PORTING NOTE: We are using an immutable data structure on Web to make re-runs
     * of `applyRemoteEvent()` idempotent.
     */
    this.ts = new SortedMap(__PRIVATE_primitiveComparator), /** Maps a target to its targetID. */
    // TODO(wuandy): Evaluate if TargetId can be part of Target.
    this.ns = new ObjectMap((e2) => __PRIVATE_canonifyTarget(e2), __PRIVATE_targetEquals), /**
     * A per collection group index of the last read time processed by
     * `getNewDocumentChanges()`.
     *
     * PORTING NOTE: This is only used for multi-tab synchronization.
     */
    this.rs = /* @__PURE__ */ new Map(), this.ss = e.getRemoteDocumentCache(), this.qr = e.getTargetCache(), this.Kr = e.getBundleCache(), this.os(n);
  }
  os(e) {
    this.documentOverlayCache = this.persistence.getDocumentOverlayCache(e), this.indexManager = this.persistence.getIndexManager(e), this.mutationQueue = this.persistence.getMutationQueue(e, this.indexManager), this.localDocuments = new LocalDocumentsView(this.ss, this.mutationQueue, this.documentOverlayCache, this.indexManager), this.ss.setIndexManager(this.indexManager), this.es.initialize(this.localDocuments, this.indexManager);
  }
  collectGarbage(e) {
    return this.persistence.runTransaction("Collect garbage", "readwrite-primary", (t) => e.collect(t, this.ts));
  }
};
function __PRIVATE_newLocalStore(e, t, n, r2) {
  return new __PRIVATE_LocalStoreImpl(e, t, n, r2);
}
function __PRIVATE_localStoreHandleUserChange(e, t) {
  return __async(this, null, function* () {
    const n = __PRIVATE_debugCast(e);
    return yield n.persistence.runTransaction("Handle user change", "readonly", (e2) => {
      let r2;
      return n.mutationQueue.getAllMutationBatches(e2).next((i) => (r2 = i, n.os(t), n.mutationQueue.getAllMutationBatches(e2))).next((t2) => {
        const i = [], s = [];
        let o = __PRIVATE_documentKeySet();
        for (const e3 of r2) {
          i.push(e3.batchId);
          for (const t3 of e3.mutations)
            o = o.add(t3.key);
        }
        for (const e3 of t2) {
          s.push(e3.batchId);
          for (const t3 of e3.mutations)
            o = o.add(t3.key);
        }
        return n.localDocuments.getDocuments(e2, o).next((e3) => ({
          _s: e3,
          removedBatchIds: i,
          addedBatchIds: s
        }));
      });
    });
  });
}
function __PRIVATE_localStoreAcknowledgeBatch(e, t) {
  const n = __PRIVATE_debugCast(e);
  return n.persistence.runTransaction("Acknowledge batch", "readwrite-primary", (e2) => {
    const r2 = t.batch.keys(), i = n.ss.newChangeBuffer({
      trackRemovals: true
    });
    return function __PRIVATE_applyWriteToRemoteDocuments(e3, t2, n2, r3) {
      const i2 = n2.batch, s = i2.keys();
      let o = PersistencePromise.resolve();
      return s.forEach((e4) => {
        o = o.next(() => r3.getEntry(t2, e4)).next((t3) => {
          const s2 = n2.docVersions.get(e4);
          __PRIVATE_hardAssert(null !== s2), t3.version.compareTo(s2) < 0 && (i2.applyToRemoteDocument(t3, n2), t3.isValidDocument() && // We use the commitVersion as the readTime rather than the
          // document's updateTime since the updateTime is not advanced
          // for updates that do not modify the underlying document.
          (t3.setReadTime(n2.commitVersion), r3.addEntry(t3)));
        });
      }), o.next(() => e3.mutationQueue.removeMutationBatch(t2, i2));
    }(n, e2, t, i).next(() => i.apply(e2)).next(() => n.mutationQueue.performConsistencyCheck(e2)).next(() => n.documentOverlayCache.removeOverlaysForBatchId(e2, r2, t.batch.batchId)).next(() => n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e2, function __PRIVATE_getKeysWithTransformResults(e3) {
      let t2 = __PRIVATE_documentKeySet();
      for (let n2 = 0; n2 < e3.mutationResults.length; ++n2) {
        e3.mutationResults[n2].transformResults.length > 0 && (t2 = t2.add(e3.batch.mutations[n2].key));
      }
      return t2;
    }(t))).next(() => n.localDocuments.getDocuments(e2, r2));
  });
}
function __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e) {
  const t = __PRIVATE_debugCast(e);
  return t.persistence.runTransaction("Get last remote snapshot version", "readonly", (e2) => t.qr.getLastRemoteSnapshotVersion(e2));
}
function __PRIVATE_localStoreApplyRemoteEventToLocalCache(e, t) {
  const n = __PRIVATE_debugCast(e), r2 = t.snapshotVersion;
  let i = n.ts;
  return n.persistence.runTransaction("Apply remote event", "readwrite-primary", (e2) => {
    const s = n.ss.newChangeBuffer({
      trackRemovals: true
    });
    i = n.ts;
    const o = [];
    t.targetChanges.forEach((s2, _2) => {
      const a2 = i.get(_2);
      if (!a2)
        return;
      o.push(n.qr.removeMatchingKeys(e2, s2.removedDocuments, _2).next(() => n.qr.addMatchingKeys(e2, s2.addedDocuments, _2)));
      let u = a2.withSequenceNumber(e2.currentSequenceNumber);
      null !== t.targetMismatches.get(_2) ? u = u.withResumeToken(ByteString.EMPTY_BYTE_STRING, SnapshotVersion.min()).withLastLimboFreeSnapshotVersion(SnapshotVersion.min()) : s2.resumeToken.approximateByteSize() > 0 && (u = u.withResumeToken(s2.resumeToken, r2)), i = i.insert(_2, u), // Update the target data if there are target changes (or if
      // sufficient time has passed since the last update).
      /**
      * Returns true if the newTargetData should be persisted during an update of
      * an active target. TargetData should always be persisted when a target is
      * being released and should not call this function.
      *
      * While the target is active, TargetData updates can be omitted when nothing
      * about the target has changed except metadata like the resume token or
      * snapshot version. Occasionally it's worth the extra write to prevent these
      * values from getting too stale after a crash, but this doesn't have to be
      * too frequent.
      */
      function __PRIVATE_shouldPersistTargetData(e3, t2, n2) {
        if (0 === e3.resumeToken.approximateByteSize())
          return true;
        if (t2.snapshotVersion.toMicroseconds() - e3.snapshotVersion.toMicroseconds() >= 3e8)
          return true;
        return n2.addedDocuments.size + n2.modifiedDocuments.size + n2.removedDocuments.size > 0;
      }(a2, u, s2) && o.push(n.qr.updateTargetData(e2, u));
    });
    let _ = __PRIVATE_mutableDocumentMap(), a = __PRIVATE_documentKeySet();
    if (t.documentUpdates.forEach((r3) => {
      t.resolvedLimboDocuments.has(r3) && o.push(n.persistence.referenceDelegate.updateLimboDocument(e2, r3));
    }), // Each loop iteration only affects its "own" doc, so it's safe to get all
    // the remote documents in advance in a single call.
    o.push(__PRIVATE_populateDocumentChangeBuffer(e2, s, t.documentUpdates).next((e3) => {
      _ = e3.us, a = e3.cs;
    })), !r2.isEqual(SnapshotVersion.min())) {
      const t2 = n.qr.getLastRemoteSnapshotVersion(e2).next((t3) => n.qr.setTargetsMetadata(e2, e2.currentSequenceNumber, r2));
      o.push(t2);
    }
    return PersistencePromise.waitFor(o).next(() => s.apply(e2)).next(() => n.localDocuments.getLocalViewOfDocuments(e2, _, a)).next(() => _);
  }).then((e2) => (n.ts = i, e2));
}
function __PRIVATE_populateDocumentChangeBuffer(e, t, n) {
  let r2 = __PRIVATE_documentKeySet(), i = __PRIVATE_documentKeySet();
  return n.forEach((e2) => r2 = r2.add(e2)), t.getEntries(e, r2).next((e2) => {
    let r3 = __PRIVATE_mutableDocumentMap();
    return n.forEach((n2, s) => {
      const o = e2.get(n2);
      s.isFoundDocument() !== o.isFoundDocument() && (i = i.add(n2)), // Note: The order of the steps below is important, since we want
      // to ensure that rejected limbo resolutions (which fabricate
      // NoDocuments with SnapshotVersion.min()) never add documents to
      // cache.
      s.isNoDocument() && s.version.isEqual(SnapshotVersion.min()) ? (
        // NoDocuments with SnapshotVersion.min() are used in manufactured
        // events. We remove these documents from cache since we lost
        // access.
        (t.removeEntry(n2, s.readTime), r3 = r3.insert(n2, s))
      ) : !o.isValidDocument() || s.version.compareTo(o.version) > 0 || 0 === s.version.compareTo(o.version) && o.hasPendingWrites ? (t.addEntry(s), r3 = r3.insert(n2, s)) : __PRIVATE_logDebug("LocalStore", "Ignoring outdated watch update for ", n2, ". Current version:", o.version, " Watch version:", s.version);
    }), {
      us: r3,
      cs: i
    };
  });
}
function __PRIVATE_localStoreGetNextMutationBatch(e, t) {
  const n = __PRIVATE_debugCast(e);
  return n.persistence.runTransaction("Get next mutation batch", "readonly", (e2) => (void 0 === t && (t = -1), n.mutationQueue.getNextMutationBatchAfterBatchId(e2, t)));
}
function __PRIVATE_localStoreAllocateTarget(e, t) {
  const n = __PRIVATE_debugCast(e);
  return n.persistence.runTransaction("Allocate target", "readwrite", (e2) => {
    let r2;
    return n.qr.getTargetData(e2, t).next((i) => i ? (
      // This target has been listened to previously, so reuse the
      // previous targetID.
      // TODO(mcg): freshen last accessed date?
      (r2 = i, PersistencePromise.resolve(r2))
    ) : n.qr.allocateTargetId(e2).next((i2) => (r2 = new TargetData(t, i2, "TargetPurposeListen", e2.currentSequenceNumber), n.qr.addTargetData(e2, r2).next(() => r2))));
  }).then((e2) => {
    const r2 = n.ts.get(e2.targetId);
    return (null === r2 || e2.snapshotVersion.compareTo(r2.snapshotVersion) > 0) && (n.ts = n.ts.insert(e2.targetId, e2), n.ns.set(t, e2.targetId)), e2;
  });
}
function __PRIVATE_localStoreReleaseTarget(e, t, n) {
  return __async(this, null, function* () {
    const r2 = __PRIVATE_debugCast(e), i = r2.ts.get(t), s = n ? "readwrite" : "readwrite-primary";
    try {
      n || (yield r2.persistence.runTransaction("Release target", s, (e2) => r2.persistence.referenceDelegate.removeTarget(e2, i)));
    } catch (e2) {
      if (!__PRIVATE_isIndexedDbTransactionError(e2))
        throw e2;
      __PRIVATE_logDebug("LocalStore", `Failed to update sequence numbers for target ${t}: ${e2}`);
    }
    r2.ts = r2.ts.remove(t), r2.ns.delete(i.target);
  });
}
function __PRIVATE_localStoreExecuteQuery(e, t, n) {
  const r2 = __PRIVATE_debugCast(e);
  let i = SnapshotVersion.min(), s = __PRIVATE_documentKeySet();
  return r2.persistence.runTransaction(
    "Execute query",
    "readwrite",
    // Use readwrite instead of readonly so indexes can be created
    // Use readwrite instead of readonly so indexes can be created
    (e2) => function __PRIVATE_localStoreGetTargetData(e3, t2, n2) {
      const r3 = __PRIVATE_debugCast(e3), i2 = r3.ns.get(n2);
      return void 0 !== i2 ? PersistencePromise.resolve(r3.ts.get(i2)) : r3.qr.getTargetData(t2, n2);
    }(r2, e2, __PRIVATE_queryToTarget(t)).next((t2) => {
      if (t2)
        return i = t2.lastLimboFreeSnapshotVersion, r2.qr.getMatchingKeysForTargetId(e2, t2.targetId).next((e3) => {
          s = e3;
        });
    }).next(() => r2.es.getDocumentsMatchingQuery(e2, t, n ? i : SnapshotVersion.min(), n ? s : __PRIVATE_documentKeySet())).next((e3) => (__PRIVATE_setMaxReadTime(r2, __PRIVATE_queryCollectionGroup(t), e3), {
      documents: e3,
      ls: s
    }))
  );
}
function __PRIVATE_localStoreGetCachedTarget(e, t) {
  const n = __PRIVATE_debugCast(e), r2 = __PRIVATE_debugCast(n.qr), i = n.ts.get(t);
  return i ? Promise.resolve(i.target) : n.persistence.runTransaction("Get target data", "readonly", (e2) => r2._t(e2, t).next((e3) => e3 ? e3.target : null));
}
function __PRIVATE_localStoreGetNewDocumentChanges(e, t) {
  const n = __PRIVATE_debugCast(e), r2 = n.rs.get(t) || SnapshotVersion.min();
  return n.persistence.runTransaction("Get new document changes", "readonly", (e2) => n.ss.getAllFromCollectionGroup(
    e2,
    t,
    __PRIVATE_newIndexOffsetSuccessorFromReadTime(r2, -1),
    /* limit= */
    Number.MAX_SAFE_INTEGER
  )).then((e2) => (__PRIVATE_setMaxReadTime(n, t, e2), e2));
}
function __PRIVATE_setMaxReadTime(e, t, n) {
  let r2 = e.rs.get(t) || SnapshotVersion.min();
  n.forEach((e2, t2) => {
    t2.readTime.compareTo(r2) > 0 && (r2 = t2.readTime);
  }), e.rs.set(t, r2);
}
function __PRIVATE_localStoreApplyBundledDocuments(e, t, n, r2) {
  return __async(this, null, function* () {
    const i = __PRIVATE_debugCast(e);
    let s = __PRIVATE_documentKeySet(), o = __PRIVATE_mutableDocumentMap();
    for (const e2 of n) {
      const n2 = t.hs(e2.metadata.name);
      e2.document && (s = s.add(n2));
      const r3 = t.Ps(e2);
      r3.setReadTime(t.Is(e2.metadata.readTime)), o = o.insert(n2, r3);
    }
    const _ = i.ss.newChangeBuffer({
      trackRemovals: true
    }), a = yield __PRIVATE_localStoreAllocateTarget(i, function __PRIVATE_umbrellaTarget(e2) {
      return __PRIVATE_queryToTarget(__PRIVATE_newQueryForPath(ResourcePath.fromString(`__bundle__/docs/${e2}`)));
    }(r2));
    return i.persistence.runTransaction("Apply bundle documents", "readwrite", (e2) => __PRIVATE_populateDocumentChangeBuffer(e2, _, o).next((t2) => (_.apply(e2), t2)).next((t2) => i.qr.removeMatchingKeysForTargetId(e2, a.targetId).next(() => i.qr.addMatchingKeys(e2, s, a.targetId)).next(() => i.localDocuments.getLocalViewOfDocuments(e2, t2.us, t2.cs)).next(() => t2.us)));
  });
}
function __PRIVATE_localStoreSaveNamedQuery(_0, _1) {
  return __async(this, arguments, function* (e, t, n = __PRIVATE_documentKeySet()) {
    const r2 = yield __PRIVATE_localStoreAllocateTarget(e, __PRIVATE_queryToTarget(__PRIVATE_fromBundledQuery(t.bundledQuery))), i = __PRIVATE_debugCast(e);
    return i.persistence.runTransaction("Save named query", "readwrite", (e2) => {
      const s = __PRIVATE_fromVersion(t.readTime);
      if (r2.snapshotVersion.compareTo(s) >= 0)
        return i.Kr.saveNamedQuery(e2, t);
      const o = r2.withResumeToken(ByteString.EMPTY_BYTE_STRING, s);
      return i.ts = i.ts.insert(o.targetId, o), i.qr.updateTargetData(e2, o).next(() => i.qr.removeMatchingKeysForTargetId(e2, r2.targetId)).next(() => i.qr.addMatchingKeys(e2, n, r2.targetId)).next(() => i.Kr.saveNamedQuery(e2, t));
    });
  });
}
function createWebStorageClientStateKey(e, t) {
  return `firestore_clients_${e}_${t}`;
}
function createWebStorageMutationBatchKey(e, t, n) {
  let r2 = `firestore_mutations_${e}_${n}`;
  return t.isAuthenticated() && (r2 += `_${t.uid}`), r2;
}
function createWebStorageQueryTargetMetadataKey(e, t) {
  return `firestore_targets_${e}_${t}`;
}
var __PRIVATE_MutationMetadata = class ___PRIVATE_MutationMetadata {
  constructor(e, t, n, r2) {
    this.user = e, this.batchId = t, this.state = n, this.error = r2;
  }
  /**
   * Parses a MutationMetadata from its JSON representation in WebStorage.
   * Logs a warning and returns null if the format of the data is not valid.
   */
  static Ts(e, t, n) {
    const r2 = JSON.parse(n);
    let i, s = "object" == typeof r2 && -1 !== ["pending", "acknowledged", "rejected"].indexOf(r2.state) && (void 0 === r2.error || "object" == typeof r2.error);
    return s && r2.error && (s = "string" == typeof r2.error.message && "string" == typeof r2.error.code, s && (i = new FirestoreError(r2.error.code, r2.error.message))), s ? new ___PRIVATE_MutationMetadata(e, t, r2.state, i) : (__PRIVATE_logError("SharedClientState", `Failed to parse mutation state for ID '${t}': ${n}`), null);
  }
  Es() {
    const e = {
      state: this.state,
      updateTimeMs: Date.now()
    };
    return this.error && (e.error = {
      code: this.error.code,
      message: this.error.message
    }), JSON.stringify(e);
  }
};
var __PRIVATE_QueryTargetMetadata = class ___PRIVATE_QueryTargetMetadata {
  constructor(e, t, n) {
    this.targetId = e, this.state = t, this.error = n;
  }
  /**
   * Parses a QueryTargetMetadata from its JSON representation in WebStorage.
   * Logs a warning and returns null if the format of the data is not valid.
   */
  static Ts(e, t) {
    const n = JSON.parse(t);
    let r2, i = "object" == typeof n && -1 !== ["not-current", "current", "rejected"].indexOf(n.state) && (void 0 === n.error || "object" == typeof n.error);
    return i && n.error && (i = "string" == typeof n.error.message && "string" == typeof n.error.code, i && (r2 = new FirestoreError(n.error.code, n.error.message))), i ? new ___PRIVATE_QueryTargetMetadata(e, n.state, r2) : (__PRIVATE_logError("SharedClientState", `Failed to parse target state for ID '${e}': ${t}`), null);
  }
  Es() {
    const e = {
      state: this.state,
      updateTimeMs: Date.now()
    };
    return this.error && (e.error = {
      code: this.error.code,
      message: this.error.message
    }), JSON.stringify(e);
  }
};
var __PRIVATE_RemoteClientState = class ___PRIVATE_RemoteClientState {
  constructor(e, t) {
    this.clientId = e, this.activeTargetIds = t;
  }
  /**
   * Parses a RemoteClientState from the JSON representation in WebStorage.
   * Logs a warning and returns null if the format of the data is not valid.
   */
  static Ts(e, t) {
    const n = JSON.parse(t);
    let r2 = "object" == typeof n && n.activeTargetIds instanceof Array, i = __PRIVATE_targetIdSet();
    for (let e2 = 0; r2 && e2 < n.activeTargetIds.length; ++e2)
      r2 = isSafeInteger(n.activeTargetIds[e2]), i = i.add(n.activeTargetIds[e2]);
    return r2 ? new ___PRIVATE_RemoteClientState(e, i) : (__PRIVATE_logError("SharedClientState", `Failed to parse client data for instance '${e}': ${t}`), null);
  }
};
var __PRIVATE_SharedOnlineState = class ___PRIVATE_SharedOnlineState {
  constructor(e, t) {
    this.clientId = e, this.onlineState = t;
  }
  /**
   * Parses a SharedOnlineState from its JSON representation in WebStorage.
   * Logs a warning and returns null if the format of the data is not valid.
   */
  static Ts(e) {
    const t = JSON.parse(e);
    return "object" == typeof t && -1 !== ["Unknown", "Online", "Offline"].indexOf(t.onlineState) && "string" == typeof t.clientId ? new ___PRIVATE_SharedOnlineState(t.clientId, t.onlineState) : (__PRIVATE_logError("SharedClientState", `Failed to parse online state: ${e}`), null);
  }
};
var __PRIVATE_LocalClientState = class {
  constructor() {
    this.activeTargetIds = __PRIVATE_targetIdSet();
  }
  ds(e) {
    this.activeTargetIds = this.activeTargetIds.add(e);
  }
  As(e) {
    this.activeTargetIds = this.activeTargetIds.delete(e);
  }
  /**
   * Converts this entry into a JSON-encoded format we can use for WebStorage.
   * Does not encode `clientId` as it is part of the key in WebStorage.
   */
  Es() {
    const e = {
      activeTargetIds: this.activeTargetIds.toArray(),
      updateTimeMs: Date.now()
    };
    return JSON.stringify(e);
  }
};
var __PRIVATE_WebStorageSharedClientState = class {
  constructor(e, t, n, r2, i) {
    this.window = e, this.si = t, this.persistenceKey = n, this.Rs = r2, this.syncEngine = null, this.onlineStateHandler = null, this.sequenceNumberHandler = null, this.Vs = this.fs.bind(this), this.gs = new SortedMap(__PRIVATE_primitiveComparator), this.started = false, /**
     * Captures WebStorage events that occur before `start()` is called. These
     * events are replayed once `WebStorageSharedClientState` is started.
     */
    this.ps = [];
    const s = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    this.storage = this.window.localStorage, this.currentUser = i, this.ys = createWebStorageClientStateKey(this.persistenceKey, this.Rs), this.ws = /** Assembles the key for the current sequence number. */
    function createWebStorageSequenceNumberKey(e2) {
      return `firestore_sequence_number_${e2}`;
    }(this.persistenceKey), this.gs = this.gs.insert(this.Rs, new __PRIVATE_LocalClientState()), this.Ss = new RegExp(`^firestore_clients_${s}_([^_]*)$`), this.bs = new RegExp(`^firestore_mutations_${s}_(\\d+)(?:_(.*))?$`), this.Ds = new RegExp(`^firestore_targets_${s}_(\\d+)$`), this.Cs = /** Assembles the key for the online state of the primary tab. */
    function createWebStorageOnlineStateKey(e2) {
      return `firestore_online_state_${e2}`;
    }(this.persistenceKey), this.vs = function createBundleLoadedKey(e2) {
      return `firestore_bundle_loaded_v2_${e2}`;
    }(this.persistenceKey), // Rather than adding the storage observer during start(), we add the
    // storage observer during initialization. This ensures that we collect
    // events before other components populate their initial state (during their
    // respective start() calls). Otherwise, we might for example miss a
    // mutation that is added after LocalStore's start() processed the existing
    // mutations but before we observe WebStorage events.
    this.window.addEventListener("storage", this.Vs);
  }
  /** Returns 'true' if WebStorage is available in the current environment. */
  static D(e) {
    return !(!e || !e.localStorage);
  }
  start() {
    return __async(this, null, function* () {
      const e = yield this.syncEngine.Bi();
      for (const t2 of e) {
        if (t2 === this.Rs)
          continue;
        const e2 = this.getItem(createWebStorageClientStateKey(this.persistenceKey, t2));
        if (e2) {
          const n = __PRIVATE_RemoteClientState.Ts(t2, e2);
          n && (this.gs = this.gs.insert(n.clientId, n));
        }
      }
      this.Fs();
      const t = this.storage.getItem(this.Cs);
      if (t) {
        const e2 = this.Ms(t);
        e2 && this.xs(e2);
      }
      for (const e2 of this.ps)
        this.fs(e2);
      this.ps = [], // Register a window unload hook to remove the client metadata entry from
      // WebStorage even if `shutdown()` was not called.
      this.window.addEventListener("pagehide", () => this.shutdown()), this.started = true;
    });
  }
  writeSequenceNumber(e) {
    this.setItem(this.ws, JSON.stringify(e));
  }
  getAllActiveQueryTargets() {
    return this.Os(this.gs);
  }
  isActiveQueryTarget(e) {
    let t = false;
    return this.gs.forEach((n, r2) => {
      r2.activeTargetIds.has(e) && (t = true);
    }), t;
  }
  addPendingMutation(e) {
    this.Ns(e, "pending");
  }
  updateMutationState(e, t, n) {
    this.Ns(e, t, n), // Once a final mutation result is observed by other clients, they no longer
    // access the mutation's metadata entry. Since WebStorage replays events
    // in order, it is safe to delete the entry right after updating it.
    this.Bs(e);
  }
  addLocalQueryTarget(e) {
    let t = "not-current";
    if (this.isActiveQueryTarget(e)) {
      const n = this.storage.getItem(createWebStorageQueryTargetMetadataKey(this.persistenceKey, e));
      if (n) {
        const r2 = __PRIVATE_QueryTargetMetadata.Ts(e, n);
        r2 && (t = r2.state);
      }
    }
    return this.Ls.ds(e), this.Fs(), t;
  }
  removeLocalQueryTarget(e) {
    this.Ls.As(e), this.Fs();
  }
  isLocalQueryTarget(e) {
    return this.Ls.activeTargetIds.has(e);
  }
  clearQueryState(e) {
    this.removeItem(createWebStorageQueryTargetMetadataKey(this.persistenceKey, e));
  }
  updateQueryState(e, t, n) {
    this.ks(e, t, n);
  }
  handleUserChange(e, t, n) {
    t.forEach((e2) => {
      this.Bs(e2);
    }), this.currentUser = e, n.forEach((e2) => {
      this.addPendingMutation(e2);
    });
  }
  setOnlineState(e) {
    this.qs(e);
  }
  notifyBundleLoaded(e) {
    this.Qs(e);
  }
  shutdown() {
    this.started && (this.window.removeEventListener("storage", this.Vs), this.removeItem(this.ys), this.started = false);
  }
  getItem(e) {
    const t = this.storage.getItem(e);
    return __PRIVATE_logDebug("SharedClientState", "READ", e, t), t;
  }
  setItem(e, t) {
    __PRIVATE_logDebug("SharedClientState", "SET", e, t), this.storage.setItem(e, t);
  }
  removeItem(e) {
    __PRIVATE_logDebug("SharedClientState", "REMOVE", e), this.storage.removeItem(e);
  }
  fs(e) {
    const t = e;
    if (t.storageArea === this.storage) {
      if (__PRIVATE_logDebug("SharedClientState", "EVENT", t.key, t.newValue), t.key === this.ys)
        return void __PRIVATE_logError("Received WebStorage notification for local change. Another client might have garbage-collected our state");
      this.si.enqueueRetryable(() => __async(this, null, function* () {
        if (this.started) {
          if (null !== t.key) {
            if (this.Ss.test(t.key)) {
              if (null == t.newValue) {
                const e2 = this.Ks(t.key);
                return this.$s(e2, null);
              }
              {
                const e2 = this.Us(t.key, t.newValue);
                if (e2)
                  return this.$s(e2.clientId, e2);
              }
            } else if (this.bs.test(t.key)) {
              if (null !== t.newValue) {
                const e2 = this.Ws(t.key, t.newValue);
                if (e2)
                  return this.Gs(e2);
              }
            } else if (this.Ds.test(t.key)) {
              if (null !== t.newValue) {
                const e2 = this.zs(t.key, t.newValue);
                if (e2)
                  return this.js(e2);
              }
            } else if (t.key === this.Cs) {
              if (null !== t.newValue) {
                const e2 = this.Ms(t.newValue);
                if (e2)
                  return this.xs(e2);
              }
            } else if (t.key === this.ws) {
              const e2 = function __PRIVATE_fromWebStorageSequenceNumber(e3) {
                let t2 = __PRIVATE_ListenSequence._e;
                if (null != e3)
                  try {
                    const n = JSON.parse(e3);
                    __PRIVATE_hardAssert("number" == typeof n), t2 = n;
                  } catch (e4) {
                    __PRIVATE_logError("SharedClientState", "Failed to read sequence number from WebStorage", e4);
                  }
                return t2;
              }(t.newValue);
              e2 !== __PRIVATE_ListenSequence._e && this.sequenceNumberHandler(e2);
            } else if (t.key === this.vs) {
              const e2 = this.Hs(t.newValue);
              yield Promise.all(e2.map((e3) => this.syncEngine.Js(e3)));
            }
          }
        } else
          this.ps.push(t);
      }));
    }
  }
  get Ls() {
    return this.gs.get(this.Rs);
  }
  Fs() {
    this.setItem(this.ys, this.Ls.Es());
  }
  Ns(e, t, n) {
    const r2 = new __PRIVATE_MutationMetadata(this.currentUser, e, t, n), i = createWebStorageMutationBatchKey(this.persistenceKey, this.currentUser, e);
    this.setItem(i, r2.Es());
  }
  Bs(e) {
    const t = createWebStorageMutationBatchKey(this.persistenceKey, this.currentUser, e);
    this.removeItem(t);
  }
  qs(e) {
    const t = {
      clientId: this.Rs,
      onlineState: e
    };
    this.storage.setItem(this.Cs, JSON.stringify(t));
  }
  ks(e, t, n) {
    const r2 = createWebStorageQueryTargetMetadataKey(this.persistenceKey, e), i = new __PRIVATE_QueryTargetMetadata(e, t, n);
    this.setItem(r2, i.Es());
  }
  Qs(e) {
    const t = JSON.stringify(Array.from(e));
    this.setItem(this.vs, t);
  }
  /**
   * Parses a client state key in WebStorage. Returns null if the key does not
   * match the expected key format.
   */
  Ks(e) {
    const t = this.Ss.exec(e);
    return t ? t[1] : null;
  }
  /**
   * Parses a client state in WebStorage. Returns 'null' if the value could not
   * be parsed.
   */
  Us(e, t) {
    const n = this.Ks(e);
    return __PRIVATE_RemoteClientState.Ts(n, t);
  }
  /**
   * Parses a mutation batch state in WebStorage. Returns 'null' if the value
   * could not be parsed.
   */
  Ws(e, t) {
    const n = this.bs.exec(e), r2 = Number(n[1]), i = void 0 !== n[2] ? n[2] : null;
    return __PRIVATE_MutationMetadata.Ts(new User(i), r2, t);
  }
  /**
   * Parses a query target state from WebStorage. Returns 'null' if the value
   * could not be parsed.
   */
  zs(e, t) {
    const n = this.Ds.exec(e), r2 = Number(n[1]);
    return __PRIVATE_QueryTargetMetadata.Ts(r2, t);
  }
  /**
   * Parses an online state from WebStorage. Returns 'null' if the value
   * could not be parsed.
   */
  Ms(e) {
    return __PRIVATE_SharedOnlineState.Ts(e);
  }
  Hs(e) {
    return JSON.parse(e);
  }
  Gs(e) {
    return __async(this, null, function* () {
      if (e.user.uid === this.currentUser.uid)
        return this.syncEngine.Ys(e.batchId, e.state, e.error);
      __PRIVATE_logDebug("SharedClientState", `Ignoring mutation for non-active user ${e.user.uid}`);
    });
  }
  js(e) {
    return this.syncEngine.Zs(e.targetId, e.state, e.error);
  }
  $s(e, t) {
    const n = t ? this.gs.insert(e, t) : this.gs.remove(e), r2 = this.Os(this.gs), i = this.Os(n), s = [], o = [];
    return i.forEach((e2) => {
      r2.has(e2) || s.push(e2);
    }), r2.forEach((e2) => {
      i.has(e2) || o.push(e2);
    }), this.syncEngine.Xs(s, o).then(() => {
      this.gs = n;
    });
  }
  xs(e) {
    this.gs.get(e.clientId) && this.onlineStateHandler(e.onlineState);
  }
  Os(e) {
    let t = __PRIVATE_targetIdSet();
    return e.forEach((e2, n) => {
      t = t.unionWith(n.activeTargetIds);
    }), t;
  }
};
var __PRIVATE_MemorySharedClientState = class {
  constructor() {
    this.eo = new __PRIVATE_LocalClientState(), this.no = {}, this.onlineStateHandler = null, this.sequenceNumberHandler = null;
  }
  addPendingMutation(e) {
  }
  updateMutationState(e, t, n) {
  }
  addLocalQueryTarget(e) {
    return this.eo.ds(e), this.no[e] || "not-current";
  }
  updateQueryState(e, t, n) {
    this.no[e] = t;
  }
  removeLocalQueryTarget(e) {
    this.eo.As(e);
  }
  isLocalQueryTarget(e) {
    return this.eo.activeTargetIds.has(e);
  }
  clearQueryState(e) {
    delete this.no[e];
  }
  getAllActiveQueryTargets() {
    return this.eo.activeTargetIds;
  }
  isActiveQueryTarget(e) {
    return this.eo.activeTargetIds.has(e);
  }
  start() {
    return this.eo = new __PRIVATE_LocalClientState(), Promise.resolve();
  }
  handleUserChange(e, t, n) {
  }
  setOnlineState(e) {
  }
  shutdown() {
  }
  writeSequenceNumber(e) {
  }
  notifyBundleLoaded(e) {
  }
};
var __PRIVATE_NoopConnectivityMonitor = class {
  ro(e) {
  }
  shutdown() {
  }
};
var __PRIVATE_BrowserConnectivityMonitor = class {
  constructor() {
    this.io = () => this.so(), this.oo = () => this._o(), this.ao = [], this.uo();
  }
  ro(e) {
    this.ao.push(e);
  }
  shutdown() {
    window.removeEventListener("online", this.io), window.removeEventListener("offline", this.oo);
  }
  uo() {
    window.addEventListener("online", this.io), window.addEventListener("offline", this.oo);
  }
  so() {
    __PRIVATE_logDebug("ConnectivityMonitor", "Network connectivity changed: AVAILABLE");
    for (const e of this.ao)
      e(
        0
        /* NetworkStatus.AVAILABLE */
      );
  }
  _o() {
    __PRIVATE_logDebug("ConnectivityMonitor", "Network connectivity changed: UNAVAILABLE");
    for (const e of this.ao)
      e(
        1
        /* NetworkStatus.UNAVAILABLE */
      );
  }
  // TODO(chenbrian): Consider passing in window either into this component or
  // here for testing via FakeWindow.
  /** Checks that all used attributes of window are available. */
  static D() {
    return "undefined" != typeof window && void 0 !== window.addEventListener && void 0 !== window.removeEventListener;
  }
};
var Ae = null;
function __PRIVATE_generateUniqueDebugId() {
  return null === Ae ? Ae = function __PRIVATE_generateInitialUniqueDebugId() {
    return 268435456 + Math.round(2147483648 * Math.random());
  }() : Ae++, "0x" + Ae.toString(16);
}
var Re = {
  BatchGetDocuments: "batchGet",
  Commit: "commit",
  RunQuery: "runQuery",
  RunAggregationQuery: "runAggregationQuery"
};
var __PRIVATE_StreamBridge = class {
  constructor(e) {
    this.co = e.co, this.lo = e.lo;
  }
  ho(e) {
    this.Po = e;
  }
  Io(e) {
    this.To = e;
  }
  onMessage(e) {
    this.Eo = e;
  }
  close() {
    this.lo();
  }
  send(e) {
    this.co(e);
  }
  Ao() {
    this.Po();
  }
  Ro(e) {
    this.To(e);
  }
  Vo(e) {
    this.Eo(e);
  }
};
var Ve = "WebChannelConnection";
var __PRIVATE_WebChannelConnection = class extends /**
 * Base class for all Rest-based connections to the backend (WebChannel and
 * HTTP).
 */
class __PRIVATE_RestConnection {
  constructor(e) {
    this.databaseInfo = e, this.databaseId = e.databaseId;
    const t = e.ssl ? "https" : "http", n = encodeURIComponent(this.databaseId.projectId), r2 = encodeURIComponent(this.databaseId.database);
    this.mo = t + "://" + e.host, this.fo = `projects/${n}/databases/${r2}`, this.po = "(default)" === this.databaseId.database ? `project_id=${n}` : `project_id=${n}&database_id=${r2}`;
  }
  get yo() {
    return false;
  }
  wo(e, t, n, r2, i) {
    const s = __PRIVATE_generateUniqueDebugId(), o = this.So(e, t);
    __PRIVATE_logDebug("RestConnection", `Sending RPC '${e}' ${s}:`, o, n);
    const _ = {
      "google-cloud-resource-prefix": this.fo,
      "x-goog-request-params": this.po
    };
    return this.bo(_, r2, i), this.Do(e, o, _, n).then((t2) => (__PRIVATE_logDebug("RestConnection", `Received RPC '${e}' ${s}: `, t2), t2), (t2) => {
      throw __PRIVATE_logWarn("RestConnection", `RPC '${e}' ${s} failed with error: `, t2, "url: ", o, "request:", n), t2;
    });
  }
  Co(e, t, n, r2, i, s) {
    return this.wo(e, t, n, r2, i);
  }
  /**
   * Modifies the headers for a request, adding any authorization token if
   * present and any additional headers for the request.
   */
  bo(e, t, n) {
    e["X-Goog-Api-Client"] = // SDK_VERSION is updated to different value at runtime depending on the entry point,
    // so we need to get its value when we need it in a function.
    function __PRIVATE_getGoogApiClientValue() {
      return "gl-js/ fire/" + S2;
    }(), // Content-Type: text/plain will avoid preflight requests which might
    // mess with CORS and redirects by proxies. If we add custom headers
    // we will need to change this code to potentially use the $httpOverwrite
    // parameter supported by ESF to avoid triggering preflight requests.
    e["Content-Type"] = "text/plain", this.databaseInfo.appId && (e["X-Firebase-GMPID"] = this.databaseInfo.appId), t && t.headers.forEach((t2, n2) => e[n2] = t2), n && n.headers.forEach((t2, n2) => e[n2] = t2);
  }
  So(e, t) {
    const n = Re[e];
    return `${this.mo}/v1/${t}:${n}`;
  }
} {
  constructor(e) {
    super(e), this.forceLongPolling = e.forceLongPolling, this.autoDetectLongPolling = e.autoDetectLongPolling, this.useFetchStreams = e.useFetchStreams, this.longPollingOptions = e.longPollingOptions;
  }
  Do(e, t, n, r2) {
    const i = __PRIVATE_generateUniqueDebugId();
    return new Promise((s, o) => {
      const _ = new XhrIo();
      _.setWithCredentials(true), _.listenOnce(EventType.COMPLETE, () => {
        try {
          switch (_.getLastErrorCode()) {
            case ErrorCode.NO_ERROR:
              const t2 = _.getResponseJson();
              __PRIVATE_logDebug(Ve, `XHR for RPC '${e}' ${i} received:`, JSON.stringify(t2)), s(t2);
              break;
            case ErrorCode.TIMEOUT:
              __PRIVATE_logDebug(Ve, `RPC '${e}' ${i} timed out`), o(new FirestoreError(D2.DEADLINE_EXCEEDED, "Request time out"));
              break;
            case ErrorCode.HTTP_ERROR:
              const n2 = _.getStatus();
              if (__PRIVATE_logDebug(Ve, `RPC '${e}' ${i} failed with status:`, n2, "response text:", _.getResponseText()), n2 > 0) {
                let e2 = _.getResponseJson();
                Array.isArray(e2) && (e2 = e2[0]);
                const t3 = null == e2 ? void 0 : e2.error;
                if (t3 && t3.status && t3.message) {
                  const e3 = function __PRIVATE_mapCodeFromHttpResponseErrorStatus(e4) {
                    const t4 = e4.toLowerCase().replace(/_/g, "-");
                    return Object.values(D2).indexOf(t4) >= 0 ? t4 : D2.UNKNOWN;
                  }(t3.status);
                  o(new FirestoreError(e3, t3.message));
                } else
                  o(new FirestoreError(D2.UNKNOWN, "Server responded with status " + _.getStatus()));
              } else
                o(new FirestoreError(D2.UNAVAILABLE, "Connection failed."));
              break;
            default:
              fail();
          }
        } finally {
          __PRIVATE_logDebug(Ve, `RPC '${e}' ${i} completed.`);
        }
      });
      const a = JSON.stringify(r2);
      __PRIVATE_logDebug(Ve, `RPC '${e}' ${i} sending request:`, r2), _.send(t, "POST", a, n, 15);
    });
  }
  vo(e, t, n) {
    const r2 = __PRIVATE_generateUniqueDebugId(), i = [this.mo, "/", "google.firestore.v1.Firestore", "/", e, "/channel"], s = createWebChannelTransport(), o = getStatEventTarget(), _ = {
      // Required for backend stickiness, routing behavior is based on this
      // parameter.
      httpSessionIdParam: "gsessionid",
      initMessageHeaders: {},
      messageUrlParams: {
        // This param is used to improve routing and project isolation by the
        // backend and must be included in every request.
        database: `projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`
      },
      sendRawJson: true,
      supportsCrossDomainXhr: true,
      internalChannelParams: {
        // Override the default timeout (randomized between 10-20 seconds) since
        // a large write batch on a slow internet connection may take a long
        // time to send to the backend. Rather than have WebChannel impose a
        // tight timeout which could lead to infinite timeouts and retries, we
        // set it very large (5-10 minutes) and rely on the browser's builtin
        // timeouts to kick in if the request isn't working.
        forwardChannelRequestTimeoutMs: 6e5
      },
      forceLongPolling: this.forceLongPolling,
      detectBufferingProxy: this.autoDetectLongPolling
    }, a = this.longPollingOptions.timeoutSeconds;
    void 0 !== a && (_.longPollingTimeout = Math.round(1e3 * a)), this.useFetchStreams && (_.useFetchStreams = true), this.bo(_.initMessageHeaders, t, n), // Sending the custom headers we just added to request.initMessageHeaders
    // (Authorization, etc.) will trigger the browser to make a CORS preflight
    // request because the XHR will no longer meet the criteria for a "simple"
    // CORS request:
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Simple_requests
    // Therefore to avoid the CORS preflight request (an extra network
    // roundtrip), we use the encodeInitMessageHeaders option to specify that
    // the headers should instead be encoded in the request's POST payload,
    // which is recognized by the webchannel backend.
    _.encodeInitMessageHeaders = true;
    const u = i.join("");
    __PRIVATE_logDebug(Ve, `Creating RPC '${e}' stream ${r2}: ${u}`, _);
    const c = s.createWebChannel(u, _);
    let l2 = false, h = false;
    const P2 = new __PRIVATE_StreamBridge({
      co: (t2) => {
        h ? __PRIVATE_logDebug(Ve, `Not sending because RPC '${e}' stream ${r2} is closed:`, t2) : (l2 || (__PRIVATE_logDebug(Ve, `Opening RPC '${e}' stream ${r2} transport.`), c.open(), l2 = true), __PRIVATE_logDebug(Ve, `RPC '${e}' stream ${r2} sending:`, t2), c.send(t2));
      },
      lo: () => c.close()
    }), __PRIVATE_unguardedEventListen = (e2, t2, n2) => {
      e2.listen(t2, (e3) => {
        try {
          n2(e3);
        } catch (e4) {
          setTimeout(() => {
            throw e4;
          }, 0);
        }
      });
    };
    return __PRIVATE_unguardedEventListen(c, WebChannel.EventType.OPEN, () => {
      h || __PRIVATE_logDebug(Ve, `RPC '${e}' stream ${r2} transport opened.`);
    }), __PRIVATE_unguardedEventListen(c, WebChannel.EventType.CLOSE, () => {
      h || (h = true, __PRIVATE_logDebug(Ve, `RPC '${e}' stream ${r2} transport closed`), P2.Ro());
    }), __PRIVATE_unguardedEventListen(c, WebChannel.EventType.ERROR, (t2) => {
      h || (h = true, __PRIVATE_logWarn(Ve, `RPC '${e}' stream ${r2} transport errored:`, t2), P2.Ro(new FirestoreError(D2.UNAVAILABLE, "The operation could not be completed")));
    }), __PRIVATE_unguardedEventListen(c, WebChannel.EventType.MESSAGE, (t2) => {
      var n2;
      if (!h) {
        const i2 = t2.data[0];
        __PRIVATE_hardAssert(!!i2);
        const s2 = i2, o2 = s2.error || (null === (n2 = s2[0]) || void 0 === n2 ? void 0 : n2.error);
        if (o2) {
          __PRIVATE_logDebug(Ve, `RPC '${e}' stream ${r2} received error:`, o2);
          const t3 = o2.status;
          let n3 = (
            /**
            * Maps an error Code from a GRPC status identifier like 'NOT_FOUND'.
            *
            * @returns The Code equivalent to the given status string or undefined if
            *     there is no match.
            */
            function __PRIVATE_mapCodeFromRpcStatus(e2) {
              const t4 = ae2[e2];
              if (void 0 !== t4)
                return __PRIVATE_mapCodeFromRpcCode(t4);
            }(t3)
          ), i3 = o2.message;
          void 0 === n3 && (n3 = D2.INTERNAL, i3 = "Unknown error status: " + t3 + " with message " + o2.message), // Mark closed so no further events are propagated
          h = true, P2.Ro(new FirestoreError(n3, i3)), c.close();
        } else
          __PRIVATE_logDebug(Ve, `RPC '${e}' stream ${r2} received:`, i2), P2.Vo(i2);
      }
    }), __PRIVATE_unguardedEventListen(o, Event.STAT_EVENT, (t2) => {
      t2.stat === Stat.PROXY ? __PRIVATE_logDebug(Ve, `RPC '${e}' stream ${r2} detected buffering proxy`) : t2.stat === Stat.NOPROXY && __PRIVATE_logDebug(Ve, `RPC '${e}' stream ${r2} detected no buffering proxy`);
    }), setTimeout(() => {
      P2.Ao();
    }, 0), P2;
  }
};
function __PRIVATE_getWindow() {
  return "undefined" != typeof window ? window : null;
}
function getDocument() {
  return "undefined" != typeof document ? document : null;
}
function __PRIVATE_newSerializer(e) {
  return new JsonProtoSerializer(
    e,
    /* useProto3Json= */
    true
  );
}
var __PRIVATE_ExponentialBackoff = class {
  constructor(e, t, n = 1e3, r2 = 1.5, i = 6e4) {
    this.si = e, this.timerId = t, this.Fo = n, this.Mo = r2, this.xo = i, this.Oo = 0, this.No = null, /** The last backoff attempt, as epoch milliseconds. */
    this.Bo = Date.now(), this.reset();
  }
  /**
   * Resets the backoff delay.
   *
   * The very next backoffAndWait() will have no delay. If it is called again
   * (i.e. due to an error), initialDelayMs (plus jitter) will be used, and
   * subsequent ones will increase according to the backoffFactor.
   */
  reset() {
    this.Oo = 0;
  }
  /**
   * Resets the backoff delay to the maximum delay (e.g. for use after a
   * RESOURCE_EXHAUSTED error).
   */
  Lo() {
    this.Oo = this.xo;
  }
  /**
   * Returns a promise that resolves after currentDelayMs, and increases the
   * delay for any subsequent attempts. If there was a pending backoff operation
   * already, it will be canceled.
   */
  ko(e) {
    this.cancel();
    const t = Math.floor(this.Oo + this.qo()), n = Math.max(0, Date.now() - this.Bo), r2 = Math.max(0, t - n);
    r2 > 0 && __PRIVATE_logDebug("ExponentialBackoff", `Backing off for ${r2} ms (base delay: ${this.Oo} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`), this.No = this.si.enqueueAfterDelay(this.timerId, r2, () => (this.Bo = Date.now(), e())), // Apply backoff factor to determine next delay and ensure it is within
    // bounds.
    this.Oo *= this.Mo, this.Oo < this.Fo && (this.Oo = this.Fo), this.Oo > this.xo && (this.Oo = this.xo);
  }
  Qo() {
    null !== this.No && (this.No.skipDelay(), this.No = null);
  }
  cancel() {
    null !== this.No && (this.No.cancel(), this.No = null);
  }
  /** Returns a random value in the range [-currentBaseMs/2, currentBaseMs/2] */
  qo() {
    return (Math.random() - 0.5) * this.Oo;
  }
};
var __PRIVATE_PersistentStream = class {
  constructor(e, t, n, r2, i, s, o, _) {
    this.si = e, this.Ko = n, this.$o = r2, this.connection = i, this.authCredentialsProvider = s, this.appCheckCredentialsProvider = o, this.listener = _, this.state = 0, /**
     * A close count that's incremented every time the stream is closed; used by
     * getCloseGuardedDispatcher() to invalidate callbacks that happen after
     * close.
     */
    this.Uo = 0, this.Wo = null, this.Go = null, this.stream = null, this.zo = new __PRIVATE_ExponentialBackoff(e, t);
  }
  /**
   * Returns true if start() has been called and no error has occurred. True
   * indicates the stream is open or in the process of opening (which
   * encompasses respecting backoff, getting auth tokens, and starting the
   * actual RPC). Use isOpen() to determine if the stream is open and ready for
   * outbound requests.
   */
  jo() {
    return 1 === this.state || 5 === this.state || this.Ho();
  }
  /**
   * Returns true if the underlying RPC is open (the onOpen() listener has been
   * called) and the stream is ready for outbound requests.
   */
  Ho() {
    return 2 === this.state || 3 === this.state;
  }
  /**
   * Starts the RPC. Only allowed if isStarted() returns false. The stream is
   * not immediately ready for use: onOpen() will be invoked when the RPC is
   * ready for outbound requests, at which point isOpen() will return true.
   *
   * When start returns, isStarted() will return true.
   */
  start() {
    4 !== this.state ? this.auth() : this.Jo();
  }
  /**
   * Stops the RPC. This call is idempotent and allowed regardless of the
   * current isStarted() state.
   *
   * When stop returns, isStarted() and isOpen() will both return false.
   */
  stop() {
    return __async(this, null, function* () {
      this.jo() && (yield this.close(
        0
        /* PersistentStreamState.Initial */
      ));
    });
  }
  /**
   * After an error the stream will usually back off on the next attempt to
   * start it. If the error warrants an immediate restart of the stream, the
   * sender can use this to indicate that the receiver should not back off.
   *
   * Each error will call the onClose() listener. That function can decide to
   * inhibit backoff if required.
   */
  Yo() {
    this.state = 0, this.zo.reset();
  }
  /**
   * Marks this stream as idle. If no further actions are performed on the
   * stream for one minute, the stream will automatically close itself and
   * notify the stream's onClose() handler with Status.OK. The stream will then
   * be in a !isStarted() state, requiring the caller to start the stream again
   * before further use.
   *
   * Only streams that are in state 'Open' can be marked idle, as all other
   * states imply pending network operations.
   */
  Zo() {
    this.Ho() && null === this.Wo && (this.Wo = this.si.enqueueAfterDelay(this.Ko, 6e4, () => this.Xo()));
  }
  /** Sends a message to the underlying stream. */
  e_(e) {
    this.t_(), this.stream.send(e);
  }
  /** Called by the idle timer when the stream should close due to inactivity. */
  Xo() {
    return __async(this, null, function* () {
      if (this.Ho())
        return this.close(
          0
          /* PersistentStreamState.Initial */
        );
    });
  }
  /** Marks the stream as active again. */
  t_() {
    this.Wo && (this.Wo.cancel(), this.Wo = null);
  }
  /** Cancels the health check delayed operation. */
  n_() {
    this.Go && (this.Go.cancel(), this.Go = null);
  }
  /**
   * Closes the stream and cleans up as necessary:
   *
   * * closes the underlying GRPC stream;
   * * calls the onClose handler with the given 'error';
   * * sets internal stream state to 'finalState';
   * * adjusts the backoff timer based on the error
   *
   * A new stream can be opened by calling start().
   *
   * @param finalState - the intended state of the stream after closing.
   * @param error - the error the connection was closed with.
   */
  close(e, t) {
    return __async(this, null, function* () {
      this.t_(), this.n_(), this.zo.cancel(), // Invalidates any stream-related callbacks (e.g. from auth or the
      // underlying stream), guaranteeing they won't execute.
      this.Uo++, 4 !== e ? (
        // If this is an intentional close ensure we don't delay our next connection attempt.
        this.zo.reset()
      ) : t && t.code === D2.RESOURCE_EXHAUSTED ? (
        // Log the error. (Probably either 'quota exceeded' or 'max queue length reached'.)
        (__PRIVATE_logError(t.toString()), __PRIVATE_logError("Using maximum backoff delay to prevent overloading the backend."), this.zo.Lo())
      ) : t && t.code === D2.UNAUTHENTICATED && 3 !== this.state && // "unauthenticated" error means the token was rejected. This should rarely
      // happen since both Auth and AppCheck ensure a sufficient TTL when we
      // request a token. If a user manually resets their system clock this can
      // fail, however. In this case, we should get a Code.UNAUTHENTICATED error
      // before we received the first message and we need to invalidate the token
      // to ensure that we fetch a new token.
      (this.authCredentialsProvider.invalidateToken(), this.appCheckCredentialsProvider.invalidateToken()), // Clean up the underlying stream because we are no longer interested in events.
      null !== this.stream && (this.r_(), this.stream.close(), this.stream = null), // This state must be assigned before calling onClose() to allow the callback to
      // inhibit backoff or otherwise manipulate the state in its non-started state.
      this.state = e, // Notify the listener that the stream closed.
      yield this.listener.Io(t);
    });
  }
  /**
   * Can be overridden to perform additional cleanup before the stream is closed.
   * Calling super.tearDown() is not required.
   */
  r_() {
  }
  auth() {
    this.state = 1;
    const e = this.i_(this.Uo), t = this.Uo;
    Promise.all([this.authCredentialsProvider.getToken(), this.appCheckCredentialsProvider.getToken()]).then(([e2, n]) => {
      this.Uo === t && // Normally we'd have to schedule the callback on the AsyncQueue.
      // However, the following calls are safe to be called outside the
      // AsyncQueue since they don't chain asynchronous calls
      this.s_(e2, n);
    }, (t2) => {
      e(() => {
        const e2 = new FirestoreError(D2.UNKNOWN, "Fetching auth token failed: " + t2.message);
        return this.o_(e2);
      });
    });
  }
  s_(e, t) {
    const n = this.i_(this.Uo);
    this.stream = this.__(e, t), this.stream.ho(() => {
      n(() => (this.state = 2, this.Go = this.si.enqueueAfterDelay(this.$o, 1e4, () => (this.Ho() && (this.state = 3), Promise.resolve())), this.listener.ho()));
    }), this.stream.Io((e2) => {
      n(() => this.o_(e2));
    }), this.stream.onMessage((e2) => {
      n(() => this.onMessage(e2));
    });
  }
  Jo() {
    this.state = 5, this.zo.ko(() => __async(this, null, function* () {
      this.state = 0, this.start();
    }));
  }
  // Visible for tests
  o_(e) {
    return __PRIVATE_logDebug("PersistentStream", `close with error: ${e}`), this.stream = null, this.close(4, e);
  }
  /**
   * Returns a "dispatcher" function that dispatches operations onto the
   * AsyncQueue but only runs them if closeCount remains unchanged. This allows
   * us to turn auth / stream callbacks into no-ops if the stream is closed /
   * re-opened, etc.
   */
  i_(e) {
    return (t) => {
      this.si.enqueueAndForget(() => this.Uo === e ? t() : (__PRIVATE_logDebug("PersistentStream", "stream callback skipped by getCloseGuardedDispatcher."), Promise.resolve()));
    };
  }
};
var __PRIVATE_PersistentListenStream = class extends __PRIVATE_PersistentStream {
  constructor(e, t, n, r2, i, s) {
    super(e, "listen_stream_connection_backoff", "listen_stream_idle", "health_check_timeout", t, n, r2, s), this.serializer = i;
  }
  __(e, t) {
    return this.connection.vo("Listen", e, t);
  }
  onMessage(e) {
    this.zo.reset();
    const t = __PRIVATE_fromWatchChange(this.serializer, e), n = function __PRIVATE_versionFromListenResponse(e2) {
      if (!("targetChange" in e2))
        return SnapshotVersion.min();
      const t2 = e2.targetChange;
      return t2.targetIds && t2.targetIds.length ? SnapshotVersion.min() : t2.readTime ? __PRIVATE_fromVersion(t2.readTime) : SnapshotVersion.min();
    }(e);
    return this.listener.a_(t, n);
  }
  /**
   * Registers interest in the results of the given target. If the target
   * includes a resumeToken it will be included in the request. Results that
   * affect the target will be streamed back as WatchChange messages that
   * reference the targetId.
   */
  u_(e) {
    const t = {};
    t.database = __PRIVATE_getEncodedDatabaseId(this.serializer), t.addTarget = function __PRIVATE_toTarget(e2, t2) {
      let n2;
      const r2 = t2.target;
      if (n2 = __PRIVATE_targetIsDocumentTarget(r2) ? {
        documents: __PRIVATE_toDocumentsTarget(e2, r2)
      } : {
        query: __PRIVATE_toQueryTarget(e2, r2)
      }, n2.targetId = t2.targetId, t2.resumeToken.approximateByteSize() > 0) {
        n2.resumeToken = __PRIVATE_toBytes(e2, t2.resumeToken);
        const r3 = __PRIVATE_toInt32Proto(e2, t2.expectedCount);
        null !== r3 && (n2.expectedCount = r3);
      } else if (t2.snapshotVersion.compareTo(SnapshotVersion.min()) > 0) {
        n2.readTime = toTimestamp(e2, t2.snapshotVersion.toTimestamp());
        const r3 = __PRIVATE_toInt32Proto(e2, t2.expectedCount);
        null !== r3 && (n2.expectedCount = r3);
      }
      return n2;
    }(this.serializer, e);
    const n = __PRIVATE_toListenRequestLabels(this.serializer, e);
    n && (t.labels = n), this.e_(t);
  }
  /**
   * Unregisters interest in the results of the target associated with the
   * given targetId.
   */
  c_(e) {
    const t = {};
    t.database = __PRIVATE_getEncodedDatabaseId(this.serializer), t.removeTarget = e, this.e_(t);
  }
};
var __PRIVATE_PersistentWriteStream = class extends __PRIVATE_PersistentStream {
  constructor(e, t, n, r2, i, s) {
    super(e, "write_stream_connection_backoff", "write_stream_idle", "health_check_timeout", t, n, r2, s), this.serializer = i, this.l_ = false;
  }
  /**
   * Tracks whether or not a handshake has been successfully exchanged and
   * the stream is ready to accept mutations.
   */
  get h_() {
    return this.l_;
  }
  // Override of PersistentStream.start
  start() {
    this.l_ = false, this.lastStreamToken = void 0, super.start();
  }
  r_() {
    this.l_ && this.P_([]);
  }
  __(e, t) {
    return this.connection.vo("Write", e, t);
  }
  onMessage(e) {
    if (
      // Always capture the last stream token.
      __PRIVATE_hardAssert(!!e.streamToken), this.lastStreamToken = e.streamToken, this.l_
    ) {
      this.zo.reset();
      const t = __PRIVATE_fromWriteResults(e.writeResults, e.commitTime), n = __PRIVATE_fromVersion(e.commitTime);
      return this.listener.I_(n, t);
    }
    return __PRIVATE_hardAssert(!e.writeResults || 0 === e.writeResults.length), this.l_ = true, this.listener.T_();
  }
  /**
   * Sends an initial streamToken to the server, performing the handshake
   * required to make the StreamingWrite RPC work. Subsequent
   * calls should wait until onHandshakeComplete was called.
   */
  E_() {
    const e = {};
    e.database = __PRIVATE_getEncodedDatabaseId(this.serializer), this.e_(e);
  }
  /** Sends a group of mutations to the Firestore backend to apply. */
  P_(e) {
    const t = {
      streamToken: this.lastStreamToken,
      writes: e.map((e2) => toMutation(this.serializer, e2))
    };
    this.e_(t);
  }
};
var __PRIVATE_DatastoreImpl = class extends class Datastore {
} {
  constructor(e, t, n, r2) {
    super(), this.authCredentials = e, this.appCheckCredentials = t, this.connection = n, this.serializer = r2, this.d_ = false;
  }
  A_() {
    if (this.d_)
      throw new FirestoreError(D2.FAILED_PRECONDITION, "The client has already been terminated.");
  }
  /** Invokes the provided RPC with auth and AppCheck tokens. */
  wo(e, t, n) {
    return this.A_(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([r2, i]) => this.connection.wo(e, t, n, r2, i)).catch((e2) => {
      throw "FirebaseError" === e2.name ? (e2.code === D2.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e2) : new FirestoreError(D2.UNKNOWN, e2.toString());
    });
  }
  /** Invokes the provided RPC with streamed results with auth and AppCheck tokens. */
  Co(e, t, n, r2) {
    return this.A_(), Promise.all([this.authCredentials.getToken(), this.appCheckCredentials.getToken()]).then(([i, s]) => this.connection.Co(e, t, n, i, s, r2)).catch((e2) => {
      throw "FirebaseError" === e2.name ? (e2.code === D2.UNAUTHENTICATED && (this.authCredentials.invalidateToken(), this.appCheckCredentials.invalidateToken()), e2) : new FirestoreError(D2.UNKNOWN, e2.toString());
    });
  }
  terminate() {
    this.d_ = true;
  }
};
function __PRIVATE_invokeRunAggregationQueryRpc(e, t, n) {
  return __async(this, null, function* () {
    var r2;
    const i = __PRIVATE_debugCast(e), { request: s, R_: o } = function __PRIVATE_toRunAggregationQueryRequest(e2, t2, n2) {
      const r3 = __PRIVATE_toQueryTarget(e2, t2), i2 = {}, s2 = [];
      let o2 = 0;
      return n2.forEach((e3) => {
        const t3 = "aggregate_" + o2++;
        i2[t3] = e3.alias, "count" === e3.aggregateType ? s2.push({
          alias: t3,
          count: {}
        }) : "avg" === e3.aggregateType ? s2.push({
          alias: t3,
          avg: {
            field: __PRIVATE_toFieldPathReference(e3.fieldPath)
          }
        }) : "sum" === e3.aggregateType && s2.push({
          alias: t3,
          sum: {
            field: __PRIVATE_toFieldPathReference(e3.fieldPath)
          }
        });
      }), {
        request: {
          structuredAggregationQuery: {
            aggregations: s2,
            structuredQuery: r3.structuredQuery
          },
          parent: r3.parent
        },
        R_: i2
      };
    }(i.serializer, function __PRIVATE_queryToAggregateTarget(e2) {
      const t2 = __PRIVATE_debugCast(e2);
      return t2.Pe || // Do not include implicit order-bys for aggregate queries.
      (t2.Pe = __PRIVATE__queryToTarget(t2, e2.explicitOrderBy)), t2.Pe;
    }(t), n), _ = s.parent;
    i.connection.yo || delete s.parent;
    const a = (yield i.Co(
      "RunAggregationQuery",
      _,
      s,
      /*expectedResponseCount=*/
      1
    )).filter((e2) => !!e2.result);
    __PRIVATE_hardAssert(1 === a.length);
    const u = null === (r2 = a[0].result) || void 0 === r2 ? void 0 : r2.aggregateFields;
    return Object.keys(u).reduce((e2, t2) => (e2[o[t2]] = u[t2], e2), {});
  });
}
var __PRIVATE_OnlineStateTracker = class {
  constructor(e, t) {
    this.asyncQueue = e, this.onlineStateHandler = t, /** The current OnlineState. */
    this.state = "Unknown", /**
     * A count of consecutive failures to open the stream. If it reaches the
     * maximum defined by MAX_WATCH_STREAM_FAILURES, we'll set the OnlineState to
     * Offline.
     */
    this.V_ = 0, /**
     * A timer that elapses after ONLINE_STATE_TIMEOUT_MS, at which point we
     * transition from OnlineState.Unknown to OnlineState.Offline without waiting
     * for the stream to actually fail (MAX_WATCH_STREAM_FAILURES times).
     */
    this.m_ = null, /**
     * Whether the client should log a warning message if it fails to connect to
     * the backend (initially true, cleared after a successful stream, or if we've
     * logged the message already).
     */
    this.f_ = true;
  }
  /**
   * Called by RemoteStore when a watch stream is started (including on each
   * backoff attempt).
   *
   * If this is the first attempt, it sets the OnlineState to Unknown and starts
   * the onlineStateTimer.
   */
  g_() {
    0 === this.V_ && (this.p_(
      "Unknown"
      /* OnlineState.Unknown */
    ), this.m_ = this.asyncQueue.enqueueAfterDelay("online_state_timeout", 1e4, () => (this.m_ = null, this.y_("Backend didn't respond within 10 seconds."), this.p_(
      "Offline"
      /* OnlineState.Offline */
    ), Promise.resolve())));
  }
  /**
   * Updates our OnlineState as appropriate after the watch stream reports a
   * failure. The first failure moves us to the 'Unknown' state. We then may
   * allow multiple failures (based on MAX_WATCH_STREAM_FAILURES) before we
   * actually transition to the 'Offline' state.
   */
  w_(e) {
    "Online" === this.state ? this.p_(
      "Unknown"
      /* OnlineState.Unknown */
    ) : (this.V_++, this.V_ >= 1 && (this.S_(), this.y_(`Connection failed 1 times. Most recent error: ${e.toString()}`), this.p_(
      "Offline"
      /* OnlineState.Offline */
    )));
  }
  /**
   * Explicitly sets the OnlineState to the specified state.
   *
   * Note that this resets our timers / failure counters, etc. used by our
   * Offline heuristics, so must not be used in place of
   * handleWatchStreamStart() and handleWatchStreamFailure().
   */
  set(e) {
    this.S_(), this.V_ = 0, "Online" === e && // We've connected to watch at least once. Don't warn the developer
    // about being offline going forward.
    (this.f_ = false), this.p_(e);
  }
  p_(e) {
    e !== this.state && (this.state = e, this.onlineStateHandler(e));
  }
  y_(e) {
    const t = `Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;
    this.f_ ? (__PRIVATE_logError(t), this.f_ = false) : __PRIVATE_logDebug("OnlineStateTracker", t);
  }
  S_() {
    null !== this.m_ && (this.m_.cancel(), this.m_ = null);
  }
};
var __PRIVATE_RemoteStoreImpl = class {
  constructor(e, t, n, r2, i) {
    this.localStore = e, this.datastore = t, this.asyncQueue = n, this.remoteSyncer = {}, /**
     * A list of up to MAX_PENDING_WRITES writes that we have fetched from the
     * LocalStore via fillWritePipeline() and have or will send to the write
     * stream.
     *
     * Whenever writePipeline.length > 0 the RemoteStore will attempt to start or
     * restart the write stream. When the stream is established the writes in the
     * pipeline will be sent in order.
     *
     * Writes remain in writePipeline until they are acknowledged by the backend
     * and thus will automatically be re-sent if the stream is interrupted /
     * restarted before they're acknowledged.
     *
     * Write responses from the backend are linked to their originating request
     * purely based on order, and so we can just shift() writes from the front of
     * the writePipeline as we receive responses.
     */
    this.b_ = [], /**
     * A mapping of watched targets that the client cares about tracking and the
     * user has explicitly called a 'listen' for this target.
     *
     * These targets may or may not have been sent to or acknowledged by the
     * server. On re-establishing the listen stream, these targets should be sent
     * to the server. The targets removed with unlistens are removed eagerly
     * without waiting for confirmation from the listen stream.
     */
    this.D_ = /* @__PURE__ */ new Map(), /**
     * A set of reasons for why the RemoteStore may be offline. If empty, the
     * RemoteStore may start its network connections.
     */
    this.C_ = /* @__PURE__ */ new Set(), /**
     * Event handlers that get called when the network is disabled or enabled.
     *
     * PORTING NOTE: These functions are used on the Web client to create the
     * underlying streams (to support tree-shakeable streams). On Android and iOS,
     * the streams are created during construction of RemoteStore.
     */
    this.v_ = [], this.F_ = i, this.F_.ro((e2) => {
      n.enqueueAndForget(() => __async(this, null, function* () {
        __PRIVATE_canUseNetwork(this) && (__PRIVATE_logDebug("RemoteStore", "Restarting streams for network reachability change."), yield function __PRIVATE_restartNetwork(e3) {
          return __async(this, null, function* () {
            const t2 = __PRIVATE_debugCast(e3);
            t2.C_.add(
              4
              /* OfflineCause.ConnectivityChange */
            ), yield __PRIVATE_disableNetworkInternal(t2), t2.M_.set(
              "Unknown"
              /* OnlineState.Unknown */
            ), t2.C_.delete(
              4
              /* OfflineCause.ConnectivityChange */
            ), yield __PRIVATE_enableNetworkInternal(t2);
          });
        }(this));
      }));
    }), this.M_ = new __PRIVATE_OnlineStateTracker(n, r2);
  }
};
function __PRIVATE_enableNetworkInternal(e) {
  return __async(this, null, function* () {
    if (__PRIVATE_canUseNetwork(e))
      for (const t of e.v_)
        yield t(
          /* enabled= */
          true
        );
  });
}
function __PRIVATE_disableNetworkInternal(e) {
  return __async(this, null, function* () {
    for (const t of e.v_)
      yield t(
        /* enabled= */
        false
      );
  });
}
function __PRIVATE_remoteStoreListen(e, t) {
  const n = __PRIVATE_debugCast(e);
  n.D_.has(t.targetId) || // Mark this as something the client is currently listening for.
  (n.D_.set(t.targetId, t), __PRIVATE_shouldStartWatchStream(n) ? (
    // The listen will be sent in onWatchStreamOpen
    __PRIVATE_startWatchStream(n)
  ) : __PRIVATE_ensureWatchStream(n).Ho() && __PRIVATE_sendWatchRequest(n, t));
}
function __PRIVATE_remoteStoreUnlisten(e, t) {
  const n = __PRIVATE_debugCast(e), r2 = __PRIVATE_ensureWatchStream(n);
  n.D_.delete(t), r2.Ho() && __PRIVATE_sendUnwatchRequest(n, t), 0 === n.D_.size && (r2.Ho() ? r2.Zo() : __PRIVATE_canUseNetwork(n) && // Revert to OnlineState.Unknown if the watch stream is not open and we
  // have no listeners, since without any listens to send we cannot
  // confirm if the stream is healthy and upgrade to OnlineState.Online.
  n.M_.set(
    "Unknown"
    /* OnlineState.Unknown */
  ));
}
function __PRIVATE_sendWatchRequest(e, t) {
  if (e.x_.Oe(t.targetId), t.resumeToken.approximateByteSize() > 0 || t.snapshotVersion.compareTo(SnapshotVersion.min()) > 0) {
    const n = e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;
    t = t.withExpectedCount(n);
  }
  __PRIVATE_ensureWatchStream(e).u_(t);
}
function __PRIVATE_sendUnwatchRequest(e, t) {
  e.x_.Oe(t), __PRIVATE_ensureWatchStream(e).c_(t);
}
function __PRIVATE_startWatchStream(e) {
  e.x_ = new __PRIVATE_WatchChangeAggregator({
    getRemoteKeysForTarget: (t) => e.remoteSyncer.getRemoteKeysForTarget(t),
    _t: (t) => e.D_.get(t) || null,
    nt: () => e.datastore.serializer.databaseId
  }), __PRIVATE_ensureWatchStream(e).start(), e.M_.g_();
}
function __PRIVATE_shouldStartWatchStream(e) {
  return __PRIVATE_canUseNetwork(e) && !__PRIVATE_ensureWatchStream(e).jo() && e.D_.size > 0;
}
function __PRIVATE_canUseNetwork(e) {
  return 0 === __PRIVATE_debugCast(e).C_.size;
}
function __PRIVATE_cleanUpWatchStreamState(e) {
  e.x_ = void 0;
}
function __PRIVATE_onWatchStreamOpen(e) {
  return __async(this, null, function* () {
    e.D_.forEach((t, n) => {
      __PRIVATE_sendWatchRequest(e, t);
    });
  });
}
function __PRIVATE_onWatchStreamClose(e, t) {
  return __async(this, null, function* () {
    __PRIVATE_cleanUpWatchStreamState(e), // If we still need the watch stream, retry the connection.
    __PRIVATE_shouldStartWatchStream(e) ? (e.M_.w_(t), __PRIVATE_startWatchStream(e)) : (
      // No need to restart watch stream because there are no active targets.
      // The online state is set to unknown because there is no active attempt
      // at establishing a connection
      e.M_.set(
        "Unknown"
        /* OnlineState.Unknown */
      )
    );
  });
}
function __PRIVATE_onWatchStreamChange(e, t, n) {
  return __async(this, null, function* () {
    if (
      // Mark the client as online since we got a message from the server
      e.M_.set(
        "Online"
        /* OnlineState.Online */
      ), t instanceof __PRIVATE_WatchTargetChange && 2 === t.state && t.cause
    )
      try {
        yield (
          /** Handles an error on a target */
          function __PRIVATE_handleTargetError(e2, t2) {
            return __async(this, null, function* () {
              const n2 = t2.cause;
              for (const r2 of t2.targetIds)
                e2.D_.has(r2) && (yield e2.remoteSyncer.rejectListen(r2, n2), e2.D_.delete(r2), e2.x_.removeTarget(r2));
            });
          }(e, t)
        );
      } catch (n2) {
        __PRIVATE_logDebug("RemoteStore", "Failed to remove targets %s: %s ", t.targetIds.join(","), n2), yield __PRIVATE_disableNetworkUntilRecovery(e, n2);
      }
    else if (t instanceof __PRIVATE_DocumentWatchChange ? e.x_.$e(t) : t instanceof __PRIVATE_ExistenceFilterChange ? e.x_.Je(t) : e.x_.Ge(t), !n.isEqual(SnapshotVersion.min()))
      try {
        const t2 = yield __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e.localStore);
        n.compareTo(t2) >= 0 && // We have received a target change with a global snapshot if the snapshot
        // version is not equal to SnapshotVersion.min().
        (yield (
          /**
          * Takes a batch of changes from the Datastore, repackages them as a
          * RemoteEvent, and passes that on to the listener, which is typically the
          * SyncEngine.
          */
          function __PRIVATE_raiseWatchSnapshot(e2, t3) {
            const n2 = e2.x_.it(t3);
            return n2.targetChanges.forEach((n3, r2) => {
              if (n3.resumeToken.approximateByteSize() > 0) {
                const i = e2.D_.get(r2);
                i && e2.D_.set(r2, i.withResumeToken(n3.resumeToken, t3));
              }
            }), // Re-establish listens for the targets that have been invalidated by
            // existence filter mismatches.
            n2.targetMismatches.forEach((t4, n3) => {
              const r2 = e2.D_.get(t4);
              if (!r2)
                return;
              e2.D_.set(t4, r2.withResumeToken(ByteString.EMPTY_BYTE_STRING, r2.snapshotVersion)), // Cause a hard reset by unwatching and rewatching immediately, but
              // deliberately don't send a resume token so that we get a full update.
              __PRIVATE_sendUnwatchRequest(e2, t4);
              const i = new TargetData(r2.target, t4, n3, r2.sequenceNumber);
              __PRIVATE_sendWatchRequest(e2, i);
            }), e2.remoteSyncer.applyRemoteEvent(n2);
          }(e, n)
        ));
      } catch (t2) {
        __PRIVATE_logDebug("RemoteStore", "Failed to raise snapshot:", t2), yield __PRIVATE_disableNetworkUntilRecovery(e, t2);
      }
  });
}
function __PRIVATE_disableNetworkUntilRecovery(e, t, n) {
  return __async(this, null, function* () {
    if (!__PRIVATE_isIndexedDbTransactionError(t))
      throw t;
    e.C_.add(
      1
      /* OfflineCause.IndexedDbFailed */
    ), // Disable network and raise offline snapshots
    yield __PRIVATE_disableNetworkInternal(e), e.M_.set(
      "Offline"
      /* OnlineState.Offline */
    ), n || // Use a simple read operation to determine if IndexedDB recovered.
    // Ideally, we would expose a health check directly on SimpleDb, but
    // RemoteStore only has access to persistence through LocalStore.
    (n = () => __PRIVATE_localStoreGetLastRemoteSnapshotVersion(e.localStore)), // Probe IndexedDB periodically and re-enable network
    e.asyncQueue.enqueueRetryable(() => __async(this, null, function* () {
      __PRIVATE_logDebug("RemoteStore", "Retrying IndexedDB access"), yield n(), e.C_.delete(
        1
        /* OfflineCause.IndexedDbFailed */
      ), yield __PRIVATE_enableNetworkInternal(e);
    }));
  });
}
function __PRIVATE_executeWithRecovery(e, t) {
  return t().catch((n) => __PRIVATE_disableNetworkUntilRecovery(e, n, t));
}
function __PRIVATE_fillWritePipeline(e) {
  return __async(this, null, function* () {
    const t = __PRIVATE_debugCast(e), n = __PRIVATE_ensureWriteStream(t);
    let r2 = t.b_.length > 0 ? t.b_[t.b_.length - 1].batchId : -1;
    for (; __PRIVATE_canAddToWritePipeline(t); )
      try {
        const e2 = yield __PRIVATE_localStoreGetNextMutationBatch(t.localStore, r2);
        if (null === e2) {
          0 === t.b_.length && n.Zo();
          break;
        }
        r2 = e2.batchId, __PRIVATE_addToWritePipeline(t, e2);
      } catch (e2) {
        yield __PRIVATE_disableNetworkUntilRecovery(t, e2);
      }
    __PRIVATE_shouldStartWriteStream(t) && __PRIVATE_startWriteStream(t);
  });
}
function __PRIVATE_canAddToWritePipeline(e) {
  return __PRIVATE_canUseNetwork(e) && e.b_.length < 10;
}
function __PRIVATE_addToWritePipeline(e, t) {
  e.b_.push(t);
  const n = __PRIVATE_ensureWriteStream(e);
  n.Ho() && n.h_ && n.P_(t.mutations);
}
function __PRIVATE_shouldStartWriteStream(e) {
  return __PRIVATE_canUseNetwork(e) && !__PRIVATE_ensureWriteStream(e).jo() && e.b_.length > 0;
}
function __PRIVATE_startWriteStream(e) {
  __PRIVATE_ensureWriteStream(e).start();
}
function __PRIVATE_onWriteStreamOpen(e) {
  return __async(this, null, function* () {
    __PRIVATE_ensureWriteStream(e).E_();
  });
}
function __PRIVATE_onWriteHandshakeComplete(e) {
  return __async(this, null, function* () {
    const t = __PRIVATE_ensureWriteStream(e);
    for (const n of e.b_)
      t.P_(n.mutations);
  });
}
function __PRIVATE_onMutationResult(e, t, n) {
  return __async(this, null, function* () {
    const r2 = e.b_.shift(), i = MutationBatchResult.from(r2, t, n);
    yield __PRIVATE_executeWithRecovery(e, () => e.remoteSyncer.applySuccessfulWrite(i)), // It's possible that with the completion of this mutation another
    // slot has freed up.
    yield __PRIVATE_fillWritePipeline(e);
  });
}
function __PRIVATE_onWriteStreamClose(e, t) {
  return __async(this, null, function* () {
    t && __PRIVATE_ensureWriteStream(e).h_ && // This error affects the actual write.
    (yield function __PRIVATE_handleWriteError(e2, t2) {
      return __async(this, null, function* () {
        if (function __PRIVATE_isPermanentWriteError(e3) {
          return __PRIVATE_isPermanentError(e3) && e3 !== D2.ABORTED;
        }(t2.code)) {
          const n = e2.b_.shift();
          __PRIVATE_ensureWriteStream(e2).Yo(), yield __PRIVATE_executeWithRecovery(e2, () => e2.remoteSyncer.rejectFailedWrite(n.batchId, t2)), // It's possible that with the completion of this mutation
          // another slot has freed up.
          yield __PRIVATE_fillWritePipeline(e2);
        }
      });
    }(e, t)), // The write stream might have been started by refilling the write
    // pipeline for failed writes
    __PRIVATE_shouldStartWriteStream(e) && __PRIVATE_startWriteStream(e);
  });
}
function __PRIVATE_remoteStoreHandleCredentialChange(e, t) {
  return __async(this, null, function* () {
    const n = __PRIVATE_debugCast(e);
    n.asyncQueue.verifyOperationInProgress(), __PRIVATE_logDebug("RemoteStore", "RemoteStore received new credentials");
    const r2 = __PRIVATE_canUseNetwork(n);
    n.C_.add(
      3
      /* OfflineCause.CredentialChange */
    ), yield __PRIVATE_disableNetworkInternal(n), r2 && // Don't set the network status to Unknown if we are offline.
    n.M_.set(
      "Unknown"
      /* OnlineState.Unknown */
    ), yield n.remoteSyncer.handleCredentialChange(t), n.C_.delete(
      3
      /* OfflineCause.CredentialChange */
    ), yield __PRIVATE_enableNetworkInternal(n);
  });
}
function __PRIVATE_remoteStoreApplyPrimaryState(e, t) {
  return __async(this, null, function* () {
    const n = __PRIVATE_debugCast(e);
    t ? (n.C_.delete(
      2
      /* OfflineCause.IsSecondary */
    ), yield __PRIVATE_enableNetworkInternal(n)) : t || (n.C_.add(
      2
      /* OfflineCause.IsSecondary */
    ), yield __PRIVATE_disableNetworkInternal(n), n.M_.set(
      "Unknown"
      /* OnlineState.Unknown */
    ));
  });
}
function __PRIVATE_ensureWatchStream(e) {
  return e.O_ || // Create stream (but note that it is not started yet).
  (e.O_ = function __PRIVATE_newPersistentWatchStream(e2, t, n) {
    const r2 = __PRIVATE_debugCast(e2);
    return r2.A_(), new __PRIVATE_PersistentListenStream(t, r2.connection, r2.authCredentials, r2.appCheckCredentials, r2.serializer, n);
  }(e.datastore, e.asyncQueue, {
    ho: __PRIVATE_onWatchStreamOpen.bind(null, e),
    Io: __PRIVATE_onWatchStreamClose.bind(null, e),
    a_: __PRIVATE_onWatchStreamChange.bind(null, e)
  }), e.v_.push((t) => __async(this, null, function* () {
    t ? (e.O_.Yo(), __PRIVATE_shouldStartWatchStream(e) ? __PRIVATE_startWatchStream(e) : e.M_.set(
      "Unknown"
      /* OnlineState.Unknown */
    )) : (yield e.O_.stop(), __PRIVATE_cleanUpWatchStreamState(e));
  }))), e.O_;
}
function __PRIVATE_ensureWriteStream(e) {
  return e.N_ || // Create stream (but note that it is not started yet).
  (e.N_ = function __PRIVATE_newPersistentWriteStream(e2, t, n) {
    const r2 = __PRIVATE_debugCast(e2);
    return r2.A_(), new __PRIVATE_PersistentWriteStream(t, r2.connection, r2.authCredentials, r2.appCheckCredentials, r2.serializer, n);
  }(e.datastore, e.asyncQueue, {
    ho: __PRIVATE_onWriteStreamOpen.bind(null, e),
    Io: __PRIVATE_onWriteStreamClose.bind(null, e),
    T_: __PRIVATE_onWriteHandshakeComplete.bind(null, e),
    I_: __PRIVATE_onMutationResult.bind(null, e)
  }), e.v_.push((t) => __async(this, null, function* () {
    t ? (e.N_.Yo(), // This will start the write stream if necessary.
    yield __PRIVATE_fillWritePipeline(e)) : (yield e.N_.stop(), e.b_.length > 0 && (__PRIVATE_logDebug("RemoteStore", `Stopping write stream with ${e.b_.length} pending writes`), e.b_ = []));
  }))), e.N_;
}
var DelayedOperation = class _DelayedOperation {
  constructor(e, t, n, r2, i) {
    this.asyncQueue = e, this.timerId = t, this.targetTimeMs = n, this.op = r2, this.removalCallback = i, this.deferred = new __PRIVATE_Deferred(), this.then = this.deferred.promise.then.bind(this.deferred.promise), // It's normal for the deferred promise to be canceled (due to cancellation)
    // and so we attach a dummy catch callback to avoid
    // 'UnhandledPromiseRejectionWarning' log spam.
    this.deferred.promise.catch((e2) => {
    });
  }
  get promise() {
    return this.deferred.promise;
  }
  /**
   * Creates and returns a DelayedOperation that has been scheduled to be
   * executed on the provided asyncQueue after the provided delayMs.
   *
   * @param asyncQueue - The queue to schedule the operation on.
   * @param id - A Timer ID identifying the type of operation this is.
   * @param delayMs - The delay (ms) before the operation should be scheduled.
   * @param op - The operation to run.
   * @param removalCallback - A callback to be called synchronously once the
   *   operation is executed or canceled, notifying the AsyncQueue to remove it
   *   from its delayedOperations list.
   *   PORTING NOTE: This exists to prevent making removeDelayedOperation() and
   *   the DelayedOperation class public.
   */
  static createAndSchedule(e, t, n, r2, i) {
    const s = Date.now() + n, o = new _DelayedOperation(e, t, s, r2, i);
    return o.start(n), o;
  }
  /**
   * Starts the timer. This is called immediately after construction by
   * createAndSchedule().
   */
  start(e) {
    this.timerHandle = setTimeout(() => this.handleDelayElapsed(), e);
  }
  /**
   * Queues the operation to run immediately (if it hasn't already been run or
   * canceled).
   */
  skipDelay() {
    return this.handleDelayElapsed();
  }
  /**
   * Cancels the operation if it hasn't already been executed or canceled. The
   * promise will be rejected.
   *
   * As long as the operation has not yet been run, calling cancel() provides a
   * guarantee that the operation will not be run.
   */
  cancel(e) {
    null !== this.timerHandle && (this.clearTimeout(), this.deferred.reject(new FirestoreError(D2.CANCELLED, "Operation cancelled" + (e ? ": " + e : ""))));
  }
  handleDelayElapsed() {
    this.asyncQueue.enqueueAndForget(() => null !== this.timerHandle ? (this.clearTimeout(), this.op().then((e) => this.deferred.resolve(e))) : Promise.resolve());
  }
  clearTimeout() {
    null !== this.timerHandle && (this.removalCallback(this), clearTimeout(this.timerHandle), this.timerHandle = null);
  }
};
function __PRIVATE_wrapInUserErrorIfRecoverable(e, t) {
  if (__PRIVATE_logError("AsyncQueue", `${t}: ${e}`), __PRIVATE_isIndexedDbTransactionError(e))
    return new FirestoreError(D2.UNAVAILABLE, `${t}: ${e}`);
  throw e;
}
var DocumentSet = class _DocumentSet {
  /** The default ordering is by key if the comparator is omitted */
  constructor(e) {
    this.comparator = e ? (t, n) => e(t, n) || DocumentKey.comparator(t.key, n.key) : (e2, t) => DocumentKey.comparator(e2.key, t.key), this.keyedMap = documentMap(), this.sortedSet = new SortedMap(this.comparator);
  }
  /**
   * Returns an empty copy of the existing DocumentSet, using the same
   * comparator.
   */
  static emptySet(e) {
    return new _DocumentSet(e.comparator);
  }
  has(e) {
    return null != this.keyedMap.get(e);
  }
  get(e) {
    return this.keyedMap.get(e);
  }
  first() {
    return this.sortedSet.minKey();
  }
  last() {
    return this.sortedSet.maxKey();
  }
  isEmpty() {
    return this.sortedSet.isEmpty();
  }
  /**
   * Returns the index of the provided key in the document set, or -1 if the
   * document key is not present in the set;
   */
  indexOf(e) {
    const t = this.keyedMap.get(e);
    return t ? this.sortedSet.indexOf(t) : -1;
  }
  get size() {
    return this.sortedSet.size;
  }
  /** Iterates documents in order defined by "comparator" */
  forEach(e) {
    this.sortedSet.inorderTraversal((t, n) => (e(t), false));
  }
  /** Inserts or updates a document with the same key */
  add(e) {
    const t = this.delete(e.key);
    return t.copy(t.keyedMap.insert(e.key, e), t.sortedSet.insert(e, null));
  }
  /** Deletes a document with a given key */
  delete(e) {
    const t = this.get(e);
    return t ? this.copy(this.keyedMap.remove(e), this.sortedSet.remove(t)) : this;
  }
  isEqual(e) {
    if (!(e instanceof _DocumentSet))
      return false;
    if (this.size !== e.size)
      return false;
    const t = this.sortedSet.getIterator(), n = e.sortedSet.getIterator();
    for (; t.hasNext(); ) {
      const e2 = t.getNext().key, r2 = n.getNext().key;
      if (!e2.isEqual(r2))
        return false;
    }
    return true;
  }
  toString() {
    const e = [];
    return this.forEach((t) => {
      e.push(t.toString());
    }), 0 === e.length ? "DocumentSet ()" : "DocumentSet (\n  " + e.join("  \n") + "\n)";
  }
  copy(e, t) {
    const n = new _DocumentSet();
    return n.comparator = this.comparator, n.keyedMap = e, n.sortedSet = t, n;
  }
};
var __PRIVATE_DocumentChangeSet = class {
  constructor() {
    this.B_ = new SortedMap(DocumentKey.comparator);
  }
  track(e) {
    const t = e.doc.key, n = this.B_.get(t);
    n ? (
      // Merge the new change with the existing change.
      0 !== e.type && 3 === n.type ? this.B_ = this.B_.insert(t, e) : 3 === e.type && 1 !== n.type ? this.B_ = this.B_.insert(t, {
        type: n.type,
        doc: e.doc
      }) : 2 === e.type && 2 === n.type ? this.B_ = this.B_.insert(t, {
        type: 2,
        doc: e.doc
      }) : 2 === e.type && 0 === n.type ? this.B_ = this.B_.insert(t, {
        type: 0,
        doc: e.doc
      }) : 1 === e.type && 0 === n.type ? this.B_ = this.B_.remove(t) : 1 === e.type && 2 === n.type ? this.B_ = this.B_.insert(t, {
        type: 1,
        doc: n.doc
      }) : 0 === e.type && 1 === n.type ? this.B_ = this.B_.insert(t, {
        type: 2,
        doc: e.doc
      }) : (
        // This includes these cases, which don't make sense:
        // Added->Added
        // Removed->Removed
        // Modified->Added
        // Removed->Modified
        // Metadata->Added
        // Removed->Metadata
        fail()
      )
    ) : this.B_ = this.B_.insert(t, e);
  }
  L_() {
    const e = [];
    return this.B_.inorderTraversal((t, n) => {
      e.push(n);
    }), e;
  }
};
var ViewSnapshot = class _ViewSnapshot {
  constructor(e, t, n, r2, i, s, o, _, a) {
    this.query = e, this.docs = t, this.oldDocs = n, this.docChanges = r2, this.mutatedKeys = i, this.fromCache = s, this.syncStateChanged = o, this.excludesMetadataChanges = _, this.hasCachedResults = a;
  }
  /** Returns a view snapshot as if all documents in the snapshot were added. */
  static fromInitialDocuments(e, t, n, r2, i) {
    const s = [];
    return t.forEach((e2) => {
      s.push({
        type: 0,
        doc: e2
      });
    }), new _ViewSnapshot(
      e,
      t,
      DocumentSet.emptySet(t),
      s,
      n,
      r2,
      /* syncStateChanged= */
      true,
      /* excludesMetadataChanges= */
      false,
      i
    );
  }
  get hasPendingWrites() {
    return !this.mutatedKeys.isEmpty();
  }
  isEqual(e) {
    if (!(this.fromCache === e.fromCache && this.hasCachedResults === e.hasCachedResults && this.syncStateChanged === e.syncStateChanged && this.mutatedKeys.isEqual(e.mutatedKeys) && __PRIVATE_queryEquals(this.query, e.query) && this.docs.isEqual(e.docs) && this.oldDocs.isEqual(e.oldDocs)))
      return false;
    const t = this.docChanges, n = e.docChanges;
    if (t.length !== n.length)
      return false;
    for (let e2 = 0; e2 < t.length; e2++)
      if (t[e2].type !== n[e2].type || !t[e2].doc.isEqual(n[e2].doc))
        return false;
    return true;
  }
};
var __PRIVATE_QueryListenersInfo = class {
  constructor() {
    this.k_ = void 0, this.listeners = [];
  }
};
var __PRIVATE_EventManagerImpl = class {
  constructor() {
    this.queries = new ObjectMap((e) => __PRIVATE_canonifyQuery(e), __PRIVATE_queryEquals), this.onlineState = "Unknown", this.q_ = /* @__PURE__ */ new Set();
  }
};
function __PRIVATE_eventManagerListen(e, t) {
  return __async(this, null, function* () {
    const n = __PRIVATE_debugCast(e), r2 = t.query;
    let i = false, s = n.queries.get(r2);
    if (s || (i = true, s = new __PRIVATE_QueryListenersInfo()), i)
      try {
        s.k_ = yield n.onListen(r2);
      } catch (e2) {
        const n2 = __PRIVATE_wrapInUserErrorIfRecoverable(e2, `Initialization of query '${__PRIVATE_stringifyQuery(t.query)}' failed`);
        return void t.onError(n2);
      }
    if (n.queries.set(r2, s), s.listeners.push(t), // Run global snapshot listeners if a consistent snapshot has been emitted.
    t.Q_(n.onlineState), s.k_) {
      t.K_(s.k_) && __PRIVATE_raiseSnapshotsInSyncEvent(n);
    }
  });
}
function __PRIVATE_eventManagerUnlisten(e, t) {
  return __async(this, null, function* () {
    const n = __PRIVATE_debugCast(e), r2 = t.query;
    let i = false;
    const s = n.queries.get(r2);
    if (s) {
      const e2 = s.listeners.indexOf(t);
      e2 >= 0 && (s.listeners.splice(e2, 1), i = 0 === s.listeners.length);
    }
    if (i)
      return n.queries.delete(r2), n.onUnlisten(r2);
  });
}
function __PRIVATE_eventManagerOnWatchChange(e, t) {
  const n = __PRIVATE_debugCast(e);
  let r2 = false;
  for (const e2 of t) {
    const t2 = e2.query, i = n.queries.get(t2);
    if (i) {
      for (const t3 of i.listeners)
        t3.K_(e2) && (r2 = true);
      i.k_ = e2;
    }
  }
  r2 && __PRIVATE_raiseSnapshotsInSyncEvent(n);
}
function __PRIVATE_eventManagerOnWatchError(e, t, n) {
  const r2 = __PRIVATE_debugCast(e), i = r2.queries.get(t);
  if (i)
    for (const e2 of i.listeners)
      e2.onError(n);
  r2.queries.delete(t);
}
function __PRIVATE_raiseSnapshotsInSyncEvent(e) {
  e.q_.forEach((e2) => {
    e2.next();
  });
}
var __PRIVATE_QueryListener = class {
  constructor(e, t, n) {
    this.query = e, this.U_ = t, /**
     * Initial snapshots (e.g. from cache) may not be propagated to the wrapped
     * observer. This flag is set to true once we've actually raised an event.
     */
    this.W_ = false, this.G_ = null, this.onlineState = "Unknown", this.options = n || {};
  }
  /**
   * Applies the new ViewSnapshot to this listener, raising a user-facing event
   * if applicable (depending on what changed, whether the user has opted into
   * metadata-only changes, etc.). Returns true if a user-facing event was
   * indeed raised.
   */
  K_(e) {
    if (!this.options.includeMetadataChanges) {
      const t2 = [];
      for (const n of e.docChanges)
        3 !== n.type && t2.push(n);
      e = new ViewSnapshot(
        e.query,
        e.docs,
        e.oldDocs,
        t2,
        e.mutatedKeys,
        e.fromCache,
        e.syncStateChanged,
        /* excludesMetadataChanges= */
        true,
        e.hasCachedResults
      );
    }
    let t = false;
    return this.W_ ? this.z_(e) && (this.U_.next(e), t = true) : this.j_(e, this.onlineState) && (this.H_(e), t = true), this.G_ = e, t;
  }
  onError(e) {
    this.U_.error(e);
  }
  /** Returns whether a snapshot was raised. */
  Q_(e) {
    this.onlineState = e;
    let t = false;
    return this.G_ && !this.W_ && this.j_(this.G_, e) && (this.H_(this.G_), t = true), t;
  }
  j_(e, t) {
    if (!e.fromCache)
      return true;
    const n = "Offline" !== t;
    return (!this.options.J_ || !n) && (!e.docs.isEmpty() || e.hasCachedResults || "Offline" === t);
  }
  z_(e) {
    if (e.docChanges.length > 0)
      return true;
    const t = this.G_ && this.G_.hasPendingWrites !== e.hasPendingWrites;
    return !(!e.syncStateChanged && !t) && true === this.options.includeMetadataChanges;
  }
  H_(e) {
    e = ViewSnapshot.fromInitialDocuments(e.query, e.docs, e.mutatedKeys, e.fromCache, e.hasCachedResults), this.W_ = true, this.U_.next(e);
  }
};
var __PRIVATE_SizedBundleElement = class {
  constructor(e, t) {
    this.Y_ = e, this.byteLength = t;
  }
  Z_() {
    return "metadata" in this.Y_;
  }
};
var __PRIVATE_BundleConverterImpl = class {
  constructor(e) {
    this.serializer = e;
  }
  hs(e) {
    return fromName(this.serializer, e);
  }
  /**
   * Converts a BundleDocument to a MutableDocument.
   */
  Ps(e) {
    return e.metadata.exists ? __PRIVATE_fromDocument(this.serializer, e.document, false) : MutableDocument.newNoDocument(this.hs(e.metadata.name), this.Is(e.metadata.readTime));
  }
  Is(e) {
    return __PRIVATE_fromVersion(e);
  }
};
var __PRIVATE_BundleLoader = class {
  constructor(e, t, n) {
    this.X_ = e, this.localStore = t, this.serializer = n, /** Batched queries to be saved into storage */
    this.queries = [], /** Batched documents to be saved into storage */
    this.documents = [], /** The collection groups affected by this bundle. */
    this.collectionGroups = /* @__PURE__ */ new Set(), this.progress = __PRIVATE_bundleInitialProgress(e);
  }
  /**
   * Adds an element from the bundle to the loader.
   *
   * Returns a new progress if adding the element leads to a new progress,
   * otherwise returns null.
   */
  ea(e) {
    this.progress.bytesLoaded += e.byteLength;
    let t = this.progress.documentsLoaded;
    if (e.Y_.namedQuery)
      this.queries.push(e.Y_.namedQuery);
    else if (e.Y_.documentMetadata) {
      this.documents.push({
        metadata: e.Y_.documentMetadata
      }), e.Y_.documentMetadata.exists || ++t;
      const n = ResourcePath.fromString(e.Y_.documentMetadata.name);
      this.collectionGroups.add(n.get(n.length - 2));
    } else
      e.Y_.document && (this.documents[this.documents.length - 1].document = e.Y_.document, ++t);
    return t !== this.progress.documentsLoaded ? (this.progress.documentsLoaded = t, Object.assign({}, this.progress)) : null;
  }
  ta(e) {
    const t = /* @__PURE__ */ new Map(), n = new __PRIVATE_BundleConverterImpl(this.serializer);
    for (const r2 of e)
      if (r2.metadata.queries) {
        const e2 = n.hs(r2.metadata.name);
        for (const n2 of r2.metadata.queries) {
          const r3 = (t.get(n2) || __PRIVATE_documentKeySet()).add(e2);
          t.set(n2, r3);
        }
      }
    return t;
  }
  /**
   * Update the progress to 'Success' and return the updated progress.
   */
  complete() {
    return __async(this, null, function* () {
      const e = yield __PRIVATE_localStoreApplyBundledDocuments(this.localStore, new __PRIVATE_BundleConverterImpl(this.serializer), this.documents, this.X_.id), t = this.ta(this.documents);
      for (const e2 of this.queries)
        yield __PRIVATE_localStoreSaveNamedQuery(this.localStore, e2, t.get(e2.name));
      return this.progress.taskState = "Success", {
        progress: this.progress,
        na: this.collectionGroups,
        ra: e
      };
    });
  }
};
function __PRIVATE_bundleInitialProgress(e) {
  return {
    taskState: "Running",
    documentsLoaded: 0,
    bytesLoaded: 0,
    totalDocuments: e.totalDocuments,
    totalBytes: e.totalBytes
  };
}
var __PRIVATE_AddedLimboDocument = class {
  constructor(e) {
    this.key = e;
  }
};
var __PRIVATE_RemovedLimboDocument = class {
  constructor(e) {
    this.key = e;
  }
};
var __PRIVATE_View = class {
  constructor(e, t) {
    this.query = e, this.ia = t, this.sa = null, this.hasCachedResults = false, /**
     * A flag whether the view is current with the backend. A view is considered
     * current after it has seen the current flag from the backend and did not
     * lose consistency within the watch stream (e.g. because of an existence
     * filter mismatch).
     */
    this.current = false, /** Documents in the view but not in the remote target */
    this.oa = __PRIVATE_documentKeySet(), /** Document Keys that have local changes */
    this.mutatedKeys = __PRIVATE_documentKeySet(), this._a = __PRIVATE_newQueryComparator(e), this.aa = new DocumentSet(this._a);
  }
  /**
   * The set of remote documents that the server has told us belongs to the target associated with
   * this view.
   */
  get ua() {
    return this.ia;
  }
  /**
   * Iterates over a set of doc changes, applies the query limit, and computes
   * what the new results should be, what the changes were, and whether we may
   * need to go back to the local cache for more results. Does not make any
   * changes to the view.
   * @param docChanges - The doc changes to apply to this view.
   * @param previousChanges - If this is being called with a refill, then start
   *        with this set of docs and changes instead of the current view.
   * @returns a new set of docs, changes, and refill flag.
   */
  ca(e, t) {
    const n = t ? t.la : new __PRIVATE_DocumentChangeSet(), r2 = t ? t.aa : this.aa;
    let i = t ? t.mutatedKeys : this.mutatedKeys, s = r2, o = false;
    const _ = "F" === this.query.limitType && r2.size === this.query.limit ? r2.last() : null, a = "L" === this.query.limitType && r2.size === this.query.limit ? r2.first() : null;
    if (e.inorderTraversal((e2, t2) => {
      const u = r2.get(e2), c = __PRIVATE_queryMatches(this.query, t2) ? t2 : null, l2 = !!u && this.mutatedKeys.has(u.key), h = !!c && (c.hasLocalMutations || // We only consider committed mutations for documents that were
      // mutated during the lifetime of the view.
      this.mutatedKeys.has(c.key) && c.hasCommittedMutations);
      let P2 = false;
      if (u && c) {
        u.data.isEqual(c.data) ? l2 !== h && (n.track({
          type: 3,
          doc: c
        }), P2 = true) : this.ha(u, c) || (n.track({
          type: 2,
          doc: c
        }), P2 = true, (_ && this._a(c, _) > 0 || a && this._a(c, a) < 0) && // This doc moved from inside the limit to outside the limit.
        // That means there may be some other doc in the local cache
        // that should be included instead.
        (o = true));
      } else
        !u && c ? (n.track({
          type: 0,
          doc: c
        }), P2 = true) : u && !c && (n.track({
          type: 1,
          doc: u
        }), P2 = true, (_ || a) && // A doc was removed from a full limit query. We'll need to
        // requery from the local cache to see if we know about some other
        // doc that should be in the results.
        (o = true));
      P2 && (c ? (s = s.add(c), i = h ? i.add(e2) : i.delete(e2)) : (s = s.delete(e2), i = i.delete(e2)));
    }), null !== this.query.limit)
      for (; s.size > this.query.limit; ) {
        const e2 = "F" === this.query.limitType ? s.last() : s.first();
        s = s.delete(e2.key), i = i.delete(e2.key), n.track({
          type: 1,
          doc: e2
        });
      }
    return {
      aa: s,
      la: n,
      Zi: o,
      mutatedKeys: i
    };
  }
  ha(e, t) {
    return e.hasLocalMutations && t.hasCommittedMutations && !t.hasLocalMutations;
  }
  /**
   * Updates the view with the given ViewDocumentChanges and optionally updates
   * limbo docs and sync state from the provided target change.
   * @param docChanges - The set of changes to make to the view's docs.
   * @param limboResolutionEnabled - Whether to update limbo documents based on
   *        this change.
   * @param targetChange - A target change to apply for computing limbo docs and
   *        sync state.
   * @param targetIsPendingReset - Whether the target is pending to reset due to
   *        existence filter mismatch. If not explicitly specified, it is treated
   *        equivalently to `false`.
   * @returns A new ViewChange with the given docs, changes, and sync state.
   */
  // PORTING NOTE: The iOS/Android clients always compute limbo document changes.
  applyChanges(e, t, n, r2) {
    const i = this.aa;
    this.aa = e.aa, this.mutatedKeys = e.mutatedKeys;
    const s = e.la.L_();
    s.sort((e2, t2) => function __PRIVATE_compareChangeType(e3, t3) {
      const order = (e4) => {
        switch (e4) {
          case 0:
            return 1;
          case 2:
          case 3:
            return 2;
          case 1:
            return 0;
          default:
            return fail();
        }
      };
      return order(e3) - order(t3);
    }(e2.type, t2.type) || this._a(e2.doc, t2.doc)), this.Pa(n), r2 = null != r2 && r2;
    const o = t && !r2 ? this.Ia() : [], _ = 0 === this.oa.size && this.current && !r2 ? 1 : 0, a = _ !== this.sa;
    if (this.sa = _, 0 !== s.length || a) {
      return {
        snapshot: new ViewSnapshot(
          this.query,
          e.aa,
          i,
          s,
          e.mutatedKeys,
          0 === _,
          a,
          /* excludesMetadataChanges= */
          false,
          !!n && n.resumeToken.approximateByteSize() > 0
        ),
        Ta: o
      };
    }
    return {
      Ta: o
    };
  }
  /**
   * Applies an OnlineState change to the view, potentially generating a
   * ViewChange if the view's syncState changes as a result.
   */
  Q_(e) {
    return this.current && "Offline" === e ? (
      // If we're offline, set `current` to false and then call applyChanges()
      // to refresh our syncState and generate a ViewChange as appropriate. We
      // are guaranteed to get a new TargetChange that sets `current` back to
      // true once the client is back online.
      (this.current = false, this.applyChanges(
        {
          aa: this.aa,
          la: new __PRIVATE_DocumentChangeSet(),
          mutatedKeys: this.mutatedKeys,
          Zi: false
        },
        /* limboResolutionEnabled= */
        false
      ))
    ) : {
      Ta: []
    };
  }
  /**
   * Returns whether the doc for the given key should be in limbo.
   */
  Ea(e) {
    return !this.ia.has(e) && // The local store doesn't think it's a result, so it shouldn't be in limbo.
    (!!this.aa.has(e) && !this.aa.get(e).hasLocalMutations);
  }
  /**
   * Updates syncedDocuments, current, and limbo docs based on the given change.
   * Returns the list of changes to which docs are in limbo.
   */
  Pa(e) {
    e && (e.addedDocuments.forEach((e2) => this.ia = this.ia.add(e2)), e.modifiedDocuments.forEach((e2) => {
    }), e.removedDocuments.forEach((e2) => this.ia = this.ia.delete(e2)), this.current = e.current);
  }
  Ia() {
    if (!this.current)
      return [];
    const e = this.oa;
    this.oa = __PRIVATE_documentKeySet(), this.aa.forEach((e2) => {
      this.Ea(e2.key) && (this.oa = this.oa.add(e2.key));
    });
    const t = [];
    return e.forEach((e2) => {
      this.oa.has(e2) || t.push(new __PRIVATE_RemovedLimboDocument(e2));
    }), this.oa.forEach((n) => {
      e.has(n) || t.push(new __PRIVATE_AddedLimboDocument(n));
    }), t;
  }
  /**
   * Update the in-memory state of the current view with the state read from
   * persistence.
   *
   * We update the query view whenever a client's primary status changes:
   * - When a client transitions from primary to secondary, it can miss
   *   LocalStorage updates and its query views may temporarily not be
   *   synchronized with the state on disk.
   * - For secondary to primary transitions, the client needs to update the list
   *   of `syncedDocuments` since secondary clients update their query views
   *   based purely on synthesized RemoteEvents.
   *
   * @param queryResult.documents - The documents that match the query according
   * to the LocalStore.
   * @param queryResult.remoteKeys - The keys of the documents that match the
   * query according to the backend.
   *
   * @returns The ViewChange that resulted from this synchronization.
   */
  // PORTING NOTE: Multi-tab only.
  da(e) {
    this.ia = e.ls, this.oa = __PRIVATE_documentKeySet();
    const t = this.ca(e.documents);
    return this.applyChanges(
      t,
      /* limboResolutionEnabled= */
      true
    );
  }
  /**
   * Returns a view snapshot as if this query was just listened to. Contains
   * a document add for every existing document and the `fromCache` and
   * `hasPendingWrites` status of the already established view.
   */
  // PORTING NOTE: Multi-tab only.
  Aa() {
    return ViewSnapshot.fromInitialDocuments(this.query, this.aa, this.mutatedKeys, 0 === this.sa, this.hasCachedResults);
  }
};
var __PRIVATE_QueryView = class {
  constructor(e, t, n) {
    this.query = e, this.targetId = t, this.view = n;
  }
};
var LimboResolution = class {
  constructor(e) {
    this.key = e, /**
     * Set to true once we've received a document. This is used in
     * getRemoteKeysForTarget() and ultimately used by WatchChangeAggregator to
     * decide whether it needs to manufacture a delete event for the target once
     * the target is CURRENT.
     */
    this.Ra = false;
  }
};
var __PRIVATE_SyncEngineImpl = class {
  constructor(e, t, n, r2, i, s) {
    this.localStore = e, this.remoteStore = t, this.eventManager = n, this.sharedClientState = r2, this.currentUser = i, this.maxConcurrentLimboResolutions = s, this.Va = {}, this.ma = new ObjectMap((e2) => __PRIVATE_canonifyQuery(e2), __PRIVATE_queryEquals), this.fa = /* @__PURE__ */ new Map(), /**
     * The keys of documents that are in limbo for which we haven't yet started a
     * limbo resolution query. The strings in this set are the result of calling
     * `key.path.canonicalString()` where `key` is a `DocumentKey` object.
     *
     * The `Set` type was chosen because it provides efficient lookup and removal
     * of arbitrary elements and it also maintains insertion order, providing the
     * desired queue-like FIFO semantics.
     */
    this.ga = /* @__PURE__ */ new Set(), /**
     * Keeps track of the target ID for each document that is in limbo with an
     * active target.
     */
    this.pa = new SortedMap(DocumentKey.comparator), /**
     * Keeps track of the information about an active limbo resolution for each
     * active target ID that was started for the purpose of limbo resolution.
     */
    this.ya = /* @__PURE__ */ new Map(), this.wa = new __PRIVATE_ReferenceSet(), /** Stores user completion handlers, indexed by User and BatchId. */
    this.Sa = {}, /** Stores user callbacks waiting for all pending writes to be acknowledged. */
    this.ba = /* @__PURE__ */ new Map(), this.Da = __PRIVATE_TargetIdGenerator.Nn(), this.onlineState = "Unknown", // The primary state is set to `true` or `false` immediately after Firestore
    // startup. In the interim, a client should only be considered primary if
    // `isPrimary` is true.
    this.Ca = void 0;
  }
  get isPrimaryClient() {
    return true === this.Ca;
  }
};
function __PRIVATE_syncEngineListen(e, t) {
  return __async(this, null, function* () {
    const n = __PRIVATE_ensureWatchCallbacks(e);
    let r2, i;
    const s = n.ma.get(t);
    if (s)
      r2 = s.targetId, n.sharedClientState.addLocalQueryTarget(r2), i = s.view.Aa();
    else {
      const e2 = yield __PRIVATE_localStoreAllocateTarget(n.localStore, __PRIVATE_queryToTarget(t)), s2 = n.sharedClientState.addLocalQueryTarget(e2.targetId);
      r2 = e2.targetId, i = yield __PRIVATE_initializeViewAndComputeSnapshot(n, t, r2, "current" === s2, e2.resumeToken), n.isPrimaryClient && __PRIVATE_remoteStoreListen(n.remoteStore, e2);
    }
    return i;
  });
}
function __PRIVATE_initializeViewAndComputeSnapshot(e, t, n, r2, i) {
  return __async(this, null, function* () {
    e.va = (t2, n2, r3) => function __PRIVATE_applyDocChanges(e2, t3, n3, r4) {
      return __async(this, null, function* () {
        let i2 = t3.view.ca(n3);
        i2.Zi && // The query has a limit and some docs were removed, so we need
        // to re-run the query against the local store to make sure we
        // didn't lose any good docs that had been past the limit.
        (i2 = yield __PRIVATE_localStoreExecuteQuery(
          e2.localStore,
          t3.query,
          /* usePreviousResults= */
          false
        ).then(({ documents: e3 }) => t3.view.ca(e3, i2)));
        const s2 = r4 && r4.targetChanges.get(t3.targetId), o2 = r4 && null != r4.targetMismatches.get(t3.targetId), _2 = t3.view.applyChanges(
          i2,
          /* limboResolutionEnabled= */
          e2.isPrimaryClient,
          s2,
          o2
        );
        return __PRIVATE_updateTrackedLimbos(e2, t3.targetId, _2.Ta), _2.snapshot;
      });
    }(e, t2, n2, r3);
    const s = yield __PRIVATE_localStoreExecuteQuery(
      e.localStore,
      t,
      /* usePreviousResults= */
      true
    ), o = new __PRIVATE_View(t, s.ls), _ = o.ca(s.documents), a = TargetChange.createSynthesizedTargetChangeForCurrentChange(n, r2 && "Offline" !== e.onlineState, i), u = o.applyChanges(
      _,
      /* limboResolutionEnabled= */
      e.isPrimaryClient,
      a
    );
    __PRIVATE_updateTrackedLimbos(e, n, u.Ta);
    const c = new __PRIVATE_QueryView(t, n, o);
    return e.ma.set(t, c), e.fa.has(n) ? e.fa.get(n).push(t) : e.fa.set(n, [t]), u.snapshot;
  });
}
function __PRIVATE_syncEngineUnlisten(e, t) {
  return __async(this, null, function* () {
    const n = __PRIVATE_debugCast(e), r2 = n.ma.get(t), i = n.fa.get(r2.targetId);
    if (i.length > 1)
      return n.fa.set(r2.targetId, i.filter((e2) => !__PRIVATE_queryEquals(e2, t))), void n.ma.delete(t);
    if (n.isPrimaryClient) {
      n.sharedClientState.removeLocalQueryTarget(r2.targetId);
      n.sharedClientState.isActiveQueryTarget(r2.targetId) || (yield __PRIVATE_localStoreReleaseTarget(
        n.localStore,
        r2.targetId,
        /*keepPersistedTargetData=*/
        false
      ).then(() => {
        n.sharedClientState.clearQueryState(r2.targetId), __PRIVATE_remoteStoreUnlisten(n.remoteStore, r2.targetId), __PRIVATE_removeAndCleanupTarget(n, r2.targetId);
      }).catch(__PRIVATE_ignoreIfPrimaryLeaseLoss));
    } else
      __PRIVATE_removeAndCleanupTarget(n, r2.targetId), yield __PRIVATE_localStoreReleaseTarget(
        n.localStore,
        r2.targetId,
        /*keepPersistedTargetData=*/
        true
      );
  });
}
function __PRIVATE_syncEngineWrite(e, t, n) {
  return __async(this, null, function* () {
    const r2 = __PRIVATE_syncEngineEnsureWriteCallbacks(e);
    try {
      const e2 = yield function __PRIVATE_localStoreWriteLocally(e3, t2) {
        const n2 = __PRIVATE_debugCast(e3), r3 = Timestamp.now(), i = t2.reduce((e4, t3) => e4.add(t3.key), __PRIVATE_documentKeySet());
        let s, o;
        return n2.persistence.runTransaction("Locally write mutations", "readwrite", (e4) => {
          let _ = __PRIVATE_mutableDocumentMap(), a = __PRIVATE_documentKeySet();
          return n2.ss.getEntries(e4, i).next((e5) => {
            _ = e5, _.forEach((e6, t3) => {
              t3.isValidDocument() || (a = a.add(e6));
            });
          }).next(() => n2.localDocuments.getOverlayedDocuments(e4, _)).next((i2) => {
            s = i2;
            const o2 = [];
            for (const e5 of t2) {
              const t3 = __PRIVATE_mutationExtractBaseValue(e5, s.get(e5.key).overlayedDocument);
              null != t3 && // NOTE: The base state should only be applied if there's some
              // existing document to override, so use a Precondition of
              // exists=true
              o2.push(new __PRIVATE_PatchMutation(e5.key, t3, __PRIVATE_extractFieldMask(t3.value.mapValue), Precondition.exists(true)));
            }
            return n2.mutationQueue.addMutationBatch(e4, r3, o2, t2);
          }).next((t3) => {
            o = t3;
            const r4 = t3.applyToLocalDocumentSet(s, a);
            return n2.documentOverlayCache.saveOverlays(e4, t3.batchId, r4);
          });
        }).then(() => ({
          batchId: o.batchId,
          changes: __PRIVATE_convertOverlayedDocumentMapToDocumentMap(s)
        }));
      }(r2.localStore, t);
      r2.sharedClientState.addPendingMutation(e2.batchId), function __PRIVATE_addMutationCallback(e3, t2, n2) {
        let r3 = e3.Sa[e3.currentUser.toKey()];
        r3 || (r3 = new SortedMap(__PRIVATE_primitiveComparator));
        r3 = r3.insert(t2, n2), e3.Sa[e3.currentUser.toKey()] = r3;
      }(r2, e2.batchId, n), yield __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(r2, e2.changes), yield __PRIVATE_fillWritePipeline(r2.remoteStore);
    } catch (e2) {
      const t2 = __PRIVATE_wrapInUserErrorIfRecoverable(e2, "Failed to persist write");
      n.reject(t2);
    }
  });
}
function __PRIVATE_syncEngineApplyRemoteEvent(e, t) {
  return __async(this, null, function* () {
    const n = __PRIVATE_debugCast(e);
    try {
      const e2 = yield __PRIVATE_localStoreApplyRemoteEventToLocalCache(n.localStore, t);
      t.targetChanges.forEach((e3, t2) => {
        const r2 = n.ya.get(t2);
        r2 && // Since this is a limbo resolution lookup, it's for a single document
        // and it could be added, modified, or removed, but not a combination.
        (__PRIVATE_hardAssert(e3.addedDocuments.size + e3.modifiedDocuments.size + e3.removedDocuments.size <= 1), e3.addedDocuments.size > 0 ? r2.Ra = true : e3.modifiedDocuments.size > 0 ? __PRIVATE_hardAssert(r2.Ra) : e3.removedDocuments.size > 0 && (__PRIVATE_hardAssert(r2.Ra), r2.Ra = false));
      }), yield __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e2, t);
    } catch (e2) {
      yield __PRIVATE_ignoreIfPrimaryLeaseLoss(e2);
    }
  });
}
function __PRIVATE_syncEngineApplyOnlineStateChange(e, t, n) {
  const r2 = __PRIVATE_debugCast(e);
  if (r2.isPrimaryClient && 0 === n || !r2.isPrimaryClient && 1 === n) {
    const e2 = [];
    r2.ma.forEach((n2, r3) => {
      const i = r3.view.Q_(t);
      i.snapshot && e2.push(i.snapshot);
    }), function __PRIVATE_eventManagerOnOnlineStateChange(e3, t2) {
      const n2 = __PRIVATE_debugCast(e3);
      n2.onlineState = t2;
      let r3 = false;
      n2.queries.forEach((e4, n3) => {
        for (const e5 of n3.listeners)
          e5.Q_(t2) && (r3 = true);
      }), r3 && __PRIVATE_raiseSnapshotsInSyncEvent(n2);
    }(r2.eventManager, t), e2.length && r2.Va.a_(e2), r2.onlineState = t, r2.isPrimaryClient && r2.sharedClientState.setOnlineState(t);
  }
}
function __PRIVATE_syncEngineRejectListen(e, t, n) {
  return __async(this, null, function* () {
    const r2 = __PRIVATE_debugCast(e);
    r2.sharedClientState.updateQueryState(t, "rejected", n);
    const i = r2.ya.get(t), s = i && i.key;
    if (s) {
      let e2 = new SortedMap(DocumentKey.comparator);
      e2 = e2.insert(s, MutableDocument.newNoDocument(s, SnapshotVersion.min()));
      const n2 = __PRIVATE_documentKeySet().add(s), i2 = new RemoteEvent(
        SnapshotVersion.min(),
        /* targetChanges= */
        /* @__PURE__ */ new Map(),
        /* targetMismatches= */
        new SortedMap(__PRIVATE_primitiveComparator),
        e2,
        n2
      );
      yield __PRIVATE_syncEngineApplyRemoteEvent(r2, i2), // Since this query failed, we won't want to manually unlisten to it.
      // We only remove it from bookkeeping after we successfully applied the
      // RemoteEvent. If `applyRemoteEvent()` throws, we want to re-listen to
      // this query when the RemoteStore restarts the Watch stream, which should
      // re-trigger the target failure.
      r2.pa = r2.pa.remove(s), r2.ya.delete(t), __PRIVATE_pumpEnqueuedLimboResolutions(r2);
    } else
      yield __PRIVATE_localStoreReleaseTarget(
        r2.localStore,
        t,
        /* keepPersistedTargetData */
        false
      ).then(() => __PRIVATE_removeAndCleanupTarget(r2, t, n)).catch(__PRIVATE_ignoreIfPrimaryLeaseLoss);
  });
}
function __PRIVATE_syncEngineApplySuccessfulWrite(e, t) {
  return __async(this, null, function* () {
    const n = __PRIVATE_debugCast(e), r2 = t.batch.batchId;
    try {
      const e2 = yield __PRIVATE_localStoreAcknowledgeBatch(n.localStore, t);
      __PRIVATE_processUserCallback(
        n,
        r2,
        /*error=*/
        null
      ), __PRIVATE_triggerPendingWritesCallbacks(n, r2), n.sharedClientState.updateMutationState(r2, "acknowledged"), yield __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e2);
    } catch (e2) {
      yield __PRIVATE_ignoreIfPrimaryLeaseLoss(e2);
    }
  });
}
function __PRIVATE_syncEngineRejectFailedWrite(e, t, n) {
  return __async(this, null, function* () {
    const r2 = __PRIVATE_debugCast(e);
    try {
      const e2 = yield function __PRIVATE_localStoreRejectBatch(e3, t2) {
        const n2 = __PRIVATE_debugCast(e3);
        return n2.persistence.runTransaction("Reject batch", "readwrite-primary", (e4) => {
          let r3;
          return n2.mutationQueue.lookupMutationBatch(e4, t2).next((t3) => (__PRIVATE_hardAssert(null !== t3), r3 = t3.keys(), n2.mutationQueue.removeMutationBatch(e4, t3))).next(() => n2.mutationQueue.performConsistencyCheck(e4)).next(() => n2.documentOverlayCache.removeOverlaysForBatchId(e4, r3, t2)).next(() => n2.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e4, r3)).next(() => n2.localDocuments.getDocuments(e4, r3));
        });
      }(r2.localStore, t);
      __PRIVATE_processUserCallback(r2, t, n), __PRIVATE_triggerPendingWritesCallbacks(r2, t), r2.sharedClientState.updateMutationState(t, "rejected", n), yield __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(r2, e2);
    } catch (n2) {
      yield __PRIVATE_ignoreIfPrimaryLeaseLoss(n2);
    }
  });
}
function __PRIVATE_syncEngineRegisterPendingWritesCallback(e, t) {
  return __async(this, null, function* () {
    const n = __PRIVATE_debugCast(e);
    __PRIVATE_canUseNetwork(n.remoteStore) || __PRIVATE_logDebug("SyncEngine", "The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");
    try {
      const e2 = yield function __PRIVATE_localStoreGetHighestUnacknowledgedBatchId(e3) {
        const t2 = __PRIVATE_debugCast(e3);
        return t2.persistence.runTransaction("Get highest unacknowledged batch id", "readonly", (e4) => t2.mutationQueue.getHighestUnacknowledgedBatchId(e4));
      }(n.localStore);
      if (-1 === e2)
        return void t.resolve();
      const r2 = n.ba.get(e2) || [];
      r2.push(t), n.ba.set(e2, r2);
    } catch (e2) {
      const n2 = __PRIVATE_wrapInUserErrorIfRecoverable(e2, "Initialization of waitForPendingWrites() operation failed");
      t.reject(n2);
    }
  });
}
function __PRIVATE_triggerPendingWritesCallbacks(e, t) {
  (e.ba.get(t) || []).forEach((e2) => {
    e2.resolve();
  }), e.ba.delete(t);
}
function __PRIVATE_processUserCallback(e, t, n) {
  const r2 = __PRIVATE_debugCast(e);
  let i = r2.Sa[r2.currentUser.toKey()];
  if (i) {
    const e2 = i.get(t);
    e2 && (n ? e2.reject(n) : e2.resolve(), i = i.remove(t)), r2.Sa[r2.currentUser.toKey()] = i;
  }
}
function __PRIVATE_removeAndCleanupTarget(e, t, n = null) {
  e.sharedClientState.removeLocalQueryTarget(t);
  for (const r2 of e.fa.get(t))
    e.ma.delete(r2), n && e.Va.Fa(r2, n);
  if (e.fa.delete(t), e.isPrimaryClient) {
    e.wa.Rr(t).forEach((t2) => {
      e.wa.containsKey(t2) || // We removed the last reference for this key
      __PRIVATE_removeLimboTarget(e, t2);
    });
  }
}
function __PRIVATE_removeLimboTarget(e, t) {
  e.ga.delete(t.path.canonicalString());
  const n = e.pa.get(t);
  null !== n && (__PRIVATE_remoteStoreUnlisten(e.remoteStore, n), e.pa = e.pa.remove(t), e.ya.delete(n), __PRIVATE_pumpEnqueuedLimboResolutions(e));
}
function __PRIVATE_updateTrackedLimbos(e, t, n) {
  for (const r2 of n)
    if (r2 instanceof __PRIVATE_AddedLimboDocument)
      e.wa.addReference(r2.key, t), __PRIVATE_trackLimboChange(e, r2);
    else if (r2 instanceof __PRIVATE_RemovedLimboDocument) {
      __PRIVATE_logDebug("SyncEngine", "Document no longer in limbo: " + r2.key), e.wa.removeReference(r2.key, t);
      e.wa.containsKey(r2.key) || // We removed the last reference for this key
      __PRIVATE_removeLimboTarget(e, r2.key);
    } else
      fail();
}
function __PRIVATE_trackLimboChange(e, t) {
  const n = t.key, r2 = n.path.canonicalString();
  e.pa.get(n) || e.ga.has(r2) || (__PRIVATE_logDebug("SyncEngine", "New document in limbo: " + n), e.ga.add(r2), __PRIVATE_pumpEnqueuedLimboResolutions(e));
}
function __PRIVATE_pumpEnqueuedLimboResolutions(e) {
  for (; e.ga.size > 0 && e.pa.size < e.maxConcurrentLimboResolutions; ) {
    const t = e.ga.values().next().value;
    e.ga.delete(t);
    const n = new DocumentKey(ResourcePath.fromString(t)), r2 = e.Da.next();
    e.ya.set(r2, new LimboResolution(n)), e.pa = e.pa.insert(n, r2), __PRIVATE_remoteStoreListen(e.remoteStore, new TargetData(__PRIVATE_queryToTarget(__PRIVATE_newQueryForPath(n.path)), r2, "TargetPurposeLimboResolution", __PRIVATE_ListenSequence._e));
  }
}
function __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(e, t, n) {
  return __async(this, null, function* () {
    const r2 = __PRIVATE_debugCast(e), i = [], s = [], o = [];
    r2.ma.isEmpty() || (r2.ma.forEach((e2, _) => {
      o.push(r2.va(_, t, n).then((e3) => {
        if (
          // If there are changes, or we are handling a global snapshot, notify
          // secondary clients to update query state.
          (e3 || n) && r2.isPrimaryClient && r2.sharedClientState.updateQueryState(_.targetId, (null == e3 ? void 0 : e3.fromCache) ? "not-current" : "current"), e3
        ) {
          i.push(e3);
          const t2 = __PRIVATE_LocalViewChanges.Qi(_.targetId, e3);
          s.push(t2);
        }
      }));
    }), yield Promise.all(o), r2.Va.a_(i), yield function __PRIVATE_localStoreNotifyLocalViewChanges(e2, t2) {
      return __async(this, null, function* () {
        const n2 = __PRIVATE_debugCast(e2);
        try {
          yield n2.persistence.runTransaction("notifyLocalViewChanges", "readwrite", (e3) => PersistencePromise.forEach(t2, (t3) => PersistencePromise.forEach(t3.ki, (r3) => n2.persistence.referenceDelegate.addReference(e3, t3.targetId, r3)).next(() => PersistencePromise.forEach(t3.qi, (r3) => n2.persistence.referenceDelegate.removeReference(e3, t3.targetId, r3)))));
        } catch (e3) {
          if (!__PRIVATE_isIndexedDbTransactionError(e3))
            throw e3;
          __PRIVATE_logDebug("LocalStore", "Failed to update sequence numbers: " + e3);
        }
        for (const e3 of t2) {
          const t3 = e3.targetId;
          if (!e3.fromCache) {
            const e4 = n2.ts.get(t3), r3 = e4.snapshotVersion, i2 = e4.withLastLimboFreeSnapshotVersion(r3);
            n2.ts = n2.ts.insert(t3, i2);
          }
        }
      });
    }(r2.localStore, s));
  });
}
function __PRIVATE_syncEngineHandleCredentialChange(e, t) {
  return __async(this, null, function* () {
    const n = __PRIVATE_debugCast(e);
    if (!n.currentUser.isEqual(t)) {
      __PRIVATE_logDebug("SyncEngine", "User change. New user:", t.toKey());
      const e2 = yield __PRIVATE_localStoreHandleUserChange(n.localStore, t);
      n.currentUser = t, // Fails tasks waiting for pending writes requested by previous user.
      function __PRIVATE_rejectOutstandingPendingWritesCallbacks(e3, t2) {
        e3.ba.forEach((e4) => {
          e4.forEach((e5) => {
            e5.reject(new FirestoreError(D2.CANCELLED, t2));
          });
        }), e3.ba.clear();
      }(n, "'waitForPendingWrites' promise is rejected due to a user change."), // TODO(b/114226417): Consider calling this only in the primary tab.
      n.sharedClientState.handleUserChange(t, e2.removedBatchIds, e2.addedBatchIds), yield __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e2._s);
    }
  });
}
function __PRIVATE_syncEngineGetRemoteKeysForTarget(e, t) {
  const n = __PRIVATE_debugCast(e), r2 = n.ya.get(t);
  if (r2 && r2.Ra)
    return __PRIVATE_documentKeySet().add(r2.key);
  {
    let e2 = __PRIVATE_documentKeySet();
    const r3 = n.fa.get(t);
    if (!r3)
      return e2;
    for (const t2 of r3) {
      const r4 = n.ma.get(t2);
      e2 = e2.unionWith(r4.view.ua);
    }
    return e2;
  }
}
function __PRIVATE_synchronizeViewAndComputeSnapshot(e, t) {
  return __async(this, null, function* () {
    const n = __PRIVATE_debugCast(e), r2 = yield __PRIVATE_localStoreExecuteQuery(
      n.localStore,
      t.query,
      /* usePreviousResults= */
      true
    ), i = t.view.da(r2);
    return n.isPrimaryClient && __PRIVATE_updateTrackedLimbos(n, t.targetId, i.Ta), i;
  });
}
function __PRIVATE_syncEngineSynchronizeWithChangedDocuments(e, t) {
  return __async(this, null, function* () {
    const n = __PRIVATE_debugCast(e);
    return __PRIVATE_localStoreGetNewDocumentChanges(n.localStore, t).then((e2) => __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(n, e2));
  });
}
function __PRIVATE_syncEngineApplyBatchState(e, t, n, r2) {
  return __async(this, null, function* () {
    const i = __PRIVATE_debugCast(e), s = yield function __PRIVATE_localStoreLookupMutationDocuments(e2, t2) {
      const n2 = __PRIVATE_debugCast(e2), r3 = __PRIVATE_debugCast(n2.mutationQueue);
      return n2.persistence.runTransaction("Lookup mutation documents", "readonly", (e3) => r3.Cn(e3, t2).next((t3) => t3 ? n2.localDocuments.getDocuments(e3, t3) : PersistencePromise.resolve(null)));
    }(i.localStore, t);
    null !== s ? ("pending" === n ? (
      // If we are the primary client, we need to send this write to the
      // backend. Secondary clients will ignore these writes since their remote
      // connection is disabled.
      yield __PRIVATE_fillWritePipeline(i.remoteStore)
    ) : "acknowledged" === n || "rejected" === n ? (
      // NOTE: Both these methods are no-ops for batches that originated from
      // other clients.
      (__PRIVATE_processUserCallback(i, t, r2 || null), __PRIVATE_triggerPendingWritesCallbacks(i, t), function __PRIVATE_localStoreRemoveCachedMutationBatchMetadata(e2, t2) {
        __PRIVATE_debugCast(__PRIVATE_debugCast(e2).mutationQueue).Fn(t2);
      }(i.localStore, t))
    ) : fail(), yield __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(i, s)) : (
      // A throttled tab may not have seen the mutation before it was completed
      // and removed from the mutation queue, in which case we won't have cached
      // the affected documents. In this case we can safely ignore the update
      // since that means we didn't apply the mutation locally at all (if we
      // had, we would have cached the affected documents), and so we will just
      // see any resulting document changes via normal remote document updates
      // as applicable.
      __PRIVATE_logDebug("SyncEngine", "Cannot apply mutation batch with id: " + t)
    );
  });
}
function __PRIVATE_syncEngineApplyPrimaryState(e, t) {
  return __async(this, null, function* () {
    const n = __PRIVATE_debugCast(e);
    if (__PRIVATE_ensureWatchCallbacks(n), __PRIVATE_syncEngineEnsureWriteCallbacks(n), true === t && true !== n.Ca) {
      const e2 = n.sharedClientState.getAllActiveQueryTargets(), t2 = yield __PRIVATE_synchronizeQueryViewsAndRaiseSnapshots(n, e2.toArray());
      n.Ca = true, yield __PRIVATE_remoteStoreApplyPrimaryState(n.remoteStore, true);
      for (const e3 of t2)
        __PRIVATE_remoteStoreListen(n.remoteStore, e3);
    } else if (false === t && false !== n.Ca) {
      const e2 = [];
      let t2 = Promise.resolve();
      n.fa.forEach((r2, i) => {
        n.sharedClientState.isLocalQueryTarget(i) ? e2.push(i) : t2 = t2.then(() => (__PRIVATE_removeAndCleanupTarget(n, i), __PRIVATE_localStoreReleaseTarget(
          n.localStore,
          i,
          /*keepPersistedTargetData=*/
          true
        ))), __PRIVATE_remoteStoreUnlisten(n.remoteStore, i);
      }), yield t2, yield __PRIVATE_synchronizeQueryViewsAndRaiseSnapshots(n, e2), // PORTING NOTE: Multi-Tab only.
      function __PRIVATE_resetLimboDocuments(e3) {
        const t3 = __PRIVATE_debugCast(e3);
        t3.ya.forEach((e4, n2) => {
          __PRIVATE_remoteStoreUnlisten(t3.remoteStore, n2);
        }), t3.wa.Vr(), t3.ya = /* @__PURE__ */ new Map(), t3.pa = new SortedMap(DocumentKey.comparator);
      }(n), n.Ca = false, yield __PRIVATE_remoteStoreApplyPrimaryState(n.remoteStore, false);
    }
  });
}
function __PRIVATE_synchronizeQueryViewsAndRaiseSnapshots(e, t, n) {
  return __async(this, null, function* () {
    const r2 = __PRIVATE_debugCast(e), i = [], s = [];
    for (const e2 of t) {
      let t2;
      const n2 = r2.fa.get(e2);
      if (n2 && 0 !== n2.length) {
        t2 = yield __PRIVATE_localStoreAllocateTarget(r2.localStore, __PRIVATE_queryToTarget(n2[0]));
        for (const e3 of n2) {
          const t3 = r2.ma.get(e3), n3 = yield __PRIVATE_synchronizeViewAndComputeSnapshot(r2, t3);
          n3.snapshot && s.push(n3.snapshot);
        }
      } else {
        const n3 = yield __PRIVATE_localStoreGetCachedTarget(r2.localStore, e2);
        t2 = yield __PRIVATE_localStoreAllocateTarget(r2.localStore, n3), yield __PRIVATE_initializeViewAndComputeSnapshot(
          r2,
          __PRIVATE_synthesizeTargetToQuery(n3),
          e2,
          /*current=*/
          false,
          t2.resumeToken
        );
      }
      i.push(t2);
    }
    return r2.Va.a_(s), i;
  });
}
function __PRIVATE_synthesizeTargetToQuery(e) {
  return __PRIVATE_newQuery(e.path, e.collectionGroup, e.orderBy, e.filters, e.limit, "F", e.startAt, e.endAt);
}
function __PRIVATE_syncEngineGetActiveClients(e) {
  return function __PRIVATE_localStoreGetActiveClients(e2) {
    return __PRIVATE_debugCast(__PRIVATE_debugCast(e2).persistence).Bi();
  }(__PRIVATE_debugCast(e).localStore);
}
function __PRIVATE_syncEngineApplyTargetState(e, t, n, r2) {
  return __async(this, null, function* () {
    const i = __PRIVATE_debugCast(e);
    if (i.Ca)
      return void __PRIVATE_logDebug("SyncEngine", "Ignoring unexpected query state notification.");
    const s = i.fa.get(t);
    if (s && s.length > 0)
      switch (n) {
        case "current":
        case "not-current": {
          const e2 = yield __PRIVATE_localStoreGetNewDocumentChanges(i.localStore, __PRIVATE_queryCollectionGroup(s[0])), r3 = RemoteEvent.createSynthesizedRemoteEventForCurrentChange(t, "current" === n, ByteString.EMPTY_BYTE_STRING);
          yield __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(i, e2, r3);
          break;
        }
        case "rejected":
          yield __PRIVATE_localStoreReleaseTarget(
            i.localStore,
            t,
            /* keepPersistedTargetData */
            true
          ), __PRIVATE_removeAndCleanupTarget(i, t, r2);
          break;
        default:
          fail();
      }
  });
}
function __PRIVATE_syncEngineApplyActiveTargetsChange(e, t, n) {
  return __async(this, null, function* () {
    const r2 = __PRIVATE_ensureWatchCallbacks(e);
    if (r2.Ca) {
      for (const e2 of t) {
        if (r2.fa.has(e2)) {
          __PRIVATE_logDebug("SyncEngine", "Adding an already active target " + e2);
          continue;
        }
        const t2 = yield __PRIVATE_localStoreGetCachedTarget(r2.localStore, e2), n2 = yield __PRIVATE_localStoreAllocateTarget(r2.localStore, t2);
        yield __PRIVATE_initializeViewAndComputeSnapshot(
          r2,
          __PRIVATE_synthesizeTargetToQuery(t2),
          n2.targetId,
          /*current=*/
          false,
          n2.resumeToken
        ), __PRIVATE_remoteStoreListen(r2.remoteStore, n2);
      }
      for (const e2 of n)
        r2.fa.has(e2) && // Release queries that are still active.
        (yield __PRIVATE_localStoreReleaseTarget(
          r2.localStore,
          e2,
          /* keepPersistedTargetData */
          false
        ).then(() => {
          __PRIVATE_remoteStoreUnlisten(r2.remoteStore, e2), __PRIVATE_removeAndCleanupTarget(r2, e2);
        }).catch(__PRIVATE_ignoreIfPrimaryLeaseLoss));
    }
  });
}
function __PRIVATE_ensureWatchCallbacks(e) {
  const t = __PRIVATE_debugCast(e);
  return t.remoteStore.remoteSyncer.applyRemoteEvent = __PRIVATE_syncEngineApplyRemoteEvent.bind(null, t), t.remoteStore.remoteSyncer.getRemoteKeysForTarget = __PRIVATE_syncEngineGetRemoteKeysForTarget.bind(null, t), t.remoteStore.remoteSyncer.rejectListen = __PRIVATE_syncEngineRejectListen.bind(null, t), t.Va.a_ = __PRIVATE_eventManagerOnWatchChange.bind(null, t.eventManager), t.Va.Fa = __PRIVATE_eventManagerOnWatchError.bind(null, t.eventManager), t;
}
function __PRIVATE_syncEngineEnsureWriteCallbacks(e) {
  const t = __PRIVATE_debugCast(e);
  return t.remoteStore.remoteSyncer.applySuccessfulWrite = __PRIVATE_syncEngineApplySuccessfulWrite.bind(null, t), t.remoteStore.remoteSyncer.rejectFailedWrite = __PRIVATE_syncEngineRejectFailedWrite.bind(null, t), t;
}
function __PRIVATE_syncEngineLoadBundle(e, t, n) {
  const r2 = __PRIVATE_debugCast(e);
  /** Loads a bundle and returns the list of affected collection groups. */
  (function __PRIVATE_loadBundleImpl(e2, t2, n2) {
    return __async(this, null, function* () {
      try {
        const r3 = yield t2.getMetadata();
        if (yield function __PRIVATE_localStoreHasNewerBundle(e3, t3) {
          const n3 = __PRIVATE_debugCast(e3), r4 = __PRIVATE_fromVersion(t3.createTime);
          return n3.persistence.runTransaction("hasNewerBundle", "readonly", (e4) => n3.Kr.getBundleMetadata(e4, t3.id)).then((e4) => !!e4 && e4.createTime.compareTo(r4) >= 0);
        }(e2.localStore, r3))
          return yield t2.close(), n2._completeWith(function __PRIVATE_bundleSuccessProgress(e3) {
            return {
              taskState: "Success",
              documentsLoaded: e3.totalDocuments,
              bytesLoaded: e3.totalBytes,
              totalDocuments: e3.totalDocuments,
              totalBytes: e3.totalBytes
            };
          }(r3)), Promise.resolve(/* @__PURE__ */ new Set());
        n2._updateProgress(__PRIVATE_bundleInitialProgress(r3));
        const i = new __PRIVATE_BundleLoader(r3, e2.localStore, t2.serializer);
        let s = yield t2.Ma();
        for (; s; ) {
          const e3 = yield i.ea(s);
          e3 && n2._updateProgress(e3), s = yield t2.Ma();
        }
        const o = yield i.complete();
        return yield __PRIVATE_syncEngineEmitNewSnapsAndNotifyLocalStore(
          e2,
          o.ra,
          /* remoteEvent */
          void 0
        ), // Save metadata, so loading the same bundle will skip.
        yield function __PRIVATE_localStoreSaveBundle(e3, t3) {
          const n3 = __PRIVATE_debugCast(e3);
          return n3.persistence.runTransaction("Save bundle", "readwrite", (e4) => n3.Kr.saveBundleMetadata(e4, t3));
        }(e2.localStore, r3), n2._completeWith(o.progress), Promise.resolve(o.na);
      } catch (e3) {
        return __PRIVATE_logWarn("SyncEngine", `Loading bundle failed with ${e3}`), n2._failWith(e3), Promise.resolve(/* @__PURE__ */ new Set());
      }
    });
  })(r2, t, n).then((e2) => {
    r2.sharedClientState.notifyBundleLoaded(e2);
  });
}
var MemoryOfflineComponentProvider = class {
  constructor() {
    this.synchronizeTabs = false;
  }
  initialize(e) {
    return __async(this, null, function* () {
      this.serializer = __PRIVATE_newSerializer(e.databaseInfo.databaseId), this.sharedClientState = this.createSharedClientState(e), this.persistence = this.createPersistence(e), yield this.persistence.start(), this.localStore = this.createLocalStore(e), this.gcScheduler = this.createGarbageCollectionScheduler(e, this.localStore), this.indexBackfillerScheduler = this.createIndexBackfillerScheduler(e, this.localStore);
    });
  }
  createGarbageCollectionScheduler(e, t) {
    return null;
  }
  createIndexBackfillerScheduler(e, t) {
    return null;
  }
  createLocalStore(e) {
    return __PRIVATE_newLocalStore(this.persistence, new __PRIVATE_QueryEngine(), e.initialUser, this.serializer);
  }
  createPersistence(e) {
    return new __PRIVATE_MemoryPersistence(__PRIVATE_MemoryEagerDelegate.jr, this.serializer);
  }
  createSharedClientState(e) {
    return new __PRIVATE_MemorySharedClientState();
  }
  terminate() {
    return __async(this, null, function* () {
      this.gcScheduler && this.gcScheduler.stop(), yield this.sharedClientState.shutdown(), yield this.persistence.shutdown();
    });
  }
};
var __PRIVATE_LruGcMemoryOfflineComponentProvider = class extends MemoryOfflineComponentProvider {
  constructor(e) {
    super(), this.cacheSizeBytes = e;
  }
  createGarbageCollectionScheduler(e, t) {
    __PRIVATE_hardAssert(this.persistence.referenceDelegate instanceof __PRIVATE_MemoryLruDelegate);
    const n = this.persistence.referenceDelegate.garbageCollector;
    return new __PRIVATE_LruScheduler(n, e.asyncQueue, t);
  }
  createPersistence(e) {
    const t = void 0 !== this.cacheSizeBytes ? LruParams.withCacheSize(this.cacheSizeBytes) : LruParams.DEFAULT;
    return new __PRIVATE_MemoryPersistence((e2) => __PRIVATE_MemoryLruDelegate.jr(e2, t), this.serializer);
  }
};
var __PRIVATE_IndexedDbOfflineComponentProvider = class ___PRIVATE_IndexedDbOfflineComponentProvider extends MemoryOfflineComponentProvider {
  constructor(e, t, n) {
    super(), this.xa = e, this.cacheSizeBytes = t, this.forceOwnership = n, this.synchronizeTabs = false;
  }
  initialize(e) {
    return __async(this, null, function* () {
      yield __superGet(___PRIVATE_IndexedDbOfflineComponentProvider.prototype, this, "initialize").call(this, e), yield this.xa.initialize(this, e), // Enqueue writes from a previous session
      yield __PRIVATE_syncEngineEnsureWriteCallbacks(this.xa.syncEngine), yield __PRIVATE_fillWritePipeline(this.xa.remoteStore), // NOTE: This will immediately call the listener, so we make sure to
      // set it after localStore / remoteStore are started.
      yield this.persistence.mi(() => (this.gcScheduler && !this.gcScheduler.started && this.gcScheduler.start(), this.indexBackfillerScheduler && !this.indexBackfillerScheduler.started && this.indexBackfillerScheduler.start(), Promise.resolve()));
    });
  }
  createLocalStore(e) {
    return __PRIVATE_newLocalStore(this.persistence, new __PRIVATE_QueryEngine(), e.initialUser, this.serializer);
  }
  createGarbageCollectionScheduler(e, t) {
    const n = this.persistence.referenceDelegate.garbageCollector;
    return new __PRIVATE_LruScheduler(n, e.asyncQueue, t);
  }
  createIndexBackfillerScheduler(e, t) {
    const n = new __PRIVATE_IndexBackfiller(t, this.persistence);
    return new __PRIVATE_IndexBackfillerScheduler(e.asyncQueue, n);
  }
  createPersistence(e) {
    const t = __PRIVATE_indexedDbStoragePrefix(e.databaseInfo.databaseId, e.databaseInfo.persistenceKey), n = void 0 !== this.cacheSizeBytes ? LruParams.withCacheSize(this.cacheSizeBytes) : LruParams.DEFAULT;
    return new __PRIVATE_IndexedDbPersistence(this.synchronizeTabs, t, e.clientId, n, e.asyncQueue, __PRIVATE_getWindow(), getDocument(), this.serializer, this.sharedClientState, !!this.forceOwnership);
  }
  createSharedClientState(e) {
    return new __PRIVATE_MemorySharedClientState();
  }
};
var __PRIVATE_MultiTabOfflineComponentProvider = class ___PRIVATE_MultiTabOfflineComponentProvider extends __PRIVATE_IndexedDbOfflineComponentProvider {
  constructor(e, t) {
    super(
      e,
      t,
      /* forceOwnership= */
      false
    ), this.xa = e, this.cacheSizeBytes = t, this.synchronizeTabs = true;
  }
  initialize(e) {
    return __async(this, null, function* () {
      yield __superGet(___PRIVATE_MultiTabOfflineComponentProvider.prototype, this, "initialize").call(this, e);
      const t = this.xa.syncEngine;
      this.sharedClientState instanceof __PRIVATE_WebStorageSharedClientState && (this.sharedClientState.syncEngine = {
        Ys: __PRIVATE_syncEngineApplyBatchState.bind(null, t),
        Zs: __PRIVATE_syncEngineApplyTargetState.bind(null, t),
        Xs: __PRIVATE_syncEngineApplyActiveTargetsChange.bind(null, t),
        Bi: __PRIVATE_syncEngineGetActiveClients.bind(null, t),
        Js: __PRIVATE_syncEngineSynchronizeWithChangedDocuments.bind(null, t)
      }, yield this.sharedClientState.start()), // NOTE: This will immediately call the listener, so we make sure to
      // set it after localStore / remoteStore are started.
      yield this.persistence.mi((e2) => __async(this, null, function* () {
        yield __PRIVATE_syncEngineApplyPrimaryState(this.xa.syncEngine, e2), this.gcScheduler && (e2 && !this.gcScheduler.started ? this.gcScheduler.start() : e2 || this.gcScheduler.stop()), this.indexBackfillerScheduler && (e2 && !this.indexBackfillerScheduler.started ? this.indexBackfillerScheduler.start() : e2 || this.indexBackfillerScheduler.stop());
      }));
    });
  }
  createSharedClientState(e) {
    const t = __PRIVATE_getWindow();
    if (!__PRIVATE_WebStorageSharedClientState.D(t))
      throw new FirestoreError(D2.UNIMPLEMENTED, "IndexedDB persistence is only available on platforms that support LocalStorage.");
    const n = __PRIVATE_indexedDbStoragePrefix(e.databaseInfo.databaseId, e.databaseInfo.persistenceKey);
    return new __PRIVATE_WebStorageSharedClientState(t, e.asyncQueue, n, e.clientId, e.initialUser);
  }
};
var OnlineComponentProvider = class {
  initialize(e, t) {
    return __async(this, null, function* () {
      this.localStore || (this.localStore = e.localStore, this.sharedClientState = e.sharedClientState, this.datastore = this.createDatastore(t), this.remoteStore = this.createRemoteStore(t), this.eventManager = this.createEventManager(t), this.syncEngine = this.createSyncEngine(
        t,
        /* startAsPrimary=*/
        !e.synchronizeTabs
      ), this.sharedClientState.onlineStateHandler = (e2) => __PRIVATE_syncEngineApplyOnlineStateChange(
        this.syncEngine,
        e2,
        1
        /* OnlineStateSource.SharedClientState */
      ), this.remoteStore.remoteSyncer.handleCredentialChange = __PRIVATE_syncEngineHandleCredentialChange.bind(null, this.syncEngine), yield __PRIVATE_remoteStoreApplyPrimaryState(this.remoteStore, this.syncEngine.isPrimaryClient));
    });
  }
  createEventManager(e) {
    return function __PRIVATE_newEventManager() {
      return new __PRIVATE_EventManagerImpl();
    }();
  }
  createDatastore(e) {
    const t = __PRIVATE_newSerializer(e.databaseInfo.databaseId), n = function __PRIVATE_newConnection(e2) {
      return new __PRIVATE_WebChannelConnection(e2);
    }(e.databaseInfo);
    return function __PRIVATE_newDatastore(e2, t2, n2, r2) {
      return new __PRIVATE_DatastoreImpl(e2, t2, n2, r2);
    }(e.authCredentials, e.appCheckCredentials, n, t);
  }
  createRemoteStore(e) {
    return function __PRIVATE_newRemoteStore(e2, t, n, r2, i) {
      return new __PRIVATE_RemoteStoreImpl(e2, t, n, r2, i);
    }(this.localStore, this.datastore, e.asyncQueue, (e2) => __PRIVATE_syncEngineApplyOnlineStateChange(
      this.syncEngine,
      e2,
      0
      /* OnlineStateSource.RemoteStore */
    ), function __PRIVATE_newConnectivityMonitor() {
      return __PRIVATE_BrowserConnectivityMonitor.D() ? new __PRIVATE_BrowserConnectivityMonitor() : new __PRIVATE_NoopConnectivityMonitor();
    }());
  }
  createSyncEngine(e, t) {
    return function __PRIVATE_newSyncEngine(e2, t2, n, r2, i, s, o) {
      const _ = new __PRIVATE_SyncEngineImpl(e2, t2, n, r2, i, s);
      return o && (_.Ca = true), _;
    }(this.localStore, this.remoteStore, this.eventManager, this.sharedClientState, e.initialUser, e.maxConcurrentLimboResolutions, t);
  }
  terminate() {
    return function __PRIVATE_remoteStoreShutdown(e) {
      return __async(this, null, function* () {
        const t = __PRIVATE_debugCast(e);
        __PRIVATE_logDebug("RemoteStore", "RemoteStore shutting down."), t.C_.add(
          5
          /* OfflineCause.Shutdown */
        ), yield __PRIVATE_disableNetworkInternal(t), t.F_.shutdown(), // Set the OnlineState to Unknown (rather than Offline) to avoid potentially
        // triggering spurious listener events with cached data, etc.
        t.M_.set(
          "Unknown"
          /* OnlineState.Unknown */
        );
      });
    }(this.remoteStore);
  }
};
function __PRIVATE_toByteStreamReaderHelper(e, t = 10240) {
  let n = 0;
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    read() {
      return __async(this, null, function* () {
        if (n < e.byteLength) {
          const r2 = {
            value: e.slice(n, n + t),
            done: false
          };
          return n += t, r2;
        }
        return {
          done: true
        };
      });
    },
    cancel() {
      return __async(this, null, function* () {
      });
    },
    releaseLock() {
    },
    closed: Promise.resolve()
  };
}
var __PRIVATE_AsyncObserver = class {
  constructor(e) {
    this.observer = e, /**
     * When set to true, will not raise future events. Necessary to deal with
     * async detachment of listener.
     */
    this.muted = false;
  }
  next(e) {
    this.observer.next && this.Oa(this.observer.next, e);
  }
  error(e) {
    this.observer.error ? this.Oa(this.observer.error, e) : __PRIVATE_logError("Uncaught Error in snapshot listener:", e.toString());
  }
  Na() {
    this.muted = true;
  }
  Oa(e, t) {
    this.muted || setTimeout(() => {
      this.muted || e(t);
    }, 0);
  }
};
var __PRIVATE_BundleReaderImpl = class {
  constructor(e, t) {
    this.Ba = e, this.serializer = t, /** Cached bundle metadata. */
    this.metadata = new __PRIVATE_Deferred(), /**
     * Internal buffer to hold bundle content, accumulating incomplete element
     * content.
     */
    this.buffer = new Uint8Array(), this.La = function __PRIVATE_newTextDecoder() {
      return new TextDecoder("utf-8");
    }(), // Read the metadata (which is the first element).
    this.ka().then((e2) => {
      e2 && e2.Z_() ? this.metadata.resolve(e2.Y_.metadata) : this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is
             ${JSON.stringify(null == e2 ? void 0 : e2.Y_)}`));
    }, (e2) => this.metadata.reject(e2));
  }
  close() {
    return this.Ba.cancel();
  }
  getMetadata() {
    return __async(this, null, function* () {
      return this.metadata.promise;
    });
  }
  Ma() {
    return __async(this, null, function* () {
      return yield this.getMetadata(), this.ka();
    });
  }
  /**
   * Reads from the head of internal buffer, and pulling more data from
   * underlying stream if a complete element cannot be found, until an
   * element(including the prefixed length and the JSON string) is found.
   *
   * Once a complete element is read, it is dropped from internal buffer.
   *
   * Returns either the bundled element, or null if we have reached the end of
   * the stream.
   */
  ka() {
    return __async(this, null, function* () {
      const e = yield this.qa();
      if (null === e)
        return null;
      const t = this.La.decode(e), n = Number(t);
      isNaN(n) && this.Qa(`length string (${t}) is not valid number`);
      const r2 = yield this.Ka(n);
      return new __PRIVATE_SizedBundleElement(JSON.parse(r2), e.length + n);
    });
  }
  /** First index of '{' from the underlying buffer. */
  $a() {
    return this.buffer.findIndex((e) => e === "{".charCodeAt(0));
  }
  /**
   * Reads from the beginning of the internal buffer, until the first '{', and
   * return the content.
   *
   * If reached end of the stream, returns a null.
   */
  qa() {
    return __async(this, null, function* () {
      for (; this.$a() < 0; ) {
        if (yield this.Ua())
          break;
      }
      if (0 === this.buffer.length)
        return null;
      const e = this.$a();
      e < 0 && this.Qa("Reached the end of bundle when a length string is expected.");
      const t = this.buffer.slice(0, e);
      return this.buffer = this.buffer.slice(e), t;
    });
  }
  /**
   * Reads from a specified position from the internal buffer, for a specified
   * number of bytes, pulling more data from the underlying stream if needed.
   *
   * Returns a string decoded from the read bytes.
   */
  Ka(e) {
    return __async(this, null, function* () {
      for (; this.buffer.length < e; ) {
        (yield this.Ua()) && this.Qa("Reached the end of bundle when more is expected.");
      }
      const t = this.La.decode(this.buffer.slice(0, e));
      return this.buffer = this.buffer.slice(e), t;
    });
  }
  Qa(e) {
    throw this.Ba.cancel(), new Error(`Invalid bundle format: ${e}`);
  }
  /**
   * Pulls more data from underlying stream to internal buffer.
   * Returns a boolean indicating whether the stream is finished.
   */
  Ua() {
    return __async(this, null, function* () {
      const e = yield this.Ba.read();
      if (!e.done) {
        const t = new Uint8Array(this.buffer.length + e.value.length);
        t.set(this.buffer), t.set(e.value, this.buffer.length), this.buffer = t;
      }
      return e.done;
    });
  }
};
var Transaction$2 = class {
  constructor(e) {
    this.datastore = e, // The version of each document that was read during this transaction.
    this.readVersions = /* @__PURE__ */ new Map(), this.mutations = [], this.committed = false, /**
     * A deferred usage error that occurred previously in this transaction that
     * will cause the transaction to fail once it actually commits.
     */
    this.lastWriteError = null, /**
     * Set of documents that have been written in the transaction.
     *
     * When there's more than one write to the same key in a transaction, any
     * writes after the first are handled differently.
     */
    this.writtenDocs = /* @__PURE__ */ new Set();
  }
  lookup(e) {
    return __async(this, null, function* () {
      if (this.ensureCommitNotCalled(), this.mutations.length > 0)
        throw new FirestoreError(D2.INVALID_ARGUMENT, "Firestore transactions require all reads to be executed before all writes.");
      const t = yield function __PRIVATE_invokeBatchGetDocumentsRpc(e2, t2) {
        return __async(this, null, function* () {
          const n = __PRIVATE_debugCast(e2), r2 = __PRIVATE_getEncodedDatabaseId(n.serializer) + "/documents", i = {
            documents: t2.map((e3) => __PRIVATE_toName(n.serializer, e3))
          }, s = yield n.Co("BatchGetDocuments", r2, i, t2.length), o = /* @__PURE__ */ new Map();
          s.forEach((e3) => {
            const t3 = __PRIVATE_fromBatchGetDocumentsResponse(n.serializer, e3);
            o.set(t3.key.toString(), t3);
          });
          const _ = [];
          return t2.forEach((e3) => {
            const t3 = o.get(e3.toString());
            __PRIVATE_hardAssert(!!t3), _.push(t3);
          }), _;
        });
      }(this.datastore, e);
      return t.forEach((e2) => this.recordVersion(e2)), t;
    });
  }
  set(e, t) {
    this.write(t.toMutation(e, this.precondition(e))), this.writtenDocs.add(e.toString());
  }
  update(e, t) {
    try {
      this.write(t.toMutation(e, this.preconditionForUpdate(e)));
    } catch (e2) {
      this.lastWriteError = e2;
    }
    this.writtenDocs.add(e.toString());
  }
  delete(e) {
    this.write(new __PRIVATE_DeleteMutation(e, this.precondition(e))), this.writtenDocs.add(e.toString());
  }
  commit() {
    return __async(this, null, function* () {
      if (this.ensureCommitNotCalled(), this.lastWriteError)
        throw this.lastWriteError;
      const e = this.readVersions;
      this.mutations.forEach((t) => {
        e.delete(t.key.toString());
      }), // For each document that was read but not written to, we want to perform
      // a `verify` operation.
      e.forEach((e2, t) => {
        const n = DocumentKey.fromPath(t);
        this.mutations.push(new __PRIVATE_VerifyMutation(n, this.precondition(n)));
      }), yield function __PRIVATE_invokeCommitRpc(e2, t) {
        return __async(this, null, function* () {
          const n = __PRIVATE_debugCast(e2), r2 = __PRIVATE_getEncodedDatabaseId(n.serializer) + "/documents", i = {
            writes: t.map((e3) => toMutation(n.serializer, e3))
          };
          yield n.wo("Commit", r2, i);
        });
      }(this.datastore, this.mutations), this.committed = true;
    });
  }
  recordVersion(e) {
    let t;
    if (e.isFoundDocument())
      t = e.version;
    else {
      if (!e.isNoDocument())
        throw fail();
      t = SnapshotVersion.min();
    }
    const n = this.readVersions.get(e.key.toString());
    if (n) {
      if (!t.isEqual(n))
        throw new FirestoreError(D2.ABORTED, "Document version changed between two reads.");
    } else
      this.readVersions.set(e.key.toString(), t);
  }
  /**
   * Returns the version of this document when it was read in this transaction,
   * as a precondition, or no precondition if it was not read.
   */
  precondition(e) {
    const t = this.readVersions.get(e.toString());
    return !this.writtenDocs.has(e.toString()) && t ? t.isEqual(SnapshotVersion.min()) ? Precondition.exists(false) : Precondition.updateTime(t) : Precondition.none();
  }
  /**
   * Returns the precondition for a document if the operation is an update.
   */
  preconditionForUpdate(e) {
    const t = this.readVersions.get(e.toString());
    if (!this.writtenDocs.has(e.toString()) && t) {
      if (t.isEqual(SnapshotVersion.min()))
        throw new FirestoreError(D2.INVALID_ARGUMENT, "Can't update a document that doesn't exist.");
      return Precondition.updateTime(t);
    }
    return Precondition.exists(true);
  }
  write(e) {
    this.ensureCommitNotCalled(), this.mutations.push(e);
  }
  ensureCommitNotCalled() {
  }
};
var __PRIVATE_TransactionRunner = class {
  constructor(e, t, n, r2, i) {
    this.asyncQueue = e, this.datastore = t, this.options = n, this.updateFunction = r2, this.deferred = i, this.Wa = n.maxAttempts, this.zo = new __PRIVATE_ExponentialBackoff(
      this.asyncQueue,
      "transaction_retry"
      /* TimerId.TransactionRetry */
    );
  }
  /** Runs the transaction and sets the result on deferred. */
  run() {
    this.Wa -= 1, this.Ga();
  }
  Ga() {
    this.zo.ko(() => __async(this, null, function* () {
      const e = new Transaction$2(this.datastore), t = this.za(e);
      t && t.then((t2) => {
        this.asyncQueue.enqueueAndForget(() => e.commit().then(() => {
          this.deferred.resolve(t2);
        }).catch((e2) => {
          this.ja(e2);
        }));
      }).catch((e2) => {
        this.ja(e2);
      });
    }));
  }
  za(e) {
    try {
      const t = this.updateFunction(e);
      return !__PRIVATE_isNullOrUndefined(t) && t.catch && t.then ? t : (this.deferred.reject(Error("Transaction callback must return a Promise")), null);
    } catch (e2) {
      return this.deferred.reject(e2), null;
    }
  }
  ja(e) {
    this.Wa > 0 && this.Ha(e) ? (this.Wa -= 1, this.asyncQueue.enqueueAndForget(() => (this.Ga(), Promise.resolve()))) : this.deferred.reject(e);
  }
  Ha(e) {
    if ("FirebaseError" === e.name) {
      const t = e.code;
      return "aborted" === t || "failed-precondition" === t || "already-exists" === t || !__PRIVATE_isPermanentError(t);
    }
    return false;
  }
};
var FirestoreClient = class {
  constructor(e, t, n, r2) {
    this.authCredentials = e, this.appCheckCredentials = t, this.asyncQueue = n, this.databaseInfo = r2, this.user = User.UNAUTHENTICATED, this.clientId = __PRIVATE_AutoId.newId(), this.authCredentialListener = () => Promise.resolve(), this.appCheckCredentialListener = () => Promise.resolve(), this.authCredentials.start(n, (e2) => __async(this, null, function* () {
      __PRIVATE_logDebug("FirestoreClient", "Received user=", e2.uid), yield this.authCredentialListener(e2), this.user = e2;
    })), this.appCheckCredentials.start(n, (e2) => (__PRIVATE_logDebug("FirestoreClient", "Received new app check token=", e2), this.appCheckCredentialListener(e2, this.user)));
  }
  getConfiguration() {
    return __async(this, null, function* () {
      return {
        asyncQueue: this.asyncQueue,
        databaseInfo: this.databaseInfo,
        clientId: this.clientId,
        authCredentials: this.authCredentials,
        appCheckCredentials: this.appCheckCredentials,
        initialUser: this.user,
        maxConcurrentLimboResolutions: 100
      };
    });
  }
  setCredentialChangeListener(e) {
    this.authCredentialListener = e;
  }
  setAppCheckTokenChangeListener(e) {
    this.appCheckCredentialListener = e;
  }
  /**
   * Checks that the client has not been terminated. Ensures that other methods on //
   * this class cannot be called after the client is terminated. //
   */
  verifyNotTerminated() {
    if (this.asyncQueue.isShuttingDown)
      throw new FirestoreError(D2.FAILED_PRECONDITION, "The client has already been terminated.");
  }
  terminate() {
    this.asyncQueue.enterRestrictedMode();
    const e = new __PRIVATE_Deferred();
    return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(() => __async(this, null, function* () {
      try {
        this._onlineComponents && (yield this._onlineComponents.terminate()), this._offlineComponents && (yield this._offlineComponents.terminate()), // The credentials provider must be terminated after shutting down the
        // RemoteStore as it will prevent the RemoteStore from retrieving auth
        // tokens.
        this.authCredentials.shutdown(), this.appCheckCredentials.shutdown(), e.resolve();
      } catch (t) {
        const n = __PRIVATE_wrapInUserErrorIfRecoverable(t, "Failed to shutdown persistence");
        e.reject(n);
      }
    })), e.promise;
  }
};
function __PRIVATE_setOfflineComponentProvider(e, t) {
  return __async(this, null, function* () {
    e.asyncQueue.verifyOperationInProgress(), __PRIVATE_logDebug("FirestoreClient", "Initializing OfflineComponentProvider");
    const n = yield e.getConfiguration();
    yield t.initialize(n);
    let r2 = n.initialUser;
    e.setCredentialChangeListener((e2) => __async(this, null, function* () {
      r2.isEqual(e2) || (yield __PRIVATE_localStoreHandleUserChange(t.localStore, e2), r2 = e2);
    })), // When a user calls clearPersistence() in one client, all other clients
    // need to be terminated to allow the delete to succeed.
    t.persistence.setDatabaseDeletedListener(() => e.terminate()), e._offlineComponents = t;
  });
}
function __PRIVATE_setOnlineComponentProvider(e, t) {
  return __async(this, null, function* () {
    e.asyncQueue.verifyOperationInProgress();
    const n = yield __PRIVATE_ensureOfflineComponents(e);
    __PRIVATE_logDebug("FirestoreClient", "Initializing OnlineComponentProvider");
    const r2 = yield e.getConfiguration();
    yield t.initialize(n, r2), // The CredentialChangeListener of the online component provider takes
    // precedence over the offline component provider.
    e.setCredentialChangeListener((e2) => __PRIVATE_remoteStoreHandleCredentialChange(t.remoteStore, e2)), e.setAppCheckTokenChangeListener((e2, n2) => __PRIVATE_remoteStoreHandleCredentialChange(t.remoteStore, n2)), e._onlineComponents = t;
  });
}
function __PRIVATE_canFallbackFromIndexedDbError(e) {
  return "FirebaseError" === e.name ? e.code === D2.FAILED_PRECONDITION || e.code === D2.UNIMPLEMENTED : !("undefined" != typeof DOMException && e instanceof DOMException) || // When the browser is out of quota we could get either quota exceeded
  // or an aborted error depending on whether the error happened during
  // schema migration.
  (22 === e.code || 20 === e.code || // Firefox Private Browsing mode disables IndexedDb and returns
  // INVALID_STATE for any usage.
  11 === e.code);
}
function __PRIVATE_ensureOfflineComponents(e) {
  return __async(this, null, function* () {
    if (!e._offlineComponents)
      if (e._uninitializedComponentsProvider) {
        __PRIVATE_logDebug("FirestoreClient", "Using user provided OfflineComponentProvider");
        try {
          yield __PRIVATE_setOfflineComponentProvider(e, e._uninitializedComponentsProvider._offline);
        } catch (t) {
          const n = t;
          if (!__PRIVATE_canFallbackFromIndexedDbError(n))
            throw n;
          __PRIVATE_logWarn("Error using user provided cache. Falling back to memory cache: " + n), yield __PRIVATE_setOfflineComponentProvider(e, new MemoryOfflineComponentProvider());
        }
      } else
        __PRIVATE_logDebug("FirestoreClient", "Using default OfflineComponentProvider"), yield __PRIVATE_setOfflineComponentProvider(e, new MemoryOfflineComponentProvider());
    return e._offlineComponents;
  });
}
function __PRIVATE_ensureOnlineComponents(e) {
  return __async(this, null, function* () {
    return e._onlineComponents || (e._uninitializedComponentsProvider ? (__PRIVATE_logDebug("FirestoreClient", "Using user provided OnlineComponentProvider"), yield __PRIVATE_setOnlineComponentProvider(e, e._uninitializedComponentsProvider._online)) : (__PRIVATE_logDebug("FirestoreClient", "Using default OnlineComponentProvider"), yield __PRIVATE_setOnlineComponentProvider(e, new OnlineComponentProvider()))), e._onlineComponents;
  });
}
function __PRIVATE_getPersistence(e) {
  return __PRIVATE_ensureOfflineComponents(e).then((e2) => e2.persistence);
}
function __PRIVATE_getLocalStore(e) {
  return __PRIVATE_ensureOfflineComponents(e).then((e2) => e2.localStore);
}
function __PRIVATE_getRemoteStore(e) {
  return __PRIVATE_ensureOnlineComponents(e).then((e2) => e2.remoteStore);
}
function __PRIVATE_getSyncEngine(e) {
  return __PRIVATE_ensureOnlineComponents(e).then((e2) => e2.syncEngine);
}
function __PRIVATE_getDatastore(e) {
  return __PRIVATE_ensureOnlineComponents(e).then((e2) => e2.datastore);
}
function __PRIVATE_getEventManager(e) {
  return __async(this, null, function* () {
    const t = yield __PRIVATE_ensureOnlineComponents(e), n = t.eventManager;
    return n.onListen = __PRIVATE_syncEngineListen.bind(null, t.syncEngine), n.onUnlisten = __PRIVATE_syncEngineUnlisten.bind(null, t.syncEngine), n;
  });
}
function __PRIVATE_firestoreClientEnableNetwork(e) {
  return e.asyncQueue.enqueue(() => __async(this, null, function* () {
    const t = yield __PRIVATE_getPersistence(e), n = yield __PRIVATE_getRemoteStore(e);
    return t.setNetworkEnabled(true), function __PRIVATE_remoteStoreEnableNetwork(e2) {
      const t2 = __PRIVATE_debugCast(e2);
      return t2.C_.delete(
        0
        /* OfflineCause.UserDisabled */
      ), __PRIVATE_enableNetworkInternal(t2);
    }(n);
  }));
}
function __PRIVATE_firestoreClientDisableNetwork(e) {
  return e.asyncQueue.enqueue(() => __async(this, null, function* () {
    const t = yield __PRIVATE_getPersistence(e), n = yield __PRIVATE_getRemoteStore(e);
    return t.setNetworkEnabled(false), function __PRIVATE_remoteStoreDisableNetwork(e2) {
      return __async(this, null, function* () {
        const t2 = __PRIVATE_debugCast(e2);
        t2.C_.add(
          0
          /* OfflineCause.UserDisabled */
        ), yield __PRIVATE_disableNetworkInternal(t2), // Set the OnlineState to Offline so get()s return from cache, etc.
        t2.M_.set(
          "Offline"
          /* OnlineState.Offline */
        );
      });
    }(n);
  }));
}
function __PRIVATE_firestoreClientGetDocumentFromLocalCache(e, t) {
  const n = new __PRIVATE_Deferred();
  return e.asyncQueue.enqueueAndForget(() => __async(this, null, function* () {
    return function __PRIVATE_readDocumentFromCache(e2, t2, n2) {
      return __async(this, null, function* () {
        try {
          const r2 = yield function __PRIVATE_localStoreReadDocument(e3, t3) {
            const n3 = __PRIVATE_debugCast(e3);
            return n3.persistence.runTransaction("read document", "readonly", (e4) => n3.localDocuments.getDocument(e4, t3));
          }(e2, t2);
          r2.isFoundDocument() ? n2.resolve(r2) : r2.isNoDocument() ? n2.resolve(null) : n2.reject(new FirestoreError(D2.UNAVAILABLE, "Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"));
        } catch (e3) {
          const r2 = __PRIVATE_wrapInUserErrorIfRecoverable(e3, `Failed to get document '${t2} from cache`);
          n2.reject(r2);
        }
      });
    }(yield __PRIVATE_getLocalStore(e), t, n);
  })), n.promise;
}
function __PRIVATE_firestoreClientGetDocumentViaSnapshotListener(e, t, n = {}) {
  const r2 = new __PRIVATE_Deferred();
  return e.asyncQueue.enqueueAndForget(() => __async(this, null, function* () {
    return function __PRIVATE_readDocumentViaSnapshotListener(e2, t2, n2, r3, i) {
      const s = new __PRIVATE_AsyncObserver({
        next: (s2) => {
          t2.enqueueAndForget(() => __PRIVATE_eventManagerUnlisten(e2, o));
          const _ = s2.docs.has(n2);
          !_ && s2.fromCache ? (
            // TODO(dimond): If we're online and the document doesn't
            // exist then we resolve with a doc.exists set to false. If
            // we're offline however, we reject the Promise in this
            // case. Two options: 1) Cache the negative response from
            // the server so we can deliver that even when you're
            // offline 2) Actually reject the Promise in the online case
            // if the document doesn't exist.
            i.reject(new FirestoreError(D2.UNAVAILABLE, "Failed to get document because the client is offline."))
          ) : _ && s2.fromCache && r3 && "server" === r3.source ? i.reject(new FirestoreError(D2.UNAVAILABLE, 'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')) : i.resolve(s2);
        },
        error: (e3) => i.reject(e3)
      }), o = new __PRIVATE_QueryListener(__PRIVATE_newQueryForPath(n2.path), s, {
        includeMetadataChanges: true,
        J_: true
      });
      return __PRIVATE_eventManagerListen(e2, o);
    }(yield __PRIVATE_getEventManager(e), e.asyncQueue, t, n, r2);
  })), r2.promise;
}
function __PRIVATE_firestoreClientGetDocumentsFromLocalCache(e, t) {
  const n = new __PRIVATE_Deferred();
  return e.asyncQueue.enqueueAndForget(() => __async(this, null, function* () {
    return function __PRIVATE_executeQueryFromCache(e2, t2, n2) {
      return __async(this, null, function* () {
        try {
          const r2 = yield __PRIVATE_localStoreExecuteQuery(
            e2,
            t2,
            /* usePreviousResults= */
            true
          ), i = new __PRIVATE_View(t2, r2.ls), s = i.ca(r2.documents), o = i.applyChanges(
            s,
            /* limboResolutionEnabled= */
            false
          );
          n2.resolve(o.snapshot);
        } catch (e3) {
          const r2 = __PRIVATE_wrapInUserErrorIfRecoverable(e3, `Failed to execute query '${t2} against cache`);
          n2.reject(r2);
        }
      });
    }(yield __PRIVATE_getLocalStore(e), t, n);
  })), n.promise;
}
function __PRIVATE_firestoreClientGetDocumentsViaSnapshotListener(e, t, n = {}) {
  const r2 = new __PRIVATE_Deferred();
  return e.asyncQueue.enqueueAndForget(() => __async(this, null, function* () {
    return function __PRIVATE_executeQueryViaSnapshotListener(e2, t2, n2, r3, i) {
      const s = new __PRIVATE_AsyncObserver({
        next: (n3) => {
          t2.enqueueAndForget(() => __PRIVATE_eventManagerUnlisten(e2, o)), n3.fromCache && "server" === r3.source ? i.reject(new FirestoreError(D2.UNAVAILABLE, 'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')) : i.resolve(n3);
        },
        error: (e3) => i.reject(e3)
      }), o = new __PRIVATE_QueryListener(n2, s, {
        includeMetadataChanges: true,
        J_: true
      });
      return __PRIVATE_eventManagerListen(e2, o);
    }(yield __PRIVATE_getEventManager(e), e.asyncQueue, t, n, r2);
  })), r2.promise;
}
function __PRIVATE_firestoreClientAddSnapshotsInSyncListener(e, t) {
  const n = new __PRIVATE_AsyncObserver(t);
  return e.asyncQueue.enqueueAndForget(() => __async(this, null, function* () {
    return function __PRIVATE_addSnapshotsInSyncListener(e2, t2) {
      __PRIVATE_debugCast(e2).q_.add(t2), // Immediately fire an initial event, indicating all existing listeners
      // are in-sync.
      t2.next();
    }(yield __PRIVATE_getEventManager(e), n);
  })), () => {
    n.Na(), e.asyncQueue.enqueueAndForget(() => __async(this, null, function* () {
      return function __PRIVATE_removeSnapshotsInSyncListener(e2, t2) {
        __PRIVATE_debugCast(e2).q_.delete(t2);
      }(yield __PRIVATE_getEventManager(e), n);
    }));
  };
}
function __PRIVATE_firestoreClientLoadBundle(e, t, n, r2) {
  const i = function __PRIVATE_createBundleReader(e2, t2) {
    let n2;
    n2 = "string" == typeof e2 ? __PRIVATE_newTextEncoder().encode(e2) : e2;
    return function __PRIVATE_newBundleReader(e3, t3) {
      return new __PRIVATE_BundleReaderImpl(e3, t3);
    }(function __PRIVATE_toByteStreamReader(e3, t3) {
      if (e3 instanceof Uint8Array)
        return __PRIVATE_toByteStreamReaderHelper(e3, t3);
      if (e3 instanceof ArrayBuffer)
        return __PRIVATE_toByteStreamReaderHelper(new Uint8Array(e3), t3);
      if (e3 instanceof ReadableStream)
        return e3.getReader();
      throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream");
    }(n2), t2);
  }(n, __PRIVATE_newSerializer(t));
  e.asyncQueue.enqueueAndForget(() => __async(this, null, function* () {
    __PRIVATE_syncEngineLoadBundle(yield __PRIVATE_getSyncEngine(e), i, r2);
  }));
}
function __PRIVATE_firestoreClientGetNamedQuery(e, t) {
  return e.asyncQueue.enqueue(() => __async(this, null, function* () {
    return function __PRIVATE_localStoreGetNamedQuery(e2, t2) {
      const n = __PRIVATE_debugCast(e2);
      return n.persistence.runTransaction("Get named query", "readonly", (e3) => n.Kr.getNamedQuery(e3, t2));
    }(yield __PRIVATE_getLocalStore(e), t);
  }));
}
function __PRIVATE_firestoreClientSetIndexConfiguration(e, t) {
  return e.asyncQueue.enqueue(() => __async(this, null, function* () {
    return function __PRIVATE_localStoreConfigureFieldIndexes(e2, t2) {
      return __async(this, null, function* () {
        const n = __PRIVATE_debugCast(e2), r2 = n.indexManager, i = [];
        return n.persistence.runTransaction("Configure indexes", "readwrite", (e3) => r2.getFieldIndexes(e3).next((n2) => (
          /**
          * @license
          * Copyright 2017 Google LLC
          *
          * Licensed under the Apache License, Version 2.0 (the "License");
          * you may not use this file except in compliance with the License.
          * You may obtain a copy of the License at
          *
          *   http://www.apache.org/licenses/LICENSE-2.0
          *
          * Unless required by applicable law or agreed to in writing, software
          * distributed under the License is distributed on an "AS IS" BASIS,
          * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
          * See the License for the specific language governing permissions and
          * limitations under the License.
          */
          /**
          * Compares two array for equality using comparator. The method computes the
          * intersection and invokes `onAdd` for every element that is in `after` but not
          * `before`. `onRemove` is invoked for every element in `before` but missing
          * from `after`.
          *
          * The method creates a copy of both `before` and `after` and runs in O(n log
          * n), where n is the size of the two lists.
          *
          * @param before - The elements that exist in the original array.
          * @param after - The elements to diff against the original array.
          * @param comparator - The comparator for the elements in before and after.
          * @param onAdd - A function to invoke for every element that is part of `
          * after` but not `before`.
          * @param onRemove - A function to invoke for every element that is part of
          * `before` but not `after`.
          */
          function __PRIVATE_diffArrays(e4, t3, n3, r3, i2) {
            e4 = [...e4], t3 = [...t3], e4.sort(n3), t3.sort(n3);
            const s = e4.length, o = t3.length;
            let _ = 0, a = 0;
            for (; _ < o && a < s; ) {
              const s2 = n3(e4[a], t3[_]);
              s2 < 0 ? (
                // The element was removed if the next element in our ordered
                // walkthrough is only in `before`.
                i2(e4[a++])
              ) : s2 > 0 ? (
                // The element was added if the next element in our ordered walkthrough
                // is only in `after`.
                r3(t3[_++])
              ) : (_++, a++);
            }
            for (; _ < o; )
              r3(t3[_++]);
            for (; a < s; )
              i2(e4[a++]);
          }(n2, t2, __PRIVATE_fieldIndexSemanticComparator, (t3) => {
            i.push(r2.addFieldIndex(e3, t3));
          }, (t3) => {
            i.push(r2.deleteFieldIndex(e3, t3));
          })
        )).next(() => PersistencePromise.waitFor(i)));
      });
    }(yield __PRIVATE_getLocalStore(e), t);
  }));
}
function __PRIVATE_firestoreClientSetPersistentCacheIndexAutoCreationEnabled(e, t) {
  return e.asyncQueue.enqueue(() => __async(this, null, function* () {
    return function __PRIVATE_localStoreSetIndexAutoCreationEnabled(e2, t2) {
      __PRIVATE_debugCast(e2).es.$i = t2;
    }(yield __PRIVATE_getLocalStore(e), t);
  }));
}
function __PRIVATE_firestoreClientDeleteAllFieldIndexes(e) {
  return e.asyncQueue.enqueue(() => __async(this, null, function* () {
    return function __PRIVATE_localStoreDeleteAllFieldIndexes(e2) {
      const t = __PRIVATE_debugCast(e2), n = t.indexManager;
      return t.persistence.runTransaction("Delete All Indexes", "readwrite", (e3) => n.deleteAllFieldIndexes(e3));
    }(yield __PRIVATE_getLocalStore(e));
  }));
}
function __PRIVATE_cloneLongPollingOptions(e) {
  const t = {};
  return void 0 !== e.timeoutSeconds && (t.timeoutSeconds = e.timeoutSeconds), t;
}
var me = /* @__PURE__ */ new Map();
function __PRIVATE_validateNonEmptyArgument(e, t, n) {
  if (!n)
    throw new FirestoreError(D2.INVALID_ARGUMENT, `Function ${e}() cannot be called with an empty ${t}.`);
}
function __PRIVATE_validateIsNotUsedTogether(e, t, n, r2) {
  if (true === t && true === r2)
    throw new FirestoreError(D2.INVALID_ARGUMENT, `${e} and ${n} cannot be used together.`);
}
function __PRIVATE_validateDocumentPath(e) {
  if (!DocumentKey.isDocumentKey(e))
    throw new FirestoreError(D2.INVALID_ARGUMENT, `Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`);
}
function __PRIVATE_validateCollectionPath(e) {
  if (DocumentKey.isDocumentKey(e))
    throw new FirestoreError(D2.INVALID_ARGUMENT, `Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`);
}
function __PRIVATE_valueDescription(e) {
  if (void 0 === e)
    return "undefined";
  if (null === e)
    return "null";
  if ("string" == typeof e)
    return e.length > 20 && (e = `${e.substring(0, 20)}...`), JSON.stringify(e);
  if ("number" == typeof e || "boolean" == typeof e)
    return "" + e;
  if ("object" == typeof e) {
    if (e instanceof Array)
      return "an array";
    {
      const t = (
        /** try to get the constructor name for an object. */
        function __PRIVATE_tryGetCustomObjectType(e2) {
          if (e2.constructor)
            return e2.constructor.name;
          return null;
        }(e)
      );
      return t ? `a custom ${t} object` : "an object";
    }
  }
  return "function" == typeof e ? "a function" : fail();
}
function __PRIVATE_cast(e, t) {
  if ("_delegate" in e && // Unwrap Compat types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e = e._delegate), !(e instanceof t)) {
    if (t.name === e.constructor.name)
      throw new FirestoreError(D2.INVALID_ARGUMENT, "Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");
    {
      const n = __PRIVATE_valueDescription(e);
      throw new FirestoreError(D2.INVALID_ARGUMENT, `Expected type '${t.name}', but it was: ${n}`);
    }
  }
  return e;
}
function __PRIVATE_validatePositiveNumber(e, t) {
  if (t <= 0)
    throw new FirestoreError(D2.INVALID_ARGUMENT, `Function ${e}() requires a positive number, but it was: ${t}.`);
}
var FirestoreSettingsImpl = class {
  constructor(e) {
    var t, n;
    if (void 0 === e.host) {
      if (void 0 !== e.ssl)
        throw new FirestoreError(D2.INVALID_ARGUMENT, "Can't provide ssl option if host option is not set");
      this.host = "firestore.googleapis.com", this.ssl = true;
    } else
      this.host = e.host, this.ssl = null === (t = e.ssl) || void 0 === t || t;
    if (this.credentials = e.credentials, this.ignoreUndefinedProperties = !!e.ignoreUndefinedProperties, this.localCache = e.localCache, void 0 === e.cacheSizeBytes)
      this.cacheSizeBytes = 41943040;
    else {
      if (-1 !== e.cacheSizeBytes && e.cacheSizeBytes < 1048576)
        throw new FirestoreError(D2.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
      this.cacheSizeBytes = e.cacheSizeBytes;
    }
    __PRIVATE_validateIsNotUsedTogether("experimentalForceLongPolling", e.experimentalForceLongPolling, "experimentalAutoDetectLongPolling", e.experimentalAutoDetectLongPolling), this.experimentalForceLongPolling = !!e.experimentalForceLongPolling, this.experimentalForceLongPolling ? this.experimentalAutoDetectLongPolling = false : void 0 === e.experimentalAutoDetectLongPolling ? this.experimentalAutoDetectLongPolling = true : (
      // For backwards compatibility, coerce the value to boolean even though
      // the TypeScript compiler has narrowed the type to boolean already.
      // noinspection PointlessBooleanExpressionJS
      this.experimentalAutoDetectLongPolling = !!e.experimentalAutoDetectLongPolling
    ), this.experimentalLongPollingOptions = __PRIVATE_cloneLongPollingOptions(null !== (n = e.experimentalLongPollingOptions) && void 0 !== n ? n : {}), function __PRIVATE_validateLongPollingOptions(e2) {
      if (void 0 !== e2.timeoutSeconds) {
        if (isNaN(e2.timeoutSeconds))
          throw new FirestoreError(D2.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (must not be NaN)`);
        if (e2.timeoutSeconds < 5)
          throw new FirestoreError(D2.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (minimum allowed value is 5)`);
        if (e2.timeoutSeconds > 30)
          throw new FirestoreError(D2.INVALID_ARGUMENT, `invalid long polling timeout: ${e2.timeoutSeconds} (maximum allowed value is 30)`);
      }
    }(this.experimentalLongPollingOptions), this.useFetchStreams = !!e.useFetchStreams;
  }
  isEqual(e) {
    return this.host === e.host && this.ssl === e.ssl && this.credentials === e.credentials && this.cacheSizeBytes === e.cacheSizeBytes && this.experimentalForceLongPolling === e.experimentalForceLongPolling && this.experimentalAutoDetectLongPolling === e.experimentalAutoDetectLongPolling && function __PRIVATE_longPollingOptionsEqual(e2, t) {
      return e2.timeoutSeconds === t.timeoutSeconds;
    }(this.experimentalLongPollingOptions, e.experimentalLongPollingOptions) && this.ignoreUndefinedProperties === e.ignoreUndefinedProperties && this.useFetchStreams === e.useFetchStreams;
  }
};
var Firestore$1 = class {
  /** @hideconstructor */
  constructor(e, t, n, r2) {
    this._authCredentials = e, this._appCheckCredentials = t, this._databaseId = n, this._app = r2, /**
     * Whether it's a Firestore or Firestore Lite instance.
     */
    this.type = "firestore-lite", this._persistenceKey = "(lite)", this._settings = new FirestoreSettingsImpl({}), this._settingsFrozen = false;
  }
  /**
   * The {@link @firebase/app#FirebaseApp} associated with this `Firestore` service
   * instance.
   */
  get app() {
    if (!this._app)
      throw new FirestoreError(D2.FAILED_PRECONDITION, "Firestore was not initialized using the Firebase SDK. 'app' is not available");
    return this._app;
  }
  get _initialized() {
    return this._settingsFrozen;
  }
  get _terminated() {
    return void 0 !== this._terminateTask;
  }
  _setSettings(e) {
    if (this._settingsFrozen)
      throw new FirestoreError(D2.FAILED_PRECONDITION, "Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");
    this._settings = new FirestoreSettingsImpl(e), void 0 !== e.credentials && (this._authCredentials = function __PRIVATE_makeAuthCredentialsProvider(e2) {
      if (!e2)
        return new __PRIVATE_EmptyAuthCredentialsProvider();
      switch (e2.type) {
        case "firstParty":
          return new __PRIVATE_FirstPartyAuthCredentialsProvider(e2.sessionIndex || "0", e2.iamToken || null, e2.authTokenFactory || null);
        case "provider":
          return e2.client;
        default:
          throw new FirestoreError(D2.INVALID_ARGUMENT, "makeAuthCredentialsProvider failed due to invalid credential type");
      }
    }(e.credentials));
  }
  _getSettings() {
    return this._settings;
  }
  _freezeSettings() {
    return this._settingsFrozen = true, this._settings;
  }
  _delete() {
    return this._terminateTask || (this._terminateTask = this._terminate()), this._terminateTask;
  }
  /** Returns a JSON-serializable representation of this `Firestore` instance. */
  toJSON() {
    return {
      app: this._app,
      databaseId: this._databaseId,
      settings: this._settings
    };
  }
  /**
   * Terminates all components used by this client. Subclasses can override
   * this method to clean up their own dependencies, but must also call this
   * method.
   *
   * Only ever called once.
   */
  _terminate() {
    return function __PRIVATE_removeComponents(e) {
      const t = me.get(e);
      t && (__PRIVATE_logDebug("ComponentProvider", "Removing Datastore"), me.delete(e), t.terminate());
    }(this), Promise.resolve();
  }
};
function connectFirestoreEmulator(e, t, n, r2 = {}) {
  var i;
  const s = (e = __PRIVATE_cast(e, Firestore$1))._getSettings(), o = `${t}:${n}`;
  if ("firestore.googleapis.com" !== s.host && s.host !== o && __PRIVATE_logWarn("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."), e._setSettings(Object.assign(Object.assign({}, s), {
    host: o,
    ssl: false
  })), r2.mockUserToken) {
    let t2, n2;
    if ("string" == typeof r2.mockUserToken)
      t2 = r2.mockUserToken, n2 = User.MOCK_USER;
    else {
      t2 = createMockUserToken(r2.mockUserToken, null === (i = e._app) || void 0 === i ? void 0 : i.options.projectId);
      const s2 = r2.mockUserToken.sub || r2.mockUserToken.user_id;
      if (!s2)
        throw new FirestoreError(D2.INVALID_ARGUMENT, "mockUserToken must contain 'sub' or 'user_id' field!");
      n2 = new User(s2);
    }
    e._authCredentials = new __PRIVATE_EmulatorAuthCredentialsProvider(new __PRIVATE_OAuthToken(t2, n2));
  }
}
var Query = class _Query {
  // This is the lite version of the Query class in the main SDK.
  /** @hideconstructor protected */
  constructor(e, t, n) {
    this.converter = t, this._query = n, /** The type of this Firestore reference. */
    this.type = "query", this.firestore = e;
  }
  withConverter(e) {
    return new _Query(this.firestore, e, this._query);
  }
};
var DocumentReference = class _DocumentReference {
  /** @hideconstructor */
  constructor(e, t, n) {
    this.converter = t, this._key = n, /** The type of this Firestore reference. */
    this.type = "document", this.firestore = e;
  }
  get _path() {
    return this._key.path;
  }
  /**
   * The document's identifier within its collection.
   */
  get id() {
    return this._key.path.lastSegment();
  }
  /**
   * A string representing the path of the referenced document (relative
   * to the root of the database).
   */
  get path() {
    return this._key.path.canonicalString();
  }
  /**
   * The collection this `DocumentReference` belongs to.
   */
  get parent() {
    return new CollectionReference(this.firestore, this.converter, this._key.path.popLast());
  }
  withConverter(e) {
    return new _DocumentReference(this.firestore, e, this._key);
  }
};
var CollectionReference = class _CollectionReference extends Query {
  /** @hideconstructor */
  constructor(e, t, n) {
    super(e, t, __PRIVATE_newQueryForPath(n)), this._path = n, /** The type of this Firestore reference. */
    this.type = "collection";
  }
  /** The collection's identifier. */
  get id() {
    return this._query.path.lastSegment();
  }
  /**
   * A string representing the path of the referenced collection (relative
   * to the root of the database).
   */
  get path() {
    return this._query.path.canonicalString();
  }
  /**
   * A reference to the containing `DocumentReference` if this is a
   * subcollection. If this isn't a subcollection, the reference is null.
   */
  get parent() {
    const e = this._path.popLast();
    return e.isEmpty() ? null : new DocumentReference(
      this.firestore,
      /* converter= */
      null,
      new DocumentKey(e)
    );
  }
  withConverter(e) {
    return new _CollectionReference(this.firestore, e, this._path);
  }
};
function collection(e, t, ...n) {
  if (e = getModularInstance(e), __PRIVATE_validateNonEmptyArgument("collection", "path", t), e instanceof Firestore$1) {
    const r2 = ResourcePath.fromString(t, ...n);
    return __PRIVATE_validateCollectionPath(r2), new CollectionReference(
      e,
      /* converter= */
      null,
      r2
    );
  }
  {
    if (!(e instanceof DocumentReference || e instanceof CollectionReference))
      throw new FirestoreError(D2.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
    const r2 = e._path.child(ResourcePath.fromString(t, ...n));
    return __PRIVATE_validateCollectionPath(r2), new CollectionReference(
      e.firestore,
      /* converter= */
      null,
      r2
    );
  }
}
function collectionGroup(e, t) {
  if (e = __PRIVATE_cast(e, Firestore$1), __PRIVATE_validateNonEmptyArgument("collectionGroup", "collection id", t), t.indexOf("/") >= 0)
    throw new FirestoreError(D2.INVALID_ARGUMENT, `Invalid collection ID '${t}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);
  return new Query(
    e,
    /* converter= */
    null,
    function __PRIVATE_newQueryForCollectionGroup(e2) {
      return new __PRIVATE_QueryImpl(ResourcePath.emptyPath(), e2);
    }(t)
  );
}
function doc(e, t, ...n) {
  if (e = getModularInstance(e), // We allow omission of 'pathString' but explicitly prohibit passing in both
  // 'undefined' and 'null'.
  1 === arguments.length && (t = __PRIVATE_AutoId.newId()), __PRIVATE_validateNonEmptyArgument("doc", "path", t), e instanceof Firestore$1) {
    const r2 = ResourcePath.fromString(t, ...n);
    return __PRIVATE_validateDocumentPath(r2), new DocumentReference(
      e,
      /* converter= */
      null,
      new DocumentKey(r2)
    );
  }
  {
    if (!(e instanceof DocumentReference || e instanceof CollectionReference))
      throw new FirestoreError(D2.INVALID_ARGUMENT, "Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");
    const r2 = e._path.child(ResourcePath.fromString(t, ...n));
    return __PRIVATE_validateDocumentPath(r2), new DocumentReference(e.firestore, e instanceof CollectionReference ? e.converter : null, new DocumentKey(r2));
  }
}
function refEqual(e, t) {
  return e = getModularInstance(e), t = getModularInstance(t), (e instanceof DocumentReference || e instanceof CollectionReference) && (t instanceof DocumentReference || t instanceof CollectionReference) && (e.firestore === t.firestore && e.path === t.path && e.converter === t.converter);
}
function queryEqual(e, t) {
  return e = getModularInstance(e), t = getModularInstance(t), e instanceof Query && t instanceof Query && (e.firestore === t.firestore && __PRIVATE_queryEquals(e._query, t._query) && e.converter === t.converter);
}
var __PRIVATE_AsyncQueueImpl = class {
  constructor() {
    this.Ja = Promise.resolve(), // A list of retryable operations. Retryable operations are run in order and
    // retried with backoff.
    this.Ya = [], // Is this AsyncQueue being shut down? Once it is set to true, it will not
    // be changed again.
    this.Za = false, // Operations scheduled to be queued in the future. Operations are
    // automatically removed after they are run or canceled.
    this.Xa = [], // visible for testing
    this.eu = null, // Flag set while there's an outstanding AsyncQueue operation, used for
    // assertion sanity-checks.
    this.tu = false, // Enabled during shutdown on Safari to prevent future access to IndexedDB.
    this.nu = false, // List of TimerIds to fast-forward delays for.
    this.ru = [], // Backoff timer used to schedule retries for retryable operations
    this.zo = new __PRIVATE_ExponentialBackoff(
      this,
      "async_queue_retry"
      /* TimerId.AsyncQueueRetry */
    ), // Visibility handler that triggers an immediate retry of all retryable
    // operations. Meant to speed up recovery when we regain file system access
    // after page comes into foreground.
    this.iu = () => {
      const e2 = getDocument();
      e2 && __PRIVATE_logDebug("AsyncQueue", "Visibility state changed to " + e2.visibilityState), this.zo.Qo();
    };
    const e = getDocument();
    e && "function" == typeof e.addEventListener && e.addEventListener("visibilitychange", this.iu);
  }
  get isShuttingDown() {
    return this.Za;
  }
  /**
   * Adds a new operation to the queue without waiting for it to complete (i.e.
   * we ignore the Promise result).
   */
  enqueueAndForget(e) {
    this.enqueue(e);
  }
  enqueueAndForgetEvenWhileRestricted(e) {
    this.su(), // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.ou(e);
  }
  enterRestrictedMode(e) {
    if (!this.Za) {
      this.Za = true, this.nu = e || false;
      const t = getDocument();
      t && "function" == typeof t.removeEventListener && t.removeEventListener("visibilitychange", this.iu);
    }
  }
  enqueue(e) {
    if (this.su(), this.Za)
      return new Promise(() => {
      });
    const t = new __PRIVATE_Deferred();
    return this.ou(() => this.Za && this.nu ? Promise.resolve() : (e().then(t.resolve, t.reject), t.promise)).then(() => t.promise);
  }
  enqueueRetryable(e) {
    this.enqueueAndForget(() => (this.Ya.push(e), this._u()));
  }
  /**
   * Runs the next operation from the retryable queue. If the operation fails,
   * reschedules with backoff.
   */
  _u() {
    return __async(this, null, function* () {
      if (0 !== this.Ya.length) {
        try {
          yield this.Ya[0](), this.Ya.shift(), this.zo.reset();
        } catch (e) {
          if (!__PRIVATE_isIndexedDbTransactionError(e))
            throw e;
          __PRIVATE_logDebug("AsyncQueue", "Operation failed with retryable error: " + e);
        }
        this.Ya.length > 0 && // If there are additional operations, we re-schedule `retryNextOp()`.
        // This is necessary to run retryable operations that failed during
        // their initial attempt since we don't know whether they are already
        // enqueued. If, for example, `op1`, `op2`, `op3` are enqueued and `op1`
        // needs to  be re-run, we will run `op1`, `op1`, `op2` using the
        // already enqueued calls to `retryNextOp()`. `op3()` will then run in the
        // call scheduled here.
        // Since `backoffAndRun()` cancels an existing backoff and schedules a
        // new backoff on every call, there is only ever a single additional
        // operation in the queue.
        this.zo.ko(() => this._u());
      }
    });
  }
  ou(e) {
    const t = this.Ja.then(() => (this.tu = true, e().catch((e2) => {
      this.eu = e2, this.tu = false;
      const t2 = (
        /**
        * Chrome includes Error.message in Error.stack. Other browsers do not.
        * This returns expected output of message + stack when available.
        * @param error - Error or FirestoreError
        */
        function __PRIVATE_getMessageOrStack(e3) {
          let t3 = e3.message || "";
          e3.stack && (t3 = e3.stack.includes(e3.message) ? e3.stack : e3.message + "\n" + e3.stack);
          return t3;
        }(e2)
      );
      throw __PRIVATE_logError("INTERNAL UNHANDLED ERROR: ", t2), e2;
    }).then((e2) => (this.tu = false, e2))));
    return this.Ja = t, t;
  }
  enqueueAfterDelay(e, t, n) {
    this.su(), // Fast-forward delays for timerIds that have been overriden.
    this.ru.indexOf(e) > -1 && (t = 0);
    const r2 = DelayedOperation.createAndSchedule(this, e, t, n, (e2) => this.au(e2));
    return this.Xa.push(r2), r2;
  }
  su() {
    this.eu && fail();
  }
  verifyOperationInProgress() {
  }
  /**
   * Waits until all currently queued tasks are finished executing. Delayed
   * operations are not run.
   */
  uu() {
    return __async(this, null, function* () {
      let e;
      do {
        e = this.Ja, yield e;
      } while (e !== this.Ja);
    });
  }
  /**
   * For Tests: Determine if a delayed operation with a particular TimerId
   * exists.
   */
  cu(e) {
    for (const t of this.Xa)
      if (t.timerId === e)
        return true;
    return false;
  }
  /**
   * For Tests: Runs some or all delayed operations early.
   *
   * @param lastTimerId - Delayed operations up to and including this TimerId
   * will be drained. Pass TimerId.All to run all delayed operations.
   * @returns a Promise that resolves once all operations have been run.
   */
  lu(e) {
    return this.uu().then(() => {
      this.Xa.sort((e2, t) => e2.targetTimeMs - t.targetTimeMs);
      for (const t of this.Xa)
        if (t.skipDelay(), "all" !== e && t.timerId === e)
          break;
      return this.uu();
    });
  }
  /**
   * For Tests: Skip all subsequent delays for a timer id.
   */
  hu(e) {
    this.ru.push(e);
  }
  /** Called once a DelayedOperation is run or canceled. */
  au(e) {
    const t = this.Xa.indexOf(e);
    this.Xa.splice(t, 1);
  }
};
function __PRIVATE_isPartialObserver(e) {
  return function __PRIVATE_implementsAnyMethods(e2, t) {
    if ("object" != typeof e2 || null === e2)
      return false;
    const n = e2;
    for (const e3 of t)
      if (e3 in n && "function" == typeof n[e3])
        return true;
    return false;
  }(e, ["next", "error", "complete"]);
}
var LoadBundleTask = class {
  constructor() {
    this._progressObserver = {}, this._taskCompletionResolver = new __PRIVATE_Deferred(), this._lastProgress = {
      taskState: "Running",
      totalBytes: 0,
      totalDocuments: 0,
      bytesLoaded: 0,
      documentsLoaded: 0
    };
  }
  /**
   * Registers functions to listen to bundle loading progress events.
   * @param next - Called when there is a progress update from bundle loading. Typically `next` calls occur
   *   each time a Firestore document is loaded from the bundle.
   * @param error - Called when an error occurs during bundle loading. The task aborts after reporting the
   *   error, and there should be no more updates after this.
   * @param complete - Called when the loading task is complete.
   */
  onProgress(e, t, n) {
    this._progressObserver = {
      next: e,
      error: t,
      complete: n
    };
  }
  /**
   * Implements the `Promise<LoadBundleTaskProgress>.catch` interface.
   *
   * @param onRejected - Called when an error occurs during bundle loading.
   */
  catch(e) {
    return this._taskCompletionResolver.promise.catch(e);
  }
  /**
   * Implements the `Promise<LoadBundleTaskProgress>.then` interface.
   *
   * @param onFulfilled - Called on the completion of the loading task with a final `LoadBundleTaskProgress` update.
   *   The update will always have its `taskState` set to `"Success"`.
   * @param onRejected - Called when an error occurs during bundle loading.
   */
  then(e, t) {
    return this._taskCompletionResolver.promise.then(e, t);
  }
  /**
   * Notifies all observers that bundle loading has completed, with a provided
   * `LoadBundleTaskProgress` object.
   *
   * @private
   */
  _completeWith(e) {
    this._updateProgress(e), this._progressObserver.complete && this._progressObserver.complete(), this._taskCompletionResolver.resolve(e);
  }
  /**
   * Notifies all observers that bundle loading has failed, with a provided
   * `Error` as the reason.
   *
   * @private
   */
  _failWith(e) {
    this._lastProgress.taskState = "Error", this._progressObserver.next && this._progressObserver.next(this._lastProgress), this._progressObserver.error && this._progressObserver.error(e), this._taskCompletionResolver.reject(e);
  }
  /**
   * Notifies a progress update of loading a bundle.
   * @param progress - The new progress.
   *
   * @private
   */
  _updateProgress(e) {
    this._lastProgress = e, this._progressObserver.next && this._progressObserver.next(e);
  }
};
var fe = -1;
var Firestore = class extends Firestore$1 {
  /** @hideconstructor */
  constructor(e, t, n, r2) {
    super(e, t, n, r2), /**
     * Whether it's a {@link Firestore} or Firestore Lite instance.
     */
    this.type = "firestore", this._queue = function __PRIVATE_newAsyncQueue() {
      return new __PRIVATE_AsyncQueueImpl();
    }(), this._persistenceKey = (null == r2 ? void 0 : r2.name) || "[DEFAULT]";
  }
  _terminate() {
    return this._firestoreClient || // The client must be initialized to ensure that all subsequent API
    // usage throws an exception.
    __PRIVATE_configureFirestore(this), this._firestoreClient.terminate();
  }
};
function initializeFirestore(e, t, n) {
  n || (n = "(default)");
  const r2 = _getProvider(e, "firestore");
  if (r2.isInitialized(n)) {
    const e2 = r2.getImmediate({
      identifier: n
    }), i = r2.getOptions(n);
    if (deepEqual(i, t))
      return e2;
    throw new FirestoreError(D2.FAILED_PRECONDITION, "initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.");
  }
  if (void 0 !== t.cacheSizeBytes && void 0 !== t.localCache)
    throw new FirestoreError(D2.INVALID_ARGUMENT, "cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");
  if (void 0 !== t.cacheSizeBytes && -1 !== t.cacheSizeBytes && t.cacheSizeBytes < 1048576)
    throw new FirestoreError(D2.INVALID_ARGUMENT, "cacheSizeBytes must be at least 1048576");
  return r2.initialize({
    options: t,
    instanceIdentifier: n
  });
}
function getFirestore(t, n) {
  const r2 = "object" == typeof t ? t : getApp(), i = "string" == typeof t ? t : n || "(default)", s = _getProvider(r2, "firestore").getImmediate({
    identifier: i
  });
  if (!s._initialized) {
    const e = getDefaultEmulatorHostnameAndPort("firestore");
    e && connectFirestoreEmulator(s, ...e);
  }
  return s;
}
function ensureFirestoreConfigured(e) {
  return e._firestoreClient || __PRIVATE_configureFirestore(e), e._firestoreClient.verifyNotTerminated(), e._firestoreClient;
}
function __PRIVATE_configureFirestore(e) {
  var t, n, r2;
  const i = e._freezeSettings(), s = function __PRIVATE_makeDatabaseInfo(e2, t2, n2, r3) {
    return new DatabaseInfo(e2, t2, n2, r3.host, r3.ssl, r3.experimentalForceLongPolling, r3.experimentalAutoDetectLongPolling, __PRIVATE_cloneLongPollingOptions(r3.experimentalLongPollingOptions), r3.useFetchStreams);
  }(e._databaseId, (null === (t = e._app) || void 0 === t ? void 0 : t.options.appId) || "", e._persistenceKey, i);
  e._firestoreClient = new FirestoreClient(e._authCredentials, e._appCheckCredentials, e._queue, s), (null === (n = i.localCache) || void 0 === n ? void 0 : n._offlineComponentProvider) && (null === (r2 = i.localCache) || void 0 === r2 ? void 0 : r2._onlineComponentProvider) && (e._firestoreClient._uninitializedComponentsProvider = {
    _offlineKind: i.localCache.kind,
    _offline: i.localCache._offlineComponentProvider,
    _online: i.localCache._onlineComponentProvider
  });
}
function enableIndexedDbPersistence(e, t) {
  __PRIVATE_verifyNotInitialized(e = __PRIVATE_cast(e, Firestore));
  const n = ensureFirestoreConfigured(e);
  if (n._uninitializedComponentsProvider)
    throw new FirestoreError(D2.FAILED_PRECONDITION, "SDK cache is already specified.");
  __PRIVATE_logWarn("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");
  const r2 = e._freezeSettings(), i = new OnlineComponentProvider();
  return __PRIVATE_setPersistenceProviders(n, i, new __PRIVATE_IndexedDbOfflineComponentProvider(i, r2.cacheSizeBytes, null == t ? void 0 : t.forceOwnership));
}
function enableMultiTabIndexedDbPersistence(e) {
  __PRIVATE_verifyNotInitialized(e = __PRIVATE_cast(e, Firestore));
  const t = ensureFirestoreConfigured(e);
  if (t._uninitializedComponentsProvider)
    throw new FirestoreError(D2.FAILED_PRECONDITION, "SDK cache is already specified.");
  __PRIVATE_logWarn("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");
  const n = e._freezeSettings(), r2 = new OnlineComponentProvider();
  return __PRIVATE_setPersistenceProviders(t, r2, new __PRIVATE_MultiTabOfflineComponentProvider(r2, n.cacheSizeBytes));
}
function __PRIVATE_setPersistenceProviders(e, t, n) {
  const r2 = new __PRIVATE_Deferred();
  return e.asyncQueue.enqueue(() => __async(this, null, function* () {
    try {
      yield __PRIVATE_setOfflineComponentProvider(e, n), yield __PRIVATE_setOnlineComponentProvider(e, t), r2.resolve();
    } catch (e2) {
      const t2 = e2;
      if (!__PRIVATE_canFallbackFromIndexedDbError(t2))
        throw t2;
      __PRIVATE_logWarn("Error enabling indexeddb cache. Falling back to memory cache: " + t2), r2.reject(t2);
    }
  })).then(() => r2.promise);
}
function clearIndexedDbPersistence(e) {
  if (e._initialized && !e._terminated)
    throw new FirestoreError(D2.FAILED_PRECONDITION, "Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");
  const t = new __PRIVATE_Deferred();
  return e._queue.enqueueAndForgetEvenWhileRestricted(() => __async(this, null, function* () {
    try {
      yield function __PRIVATE_indexedDbClearPersistence(e2) {
        return __async(this, null, function* () {
          if (!__PRIVATE_SimpleDb.D())
            return Promise.resolve();
          const t2 = e2 + "main";
          yield __PRIVATE_SimpleDb.delete(t2);
        });
      }(__PRIVATE_indexedDbStoragePrefix(e._databaseId, e._persistenceKey)), t.resolve();
    } catch (e2) {
      t.reject(e2);
    }
  })), t.promise;
}
function waitForPendingWrites(e) {
  return function __PRIVATE_firestoreClientWaitForPendingWrites(e2) {
    const t = new __PRIVATE_Deferred();
    return e2.asyncQueue.enqueueAndForget(() => __async(this, null, function* () {
      return __PRIVATE_syncEngineRegisterPendingWritesCallback(yield __PRIVATE_getSyncEngine(e2), t);
    })), t.promise;
  }(ensureFirestoreConfigured(e = __PRIVATE_cast(e, Firestore)));
}
function enableNetwork(e) {
  return __PRIVATE_firestoreClientEnableNetwork(ensureFirestoreConfigured(e = __PRIVATE_cast(e, Firestore)));
}
function disableNetwork(e) {
  return __PRIVATE_firestoreClientDisableNetwork(ensureFirestoreConfigured(e = __PRIVATE_cast(e, Firestore)));
}
function terminate(e) {
  return _removeServiceInstance(e.app, "firestore", e._databaseId.database), e._delete();
}
function loadBundle(e, t) {
  const n = ensureFirestoreConfigured(e = __PRIVATE_cast(e, Firestore)), r2 = new LoadBundleTask();
  return __PRIVATE_firestoreClientLoadBundle(n, e._databaseId, t, r2), r2;
}
function namedQuery(e, t) {
  return __PRIVATE_firestoreClientGetNamedQuery(ensureFirestoreConfigured(e = __PRIVATE_cast(e, Firestore)), t).then((t2) => t2 ? new Query(e, null, t2.query) : null);
}
function __PRIVATE_verifyNotInitialized(e) {
  if (e._initialized || e._terminated)
    throw new FirestoreError(D2.FAILED_PRECONDITION, "Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");
}
var AggregateField = class {
  /**
   * Create a new AggregateField<T>
   * @param aggregateType Specifies the type of aggregation operation to perform.
   * @param _internalFieldPath Optionally specifies the field that is aggregated.
   * @internal
   */
  constructor(e = "count", t) {
    this._internalFieldPath = t, /** A type string to uniquely identify instances of this class. */
    this.type = "AggregateField", this.aggregateType = e;
  }
};
var AggregateQuerySnapshot = class {
  /** @hideconstructor */
  constructor(e, t, n) {
    this._userDataWriter = t, this._data = n, /** A type string to uniquely identify instances of this class. */
    this.type = "AggregateQuerySnapshot", this.query = e;
  }
  /**
   * Returns the results of the aggregations performed over the underlying
   * query.
   *
   * The keys of the returned object will be the same as those of the
   * `AggregateSpec` object specified to the aggregation method, and the values
   * will be the corresponding aggregation result.
   *
   * @returns The results of the aggregations performed over the underlying
   * query.
   */
  data() {
    return this._userDataWriter.convertObjectMap(this._data);
  }
};
var Bytes = class _Bytes {
  /** @hideconstructor */
  constructor(e) {
    this._byteString = e;
  }
  /**
   * Creates a new `Bytes` object from the given Base64 string, converting it to
   * bytes.
   *
   * @param base64 - The Base64 string used to create the `Bytes` object.
   */
  static fromBase64String(e) {
    try {
      return new _Bytes(ByteString.fromBase64String(e));
    } catch (e2) {
      throw new FirestoreError(D2.INVALID_ARGUMENT, "Failed to construct data from Base64 string: " + e2);
    }
  }
  /**
   * Creates a new `Bytes` object from the given Uint8Array.
   *
   * @param array - The Uint8Array used to create the `Bytes` object.
   */
  static fromUint8Array(e) {
    return new _Bytes(ByteString.fromUint8Array(e));
  }
  /**
   * Returns the underlying bytes as a Base64-encoded string.
   *
   * @returns The Base64-encoded string created from the `Bytes` object.
   */
  toBase64() {
    return this._byteString.toBase64();
  }
  /**
   * Returns the underlying bytes in a new `Uint8Array`.
   *
   * @returns The Uint8Array created from the `Bytes` object.
   */
  toUint8Array() {
    return this._byteString.toUint8Array();
  }
  /**
   * Returns a string representation of the `Bytes` object.
   *
   * @returns A string representation of the `Bytes` object.
   */
  toString() {
    return "Bytes(base64: " + this.toBase64() + ")";
  }
  /**
   * Returns true if this `Bytes` object is equal to the provided one.
   *
   * @param other - The `Bytes` object to compare against.
   * @returns true if this `Bytes` object is equal to the provided one.
   */
  isEqual(e) {
    return this._byteString.isEqual(e._byteString);
  }
};
var FieldPath = class {
  /**
   * Creates a `FieldPath` from the provided field names. If more than one field
   * name is provided, the path will point to a nested field in a document.
   *
   * @param fieldNames - A list of field names.
   */
  constructor(...e) {
    for (let t = 0; t < e.length; ++t)
      if (0 === e[t].length)
        throw new FirestoreError(D2.INVALID_ARGUMENT, "Invalid field name at argument $(i + 1). Field names must not be empty.");
    this._internalPath = new FieldPath$1(e);
  }
  /**
   * Returns true if this `FieldPath` is equal to the provided one.
   *
   * @param other - The `FieldPath` to compare against.
   * @returns true if this `FieldPath` is equal to the provided one.
   */
  isEqual(e) {
    return this._internalPath.isEqual(e._internalPath);
  }
};
function documentId() {
  return new FieldPath("__name__");
}
var FieldValue = class {
  /**
   * @param _methodName - The public API endpoint that returns this class.
   * @hideconstructor
   */
  constructor(e) {
    this._methodName = e;
  }
};
var GeoPoint = class {
  /**
   * Creates a new immutable `GeoPoint` object with the provided latitude and
   * longitude values.
   * @param latitude - The latitude as number between -90 and 90.
   * @param longitude - The longitude as number between -180 and 180.
   */
  constructor(e, t) {
    if (!isFinite(e) || e < -90 || e > 90)
      throw new FirestoreError(D2.INVALID_ARGUMENT, "Latitude must be a number between -90 and 90, but was: " + e);
    if (!isFinite(t) || t < -180 || t > 180)
      throw new FirestoreError(D2.INVALID_ARGUMENT, "Longitude must be a number between -180 and 180, but was: " + t);
    this._lat = e, this._long = t;
  }
  /**
   * The latitude of this `GeoPoint` instance.
   */
  get latitude() {
    return this._lat;
  }
  /**
   * The longitude of this `GeoPoint` instance.
   */
  get longitude() {
    return this._long;
  }
  /**
   * Returns true if this `GeoPoint` is equal to the provided one.
   *
   * @param other - The `GeoPoint` to compare against.
   * @returns true if this `GeoPoint` is equal to the provided one.
   */
  isEqual(e) {
    return this._lat === e._lat && this._long === e._long;
  }
  /** Returns a JSON-serializable representation of this GeoPoint. */
  toJSON() {
    return {
      latitude: this._lat,
      longitude: this._long
    };
  }
  /**
   * Actually private to JS consumers of our API, so this function is prefixed
   * with an underscore.
   */
  _compareTo(e) {
    return __PRIVATE_primitiveComparator(this._lat, e._lat) || __PRIVATE_primitiveComparator(this._long, e._long);
  }
};
var ge = /^__.*__$/;
var ParsedSetData = class {
  constructor(e, t, n) {
    this.data = e, this.fieldMask = t, this.fieldTransforms = n;
  }
  toMutation(e, t) {
    return null !== this.fieldMask ? new __PRIVATE_PatchMutation(e, this.data, this.fieldMask, t, this.fieldTransforms) : new __PRIVATE_SetMutation(e, this.data, t, this.fieldTransforms);
  }
};
var ParsedUpdateData = class {
  constructor(e, t, n) {
    this.data = e, this.fieldMask = t, this.fieldTransforms = n;
  }
  toMutation(e, t) {
    return new __PRIVATE_PatchMutation(e, this.data, this.fieldMask, t, this.fieldTransforms);
  }
};
function __PRIVATE_isWrite(e) {
  switch (e) {
    case 0:
    case 2:
    case 1:
      return true;
    case 3:
    case 4:
      return false;
    default:
      throw fail();
  }
}
var __PRIVATE_ParseContextImpl = class ___PRIVATE_ParseContextImpl {
  /**
   * Initializes a ParseContext with the given source and path.
   *
   * @param settings - The settings for the parser.
   * @param databaseId - The database ID of the Firestore instance.
   * @param serializer - The serializer to use to generate the Value proto.
   * @param ignoreUndefinedProperties - Whether to ignore undefined properties
   * rather than throw.
   * @param fieldTransforms - A mutable list of field transforms encountered
   * while parsing the data.
   * @param fieldMask - A mutable list of field paths encountered while parsing
   * the data.
   *
   * TODO(b/34871131): We don't support array paths right now, so path can be
   * null to indicate the context represents any location within an array (in
   * which case certain features will not work and errors will be somewhat
   * compromised).
   */
  constructor(e, t, n, r2, i, s) {
    this.settings = e, this.databaseId = t, this.serializer = n, this.ignoreUndefinedProperties = r2, // Minor hack: If fieldTransforms is undefined, we assume this is an
    // external call and we need to validate the entire path.
    void 0 === i && this.Pu(), this.fieldTransforms = i || [], this.fieldMask = s || [];
  }
  get path() {
    return this.settings.path;
  }
  get Iu() {
    return this.settings.Iu;
  }
  /** Returns a new context with the specified settings overwritten. */
  Tu(e) {
    return new ___PRIVATE_ParseContextImpl(Object.assign(Object.assign({}, this.settings), e), this.databaseId, this.serializer, this.ignoreUndefinedProperties, this.fieldTransforms, this.fieldMask);
  }
  Eu(e) {
    var t;
    const n = null === (t = this.path) || void 0 === t ? void 0 : t.child(e), r2 = this.Tu({
      path: n,
      du: false
    });
    return r2.Au(e), r2;
  }
  Ru(e) {
    var t;
    const n = null === (t = this.path) || void 0 === t ? void 0 : t.child(e), r2 = this.Tu({
      path: n,
      du: false
    });
    return r2.Pu(), r2;
  }
  Vu(e) {
    return this.Tu({
      path: void 0,
      du: true
    });
  }
  mu(e) {
    return __PRIVATE_createError(e, this.settings.methodName, this.settings.fu || false, this.path, this.settings.gu);
  }
  /** Returns 'true' if 'fieldPath' was traversed when creating this context. */
  contains(e) {
    return void 0 !== this.fieldMask.find((t) => e.isPrefixOf(t)) || void 0 !== this.fieldTransforms.find((t) => e.isPrefixOf(t.field));
  }
  Pu() {
    if (this.path)
      for (let e = 0; e < this.path.length; e++)
        this.Au(this.path.get(e));
  }
  Au(e) {
    if (0 === e.length)
      throw this.mu("Document fields must not be empty");
    if (__PRIVATE_isWrite(this.Iu) && ge.test(e))
      throw this.mu('Document fields cannot begin and end with "__"');
  }
};
var __PRIVATE_UserDataReader = class {
  constructor(e, t, n) {
    this.databaseId = e, this.ignoreUndefinedProperties = t, this.serializer = n || __PRIVATE_newSerializer(e);
  }
  /** Creates a new top-level parse context. */
  pu(e, t, n, r2 = false) {
    return new __PRIVATE_ParseContextImpl({
      Iu: e,
      methodName: t,
      gu: n,
      path: FieldPath$1.emptyPath(),
      du: false,
      fu: r2
    }, this.databaseId, this.serializer, this.ignoreUndefinedProperties);
  }
};
function __PRIVATE_newUserDataReader(e) {
  const t = e._freezeSettings(), n = __PRIVATE_newSerializer(e._databaseId);
  return new __PRIVATE_UserDataReader(e._databaseId, !!t.ignoreUndefinedProperties, n);
}
function __PRIVATE_parseSetData(e, t, n, r2, i, s = {}) {
  const o = e.pu(s.merge || s.mergeFields ? 2 : 0, t, n, i);
  __PRIVATE_validatePlainObject("Data must be an object, but it was:", o, r2);
  const _ = __PRIVATE_parseObject(r2, o);
  let a, u;
  if (s.merge)
    a = new FieldMask(o.fieldMask), u = o.fieldTransforms;
  else if (s.mergeFields) {
    const e2 = [];
    for (const r3 of s.mergeFields) {
      const i2 = __PRIVATE_fieldPathFromArgument$1(t, r3, n);
      if (!o.contains(i2))
        throw new FirestoreError(D2.INVALID_ARGUMENT, `Field '${i2}' is specified in your field mask but missing from your input data.`);
      __PRIVATE_fieldMaskContains(e2, i2) || e2.push(i2);
    }
    a = new FieldMask(e2), u = o.fieldTransforms.filter((e3) => a.covers(e3.field));
  } else
    a = null, u = o.fieldTransforms;
  return new ParsedSetData(new ObjectValue(_), a, u);
}
var __PRIVATE_DeleteFieldValueImpl = class ___PRIVATE_DeleteFieldValueImpl extends FieldValue {
  _toFieldTransform(e) {
    if (2 !== e.Iu)
      throw 1 === e.Iu ? e.mu(`${this._methodName}() can only appear at the top level of your update data`) : e.mu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);
    return e.fieldMask.push(e.path), null;
  }
  isEqual(e) {
    return e instanceof ___PRIVATE_DeleteFieldValueImpl;
  }
};
function __PRIVATE_createSentinelChildContext(e, t, n) {
  return new __PRIVATE_ParseContextImpl({
    Iu: 3,
    gu: t.settings.gu,
    methodName: e._methodName,
    du: n
  }, t.databaseId, t.serializer, t.ignoreUndefinedProperties);
}
var __PRIVATE_ServerTimestampFieldValueImpl = class ___PRIVATE_ServerTimestampFieldValueImpl extends FieldValue {
  _toFieldTransform(e) {
    return new FieldTransform(e.path, new __PRIVATE_ServerTimestampTransform());
  }
  isEqual(e) {
    return e instanceof ___PRIVATE_ServerTimestampFieldValueImpl;
  }
};
var __PRIVATE_ArrayUnionFieldValueImpl = class extends FieldValue {
  constructor(e, t) {
    super(e), this.yu = t;
  }
  _toFieldTransform(e) {
    const t = __PRIVATE_createSentinelChildContext(
      this,
      e,
      /*array=*/
      true
    ), n = this.yu.map((e2) => __PRIVATE_parseData(e2, t)), r2 = new __PRIVATE_ArrayUnionTransformOperation(n);
    return new FieldTransform(e.path, r2);
  }
  isEqual(e) {
    return this === e;
  }
};
var __PRIVATE_ArrayRemoveFieldValueImpl = class extends FieldValue {
  constructor(e, t) {
    super(e), this.yu = t;
  }
  _toFieldTransform(e) {
    const t = __PRIVATE_createSentinelChildContext(
      this,
      e,
      /*array=*/
      true
    ), n = this.yu.map((e2) => __PRIVATE_parseData(e2, t)), r2 = new __PRIVATE_ArrayRemoveTransformOperation(n);
    return new FieldTransform(e.path, r2);
  }
  isEqual(e) {
    return this === e;
  }
};
var __PRIVATE_NumericIncrementFieldValueImpl = class extends FieldValue {
  constructor(e, t) {
    super(e), this.wu = t;
  }
  _toFieldTransform(e) {
    const t = new __PRIVATE_NumericIncrementTransformOperation(e.serializer, toNumber(e.serializer, this.wu));
    return new FieldTransform(e.path, t);
  }
  isEqual(e) {
    return this === e;
  }
};
function __PRIVATE_parseUpdateData(e, t, n, r2) {
  const i = e.pu(1, t, n);
  __PRIVATE_validatePlainObject("Data must be an object, but it was:", i, r2);
  const s = [], o = ObjectValue.empty();
  forEach(r2, (e2, r3) => {
    const _2 = __PRIVATE_fieldPathFromDotSeparatedString(t, e2, n);
    r3 = getModularInstance(r3);
    const a = i.Ru(_2);
    if (r3 instanceof __PRIVATE_DeleteFieldValueImpl)
      s.push(_2);
    else {
      const e3 = __PRIVATE_parseData(r3, a);
      null != e3 && (s.push(_2), o.set(_2, e3));
    }
  });
  const _ = new FieldMask(s);
  return new ParsedUpdateData(o, _, i.fieldTransforms);
}
function __PRIVATE_parseUpdateVarargs(e, t, n, r2, i, s) {
  const o = e.pu(1, t, n), _ = [__PRIVATE_fieldPathFromArgument$1(t, r2, n)], a = [i];
  if (s.length % 2 != 0)
    throw new FirestoreError(D2.INVALID_ARGUMENT, `Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);
  for (let e2 = 0; e2 < s.length; e2 += 2)
    _.push(__PRIVATE_fieldPathFromArgument$1(t, s[e2])), a.push(s[e2 + 1]);
  const u = [], c = ObjectValue.empty();
  for (let e2 = _.length - 1; e2 >= 0; --e2)
    if (!__PRIVATE_fieldMaskContains(u, _[e2])) {
      const t2 = _[e2];
      let n2 = a[e2];
      n2 = getModularInstance(n2);
      const r3 = o.Ru(t2);
      if (n2 instanceof __PRIVATE_DeleteFieldValueImpl)
        u.push(t2);
      else {
        const e3 = __PRIVATE_parseData(n2, r3);
        null != e3 && (u.push(t2), c.set(t2, e3));
      }
    }
  const l2 = new FieldMask(u);
  return new ParsedUpdateData(c, l2, o.fieldTransforms);
}
function __PRIVATE_parseQueryValue(e, t, n, r2 = false) {
  return __PRIVATE_parseData(n, e.pu(r2 ? 4 : 3, t));
}
function __PRIVATE_parseData(e, t) {
  if (__PRIVATE_looksLikeJsonObject(
    // Unwrap the API type from the Compat SDK. This will return the API type
    // from firestore-exp.
    e = getModularInstance(e)
  ))
    return __PRIVATE_validatePlainObject("Unsupported field value:", t, e), __PRIVATE_parseObject(e, t);
  if (e instanceof FieldValue)
    return function __PRIVATE_parseSentinelFieldValue(e2, t2) {
      if (!__PRIVATE_isWrite(t2.Iu))
        throw t2.mu(`${e2._methodName}() can only be used with update() and set()`);
      if (!t2.path)
        throw t2.mu(`${e2._methodName}() is not currently supported inside arrays`);
      const n = e2._toFieldTransform(t2);
      n && t2.fieldTransforms.push(n);
    }(e, t), null;
  if (void 0 === e && t.ignoreUndefinedProperties)
    return null;
  if (
    // If context.path is null we are inside an array and we don't support
    // field mask paths more granular than the top-level array.
    t.path && t.fieldMask.push(t.path), e instanceof Array
  ) {
    if (t.settings.du && 4 !== t.Iu)
      throw t.mu("Nested arrays are not supported");
    return function __PRIVATE_parseArray(e2, t2) {
      const n = [];
      let r2 = 0;
      for (const i of e2) {
        let e3 = __PRIVATE_parseData(i, t2.Vu(r2));
        null == e3 && // Just include nulls in the array for fields being replaced with a
        // sentinel.
        (e3 = {
          nullValue: "NULL_VALUE"
        }), n.push(e3), r2++;
      }
      return {
        arrayValue: {
          values: n
        }
      };
    }(e, t);
  }
  return function __PRIVATE_parseScalarValue(e2, t2) {
    if (null === (e2 = getModularInstance(e2)))
      return {
        nullValue: "NULL_VALUE"
      };
    if ("number" == typeof e2)
      return toNumber(t2.serializer, e2);
    if ("boolean" == typeof e2)
      return {
        booleanValue: e2
      };
    if ("string" == typeof e2)
      return {
        stringValue: e2
      };
    if (e2 instanceof Date) {
      const n = Timestamp.fromDate(e2);
      return {
        timestampValue: toTimestamp(t2.serializer, n)
      };
    }
    if (e2 instanceof Timestamp) {
      const n = new Timestamp(e2.seconds, 1e3 * Math.floor(e2.nanoseconds / 1e3));
      return {
        timestampValue: toTimestamp(t2.serializer, n)
      };
    }
    if (e2 instanceof GeoPoint)
      return {
        geoPointValue: {
          latitude: e2.latitude,
          longitude: e2.longitude
        }
      };
    if (e2 instanceof Bytes)
      return {
        bytesValue: __PRIVATE_toBytes(t2.serializer, e2._byteString)
      };
    if (e2 instanceof DocumentReference) {
      const n = t2.databaseId, r2 = e2.firestore._databaseId;
      if (!r2.isEqual(n))
        throw t2.mu(`Document reference is for database ${r2.projectId}/${r2.database} but should be for database ${n.projectId}/${n.database}`);
      return {
        referenceValue: __PRIVATE_toResourceName(e2.firestore._databaseId || t2.databaseId, e2._key.path)
      };
    }
    throw t2.mu(`Unsupported field value: ${__PRIVATE_valueDescription(e2)}`);
  }(e, t);
}
function __PRIVATE_parseObject(e, t) {
  const n = {};
  return isEmpty2(e) ? (
    // If we encounter an empty object, we explicitly add it to the update
    // mask to ensure that the server creates a map entry.
    t.path && t.path.length > 0 && t.fieldMask.push(t.path)
  ) : forEach(e, (e2, r2) => {
    const i = __PRIVATE_parseData(r2, t.Eu(e2));
    null != i && (n[e2] = i);
  }), {
    mapValue: {
      fields: n
    }
  };
}
function __PRIVATE_looksLikeJsonObject(e) {
  return !("object" != typeof e || null === e || e instanceof Array || e instanceof Date || e instanceof Timestamp || e instanceof GeoPoint || e instanceof Bytes || e instanceof DocumentReference || e instanceof FieldValue);
}
function __PRIVATE_validatePlainObject(e, t, n) {
  if (!__PRIVATE_looksLikeJsonObject(n) || !function __PRIVATE_isPlainObject(e2) {
    return "object" == typeof e2 && null !== e2 && (Object.getPrototypeOf(e2) === Object.prototype || null === Object.getPrototypeOf(e2));
  }(n)) {
    const r2 = __PRIVATE_valueDescription(n);
    throw "an object" === r2 ? t.mu(e + " a custom object") : t.mu(e + " " + r2);
  }
}
function __PRIVATE_fieldPathFromArgument$1(e, t, n) {
  if (
    // If required, replace the FieldPath Compat class with with the firestore-exp
    // FieldPath.
    (t = getModularInstance(t)) instanceof FieldPath
  )
    return t._internalPath;
  if ("string" == typeof t)
    return __PRIVATE_fieldPathFromDotSeparatedString(e, t);
  throw __PRIVATE_createError(
    "Field path arguments must be of type string or ",
    e,
    /* hasConverter= */
    false,
    /* path= */
    void 0,
    n
  );
}
var pe = new RegExp("[~\\*/\\[\\]]");
function __PRIVATE_fieldPathFromDotSeparatedString(e, t, n) {
  if (t.search(pe) >= 0)
    throw __PRIVATE_createError(
      `Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,
      e,
      /* hasConverter= */
      false,
      /* path= */
      void 0,
      n
    );
  try {
    return new FieldPath(...t.split("."))._internalPath;
  } catch (r2) {
    throw __PRIVATE_createError(
      `Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,
      e,
      /* hasConverter= */
      false,
      /* path= */
      void 0,
      n
    );
  }
}
function __PRIVATE_createError(e, t, n, r2, i) {
  const s = r2 && !r2.isEmpty(), o = void 0 !== i;
  let _ = `Function ${t}() called with invalid data`;
  n && (_ += " (via `toFirestore()`)"), _ += ". ";
  let a = "";
  return (s || o) && (a += " (found", s && (a += ` in field ${r2}`), o && (a += ` in document ${i}`), a += ")"), new FirestoreError(D2.INVALID_ARGUMENT, _ + e + a);
}
function __PRIVATE_fieldMaskContains(e, t) {
  return e.some((e2) => e2.isEqual(t));
}
var DocumentSnapshot$1 = class {
  // Note: This class is stripped down version of the DocumentSnapshot in
  // the legacy SDK. The changes are:
  // - No support for SnapshotMetadata.
  // - No support for SnapshotOptions.
  /** @hideconstructor protected */
  constructor(e, t, n, r2, i) {
    this._firestore = e, this._userDataWriter = t, this._key = n, this._document = r2, this._converter = i;
  }
  /** Property of the `DocumentSnapshot` that provides the document's ID. */
  get id() {
    return this._key.path.lastSegment();
  }
  /**
   * The `DocumentReference` for the document included in the `DocumentSnapshot`.
   */
  get ref() {
    return new DocumentReference(this._firestore, this._converter, this._key);
  }
  /**
   * Signals whether or not the document at the snapshot's location exists.
   *
   * @returns true if the document exists.
   */
  exists() {
    return null !== this._document;
  }
  /**
   * Retrieves all fields in the document as an `Object`. Returns `undefined` if
   * the document doesn't exist.
   *
   * @returns An `Object` containing all fields in the document or `undefined`
   * if the document doesn't exist.
   */
  data() {
    if (this._document) {
      if (this._converter) {
        const e = new QueryDocumentSnapshot$1(
          this._firestore,
          this._userDataWriter,
          this._key,
          this._document,
          /* converter= */
          null
        );
        return this._converter.fromFirestore(e);
      }
      return this._userDataWriter.convertValue(this._document.data.value);
    }
  }
  /**
   * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
   * document or field doesn't exist.
   *
   * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
   * field.
   * @returns The data at the specified field location or undefined if no such
   * field exists in the document.
   */
  // We are using `any` here to avoid an explicit cast by our users.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(e) {
    if (this._document) {
      const t = this._document.data.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", e));
      if (null !== t)
        return this._userDataWriter.convertValue(t);
    }
  }
};
var QueryDocumentSnapshot$1 = class extends DocumentSnapshot$1 {
  /**
   * Retrieves all fields in the document as an `Object`.
   *
   * @override
   * @returns An `Object` containing all fields in the document.
   */
  data() {
    return super.data();
  }
};
function __PRIVATE_fieldPathFromArgument(e, t) {
  return "string" == typeof t ? __PRIVATE_fieldPathFromDotSeparatedString(e, t) : t instanceof FieldPath ? t._internalPath : t._delegate._internalPath;
}
function __PRIVATE_validateHasExplicitOrderByForLimitToLast(e) {
  if ("L" === e.limitType && 0 === e.explicitOrderBy.length)
    throw new FirestoreError(D2.UNIMPLEMENTED, "limitToLast() queries require specifying at least one orderBy() clause");
}
var AppliableConstraint = class {
};
var QueryConstraint = class extends AppliableConstraint {
};
function query(e, t, ...n) {
  let r2 = [];
  t instanceof AppliableConstraint && r2.push(t), r2 = r2.concat(n), function __PRIVATE_validateQueryConstraintArray(e2) {
    const t2 = e2.filter((e3) => e3 instanceof QueryCompositeFilterConstraint).length, n2 = e2.filter((e3) => e3 instanceof QueryFieldFilterConstraint).length;
    if (t2 > 1 || t2 > 0 && n2 > 0)
      throw new FirestoreError(D2.INVALID_ARGUMENT, "InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.");
  }(r2);
  for (const t2 of r2)
    e = t2._apply(e);
  return e;
}
var QueryFieldFilterConstraint = class _QueryFieldFilterConstraint extends QueryConstraint {
  /**
   * @internal
   */
  constructor(e, t, n) {
    super(), this._field = e, this._op = t, this._value = n, /** The type of this query constraint */
    this.type = "where";
  }
  static _create(e, t, n) {
    return new _QueryFieldFilterConstraint(e, t, n);
  }
  _apply(e) {
    const t = this._parse(e);
    return __PRIVATE_validateNewFieldFilter(e._query, t), new Query(e.firestore, e.converter, __PRIVATE_queryWithAddedFilter(e._query, t));
  }
  _parse(e) {
    const t = __PRIVATE_newUserDataReader(e.firestore), n = function __PRIVATE_newQueryFilter(e2, t2, n2, r2, i, s, o) {
      let _;
      if (i.isKeyField()) {
        if ("array-contains" === s || "array-contains-any" === s)
          throw new FirestoreError(D2.INVALID_ARGUMENT, `Invalid Query. You can't perform '${s}' queries on documentId().`);
        if ("in" === s || "not-in" === s) {
          __PRIVATE_validateDisjunctiveFilterElements(o, s);
          const t3 = [];
          for (const n3 of o)
            t3.push(__PRIVATE_parseDocumentIdValue(r2, e2, n3));
          _ = {
            arrayValue: {
              values: t3
            }
          };
        } else
          _ = __PRIVATE_parseDocumentIdValue(r2, e2, o);
      } else
        "in" !== s && "not-in" !== s && "array-contains-any" !== s || __PRIVATE_validateDisjunctiveFilterElements(o, s), _ = __PRIVATE_parseQueryValue(
          n2,
          t2,
          o,
          /* allowArrays= */
          "in" === s || "not-in" === s
        );
      return FieldFilter.create(i, s, _);
    }(e._query, "where", t, e.firestore._databaseId, this._field, this._op, this._value);
    return n;
  }
};
function where(e, t, n) {
  const r2 = t, i = __PRIVATE_fieldPathFromArgument("where", e);
  return QueryFieldFilterConstraint._create(i, r2, n);
}
var QueryCompositeFilterConstraint = class _QueryCompositeFilterConstraint extends AppliableConstraint {
  /**
   * @internal
   */
  constructor(e, t) {
    super(), this.type = e, this._queryConstraints = t;
  }
  static _create(e, t) {
    return new _QueryCompositeFilterConstraint(e, t);
  }
  _parse(e) {
    const t = this._queryConstraints.map((t2) => t2._parse(e)).filter((e2) => e2.getFilters().length > 0);
    return 1 === t.length ? t[0] : CompositeFilter.create(t, this._getOperator());
  }
  _apply(e) {
    const t = this._parse(e);
    return 0 === t.getFilters().length ? e : (function __PRIVATE_validateNewFilter(e2, t2) {
      let n = e2;
      const r2 = t2.getFlattenedFilters();
      for (const e3 of r2)
        __PRIVATE_validateNewFieldFilter(n, e3), n = __PRIVATE_queryWithAddedFilter(n, e3);
    }(e._query, t), new Query(e.firestore, e.converter, __PRIVATE_queryWithAddedFilter(e._query, t)));
  }
  _getQueryConstraints() {
    return this._queryConstraints;
  }
  _getOperator() {
    return "and" === this.type ? "and" : "or";
  }
};
function or(...e) {
  return e.forEach((e2) => __PRIVATE_validateQueryFilterConstraint("or", e2)), QueryCompositeFilterConstraint._create("or", e);
}
function and(...e) {
  return e.forEach((e2) => __PRIVATE_validateQueryFilterConstraint("and", e2)), QueryCompositeFilterConstraint._create("and", e);
}
var QueryOrderByConstraint = class _QueryOrderByConstraint extends QueryConstraint {
  /**
   * @internal
   */
  constructor(e, t) {
    super(), this._field = e, this._direction = t, /** The type of this query constraint */
    this.type = "orderBy";
  }
  static _create(e, t) {
    return new _QueryOrderByConstraint(e, t);
  }
  _apply(e) {
    const t = function __PRIVATE_newQueryOrderBy(e2, t2, n) {
      if (null !== e2.startAt)
        throw new FirestoreError(D2.INVALID_ARGUMENT, "Invalid query. You must not call startAt() or startAfter() before calling orderBy().");
      if (null !== e2.endAt)
        throw new FirestoreError(D2.INVALID_ARGUMENT, "Invalid query. You must not call endAt() or endBefore() before calling orderBy().");
      return new OrderBy(t2, n);
    }(e._query, this._field, this._direction);
    return new Query(e.firestore, e.converter, function __PRIVATE_queryWithAddedOrderBy(e2, t2) {
      const n = e2.explicitOrderBy.concat([t2]);
      return new __PRIVATE_QueryImpl(e2.path, e2.collectionGroup, n, e2.filters.slice(), e2.limit, e2.limitType, e2.startAt, e2.endAt);
    }(e._query, t));
  }
};
function orderBy(e, t = "asc") {
  const n = t, r2 = __PRIVATE_fieldPathFromArgument("orderBy", e);
  return QueryOrderByConstraint._create(r2, n);
}
var QueryLimitConstraint = class _QueryLimitConstraint extends QueryConstraint {
  /**
   * @internal
   */
  constructor(e, t, n) {
    super(), this.type = e, this._limit = t, this._limitType = n;
  }
  static _create(e, t, n) {
    return new _QueryLimitConstraint(e, t, n);
  }
  _apply(e) {
    return new Query(e.firestore, e.converter, __PRIVATE_queryWithLimit(e._query, this._limit, this._limitType));
  }
};
function limit(e) {
  return __PRIVATE_validatePositiveNumber("limit", e), QueryLimitConstraint._create(
    "limit",
    e,
    "F"
    /* LimitType.First */
  );
}
function limitToLast(e) {
  return __PRIVATE_validatePositiveNumber("limitToLast", e), QueryLimitConstraint._create(
    "limitToLast",
    e,
    "L"
    /* LimitType.Last */
  );
}
var QueryStartAtConstraint = class _QueryStartAtConstraint extends QueryConstraint {
  /**
   * @internal
   */
  constructor(e, t, n) {
    super(), this.type = e, this._docOrFields = t, this._inclusive = n;
  }
  static _create(e, t, n) {
    return new _QueryStartAtConstraint(e, t, n);
  }
  _apply(e) {
    const t = __PRIVATE_newQueryBoundFromDocOrFields(e, this.type, this._docOrFields, this._inclusive);
    return new Query(e.firestore, e.converter, function __PRIVATE_queryWithStartAt(e2, t2) {
      return new __PRIVATE_QueryImpl(e2.path, e2.collectionGroup, e2.explicitOrderBy.slice(), e2.filters.slice(), e2.limit, e2.limitType, t2, e2.endAt);
    }(e._query, t));
  }
};
function startAt(...e) {
  return QueryStartAtConstraint._create(
    "startAt",
    e,
    /*inclusive=*/
    true
  );
}
function startAfter(...e) {
  return QueryStartAtConstraint._create(
    "startAfter",
    e,
    /*inclusive=*/
    false
  );
}
var QueryEndAtConstraint = class _QueryEndAtConstraint extends QueryConstraint {
  /**
   * @internal
   */
  constructor(e, t, n) {
    super(), this.type = e, this._docOrFields = t, this._inclusive = n;
  }
  static _create(e, t, n) {
    return new _QueryEndAtConstraint(e, t, n);
  }
  _apply(e) {
    const t = __PRIVATE_newQueryBoundFromDocOrFields(e, this.type, this._docOrFields, this._inclusive);
    return new Query(e.firestore, e.converter, function __PRIVATE_queryWithEndAt(e2, t2) {
      return new __PRIVATE_QueryImpl(e2.path, e2.collectionGroup, e2.explicitOrderBy.slice(), e2.filters.slice(), e2.limit, e2.limitType, e2.startAt, t2);
    }(e._query, t));
  }
};
function endBefore(...e) {
  return QueryEndAtConstraint._create(
    "endBefore",
    e,
    /*inclusive=*/
    false
  );
}
function endAt(...e) {
  return QueryEndAtConstraint._create(
    "endAt",
    e,
    /*inclusive=*/
    true
  );
}
function __PRIVATE_newQueryBoundFromDocOrFields(e, t, n, r2) {
  if (n[0] = getModularInstance(n[0]), n[0] instanceof DocumentSnapshot$1)
    return function __PRIVATE_newQueryBoundFromDocument(e2, t2, n2, r3, i) {
      if (!r3)
        throw new FirestoreError(D2.NOT_FOUND, `Can't use a DocumentSnapshot that doesn't exist for ${n2}().`);
      const s = [];
      for (const n3 of __PRIVATE_queryNormalizedOrderBy(e2))
        if (n3.field.isKeyField())
          s.push(__PRIVATE_refValue(t2, r3.key));
        else {
          const e3 = r3.data.field(n3.field);
          if (__PRIVATE_isServerTimestamp(e3))
            throw new FirestoreError(D2.INVALID_ARGUMENT, 'Invalid query. You are trying to start or end a query using a document for which the field "' + n3.field + '" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');
          if (null === e3) {
            const e4 = n3.field.canonicalString();
            throw new FirestoreError(D2.INVALID_ARGUMENT, `Invalid query. You are trying to start or end a query using a document for which the field '${e4}' (used as the orderBy) does not exist.`);
          }
          s.push(e3);
        }
      return new Bound(s, i);
    }(e._query, e.firestore._databaseId, t, n[0]._document, r2);
  {
    const i = __PRIVATE_newUserDataReader(e.firestore);
    return function __PRIVATE_newQueryBoundFromFields(e2, t2, n2, r3, i2, s) {
      const o = e2.explicitOrderBy;
      if (i2.length > o.length)
        throw new FirestoreError(D2.INVALID_ARGUMENT, `Too many arguments provided to ${r3}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);
      const _ = [];
      for (let s2 = 0; s2 < i2.length; s2++) {
        const a = i2[s2];
        if (o[s2].field.isKeyField()) {
          if ("string" != typeof a)
            throw new FirestoreError(D2.INVALID_ARGUMENT, `Invalid query. Expected a string for document ID in ${r3}(), but got a ${typeof a}`);
          if (!__PRIVATE_isCollectionGroupQuery(e2) && -1 !== a.indexOf("/"))
            throw new FirestoreError(D2.INVALID_ARGUMENT, `Invalid query. When querying a collection and ordering by documentId(), the value passed to ${r3}() must be a plain document ID, but '${a}' contains a slash.`);
          const n3 = e2.path.child(ResourcePath.fromString(a));
          if (!DocumentKey.isDocumentKey(n3))
            throw new FirestoreError(D2.INVALID_ARGUMENT, `Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${r3}() must result in a valid document path, but '${n3}' is not because it contains an odd number of segments.`);
          const i3 = new DocumentKey(n3);
          _.push(__PRIVATE_refValue(t2, i3));
        } else {
          const e3 = __PRIVATE_parseQueryValue(n2, r3, a);
          _.push(e3);
        }
      }
      return new Bound(_, s);
    }(e._query, e.firestore._databaseId, i, t, n, r2);
  }
}
function __PRIVATE_parseDocumentIdValue(e, t, n) {
  if ("string" == typeof (n = getModularInstance(n))) {
    if ("" === n)
      throw new FirestoreError(D2.INVALID_ARGUMENT, "Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");
    if (!__PRIVATE_isCollectionGroupQuery(t) && -1 !== n.indexOf("/"))
      throw new FirestoreError(D2.INVALID_ARGUMENT, `Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);
    const r2 = t.path.child(ResourcePath.fromString(n));
    if (!DocumentKey.isDocumentKey(r2))
      throw new FirestoreError(D2.INVALID_ARGUMENT, `Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r2}' is not because it has an odd number of segments (${r2.length}).`);
    return __PRIVATE_refValue(e, new DocumentKey(r2));
  }
  if (n instanceof DocumentReference)
    return __PRIVATE_refValue(e, n._key);
  throw new FirestoreError(D2.INVALID_ARGUMENT, `Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${__PRIVATE_valueDescription(n)}.`);
}
function __PRIVATE_validateDisjunctiveFilterElements(e, t) {
  if (!Array.isArray(e) || 0 === e.length)
    throw new FirestoreError(D2.INVALID_ARGUMENT, `Invalid Query. A non-empty array is required for '${t.toString()}' filters.`);
}
function __PRIVATE_validateNewFieldFilter(e, t) {
  const n = function __PRIVATE_findOpInsideFilters(e2, t2) {
    for (const n2 of e2)
      for (const e3 of n2.getFlattenedFilters())
        if (t2.indexOf(e3.op) >= 0)
          return e3.op;
    return null;
  }(e.filters, function __PRIVATE_conflictingOps(e2) {
    switch (e2) {
      case "!=":
        return [
          "!=",
          "not-in"
          /* Operator.NOT_IN */
        ];
      case "array-contains-any":
      case "in":
        return [
          "not-in"
          /* Operator.NOT_IN */
        ];
      case "not-in":
        return [
          "array-contains-any",
          "in",
          "not-in",
          "!="
          /* Operator.NOT_EQUAL */
        ];
      default:
        return [];
    }
  }(t.op));
  if (null !== n)
    throw n === t.op ? new FirestoreError(D2.INVALID_ARGUMENT, `Invalid query. You cannot use more than one '${t.op.toString()}' filter.`) : new FirestoreError(D2.INVALID_ARGUMENT, `Invalid query. You cannot use '${t.op.toString()}' filters with '${n.toString()}' filters.`);
}
function __PRIVATE_validateQueryFilterConstraint(e, t) {
  if (!(t instanceof QueryFieldFilterConstraint || t instanceof QueryCompositeFilterConstraint))
    throw new FirestoreError(D2.INVALID_ARGUMENT, `Function ${e}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`);
}
var AbstractUserDataWriter = class {
  convertValue(e, t = "none") {
    switch (__PRIVATE_typeOrder(e)) {
      case 0:
        return null;
      case 1:
        return e.booleanValue;
      case 2:
        return __PRIVATE_normalizeNumber(e.integerValue || e.doubleValue);
      case 3:
        return this.convertTimestamp(e.timestampValue);
      case 4:
        return this.convertServerTimestamp(e, t);
      case 5:
        return e.stringValue;
      case 6:
        return this.convertBytes(__PRIVATE_normalizeByteString(e.bytesValue));
      case 7:
        return this.convertReference(e.referenceValue);
      case 8:
        return this.convertGeoPoint(e.geoPointValue);
      case 9:
        return this.convertArray(e.arrayValue, t);
      case 10:
        return this.convertObject(e.mapValue, t);
      default:
        throw fail();
    }
  }
  convertObject(e, t) {
    return this.convertObjectMap(e.fields, t);
  }
  /**
   * @internal
   */
  convertObjectMap(e, t = "none") {
    const n = {};
    return forEach(e, (e2, r2) => {
      n[e2] = this.convertValue(r2, t);
    }), n;
  }
  convertGeoPoint(e) {
    return new GeoPoint(__PRIVATE_normalizeNumber(e.latitude), __PRIVATE_normalizeNumber(e.longitude));
  }
  convertArray(e, t) {
    return (e.values || []).map((e2) => this.convertValue(e2, t));
  }
  convertServerTimestamp(e, t) {
    switch (t) {
      case "previous":
        const n = __PRIVATE_getPreviousValue(e);
        return null == n ? null : this.convertValue(n, t);
      case "estimate":
        return this.convertTimestamp(__PRIVATE_getLocalWriteTime(e));
      default:
        return null;
    }
  }
  convertTimestamp(e) {
    const t = __PRIVATE_normalizeTimestamp(e);
    return new Timestamp(t.seconds, t.nanos);
  }
  convertDocumentKey(e, t) {
    const n = ResourcePath.fromString(e);
    __PRIVATE_hardAssert(__PRIVATE_isValidResourceName(n));
    const r2 = new DatabaseId(n.get(1), n.get(3)), i = new DocumentKey(n.popFirst(5));
    return r2.isEqual(t) || // TODO(b/64130202): Somehow support foreign references.
    __PRIVATE_logError(`Document ${i} contains a document reference within a different database (${r2.projectId}/${r2.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`), i;
  }
};
function __PRIVATE_applyFirestoreDataConverter(e, t, n) {
  let r2;
  return r2 = e ? n && (n.merge || n.mergeFields) ? e.toFirestore(t, n) : e.toFirestore(t) : t, r2;
}
var __PRIVATE_LiteUserDataWriter = class extends AbstractUserDataWriter {
  constructor(e) {
    super(), this.firestore = e;
  }
  convertBytes(e) {
    return new Bytes(e);
  }
  convertReference(e) {
    const t = this.convertDocumentKey(e, this.firestore._databaseId);
    return new DocumentReference(
      this.firestore,
      /* converter= */
      null,
      t
    );
  }
};
function sum(e) {
  return new AggregateField("sum", __PRIVATE_fieldPathFromArgument$1("sum", e));
}
function average(e) {
  return new AggregateField("avg", __PRIVATE_fieldPathFromArgument$1("average", e));
}
function count() {
  return new AggregateField("count");
}
function aggregateFieldEqual(e, t) {
  var n, r2;
  return e instanceof AggregateField && t instanceof AggregateField && e.aggregateType === t.aggregateType && (null === (n = e._internalFieldPath) || void 0 === n ? void 0 : n.canonicalString()) === (null === (r2 = t._internalFieldPath) || void 0 === r2 ? void 0 : r2.canonicalString());
}
function aggregateQuerySnapshotEqual(e, t) {
  return queryEqual(e.query, t.query) && deepEqual(e.data(), t.data());
}
var SnapshotMetadata = class {
  /** @hideconstructor */
  constructor(e, t) {
    this.hasPendingWrites = e, this.fromCache = t;
  }
  /**
   * Returns true if this `SnapshotMetadata` is equal to the provided one.
   *
   * @param other - The `SnapshotMetadata` to compare against.
   * @returns true if this `SnapshotMetadata` is equal to the provided one.
   */
  isEqual(e) {
    return this.hasPendingWrites === e.hasPendingWrites && this.fromCache === e.fromCache;
  }
};
var DocumentSnapshot = class extends DocumentSnapshot$1 {
  /** @hideconstructor protected */
  constructor(e, t, n, r2, i, s) {
    super(e, t, n, r2, s), this._firestore = e, this._firestoreImpl = e, this.metadata = i;
  }
  /**
   * Returns whether or not the data exists. True if the document exists.
   */
  exists() {
    return super.exists();
  }
  /**
   * Retrieves all fields in the document as an `Object`. Returns `undefined` if
   * the document doesn't exist.
   *
   * By default, `serverTimestamp()` values that have not yet been
   * set to their final value will be returned as `null`. You can override
   * this by passing an options object.
   *
   * @param options - An options object to configure how data is retrieved from
   * the snapshot (for example the desired behavior for server timestamps that
   * have not yet been set to their final value).
   * @returns An `Object` containing all fields in the document or `undefined` if
   * the document doesn't exist.
   */
  data(e = {}) {
    if (this._document) {
      if (this._converter) {
        const t = new QueryDocumentSnapshot(
          this._firestore,
          this._userDataWriter,
          this._key,
          this._document,
          this.metadata,
          /* converter= */
          null
        );
        return this._converter.fromFirestore(t, e);
      }
      return this._userDataWriter.convertValue(this._document.data.value, e.serverTimestamps);
    }
  }
  /**
   * Retrieves the field specified by `fieldPath`. Returns `undefined` if the
   * document or field doesn't exist.
   *
   * By default, a `serverTimestamp()` that has not yet been set to
   * its final value will be returned as `null`. You can override this by
   * passing an options object.
   *
   * @param fieldPath - The path (for example 'foo' or 'foo.bar') to a specific
   * field.
   * @param options - An options object to configure how the field is retrieved
   * from the snapshot (for example the desired behavior for server timestamps
   * that have not yet been set to their final value).
   * @returns The data at the specified field location or undefined if no such
   * field exists in the document.
   */
  // We are using `any` here to avoid an explicit cast by our users.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(e, t = {}) {
    if (this._document) {
      const n = this._document.data.field(__PRIVATE_fieldPathFromArgument("DocumentSnapshot.get", e));
      if (null !== n)
        return this._userDataWriter.convertValue(n, t.serverTimestamps);
    }
  }
};
var QueryDocumentSnapshot = class extends DocumentSnapshot {
  /**
   * Retrieves all fields in the document as an `Object`.
   *
   * By default, `serverTimestamp()` values that have not yet been
   * set to their final value will be returned as `null`. You can override
   * this by passing an options object.
   *
   * @override
   * @param options - An options object to configure how data is retrieved from
   * the snapshot (for example the desired behavior for server timestamps that
   * have not yet been set to their final value).
   * @returns An `Object` containing all fields in the document.
   */
  data(e = {}) {
    return super.data(e);
  }
};
var QuerySnapshot = class {
  /** @hideconstructor */
  constructor(e, t, n, r2) {
    this._firestore = e, this._userDataWriter = t, this._snapshot = r2, this.metadata = new SnapshotMetadata(r2.hasPendingWrites, r2.fromCache), this.query = n;
  }
  /** An array of all the documents in the `QuerySnapshot`. */
  get docs() {
    const e = [];
    return this.forEach((t) => e.push(t)), e;
  }
  /** The number of documents in the `QuerySnapshot`. */
  get size() {
    return this._snapshot.docs.size;
  }
  /** True if there are no documents in the `QuerySnapshot`. */
  get empty() {
    return 0 === this.size;
  }
  /**
   * Enumerates all of the documents in the `QuerySnapshot`.
   *
   * @param callback - A callback to be called with a `QueryDocumentSnapshot` for
   * each document in the snapshot.
   * @param thisArg - The `this` binding for the callback.
   */
  forEach(e, t) {
    this._snapshot.docs.forEach((n) => {
      e.call(t, new QueryDocumentSnapshot(this._firestore, this._userDataWriter, n.key, n, new SnapshotMetadata(this._snapshot.mutatedKeys.has(n.key), this._snapshot.fromCache), this.query.converter));
    });
  }
  /**
   * Returns an array of the documents changes since the last snapshot. If this
   * is the first snapshot, all documents will be in the list as 'added'
   * changes.
   *
   * @param options - `SnapshotListenOptions` that control whether metadata-only
   * changes (i.e. only `DocumentSnapshot.metadata` changed) should trigger
   * snapshot events.
   */
  docChanges(e = {}) {
    const t = !!e.includeMetadataChanges;
    if (t && this._snapshot.excludesMetadataChanges)
      throw new FirestoreError(D2.INVALID_ARGUMENT, "To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");
    return this._cachedChanges && this._cachedChangesIncludeMetadataChanges === t || (this._cachedChanges = /** Calculates the array of `DocumentChange`s for a given `ViewSnapshot`. */
    function __PRIVATE_changesFromSnapshot(e2, t2) {
      if (e2._snapshot.oldDocs.isEmpty()) {
        let t3 = 0;
        return e2._snapshot.docChanges.map((n) => {
          const r2 = new QueryDocumentSnapshot(e2._firestore, e2._userDataWriter, n.doc.key, n.doc, new SnapshotMetadata(e2._snapshot.mutatedKeys.has(n.doc.key), e2._snapshot.fromCache), e2.query.converter);
          return n.doc, {
            type: "added",
            doc: r2,
            oldIndex: -1,
            newIndex: t3++
          };
        });
      }
      {
        let n = e2._snapshot.oldDocs;
        return e2._snapshot.docChanges.filter((e3) => t2 || 3 !== e3.type).map((t3) => {
          const r2 = new QueryDocumentSnapshot(e2._firestore, e2._userDataWriter, t3.doc.key, t3.doc, new SnapshotMetadata(e2._snapshot.mutatedKeys.has(t3.doc.key), e2._snapshot.fromCache), e2.query.converter);
          let i = -1, s = -1;
          return 0 !== t3.type && (i = n.indexOf(t3.doc.key), n = n.delete(t3.doc.key)), 1 !== t3.type && (n = n.add(t3.doc), s = n.indexOf(t3.doc.key)), {
            type: __PRIVATE_resultChangeType(t3.type),
            doc: r2,
            oldIndex: i,
            newIndex: s
          };
        });
      }
    }(this, t), this._cachedChangesIncludeMetadataChanges = t), this._cachedChanges;
  }
};
function __PRIVATE_resultChangeType(e) {
  switch (e) {
    case 0:
      return "added";
    case 2:
    case 3:
      return "modified";
    case 1:
      return "removed";
    default:
      return fail();
  }
}
function snapshotEqual(e, t) {
  return e instanceof DocumentSnapshot && t instanceof DocumentSnapshot ? e._firestore === t._firestore && e._key.isEqual(t._key) && (null === e._document ? null === t._document : e._document.isEqual(t._document)) && e._converter === t._converter : e instanceof QuerySnapshot && t instanceof QuerySnapshot && (e._firestore === t._firestore && queryEqual(e.query, t.query) && e.metadata.isEqual(t.metadata) && e._snapshot.isEqual(t._snapshot));
}
function getDoc(e) {
  e = __PRIVATE_cast(e, DocumentReference);
  const t = __PRIVATE_cast(e.firestore, Firestore);
  return __PRIVATE_firestoreClientGetDocumentViaSnapshotListener(ensureFirestoreConfigured(t), e._key).then((n) => __PRIVATE_convertToDocSnapshot(t, e, n));
}
var __PRIVATE_ExpUserDataWriter = class extends AbstractUserDataWriter {
  constructor(e) {
    super(), this.firestore = e;
  }
  convertBytes(e) {
    return new Bytes(e);
  }
  convertReference(e) {
    const t = this.convertDocumentKey(e, this.firestore._databaseId);
    return new DocumentReference(
      this.firestore,
      /* converter= */
      null,
      t
    );
  }
};
function getDocFromCache(e) {
  e = __PRIVATE_cast(e, DocumentReference);
  const t = __PRIVATE_cast(e.firestore, Firestore), n = ensureFirestoreConfigured(t), r2 = new __PRIVATE_ExpUserDataWriter(t);
  return __PRIVATE_firestoreClientGetDocumentFromLocalCache(n, e._key).then((n2) => new DocumentSnapshot(t, r2, e._key, n2, new SnapshotMetadata(
    null !== n2 && n2.hasLocalMutations,
    /* fromCache= */
    true
  ), e.converter));
}
function getDocFromServer(e) {
  e = __PRIVATE_cast(e, DocumentReference);
  const t = __PRIVATE_cast(e.firestore, Firestore);
  return __PRIVATE_firestoreClientGetDocumentViaSnapshotListener(ensureFirestoreConfigured(t), e._key, {
    source: "server"
  }).then((n) => __PRIVATE_convertToDocSnapshot(t, e, n));
}
function getDocs(e) {
  e = __PRIVATE_cast(e, Query);
  const t = __PRIVATE_cast(e.firestore, Firestore), n = ensureFirestoreConfigured(t), r2 = new __PRIVATE_ExpUserDataWriter(t);
  return __PRIVATE_validateHasExplicitOrderByForLimitToLast(e._query), __PRIVATE_firestoreClientGetDocumentsViaSnapshotListener(n, e._query).then((n2) => new QuerySnapshot(t, r2, e, n2));
}
function getDocsFromCache(e) {
  e = __PRIVATE_cast(e, Query);
  const t = __PRIVATE_cast(e.firestore, Firestore), n = ensureFirestoreConfigured(t), r2 = new __PRIVATE_ExpUserDataWriter(t);
  return __PRIVATE_firestoreClientGetDocumentsFromLocalCache(n, e._query).then((n2) => new QuerySnapshot(t, r2, e, n2));
}
function getDocsFromServer(e) {
  e = __PRIVATE_cast(e, Query);
  const t = __PRIVATE_cast(e.firestore, Firestore), n = ensureFirestoreConfigured(t), r2 = new __PRIVATE_ExpUserDataWriter(t);
  return __PRIVATE_firestoreClientGetDocumentsViaSnapshotListener(n, e._query, {
    source: "server"
  }).then((n2) => new QuerySnapshot(t, r2, e, n2));
}
function setDoc(e, t, n) {
  e = __PRIVATE_cast(e, DocumentReference);
  const r2 = __PRIVATE_cast(e.firestore, Firestore), i = __PRIVATE_applyFirestoreDataConverter(e.converter, t, n);
  return executeWrite(r2, [__PRIVATE_parseSetData(__PRIVATE_newUserDataReader(r2), "setDoc", e._key, i, null !== e.converter, n).toMutation(e._key, Precondition.none())]);
}
function updateDoc(e, t, n, ...r2) {
  e = __PRIVATE_cast(e, DocumentReference);
  const i = __PRIVATE_cast(e.firestore, Firestore), s = __PRIVATE_newUserDataReader(i);
  let o;
  o = "string" == typeof // For Compat types, we have to "extract" the underlying types before
  // performing validation.
  (t = getModularInstance(t)) || t instanceof FieldPath ? __PRIVATE_parseUpdateVarargs(s, "updateDoc", e._key, t, n, r2) : __PRIVATE_parseUpdateData(s, "updateDoc", e._key, t);
  return executeWrite(i, [o.toMutation(e._key, Precondition.exists(true))]);
}
function deleteDoc(e) {
  return executeWrite(__PRIVATE_cast(e.firestore, Firestore), [new __PRIVATE_DeleteMutation(e._key, Precondition.none())]);
}
function addDoc(e, t) {
  const n = __PRIVATE_cast(e.firestore, Firestore), r2 = doc(e), i = __PRIVATE_applyFirestoreDataConverter(e.converter, t);
  return executeWrite(n, [__PRIVATE_parseSetData(__PRIVATE_newUserDataReader(e.firestore), "addDoc", r2._key, i, null !== e.converter, {}).toMutation(r2._key, Precondition.exists(false))]).then(() => r2);
}
function onSnapshot(e, ...t) {
  var n, r2, i;
  e = getModularInstance(e);
  let s = {
    includeMetadataChanges: false
  }, o = 0;
  "object" != typeof t[o] || __PRIVATE_isPartialObserver(t[o]) || (s = t[o], o++);
  const _ = {
    includeMetadataChanges: s.includeMetadataChanges
  };
  if (__PRIVATE_isPartialObserver(t[o])) {
    const e2 = t[o];
    t[o] = null === (n = e2.next) || void 0 === n ? void 0 : n.bind(e2), t[o + 1] = null === (r2 = e2.error) || void 0 === r2 ? void 0 : r2.bind(e2), t[o + 2] = null === (i = e2.complete) || void 0 === i ? void 0 : i.bind(e2);
  }
  let a, u, c;
  if (e instanceof DocumentReference)
    u = __PRIVATE_cast(e.firestore, Firestore), c = __PRIVATE_newQueryForPath(e._key.path), a = {
      next: (n2) => {
        t[o] && t[o](__PRIVATE_convertToDocSnapshot(u, e, n2));
      },
      error: t[o + 1],
      complete: t[o + 2]
    };
  else {
    const n2 = __PRIVATE_cast(e, Query);
    u = __PRIVATE_cast(n2.firestore, Firestore), c = n2._query;
    const r3 = new __PRIVATE_ExpUserDataWriter(u);
    a = {
      next: (e2) => {
        t[o] && t[o](new QuerySnapshot(u, r3, n2, e2));
      },
      error: t[o + 1],
      complete: t[o + 2]
    }, __PRIVATE_validateHasExplicitOrderByForLimitToLast(e._query);
  }
  return function __PRIVATE_firestoreClientListen(e2, t2, n2, r3) {
    const i2 = new __PRIVATE_AsyncObserver(r3), s2 = new __PRIVATE_QueryListener(t2, i2, n2);
    return e2.asyncQueue.enqueueAndForget(() => __async(this, null, function* () {
      return __PRIVATE_eventManagerListen(yield __PRIVATE_getEventManager(e2), s2);
    })), () => {
      i2.Na(), e2.asyncQueue.enqueueAndForget(() => __async(this, null, function* () {
        return __PRIVATE_eventManagerUnlisten(yield __PRIVATE_getEventManager(e2), s2);
      }));
    };
  }(ensureFirestoreConfigured(u), c, _, a);
}
function onSnapshotsInSync(e, t) {
  return __PRIVATE_firestoreClientAddSnapshotsInSyncListener(ensureFirestoreConfigured(e = __PRIVATE_cast(e, Firestore)), __PRIVATE_isPartialObserver(t) ? t : {
    next: t
  });
}
function executeWrite(e, t) {
  return function __PRIVATE_firestoreClientWrite(e2, t2) {
    const n = new __PRIVATE_Deferred();
    return e2.asyncQueue.enqueueAndForget(() => __async(this, null, function* () {
      return __PRIVATE_syncEngineWrite(yield __PRIVATE_getSyncEngine(e2), t2, n);
    })), n.promise;
  }(ensureFirestoreConfigured(e), t);
}
function __PRIVATE_convertToDocSnapshot(e, t, n) {
  const r2 = n.docs.get(t._key), i = new __PRIVATE_ExpUserDataWriter(e);
  return new DocumentSnapshot(e, i, t._key, r2, new SnapshotMetadata(n.hasPendingWrites, n.fromCache), t.converter);
}
function getCountFromServer(e) {
  return getAggregateFromServer(e, {
    count: count()
  });
}
function getAggregateFromServer(e, t) {
  const n = __PRIVATE_cast(e.firestore, Firestore), r2 = ensureFirestoreConfigured(n), i = function __PRIVATE_mapToArray(e2, t2) {
    const n2 = [];
    for (const r3 in e2)
      Object.prototype.hasOwnProperty.call(e2, r3) && n2.push(t2(e2[r3], r3, e2));
    return n2;
  }(t, (e2, t2) => new __PRIVATE_AggregateImpl(t2, e2.aggregateType, e2._internalFieldPath));
  return function __PRIVATE_firestoreClientRunAggregateQuery(e2, t2, n2) {
    const r3 = new __PRIVATE_Deferred();
    return e2.asyncQueue.enqueueAndForget(() => __async(this, null, function* () {
      try {
        const i2 = yield __PRIVATE_getDatastore(e2);
        r3.resolve(__PRIVATE_invokeRunAggregationQueryRpc(i2, t2, n2));
      } catch (e3) {
        r3.reject(e3);
      }
    })), r3.promise;
  }(r2, e._query, i).then((t2) => (
    /**
    * Converts the core aggregration result to an `AggregateQuerySnapshot`
    * that can be returned to the consumer.
    * @param query
    * @param aggregateResult Core aggregation result
    * @internal
    */
    function __PRIVATE_convertToAggregateQuerySnapshot(e2, t3, n2) {
      const r3 = new __PRIVATE_ExpUserDataWriter(e2);
      return new AggregateQuerySnapshot(t3, r3, n2);
    }(n, e, t2)
  ));
}
var __PRIVATE_MemoryLocalCacheImpl = class {
  constructor(e) {
    this.kind = "memory", this._onlineComponentProvider = new OnlineComponentProvider(), (null == e ? void 0 : e.garbageCollector) ? this._offlineComponentProvider = e.garbageCollector._offlineComponentProvider : this._offlineComponentProvider = new MemoryOfflineComponentProvider();
  }
  toJSON() {
    return {
      kind: this.kind
    };
  }
};
var __PRIVATE_PersistentLocalCacheImpl = class {
  constructor(e) {
    let t;
    this.kind = "persistent", (null == e ? void 0 : e.tabManager) ? (e.tabManager._initialize(e), t = e.tabManager) : (t = persistentSingleTabManager(void 0), t._initialize(e)), this._onlineComponentProvider = t._onlineComponentProvider, this._offlineComponentProvider = t._offlineComponentProvider;
  }
  toJSON() {
    return {
      kind: this.kind
    };
  }
};
var __PRIVATE_MemoryEagerGabageCollectorImpl = class {
  constructor() {
    this.kind = "memoryEager", this._offlineComponentProvider = new MemoryOfflineComponentProvider();
  }
  toJSON() {
    return {
      kind: this.kind
    };
  }
};
var __PRIVATE_MemoryLruGabageCollectorImpl = class {
  constructor(e) {
    this.kind = "memoryLru", this._offlineComponentProvider = new __PRIVATE_LruGcMemoryOfflineComponentProvider(e);
  }
  toJSON() {
    return {
      kind: this.kind
    };
  }
};
function memoryEagerGarbageCollector() {
  return new __PRIVATE_MemoryEagerGabageCollectorImpl();
}
function memoryLruGarbageCollector(e) {
  return new __PRIVATE_MemoryLruGabageCollectorImpl(null == e ? void 0 : e.cacheSizeBytes);
}
function memoryLocalCache(e) {
  return new __PRIVATE_MemoryLocalCacheImpl(e);
}
function persistentLocalCache(e) {
  return new __PRIVATE_PersistentLocalCacheImpl(e);
}
var __PRIVATE_SingleTabManagerImpl = class {
  constructor(e) {
    this.forceOwnership = e, this.kind = "persistentSingleTab";
  }
  toJSON() {
    return {
      kind: this.kind
    };
  }
  /**
   * @internal
   */
  _initialize(e) {
    this._onlineComponentProvider = new OnlineComponentProvider(), this._offlineComponentProvider = new __PRIVATE_IndexedDbOfflineComponentProvider(this._onlineComponentProvider, null == e ? void 0 : e.cacheSizeBytes, this.forceOwnership);
  }
};
var __PRIVATE_MultiTabManagerImpl = class {
  constructor() {
    this.kind = "PersistentMultipleTab";
  }
  toJSON() {
    return {
      kind: this.kind
    };
  }
  /**
   * @internal
   */
  _initialize(e) {
    this._onlineComponentProvider = new OnlineComponentProvider(), this._offlineComponentProvider = new __PRIVATE_MultiTabOfflineComponentProvider(this._onlineComponentProvider, null == e ? void 0 : e.cacheSizeBytes);
  }
};
function persistentSingleTabManager(e) {
  return new __PRIVATE_SingleTabManagerImpl(null == e ? void 0 : e.forceOwnership);
}
function persistentMultipleTabManager() {
  return new __PRIVATE_MultiTabManagerImpl();
}
var ye = {
  maxAttempts: 5
};
var WriteBatch = class {
  /** @hideconstructor */
  constructor(e, t) {
    this._firestore = e, this._commitHandler = t, this._mutations = [], this._committed = false, this._dataReader = __PRIVATE_newUserDataReader(e);
  }
  set(e, t, n) {
    this._verifyNotCommitted();
    const r2 = __PRIVATE_validateReference(e, this._firestore), i = __PRIVATE_applyFirestoreDataConverter(r2.converter, t, n), s = __PRIVATE_parseSetData(this._dataReader, "WriteBatch.set", r2._key, i, null !== r2.converter, n);
    return this._mutations.push(s.toMutation(r2._key, Precondition.none())), this;
  }
  update(e, t, n, ...r2) {
    this._verifyNotCommitted();
    const i = __PRIVATE_validateReference(e, this._firestore);
    let s;
    return s = "string" == typeof (t = getModularInstance(t)) || t instanceof FieldPath ? __PRIVATE_parseUpdateVarargs(this._dataReader, "WriteBatch.update", i._key, t, n, r2) : __PRIVATE_parseUpdateData(this._dataReader, "WriteBatch.update", i._key, t), this._mutations.push(s.toMutation(i._key, Precondition.exists(true))), this;
  }
  /**
   * Deletes the document referred to by the provided {@link DocumentReference}.
   *
   * @param documentRef - A reference to the document to be deleted.
   * @returns This `WriteBatch` instance. Used for chaining method calls.
   */
  delete(e) {
    this._verifyNotCommitted();
    const t = __PRIVATE_validateReference(e, this._firestore);
    return this._mutations = this._mutations.concat(new __PRIVATE_DeleteMutation(t._key, Precondition.none())), this;
  }
  /**
   * Commits all of the writes in this write batch as a single atomic unit.
   *
   * The result of these writes will only be reflected in document reads that
   * occur after the returned promise resolves. If the client is offline, the
   * write fails. If you would like to see local modifications or buffer writes
   * until the client is online, use the full Firestore SDK.
   *
   * @returns A `Promise` resolved once all of the writes in the batch have been
   * successfully written to the backend as an atomic unit (note that it won't
   * resolve while you're offline).
   */
  commit() {
    return this._verifyNotCommitted(), this._committed = true, this._mutations.length > 0 ? this._commitHandler(this._mutations) : Promise.resolve();
  }
  _verifyNotCommitted() {
    if (this._committed)
      throw new FirestoreError(D2.FAILED_PRECONDITION, "A write batch can no longer be used after commit() has been called.");
  }
};
function __PRIVATE_validateReference(e, t) {
  if ((e = getModularInstance(e)).firestore !== t)
    throw new FirestoreError(D2.INVALID_ARGUMENT, "Provided document reference is from a different Firestore instance.");
  return e;
}
var Transaction = class extends class Transaction$1 {
  /** @hideconstructor */
  constructor(e, t) {
    this._firestore = e, this._transaction = t, this._dataReader = __PRIVATE_newUserDataReader(e);
  }
  /**
   * Reads the document referenced by the provided {@link DocumentReference}.
   *
   * @param documentRef - A reference to the document to be read.
   * @returns A `DocumentSnapshot` with the read data.
   */
  get(e) {
    const t = __PRIVATE_validateReference(e, this._firestore), n = new __PRIVATE_LiteUserDataWriter(this._firestore);
    return this._transaction.lookup([t._key]).then((e2) => {
      if (!e2 || 1 !== e2.length)
        return fail();
      const r2 = e2[0];
      if (r2.isFoundDocument())
        return new DocumentSnapshot$1(this._firestore, n, r2.key, r2, t.converter);
      if (r2.isNoDocument())
        return new DocumentSnapshot$1(this._firestore, n, t._key, null, t.converter);
      throw fail();
    });
  }
  set(e, t, n) {
    const r2 = __PRIVATE_validateReference(e, this._firestore), i = __PRIVATE_applyFirestoreDataConverter(r2.converter, t, n), s = __PRIVATE_parseSetData(this._dataReader, "Transaction.set", r2._key, i, null !== r2.converter, n);
    return this._transaction.set(r2._key, s), this;
  }
  update(e, t, n, ...r2) {
    const i = __PRIVATE_validateReference(e, this._firestore);
    let s;
    return s = "string" == typeof (t = getModularInstance(t)) || t instanceof FieldPath ? __PRIVATE_parseUpdateVarargs(this._dataReader, "Transaction.update", i._key, t, n, r2) : __PRIVATE_parseUpdateData(this._dataReader, "Transaction.update", i._key, t), this._transaction.update(i._key, s), this;
  }
  /**
   * Deletes the document referred to by the provided {@link DocumentReference}.
   *
   * @param documentRef - A reference to the document to be deleted.
   * @returns This `Transaction` instance. Used for chaining method calls.
   */
  delete(e) {
    const t = __PRIVATE_validateReference(e, this._firestore);
    return this._transaction.delete(t._key), this;
  }
} {
  // This class implements the same logic as the Transaction API in the Lite SDK
  // but is subclassed in order to return its own DocumentSnapshot types.
  /** @hideconstructor */
  constructor(e, t) {
    super(e, t), this._firestore = e;
  }
  /**
   * Reads the document referenced by the provided {@link DocumentReference}.
   *
   * @param documentRef - A reference to the document to be read.
   * @returns A `DocumentSnapshot` with the read data.
   */
  get(e) {
    const t = __PRIVATE_validateReference(e, this._firestore), n = new __PRIVATE_ExpUserDataWriter(this._firestore);
    return super.get(e).then((e2) => new DocumentSnapshot(this._firestore, n, t._key, e2._document, new SnapshotMetadata(
      /* hasPendingWrites= */
      false,
      /* fromCache= */
      false
    ), t.converter));
  }
};
function runTransaction(e, t, n) {
  e = __PRIVATE_cast(e, Firestore);
  const r2 = Object.assign(Object.assign({}, ye), n);
  !function __PRIVATE_validateTransactionOptions(e2) {
    if (e2.maxAttempts < 1)
      throw new FirestoreError(D2.INVALID_ARGUMENT, "Max attempts must be at least 1");
  }(r2);
  return function __PRIVATE_firestoreClientTransaction(e2, t2, n2) {
    const r3 = new __PRIVATE_Deferred();
    return e2.asyncQueue.enqueueAndForget(() => __async(this, null, function* () {
      const i = yield __PRIVATE_getDatastore(e2);
      new __PRIVATE_TransactionRunner(e2.asyncQueue, i, n2, t2, r3).run();
    })), r3.promise;
  }(ensureFirestoreConfigured(e), (n2) => t(new Transaction(e, n2)), r2);
}
function deleteField() {
  return new __PRIVATE_DeleteFieldValueImpl("deleteField");
}
function serverTimestamp() {
  return new __PRIVATE_ServerTimestampFieldValueImpl("serverTimestamp");
}
function arrayUnion(...e) {
  return new __PRIVATE_ArrayUnionFieldValueImpl("arrayUnion", e);
}
function arrayRemove(...e) {
  return new __PRIVATE_ArrayRemoveFieldValueImpl("arrayRemove", e);
}
function increment(e) {
  return new __PRIVATE_NumericIncrementFieldValueImpl("increment", e);
}
function writeBatch(e) {
  return ensureFirestoreConfigured(e = __PRIVATE_cast(e, Firestore)), new WriteBatch(e, (t) => executeWrite(e, t));
}
function setIndexConfiguration(e, t) {
  var n;
  const r2 = ensureFirestoreConfigured(e = __PRIVATE_cast(e, Firestore));
  if (!r2._uninitializedComponentsProvider || "memory" === (null === (n = r2._uninitializedComponentsProvider) || void 0 === n ? void 0 : n._offlineKind))
    return __PRIVATE_logWarn("Cannot enable indexes when persistence is disabled"), Promise.resolve();
  const i = function __PRIVATE_parseIndexes(e2) {
    const t2 = "string" == typeof e2 ? function __PRIVATE_tryParseJson(e3) {
      try {
        return JSON.parse(e3);
      } catch (e4) {
        throw new FirestoreError(D2.INVALID_ARGUMENT, "Failed to parse JSON: " + (null == e4 ? void 0 : e4.message));
      }
    }(e2) : e2, n2 = [];
    if (Array.isArray(t2.indexes))
      for (const e3 of t2.indexes) {
        const t3 = __PRIVATE_tryGetString(e3, "collectionGroup"), r3 = [];
        if (Array.isArray(e3.fields))
          for (const t4 of e3.fields) {
            const e4 = __PRIVATE_fieldPathFromDotSeparatedString("setIndexConfiguration", __PRIVATE_tryGetString(t4, "fieldPath"));
            "CONTAINS" === t4.arrayConfig ? r3.push(new IndexSegment(
              e4,
              2
              /* IndexKind.CONTAINS */
            )) : "ASCENDING" === t4.order ? r3.push(new IndexSegment(
              e4,
              0
              /* IndexKind.ASCENDING */
            )) : "DESCENDING" === t4.order && r3.push(new IndexSegment(
              e4,
              1
              /* IndexKind.DESCENDING */
            ));
          }
        n2.push(new FieldIndex(FieldIndex.UNKNOWN_ID, t3, r3, IndexState.empty()));
      }
    return n2;
  }(t);
  return __PRIVATE_firestoreClientSetIndexConfiguration(r2, i);
}
function __PRIVATE_tryGetString(e, t) {
  if ("string" != typeof e[t])
    throw new FirestoreError(D2.INVALID_ARGUMENT, "Missing string value for: " + t);
  return e[t];
}
var PersistentCacheIndexManager = class {
  /** @hideconstructor */
  constructor(e) {
    this._client = e, /** A type string to uniquely identify instances of this class. */
    this.type = "PersistentCacheIndexManager";
  }
};
function getPersistentCacheIndexManager(e) {
  var t;
  e = __PRIVATE_cast(e, Firestore);
  const n = we.get(e);
  if (n)
    return n;
  const r2 = ensureFirestoreConfigured(e);
  if ("persistent" !== (null === (t = r2._uninitializedComponentsProvider) || void 0 === t ? void 0 : t._offlineKind))
    return null;
  const i = new PersistentCacheIndexManager(r2);
  return we.set(e, i), i;
}
function enablePersistentCacheIndexAutoCreation(e) {
  __PRIVATE_setPersistentCacheIndexAutoCreationEnabled(e, true);
}
function disablePersistentCacheIndexAutoCreation(e) {
  __PRIVATE_setPersistentCacheIndexAutoCreationEnabled(e, false);
}
function deleteAllPersistentCacheIndexes(e) {
  e._client.verifyNotTerminated();
  __PRIVATE_firestoreClientDeleteAllFieldIndexes(e._client).then((e2) => __PRIVATE_logDebug("deleting all persistent cache indexes succeeded")).catch((e2) => __PRIVATE_logWarn("deleting all persistent cache indexes failed", e2));
}
function __PRIVATE_setPersistentCacheIndexAutoCreationEnabled(e, t) {
  e._client.verifyNotTerminated();
  __PRIVATE_firestoreClientSetPersistentCacheIndexAutoCreationEnabled(e._client, t).then((e2) => __PRIVATE_logDebug(`setting persistent cache index auto creation isEnabled=${t} succeeded`)).catch((e2) => __PRIVATE_logWarn(`setting persistent cache index auto creation isEnabled=${t} failed`, e2));
}
var we = /* @__PURE__ */ new WeakMap();
var TestingHooks = class {
  constructor() {
    throw new Error("instances of this class should not be created");
  }
  /**
   * Registers a callback to be notified when an existence filter mismatch
   * occurs in the Watch listen stream.
   *
   * The relative order in which callbacks are notified is unspecified; do not
   * rely on any particular ordering. If a given callback is registered multiple
   * times then it will be notified multiple times, once per registration.
   *
   * @param callback the callback to invoke upon existence filter mismatch.
   *
   * @return a function that, when called, unregisters the given callback; only
   * the first invocation of the returned function does anything; all subsequent
   * invocations do nothing.
   */
  static onExistenceFilterMismatch(e) {
    return __PRIVATE_TestingHooksSpiImpl.instance.onExistenceFilterMismatch(e);
  }
};
var __PRIVATE_TestingHooksSpiImpl = class ___PRIVATE_TestingHooksSpiImpl {
  constructor() {
    this.Su = /* @__PURE__ */ new Map();
  }
  static get instance() {
    return Se || (Se = new ___PRIVATE_TestingHooksSpiImpl(), function __PRIVATE_setTestingHooksSpi(e) {
      if (ce)
        throw new Error("a TestingHooksSpi instance is already set");
      ce = e;
    }(Se)), Se;
  }
  tt(e) {
    this.Su.forEach((t) => t(e));
  }
  onExistenceFilterMismatch(e) {
    const t = Symbol(), n = this.Su;
    return n.set(t, e), () => n.delete(t);
  }
};
var Se = null;
!function __PRIVATE_registerFirestore(e, t = true) {
  !function __PRIVATE_setSDKVersion(e2) {
    S2 = e2;
  }(SDK_VERSION), _registerComponent(new Component("firestore", (e2, { instanceIdentifier: n, options: r2 }) => {
    const i = e2.getProvider("app").getImmediate(), s = new Firestore(new __PRIVATE_FirebaseAuthCredentialsProvider(e2.getProvider("auth-internal")), new __PRIVATE_FirebaseAppCheckTokenProvider(e2.getProvider("app-check-internal")), function __PRIVATE_databaseIdFromApp(e3, t2) {
      if (!Object.prototype.hasOwnProperty.apply(e3.options, ["projectId"]))
        throw new FirestoreError(D2.INVALID_ARGUMENT, '"projectId" not provided in firebase.initializeApp.');
      return new DatabaseId(e3.options.projectId, t2);
    }(i, n), i);
    return r2 = Object.assign({
      useFetchStreams: t
    }, r2), s._setSettings(r2), s;
  }, "PUBLIC").setMultipleInstances(true)), registerVersion(w2, "4.4.0", e), // BUILD_TARGET will be replaced by values like esm5, esm2017, cjs5, etc during the compilation
  registerVersion(w2, "4.4.0", "esm2017");
}();

// node_modules/rxfire/firestore/index.esm.js
var __assign = function() {
  __assign = Object.assign || function __assign2(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p2 in s)
        if (Object.prototype.hasOwnProperty.call(s, p2))
          t[p2] = s[p2];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __spreadArray(to, from2, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l2 = from2.length, ar; i < l2; i++) {
      if (ar || !(i in from2)) {
        if (!ar)
          ar = Array.prototype.slice.call(from2, 0, i);
        ar[i] = from2[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from2));
}
var DEFAULT_OPTIONS = { includeMetadataChanges: false };
function fromRef(ref, options) {
  if (options === void 0) {
    options = DEFAULT_OPTIONS;
  }
  return new Observable(function(subscriber) {
    var unsubscribe = onSnapshot(ref, options, {
      next: subscriber.next.bind(subscriber),
      error: subscriber.error.bind(subscriber),
      complete: subscriber.complete.bind(subscriber)
    });
    return { unsubscribe };
  });
}
function doc2(ref) {
  return fromRef(ref, { includeMetadataChanges: true });
}
function docData(ref, options) {
  if (options === void 0) {
    options = {};
  }
  return doc2(ref).pipe(map(function(snap) {
    return snapToData(snap, options);
  }));
}
function snapToData(snapshot, options) {
  var _a;
  if (options === void 0) {
    options = {};
  }
  var data = snapshot.data(options);
  if (!snapshot.exists() || typeof data !== "object" || data === null || !options.idField) {
    return data;
  }
  return __assign(__assign({}, data), (_a = {}, _a[options.idField] = snapshot.id, _a));
}
var ALL_EVENTS = ["added", "modified", "removed"];
var filterEvents = function(events) {
  return filter(function(changes) {
    var hasChange = false;
    for (var i = 0; i < changes.length; i++) {
      var change = changes[i];
      if (events && events.indexOf(change.type) >= 0) {
        hasChange = true;
        break;
      }
    }
    return hasChange;
  });
};
function sliceAndSplice(original, start, deleteCount) {
  var args = [];
  for (var _i = 3; _i < arguments.length; _i++) {
    args[_i - 3] = arguments[_i];
  }
  var returnArray = original.slice();
  returnArray.splice.apply(returnArray, __spreadArray([start, deleteCount], args, false));
  return returnArray;
}
function processIndividualChange(combined, change) {
  switch (change.type) {
    case "added":
      if (combined[change.newIndex] && refEqual(combined[change.newIndex].doc.ref, change.doc.ref))
        ;
      else {
        return sliceAndSplice(combined, change.newIndex, 0, change);
      }
      break;
    case "modified":
      if (combined[change.oldIndex] == null || refEqual(combined[change.oldIndex].doc.ref, change.doc.ref)) {
        if (change.oldIndex !== change.newIndex) {
          var copiedArray = combined.slice();
          copiedArray.splice(change.oldIndex, 1);
          copiedArray.splice(change.newIndex, 0, change);
          return copiedArray;
        } else {
          return sliceAndSplice(combined, change.newIndex, 1, change);
        }
      }
      break;
    case "removed":
      if (combined[change.oldIndex] && refEqual(combined[change.oldIndex].doc.ref, change.doc.ref)) {
        return sliceAndSplice(combined, change.oldIndex, 1);
      }
      break;
  }
  return combined;
}
function processDocumentChanges(current, changes, events) {
  if (events === void 0) {
    events = ALL_EVENTS;
  }
  changes.forEach(function(change) {
    if (events.indexOf(change.type) > -1) {
      current = processIndividualChange(current, change);
    }
  });
  return current;
}
var windowwise = function() {
  return pipe(startWith(void 0), pairwise());
};
var metaDataEquals = function(a, b2) {
  return JSON.stringify(a.metadata) === JSON.stringify(b2.metadata);
};
var filterEmptyUnlessFirst = function() {
  return pipe(windowwise(), filter(function(_a) {
    var prior = _a[0], current = _a[1];
    return current.length > 0 || prior === void 0;
  }), map(function(_a) {
    var current = _a[1];
    return current;
  }));
};
function collectionChanges(query3, options) {
  if (options === void 0) {
    options = {};
  }
  return fromRef(query3, { includeMetadataChanges: true }).pipe(windowwise(), map(function(_a) {
    var priorSnapshot = _a[0], currentSnapshot = _a[1];
    var docChanges = currentSnapshot.docChanges();
    if (priorSnapshot && !metaDataEquals(priorSnapshot, currentSnapshot)) {
      currentSnapshot.docs.forEach(function(currentDocSnapshot, currentIndex) {
        var currentDocChange = docChanges.find(function(c) {
          return refEqual(c.doc.ref, currentDocSnapshot.ref);
        });
        if (currentDocChange) {
          if (metaDataEquals(currentDocChange.doc, currentDocSnapshot)) {
            return;
          }
        } else {
          var priorDocSnapshot = priorSnapshot === null || priorSnapshot === void 0 ? void 0 : priorSnapshot.docs.find(function(d) {
            return refEqual(d.ref, currentDocSnapshot.ref);
          });
          if (priorDocSnapshot && metaDataEquals(priorDocSnapshot, currentDocSnapshot)) {
            return;
          }
        }
        docChanges.push({
          oldIndex: currentIndex,
          newIndex: currentIndex,
          type: "modified",
          doc: currentDocSnapshot
        });
      });
    }
    return docChanges;
  }), filterEvents(options.events || ALL_EVENTS), filterEmptyUnlessFirst());
}
function collection2(query3) {
  return fromRef(query3, { includeMetadataChanges: true }).pipe(map(function(changes) {
    return changes.docs;
  }));
}
function sortedChanges(query3, options) {
  if (options === void 0) {
    options = {};
  }
  return collectionChanges(query3, options).pipe(scan(function(current, changes) {
    return processDocumentChanges(current, changes, options.events);
  }, []), distinctUntilChanged());
}
function auditTrail(query3, options) {
  if (options === void 0) {
    options = {};
  }
  return collectionChanges(query3, options).pipe(scan(function(current, action) {
    return __spreadArray(__spreadArray([], current, true), action, true);
  }, []));
}
function collectionData(query3, options) {
  if (options === void 0) {
    options = {};
  }
  return collection2(query3).pipe(map(function(arr) {
    return arr.map(function(snap) {
      return snapToData(snap, options);
    });
  }));
}
function collectionCountSnap(query3) {
  return from(getCountFromServer(query3));
}
function collectionCount(query3) {
  return collectionCountSnap(query3).pipe(map(function(snap) {
    return snap.data().count;
  }));
}

// node_modules/@angular/fire/fesm2022/angular-fire-firestore.mjs
var Firestore2 = class {
  constructor(firestore) {
    return firestore;
  }
};
var FIRESTORE_PROVIDER_NAME = "firestore";
var FirestoreInstances = class {
  constructor() {
    return ɵgetAllInstancesOf(FIRESTORE_PROVIDER_NAME);
  }
};
var firestoreInstance$ = timer(0, 300).pipe(concatMap(() => from(ɵgetAllInstancesOf(FIRESTORE_PROVIDER_NAME))), distinct());
var PROVIDED_FIRESTORE_INSTANCES = new InjectionToken("angularfire2.firestore-instances");
function defaultFirestoreInstanceFactory(provided, defaultApp) {
  const defaultFirestore = ɵgetDefaultInstanceOf(FIRESTORE_PROVIDER_NAME, provided, defaultApp);
  return defaultFirestore && new Firestore2(defaultFirestore);
}
function firestoreInstanceFactory(fn) {
  return (zone, injector) => {
    const firestore = zone.runOutsideAngular(() => fn(injector));
    return new Firestore2(firestore);
  };
}
var FIRESTORE_INSTANCES_PROVIDER = {
  provide: FirestoreInstances,
  deps: [[new Optional(), PROVIDED_FIRESTORE_INSTANCES]]
};
var DEFAULT_FIRESTORE_INSTANCE_PROVIDER = {
  provide: Firestore2,
  useFactory: defaultFirestoreInstanceFactory,
  deps: [[new Optional(), PROVIDED_FIRESTORE_INSTANCES], FirebaseApp]
};
var FirestoreModule = class _FirestoreModule {
  constructor() {
    registerVersion("angularfire", VERSION.full, "fst");
  }
  static ɵfac = function FirestoreModule_Factory(t) {
    return new (t || _FirestoreModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _FirestoreModule
  });
  static ɵinj = ɵɵdefineInjector({
    providers: [DEFAULT_FIRESTORE_INSTANCE_PROVIDER, FIRESTORE_INSTANCES_PROVIDER]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FirestoreModule, [{
    type: NgModule,
    args: [{
      providers: [DEFAULT_FIRESTORE_INSTANCE_PROVIDER, FIRESTORE_INSTANCES_PROVIDER]
    }]
  }], () => [], null);
})();
function provideFirestore(fn, ...deps) {
  return {
    ngModule: FirestoreModule,
    providers: [{
      provide: PROVIDED_FIRESTORE_INSTANCES,
      useFactory: firestoreInstanceFactory(fn),
      multi: true,
      deps: [
        NgZone,
        Injector,
        ɵAngularFireSchedulers,
        FirebaseApps,
        // Firestore+Auth work better if Auth is loaded first
        [new Optional(), AuthInstances],
        [new Optional(), ɵAppCheckInstances],
        ...deps
      ]
    }]
  };
}
var collectionChanges2 = ɵzoneWrap(collectionChanges, true);
var collectionSnapshots = ɵzoneWrap(collection2, true);
var sortedChanges2 = ɵzoneWrap(sortedChanges, true);
var auditTrail2 = ɵzoneWrap(auditTrail, true);
var collectionData2 = ɵzoneWrap(collectionData, true);
var collectionCountSnap2 = ɵzoneWrap(collectionCountSnap, true);
var collectionCount2 = ɵzoneWrap(collectionCount, true);
var docSnapshots = ɵzoneWrap(doc2, true);
var docData2 = ɵzoneWrap(docData, true);
var snapToData2 = ɵzoneWrap(snapToData, true);
var fromRef2 = ɵzoneWrap(fromRef, true);
var addDoc2 = ɵzoneWrap(addDoc, true);
var aggregateFieldEqual2 = ɵzoneWrap(aggregateFieldEqual, true);
var aggregateQuerySnapshotEqual2 = ɵzoneWrap(aggregateQuerySnapshotEqual, true);
var and2 = ɵzoneWrap(and, true);
var arrayRemove2 = ɵzoneWrap(arrayRemove, true);
var arrayUnion2 = ɵzoneWrap(arrayUnion, true);
var average2 = ɵzoneWrap(average, true);
var clearIndexedDbPersistence2 = ɵzoneWrap(clearIndexedDbPersistence, true);
var collection3 = ɵzoneWrap(collection, true);
var collectionGroup2 = ɵzoneWrap(collectionGroup, true);
var connectFirestoreEmulator2 = ɵzoneWrap(connectFirestoreEmulator, true);
var count2 = ɵzoneWrap(count, true);
var deleteAllPersistentCacheIndexes2 = ɵzoneWrap(deleteAllPersistentCacheIndexes, true);
var deleteDoc2 = ɵzoneWrap(deleteDoc, true);
var deleteField2 = ɵzoneWrap(deleteField, true);
var disableNetwork2 = ɵzoneWrap(disableNetwork, true);
var disablePersistentCacheIndexAutoCreation2 = ɵzoneWrap(disablePersistentCacheIndexAutoCreation, true);
var doc3 = ɵzoneWrap(doc, true);
var documentId2 = ɵzoneWrap(documentId, true);
var enableIndexedDbPersistence2 = ɵzoneWrap(enableIndexedDbPersistence, true);
var enableMultiTabIndexedDbPersistence2 = ɵzoneWrap(enableMultiTabIndexedDbPersistence, true);
var enableNetwork2 = ɵzoneWrap(enableNetwork, true);
var enablePersistentCacheIndexAutoCreation2 = ɵzoneWrap(enablePersistentCacheIndexAutoCreation, true);
var endAt2 = ɵzoneWrap(endAt, true);
var endBefore2 = ɵzoneWrap(endBefore, true);
var getAggregateFromServer2 = ɵzoneWrap(getAggregateFromServer, true);
var getCountFromServer2 = ɵzoneWrap(getCountFromServer, true);
var getDoc2 = ɵzoneWrap(getDoc, true);
var getDocFromCache2 = ɵzoneWrap(getDocFromCache, true);
var getDocFromServer2 = ɵzoneWrap(getDocFromServer, true);
var getDocs2 = ɵzoneWrap(getDocs, true);
var getDocsFromCache2 = ɵzoneWrap(getDocsFromCache, true);
var getDocsFromServer2 = ɵzoneWrap(getDocsFromServer, true);
var getFirestore2 = ɵzoneWrap(getFirestore, true);
var getPersistentCacheIndexManager2 = ɵzoneWrap(getPersistentCacheIndexManager, true);
var increment2 = ɵzoneWrap(increment, true);
var initializeFirestore2 = ɵzoneWrap(initializeFirestore, true);
var limit2 = ɵzoneWrap(limit, true);
var limitToLast2 = ɵzoneWrap(limitToLast, true);
var loadBundle2 = ɵzoneWrap(loadBundle, true);
var memoryEagerGarbageCollector2 = ɵzoneWrap(memoryEagerGarbageCollector, true);
var memoryLocalCache2 = ɵzoneWrap(memoryLocalCache, true);
var memoryLruGarbageCollector2 = ɵzoneWrap(memoryLruGarbageCollector, true);
var namedQuery2 = ɵzoneWrap(namedQuery, true);
var onSnapshot2 = ɵzoneWrap(onSnapshot, true);
var onSnapshotsInSync2 = ɵzoneWrap(onSnapshotsInSync, true);
var or2 = ɵzoneWrap(or, true);
var orderBy2 = ɵzoneWrap(orderBy, true);
var persistentLocalCache2 = ɵzoneWrap(persistentLocalCache, true);
var persistentMultipleTabManager2 = ɵzoneWrap(persistentMultipleTabManager, true);
var persistentSingleTabManager2 = ɵzoneWrap(persistentSingleTabManager, true);
var query2 = ɵzoneWrap(query, true);
var queryEqual2 = ɵzoneWrap(queryEqual, true);
var refEqual2 = ɵzoneWrap(refEqual, true);
var runTransaction2 = ɵzoneWrap(runTransaction, true);
var serverTimestamp2 = ɵzoneWrap(serverTimestamp, true);
var setDoc2 = ɵzoneWrap(setDoc, true);
var setIndexConfiguration2 = ɵzoneWrap(setIndexConfiguration, true);
var setLogLevel2 = ɵzoneWrap(setLogLevel, true);
var snapshotEqual2 = ɵzoneWrap(snapshotEqual, true);
var startAfter2 = ɵzoneWrap(startAfter, true);
var startAt2 = ɵzoneWrap(startAt, true);
var sum2 = ɵzoneWrap(sum, true);
var terminate2 = ɵzoneWrap(terminate, true);
var updateDoc2 = ɵzoneWrap(updateDoc, true);
var waitForPendingWrites2 = ɵzoneWrap(waitForPendingWrites, true);
var where2 = ɵzoneWrap(where, true);
var writeBatch2 = ɵzoneWrap(writeBatch, true);
export {
  AbstractUserDataWriter,
  AggregateField,
  AggregateQuerySnapshot,
  Bytes,
  fe as CACHE_SIZE_UNLIMITED,
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  FieldPath,
  FieldValue,
  Firestore2 as Firestore,
  FirestoreError,
  FirestoreInstances,
  FirestoreModule,
  GeoPoint,
  LoadBundleTask,
  PersistentCacheIndexManager,
  Query,
  QueryCompositeFilterConstraint,
  QueryConstraint,
  QueryDocumentSnapshot,
  QueryEndAtConstraint,
  QueryFieldFilterConstraint,
  QueryLimitConstraint,
  QueryOrderByConstraint,
  QuerySnapshot,
  QueryStartAtConstraint,
  SnapshotMetadata,
  Timestamp,
  Transaction,
  WriteBatch,
  __PRIVATE_AutoId as _AutoId,
  ByteString as _ByteString,
  DatabaseId as _DatabaseId,
  DocumentKey as _DocumentKey,
  __PRIVATE_EmptyAppCheckTokenProvider as _EmptyAppCheckTokenProvider,
  __PRIVATE_EmptyAuthCredentialsProvider as _EmptyAuthCredentialsProvider,
  FieldPath$1 as _FieldPath,
  TestingHooks as _TestingHooks,
  __PRIVATE_cast as _cast,
  __PRIVATE_debugAssert as _debugAssert,
  __PRIVATE_isBase64Available as _isBase64Available,
  __PRIVATE_logWarn as _logWarn,
  __PRIVATE_validateIsNotUsedTogether as _validateIsNotUsedTogether,
  addDoc2 as addDoc,
  aggregateFieldEqual2 as aggregateFieldEqual,
  aggregateQuerySnapshotEqual2 as aggregateQuerySnapshotEqual,
  and2 as and,
  arrayRemove2 as arrayRemove,
  arrayUnion2 as arrayUnion,
  auditTrail2 as auditTrail,
  average2 as average,
  clearIndexedDbPersistence2 as clearIndexedDbPersistence,
  collection3 as collection,
  collectionChanges2 as collectionChanges,
  collectionCount2 as collectionCount,
  collectionCountSnap2 as collectionCountSnap,
  collectionData2 as collectionData,
  collectionGroup2 as collectionGroup,
  collectionSnapshots,
  connectFirestoreEmulator2 as connectFirestoreEmulator,
  count2 as count,
  deleteAllPersistentCacheIndexes2 as deleteAllPersistentCacheIndexes,
  deleteDoc2 as deleteDoc,
  deleteField2 as deleteField,
  disableNetwork2 as disableNetwork,
  disablePersistentCacheIndexAutoCreation2 as disablePersistentCacheIndexAutoCreation,
  doc3 as doc,
  docData2 as docData,
  docSnapshots,
  documentId2 as documentId,
  enableIndexedDbPersistence2 as enableIndexedDbPersistence,
  enableMultiTabIndexedDbPersistence2 as enableMultiTabIndexedDbPersistence,
  enableNetwork2 as enableNetwork,
  enablePersistentCacheIndexAutoCreation2 as enablePersistentCacheIndexAutoCreation,
  endAt2 as endAt,
  endBefore2 as endBefore,
  ensureFirestoreConfigured,
  executeWrite,
  firestoreInstance$,
  fromRef2 as fromRef,
  getAggregateFromServer2 as getAggregateFromServer,
  getCountFromServer2 as getCountFromServer,
  getDoc2 as getDoc,
  getDocFromCache2 as getDocFromCache,
  getDocFromServer2 as getDocFromServer,
  getDocs2 as getDocs,
  getDocsFromCache2 as getDocsFromCache,
  getDocsFromServer2 as getDocsFromServer,
  getFirestore2 as getFirestore,
  getPersistentCacheIndexManager2 as getPersistentCacheIndexManager,
  increment2 as increment,
  initializeFirestore2 as initializeFirestore,
  limit2 as limit,
  limitToLast2 as limitToLast,
  loadBundle2 as loadBundle,
  memoryEagerGarbageCollector2 as memoryEagerGarbageCollector,
  memoryLocalCache2 as memoryLocalCache,
  memoryLruGarbageCollector2 as memoryLruGarbageCollector,
  namedQuery2 as namedQuery,
  onSnapshot2 as onSnapshot,
  onSnapshotsInSync2 as onSnapshotsInSync,
  or2 as or,
  orderBy2 as orderBy,
  persistentLocalCache2 as persistentLocalCache,
  persistentMultipleTabManager2 as persistentMultipleTabManager,
  persistentSingleTabManager2 as persistentSingleTabManager,
  provideFirestore,
  query2 as query,
  queryEqual2 as queryEqual,
  refEqual2 as refEqual,
  runTransaction2 as runTransaction,
  serverTimestamp2 as serverTimestamp,
  setDoc2 as setDoc,
  setIndexConfiguration2 as setIndexConfiguration,
  setLogLevel2 as setLogLevel,
  snapToData2 as snapToData,
  snapshotEqual2 as snapshotEqual,
  sortedChanges2 as sortedChanges,
  startAfter2 as startAfter,
  startAt2 as startAt,
  sum2 as sum,
  terminate2 as terminate,
  updateDoc2 as updateDoc,
  waitForPendingWrites2 as waitForPendingWrites,
  where2 as where,
  writeBatch2 as writeBatch
};
/*! Bundled license information:

@firebase/auth/dist/esm2017/index-dd468b12.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dd468b12.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dd468b12.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dd468b12.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dd468b12.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dd468b12.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dd468b12.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dd468b12.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dd468b12.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dd468b12.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dd468b12.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dd468b12.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/auth/dist/esm2017/index-dd468b12.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

rxfire/auth/index.esm.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/firestore/dist/index.esm2017.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
  * @license
  * Copyright 2020 Google LLC
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
  *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

rxfire/firestore/index.esm.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
//# sourceMappingURL=@angular_fire_firestore.js.map
