import * as types from '../mutation_types'

const state = {
    dark: Boolean(JSON.parse(localStorage.getItem('theme'))) || false,
    tools: [
        {
            title: '铭文工具',
            icon: 'layers-outline',
            social: false,
            list: [
                {
                    name: '批量铭刻',
                    path: '/批量铭刻',
                    desc: '开发中敬请期待...',
                    icon: 'https://p198.p4.n0.cdn.getcloudapp.com/items/Wnu68epP/876a7cd5-e474-41f7-9fd6-8484cd1db723.jpg',
                    link: false,
                    hot: 'dev',
                    linkUrl: ''
                },
                {
                    name: '批量转账',
                    path: '/批量转账',
                    desc: '开发中敬请期待...',
                    hot: 'dev',
                    icon: 'https://p198.p4.n0.cdn.getcloudapp.com/items/Wnu68epP/876a7cd5-e474-41f7-9fd6-8484cd1db723.jpg',
                    link: false,
                    linkUrl: ''
                },
                {
                    name: '查询余额',
                    path: '/查询余额',
                    hot: 'dev',
                    desc: '开发中敬请期待...',
                    icon: 'https://p198.p4.n0.cdn.getcloudapp.com/items/Wnu68epP/876a7cd5-e474-41f7-9fd6-8484cd1db723.jpg',
                    link: false,
                    linkUrl: ''
                },
                {
                    name: '专业K线',
                    path: '/专业K线',
                    hot: 'dev',
                    desc: '开发中敬请期待...',
                    icon: 'https://p198.p4.n0.cdn.getcloudapp.com/items/Wnu68epP/876a7cd5-e474-41f7-9fd6-8484cd1db723.jpg',
                    link: false,
                    linkUrl: ''
                }
            ]
        },
        {
            title: '官方生态',
            icon: 'home-outline',
            social: true,
            list: [
                {
                    name: 'FacetSwap',
                    path: '/FacetSwap',
                    desc: '一个使用Facet-VM创建的去中心化交易所，专注于代币拆分和交易。',
                    icon: 'https://pbs.twimg.com/profile_images/1732108435984891905/_q-GabNY_400x400.jpg',
                    link: true,
                    twitter: "https://twitter.com/0xFacet",
                    github: "https://github.com/0xFacet",
                    telegram: "https://t.me/ethscriptionsglobal",
                    linkUrl: 'https://facetswap.com/'
                },
                {
                    name: 'FacetScan',
                    path: '/FacetScan',
                    desc: 'Facet-VM扩容系统链上查询浏览器。',
                    icon: 'https://pbs.twimg.com/profile_images/1732108435984891905/_q-GabNY_400x400.jpg',
                    link: true,
                    twitter: "https://twitter.com/0xFacet",
                    github: "https://github.com/0xFacet/facet-scan",
                    telegram: "https://t.me/ethscriptionsglobal",
                    linkUrl: 'https://facetscan.com/'
                },
                {
                    name: 'FacetCard',
                    path: '/FacetCard',
                    desc: '基于Facet构建的域名系统。',
                    icon: 'https://pbs.twimg.com/profile_images/1732108435984891905/_q-GabNY_400x400.jpg',
                    link: true,
                    twitter: "https://twitter.com/0xFacet",
                    github: "https://github.com/0xFacet",
                    telegram: "https://t.me/ethscriptionsglobal",
                    linkUrl: 'https://facetcards.com/'
                }
            ]
        },
        {
            title: 'Ethscriptions交易',
            icon: 'swap-outline',
            social: true,
            list: [
                {
                    name: 'FacetSwap',
                    path: '/FacetSwap',
                    desc: '一个使用Facet-VM创建的去中心化交易所，专注于代币拆分和交易。',
                    icon: 'https://pbs.twimg.com/profile_images/1732108435984891905/_q-GabNY_400x400.jpg',
                    link: true,
                    twitter: "https://twitter.com/0xFacet",
                    github: "https://github.com/0xFacet",
                    telegram: "https://t.me/ethscriptionsglobal",
                    linkUrl: 'https://facetswap.com/'
                }, {
                    name: '欧易Dex',
                    path: '/欧易Dex',
                    desc: '欧易DEX 是 DEX 和跨链交易聚合器，帮助用户找到链上最佳流动性，轻松交易任何资产。欧易 DEX 通过智能路由算法，在多链和跨链的场景下自动计算最优交易路径，为用户提供更低滑点、更少网络费用的报价。 ',
                    icon: 'https://pbs.twimg.com/profile_images/1717240577673383937/cBOOkgkn_400x400.jpg',
                    link: true,
                    twitter: "https://twitter.com/okxweb3",
                    github: "",
                    telegram: "",
                    linkUrl: 'https://www.okx.com/cn/web3/dex-swap#inputChain=1&inputCurrency=ETH&outputChain=1&outputCurrency=facet_0x55ab0390a89fed8992e3affbf61d102490735e24'
                }, {
                    name: 'Etch market',
                    path: '/Etch',
                    desc: '在领先的Ethscriptions平台上，用户可以低成本地交易代币、NFT和域名，费用仅为其他平台的1/40。',
                    icon: 'https://pbs.twimg.com/profile_images/1673947127100370945/B3ZJeoQl_400x400.png',
                    link: true,
                    twitter: "https://twitter.com/EtchMarket",
                    github: "",
                    telegram: "",
                    linkUrl: 'https://www.etch.market/'
                }, {
                    name: 'Ethsmarket',
                    path: '/Ethsmarket',
                    desc: '一个为Ethscriptions构建基础架构的平台，专注于代币铭刻、拆分和交易。',
                    icon: 'https://www.ethsmarket.xyz/static/media/eth_logo.1d054256526ec2fdfff5.png',
                    link: true,
                    twitter: "https://twitter.com/ethsmarket",
                    github: "",
                    telegram: "",
                    linkUrl: 'https://www.ethsmarket.xyz/'
                }, {
                    name: 'Bit Cex',
                    path: '/Bit',
                    desc: 'BIT是世界级加密货币交易平台，提供建立在专业性和安全性之上的加密期权和永续交易',
                    icon: 'https://pbs.twimg.com/profile_images/1596016409993412609/_Jjxqddq_400x400.jpg',
                    link: true,
                    twitter: "https://twitter.com/Bitcom_Asia",
                    github: "",
                    telegram: "https://t.me/bitcom_exchange_cn",
                    linkUrl: 'https://www.bit.com/spot?pair=ETHS-USDT'
                }, {
                    name: 'Gate.io Cex',
                    path: '/Gate',
                    desc: 'Gate.io芝麻開門創立於2013年，是全球真實交易量TOP10的加密貨幣交易平臺，向全球數千萬用戶提供安全可靠、真實透明的數字資產交易服務。',
                    icon: 'https://pbs.twimg.com/profile_images/1743170428976435201/dScO_nkW_400x400.jpg',
                    link: true,
                    twitter: "https://twitter.com/gate_io",
                    github: "",
                    telegram: "https://t.me/gateio_en",
                    linkUrl: 'https://www.gate.io/zh/trade/ETHS_USDT'
                }, {
                    name: 'BitMart Cex',
                    path: '/BitMart',
                    desc: 'BitMart是一家为个人和专业机构精心打造的合规数字资产交易平台。我们的使命是打造全球顶级数字资产交易系统，为全球用户提供高效，公平，透明的数字资产金融服务。',
                    icon: 'https://pbs.twimg.com/profile_images/1744378480035262467/PvJ9Wrvt_400x400.jpg',
                    link: true,
                    twitter: "https://twitter.com/BitMartExchange",
                    github: "",
                    telegram: "https://t.me/BitMartExchange",
                    linkUrl: 'https://www.bitmart.com/trade/en-US?symbol=ETHS_USDT'
                },
            ]
        },
        {
            title: '链游项目',
            icon: 'layers-outline',
            social: true,
            list: [
                {
                    name: 'Uncharted Lands X',
                    path: '/Uncharted',
                    desc: 'The first and best game on Ethscriptions',
                    icon: 'https://pbs.twimg.com/profile_images/1735336711679508480/xj9VYW8w_400x400.jpg',
                    link: true,
                    twitter: "https://twitter.com/UnchartedLandsx",
                    github: "",
                    telegram: "https://t.me/UnchartedLandsX",
                    linkUrl: 'https://www.unchartedlandsx.xyz/'
                }
            ]
        },
        {
            title: '网站相关',
            icon: 'settings-2-outline',
            social: false,
            list: [
                {
                    name: '网站设置',
                    path: '/setting',
                    desc: '个性化设置网站样式',
                    icon: 'https://img2.baidu.com/it/u=453886478,457507664&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
                    link: false,
                    linkUrl: 'https://www.unchartedlandsx.xyz/'
                },
                {
                    name: '工具隐藏',
                    path: '/hide_tool',
                    desc: '隐藏不需要的工具',
                    icon: 'https://img1.baidu.com/it/u=3414662183,3728590029&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
                    link: false,
                    linkUrl: ''
                },
                {
                    name: '友情链接',
                    path: '/links',
                    desc: '查看Ethscriptions协议相关链接',
                    icon: 'https://img.ixintu.com/download/jpg/201912/27b083a4cdae308f76588e6deee9fca8.jpg%21con',
                    link: false,
                    linkUrl: ''
                }
            ]
        }
    ],
    lang: localStorage.getItem("lang") || "zh",
    isLogin: Boolean(JSON.parse(localStorage.getItem('loginStatus'))) || false,
    isAdminLogin: localStorage.getItem('AdminLogin') || false,
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {},
    systemInfo: {},
    walletInfo: {},
    userAddress: localStorage.getItem('walletAddress') || '',
    web3Bean: {
        isInjected: false,
        web3Instance: null,
        networkId: null,
        coinbase: null,
        balance: null,
        error: null,
        net: {
            chainId: null,
            networkId: null,
            chainName: null,
            gas_price: null,
        },
        account: {
            address: null,
            balance: null
        },
    },
    inviteCode: localStorage.getItem('inviteCode') || {},
    invitationInfo: localStorage.getItem('invitationInfo') != null && localStorage.getItem('invitationInfo') !== '' ? JSON.parse(localStorage.getItem('invitationInfo')) : {
        teamCount: 0,
        authStatus: 0,
        invitationList: []
    },
    userPerformanceList: {}
}

