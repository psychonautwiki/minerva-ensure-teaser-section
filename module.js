(() => {
    try {
        const target = document.querySelector('.mf-section-0');

        if (!target || !target.children.length) {
            return;
        }

        let hasWarningPanel = false;
        let warningPanelElement = null;

        let [e1, e2, e3, e4] = [...target.children];

        if (
            e1.constructor === HTMLDivElement
            && e1.classList.contains('flex-panel')
        ) {
            hasWarningPanel = true;
            warningPanelElement = e1;

            e1 = e2;
            e2 = e3;
            e3 = e4;
        }

        const [et1, et2, et3] = [e1, e2, e3].map((e, i, arr) => {
            if (
                // first or second element
                (i === 0 || i === 1)
                // is a table
                && e.constructor === HTMLTableElement
                // has only one anchor
                && e.querySelectorAll("a").length === 1
                // contains text 'summary sheet'
                && /summary sheet/i.test(e.innerText)
            ) {
                return 'sslink';
            }

            if (
                // first or second element
                (i === 0 || i === 1)
                // is a table
                && e.constructor === HTMLTableElement
                && (
                    // has the id InfoTable
                    e.id === 'InfoTable'
                    // or (future) the classname InfoTable
                    || e.classList.contains('InfoTable')
                )
            ) {
                return 'infotable';
            }
            
            if (
                // second or third element
                (i === 1 || i === 2)
                // is paragraph / 'p' element
                && e.constructor === HTMLParagraphElement
                // if third element, make sure the second isn't a paragraph
                && (i === 2 && arr[1].constructor !== HTMLParagraphElement)
                // and to rule out pages which no substance pages
                && arr[0].constructor !== HTMLParagraphElement
            ) {
                return 'firstp';
            }

            return false;
        });

        if (
            // if none match: outlier article
            et1 === false
            // outlier article
            || et2 === false
            // if et2 is firstp, et3 will be false; cover this case
            || (et2 !== 'firstp' && et3 === false)) {
            return;
        }

        let targetConfig = null;

        // summary, infotable and first section
        if (et1 === 'sslink' && et2 === 'infotable' && et3 === 'firstp') {
            targetConfig = [0, 2, 1];
        }

        // weird case
        if (et1 === 'sslink' && et2 === 'firstp') {
            return;
        }

        if (et1 === 'infotable' && et2 === 'firstp') {
            targetConfig = [1, 0];
        }

        if (targetConfig === null) {
            return;
        }

        targetConfig.forEach(e => {
            if (e === 0) {
                return target.removeChild(e1);
            }

            if (e === 1) {
                return target.removeChild(e2);
            }

            if (e === 2) {
                return target.removeChild(e3);
            }
        });

        if (hasWarningPanel) {
            target.removeChild(warningPanelElement);
        }

        const targetElements = targetConfig.map(e => {
            if (e === 0) {
                return e1;
            }

            if (e === 1) {
                return e2;
            }

            if (e === 2) {
                return e3;
            }
        });

        if (hasWarningPanel) {
            targetElements.unshift(warningPanelElement);
        }

        const insertTarget = target;
        const insertOperation = 'beforebegin';

        targetElements.reverse().forEach(e => {
            target.insertBefore(e, target.firstChild);
        });
    } catch(_) {
        return;
    }
})();