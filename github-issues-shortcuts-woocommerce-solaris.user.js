// ==UserScript==
// @name         WooCommerce GitHub Issues Filter Shortcuts
// @namespace    https://github.com/adimoldovan/userscripts
// @version      0.7
// @description  Add filter shortcut buttons to WooCommerce GitHub issues page, including filtered views
// @match        https://github.com/woocommerce/woocommerce/issues
// @match        https://github.com/woocommerce/woocommerce/issues?q*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a button
    function createButton(text, url) {
        const button = document.createElement('a');
        button.textContent = text;
        button.href = url;
        button.className = 'btn btn-sm';
        button.style.marginRight = '5px';
        return button;
    }

    // Function to add buttons
    function addFilterButtons() {
        const issuesListHeader = document.querySelector("div[data-testid=\"list-header\"]");
        if (!issuesListHeader) return;

        // Check if buttons already exist
        if (document.querySelector('.custom-filter-buttons')) return;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'custom-filter-buttons';
        buttonContainer.style.marginBottom = '10px';

        const buttons = [
            { text: 'Solaris open issues', url: '?q=is%3Aissue+is%3Aopen+label%3A%22team%3A+Solaris%22+sort%3Acreated-desc+' },
            { text: 'Solaris high priority', url: '?q=is%3Aissue+is%3Aopen+label%3A%22team%3A+Solaris%22+label%3A%22priority%3A+high%22+sort%3Acreated-desc+' },
            { text: 'Solaris high priority non flaky', url: '?q=is%3Aissue+is%3Aopen+label%3A%22team%3A+Solaris%22+label%3A%22priority%3A+high%22+-label%3A%22metric%3A+flaky+e2e+test%22+sort%3Acreated-desc+' },
            { text: 'Flaky test issues', url: '?q=is%3Aissue+is%3Aopen+label%3A%22metric%3A+flaky+e2e+test%22+sort%3Acreated-desc' },
            { text: 'Flaky test issues non-blocks', url: '?q=is%3Aissue+is%3Aopen+label%3A%22metric%3A+flaky+e2e+test%22+sort%3Acreated-desc+-label%3A%22test+type%3A+blocks-e2e%22' },
            { text: 'Stale Flaky test issues', url: '?q=is%3Aissue+is%3Aopen+label%3A%22metric%3A+flaky+e2e+test%22+label%3A%22status%3A+stale%22+sort%3Aupdated-desc' },
            { text: 'Vortex open issues', url: '?q=is%3Aissue+is%3Aopen+label%3A%22team%3A+Vortex%22+sort%3Acreated-desc+' },
        ];

        buttons.forEach(btn => {
            buttonContainer.appendChild(createButton(btn.text, btn.url));
        });

        issuesListHeader.parentNode.insertBefore(buttonContainer, issuesListHeader.nextSibling);
    }

    // Function to initialize the MutationObserver
    function initObserver() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };

        const callback = function(mutationsList, observer) {
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const issuesListHeader = document.querySelector("#repo-content-turbo-frame");
                    if (issuesListHeader && !document.querySelector('.custom-filter-buttons')) {
                        addFilterButtons();
                        break;
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }

    // Initialize everything
    function init() {
        addFilterButtons();
        initObserver();
    }

    // Run the initialization when the page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
