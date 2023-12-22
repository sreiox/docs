import{_ as e,o,c,R as a}from"./chunks/framework.KWiR4A1k.js";const d="/public/assets/17.Twb5PbaW.webp",b=JSON.parse('{"title":"项目相关题","description":"","frontmatter":{},"headers":[],"relativePath":"other.md","filePath":"other.md"}'),t={name:"other.md"},r=a('<h1 id="项目相关题" tabindex="-1">项目相关题 <a class="header-anchor" href="#项目相关题" aria-label="Permalink to &quot;项目相关题&quot;">​</a></h1><h2 id="关于模块化" tabindex="-1">关于模块化 <a class="header-anchor" href="#关于模块化" aria-label="Permalink to &quot;关于模块化&quot;">​</a></h2><p>首先模块化的目的是将程序划分为<code>一个个小的结构</code>。在这些结构中编写自己的逻辑代码，有自己的作用域，不会影响到其他的结构。同时这些结构可以将自己希望暴露的函数、变量、对象等<code>导出</code>给其他结构使用，也可通过某种方式，将另外结构中的函数、变量、对象等<code>导入</code>使用。</p><h2 id="微前端" tabindex="-1">微前端 <a class="header-anchor" href="#微前端" aria-label="Permalink to &quot;微前端&quot;">​</a></h2><p>随着项目的开发，会出现一个前端项目模块巨多的情况，不利于开发和维护。微前端就能帮助我们解决这个问题，帮我们实现了前端复杂项目的解耦，同时能做到<code>跨团队和跨部门协同开发</code>。</p><p>对于微前端，它与<code>技术栈无关</code>（主框架不限制介入应用的技术栈，微应用具有完全的自主权），各个微应用间仓库独立，每个微应用之间状态隔离，运行时状态不共享。</p><p>常见的微前端实现方案：</p><ul><li>基于<code>iframe</code>的完全隔离，iframe是浏览器自带的功能，使用简单，隔离完美，不过它<code>无法保持路由状态</code>，页面一刷新状态就丢失，同时iframe中的状态无法突破对应的应用，同时整个应用是全<code>量加载，速度慢</code>。</li><li>基于<code>single-spa路由劫持</code>的方案。<code>qiankun</code>就是基于这种方案实现的，通过对single-spa做一层封装，根据执行环境的修改，来解析微应用的资源，实现了JS沙箱、样式隔离等特性。</li><li>借鉴<code>WebComponent</code>思想的<code>micro-app</code>，通过<code>CustomElement</code>结合自定义的<code>ShadowDom</code>，将微前端封装成一个类<code>Web Component</code>组件。</li></ul><h2 id="前端低代码的认识" tabindex="-1">前端低代码的认识 <a class="header-anchor" href="#前端低代码的认识" aria-label="Permalink to &quot;前端低代码的认识&quot;">​</a></h2><p>低代码平台一般提供一个<code>可视化的编辑页面</code>，供知晓低代码开发规则的人员进行编程，是一种声明式编程。 常见的低代码工作流程如图：</p><p><img src="'+d+'" alt="tupian"></p><p>低代码的好处：</p><ul><li>门槛低，所见即所得，上手容易</li><li>基于现成组件库开发，开发速度快</li></ul><p>低代码的缺点：</p><ul><li>灵活性差，只适合某些特定领域</li><li>调试困难，对使用者来说是个黑盒</li><li>对运行环境有一定要求，兼容性不好，低代码开发的兼容性完全取决于低代码平台的支持</li></ul><h2 id="前端权限设计思路" tabindex="-1">前端权限设计思路 <a class="header-anchor" href="#前端权限设计思路" aria-label="Permalink to &quot;前端权限设计思路&quot;">​</a></h2><p>项目中，尤其是管理后台必不可少的一个环节就是权限设计。<code>通常一个系统下的不同用户会对应不同的角色，不同角色会对应不同的组织</code>。在进入到管理里后台的时候会去请求对应的权限接口，这个接口里有和后台约定好的权限标识内容，如果权限管理不是很复杂，可以将当前用户的所有权限标识一次性返回，前端进行一个持久化存储，之后根据规则处理即可。如果是个极为复杂的权限管理，甚至存在不同操作导致同一用户对应后续流程权限变化的情况，这里就建议用户首次登录管理后台时，获取的是最高一层权限，即可以看到的页面权限，之后在用户每次做了不同操作，切换页面的时候，根据约定好的规则，在页面路由切换的时候去请求下一个页面对应的权限（可以精确到每个交互动作），这样能更加精确的管理权限。</p><h2 id="taro是如何将react代码转换成对应的小程序代码或其他平台代码" tabindex="-1">taro是如何将react代码转换成对应的小程序代码或其他平台代码 <a class="header-anchor" href="#taro是如何将react代码转换成对应的小程序代码或其他平台代码" aria-label="Permalink to &quot;taro是如何将react代码转换成对应的小程序代码或其他平台代码&quot;">​</a></h2><p>平时使用<code>React JSX</code>进行开发时，要知道<code>React</code>将其核心功能分成了三部分：<code>React Core</code>（负责处理核心API、与终端平台和渲染解耦，提供了createElement、createClass、Component、Children等方法）、<code>React Renderer</code>（渲染器，定义了React Tree如何构建以接轨不同平台，有React-dom、React-Natvie等）、<code>React Reconciler</code>（调和器，负责diff算法，接驳patch行为。为渲染器提供基础计算能力，主要有16版本之前的Stack Reconciler和16及其之后的Fiber Reconciler）。React团队将<code>Reconciler</code>作为一个单独的包发布，任何平台的渲染器函数只要在<code>HostConfig</code>（宿主配置）内置基本方法，就可以构造自己的渲染逻辑。有了<code>react-reconciler</code>的支持。Taro团队就是提供了<code>taro-react</code>（实现了HostConfig）包来连接<code>react-reconciler</code>和<code>taro-runtime</code>。开发者写的React代码，Taro通过CLI将代码进行webpack打包，taro实现了一套完整的<code>DOM</code>和<code>BOM API</code>在各个平台的适配，打包完之后，就可以将程序渲染到对应的平台上。</p><p><code>核心就在于对输入的源代码的语法分析，语法树构建，随后对语法树进行转换操作再解析生成目标代码的过程。</code></p><h2 id="token可以放在cookie里吗" tabindex="-1">token可以放在cookie里吗？ <a class="header-anchor" href="#token可以放在cookie里吗" aria-label="Permalink to &quot;token可以放在cookie里吗？&quot;">​</a></h2><p>当被问这个问题的时候，第一时间要想到安全问题。通常回答<code>不可以</code>，因为存在<code>CSRF</code>（跨站请求伪造）风险，攻击者可以冒用<code>Cookie</code>中的信息来发送恶意请求。解决CSRF问题，可以设置<code>同源检测</code>（Origin和Referer认证），也可以设置<code>Samesite</code>为<code>Strict</code>。最好嘛，就是不把token放在cookie里咯。</p><h2 id="前端埋点的实现-说说看思路" tabindex="-1">前端埋点的实现，说说看思路 <a class="header-anchor" href="#前端埋点的实现-说说看思路" aria-label="Permalink to &quot;前端埋点的实现，说说看思路&quot;">​</a></h2><p>对于埋点方案：一般分为<code>手动埋点</code>（侵入性强，和业务强关联，用于需要精确搜集并分析数据，不过该方式耗时耗力，且容易出现误差，后续要调整，成本较高）、<code>可视化埋点</code>（提供一个可视化的埋点控制台，只能在可视化平台已支持的页面进行埋点）、<code>无埋点</code>（就是全埋点，监控页面发生的一切行为，优点是前端只需要处理一次埋点脚本，不过数据量过大会产生大量的脏数据，需要后端进行数据清洗）。</p><p>埋点通常传采用<code>img</code>方式来上传，首先所有浏览器都支持<code>Image对象</code>，并且记录的过程很少出错，同时不存在跨域问题，<code>请求Image也不会阻塞页面的渲染</code>。建议使用1*1像素的GIF，其<code>体积小</code>。</p><p>现在的浏览器如果支持<code>Navigator.sendBeacon(url, data)</code>方法，优先使用该方法来实现，它的主要作用就是<code>用于统计数据发送到web服务器</code>。当然如果不支持的话就继续使用图片的方式来上传数据。</p><h2 id="说说封装组件的思路" tabindex="-1">说说封装组件的思路 <a class="header-anchor" href="#说说封装组件的思路" aria-label="Permalink to &quot;说说封装组件的思路&quot;">​</a></h2><p>要考虑组件的<code>灵活性</code>、<code>易用性</code>、<code>复用性</code>。 常见的封装思路是，对于视图层面，如相<code>似度高的视图</code>，进行一个封装，提供<code>部分参数</code>方便使用者修改。对于业务<code>复用度较高</code>的，提取出<code>业务组件</code>。</p>',28),i=[r];function l(n,h,p,s,m,u){return o(),c("div",null,i)}const f=e(t,[["render",l]]);export{b as __pageData,f as default};
