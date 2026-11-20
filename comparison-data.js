// Checked against the supplied BCCL Alpha 0.2.2 executable, its source and linked official documentation on 2026-11-20.
export const categories = [
  {
    id: "install",
    name: "安装与管理",
    description: "从选择版本，到准备 Java 与资源。",
  },
  {
    id: "multiplayer",
    name: "联机与协作",
    description: "一起玩，也让沟通和共享更顺手。",
  },
  {
    id: "appearance",
    name: "外观体验",
    description: "看看每天打开时，哪一种交互更适合你。",
  },
  {
    id: "scope",
    name: "适用与取舍",
    description: "选择前，也了解平台、体积和运行环境。",
  },
];
export const bccl = {
  name: "BCCL",
  subtitle: "Alpha 0.2.2 · Windows x64",
  initial: "B",
  source: "https://github.com/123ugbu1312u/Boat-Chris-Craft-Launcher",
  sections: {
    install: {
      title: "准备工作，一处完成",
      pros: [
        "工作台集中六个快捷入口，版本、安装、模组、整合包、任务和启动设置一步直达。",
        "Java 下载器提供 Oracle / Eclipse Temurin 选择，完整 JDK 下载后校验 SHA-256。",
      ],
    },
    multiplayer: {
      title: "把协作一起装进启动器",
      pros: [
        "内置 MCTier 3.10.0，房间、文字、语音、文件与屏幕共享在同一处使用。",
        "切换启动器页面后保留后台会话，内置组件随 EXE 交付。",
      ],
    },
    appearance: {
      title: "透明质感，也可以调节",
      pros: [
        "Liquid Glass 透明度、按钮材质和胶囊形控件可按喜好设置。",
        "浅色与深色可独立配色，联机界面跟随主题；玻璃效果支持按负载智能调节。",
      ],
    },
    scope: {
      title: "适合想要一体体验的 Windows 玩家",
      pros: ["发布包自带 .NET 运行时和完整联机组件，无需另配同套联机工具。"],
      cons: [
        "当前本站发布仅 Windows x64，尚无 macOS / Linux 版。",
        "完整单文件约 238.2 MiB，首次运行需解压依赖并准备缓存。",
      ],
    },
  },
};
export const launchers = {
  pcl: {
    name: "PCL",
    subtitle: "Plain Craft Launcher · 官方主线",
    initial: "P",
    source: "https://github.com/Meloong-Git/PCL",
    sections: {
      install: {
        title: "熟悉的安装与启动流程",
        pros: [
          "将游戏下载、启动配置和资源相关功能集中在 Windows 界面中。",
          "主线维护下载、启动和动画模块，并提供官方帮助文档。",
        ],
      },
      multiplayer: {
        title: "围绕游戏联机选择工具",
        pros: [
          "提供大厅联机相关实现，也可按玩法使用 Minecraft 服务端。",
          "语音和共享可按团队习惯，选择配套的专用协作工具。",
        ],
        source: "https://github.com/Meloong-Git/PCL/wiki",
      },
      appearance: {
        title: "PCL 主线的经典交互",
        pros: [
          "保留 PCL 的界面与动画风格，适合习惯主线操作方式的玩家。",
          "官方帮助文档与主线功能配套，便于沿用既有使用习惯。",
        ],
      },
      scope: {
        title: "专注 Windows 的主线选择",
        pros: ["本地提供的 EXE 样本约 5.5 MiB，单次程序下载量较小。"],
        cons: [
          "该 Windows 客户端不能直接用于 macOS / Linux。",
          "若想把语音、文件和屏幕共享统一使用，需要自行搭配协作方案。",
        ],
      },
    },
  },
  ce: {
    name: "PCL-CE",
    subtitle: "PCL Community Edition · 社区维护",
    initial: "CE",
    source: "https://github.com/PCL-Community/PCL-CE",
    sections: {
      install: {
        title: "熟悉的基础，社区持续改进",
        pros: [
          "在 PCL 基础上扩展资源下载和实例管理等功能。",
          "由社区开发者维护，持续吸收主线以外的功能与改进。",
        ],
      },
      multiplayer: {
        title: "关注跨启动器大厅互联",
        pros: [
          "基于 EasyTier 的联机能力，并支持 Scaffolding 大厅互联。",
          "官方文档说明可与 HMCL、FCL 等启动器进行基础互联。",
        ],
        source: "https://docs.pclc.cc/ce/feature/multiplayer",
      },
      appearance: {
        title: "PCL 体验的社区延伸",
        pros: [
          "延续 PCL 的交互习惯，并加入社区定制与改进。",
          "适合希望保留熟悉操作，同时尝试社区新功能的玩家。",
        ],
      },
      scope: {
        title: "选择对应平台与版本",
        pros: ["当前官方 README 列出 Windows、Linux 与 macOS 的支持范围。"],
        cons: [
          "需准备对应的 .NET 运行环境，具体以所用发布包为准。",
          "社区版与 PCL 主线版本号不严格对应，更新和问题反馈需区分项目。",
        ],
      },
    },
  },
  hmcl: {
    name: "HMCL",
    subtitle: "Hello Minecraft! Launcher · 跨平台",
    initial: "H",
    source: "https://github.com/HMCL-dev/HMCL",
    sections: {
      install: {
        title: "完整的模组与整合包工具",
        pros: [
          "支持 Forge、NeoForge、Fabric、Quilt 等多种加载器。",
          "支持模组管理与整合包创建，适合在不同环境中整理游戏。",
        ],
      },
      multiplayer: {
        title: "与伙伴选择兼容的联机方式",
        pros: [
          "PCL-CE 官方文档将 HMCL 列为 Scaffolding 基础互联的启动器之一。",
          "可按需要选择大厅互联或 Minecraft 服务端等联机方式。",
        ],
        source: "https://docs.pclc.cc/ce/feature/multiplayer",
      },
      appearance: {
        title: "面向多平台的自定义界面",
        pros: [
          "官方提供 UI 自定义能力，兼顾不同操作系统的使用场景。",
          "适合希望在多台不同平台设备上使用同一款启动器的玩家。",
        ],
      },
      scope: {
        title: "多操作系统、多种架构",
        pros: ["覆盖 Windows、Linux、macOS、FreeBSD，并支持多种 CPU 架构。"],
        cons: [
          "Java / JavaFX 等运行环境要求随平台和分发包不同，需要按官方指引准备。",
        ],
      },
    },
  },
};
