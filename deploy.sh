#!/bin/sh
# 博云隙 · 一键部署更新脚本
# 用法:
#   ./deploy.sh                 # 更新到远程 main 最新版
#   ./deploy.sh v1.0.0          # 切换到指定 tag/分支/commit 并部署
#   ./deploy.sh 8ee7103         # 切换到指定 commit
#
# 前置要求（服务器上）:
#   - 已用 docker compose 部署过（本目录含 docker-compose.yml 与 .env）
#   - git 已配置好远程与 gh/git 凭据

set -e

REF="${1:-origin/main}"
APP_DIR="$(cd "$(dirname "$0")" && pwd)"

# GitHub 直连 + HTTP/1.1（部分服务器本地代理未运行或 HTTP/2 被干扰，会导致 TLS 握手失败）
GIT="git -c http.proxy= -c https.proxy= -c http.version=HTTP/1.1"

cd "$APP_DIR"

echo "=============================================="
echo "  博云隙 部署更新"
echo "  目录: $APP_DIR"
echo "  目标: $REF"
echo "=============================================="

# 1. 拉取代码
$GIT fetch origin
if [ "$REF" = "origin/main" ]; then
  echo "==> 更新到远程 main 最新版..."
  $GIT checkout main 2>/dev/null || $GIT checkout -B main origin/main
  $GIT pull --ff-only origin main
else
  echo "==> 切换到指定版本: $REF"
  $GIT checkout "$REF"
fi

# 2. 版本号 = git commit 短哈希 + 最近 tag（若有）
SHORT_HASH=$(git rev-parse --short HEAD)
LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
if [ -n "$LATEST_TAG" ]; then
  VERSION="${LATEST_TAG} (${SHORT_HASH})"
else
  VERSION="${SHORT_HASH}"
fi
echo "==> 当前部署版本: $VERSION"

# 3. 构建并重启（构建期注入版本号，后台侧边栏会显示）
echo "==> 构建镜像并重启容器..."
docker compose build --build-arg GIT_COMMIT="$SHORT_HASH" blog
docker compose up -d

# 4. 健康检查
echo "==> 等待服务启动..."
sleep 15
if curl -fsS "http://127.0.0.1:3000/api/health" >/dev/null 2>&1; then
  echo ""
  echo "=============================================="
  echo "  ✓ 部署成功"
  echo "  版本: $VERSION"
  echo "  访问: 登录后台在侧边栏底部可查看版本号"
  echo "=============================================="
else
  echo "==> 健康检查失败，请查看日志:"
  docker compose logs --tail=50 blog
  exit 1
fi

# 5. 清理旧镜像
docker image prune -f >/dev/null 2>&1 || true

echo "==> 完成"
