/**
 * Bettbox 一体化覆写脚本：Emby/内网直连 + 影视站分流（规则内联，启动零下载）
 *
 * 脚本卡片 -> 自定义，三个开关独立：
 *   Emby直连   默认开    内网 Emby/Emby 域名强制直连，并把 DIRECT 注入所有自建节点
 *   影视分流   默认开    893 条影视域名按清单分流（已把 12 个大陆被墙域名挪到代理侧）
 *   内网TUN    默认关    需要 App 开虚拟网卡但没开时，在这里强制开 tun
 *
 * 只有一个脚本能生效，所以 Emby 和影视分流合并在同一个 main() 里。
 * Emby 服务器不在 192.168/10.x 段时，改下面 embyServerIps。
 */

const Compatible_With_Bettbox = { ruleOptionsEnable: true };

const ruleOptionsEnable = {
  Emby直连: true,
  影视分流: true,
  内网TUN: false,
};

const embyServerIps = [
  '192.168.31.238',   // 你的 Emby 服务器 IP，按实际改；不在网段内靠这里补
];

// Emby 流量指向：'DIRECT' = mihomo 内建策略，永不会 not found（推荐）。
// 改成别的名字（如 'Emby直连'）会额外创建同名策略组，方便在面板里单独看/切。
const embyTarget = 'DIRECT';