const mutations = {
    SET_STORE(state, n) {
        if (_.isArray(n.value)) {
            n.value = Array.from(n.value);
        }
        if (_.isObject(n.value)) {
            n.value = _.chain(n.value)
                .assign()
                .value();
        }
        state = _.chain(state)
            .set(n.key, n.value)
            .value();
    },
    [types.LANG]: (state, val) => {
        state.lang = val
        state.lang = val
        localStorage.setItem('lang', val)
    },
    [types.WEB3BEAN]: (state, val) => {
        state.web3Bean = val
    },
    [types.LOGIN_STATUS]: (state, val) => {
        state.isLogin = val
    },
    [types.ADMIN_LOGIN_STATUS]: (state, val) => {
        state.isAdminLogin = val
    },
    [types.USER_INFO]: (state, val) => {
        state.userInfo = val
    },
    [types.WALLET_INFO]: (state, val) => {
        state.walletInfo = val
    },
    [types.SET_TRON_WEB]: (state, val) => {
        state.tronWeb = val
    },
    [types.SET_USER_ADDRESS]: (state, val) => {
        state.userAddress = val
    },
    [types.SET_INVITE_ADDRESS]: (state, val) => {
        localStorage.setItem('inviteCode', val)
        state.inviteCode = val
    },
    [types.INVITATION_INFO]: (state, val) => {
        state.invitationInfo = val
    },
    [types.SYSTEM_INFO]: (state, val) => {
        state.systemInfo = val
    },
    [types.USER_PERFORMANCE_LIST]: (state, val) => {
        state.userPerformanceList = val
    },
}

const actions = {}

export default {
    state,
    mutations,
    actions
}
