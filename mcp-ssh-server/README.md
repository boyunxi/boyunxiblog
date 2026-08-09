# MCP SSH 服务器

通过 [Model Context Protocol](https://modelcontextprotocol.io) 把 SSH/SCP 远程服务器管理能力开放给 AI 客户端（如 CodeBuddy）。

## 提供的工具

| 工具 | 说明 |
|---|---|
| `ssh_ping` | 测试 SSH 连接是否可用 |
| `ssh_exec` | 在远程服务器执行 shell 命令（支持 `cwd`、`timeout`） |
| `ssh_upload` | 上传本地文件到远程服务器 |
| `ssh_download` | 从远程服务器下载文件到本地 |

## 安装

```bash
cd mcp-ssh-server
npm install
```

## 环境变量配置

连接参数全部通过环境变量提供，**不硬编码**：

```bash
SSH_HOST=154.8.175.76    # 服务器地址（必填）
SSH_USER=ubuntu          # 用户名（默认 ubuntu）
SSH_PORT=22              # 端口（默认 22）

# 认证二选一：
SSH_KEY_PATH=/home/os/.ssh/id_ed25519   # 推荐：私钥路径
# SSH_PASSWORD=xxx                       # 备选：密码（经 sshpass，会出现在进程参数，不推荐生产使用）
```

可复制 `.env.example` 后 `set -a && source .env && set +a` 加载，或直接在 MCP 客户端配置里声明环境变量。

## 接入 CodeBuddy

在 CodeBuddy 的 MCP 配置中新增服务器（示例为 stdio + 环境变量）：

```json
{
  "mcpServers": {
    "ssh-server": {
      "command": "node",
      "args": ["/home/os/code/boyunxiblog/mcp-ssh-server/index.js"],
      "env": {
        "SSH_HOST": "154.8.175.76",
        "SSH_USER": "ubuntu",
        "SSH_KEY_PATH": "/home/os/.ssh/id_ed25519"
      }
    }
  }
}
```

配置后重启 CodeBuddy，即可在对话中调用 `ssh_ping` / `ssh_exec` / `ssh_upload` / `ssh_download` 管理服务器。

## 安全提示

- **优先使用 SSH 密钥认证**（`SSH_KEY_PATH`），不要在生产环境用明文密码。
- 密码方式依赖 `sshpass`（`sudo apt-get install sshpass`），且密码会短暂出现在进程参数中，仅适合可信本机。
- MCP 客户端拿到 `ssh_exec` 后可在远程执行任意命令，请确保 MCP 服务器只暴露给受信任的客户端。
