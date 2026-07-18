(function () {
    var links = [
        "https://www.effectivecpmnetwork.com/ejgedpi24y?key=eb73ac4523fc1d51c9240db06fb74ffa",
        "https://www.effectivecpmnetwork.com/e3jc3pv2?key=c22468d379af231bc387c69fd72ccf12",
        "https://www.effectivecpmnetwork.com/t5uma0kz?key=36b3643f192ed6e2195c98c447e0b961",
        "https://www.effectivecpmnetwork.com/namy6vap88?key=b04c98b24b0b3db1b784b673e3e3d028",
        "https://www.effectivecpmnetwork.com/aunqwwk29?key=74a682f2622b8b6d1f9eb680da700df5"
    ];
    var ROTATE_MS = 3000;

    var style = document.createElement('style');
    style.textContent =
        '#adsterra-bottom-bar {' +
        '  position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999;' +
        '  background: #000a15; border-top: 1px solid rgba(253,184,19,0.3);' +
        '  display: flex; align-items: center; gap: 12px;' +
        '  padding: 10px 16px; font-family: "Poppins", sans-serif;' +
        '}' +
        '#adsterra-bottom-bar-meta {' +
        '  display: flex; flex-direction: column; align-items: flex-start; flex-shrink: 0;' +
        '}' +
        '#adsterra-bottom-bar-chip {' +
        '  display: inline-block; background: rgba(253,184,19,0.15);' +
        '  border: 1px solid rgba(253,184,19,0.4); color: #fdb813;' +
        '  font-size: 0.55rem; font-weight: 800; padding: 1px 5px;' +
        '  border-radius: 4px; letter-spacing: 0.08em;' +
        '}' +
        '#adsterra-bottom-bar-label {' +
        '  font-size: 0.6rem; color: #b0b0b0; margin-top: 2px;' +
        '}' +
        '#adsterra-bottom-bar-link {' +
        '  flex: 1; min-width: 0; display: flex; align-items: center; gap: 10px;' +
        '  text-decoration: none; color: #f0f0f0;' +
        '  pointer-events: none; user-select: none; cursor: default;' +
        '}' +
        '#adsterra-bottom-bar-text {' +
        '  font-size: 0.78rem; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;' +
        '}' +
        '#adsterra-bottom-bar-btn {' +
        '  background: linear-gradient(135deg,#fdb813,#ffc93d); color: #000a15;' +
        '  border: none; border-radius: 6px; padding: 6px 14px;' +
        '  font-size: 0.72rem; font-weight: 700; flex-shrink: 0;' +
        '  font-family: "Poppins", sans-serif;' +
        '}' +
        '#adsterra-bottom-bar-dots {' +
        '  display: flex; gap: 4px; flex-shrink: 0;' +
        '}' +
        '#adsterra-bottom-bar-dots span {' +
        '  width: 6px; height: 6px; border-radius: 50%; background: rgba(253,184,19,0.25);' +
        '  transition: background 0.3s ease;' +
        '}' +
        '#adsterra-bottom-bar-dots span.active { background: #fdb813; }' +
        '#adsterra-bottom-bar-close {' +
        '  background: none; border: none; color: #b0b0b0; cursor: pointer;' +
        '  font-size: 1rem; padding: 4px; flex-shrink: 0;' +
        '}' +
        '#adsterra-bottom-bar-close:hover { color: #f0f0f0; }' +
        '@media (max-width: 600px) {' +
        '  #adsterra-bottom-bar { padding: 8px 10px; gap: 8px; }' +
        '  #adsterra-bottom-bar-meta { display: none; }' +
        '}';
    document.head.appendChild(style);

    var bar = document.createElement('div');
    bar.id = 'adsterra-bottom-bar';
    bar.innerHTML =
        '<div id="adsterra-bottom-bar-meta">' +
        '<span id="adsterra-bottom-bar-chip">AD</span>' +
        '<span id="adsterra-bottom-bar-label">Sponsored</span>' +
        '</div>' +
        '<div id="adsterra-bottom-bar-link">' +
        '<span id="adsterra-bottom-bar-text">Check out this offer</span>' +
        '<span id="adsterra-bottom-bar-btn">View</span>' +
        '</div>' +
        '<div id="adsterra-bottom-bar-dots">' +
        links.map(function () { return '<span></span>'; }).join('') +
        '</div>' +
        '<button id="adsterra-bottom-bar-close" title="Close" aria-label="Close ad">&times;</button>';

    function init() {
        document.body.appendChild(bar);

        var dots = document.querySelectorAll('#adsterra-bottom-bar-dots span');
        var lastIndex = -1;
        var timer;

        function showNext() {
            var idx;
            do {
                idx = Math.floor(Math.random() * links.length);
            } while (idx === lastIndex && links.length > 1);
            if (lastIndex >= 0) dots[lastIndex].classList.remove('active');
            dots[idx].classList.add('active');
            lastIndex = idx;
            // Not attached to any href/click handler on purpose — display-only, no navigation possible.
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
