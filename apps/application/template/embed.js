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
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="98" height="110" viewBox="0 0 101 120" enable-background="new 0 0 101 120" xml:space="preserve">  <image id="image0" width="98" height="110" x="0" y="0"
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
      width: 106px;
      height: 113px;
      box-shadow: 1px 1px 1px 2000px rgba(0,0,0,.6);
      border-radius: 50% 0 0 50%;
      position: absolute;
      right: 0;
      bottom: 38px;
      z-index: 1000;
  }
  #maxkb .maxkb-tips {
      position: fixed;
      bottom: 30px;
      right: 115px;
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