const VOD_DIRECT_TEXT = "DOMAIN-SUFFIX,0708.fs708.com\nDOMAIN-SUFFIX,0zq6w.shddlcd.cn\nIP-CIDR,1.1.1.1/32,no-resolve\nDOMAIN-SUFFIX,1.xiu5408xiu.cc\nDOMAIN-SUFFIX,1.xiu5556xiu.cc\nDOMAIN-SUFFIX,1.xiu5790xiu.cc\nDOMAIN-SUFFIX,1.xiu5791xiu.cc\nDOMAIN-SUFFIX,1.xiu5793xiu.cc\nDOMAIN-SUFFIX,115.com\nDOMAIN-SUFFIX,123av.fun\nDOMAIN-SUFFIX,155api.com\nDOMAIN-SUFFIX,172608.zzxiaohua1.top\nDOMAIN-SUFFIX,18dyw.net\nDOMAIN-SUFFIX,18j.tv\nIP-CIDR,194.147.100.155/32,no-resolve\nDOMAIN-SUFFIX,1fvy0.cc\nDOMAIN-SUFFIX,1h5ceqq1h0.minba-abus.buzz\nDOMAIN-SUFFIX,1jpnygzply.xuniangex.buzz\nDOMAIN-SUFFIX,1w1b0w210r.sfttmodfavor.buzz\nDOMAIN-SUFFIX,20260807bb-bnm.mitaoava02.top\nDOMAIN-SUFFIX,212602.luoliav.cc\nDOMAIN-SUFFIX,323433ssdfd.top\nDOMAIN-SUFFIX,351.dofd1fe.com\nDOMAIN-SUFFIX,38.je\nDOMAIN-SUFFIX,3bmm.com\nDOMAIN-SUFFIX,456260.xyz\nDOMAIN-SUFFIX,4gf56465fg112.hongjiuchang.com\nDOMAIN-SUFFIX,51aw23.com\nDOMAIN-SUFFIX,51dj20.com\nDOMAIN-SUFFIX,51hub.com\nDOMAIN-SUFFIX,567955.xyz\nDOMAIN-SUFFIX,5721004.xyz\nDOMAIN-SUFFIX,600kk.net\nDOMAIN-SUFFIX,618013.xyz\nDOMAIN-SUFFIX,618600.xyz\nDOMAIN-SUFFIX,6590ck.cc\nDOMAIN-SUFFIX,71us.tov7yi5pxg.cc\nDOMAIN-SUFFIX,71usplefawyj.se8131f9xg.cc\nDOMAIN-SUFFIX,830556.iseseav101.buzz\nDOMAIN-SUFFIX,8728.mrsvj.com\nDOMAIN-SUFFIX,trace-tvshare23-honeypot.xyz\nDOMAIN-SUFFIX,887717.xyz\nDOMAIN-SUFFIX,8n78s7s7.jksolsotoday.buzz\nDOMAIN-SUFFIX,91.xiaoxuemei91912.com\nDOMAIN-SUFFIX,911bl.com\nDOMAIN-SUFFIX,911bl16.com\nDOMAIN-SUFFIX,911bla.com\nDOMAIN-SUFFIX,911blw.com\nDOMAIN-SUFFIX,91av.club\nDOMAIN-SUFFIX,91crdj.com\nDOMAIN-SUFFIX,91kdw.cc\nDOMAIN-SUFFIX,91md.me\nDOMAIN-SUFFIX,91nt.com\nDOMAIN-SUFFIX,91porna.com\nDOMAIN-SUFFIX,a.91kp.net\nDOMAIN-SUFFIX,a.wkvip.net\nDOMAIN-SUFFIX,a1.boltp.com\nDOMAIN-SUFFIX,a1b2c3d4.shushu19.cc\nDOMAIN-SUFFIX,a4j665s.bingyu4.sbs\nDOMAIN-SUFFIX,ability.vgwtswi.xyz\nDOMAIN-SUFFIX,able.jbezfkd.cc\nDOMAIN-SUFFIX,admire.cyepzjnb.com\nDOMAIN-SUFFIX,adopt.ybejhul.com\nDOMAIN-SUFFIX,aghivwz.info\nDOMAIN-SUFFIX,ai.baipiaozhe.com\nDOMAIN-SUFFIX,ai.dramarush.tv\nDOMAIN-SUFFIX,am.vgwtswi.xyz\nDOMAIN-SUFFIX,analyze.wlmrpodg.cc\nDOMAIN-SUFFIX,aosikazy1.com\nDOMAIN-SUFFIX,api-al.yuytyr.online\nDOMAIN-SUFFIX,api-h5.uvod.tv\nDOMAIN-SUFFIX,api.1080zyku.com\nDOMAIN-SUFFIX,api.3459381.com\nDOMAIN-SUFFIX,api.51dj1.com\nDOMAIN-SUFFIX,api.61c76a0.com\nDOMAIN-SUFFIX,api.6a7nnf7.com\nDOMAIN-SUFFIX,api.87735d5.com\nDOMAIN-SUFFIX,api.apibdzy.com\nDOMAIN-SUFFIX,api.bilibili.com\nDOMAIN-SUFFIX,api.c6dd5cc.com\nDOMAIN-SUFFIX,api.drama.9ddm.com\nDOMAIN-SUFFIX,api.em1oifd0.com\nDOMAIN-SUFFIX,api.ffzyapi.com\nDOMAIN-SUFFIX,api.huosuapi.cc\nDOMAIN-SUFFIX,api.j7y675.com\nDOMAIN-SUFFIX,api.jxapi.cc\nDOMAIN-SUFFIX,api.niuniuzy.me\nDOMAIN-SUFFIX,api.qianqi.net\nDOMAIN-SUFFIX,api.rmedphk.com\nDOMAIN-SUFFIX,api.ukuapi.com\nDOMAIN-SUFFIX,api.umygrx3.com\nDOMAIN-SUFFIX,api.vuecloudrb.com\nDOMAIN-SUFFIX,api.w32z7vtd.com\nDOMAIN-SUFFIX,api.wsyzy.net\nDOMAIN-SUFFIX,api.wwzy.tv\nDOMAIN-SUFFIX,api.yongfan99.com\nDOMAIN-SUFFIX,api.zuidapi.com\nDOMAIN-SUFFIX,api3.gdapi1.com\nDOMAIN-SUFFIX,apidanaizi.com\nDOMAIN-SUFFIX,apilj.com\nDOMAIN-SUFFIX,apilsbzy1.com\nDOMAIN-SUFFIX,apinew.uozvr.com\nDOMAIN-SUFFIX,apiyutu.com\nDOMAIN-SUFFIX,app.myfreecams.com\nDOMAIN-SUFFIX,aqx1.8uyp35j.com\nDOMAIN-SUFFIX,artcoast.cc\nDOMAIN-SUFFIX,artist.vgwtswi.xyz\nDOMAIN-SUFFIX,asmrhoney.com\nDOMAIN-SUFFIX,assets6.cdnhop.com\nDOMAIN-SUFFIX,av3698.cc\nDOMAIN-SUFFIX,avgood.com\nDOMAIN-SUFFIX,avjb.com\nDOMAIN-SUFFIX,avtoday.io\nDOMAIN-SUFFIX,avtop10.com\nDOMAIN-SUFFIX,back.jbezfkd.cc\nDOMAIN-SUFFIX,badly.okttbipbu.cc\nDOMAIN-SUFFIX,baoporn.com\nDOMAIN-SUFFIX,barely.vmwzzqom.cc\nDOMAIN-SUFFIX,bav52.cc\nDOMAIN-SUFFIX,bav53.cc\nDOMAIN-SUFFIX,bav62.cc\nDOMAIN-SUFFIX,bd.jx.cn\nDOMAIN-SUFFIX,bep.sjry7.pics\nDOMAIN-SUFFIX,besides.vumjtkcnc.cc\nDOMAIN-SUFFIX,bfq.txnp.cn\nDOMAIN-SUFFIX,bh3009.top\nDOMAIN-SUFFIX,bite.gtrazibvz.com\nDOMAIN-SUFFIX,bjxcxl.com\nDOMAIN-SUFFIX,block.frztdfnc.cc\nDOMAIN-SUFFIX,blood.bshzjjgq.cc\nDOMAIN-SUFFIX,border.bshzjjgq.cc\nDOMAIN-SUFFIX,borrow.gtrazibvz.com\nDOMAIN-SUFFIX,btm.rjsq2.skin\nDOMAIN-SUFFIX,bubutv.top\nDOMAIN-SUFFIX,burden.gtrazibvz.com\nDOMAIN-SUFFIX,but.vncchqw.cc\nDOMAIN-SUFFIX,but.ybejhul.com\nDOMAIN-SUFFIX,c9d0e1f2.crly52.buzz\nDOMAIN-SUFFIX,caiji.dyttzyapi.com\nDOMAIN-SUFFIX,caiji.maotaizy.cc\nDOMAIN-SUFFIX,caiji.xgzyapi.com\nDOMAIN-SUFFIX,carry.cyepzjnb.com\nDOMAIN-SUFFIX,carry.wlmrpodg.cc\nDOMAIN-SUFFIX,catch.belwfufv.cc\nDOMAIN-SUFFIX,catembylegacy.fastcdn.dpdns.org\nDOMAIN-SUFFIX,caywfd.jyh9.yachts\nDOMAIN-SUFFIX,cc.163.com\nDOMAIN-SUFFIX,ccc.djj88.sbs\nDOMAIN-SUFFIX,cdn-mso2.jptt1.cc\nDOMAIN-SUFFIX,cdn.dzzyapi.com\nDOMAIN-SUFFIX,ce2.515355.xyz\nDOMAIN-SUFFIX,ceiling.sysrycady.com\nDOMAIN-SUFFIX,cell.lacdfsq.cc\nDOMAIN-SUFFIX,ciw.ddwb8.best\nDOMAIN-SUFFIX,cj.10010888.xyz\nDOMAIN-SUFFIX,cj.ffzyapi.com\nDOMAIN-SUFFIX,cj.rycjapi.com\nDOMAIN-SUFFIX,cj.tianwe.cn\nDOMAIN-SUFFIX,cjysw.cc\nDOMAIN-SUFFIX,ckzy.me\nDOMAIN-SUFFIX,cl2.xbl2.pro\nDOMAIN-SUFFIX,collect.wolongzyw.com\nDOMAIN-SUFFIX,czzytv77.com\nDOMAIN-SUFFIX,d10cq29fdobmmg.cloudfront.net\nDOMAIN-SUFFIX,d8v8rjm9.bbmm277.sbs\nDOMAIN-SUFFIX,dadiao.cc\nDOMAIN-SUFFIX,dami0.com\nDOMAIN-SUFFIX,dami29.com\nDOMAIN-SUFFIX,dami3.com\nDOMAIN-SUFFIX,danmu.iyo.us.ci\nDOMAIN-SUFFIX,darkvod.com\nDOMAIN-SUFFIX,dbzy.tv\nDOMAIN-SUFFIX,dduotv01.top\nDOMAIN-SUFFIX,ddysx.cc\nDOMAIN-SUFFIX,deb.sfyjs9.ink\nDOMAIN-SUFFIX,delivery.douyinpaly.com\nDOMAIN-SUFFIX,dhvideo.cc\nDOMAIN-SUFFIX,dm.ljiaovm.com\nDOMAIN-SUFFIX,dm845.com\nDOMAIN-SUFFIX,dmhyy.com\nDOMAIN-SUFFIX,dmm.jysn3.mom\nDOMAIN-SUFFIX,dmxq39.com\nDOMAIN-SUFFIX,dns.google\nDOMAIN-SUFFIX,dnvod.org\nDOMAIN-SUFFIX,dsystv.com\nDOMAIN-SUFFIX,dtijfoc.info\nDOMAIN-SUFFIX,duan.brloop.com\nDOMAIN-SUFFIX,duoduosdf12223234334.top\nDOMAIN-SUFFIX,dy.8ttv.cn\nDOMAIN-SUFFIX,dys18.com\nDOMAIN-SUFFIX,eco.fe-spark.cn\nDOMAIN-SUFFIX,edgevideo.myfreecams.com\nDOMAIN-SUFFIX,ee55ff.com\nDOMAIN-SUFFIX,eij.slt8.boats\nDOMAIN-SUFFIX,en.paradisehill.cc\nDOMAIN-SUFFIX,ewrzka4.naitang8.top\nDOMAIN-SUFFIX,fcy.yzfnb8.lat\nDOMAIN-SUFFIX,feikuai.in\nDOMAIN-SUFFIX,fgsrg.hzqingshan.com\nDOMAIN-SUFFIX,fhapi9.com\nDOMAIN-SUFFIX,fqzy.me\nDOMAIN-SUFFIX,free.maccms.xyz\nDOMAIN-SUFFIX,fzms12.cc\nDOMAIN-SUFFIX,g3h4i5j6.caoliu28.cc\nDOMAIN-SUFFIX,gg51.com\nDOMAIN-SUFFIX,ggjav.com\nDOMAIN-SUFFIX,gitee.com\nDOMAIN-SUFFIX,goodav17.com\nDOMAIN-SUFFIX,gqc.ink\nDOMAIN-SUFFIX,gzbk.didi51-tedb0997.cc\nDOMAIN-SUFFIX,h4ivs.sm431.vip\nDOMAIN-SUFFIX,h5.xxoo168.org\nDOMAIN-SUFFIX,h5init.al.pnwkult.com\nDOMAIN-SUFFIX,h5init.m.nbajkbq.com\nDOMAIN-SUFFIX,h5init.qn.nbajkbq.com\nDOMAIN-SUFFIX,h5init.qn.pnwkult.com\nDOMAIN-SUFFIX,hanju84.cc\nDOMAIN-SUFFIX,hbzey01ctr.emuywhat.buzz\nDOMAIN-SUFFIX,hd.ticktockwow.com\nDOMAIN-SUFFIX,hd28.huadutx.com\nDOMAIN-SUFFIX,heiliao.com\nDOMAIN-SUFFIX,hemyin.com\nDOMAIN-SUFFIX,hg.115567.xyz\nDOMAIN-SUFFIX,hit.bnmdquasi.cc\nDOMAIN-SUFFIX,hjsqn.com\nDOMAIN-SUFFIX,hlj.fun\nDOMAIN-SUFFIX,hqg.ndmt3.life\nDOMAIN-SUFFIX,hqvod.com\nDOMAIN-SUFFIX,hscangku.com\nDOMAIN-SUFFIX,hsck.net\nDOMAIN-SUFFIX,hsck.tv\nDOMAIN-SUFFIX,hsck.us\nDOMAIN-SUFFIX,hscka.cc\nDOMAIN-SUFFIX,hsckzy.vip\nDOMAIN-SUFFIX,hstream.moe\nDOMAIN-SUFFIX,hubff.com\nDOMAIN-SUFFIX,hubu.515355.xyz\nDOMAIN-SUFFIX,idx.jvnmtr.cn\nDOMAIN-SUFFIX,ikunzyapi.com\nDOMAIN-SUFFIX,im1907.top\nDOMAIN-SUFFIX,images.weserv.nl\nDOMAIN-SUFFIX,imaple8.tv\nDOMAIN-SUFFIX,img.javfree.com\nDOMAIN-SUFFIX,img.lzzyimg.com\nDOMAIN-SUFFIX,img.mfcimg.com\nDOMAIN-SUFFIX,in30.ll48host.buzz\nDOMAIN-SUFFIX,init.al.pnwkult.com\nDOMAIN-SUFFIX,init.youliao88.com\nDOMAIN-SUFFIX,jav36.com\nDOMAIN-SUFFIX,javbunny.com\nDOMAIN-SUFFIX,javfree.com\nDOMAIN-SUFFIX,javgg.club\nDOMAIN-SUFFIX,javgg.co\nDOMAIN-SUFFIX,javgg.net\nDOMAIN-SUFFIX,javmenu.com\nDOMAIN-SUFFIX,javmove.com\nDOMAIN-SUFFIX,javquick.com\nDOMAIN-SUFFIX,jbgcz2.dzebypd.xyz\nDOMAIN-SUFFIX,jbgcz3.dzebypd.xyz\nDOMAIN-SUFFIX,jbm.fysn9.ink\nDOMAIN-SUFFIX,jiexi.789jiexi.com\nDOMAIN-SUFFIX,jiexi.789jiexi.icu\nDOMAIN-SUFFIX,jinyingzy.com\nDOMAIN-SUFFIX,jipinvip1.com\nDOMAIN-SUFFIX,jj88mm.com\nDOMAIN-SUFFIX,jkunzyapi.com\nDOMAIN-SUFFIX,jlj.xbsp6.boats\nDOMAIN-SUFFIX,jlm7.cc\nDOMAIN-SUFFIX,jlu.ezgdtehh.com\nDOMAIN-SUFFIX,jsqp.jsaa100.vip\nDOMAIN-SUFFIX,jugaoqing.com\nDOMAIN-SUFFIX,jumianfei.com\nDOMAIN-SUFFIX,juyongjiu.com\nDOMAIN-SUFFIX,jx.2s0.cn\nDOMAIN-SUFFIX,jx.973973.xyz\nDOMAIN-SUFFIX,jx.aidouer.net\nDOMAIN-SUFFIX,jx.hls.one\nDOMAIN-SUFFIX,jx.playerjy.com\nDOMAIN-SUFFIX,jx.xmflv.cc\nDOMAIN-SUFFIX,jx.xmflv.com\nDOMAIN-SUFFIX,jx.yangtu.top\nDOMAIN-SUFFIX,jx.yparse.com\nDOMAIN-SUFFIX,kafeizhibo.com\nDOMAIN-SUFFIX,kanju.ai\nDOMAIN-SUFFIX,kanju20.com\nDOMAIN-SUFFIX,kanliao14.com\nDOMAIN-SUFFIX,kanliao7.net\nDOMAIN-SUFFIX,kanliao7.org\nDOMAIN-SUFFIX,kissjav.li\nDOMAIN-SUFFIX,kkb1.sixnicejyzj.xyz\nDOMAIN-SUFFIX,kngyyvu.info\nDOMAIN-SUFFIX,knm111.top\nDOMAIN-SUFFIX,koreanpornmovie.com\nDOMAIN-SUFFIX,kuwo.cn\nDOMAIN-SUFFIX,lbapi9.com\nDOMAIN-SUFFIX,lcw.sfyjs7.beauty\nDOMAIN-SUFFIX,leaves-fall-gracefully.777hub129.xyz\nDOMAIN-SUFFIX,lhej.txcy-emo.buzz\nDOMAIN-SUFFIX,live.bilibili.com\nDOMAIN-SUFFIX,lust12.cc\nDOMAIN-SUFFIX,luyitian.com\nDOMAIN-SUFFIX,lwncnss3api.cc\nDOMAIN-SUFFIX,lysh.wandanba.biz\nDOMAIN-SUFFIX,lzlukvca.cc\nDOMAIN-SUFFIX,m.bilibili.com\nDOMAIN-SUFFIX,m.douyu.com\nDOMAIN-SUFFIX,m.hanju84.cc\nDOMAIN-SUFFIX,m.lrts.me\nDOMAIN-SUFFIX,m.myfreecams.com\nDOMAIN-SUFFIX,m.slwgb.com\nDOMAIN-SUFFIX,madou365.cc\nDOMAIN-SUFFIX,main.xiquduoduo.com\nDOMAIN-SUFFIX,manian.juxiafan.com\nDOMAIN-SUFFIX,maomi66.cc\nDOMAIN-SUFFIX,mdcmai4.xyz\nDOMAIN-SUFFIX,mdcmai5.xyz\nDOMAIN-SUFFIX,mdyy.cc\nDOMAIN-SUFFIX,mdyy6c5c5ce5.1010941.xyz\nDOMAIN-SUFFIX,minidrama.contentchina.com\nDOMAIN-SUFFIX,missav.app\nDOMAIN-SUFFIX,mjv011.com\nDOMAIN-SUFFIX,mobileso.bz.mgtv.com\nDOMAIN-SUFFIX,mozhuazy.com\nDOMAIN-SUFFIX,mp.huya.com\nDOMAIN-SUFFIX,mrdsa1.com\nDOMAIN-SUFFIX,mrdsa2.com\nDOMAIN-SUFFIX,mrdsk.com\nDOMAIN-SUFFIX,mu-jie.cc\nDOMAIN-SUFFIX,music.91q.com\nDOMAIN-SUFFIX,music.iqwq.cn\nDOMAIN-SUFFIX,naixxzy.com\nDOMAIN-SUFFIX,nanniang10.com\nDOMAIN-SUFFIX,nanniang6.com\nDOMAIN-SUFFIX,nanrenbense3564991.xyz\nDOMAIN-SUFFIX,netfapx.net\nDOMAIN-SUFFIX,newdomain.com\nDOMAIN-SUFFIX,newxvideos.pages.dev\nDOMAIN-SUFFIX,nnyy.la\nDOMAIN-SUFFIX,opgyxc1szs.muyexxxche.buzz\nDOMAIN-SUFFIX,owo1.cc\nDOMAIN-SUFFIX,owo2.cc\nDOMAIN-SUFFIX,owo3.cc\nDOMAIN-SUFFIX,owo4.cc\nDOMAIN-SUFFIX,owoav.com\nDOMAIN-SUFFIX,oytsuig.kwvqaj.cn\nDOMAIN-SUFFIX,ozzez.com\nDOMAIN-SUFFIX,p2100.net\nDOMAIN-SUFFIX,pastebin.880223.xyz\nDOMAIN-SUFFIX,pbaccess.video.qq.com\nDOMAIN-SUFFIX,pcweb.api.mgtv.com\nDOMAIN-SUFFIX,ph838.qians.cfd\nDOMAIN-SUFFIX,pic.lzzypic.com\nDOMAIN-SUFFIX,pigav.ws\nDOMAIN-SUFFIX,play.brovod.com\nDOMAIN-SUFFIX,play.jsaa100.vip\nDOMAIN-SUFFIX,player.91av.club\nDOMAIN-SUFFIX,player.bilibili.com\nDOMAIN-SUFFIX,pmvhaven.com\nDOMAIN-SUFFIX,pnd27y1jh1.rolizxwnoble.buzz\nDOMAIN-SUFFIX,pol.515355.xyz\nDOMAIN-SUFFIX,pomo.mom\nDOMAIN-SUFFIX,porn87.com\nDOMAIN-SUFFIX,porncgw.com\nDOMAIN-SUFFIX,prshinezenx.blog\nDOMAIN-SUFFIX,qiyoudy5.com\nDOMAIN-SUFFIX,qq.com.bh432.sbs\nDOMAIN-SUFFIX,r3e2o.top\nDOMAIN-SUFFIX,rb.huaduys.org\nDOMAIN-SUFFIX,rb.jnyk08.icu\nDOMAIN-SUFFIX,rdz3.xyz\nDOMAIN-SUFFIX,read.api.duodutek.com\nDOMAIN-SUFFIX,rou-video.zproxy.org\nDOMAIN-SUFFIX,rouman5.com\nDOMAIN-SUFFIX,rouva8.xyz\nDOMAIN-SUFFIX,rqtq.mom\nDOMAIN-SUFFIX,ruv.xxkk7.com\nDOMAIN-SUFFIX,s7t8u9v0.luanlunba13.cc\nDOMAIN-SUFFIX,s7t8u9v0.luanlunba14.cc\nDOMAIN-SUFFIX,s7t8u9v0.luanlunba15.cc\nDOMAIN-SUFFIX,s7t8u9v0.luwangi.cc\nDOMAIN-SUFFIX,sanl.slkanfengjing.site\nDOMAIN-SUFFIX,sdzyapi.com\nDOMAIN-SUFFIX,se.xiaosejie73.xyz\nDOMAIN-SUFFIX,search.bilibili.com\nDOMAIN-SUFFIX,search.kuwo.cn\nDOMAIN-SUFFIX,search.youku.com\nDOMAIN-SUFFIX,sekihfde.com\nDOMAIN-SUFFIX,shapp.us\nDOMAIN-SUFFIX,shayuapi.com\nDOMAIN-SUFFIX,shiresm.lol\nDOMAIN-SUFFIX,shunvhzuna.lol\nDOMAIN-SUFFIX,site.com\nDOMAIN-SUFFIX,sjsf1dpi.zhenshi27.xyz\nDOMAIN-SUFFIX,sjsfcd6h.shaofu36.xyz\nDOMAIN-SUFFIX,slapibf.com\nDOMAIN-SUFFIX,snap.mfcimg.com\nDOMAIN-SUFFIX,souju.ai\nDOMAIN-SUFFIX,stream.ass6.store\nDOMAIN-SUFFIX,super.playr.top\nDOMAIN-SUFFIX,svip.qlplayer.cyou\nDOMAIN-SUFFIX,sysu.bnmdquasi.cc\nDOMAIN-SUFFIX,t66yy.cc\nDOMAIN-SUFFIX,tangxinvlog.app\nDOMAIN-SUFFIX,tangxinvlog.pro\nDOMAIN-SUFFIX,thu.bnmdquasi.cc\nDOMAIN-SUFFIX,thu.ccjxweesh.cc\nDOMAIN-SUFFIX,thu.gpcqqmsof.cc\nDOMAIN-SUFFIX,thumb.live.mmcdn.com\nDOMAIN-SUFFIX,thumbzilla.top\nDOMAIN-SUFFIX,thzy1.me\nDOMAIN-SUFFIX,tianwei.qzz.io\nDOMAIN-SUFFIX,tideember.cc\nDOMAIN-SUFFIX,tju.bnmdquasi.cc\nDOMAIN-SUFFIX,tlobcnv.com\nDOMAIN-SUFFIX,top3.zgtv.online\nDOMAIN-SUFFIX,toptv15.cyou\nDOMAIN-SUFFIX,transwww.marcelf.com\nDOMAIN-SUFFIX,tw.xiaoyakankan.com\nDOMAIN-SUFFIX,tyyszy.com\nDOMAIN-SUFFIX,ups.5g.wasu.tv\nDOMAIN-SUFFIX,uxzl.1hong.buzz\nDOMAIN-SUFFIX,v.qq.com\nDOMAIN-SUFFIX,v.rbotv.cn\nDOMAIN-SUFFIX,v.youku.com\nDOMAIN-SUFFIX,video.isyour.love\nDOMAIN-SUFFIX,vidhub.tv\nDOMAIN-SUFFIX,vintagepornfun.com\nDOMAIN-SUFFIX,wanwuu.com\nDOMAIN-SUFFIX,wanwuu.pages.dev\nDOMAIN-SUFFIX,wapi.kuwo.cn\nDOMAIN-SUFFIX,weishitv.xyz\nDOMAIN-SUFFIX,wknd.sjzstv.sbs\nDOMAIN-SUFFIX,wmtt5.com\nDOMAIN-SUFFIX,wnlink.ru\nDOMAIN-SUFFIX,wsrv.nl\nDOMAIN-SUFFIX,wtwgi.qingwife01.club\nDOMAIN-SUFFIX,ww98.taiee.xyz\nDOMAIN-SUFFIX,www.30juz.com\nDOMAIN-SUFFIX,www.3av.app\nDOMAIN-SUFFIX,www.4kvm.net\nDOMAIN-SUFFIX,www.4kvm.top\nDOMAIN-SUFFIX,www.51papaya.com\nDOMAIN-SUFFIX,www.58hu.com\nDOMAIN-SUFFIX,www.66dpw.vip\nDOMAIN-SUFFIX,www.7xb38c.com\nDOMAIN-SUFFIX,www.8090g.cn\nDOMAIN-SUFFIX,www.91nt.com\nDOMAIN-SUFFIX,www.91yhdm.com\nDOMAIN-SUFFIX,www.9g88x.com\nDOMAIN-SUFFIX,www.adultporna-av107.com\nDOMAIN-SUFFIX,www.aeete.com\nDOMAIN-SUFFIX,www.asmr.one\nDOMAIN-SUFFIX,www.asmrba.com\nDOMAIN-SUFFIX,www.asmrzy.top\nDOMAIN-SUFFIX,www.baidu.com\nDOMAIN-SUFFIX,www.balidwipa.com\nDOMAIN-SUFFIX,www.bilibili.com\nDOMAIN-SUFFIX,www.brovod.com\nDOMAIN-SUFFIX,www.bttwo.life\nDOMAIN-SUFFIX,www.ckplayer.vip\nDOMAIN-SUFFIX,www.dami0.com\nDOMAIN-SUFFIX,www.dami29.com\nDOMAIN-SUFFIX,www.dami3.com\nDOMAIN-SUFFIX,www.dbb557.com\nDOMAIN-SUFFIX,www.dgpengcheng.com\nDOMAIN-SUFFIX,www.didahd.xyz\nDOMAIN-SUFFIX,www.diekawang.com\nDOMAIN-SUFFIX,www.djuu.com\nDOMAIN-SUFFIX,www.dmxq39.com\nDOMAIN-SUFFIX,www.dongman.la\nDOMAIN-SUFFIX,www.douyu.com\nDOMAIN-SUFFIX,www.dsxys8.com\nDOMAIN-SUFFIX,www.duanju84.com\nDOMAIN-SUFFIX,www.dushe.video\nDOMAIN-SUFFIX,www.dyx00.com\nDOMAIN-SUFFIX,www.flixflop.com\nDOMAIN-SUFFIX,www.freeok88.com\nDOMAIN-SUFFIX,www.fulleroticmovies.net\nDOMAIN-SUFFIX,www.fullhd.to\nDOMAIN-SUFFIX,www.fullhd.xxx\nDOMAIN-SUFFIX,www.gg51.com\nDOMAIN-SUFFIX,www.ghgdm.com\nDOMAIN-SUFFIX,www.hanju84.cc\nDOMAIN-SUFFIX,www.haojuwu.cc\nDOMAIN-SUFFIX,www.hff552.com\nDOMAIN-SUFFIX,www.hongniuzy2.com\nDOMAIN-SUFFIX,www.huoporn.lol\nDOMAIN-SUFFIX,www.huya.com\nDOMAIN-SUFFIX,www.i275.com\nDOMAIN-SUFFIX,www.iysdq.tv\nDOMAIN-SUFFIX,www.javrate.com\nDOMAIN-SUFFIX,www.jennyhow.com\nDOMAIN-SUFFIX,www.jingpinx.com\nDOMAIN-SUFFIX,www.kanxiya.com\nDOMAIN-SUFFIX,www.kuaikaw.cn\nDOMAIN-SUFFIX,www.kuwo.cn\nDOMAIN-SUFFIX,www.lookluping.xyz\nDOMAIN-SUFFIX,www.lovedan.net\nDOMAIN-SUFFIX,www.luanlunba.cc\nDOMAIN-SUFFIX,www.luojubj.xyz\nDOMAIN-SUFFIX,www.lust12.cc\nDOMAIN-SUFFIX,www.mdyy.cc\nDOMAIN-SUFFIX,www.mdzyapi.com\nDOMAIN-SUFFIX,www.meijutt.cc\nDOMAIN-SUFFIX,www.mgtv.com\nDOMAIN-SUFFIX,www.motv.app\nDOMAIN-SUFFIX,www.moxy.top\nDOMAIN-SUFFIX,www.mrds66.com\nDOMAIN-SUFFIX,www.mtyy1.com\nDOMAIN-SUFFIX,www.myfreecams.com\nDOMAIN-SUFFIX,www.naughtymachinima.com\nDOMAIN-SUFFIX,www.nivod.cc\nDOMAIN-SUFFIX,www.owodz.com\nDOMAIN-SUFFIX,www.pandalive.co.kr\nDOMAIN-SUFFIX,www.pouyun.com\nDOMAIN-SUFFIX,www.qdys1.cc\nDOMAIN-SUFFIX,www.qdys2.cc\nDOMAIN-SUFFIX,www.qivod.com\nDOMAIN-SUFFIX,www.qlys.cc\nDOMAIN-SUFFIX,www.qmao.net\nDOMAIN-SUFFIX,www.qn63.com\nDOMAIN-SUFFIX,www.qnmp4.com\nDOMAIN-SUFFIX,www.qpsp.cc\nDOMAIN-SUFFIX,www.qwfilm.com\nDOMAIN-SUFFIX,www.qwmkv.com\nDOMAIN-SUFFIX,www.r3e2o.top\nDOMAIN-SUFFIX,www.shangbanke.shop\nDOMAIN-SUFFIX,www.sihuhu.xyz\nDOMAIN-SUFFIX,www.sorani.net\nDOMAIN-SUFFIX,www.sypfjy.com\nDOMAIN-SUFFIX,www.uvod.tv\nDOMAIN-SUFFIX,www.viptu.com\nDOMAIN-SUFFIX,www.vnzyz.com\nDOMAIN-SUFFIX,www.vssdy.com\nDOMAIN-SUFFIX,www.wangfei.tv\nDOMAIN-SUFFIX,www.wasu.cn\nDOMAIN-SUFFIX,www.wn03.ru\nDOMAIN-SUFFIX,www.xiangjiaozyw.com\nDOMAIN-SUFFIX,www.xiaoqiche.shop\nDOMAIN-SUFFIX,www.xnhrsb.com\nDOMAIN-SUFFIX,www.xxbrits.com\nDOMAIN-SUFFIX,www.yasetube.com\nDOMAIN-SUFFIX,www.yemahk.xyz\nDOMAIN-SUFFIX,www.yemahl.xyz\nDOMAIN-SUFFIX,www.yemahp.xyz\nDOMAIN-SUFFIX,www.yemahq.xyz\nDOMAIN-SUFFIX,www.yemahr.xyz\nDOMAIN-SUFFIX,www.yemahs.xyz\nDOMAIN-SUFFIX,www.yemaht.xyz\nDOMAIN-SUFFIX,www.yemu.xyz\nDOMAIN-SUFFIX,www.yiqiys.com\nDOMAIN-SUFFIX,www.yitingshu.com\nDOMAIN-SUFFIX,www.ylys.tv\nDOMAIN-SUFFIX,www.youku.com\nDOMAIN-SUFFIX,www.yuetingba.cn\nDOMAIN-SUFFIX,www.yxxq41.cc\nDOMAIN-SUFFIX,www.yycm6.wiki\nDOMAIN-SUFFIX,www.zhizhewanshui.shop\nDOMAIN-SUFFIX,www.znys.top\nDOMAIN-SUFFIX,www.ztzssz.com\nDOMAIN-SUFFIX,www1.ikanbot.com\nDOMAIN-SUFFIX,www123.lol\nDOMAIN-SUFFIX,x3av.com\nDOMAIN-SUFFIX,xbffh.swwlt15.xyz\nDOMAIN-SUFFIX,xds2435u23422342342u.top\nDOMAIN-SUFFIX,xg3.mingapi.top\nDOMAIN-SUFFIX,xhkan.top\nDOMAIN-SUFFIX,xiaoyakankan.com\nDOMAIN-SUFFIX,xingba111.com\nDOMAIN-SUFFIX,xmu.ezgdtehh.com\nDOMAIN-SUFFIX,xmu.gpcqqmsof.cc\nDOMAIN-SUFFIX,xn--0810-3cc-i30mr40izsbt77d4ir52ihu1g.zilitv64.cfd\nDOMAIN-SUFFIX,xn--39s42yy7t.jyelemeniotech.xyz\nDOMAIN-SUFFIX,xn--4ru826c.sndag137.cc\nDOMAIN-SUFFIX,xn--6-tf2b.qingfupo02.xyz\nDOMAIN-SUFFIX,xn--9hsjt4-9k8ope792un7wa.hnsxdnyjyjcyjfkzx.org\nDOMAIN-SUFFIX,xn--b33a.lzytv.cfd\nDOMAIN-SUFFIX,xn--iv2-91dsvodcom-s17vt13e90o4m0gi5r.xn--91shen-cy3k.com\nDOMAIN-SUFFIX,xn--kpu43ihs1c.psbolddeltaco.site\nDOMAIN-SUFFIX,xn--na2p7xwb-c49lv242bjvej40e.yjlamc.com\nDOMAIN-SUFFIX,xn--pg3-chimei100-com-7483af92d.chimei69.com\nDOMAIN-SUFFIX,xrpm.eu.cc\nDOMAIN-SUFFIX,xsd.sdzyapi.com\nDOMAIN-SUFFIX,xts.mtyx4.beer\nDOMAIN-SUFFIX,xx01.com\nDOMAIN-SUFFIX,xxavs.com\nDOMAIN-SUFFIX,xxyy5.cfd\nDOMAIN-SUFFIX,xyjc8.cfd\nDOMAIN-SUFFIX,yese.co\nDOMAIN-SUFFIX,yeshe.tv\nDOMAIN-SUFFIX,yidouge.com\nDOMAIN-SUFFIX,youavhub.com\nDOMAIN-SUFFIX,yparse.ik9.cc\nDOMAIN-SUFFIX,ysd.yinsd1.sbs\nDOMAIN-SUFFIX,ysurl.win\nDOMAIN-SUFFIX,z01.zgtv.online\nDOMAIN-SUFFIX,z1.m1907.top\nDOMAIN-SUFFIX,zh.cam4.com\nDOMAIN-SUFFIX,zh.xhamster1.desi\nDOMAIN-SUFFIX,zhuiju666.com\nDOMAIN-SUFFIX,zhuiying8.cc\nDOMAIN-SUFFIX,zju.gpcqqmsof.cc\nDOMAIN-SUFFIX,zndy.top\nDOMAIN-SUFFIX,znys.top\nDOMAIN-SUFFIX,zrq.jsaa100.vip\nDOMAIN-SUFFIX,zsrqab03.zsrenqi.xyz\nDOMAIN-SUFFIX,zzrs.mfdyvip.com";
const VOD_PROXY_TEXT = "DOMAIN-SUFFIX,06sw.4k998b.com\nDOMAIN-SUFFIX,1.xiuxxxxxiu.cc\nIP-CIDR,103.51.147.112/32,no-resolve\nIP-CIDR,104.233.159.136/32,no-resolve\nIP-CIDR,122.10.20.249/32,no-resolve\nDOMAIN-SUFFIX,14sn.1psisk.com\nDOMAIN-SUFFIX,17e.ueiqau.com\nDOMAIN-SUFFIX,18bb.sxyjspsc.com\nIP-CIDR,195.225.24.128/32,no-resolve\nIP-CIDR,198.44.248.101/32,no-resolve\nIP-CIDR,198.44.248.102/32,no-resolve\nDOMAIN-SUFFIX,2gaw.vbjtex.com\nDOMAIN-SUFFIX,2tcw6dekfnvzcai.wckz813.vip\nDOMAIN-SUFFIX,3642.7rnr.com\nIP-CIDR,43.248.128.122/32,no-resolve\nDOMAIN-SUFFIX,4sbase64.dt188.site\nDOMAIN-SUFFIX,50hd.gkrle7.com\nDOMAIN-SUFFIX,51papaya-api.b-cdn.net\nDOMAIN-SUFFIX,64gb.ng4fwv.com\nDOMAIN-SUFFIX,82729mka.jzac401.vip\nDOMAIN-SUFFIX,94xhn.pt6nth.com\nDOMAIN-SUFFIX,96g.l9hmi1.com\nDOMAIN-SUFFIX,98zy.vip\nDOMAIN-SUFFIX,abc.hdfby.com\nDOMAIN-SUFFIX,acs.youku.com\nDOMAIN-SUFFIX,adjust.cbpjoocbe.com\nDOMAIN-SUFFIX,adjust.gtrazibvz.com\nDOMAIN-SUFFIX,alone.cmxzettb.com\nDOMAIN-SUFFIX,api-edge.myfreecams.com\nDOMAIN-SUFFIX,api-read.qmplaylet.com\nDOMAIN-SUFFIX,api-store.qmplaylet.com\nDOMAIN-SUFFIX,api.apii.top\nDOMAIN-SUFFIX,api.asmr-100.com\nDOMAIN-SUFFIX,api.asmr-200.com\nDOMAIN-SUFFIX,api.asmr-300.com\nDOMAIN-SUFFIX,api.asmr.one\nDOMAIN-SUFFIX,api.ddapi.cc\nDOMAIN-SUFFIX,api.douapi.cc\nDOMAIN-SUFFIX,api.guangsuapi.com\nDOMAIN-SUFFIX,api.hclyz.com\nDOMAIN-SUFFIX,api.heiapi.cc\nDOMAIN-SUFFIX,api.live.bilibili.com\nDOMAIN-SUFFIX,api.pandalive.co.kr\nDOMAIN-SUFFIX,api.sorani.cc\nDOMAIN-SUFFIX,api.souavzyw.net\nDOMAIN-SUFFIX,api.vipmisss.com\nDOMAIN-SUFFIX,api.wujinapi.cc\nDOMAIN-SUFFIX,api.xinlangapi.com\nDOMAIN-SUFFIX,app.whjzjx.cn\nDOMAIN-SUFFIX,artistpicserver.kuwo.cn\nDOMAIN-SUFFIX,b.hdfby.com\nDOMAIN-SUFFIX,b.hdfby.net\nDOMAIN-SUFFIX,b.hdfby.org\nDOMAIN-SUFFIX,bf.xoxowin86cisyap.com\nDOMAIN-SUFFIX,bfq.937auth.vip\nDOMAIN-SUFFIX,bfzyapi.com\nDOMAIN-SUFFIX,bkpk82.baokuanpk.cc\nDOMAIN-SUFFIX,bmc2.imgclh.com\nDOMAIN-SUFFIX,c-you.hair\nDOMAIN-SUFFIX,caiji.dbzy.tv\nDOMAIN-SUFFIX,catsta.tingqian.top\nDOMAIN-SUFFIX,cdn.shorttv.online\nDOMAIN-SUFFIX,cdz.rkfwzdc.com\nDOMAIN-SUFFIX,chaturbate.com\nDOMAIN-SUFFIX,citapa.com\nDOMAIN-SUFFIX,cj.lziapi.com\nDOMAIN-SUFFIX,clw.jzac492.vip\nDOMAIN-SUFFIX,cn5s.afuuwy.com\nDOMAIN-SUFFIX,cssy1.nb184a.com\nDOMAIN-SUFFIX,d3oi.b0138j.com\nDOMAIN-SUFFIX,d50.l2ukrb.com\nDOMAIN-SUFFIX,dag29jmgma1g.site\nDOMAIN-SUFFIX,dash.madou.club\nDOMAIN-SUFFIX,data.7wzx9.com\nDOMAIN-SUFFIX,dc.bz.mgtv.com\nDOMAIN-SUFFIX,edge-hls.growcdnssedge.com\nDOMAIN-SUFFIX,edge-hls.sacfedge.com\nDOMAIN-SUFFIX,error.papaya\nDOMAIN-SUFFIX,esi.vobis8e.com\nDOMAIN-SUFFIX,f00.515355.xyz\nDOMAIN-SUFFIX,fdzys.net\nDOMAIN-SUFFIX,fofo22.com\nDOMAIN-SUFFIX,fourhoi.com\nDOMAIN-SUFFIX,fs-im-kefu.7moor-fs1.com\nDOMAIN-SUFFIX,fy-musicbox-api.mu-jie.cc\nDOMAIN-SUFFIX,g3h4i5j6.ybhz51.cc\nDOMAIN-SUFFIX,g70j.bbkjtp.com\nDOMAIN-SUFFIX,gdcm.com\nDOMAIN-SUFFIX,gimg0.baidu.com\nDOMAIN-SUFFIX,gs4i.1unnk5.com\nDOMAIN-SUFFIX,gzmefhxknvzcai.wckz820.vip\nDOMAIN-SUFFIX,h05j.883rm9.com\nDOMAIN-SUFFIX,h1cs.i8jajp.com\nDOMAIN-SUFFIX,hanime1.me\nDOMAIN-SUFFIX,hao20.110ztv.com\nDOMAIN-SUFFIX,heiliaozyapi.com\nDOMAIN-SUFFIX,hhzyapi.com\nDOMAIN-SUFFIX,huyaimg.msstatic.com\nDOMAIN-SUFFIX,ig2.pppppppp.top\nDOMAIN-SUFFIX,iin.wckk799.vip\nDOMAIN-SUFFIX,image.tmdb.org\nDOMAIN-SUFFIX,images.yxdesign.art\nDOMAIN-SUFFIX,img.freepik.com\nDOMAIN-SUFFIX,img.youtube.com\nDOMAIN-SUFFIX,img1.kuwo.cn\nDOMAIN-SUFFIX,inews.gtimg.com\nDOMAIN-SUFFIX,jable.sbs\nDOMAIN-SUFFIX,jable.tv\nDOMAIN-SUFFIX,javhd.com\nDOMAIN-SUFFIX,jdforrepam.com\nDOMAIN-SUFFIX,ji17df5a.xn--7jw54o.net\nDOMAIN-SUFFIX,jiexi44.qmbo.cn\nDOMAIN-SUFFIX,jptt.tv\nDOMAIN-SUFFIX,jsaa100.vip\nDOMAIN-SUFFIX,json.fongmi.cc\nDOMAIN-SUFFIX,jsqp.wcyqdfy.com\nDOMAIN-SUFFIX,jszyapi.com\nDOMAIN-SUFFIX,juok3.top\nDOMAIN-SUFFIX,jvx.i3ubxvj.com\nDOMAIN-SUFFIX,jx.kptv.us\nDOMAIN-SUFFIX,jx.m3u8.tv\nDOMAIN-SUFFIX,jx.nnxv.cn\nDOMAIN-SUFFIX,jx.parwix.com\nDOMAIN-SUFFIX,k7l8m9n0.djyz51.cc\nDOMAIN-SUFFIX,kanliao2.one\nDOMAIN-SUFFIX,kfsoahubdsjson.qxdlawyer.com\nDOMAIN-SUFFIX,kjjsaas-sh.oss-cn-shanghai.aliyuncs.com\nDOMAIN-SUFFIX,kkb1.sixniceezsx.xyz\nDOMAIN-SUFFIX,kuailezhuiju2.com\nDOMAIN-SUFFIX,kwmdmmsp.hongtaitanghua.com\nDOMAIN-SUFFIX,lbapiby.com\nDOMAIN-SUFFIX,live.cdn.huya.com\nDOMAIN-SUFFIX,lk1.supremejav.com\nDOMAIN-SUFFIX,logo.saodu.work\nDOMAIN-SUFFIX,m.892539.xyz\nDOMAIN-SUFFIX,m.artxyzy.com\nDOMAIN-SUFFIX,m.nmshop.net\nDOMAIN-SUFFIX,m.sdzhgt.com\nDOMAIN-SUFFIX,m3m.1vkx.cn\nDOMAIN-SUFFIX,m3u8.apiyhzy.com\nDOMAIN-SUFFIX,maihaolian.com\nDOMAIN-SUFFIX,mapsjbogs.hongtaitanghua.com\nDOMAIN-SUFFIX,mcspapp.5g.wasu.tv\nDOMAIN-SUFFIX,miget-1313189639.cos.ap-guangzhou.myqcloud.com\nDOMAIN-SUFFIX,minidrama-api.contentchina.com\nDOMAIN-SUFFIX,missav.ai\nDOMAIN-SUFFIX,missav.live\nDOMAIN-SUFFIX,missav.ws\nDOMAIN-SUFFIX,missav02.xyz\nDOMAIN-SUFFIX,mmzp18.lol\nDOMAIN-SUFFIX,mp4.djuu.com\nDOMAIN-SUFFIX,mvimg.kaibmy.com\nDOMAIN-SUFFIX,n5nn56n5n6n.foshanshow.com\nDOMAIN-SUFFIX,netflixgc.net\nDOMAIN-SUFFIX,nmobi.kuwo.cn\nDOMAIN-SUFFIX,ok.70066.cc\nDOMAIN-SUFFIX,okxxx.art\nDOMAIN-SUFFIX,osstexll.oss-rg-china-mainland.aliyuncs.com\nDOMAIN-SUFFIX,ottphoto.daoran.tv\nDOMAIN-SUFFIX,pektino.com\nDOMAIN-SUFFIX,phbobyhxsyymolsmyzmq.supabase.co\nDOMAIN-SUFFIX,pianku.api.mgtv.com\nDOMAIN-SUFFIX,pic.892539.xyz\nDOMAIN-SUFFIX,pic.rmb.bdstatic.com\nDOMAIN-SUFFIX,pic.xustgq.cn\nDOMAIN-SUFFIX,pic2.tupian.click\nDOMAIN-SUFFIX,pl3.vvvvvvvv.top\nDOMAIN-SUFFIX,py.fzcrym.link\nDOMAIN-SUFFIX,qdi7v5nvzcai.wckz820.vip\nDOMAIN-SUFFIX,qkys.qukanwh.com\nDOMAIN-SUFFIX,qswyt4444.com\nDOMAIN-SUFFIX,qxxadannvzcai.wckz813.vip\nDOMAIN-SUFFIX,qzdjj804.qzdjj2.my\nDOMAIN-SUFFIX,raw.shorttv.online\nDOMAIN-SUFFIX,ryoz487.mmyy25.top\nDOMAIN-SUFFIX,sf1-cdn-tos.huoshanstatic.com\nDOMAIN-SUFFIX,skr.skr2.cc\nDOMAIN-SUFFIX,skr2.cc\nDOMAIN-SUFFIX,solo.paishexianchang.site\nDOMAIN-SUFFIX,spfm.xn--49sx5y1jln6s.cn\nDOMAIN-SUFFIX,spiderscloudcn2.51111666.com\nDOMAIN-SUFFIX,store.externulls.com\nDOMAIN-SUFFIX,stream-hua.hangbo.xyz\nDOMAIN-SUFFIX,stream.lingqi.co\nDOMAIN-SUFFIX,stream.yxdesign.art\nDOMAIN-SUFFIX,streamtape.com\nDOMAIN-SUFFIX,subocaiji.com\nDOMAIN-SUFFIX,suoniapi.com\nDOMAIN-SUFFIX,supjav.com\nDOMAIN-SUFFIX,svip.bljiex.cc\nDOMAIN-SUFFIX,t.5gcdn.xyz\nDOMAIN-SUFFIX,tg.rhpeda.com\nDOMAIN-SUFFIX,tgqp.rhpeda.com\nDOMAIN-SUFFIX,thumbs.externulls.com\nDOMAIN-SUFFIX,u.shytkjgs.com\nDOMAIN-SUFFIX,u3v4w5x6.qisegu52.cc\nDOMAIN-SUFFIX,v.70066.cc\nDOMAIN-SUFFIX,v267dtgnvzcai.wckz820.vip\nDOMAIN-SUFFIX,vcache.mjrlin.cn\nDOMAIN-SUFFIX,vd2.bdstatic.com\nDOMAIN-SUFFIX,video.beeg.com\nDOMAIN-SUFFIX,video.externulls.com\nDOMAIN-SUFFIX,vip.wwgz.cn\nDOMAIN-SUFFIX,vods3.epobwsreb383eyq2bi.com\nDOMAIN-SUFFIX,vqh.z4shq2v.com\nDOMAIN-SUFFIX,vres.cyscyy.com\nDOMAIN-SUFFIX,vres.zyxpedu.com\nDOMAIN-SUFFIX,vwlyxvsnvzcai.wckz813.vip\nDOMAIN-SUFFIX,wechat.daoran.tv\nDOMAIN-SUFFIX,wjizxlxa2.com\nDOMAIN-SUFFIX,wlq.pmjqlw8.com\nDOMAIN-SUFFIX,wstgpic.bdpsjp.com\nDOMAIN-SUFFIX,wsyzy.vip\nDOMAIN-SUFFIX,ww.jiujiu.one\nDOMAIN-SUFFIX,www.8090.la\nDOMAIN-SUFFIX,www.cd-zj.com\nDOMAIN-SUFFIX,www.china-eae.com\nDOMAIN-SUFFIX,www.ct0592.com\nDOMAIN-SUFFIX,www.dantatv.cc\nDOMAIN-SUFFIX,www.ddys24.com\nDOMAIN-SUFFIX,www.hebeigoogle.com\nDOMAIN-SUFFIX,www.hhkan2.com\nDOMAIN-SUFFIX,www.huaqi.live\nDOMAIN-SUFFIX,www.huyaapi.com\nDOMAIN-SUFFIX,www.iyf.lv\nDOMAIN-SUFFIX,www.jable.tv\nDOMAIN-SUFFIX,www.jdzsm.cn\nDOMAIN-SUFFIX,www.jibcmjp.com\nDOMAIN-SUFFIX,www.jxuma.com\nDOMAIN-SUFFIX,www.knvod.com\nDOMAIN-SUFFIX,www.lmlgdjr.com\nDOMAIN-SUFFIX,www.m4560.com\nDOMAIN-SUFFIX,www.maihaolian.com\nDOMAIN-SUFFIX,www.mjtechinstall.com\nDOMAIN-SUFFIX,www.newhttestre666.cc\nDOMAIN-SUFFIX,www.nht966hht.vip\nDOMAIN-SUFFIX,www.pangujiexi.com\nDOMAIN-SUFFIX,www.playm3u8.cn\nDOMAIN-SUFFIX,www.pornlulu.net\nDOMAIN-SUFFIX,www.qwnull.com\nDOMAIN-SUFFIX,www.shanxihighway.com\nDOMAIN-SUFFIX,www.skr.cc\nDOMAIN-SUFFIX,www.skr2.cc\nDOMAIN-SUFFIX,www.uaa001.com\nDOMAIN-SUFFIX,www.webstar.cn\nDOMAIN-SUFFIX,www.wwgz.cn\nDOMAIN-SUFFIX,www.xamddegree.com\nDOMAIN-SUFFIX,www.xuniangfin.info\nDOMAIN-SUFFIX,www.yikucun.com\nDOMAIN-SUFFIX,www.yssm5.xyz\nDOMAIN-SUFFIX,wzzqlm.erbaiwulaoge.com\nDOMAIN-SUFFIX,xhs0.l34zkw.com\nDOMAIN-SUFFIX,xiang512.xiang.party\nDOMAIN-SUFFIX,xifan-api-cn.youlishipin.com\nDOMAIN-SUFFIX,xn--0809-kb2g560h.jpsn47.top\nDOMAIN-SUFFIX,xn--2p1a.bfapi.cyou\nDOMAIN-SUFFIX,xn--8o6a.crwhg.buzz\nDOMAIN-SUFFIX,xn--b4w04e.ysxysp.buzz\nDOMAIN-SUFFIX,xn--ewr.211997.xyz\nDOMAIN-SUFFIX,xqjurgek.top\nDOMAIN-SUFFIX,xqxq1.cc\nDOMAIN-SUFFIX,yan.llydy53.cc\nDOMAIN-SUFFIX,yaselulu.autos\nDOMAIN-SUFFIX,yg81.bpy0rd.com\nDOMAIN-SUFFIX,yparse.jn1.cc\nDOMAIN-SUFFIX,zh.pikpedcams.com\nDOMAIN-SUFFIX,zh.stripchat.com\nDOMAIN-SUFFIX,zh.stripchat.global\nDOMAIN-SUFFIX,zh.stripol.com\nDOMAIN-SUFFIX,zh.virtualtaboo.live\nDOMAIN-SUFFIX,zlys9.top\nDOMAIN-SUFFIX,zy.baipiaozhe.com\nDOMAIN-SUFFIX,zzoc.cc\nDOMAIN-SUFFIX,zzztool.com\nDOMAIN-SUFFIX,91porn.com\nDOMAIN-SUFFIX,bad.news\nDOMAIN-SUFFIX,beeg.com\nDOMAIN-SUFFIX,madou.club\nDOMAIN-SUFFIX,rou.video\nDOMAIN-SUFFIX,t.me\nDOMAIN-SUFFIX,wanwuu.github.io\nDOMAIN-SUFFIX,www.eporner.com\nDOMAIN-SUFFIX,www.pornhub.com\nDOMAIN-SUFFIX,www.tnaflix.com\nDOMAIN-SUFFIX,www.xvideos.com\nDOMAIN-SUFFIX,x.com";

