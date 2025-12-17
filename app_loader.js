/*
        This file has been generated from a TypeScript source.
        Don't modify it manually.
    
        https://github.com/Furnyr/Dissonity/
*/

function getPath() {
    const pathname = window.location.pathname;
    const isFile = /\.[^\/]+$/.test(pathname);
    if (isFile) {
        return pathname.substring(0, pathname.lastIndexOf("/") + 1);
    }
    return pathname;
}

let baseUrl = `${window.location.protocol}//${window.location.host}${getPath()}`;
if (!baseUrl.endsWith("/"))
    baseUrl += "/";
let outsideDiscord = false;
let proxyPrefixAdded = false;
let needsProxyPrefix = false;
let loaderPath = "Build/59b7971ed5b5820e11a8414a362d0cf9.loader.js";
const versionCheckPath = baseUrl + ".proxy/version.json";
const proxyBridgeImport = "/.proxy/Bridge/";
const normalBridgeImport = "/Bridge/";
const hirpcFileName = "dissonity_hirpc.js";
const buildVariablesFileName = "dissonity_build_variables.js";
const MOBILE = "mobile";
let initialWidth = window.innerWidth;
let initialHeight = window.innerHeight;

async function initialize() {
    async function fileExists(url) {
        const response = await fetch(url, {method: "HEAD"});
        return response.ok;
    }

    async function updatePaths() {
        let {pathname} = window.location;
        const pathSegments = pathname.split("/");
        pathSegments.shift();
        proxyPrefixAdded = pathSegments[0] == ".proxy";
        const prefixData = sessionStorage.getItem("dso_needs_prefix");
        needsProxyPrefix = !proxyPrefixAdded && prefixData != "false" && (prefixData == "true" || await fileExists(versionCheckPath));
        outsideDiscord = !proxyPrefixAdded && !needsProxyPrefix;
        if (needsProxyPrefix) {
            loaderPath = ".proxy/" + loaderPath;
        }
        if (outsideDiscord) {
            window.sessionStorage.setItem("dso_outside_discord", "true");
        } else {
            window.sessionStorage.setItem("dso_outside_discord", "false");
        }
        loaderPath = baseUrl + loaderPath;
    }

    await updatePaths();
}

async function handleHiRpc() {
    const isNested = window.parent != window.parent.parent;
    try {
        if (isNested || typeof window.parent?.dso_hirpc == "object") {
            Object.defineProperty(window, "dso_hirpc", {
                value: window.parent.dso_hirpc,
                writable: false,
                configurable: false
            });
            Object.freeze(window.dso_hirpc);
            window.dso_build_variables = window.parent.dso_build_variables;
            window.Dissonity = window.parent.Dissonity;
            initialize(window.parent.dso_hirpc, true);
            return;
        }
    } catch (error) {
        console.log(`Game is running at the top level: ${error}. Ignoring because we can proceed without this.`);
    }
    if (typeof window.dso_hirpc == "object") {
        initialize(window.dso_hirpc, true);
        return;
    }
    await new Promise(async (resolve, _) => {
        if (needsProxyPrefix) {
            await import(`${proxyBridgeImport}${hirpcFileName}`);
            await import(`${proxyBridgeImport}${buildVariablesFileName}`);
        } else {
            await import(`${baseUrl}${normalBridgeImport}${hirpcFileName}`);
            await import(`${baseUrl}${normalBridgeImport}${buildVariablesFileName}`);

        }
        load();

        async function load() {
            const hiRpc = new window.Dissonity.HiRpc.default();
            await initialize(hiRpc, false);
            resolve(hiRpc);
        }
    });

    async function initialize(hiRpc, loaded) {
        hiRpc.lockHashAccess();
        if (!loaded) {
            await hiRpc.load(0);
        }
    }
}

function hideHudToShowGame() {
    if (window.Telegram && window.Telegram.WebApp) 
        {
            console.log('Running on Telegram');
            window.Telegram.WebApp.ready();
            window.Telegram.WebApp.expand();
        }
    const unityCanvas = document.getElementById('unity-canvas');
    if (unityCanvas) {
        unityCanvas.style.display = 'block';
        unityCanvas.style.backgroundColor = "#000";
    }
    const background = document.getElementById('background');
    if (background) {
        background.style.display = 'none';
    }
}

