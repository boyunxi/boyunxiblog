#!/usr/bin/env node
// MCP SSH 服务器：通过 SSH/SCP 远程管理服务器
// 连接参数通过环境变量配置（不硬编码）：
//   SSH_HOST        服务器地址（必填）
//   SSH_USER        用户名，默认 ubuntu
//   SSH_PORT        SSH 端口，默认 22
//   SSH_PASSWORD    密码（用 sshpass，明文进程参数，建议优先用密钥）
//   SSH_KEY_PATH    SSH 私钥路径（推荐，与密码二选一）

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileP = promisify(execFile);
const server = new McpServer({ name: "mcp-ssh-server", version: "1.0.0" });

// ---------- 基础工具 ----------

function getConfig() {
  const host = process.env.SSH_HOST;
  if (!host) throw new Error("SSH_HOST 未配置：请设置 SSH_HOST 环境变量");
  return {
    host,
    user: process.env.SSH_USER || "ubuntu",
    port: process.env.SSH_PORT || "22",
    password: process.env.SSH_PASSWORD,
    keyPath: process.env.SSH_KEY_PATH,
  };
}

function buildTarget(cfg) {
  return `${cfg.user}@${cfg.host}`;
}

function sshPrefix(cfg) {
  const common = [
    "-o", "StrictHostKeyChecking=no",
    "-o", "ConnectTimeout=15",
    "-o", "ServerAliveInterval=30",
    "-p", cfg.port,
  ];
  if (cfg.keyPath) return { bin: "ssh", args: [...common, "-i", cfg.keyPath] };
  if (cfg.password) return { bin: "sshpass", args: ["-p", cfg.password, "ssh", ...common] };
  throw new Error("SSH_PASSWORD 或 SSH_KEY_PATH 至少配置一个");
}

function scpPrefix(cfg) {
  const common = [
    "-o", "StrictHostKeyChecking=no",
    "-o", "ConnectTimeout=15",
    "-P", cfg.port,
  ];
  if (cfg.keyPath) return { bin: "scp", args: [...common, "-i", cfg.keyPath] };
  if (cfg.password) return { bin: "sshpass", args: ["-p", cfg.password, "scp", ...common] };
  throw new Error("SSH_PASSWORD 或 SSH_KEY_PATH 至少配置一个");
}

async function runLocal(bin, args, { timeout = 60000 } = {}) {
  try {
    const { stdout, stderr } = await execFileP(bin, args, {
      timeout,
      maxBuffer: 20 * 1024 * 1024,
    });
    return { stdout, stderr, exitCode: 0 };
  } catch (err) {
    return {
      stdout: err.stdout || "",
      stderr: err.stderr || "",
      exitCode: typeof err.code === "number" ? err.code : -1,
    };
  }
}

function formatResult(res) {
  const parts = [];
  if (res.stdout) parts.push(res.stdout.trimEnd());
  if (res.stderr) parts.push(`[stderr] ${res.stderr.trimEnd()}`);
  if (!parts.length) parts.push("(无输出)");
  return parts.join("\n");
}

// ---------- 工具定义 ----------

server.tool(
  "ssh_ping",
  "测试 SSH 连接是否可用",
  {},
  async () => {
    try {
      const cfg = getConfig();
      const { bin, args } = sshPrefix(cfg);
      const target = buildTarget(cfg);
      const res = await runLocal(bin, [...args, target, "echo mcp-pong"], { timeout: 15000 });
      if (res.exitCode === 0 && res.stdout.includes("mcp-pong")) {
        return { content: [{ type: "text", text: `连接正常：${cfg.user}@${cfg.host}:${cfg.port}` }] };
      }
      return {
        content: [{ type: "text", text: `连接失败 (exit ${res.exitCode})\n${formatResult(res)}` }],
        isError: true,
      };
    } catch (err) {
      return { content: [{ type: "text", text: String(err.message || err) }], isError: true };
    }
  }
);

server.tool(
  "ssh_exec",
  "在远程服务器执行一条 shell 命令，返回 stdout/stderr 与退出码",
  {
    command: z.string().describe("要执行的远程命令"),
    cwd: z.string().optional().describe("远程工作目录，可选"),
    timeout: z.number().int().positive().max(600000).optional().describe("超时毫秒，默认 60000"),
  },
  async ({ command, cwd, timeout }) => {
    try {
      const cfg = getConfig();
      const { bin, args } = sshPrefix(cfg);
      const target = buildTarget(cfg);
      const full = cwd ? `cd ${cwd} && ${command}` : command;
      const res = await runLocal(bin, [...args, target, full], { timeout: timeout || 60000 });
      const text = `$ ${full}\n${formatResult(res)}`;
      if (res.exitCode !== 0) {
        return {
          content: [{ type: "text", text: `${text}\n[exit code] ${res.exitCode}` }],
          isError: true,
        };
      }
      return { content: [{ type: "text", text }] };
    } catch (err) {
      return { content: [{ type: "text", text: String(err.message || err) }], isError: true };
    }
  }
);

server.tool(
  "ssh_upload",
  "将本地文件上传到远程服务器",
  {
    localPath: z.string().describe("本地文件路径"),
    remotePath: z.string().describe("远程目标路径"),
  },
  async ({ localPath, remotePath }) => {
    try {
      const cfg = getConfig();
      const { bin, args } = scpPrefix(cfg);
      const target = buildTarget(cfg);
      const res = await runLocal(bin, [...args, localPath, `${target}:${remotePath}`], { timeout: 120000 });
      if (res.exitCode !== 0) {
        return { content: [{ type: "text", text: `上传失败 (exit ${res.exitCode})\n${formatResult(res)}` }], isError: true };
      }
      return { content: [{ type: "text", text: `已上传：${localPath} -> ${target}:${remotePath}` }] };
    } catch (err) {
      return { content: [{ type: "text", text: String(err.message || err) }], isError: true };
    }
  }
);

server.tool(
  "ssh_download",
  "从远程服务器下载文件到本地",
  {
    remotePath: z.string().describe("远程文件路径"),
    localPath: z.string().describe("本地保存路径"),
  },
  async ({ remotePath, localPath }) => {
    try {
      const cfg = getConfig();
      const { bin, args } = scpPrefix(cfg);
      const target = buildTarget(cfg);
      const res = await runLocal(bin, [...args, `${target}:${remotePath}`, localPath], { timeout: 120000 });
      if (res.exitCode !== 0) {
        return { content: [{ type: "text", text: `下载失败 (exit ${res.exitCode})\n${formatResult(res)}` }], isError: true };
      }
      return { content: [{ type: "text", text: `已下载：${target}:${remotePath} -> ${localPath}` }] };
    } catch (err) {
      return { content: [{ type: "text", text: String(err.message || err) }], isError: true };
    }
  }
);

// ---------- 启动 ----------

const transport = new StdioServerTransport();
await server.connect(transport);
