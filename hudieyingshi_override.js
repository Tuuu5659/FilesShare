/**
 * 蝴蝶影视 直连/代理分流 —— Bettbox JS 覆写脚本
 *
 * 用法：Bettbox → 脚本 → 右下角「+」新建 → 把本文件【全部内容】粘进去 → 保存 → 选中/开启本脚本
 * 重要：Bettbox 同一时刻只生效“当前脚本”。如果你已经在用别的脚本（例如 Emby直连），
 *      不要新建，改为把下面 markStart ~ markEnd 之间的代码并入那个脚本的 main() 里。
 */

const Compatible_With_Bettbox = { ruleOptionsEnable: true };

// Bettbox 可视化开关（脚本 → 该脚本 → 自定义 里可开关）
const ruleOptionsEnable = {
  蝴蝶分流: true,
};

const HD_BASE = 'https://raw.githubusercontent.com/Tuuu5659/FilesShare/main';
const HD_PROVIDERS = {
  hudieyingshi_direct: HD_BASE + '/hudieyingshi_direct.list',
  hudieyingshi_proxy: HD_BASE + '/hudieyingshi_proxy.list',
};

function main(config) {
  // >>>>>>> markStart
  if (typeof ruleOptionsEnable !== 'undefined' && ruleOptionsEnable.蝴蝶分流 === false) {
    return config;
  }

  config['proxy-groups'] = config['proxy-groups'] || [];
  config['rule-providers'] = config['rule-providers'] || {};
  config.rules = config.rules || [];

  // 1) 注册规则集：text + classical，兼容 DOMAIN-SUFFIX 与 IP-CIDR 混排
  Object.keys(HD_PROVIDERS).forEach(function (name) {
    config['rule-providers'][name] = {
      type: 'http',
      format: 'text',
      behavior: 'classical',
      url: HD_PROVIDERS[name],
      path: './rulesets/' + name + '.txt',
      interval: 86400,
    };
  });

  // 2) 代理规则的目标策略组：优先挑名字像“节点选择”的组，否则取第一个自建组
  var proxyTarget = 'DIRECT';
  var preferred = '';
  for (var i = 0; i < config['proxy-groups'].length; i++) {
    var g = config['proxy-groups'][i];
    if (!g || !g.name) continue;
    if (g.name === 'GLOBAL' || g.name === 'DIRECT' || g.name === 'REJECT' || g.name === 'PASS') continue;
    if (!preferred) preferred = g.name;
    if (/选择|节点|自动|代理|proxy/i.test(g.name)) { preferred = g.name; break; }
  }
  if (preferred) proxyTarget = preferred;

  // 3) 规则插到最前面（先删同名旧规则，保证重复执行不会叠加）
  var want = [
    'RULE-SET,hudieyingshi_direct,DIRECT',
    'RULE-SET,hudieyingshi_proxy,' + proxyTarget,
  ];
  var rest = config.rules.filter(function (r) { return want.indexOf(r) === -1; });
  config.rules = want.concat(rest);
  // <<<<<<< markEnd

  return config;
}
