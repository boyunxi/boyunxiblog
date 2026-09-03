"""基于 Chrome DevTools Protocol 的滚动帧率测量脚本。

用途：量化前端渲染性能，用于优化前后对比。
注意：headless Chrome 走 SwiftShader 软件渲染，FPS 绝对值偏低，
      但同一环境下的前后相对对比有意义。
"""
import json
import sys
import time
import subprocess
import urllib.request
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
port = 9344
user_data_dir = os.path.join(os.environ.get("TEMP", "/tmp"), "chrome-perf-profile")

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
    "--window-size=1280,800",
    "--force-device-scale-factor=1",
    "about:blank",
], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

time.sleep(3)

try:
    import websocket
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "websocket-client", "-q"])
    import websocket


def measure(page_url):
    targets = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{port}/json/list").read())
    page_target = next((t for t in targets if t.get("type") == "page"), None)
    if not page_target:
        print("No page target", file=sys.stderr)
        return

    ws = websocket.create_connection(page_target["webSocketDebuggerUrl"])
    ws.settimeout(60)
    mid = [0]

    def send(method, params=None):
        mid[0] += 1
        msg = {"id": mid[0], "method": method}
        if params:
            msg["params"] = params
        ws.send(json.dumps(msg))
        while True:
            resp = json.loads(ws.recv())
            if resp.get("id") == mid[0]:
                return resp

    def evaluate(expr):
        r = send("Runtime.evaluate", {
            "expression": expr,
            "awaitPromise": True,
            "returnByValue": True,
        })
        return r.get("result", {}).get("result", {}).get("value")

    send("Page.enable")
    send("Runtime.enable")
    send("Page.navigate", {"url": page_url})
    time.sleep(6)

    # 统计昂贵的合成属性使用情况
    audit = evaluate("""
    (() => {
      const all = Array.from(document.querySelectorAll('*'));
      const hasBackdrop = all.filter(el => {
        const s = getComputedStyle(el);
        return s.backdropFilter && s.backdropFilter !== 'none';
      }).length;
      const hasFilter = all.filter(el => {
        const s = getComputedStyle(el);
        return s.filter && s.filter !== 'none';
      }).length;
      const animated = all.filter(el => {
        const s = getComputedStyle(el);
        return s.animationName && s.animationName !== 'none';
      }).length;
      const nameOf = el =>
        el.tagName.toLowerCase() +
        (typeof el.className === 'string' && el.className
          ? '.' + el.className.trim().split(/\\s+/).join('.')
          : '');
      const backdropList = all
        .filter(el => {
          const s = getComputedStyle(el);
          return s.backdropFilter && s.backdropFilter !== 'none';
        })
        .map(nameOf);
      const filterList = all
        .filter(el => {
          const s = getComputedStyle(el);
          return s.filter && s.filter !== 'none';
        })
        .map(nameOf);
      const animatedList = all
        .filter(el => {
          const s = getComputedStyle(el);
          return s.animationName && s.animationName !== 'none';
        })
        .map(nameOf);
      return {
        total: all.length,
        hasBackdrop,
        hasFilter,
        animated,
        backdropList,
        filterList,
        animatedList,
      };
    })()
    """)

    def metrics_snapshot():
        """取一次 CDP 性能计数器快照。"""
        send("Performance.enable")
        r = send("Performance.getMetrics")
        names = {m["name"]: m["value"] for m in r["result"]["metrics"]}
        return {
            k: names.get(k, 0)
            for k in (
                "LayoutCount",
                "RecalcStyleCount",
                "LayoutDuration",
                "RecalcStyleDuration",
                "ScriptDuration",
                "TaskDuration",
            )
        }

    before = metrics_snapshot()

    # 滚动帧率
    fps = evaluate("""
    new Promise(resolve => {
      let frames = 0;
      let longFrames = 0;
      const start = performance.now();
      let last = start;
      function tick(now) {
        const dt = now - last;
        if (dt > 32) longFrames++;
        frames++;
        last = now;
        window.scrollBy(0, 10);
        if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 2) {
          window.scrollTo(0, 0);
        }
        if (now - start < 5000) {
          requestAnimationFrame(tick);
        } else {
          const elapsed = now - start;
          resolve({
            fps: Math.round(frames / (elapsed / 1000) * 10) / 10,
            frames,
            longFrames,
            elapsed: Math.round(elapsed),
          });
        }
      }
      requestAnimationFrame(tick);
    })
    """)

    after = metrics_snapshot()

    def delta(key):
        return round(after.get(key, 0) - before.get(key, 0), 4)

    print(f"页面: {page_url}")
    print(f"  DOM 元素总数: {audit.get('total')}")
    print(f"  backdrop-filter 元素: {audit.get('hasBackdrop')}")
    print(f"  filter 元素: {audit.get('hasFilter')}")
    print(f"  带动画元素: {audit.get('animated')}")
    print(f"    ├ backdrop: {audit.get('backdropList')}")
    print(f"    ├ filter:   {audit.get('filterList')}")
    print(f"    └ animated: {audit.get('animatedList')}")
    print(f"  滚动帧率: {fps.get('fps')} fps  ({fps.get('frames')} 帧 / {fps.get('elapsed')}ms)")
    print(f"  长帧(>32ms): {fps.get('longFrames')}")
    print("  --- 5 秒滚动内的主线程开销 ---")
    print(f"  样式重算次数: {delta('RecalcStyleCount')}   耗时: {delta('RecalcStyleDuration')*1000:.1f} ms")
    print(f"  布局次数:     {delta('LayoutCount')}   耗时: {delta('LayoutDuration')*1000:.1f} ms")
    print(f"  脚本耗时:     {delta('ScriptDuration')*1000:.1f} ms")
    print(f"  任务总耗时:   {delta('TaskDuration')*1000:.1f} ms")
    ws.close()


if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3001/"
    try:
        measure(url)
    finally:
        proc.terminate()
