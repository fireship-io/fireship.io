import './styles.scss';
import hotroute from 'hotroute';
declare function gtag(command: 'config' | 'set' | 'event', id: string, config?: any): void;

(() => {
  document.addEventListener('DOMContentLoaded', e => {
    ///// ROUTING /////
    const router = hotroute({ log: true });

    ///// HELPERS ////
    const ifExists = (el, style, val) => {
      if (el) {
        el.style[style] = val;
      }
    };

    const isSmall = () => window.innerWidth <= 768;

    const $ = (selector): HTMLElement => {
      return document.querySelector(selector);
    }

    ///// SCROLL BEHAVIOR  /////
    function doOnRouteChange() {
      // Hide TopNav on Scroll
      let lastScroll = window.pageYOffset;
      let acc = 0;

      const lim = 400;
      const topNav = $('.topnav');
      const logo = $('.logo');
      const main = $('main');
      const toc = $('#TableOfContents');

      window.onscroll = positionMenus;
      window.onresize = positionMenus;
      logo.onmouseenter = showMenus;
      topNav.onmouseenter = showMenus;

      function positionMenus() {
        let currentScroll = window.pageYOffset;

        if ((lastScroll > currentScroll && acc > lim) || currentScroll < 100) {
          acc = 0;
          showMenus();
        } else if (acc < -lim) {
          // Hide menus
          acc = 0;
          if (isSmall()) {
            topNav.style.top = '-2.5em';
          } else {
            topNav.style.top = '-3em';
          }

          logo.style.opacity = '0.5';
          ifExists(toc, 'top', '30px');
        }
        acc += lastScroll - currentScroll;
        lastScroll = currentScroll;
      }

      function showMenus() {
        topNav.style.top = '0';
        logo.style.opacity = '1';
        if (isSmall()) {
          //  main.style.marginLeft = '0.25em'; // for subtle stretch animation
        } else {
          // main.style.marginLeft = '3.5em';
        }
        ifExists(toc, 'top', '120px');
      }

      // function copyCodeSnippets() {
      //   const snips = document.querySelectorAll('.highlight').forEach(el => {
      //     el.addEventListener('click', (e) => {
      //       (navigator as any).clipboard.writeText((el as any).innerText);
      //       const createEl = () => {
      //         const newEl = document.createElement('span');
      //         newEl.id = 'copied';
      //         newEl.innerHTML = 'copied!';
      //         newEl.classList.add('tag', 'tag-green', 'copy-alert'); 
              
      //         return newEl;
      //       }
      //       const alert = document.getElementById('copied') || createEl();
   
      //       el.parentElement.appendChild(alert);
      //       alert.classList.add('delayed-fade');
      //     })
      //   })
       
      // }

      // copyCodeSnippets();
      positionMenus();
    }


    ///// DO IT /////
    doOnRouteChange();
    window.addEventListener('router:end', e => {
      doOnRouteChange();
      const page_path = new URL(window.history.state['url']).pathname;

      gtag('config', 'UA-59099331-16', { page_path });
    });
  });
})();
