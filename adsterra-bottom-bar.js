(function () {
    var links = [
        "https://www.effectivecpmnetwork.com/ejgedpi24y?key=eb73ac4523fc1d51c9240db06fb74ffa",
        "https://www.effectivecpmnetwork.com/e3jc3pv2?key=c22468d379af231bc387c69fd72ccf12",
        "https://www.effectivecpmnetwork.com/t5uma0kz?key=36b3643f192ed6e2195c98c447e0b961",
        "https://www.effectivecpmnetwork.com/namy6vap88?key=b04c98b24b0b3db1b784b673e3e3d028",
        "https://www.effectivecpmnetwork.com/aunqwwk29?key=74a682f2622b8b6d1f9eb680da700df5",
        "https://www.effectivecpmnetwork.com/gf0nzp5sw?key=1d7fce7cbfa7da4da9b49998f85f4278",
        "https://www.effectivecpmnetwork.com/dtmfk5t5zi?key=9f3630f71de660db516498c675fca203",
        "https://www.effectivecpmnetwork.com/efjxag8qtb?key=1c006e372a9275f65e6b1fa2df250ede",
        "https://www.effectivecpmnetwork.com/thrwxiur5m?key=ca56409c3820684fb8c1744d0c699379",
        "https://www.effectivecpmnetwork.com/b05sw4rm?key=8cabc7025365dcd7e64329c7de6fe462"
    ];
    var ROTATE_MS = 3000;

    var style = document.createElement('style');
    style.textContent =
        '#adsterra-bottom-bar {' +
        '  position: relative; width: 100%;' +
        '  background: #000a15; border-top: 1px solid rgba(253,184,19,0.3);' +
        '  display: flex; flex-direction: column; align-items: center;' +
        '  padding: 10px 0; font-family: "Poppins", sans-serif;' +
        '}' +
        '#adsterra-bottom-bar-label {' +
        '  font-size: 0.55rem; font-weight: 700; letter-spacing: 0.1em;' +
        '  text-transform: uppercase; color: #b0b0b0; padding: 3px 0 2px;' +
        '}' +
        '#adsterra-bottom-bar-frame-wrap {' +
        '  width: 100%; max-width: 728px; height: 100px; position: relative; background: #000;' +
        '}' +
        '#adsterra-bottom-bar-frame-wrap iframe {' +
        '  width: 100%; height: 100%; border: 0; display: block;' +
        '}' +
        '#adsterra-bottom-bar-close {' +
        '  position: absolute; top: 2px; right: 6px; background: rgba(0,0,0,0.5); border: none;' +
        '  color: #fff; font-size: 0.85rem; line-height: 1; cursor: pointer; z-index: 2; padding: 2px 7px; border-radius: 4px;' +
        '}' +
        '#adsterra-bottom-bar-close:hover { background: rgba(0,0,0,0.8); }' +
        '@media (max-width: 480px) {' +
        '  #adsterra-bottom-bar-frame-wrap { height: 70px; }' +
        '}';
    document.head.appendChild(style);

    var bar = document.createElement('div');
    bar.id = 'adsterra-bottom-bar';
    bar.innerHTML =
        '<span id="adsterra-bottom-bar-label">Advertisement</span>' +
        '<div id="adsterra-bottom-bar-frame-wrap">' +
        '<button id="adsterra-bottom-bar-close" title="Close" aria-label="Close ad">&times;</button>' +
        '<iframe id="adsterra-bottom-bar-frame" scrolling="no" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"></iframe>' +
        '</div>';

    function init() {
        document.body.appendChild(bar);

        var frame = document.getElementById('adsterra-bottom-bar-frame');
        var lastIndex = -1;
        var timer;

        function showNext() {
            var idx;
            do {
                idx = Math.floor(Math.random() * links.length);
            } while (idx === lastIndex && links.length > 1);
            lastIndex = idx;
            frame.src = links[idx];
        }

        document.getElementById('adsterra-bottom-bar-close').addEventListener('click', function () {
            clearInterval(timer);
            bar.remove();
        });

        showNext();
        timer = setInterval(showNext, ROTATE_MS);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
