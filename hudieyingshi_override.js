// 蝴蝶影视 直连/代理分流 —— BettBox / Stash 覆写脚本（JavaScript）
// 用法：BettBox → 脚本/覆写 → 新增 → 粘贴本文件内容（或填本文件的 raw 直链）→ 保存并开启
// 作用：把两份 Loon 规则注册为 rule-provider，并在规则最前面插入两条 RULE-SET

const BASE = 'https://raw.githubusercontent.com/Tuuu5659/FilesShare/main'

const PROVIDERS = {
  hudieyingshi_direct: BASE + '/hudieyingshi_direct.list',
  hudieyingshi_proxy: BASE + '/hudieyingshi_proxy.list',
}

let handler = async (config) => {
  // 1) 注册规则集（text + classical，兼容 DOMAIN-SUFFIX 与 IP-CIDR 混排）
  config['rule-providers'] = config['rule-providers'] || {}
  Object.keys(PROVIDERS).forEach((name) => {
    config['rule-providers'][name] = {
      type: 'http',
      format: 'text',
      behavior: 'classical',
      url: PROVIDERS[name],
      path: './rulesets/' + name + '.txt',
      interval: 86400,
    }
  })

  // 2) 代理规则的目标：取订阅里的第一个策略组（一般是「节点选择」），取不到就用 PROXY
  let proxyTarget = 'PROXY'
  try {
    const g = config['proxy-groups']
    if (g && g.length && g[0].name) proxyTarget = g[0].name
  } catch (e) {}

  // 3) 插入规则（放在最前面，保证优先级；先删同名的旧规则，避免重复）
  const want = [
    'RULE-SET,hudieyingshi_direct,DIRECT',
    'RULE-SET,hudieyingshi_proxy,' + proxyTarget,
  ]
  const old = config.rules || []
  config.rules = want.concat(old.filter((r) => want.indexOf(r) === -1))

  return config
}

exports = handler
