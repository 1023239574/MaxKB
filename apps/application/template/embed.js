const guideHtml=`
<div class="maxkb-mask">
  <div class="maxkb-content"></div>
</div>
<div class="maxkb-tips">
  <div class="maxkb-close">
      <svg style="vertical-align: middle;overflow: hidden;" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M9.95317 8.73169L15.5511 3.13376C15.7138 2.97104 15.9776 2.97104 16.1403 3.13376L16.7296 3.72301C16.8923 3.88573 16.8923 4.14955 16.7296 4.31227L11.1317 9.9102L16.7296 15.5081C16.8923 15.6708 16.8923 15.9347 16.7296 16.0974L16.1403 16.6866C15.9776 16.8494 15.7138 16.8494 15.5511 16.6866L9.95317 11.0887L4.35524 16.6866C4.19252 16.8494 3.9287 16.8494 3.76598 16.6866L3.17673 16.0974C3.01401 15.9347 3.01401 15.6708 3.17673 15.5081L8.77465 9.9102L3.17673 4.31227C3.01401 4.14955 3.01401 3.88573 3.17673 3.72301L3.76598 3.13376C3.9287 2.97104 4.19252 2.97104 4.35524 3.13376L9.95317 8.73169Z" fill="#ffffff"></path>
          </svg>
  </div>
 
  <div class="maxkb-title"> 🌟 遇见问题，不再有障碍！</div>
  <p>你好，我是矿山知识助手。<br/>
      点我，开启高效解答模式，让问题变成过去式。</p>
  <div class="maxkb-button">
      <button>我知道了</button>
  </div>
  <span class="maxkb-arrow" ></span>
</div>
`
const chatButtonHtml=
`<div class="maxkb-chat-button" >
  <div class="maxkb-tooltip" id="maxkbTooltip">
  <p>Hi，欢迎使用矿山小助手，有问题随时问我！
  <span class="maxkb-arrow" ></span>
  </div>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="101" height="120" viewBox="0 0 101 120" enable-background="new 0 0 101 120" xml:space="preserve">  <image id="image0" width="101" height="120" x="0" y="0"
    href="data:image/png;base64,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" ></image>
</svg>
</div>`