function showErrorPane() {
    const spinner = document.getElementById('spinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
    const error = document.getElementById('error');
    if (error) {
        error.style.display = 'block';
    }
}

function showSpinner() {
    const logoContainer = document.getElementById('logo');
    let spinner = document.getElementById('spinner');
    if (!spinner) {
        spinner = document.createElement('div');
        spinner.setAttribute('className', 'spinner');
        spinner.style.marginTop = '20px';
        spinner.style.marginBottom = '20px';
        spinner.style.marginLeft = '20px';
        spinner.style.marginLeft = '20px';
        spinner.style.width = "40px";
        spinner.style.height = "40px";
        spinner.style.border = "4px solid rgba(255,255,255,0.3)";
        spinner.style.borderRadius = "50%";
        spinner.style.borderTopColor = "white";
        spinner.style.animation = "spin 1s linear infinite";
        logoContainer.appendChild(spinner);
    }
    spinner.style.display = 'block';

}

function setSubtitle(subtitle) {
    const loadingText = document.getElementById('loading');
    if (loadingText) {
        loadingText.innerText = subtitle;
    }
}

async function handleUnityBuild() {
    const hiRpc = window.dso_hirpc;
    const query = hiRpc.getQueryObject();
    let canvas = document.getElementById("unity-canvas");

    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "unity-canvas";
        canvas.style.display = 'none';
        canvas.style.maxHeight = "100%";
        canvas.style.maxWidth = "100%";
        canvas.style.border = "none";
        canvas.style.margin = '0';
        canvas.style.marginTop = '10px';
        canvas.style.marginBottom = '10px';
        canvas.style.alignSelf = "center";
        canvas.style.backgroundColor = "transparent";
        canvas.setAttribute("tabIndex", "-1");
        document.body.appendChild(canvas);
        
    }
    const defaultWidth = Number('1920');
    const defaultHeight = Number('1080');
    let width;
    let height;
    let autoSize = false;

    async function loadUnityBuild() {
        console.error(`Attaching script to load unity script...`);
        const loader = document.createElement("script");
        loader.setAttribute("src", loaderPath);
        loader.setAttribute("type", "text/javascript");
        const loaderPromise = new Promise(resolve => {
            loader.addEventListener("load", resolve);
        });
        document.head.appendChild(loader);
        await loaderPromise;
        console.error(`unity script load... complete`);
    }

    function handleResolution() {
        const RESOLUTION_TYPE = {
            Default: 1,
            Viewport: 2,
            Dynamic: 3,
            Max: 4
        };
        let viewportWidth = "[[[ WIDTH ]]]§";
        let viewportHeight = "[[[ HEIGHT ]]]§";
        let desktopResolution = "[[[ DESKTOP_RESOLUTION ]]]§";
        let mobileResolution = "[[[ MOBILE_RESOLUTION ]]]§";
        let browserResolution = "[[[ BROWSER_RESOLUTION ]]]§";
        let resolution;
        viewportWidth = Number(parseVariable(viewportWidth));
        viewportHeight = Number(parseVariable(viewportHeight));
        desktopResolution = Number(parseVariable(desktopResolution));
        mobileResolution = Number(parseVariable(mobileResolution));
        browserResolution = Number(parseVariable(browserResolution));
        if (outsideDiscord)
            resolution = browserResolution;
        if (query.platform == MOBILE || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            if (!resolution)
                resolution = mobileResolution;
            var meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
            document.getElementsByTagName('head')[0].appendChild(meta);
            document.body.style.textAlign = "left";
        } else if (!resolution) {
            resolution = desktopResolution;
        }
        switch (resolution) {
            case RESOLUTION_TYPE.Default: {
                width = defaultWidth;
                height = defaultHeight;
                break;
            }
            case RESOLUTION_TYPE.Viewport: {
                width = viewportWidth;
                height = viewportHeight;
                break;
            }
            case RESOLUTION_TYPE.Dynamic: {
                autoSize = true;
                break;
            }
            case RESOLUTION_TYPE.Max: {
                width = initialWidth;
                height = initialHeight;
                setRatio();
                window.dso_expand_canvas = () => {
                    width = window.innerWidth;
                    height = window.innerHeight;
                    setRatio();
                };
            }
        }
        if (!autoSize) {
            setRatio();
            window.addEventListener("resize", () => {
                setRatio();
            });
        }
    }

    function parseVariable(variable) {
        const raw = variable.split("]]] ")[1].slice(0, -1);
        return raw;
    }

    function setRatio() {
        canvas.width = width;
        canvas.height = height;
        const aspectRatio = canvas.width / canvas.height;
        let newWidth = window.innerWidth;
        let newHeight = window.innerHeight;
        if (newWidth / newHeight > aspectRatio) {
            newWidth = newHeight * aspectRatio;
        } else {
            newHeight = newWidth / aspectRatio;
        }
        canvas.style.width = `${newWidth}px`;
        canvas.style.height = `${newHeight}px`;
    }

    let background = "#000000";
    if (background != "#000000") {
        background = needsProxyPrefix
            ? "url('.proxy/" + background
            : "url('" + background;
    }
    canvas.style.background = background;
    await loadUnityBuild();
    handleResolution();
    const USE_THREADS = /true|1/i.test("false");
    const USE_WASM = /true|1/i.test("true");
    const MEMORY_FILENAME = /true|1/i.test("");
    const SYMBOLS_FILENAME = /true|1/i.test("");
    const dataUrl = needsProxyPrefix ? `${baseUrl}.proxy/Build/243d90f13b5cd011578a8b9b333ad8a5.data` : `${baseUrl}Build/243d90f13b5cd011578a8b9b333ad8a5.data`;
    const frameworkUrl = needsProxyPrefix ? `${baseUrl}.proxy/Build/3591fc9044df63399777d103ca4ecc07.framework.js` : `${baseUrl}Build/3591fc9044df63399777d103ca4ecc07.framework.js`;
    let workerUrl = needsProxyPrefix ? `${baseUrl}.proxy/Build/` : `${baseUrl}Build/`;
    let codeUrl = needsProxyPrefix ? `${baseUrl}.proxy/Build/f5895060dfd8462d4bb95aef3a1b520f.wasm` : `${baseUrl}Build/f5895060dfd8462d4bb95aef3a1b520f.wasm`;
    let memoryUrl = needsProxyPrefix ? `${baseUrl}.proxy/Build/` : `${baseUrl}Build/`;
    let symbolsUrl = needsProxyPrefix ? `${baseUrl}.proxy/Build/` : `${baseUrl}Build/`;
    const companyName = '".ERTH"'.replace('"', "");
    const productName = '"Poker Party"'.replace('"', "");
    const productVersion = '"2.0.80"'.replace('"', "");

    const unityLoadConfig = {
        dataUrl,
        frameworkUrl,
        streamingAssetsUrl: needsProxyPrefix ? `${baseUrl}.proxy/StreamingAssets` : `${baseUrl}/StreamingAssets`,
        companyName,
        productName,
        productVersion,
        devicePixelRatio: 1,
        matchWebGLToCanvasSize: autoSize,
        ...(USE_THREADS ? {workerUrl} : {}),
        ...(USE_WASM ? {codeUrl} : {}),
        ...(MEMORY_FILENAME ? {memoryUrl} : {}),
        ...(SYMBOLS_FILENAME ? {symbolsUrl} : {}),
    };
    createUnityInstance(canvas, unityLoadConfig, (progress) => {
        console.warn('Unity loading progress at : ' + progress * 100);
    }).then(() => hideHudToShowGame()).catch(err => showErrorPane());
}

(async () => {
    try {
        if (!(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent))) {
            showSpinner();
        }
        await initialize();
        setSubtitle('Connecting to Discord...');
        await handleHiRpc();
        setSubtitle('Starting game...');
        await handleUnityBuild();
    } catch (e) {
        console.error(e);
        showErrorPane()
    }
})();
export {};