function __set(text) {
  var m = {};
  var a = text.split("\n");
  for (var i = 0; i < a.length; i++) { m[a[i].split(',')[1]] = 1; }
  return m;
}

// 策略插在参数之后、no-resolve 之前：IP-CIDR,x/32,策略,no-resolve
function __rule(line, policy) {
  var p = String(line).split(',');
  var args = p.slice(1), keep = [], flags = [];
  for (var i = 0; i < args.length; i++) {
    if (/^(no-resolve|interrupt-rule)$/i.test(args[i])) flags.push(args[i]);
    else keep.push(args[i]);
  }
  return [p[0]].concat(keep).concat([policy]).concat(flags).join(',');
}

var VOD_DIRECT_SET = __set(VOD_DIRECT_TEXT);
var VOD_PROXY_SET = __set(VOD_PROXY_TEXT);

// 策略名是否真实存在（防止 mihomo 报 proxy [xxx] not found）
function __known(config, name) {
  if (name === 'DIRECT' || name === 'REJECT' || name === 'PASS' || name === 'GLOBAL' || name === 'COMPATIBLE') return true;
  var g = config['proxy-groups'] || [], p = config['proxies'] || [];
  for (var i = 0; i < g.length; i++) { if (g[i] && g[i].name === name) return true; }
  for (var j = 0; j < p.length; j++) { if (p[j] && p[j].name === name) return true; }
  var pp = config['proxy-providers'] || {}, k;
  for (k in pp) { if (Object.prototype.hasOwnProperty.call(pp, k) && k === name) return true; }
  return false;
}