const getChatContainerHtml=(protocol,host,token,mainAccount)=>{
 return `<div id="maxkb-chat-container">
<iframe id="maxkb-chat" src=${protocol}://${host}/damage_gpu/ui/chat/${token}/${mainAccount}?mode=embed></iframe>
<div class="maxkb-operate"><div class="maxkb-closeviewport maxkb-viewportnone"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
<path d="M7.507 11.6645C7.73712 11.6645 7.94545 11.7578 8.09625 11.9086C8.24706 12.0594 8.34033 12.2677 8.34033 12.4978V16.7976C8.34033 17.0277 8.15378 17.2143 7.92366 17.2143H7.09033C6.86021 17.2143 6.67366 17.0277 6.67366 16.7976V14.5812L3.41075 17.843C3.24803 18.0057 2.98421 18.0057 2.82149 17.843L2.23224 17.2537C2.06952 17.091 2.06952 16.8272 2.23224 16.6645L5.56668 13.3311H3.19634C2.96622 13.3311 2.77967 13.1446 2.77967 12.9145V12.0811C2.77967 11.851 2.96622 11.6645 3.19634 11.6645H7.507ZM16.5991 2.1572C16.7619 1.99448 17.0257 1.99448 17.1884 2.1572L17.7777 2.74645C17.9404 2.90917 17.9404 3.17299 17.7777 3.33571L14.4432 6.66904H16.8136C17.0437 6.66904 17.2302 6.85559 17.2302 7.08571V7.91904C17.2302 8.14916 17.0437 8.33571 16.8136 8.33571H12.5029C12.2728 8.33571 12.0644 8.24243 11.9136 8.09163C11.7628 7.94082 11.6696 7.73249 11.6696 7.50237V3.20257C11.6696 2.97245 11.8561 2.7859 12.0862 2.7859H12.9196C13.1497 2.7859 13.3362 2.97245 13.3362 3.20257V5.419L16.5991 2.1572Z" fill="#646A73"/>
</svg></div>
<div class="maxkb-openviewport">
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
<path d="M7.15209 11.5968C7.31481 11.4341 7.57862 11.4341 7.74134 11.5968L8.3306 12.186C8.49332 12.3487 8.49332 12.6126 8.3306 12.7753L4.99615 16.1086H7.3665C7.59662 16.1086 7.78316 16.2952 7.78316 16.5253V17.3586C7.78316 17.5887 7.59662 17.7753 7.3665 17.7753H3.05584C2.82572 17.7753 2.61738 17.682 2.46658 17.5312C2.31578 17.3804 2.2225 17.1721 2.2225 16.9419V12.6421C2.2225 12.412 2.40905 12.2255 2.63917 12.2255H3.4725C3.70262 12.2255 3.88917 12.412 3.88917 12.6421V14.8586L7.15209 11.5968ZM16.937 2.22217C17.1671 2.22217 17.3754 2.31544 17.5262 2.46625C17.677 2.61705 17.7703 2.82538 17.7703 3.0555V7.35531C17.7703 7.58543 17.5837 7.77198 17.3536 7.77198H16.5203C16.2902 7.77198 16.1036 7.58543 16.1036 7.35531V5.13888L12.8407 8.40068C12.678 8.5634 12.4142 8.5634 12.2515 8.40068L11.6622 7.81142C11.4995 7.64871 11.4995 7.38489 11.6622 7.22217L14.9966 3.88883H12.6263C12.3962 3.88883 12.2096 3.70229 12.2096 3.47217V2.63883C12.2096 2.40872 12.3962 2.22217 12.6263 2.22217H16.937Z" fill="#646A73"/>
</svg></div>
<div class="maxkb-chat-close"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
           <path d="M9.95317 8.73169L15.5511 3.13376C15.7138 2.97104 15.9776 2.97104 16.1403 3.13376L16.7296 3.72301C16.8923 3.88573 16.8923 4.14955 16.7296 4.31227L11.1317 9.9102L16.7296 15.5081C16.8923 15.6708 16.8923 15.9347 16.7296 16.0974L16.1403 16.6866C15.9776 16.8494 15.7138 16.8494 15.5511 16.6866L9.95317 11.0887L4.35524 16.6866C4.19252 16.8494 3.9287 16.8494 3.76598 16.6866L3.17673 16.0974C3.01401 15.9347 3.01401 15.6708 3.17673 15.5081L8.77465 9.9102L3.17673 4.31227C3.01401 4.14955 3.01401 3.88573 3.17673 3.72301L3.76598 3.13376C3.9287 2.97104 4.19252 2.97104 4.35524 3.13376L9.95317 8.73169Z" fill="#646A73"/>
           </svg>
 </div></div>
`
}

let wasDragging = false;
/**
 * 初始化引导
 * @param {*} root  
 */
