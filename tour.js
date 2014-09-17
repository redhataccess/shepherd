(function(){window.tours = {"/wapps/ugc/protected/account.html$":{"steps":[{"intro":"Start of account maintenance tour...","tooltipClass":"tooltip-hero"}]},"/home/?$":{"steps":[{"intro":"<h1>Welcome to the customer portal!</h1><p>We will take you on a short guided tour to get you situated.</p><p>You may use the arrow keys on your keyboard to navigate the tour.</p><p>Have fun!</p>","tooltipClass":"tooltip-hero"},{"element":"#home-search .search-form .field","intro":"Enter a search term here to search our vast knowledgebase."},{"element":"#home-announcements .box-column-inner","intro":"Announcements are posted here, and they are updated frequently. Make sure to check back!","position":"top"},{"element":"#home-links .home-start","intro":"This will take you to an alphabetical listing of all of our products. Great place to learn about all of the great solutions Red Hat has to offer.","position":"right"},{"element":"#home-links .home-activate","intro":"This is where you go to activate newly aquired subscriptions. You need to activate in order to gain access to updates and support.","position":"right"},{"element":"#home-links .home-download","intro":"This is where you go to download your products or updates. If you have just made a purchase this is a good place to start.","position":"left"},{"element":"#home-links .home-support","intro":"If you are having issues with a product you can click this to open a new support case.","position":"left"},{"element":"#home-knowledge","intro":"This is a list of recently added or changed entries in our knowledgebase.","position":"right"},{"element":"#navhome","intro":"This will always bring you back here."}]}};
if(typeof require === 'undefined') {
    var requirejs,require,define;(function(e){function h(e,t){return f.call(e,t)}function p(e,t){var n,r,i,s,o,a,f,l,h,p,d,v=t&&t.split("/"),m=u.map,g=m&&m["*"]||{};if(e&&e.charAt(0)==="."){if(t){v=v.slice(0,v.length-1);e=e.split("/");o=e.length-1;if(u.nodeIdCompat&&c.test(e[o])){e[o]=e[o].replace(c,"")}e=v.concat(e);for(h=0;h<e.length;h+=1){d=e[h];if(d==="."){e.splice(h,1);h-=1}else if(d===".."){if(h===1&&(e[2]===".."||e[0]==="..")){break}else if(h>0){e.splice(h-1,2);h-=2}}}e=e.join("/")}else if(e.indexOf("./")===0){e=e.substring(2)}}if((v||g)&&m){n=e.split("/");for(h=n.length;h>0;h-=1){r=n.slice(0,h).join("/");if(v){for(p=v.length;p>0;p-=1){i=m[v.slice(0,p).join("/")];if(i){i=i[r];if(i){s=i;a=h;break}}}}if(s){break}if(!f&&g&&g[r]){f=g[r];l=h}}if(!s&&f){s=f;a=l}if(s){n.splice(0,a,s);e=n.join("/")}}return e}function d(t,r){return function(){var i=l.call(arguments,0);if(typeof i[0]!=="string"&&i.length===1){i.push(null)}return n.apply(e,i.concat([t,r]))}}function v(e){return function(t){return p(t,e)}}function m(e){return function(t){s[e]=t}}function g(n){if(h(o,n)){var r=o[n];delete o[n];a[n]=true;t.apply(e,r)}if(!h(s,n)&&!h(a,n)){throw new Error("No "+n)}return s[n]}function y(e){var t,n=e?e.indexOf("!"):-1;if(n>-1){t=e.substring(0,n);e=e.substring(n+1,e.length)}return[t,e]}function b(e){return function(){return u&&u.config&&u.config[e]||{}}}var t,n,r,i,s={},o={},u={},a={},f=Object.prototype.hasOwnProperty,l=[].slice,c=/\.js$/;r=function(e,t){var n,r=y(e),i=r[0];e=r[1];if(i){i=p(i,t);n=g(i)}if(i){if(n&&n.normalize){e=n.normalize(e,v(t))}else{e=p(e,t)}}else{e=p(e,t);r=y(e);i=r[0];e=r[1];if(i){n=g(i)}}return{f:i?i+"!"+e:e,n:e,pr:i,p:n}};i={require:function(e){return d(e)},exports:function(e){var t=s[e];if(typeof t!=="undefined"){return t}else{return s[e]={}}},module:function(e){return{id:e,uri:"",exports:s[e],config:b(e)}}};t=function(t,n,u,f){var l,c,p,v,y,b=[],w=typeof u,E;f=f||t;if(w==="undefined"||w==="function"){n=!n.length&&u.length?["require","exports","module"]:n;for(y=0;y<n.length;y+=1){v=r(n[y],f);c=v.f;if(c==="require"){b[y]=i.require(t)}else if(c==="exports"){b[y]=i.exports(t);E=true}else if(c==="module"){l=b[y]=i.module(t)}else if(h(s,c)||h(o,c)||h(a,c)){b[y]=g(c)}else if(v.p){v.p.load(v.n,d(f,true),m(c),{});b[y]=s[c]}else{throw new Error(t+" missing "+c)}}p=u?u.apply(s[t],b):undefined;if(t){if(l&&l.exports!==e&&l.exports!==s[t]){s[t]=l.exports}else if(p!==e||!E){s[t]=p}}}else if(t){s[t]=u}};requirejs=require=n=function(s,o,a,f,l){if(typeof s==="string"){if(i[s]){return i[s](o)}return g(r(s,o).f)}else if(!s.splice){u=s;if(u.deps){n(u.deps,u.callback)}if(!o){return}if(o.splice){s=o;o=a;a=null}else{s=e}}o=o||function(){};if(typeof a==="function"){a=f;f=l}if(f){t(e,s,o,a)}else{setTimeout(function(){t(e,s,o,a)},4)}return n};n.config=function(e){return n(e)};requirejs._defined=s;define=function(e,t,n){if(!t.splice){n=t;t=[]}if(!h(s,e)&&!h(o,e)){o[e]=[e,t,n]}};define.amd={jQuery:true}})()
}

require(['//cdn.jsdelivr.net/intro.js/0.9.0/intro.min.js'], function(introJs) {
    var tours = window.tours;

    function getCurrentSteps() {
        var path = window.location.pathname;
        for (var tour in tours) {
            if (new RegExp(tour).test(path)) {
                return tours[tour].steps;
            }
        }
    }

    function startIntro(steps) {
        var intro = introJs();
        intro.setOptions({
            steps: steps
        });
        intro.start();
    }

    function createTourButton(steps) {
        var tourBtn = document.createElement('a');
        tourBtn.className = 'btn tour-btn';
        tourBtn.onclick = function() {
            startIntro(steps);
        };
        document.body.appendChild(tourBtn);
    }

    var currentSteps = getCurrentSteps();
    if (currentSteps) {
        createTourButton(currentSteps);
    }

});
}());