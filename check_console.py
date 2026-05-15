import json
import sys
import time
import subprocess
import urllib.request
import os
import base64

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
port = 9333
user_data_dir = os.path.join(os.environ.get("TEMP", "/tmp"), "chrome-debug-profile")

if os.path.exists(user_data_dir):
    import shutil
    shutil.rmtree(user_data_dir, ignore_errors=True)

os.makedirs(user_data_dir, exist_ok=True)

proc = subprocess.Popen([
    chrome_path,
    f"--remote-debugging-port={port}",
    "--remote-allow-origins=*",
    f"--user-data-dir={user_data_dir}",
    "--no-first-run",
    "--no-default-browser-check",
    "--headless=new",
    "--window-size=1280,720",
    "about:blank"
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

time.sleep(3)

try:
    import websocket
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "websocket-client", "-q"])
    import websocket

def check_page(page_url, screenshot_path=None):
    targets_url = f"http://127.0.0.1:{port}/json/list"
    
    targets = json.loads(urllib.request.urlopen(targets_url).read())
    page_target = None
    for t in targets:
        if t.get("type") == "page":
            page_target = t
            break
    
    if not page_target:
        print("No page target found", file=sys.stderr)
        return
    
    page_ws_url = page_target["webSocketDebuggerUrl"]
    
    ws = websocket.create_connection(page_ws_url)
    console_messages = []
    network_errors = []
    msg_id_counter = [0]
    
    def next_id():
        msg_id_counter[0] += 1
        return msg_id_counter[0]
    
    def send_command(method, params=None):
        mid = next_id()
        msg = {"id": mid, "method": method}
        if params:
            msg["params"] = params
        ws.send(json.dumps(msg))
        while True:
            try:
                ws.settimeout(10)
                resp = json.loads(ws.recv())
                if resp.get("id") == mid:
                    return resp
                elif "method" in resp:
                    handle_event(resp)
            except:
                return {}
    
    def handle_event(event):
        method = event.get("method", "")
        if method == "Runtime.consoleAPICalled":
            msg_type = event["params"]["type"]
            args = []
            for arg in event["params"]["args"]:
                val = arg.get("value")
                if val is None:
                    val = arg.get("description", "")
                args.append(str(val))
            console_messages.append({"type": msg_type, "msg": " ".join(args)})
        elif method == "Runtime.exceptionThrown":
            detail = event["params"].get("exceptionDetails", {})
            text = detail.get("text", "")
            exc = detail.get("exception", {})
            desc = exc.get("description", text)
            console_messages.append({"type": "exception", "msg": desc})
        elif method == "Network.responseReceived":
            resp = event["params"].get("response", {})
            status = resp.get("status", 0)
            url = resp.get("url", "")
            if status >= 400:
                network_errors.append({"status": status, "url": url})
        elif method == "Network.loadingFailed":
            req_id = event["params"].get("requestId", "")
            err_type = event["params"].get("type", "")
            network_errors.append({"status": "failed", "url": req_id, "type": err_type})
    
    send_command("Runtime.enable")
    send_command("Page.enable")
    send_command("Network.enable")
    
    inject_script = """
    window.__cc = [];
    var oE = console.error, oW = console.warn, oL = console.log, oI = console.info;
    console.error = function() { window.__cc.push({t:'error', m: Array.from(arguments).join(' ')}); oE.apply(console, arguments); };
    console.warn = function() { window.__cc.push({t:'warn', m: Array.from(arguments).join(' ')}); oW.apply(console, arguments); };
    console.log = function() { window.__cc.push({t:'log', m: Array.from(arguments).join(' ')}); oL.apply(console, arguments); };
    console.info = function() { window.__cc.push({t:'info', m: Array.from(arguments).join(' ')}); oI.apply(console, arguments); };
    window.addEventListener('error', function(e) { window.__cc.push({t:'js_error', m: e.message + ' at ' + e.filename + ':' + e.lineno}); });
    window.addEventListener('unhandledrejection', function(e) { window.__cc.push({t:'promise', m: String(e.reason)}); });
    """
    
    send_command("Page.addScriptToEvaluateOnNewDocument", {"source": inject_script})
    
    send_command("Page.navigate", {"url": page_url})
    
    time.sleep(6)
    
    for _ in range(300):
        try:
            ws.settimeout(0.3)
            resp = json.loads(ws.recv())
            if "method" in resp:
                handle_event(resp)
        except:
            break
    
    result = send_command("Runtime.evaluate", {"expression": "JSON.stringify(window.__cc || [])"})
    
    if screenshot_path:
        screenshot_result = send_command("Page.captureScreenshot", {"format": "png"})
        if screenshot_result.get("result", {}).get("data"):
            img_data = base64.b64decode(screenshot_result["result"]["data"])
            with open(screenshot_path, "wb") as f:
                f.write(img_data)
            print(f"  Screenshot saved: {screenshot_path}")
    
    ws.close()
    
    print(f"\n{'='*60}")
    print(f"Page: {page_url}")
    print(f"{'='*60}")
    
    print("\n--- Console Messages (CDP) ---")
    for msg in console_messages:
        print(f"  [{msg['type']}] {msg['msg']}")
    
    print("\n--- Console Messages (Injected) ---")
    injected_errors = []
    if result.get("result", {}).get("result", {}).get("value"):
        try:
            captured = json.loads(result["result"]["result"]["value"])
            for msg in captured:
                print(f"  [{msg['t']}] {msg['m']}")
                if msg['t'] in ('error', 'warn', 'js_error', 'promise'):
                    injected_errors.append(msg)
        except:
            print(f"  Raw: {result}")
    else:
        print("  No data")
    
    print("\n--- Network Errors ---")
    for err in network_errors:
        print(f"  [{err.get('status', 'N/A')}] {err.get('url', 'N/A')}")
    
    cdp_errors = [m for m in console_messages if m["type"] in ("error", "warning", "warn", "exception")]
    
    all_errors = cdp_errors + [{"type": m['t'], "msg": m['m']} for m in injected_errors]
    
    print(f"\n--- Summary ---")
    print(f"  Console errors/warnings: {len(all_errors)}")
    for m in all_errors:
        print(f"    [{m['type']}] {m['msg']}")
    print(f"  Network errors: {len(network_errors)}")
    for m in network_errors:
        print(f"    [{m.get('status', 'N/A')}] {m.get('url', 'N/A')}")
    
    return {"console_errors": all_errors, "network_errors": network_errors}

pages = [
    ("http://localhost:3001", "d:\\blog\\screenshot-home.png"),
    ("http://localhost:3001/search", "d:\\blog\\screenshot-search.png"),
    ("http://localhost:3001/about", "d:\\blog\\screenshot-about.png"),
]

all_results = {}
for page_url, screenshot_path in pages:
    result = check_page(page_url, screenshot_path)
    all_results[page_url] = result or {"console_errors": [], "network_errors": []}

print(f"\n\n{'='*60}")
print("FINAL REPORT - All Pages")
print(f"{'='*60}")
for url, result in all_results.items():
    console_errs = result.get("console_errors", [])
    network_errs = result.get("network_errors", [])
    print(f"\n  {url}:")
    print(f"    Console errors/warnings: {len(console_errs)}")
    for e in console_errs:
        print(f"      [{e['type']}] {e['msg']}")
    print(f"    Network errors: {len(network_errs)}")
    for e in network_errs:
        print(f"      [{e.get('status', 'N/A')}] {e.get('url', 'N/A')}")

proc.terminate()