const initGuide=(root)=>{
   root.insertAdjacentHTML("beforeend",guideHtml)
   const button=root.querySelector(".maxkb-button")
   const close_icon=root.querySelector('.maxkb-close')
   const close_func=()=>{
     root.removeChild(root.querySelector('.maxkb-tips'))
     root.removeChild(root.querySelector('.maxkb-mask'))
     localStorage.setItem('maxkbMaskTip',true)
   }
   button.onclick=close_func
   close_icon.onclick=close_func
}
const initChat=(root)=>{
  // 添加对话icon
  root.insertAdjacentHTML("beforeend",chatButtonHtml)
  // 添加对话框
  root.insertAdjacentHTML('beforeend',getChatContainerHtml('{{protocol}}','{{host}}','{{token}}','{{mainAccount}}'))
  // 按钮元素
  const chat_button=root.querySelector('.maxkb-chat-button')
  //  对话框元素
  const chat_container=root.querySelector('#maxkb-chat-container')

  const viewport=root.querySelector('.maxkb-openviewport')
  const closeviewport=root.querySelector('.maxkb-closeviewport')
  const close_func=()=>{
    if (wasDragging) {
      return false
  }

    chat_container.style['display']=chat_container.style['display']=='block'?'none':'block'
    chat_button.style['display']=chat_container.style['display']=='block'?'none':'block'
  }
  close_icon=chat_container.querySelector('.maxkb-chat-close')
  chat_button.onclick = close_func
  close_icon.onclick=close_func
  const viewport_func=()=>{
    if(chat_container.classList.contains('maxkb-enlarge')){
      chat_container.classList.remove("maxkb-enlarge");
      viewport.classList.remove('maxkb-viewportnone')
      closeviewport.classList.add('maxkb-viewportnone')
    }else{
      chat_container.classList.add("maxkb-enlarge");
      viewport.classList.add('maxkb-viewportnone')
      closeviewport.classList.remove('maxkb-viewportnone')
    }
  }
  viewport.onclick=viewport_func
  closeviewport.onclick=viewport_func
}
/**
 * 第一次进来的引导提示
 */
function initMaxkb(){
  const maxkb=document.createElement('div')
  const root=document.createElement('div')
  root.id="maxkb"
  initMaxkbStyle(maxkb)
  maxkb.appendChild(root)
  document.body.appendChild(maxkb)
  const maxkbMaskTip=localStorage.getItem('maxkbMaskTip')
  if(maxkbMaskTip==null){
    initGuide(root)
  }
  initChat(root)

  setChatButtonDrag()
}