function main(config) {
  config.rules = config.rules || [];
  var groups = config['proxy-groups'] || [];

  var embyName = 'Emby直连';
  var embyFinal = null;
  var target = 'DIRECT';
  for (var i = 0; i < groups.length; i++) {
    var g = groups[i];
    if (!g || !g.name) continue;
    if (g.name === 'GLOBAL' || g.name === 'DIRECT' || g.name === 'REJECT' || g.name === 'PASS') continue;
    if (target === 'DIRECT') target = g.name;
    if (/选择|节点|自动|代理|proxy/i.test(g.name)) { target = g.name; break; }
  }

  // ---------- 1. Emby / 内网直连（优先级最高，放最前） ----------
  if (ruleOptionsEnable.Emby直连 !== false) {
    var embyPol = (typeof embyTarget === 'string' && embyTarget !== '' && embyTarget !== 'DIRECT') ? embyTarget : 'DIRECT';

    // 只有指定了自建组才创建；指向 DIRECT 时不建组，少一个失败点
    if (embyPol !== 'DIRECT') {
      var embyGroup = null;
      for (var z = 0; z < groups.length; z++) {
        if (groups[z] && groups[z].name === embyPol) embyGroup = groups[z];
      }
      if (!embyGroup) {
        groups.push({ name: embyPol, type: 'select', proxies: ['DIRECT'] });
      } else if (embyGroup.proxies && embyGroup.proxies.indexOf('DIRECT') === -1) {
        embyGroup.proxies.push('DIRECT');
      }
      config['proxy-groups'] = groups;
    }

    var embyRules = ['DOMAIN-SUFFIX,emby.pcshe.com,' + embyPol];
    var embyHosts = { 'emby.pcshe.com': 1 };
    embyRules.push('IP-CIDR,192.168.0.0/16,' + embyPol + ',no-resolve');
    embyRules.push('IP-CIDR,10.0.0.0/8,' + embyPol + ',no-resolve');
    embyHosts['192.168.0.0/16'] = 1;
    embyHosts['10.0.0.0/8'] = 1;
    for (var a = 0; a < embyServerIps.length; a++) {
      var cidr = embyServerIps[a] + '/32';
      embyRules.push('IP-CIDR,' + cidr + ',' + embyPol + ',no-resolve');
      embyHosts[cidr] = 1;
    }

    var rest0 = [];
    var old0 = config.rules;
    for (var b = 0; b < old0.length; b++) {
      var q = String(old0[b]).split(',');
      if (q[q.length - 1] === embyName || q[2] === embyName) continue;
      if ((q[0] === 'DOMAIN-SUFFIX' || q[0] === 'IP-CIDR') && embyHosts[q[1]]) continue;
      rest0.push(old0[b]);
    }
    config.rules = rest0;
    embyFinal = embyRules;   // 留到最后再 prepend，保证 Emby/内网规则在最前

    // 自建节点加 DIRECT 兜底（Emby 走裸 IP 播放时不经规则匹配）
    if (config['proxies'] && Object.prototype.toString.call(config['proxies']) === '[object Array]') {
      for (var c = 0; c < config['proxies'].length; c++) {
        var px = config['proxies'][c];
        if (!px || px.name === 'DIRECT' || px.name === 'REJECT' || px.name === 'PASS') continue;
        if (px.type === 'direct') continue;
        var ds = px['DirectServers'] || [];
        var dp = px['DirectProxies'] || [];
        var changed = false;
        if (ds.indexOf('DIRECT') === -1) { ds.push('DIRECT'); changed = true; }
        if (dp.indexOf('DIRECT') === -1) { dp.push('DIRECT'); changed = true; }
        if (changed) { px['DirectServers'] = ds; px['DirectProxies'] = dp; }
      }
    }
    config['proxy-groups'] = groups;
  }

  // ---------- 2. 影视站分流 ----------
  if (ruleOptionsEnable.影视分流 !== false) {
    var t2 = __known(config, target) ? target : 'DIRECT';
    var mine = [];
    var da = VOD_DIRECT_TEXT.split("\n");
    for (var d = 0; d < da.length; d++) mine.push(__rule(da[d], 'DIRECT'));
    var pa = VOD_PROXY_TEXT.split("\n");
    for (var e = 0; e < pa.length; e++) mine.push(__rule(pa[e], t2));

    var rest1 = [];
    var old1 = config.rules;
    for (var f = 0; f < old1.length; f++) {
      var r = String(old1[f]).split(',');
      if (r[0] === 'DOMAIN-SUFFIX' || r[0] === 'IP-CIDR') {
        if (VOD_DIRECT_SET[r[1]] || VOD_PROXY_SET[r[1]]) continue;
      }
      rest1.push(old1[f]);
    }
    config.rules = mine.concat(rest1);
  }

  // ---------- 3. 可选：强制开 TUN ----------
  if (ruleOptionsEnable.内网TUN === true) {
    config['tun'] = config['tun'] || {};
    config['tun']['enable'] = true;
    config['tun']['stack'] = config['tun']['stack'] || 'system';
    config['tun']['dns-hijack'] = config['tun']['dns-hijack'] || ['any:53'];
    config['tun']['auto-route'] = true;
  }

  // Emby/内网规则置顶（优先于影视清单与订阅自带规则）
  if (embyFinal) config.rules = embyFinal.concat(config.rules);

  return config;
}
