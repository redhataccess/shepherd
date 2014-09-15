!function(t,e){"object"==typeof exports?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t)}(this,function(t){function e(t){this._targetElement=t,this._options={nextLabel:"Next &rarr;",prevLabel:"&larr; Back",skipLabel:"Skip",doneLabel:"Done",tooltipPosition:"bottom",tooltipClass:"",exitOnEsc:!0,exitOnOverlayClick:!0,showStepNumbers:!0,keyboardNavigation:!0,showButtons:!0,showBullets:!0,scrollToElement:!0,overlayOpacity:.8}}function n(t){var e=[],n=this;if(this._options.steps)for(var i=[],a=0,p=this._options.steps.length;p>a;a++){var u=o(this._options.steps[a]);if(u.step=e.length+1,"string"==typeof u.element&&(u.element=document.querySelector(u.element)),"undefined"==typeof u.element||null==u.element){var h=document.querySelector(".introjsFloatingElement");null==h&&(h=document.createElement("div"),h.className="introjsFloatingElement",document.body.appendChild(h)),u.element=h,u.position="floating"}null!=u.element&&e.push(u)}else{var i=t.querySelectorAll("*[data-intro]");if(i.length<1)return!1;for(var a=0,d=i.length;d>a;a++){var m=i[a],y=parseInt(m.getAttribute("data-step"),10);y>0&&(e[y-1]={element:m,intro:m.getAttribute("data-intro"),step:parseInt(m.getAttribute("data-step"),10),tooltipClass:m.getAttribute("data-tooltipClass"),position:m.getAttribute("data-position")||this._options.tooltipPosition})}for(var b=0,a=0,d=i.length;d>a;a++){var m=i[a];if(null==m.getAttribute("data-step")){for(;;){if("undefined"==typeof e[b])break;b++}e[b]={element:m,intro:m.getAttribute("data-intro"),step:b+1,tooltipClass:m.getAttribute("data-tooltipClass"),position:m.getAttribute("data-position")||this._options.tooltipPosition}}}}for(var g=[],v=0;v<e.length;v++)e[v]&&g.push(e[v]);if(e=g,e.sort(function(t,e){return t.step-e.step}),n._introItems=e,f.call(n,t)){r.call(n);{t.querySelector(".introjs-skipbutton"),t.querySelector(".introjs-nextbutton")}n._onKeyDown=function(e){27===e.keyCode&&1==n._options.exitOnEsc?(s.call(n,t),void 0!=n._introExitCallback&&n._introExitCallback.call(n)):37===e.keyCode?l.call(n):(39===e.keyCode||13===e.keyCode)&&(r.call(n),e.preventDefault?e.preventDefault():e.returnValue=!1)},n._onResize=function(){c.call(n,document.querySelector(".introjs-helperLayer"))},window.addEventListener?(this._options.keyboardNavigation&&window.addEventListener("keydown",n._onKeyDown,!0),window.addEventListener("resize",n._onResize,!0)):document.attachEvent&&(this._options.keyboardNavigation&&document.attachEvent("onkeydown",n._onKeyDown),document.attachEvent("onresize",n._onResize))}return!1}function o(t){if(null==t||"object"!=typeof t||"undefined"!=typeof t.nodeType)return t;var e={};for(var n in t)e[n]=o(t[n]);return e}function i(t){this._currentStep=t-2,"undefined"!=typeof this._introItems&&r.call(this)}function r(){if(this._direction="forward","undefined"==typeof this._currentStep?this._currentStep=0:++this._currentStep,this._introItems.length<=this._currentStep)return"function"==typeof this._introCompleteCallback&&this._introCompleteCallback.call(this),void s.call(this,this._targetElement);var t=this._introItems[this._currentStep];"undefined"!=typeof this._introBeforeChangeCallback&&this._introBeforeChangeCallback.call(this,t.element),p.call(this,t)}function l(){if(this._direction="backward",0===this._currentStep)return!1;var t=this._introItems[--this._currentStep];"undefined"!=typeof this._introBeforeChangeCallback&&this._introBeforeChangeCallback.call(this,t.element),p.call(this,t)}function s(t){var e=t.querySelector(".introjs-overlay");if(null!=e){e.style.opacity=0,setTimeout(function(){e.parentNode&&e.parentNode.removeChild(e)},500);var n=t.querySelector(".introjs-helperLayer");n&&n.parentNode.removeChild(n);var o=document.querySelector(".introjsFloatingElement");o&&o.parentNode.removeChild(o);var i=document.querySelector(".introjs-showElement");i&&(i.className=i.className.replace(/introjs-[a-zA-Z]+/g,"").replace(/^\s+|\s+$/g,""));var r=document.querySelectorAll(".introjs-fixParent");if(r&&r.length>0)for(var l=r.length-1;l>=0;l--)r[l].className=r[l].className.replace(/introjs-fixParent/g,"").replace(/^\s+|\s+$/g,"");window.removeEventListener?window.removeEventListener("keydown",this._onKeyDown,!0):document.detachEvent&&document.detachEvent("onkeydown",this._onKeyDown),this._currentStep=void 0}}function a(t,e,n,o){var i,r,l,s="";if(e.style.top=null,e.style.right=null,e.style.bottom=null,e.style.left=null,e.style.marginLeft=null,e.style.marginTop=null,n.style.display="inherit","undefined"!=typeof o&&null!=o&&(o.style.top=null,o.style.left=null),this._introItems[this._currentStep]){i=this._introItems[this._currentStep],s="string"==typeof i.tooltipClass?i.tooltipClass:this._options.tooltipClass,e.className=("introjs-tooltip "+s).replace(/^\s+|\s+$/g,"");var s=this._options.tooltipClass;switch(currentTooltipPosition=this._introItems[this._currentStep].position){case"top":e.style.left="15px",e.style.top="-"+(m(e).height+10)+"px",n.className="introjs-arrow bottom";break;case"right":e.style.left=m(t).width+20+"px",n.className="introjs-arrow left";break;case"left":1==this._options.showStepNumbers&&(e.style.top="15px"),e.style.right=m(t).width+20+"px",n.className="introjs-arrow right";break;case"floating":n.style.display="none",r=m(e),e.style.left="50%",e.style.top="50%",e.style.marginLeft="-"+r.width/2+"px",e.style.marginTop="-"+r.height/2+"px","undefined"!=typeof o&&null!=o&&(o.style.left="-"+(r.width/2+18)+"px",o.style.top="-"+(r.height/2+18)+"px");break;case"bottom-right-aligned":n.className="introjs-arrow top-right",e.style.right="0px",e.style.bottom="-"+(m(e).height+10)+"px";break;case"bottom-middle-aligned":l=m(t),r=m(e),n.className="introjs-arrow top-middle",e.style.left=l.width/2-r.width/2+"px",e.style.bottom="-"+(r.height+10)+"px";break;case"bottom-left-aligned":case"bottom":default:e.style.bottom="-"+(m(e).height+10)+"px",n.className="introjs-arrow top"}}}function c(t){if(t){if(!this._introItems[this._currentStep])return;var e=this._introItems[this._currentStep],n=m(e.element),o=10;"floating"==e.position&&(o=0),t.setAttribute("style","width: "+(n.width+o)+"px; height:"+(n.height+o)+"px; top:"+(n.top-5)+"px;left: "+(n.left-5)+"px;")}}function p(t){"undefined"!=typeof this._introChangeCallback&&this._introChangeCallback.call(this,t.element);{var e=this,n=document.querySelector(".introjs-helperLayer");m(t.element)}if(null!=n){var o=n.querySelector(".introjs-helperNumberLayer"),i=n.querySelector(".introjs-tooltiptext"),p=n.querySelector(".introjs-arrow"),f=n.querySelector(".introjs-tooltip"),y=n.querySelector(".introjs-skipbutton"),b=n.querySelector(".introjs-prevbutton"),g=n.querySelector(".introjs-nextbutton");if(f.style.opacity=0,null!=o){var v=this._introItems[t.step-2>=0?t.step-2:0];(null!=v&&"forward"==this._direction&&"floating"==v.position||"backward"==this._direction&&"floating"==t.position)&&(o.style.opacity=0)}c.call(e,n);var _=document.querySelectorAll(".introjs-fixParent");if(_&&_.length>0)for(var w=_.length-1;w>=0;w--)_[w].className=_[w].className.replace(/introjs-fixParent/g,"").replace(/^\s+|\s+$/g,"");var C=document.querySelector(".introjs-showElement");C.className=C.className.replace(/introjs-[a-zA-Z]+/g,"").replace(/^\s+|\s+$/g,""),e._lastShowElementTimer&&clearTimeout(e._lastShowElementTimer),e._lastShowElementTimer=setTimeout(function(){null!=o&&(o.innerHTML=t.step),i.innerHTML=t.intro,a.call(e,t.element,f,p,o),n.querySelector(".introjs-bullets li > a.active").className="",n.querySelector('.introjs-bullets li > a[data-stepnumber="'+t.step+'"]').className="active",f.style.opacity=1,o&&(o.style.opacity=1)},350)}else{var j=document.createElement("div"),k=document.createElement("div"),S=document.createElement("div"),E=document.createElement("div"),N=document.createElement("div"),x=document.createElement("div");j.className="introjs-helperLayer",c.call(e,j),this._targetElement.appendChild(j),k.className="introjs-arrow",E.className="introjs-tooltiptext",E.innerHTML=t.intro,N.className="introjs-bullets",this._options.showBullets===!1&&(N.style.display="none");for(var L=document.createElement("ul"),w=0,T=this._introItems.length;T>w;w++){var q=document.createElement("li"),A=document.createElement("a");A.onclick=function(){e.goToStep(this.getAttribute("data-stepnumber"))},0===w&&(A.className="active"),A.href="javascript:void(0);",A.innerHTML="&nbsp;",A.setAttribute("data-stepnumber",this._introItems[w].step),q.appendChild(A),L.appendChild(q)}if(N.appendChild(L),x.className="introjs-tooltipbuttons",this._options.showButtons===!1&&(x.style.display="none"),S.className="introjs-tooltip",S.appendChild(E),S.appendChild(N),1==this._options.showStepNumbers){var I=document.createElement("span");I.className="introjs-helperNumberLayer",I.innerHTML=t.step,j.appendChild(I)}S.appendChild(k),j.appendChild(S);var g=document.createElement("a");g.onclick=function(){e._introItems.length-1!=e._currentStep&&r.call(e)},g.href="javascript:void(0);",g.innerHTML=this._options.nextLabel;var b=document.createElement("a");b.onclick=function(){0!=e._currentStep&&l.call(e)},b.href="javascript:void(0);",b.innerHTML=this._options.prevLabel;var y=document.createElement("a");y.className="introjs-button introjs-skipbutton",y.href="javascript:void(0);",y.innerHTML=this._options.skipLabel,y.onclick=function(){e._introItems.length-1==e._currentStep&&"function"==typeof e._introCompleteCallback&&e._introCompleteCallback.call(e),e._introItems.length-1!=e._currentStep&&"function"==typeof e._introExitCallback&&e._introExitCallback.call(e),s.call(e,e._targetElement)},x.appendChild(y),this._introItems.length>1&&(x.appendChild(b),x.appendChild(g)),S.appendChild(x),a.call(e,t.element,S,k,I)}0==this._currentStep&&this._introItems.length>1?(b.className="introjs-button introjs-prevbutton introjs-disabled",g.className="introjs-button introjs-nextbutton",y.innerHTML=this._options.skipLabel):this._introItems.length-1==this._currentStep||1==this._introItems.length?(y.innerHTML=this._options.doneLabel,b.className="introjs-button introjs-prevbutton",g.className="introjs-button introjs-nextbutton introjs-disabled"):(b.className="introjs-button introjs-prevbutton",g.className="introjs-button introjs-nextbutton",y.innerHTML=this._options.skipLabel),g.focus(),t.element.className+=" introjs-showElement";var P=u(t.element,"position");"absolute"!==P&&"relative"!==P&&(t.element.className+=" introjs-relativePosition");for(var H=t.element.parentNode;null!=H&&"body"!==H.tagName.toLowerCase();){var B=u(H,"z-index"),M=parseFloat(u(H,"opacity"));(/[0-9]+/.test(B)||1>M)&&(H.className+=" introjs-fixParent"),H=H.parentNode}if(!d(t.element)&&this._options.scrollToElement===!0){var O=t.element.getBoundingClientRect(),z=h().height,D=O.bottom-(O.bottom-O.top),K=O.bottom-z;0>D||t.element.clientHeight>z?window.scrollBy(0,D-30):window.scrollBy(0,K+100)}"undefined"!=typeof this._introAfterChangeCallback&&this._introAfterChangeCallback.call(this,t.element)}function u(t,e){var n="";return t.currentStyle?n=t.currentStyle[e]:document.defaultView&&document.defaultView.getComputedStyle&&(n=document.defaultView.getComputedStyle(t,null).getPropertyValue(e)),n&&n.toLowerCase?n.toLowerCase():n}function h(){if(void 0!=window.innerWidth)return{width:window.innerWidth,height:window.innerHeight};var t=document.documentElement;return{width:t.clientWidth,height:t.clientHeight}}function d(t){var e=t.getBoundingClientRect();return e.top>=0&&e.left>=0&&e.bottom+80<=window.innerHeight&&e.right<=window.innerWidth}function f(t){var e=document.createElement("div"),n="",o=this;if(e.className="introjs-overlay","body"===t.tagName.toLowerCase())n+="top: 0;bottom: 0; left: 0;right: 0;position: fixed;",e.setAttribute("style",n);else{var i=m(t);i&&(n+="width: "+i.width+"px; height:"+i.height+"px; top:"+i.top+"px;left: "+i.left+"px;",e.setAttribute("style",n))}return t.appendChild(e),e.onclick=function(){1==o._options.exitOnOverlayClick&&(s.call(o,t),void 0!=o._introExitCallback&&o._introExitCallback.call(o))},setTimeout(function(){n+="opacity: "+o._options.overlayOpacity.toString()+";",e.setAttribute("style",n)},10),!0}function m(t){var e={};e.width=t.offsetWidth,e.height=t.offsetHeight;for(var n=0,o=0;t&&!isNaN(t.offsetLeft)&&!isNaN(t.offsetTop);)n+=t.offsetLeft,o+=t.offsetTop,t=t.offsetParent;return e.top=o,e.left=n,e}function y(t,e){var n={};for(var o in t)n[o]=t[o];for(var o in e)n[o]=e[o];return n}var b="0.9.0",g=function(t){if("object"==typeof t)return new e(t);if("string"==typeof t){var n=document.querySelector(t);if(n)return new e(n);throw new Error("There is no element with given selector.")}return new e(document.body)};return g.version=b,g.fn=e.prototype={clone:function(){return new e(this)},setOption:function(t,e){return this._options[t]=e,this},setOptions:function(t){return this._options=y(this._options,t),this},start:function(){return n.call(this,this._targetElement),this},goToStep:function(t){return i.call(this,t),this},nextStep:function(){return r.call(this),this},previousStep:function(){return l.call(this),this},exit:function(){s.call(this,this._targetElement)},refresh:function(){return c.call(this,document.querySelector(".introjs-helperLayer")),this},onbeforechange:function(t){if("function"!=typeof t)throw new Error("Provided callback for onbeforechange was not a function");return this._introBeforeChangeCallback=t,this},onchange:function(t){if("function"!=typeof t)throw new Error("Provided callback for onchange was not a function.");return this._introChangeCallback=t,this},onafterchange:function(t){if("function"!=typeof t)throw new Error("Provided callback for onafterchange was not a function");return this._introAfterChangeCallback=t,this},oncomplete:function(t){if("function"!=typeof t)throw new Error("Provided callback for oncomplete was not a function.");return this._introCompleteCallback=t,this},onexit:function(t){if("function"!=typeof t)throw new Error("Provided callback for onexit was not a function.");return this._introExitCallback=t,this}},t.introJs=g,g});