function setChatButtonDrag() {
  const chatButton = document.querySelector('.maxkb-chat-button');

  let isDragging = false;
  let startY;
  let startBottom;

  chatButton.addEventListener('mousedown', (e)=>{
      e.preventDefault();
      // 防止默认行为，比如文本选择
      isDragging = true;
      wasDragging = false;
      // 重置标志
      startY = e.clientY;
      startBottom = parseInt(window.getComputedStyle(chatButton).bottom, 10);
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
  }
  );

  function onMouseMove(e) {
      if (!isDragging)
          return;
      const deltaY = e.clientY - startY;
      wasDragging = true;
      // 标记为发生了拖动
      chatButton.style.bottom = `${startBottom - deltaY}px`;
  }

  function onMouseUp() {
    if (isDragging) {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}
}
 
// 初始化全局样式
function initMaxkbStyle(root){
  style=document.createElement('style')
  style.type='text/css'
  style.innerText=  `
  /* 放大 */
  #maxkb .maxkb-enlarge {
      width: 50%!important;
      height: 100%!important;
      bottom: 0!important;
      right: 0 !important;
  }
  @media only screen and (max-width: 768px){
  #maxkb .maxkb-enlarge {
      width: 100%!important;
      height: 100%!important;
      right: 0 !important;
      bottom: 0!important;
  }
  }
  
  /* 引导 */
  
  #maxkb .maxkb-mask {
      position: fixed;
      z-index: 999;
      background-color: transparent;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
  }
  #maxkb .maxkb-mask .maxkb-content {
      width: 115px;
      height: 135px;
      box-shadow: 1px 1px 1px 2000px rgba(0,0,0,.6);
      border-radius: 50% 0 0 50%;
      position: absolute;
      right: 0;
      bottom: 26px;
      z-index: 1000;
  }
  #maxkb .maxkb-tips {
      position: fixed;
      bottom: 30px;
      right: 135px;
      padding: 22px 24px 24px;
      border-radius: 6px;
      color: #ffffff;
      font-size: 14px;
      background: #3370FF;
      z-index: 1000;
  }
  #maxkb .maxkb-tips .maxkb-arrow {
      position: absolute;
      background: #3370FF;
      width: 10px;
      height: 10px;
      pointer-events: none;
      transform: rotate(45deg);
      box-sizing: border-box;
      /* left  */
      right: -5px;
      bottom: 33px;
      border-left-color: transparent;
      border-bottom-color: transparent
  }
  #maxkb .maxkb-tips .maxkb-title {
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 8px;
  }
  #maxkb .maxkb-tips .maxkb-button {
      text-align: right;
      margin-top: 24px;
  }
  #maxkb .maxkb-tips .maxkb-button button {
      border-radius: 4px;
      background: #FFF;
      padding: 3px 12px;
      color: #3370FF;
      cursor: pointer;
      outline: none;
      border: none;
  }
  #maxkb .maxkb-tips .maxkb-button button::after{
      border: none;
    }
  #maxkb .maxkb-tips .maxkb-close {
      position: absolute;
      right: 20px;
      top: 20px;
      cursor: pointer;
  
  }


  #maxkb .maxkb-chat-button:hover .maxkb-tooltip {
    display:block;
  }

  #maxkb .maxkb-tooltip {
    position: absolute;
    top: -70px;
    right: 31px;
    padding: 5px 20px 5px;
    border-radius: 6px;
    color: #ffffff;
    font-size: 14px;
    background: #3370FF;
    z-index: 1000;
    line-height: 13px;
    width:320px;
    display:none;
}

#maxkb .maxkb-tooltip .maxkb-arrow {
    position: absolute;
    background: #3370FF;
    width: 10px;
    height: 10px;
    pointer-events: none;
    transform: rotate(45deg);
    box-sizing: border-box;
    /* left  */
    right: 15px;
    bottom: -3px;
    border-left-color: transparent;
    border-bottom-color: transparent
}

  #maxkb-chat-container {
        width: 420px;
        height: 600px;
        display:none;
      }
  @media only screen and (max-width: 768px) {
        #maxkb-chat-container {
          width: 100%;
          height: 70%;
          right: 0 !important;
        }
      }
      
      #maxkb .maxkb-chat-button{
        position: fixed;
        bottom: 30px;
        right: 0;
        cursor: pointer;
        z-index: 100;
    }
    #maxkb #maxkb-chat-container{
        z-index:10000;position: relative;
              border-radius: 8px;
              border: 1px solid #ffffff;
              background: linear-gradient(188deg, rgba(235, 241, 255, 0.20) 39.6%, rgba(231, 249, 255, 0.20) 94.3%), #EFF0F1;
              box-shadow: 0px 4px 8px 0px rgba(31, 35, 41, 0.10);
              position: fixed;bottom: 16px;right: 16px;overflow: hidden;
    }

     #maxkb #maxkb-chat-container .maxkb-operate{
     top: 18px;
     right: 15px;
     position: absolute;
     display: flex;
     align-items: center;
     }
    #maxkb #maxkb-chat-container .maxkb-operate .maxkb-chat-close{
            margin-left:15px;
            cursor: pointer;
    }
    #maxkb #maxkb-chat-container .maxkb-operate .maxkb-openviewport{

            cursor: pointer;
    }
    #maxkb #maxkb-chat-container .maxkb-operate .maxkb-closeviewport{

      cursor: pointer;
    }
    #maxkb #maxkb-chat-container .maxkb-viewportnone{
      display:none;
    }
    #maxkb #maxkb-chat-container #maxkb-chat{
     height:100%;
     width:100%;
     border: none;
}
    #maxkb #maxkb-chat-container {
                animation: appear .4s ease-in-out;
              }
              @keyframes appear {
                from {
                  height: 0;;
                }
        
                to {
                  height: 600px;
                }
              }`
  root.appendChild(style)
}

function embedChatbot() {
  white_list_str='{{white_list_str}}'
  white_list=white_list_str.split(',')

  if ({{is_auth}}&&({{white_active}}?white_list.includes(window.location.origin):true)) {
    // 初始化maxkb智能小助手
    initMaxkb()
  } else console.error('invalid parameter')
}

//window.onload = embedChatbot
setTimeout(() => {
  // 使用nextTick确保DOM更新完毕
  embedChatbot();
}, 2000);
