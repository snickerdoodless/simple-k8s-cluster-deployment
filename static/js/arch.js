// Animate nodes in
    document.querySelectorAll('.node').forEach((el, i) =>
      setTimeout(() => el.classList.add('vis'), 60 + i * 80));
    document.querySelectorAll('.clbl').forEach((el, i) =>
      setTimeout(() => el.style.opacity = '1', 700 + i * 40));

    // Show/hide panel
    function showPanel(id) {
      const pane = document.getElementById('panel-pane');
      document.querySelectorAll('.panel-content').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.node').forEach(n => n.classList.remove('active'));

      const content = document.getElementById('panel-' + id);
      if (content) content.classList.add('active');

      const nodeMap = {
        internet: ['n-internet'], sg: ['n-sg'],
        worker: ['n-worker1', 'n-worker2'],
        cp: ['n-cp'],
        ingress: ['n-ingress'],
        configmap: ['n-configmap'],
        apipod: ['n-apipod1', 'n-apipod2'],
        svcapi: ['n-svcapi'],
        redis: ['n-rpod', 'n-rsvc'],
        pv: ['n-pv'],
      };
      (nodeMap[id] || []).forEach(nid => {
        const el = document.getElementById(nid);
        if (el) el.classList.add('active');
      });

      pane.classList.add('open');
      pane.scrollTop = 0;
    }

    function closePanel() {
      document.getElementById('panel-pane').classList.remove('open');
      document.querySelectorAll('.panel-content').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.node').forEach(n => n.classList.remove('active'));
    }

    function switchTab(e, panel, tab) {
      document.querySelectorAll(`#panel-${panel} .tab-btn`).forEach(b => b.classList.remove('on'));
      document.querySelectorAll(`#panel-${panel} .tab-pane`).forEach(p => p.classList.remove('on'));
      document.getElementById(`${panel}-${tab}`).classList.add('on');
      e.target.classList.add('on');
    }

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closePanel();
    });

    // ── RESIZE HANDLE LOGIC ──
    (function () {
      const handle = document.getElementById('resize-handle');
      const panel = document.getElementById('panel-pane');
      let dragging = false;
      let startX, startW;

      // Show handle when panel opens
      const observer = new MutationObserver(() => {
        if (panel.classList.contains('open')) {
          handle.classList.add('visible');
        } else {
          handle.classList.remove('visible');
        }
      });
      observer.observe(panel, { attributes: true, attributeFilter: ['class'] });

      handle.addEventListener('mousedown', (e) => {
        e.preventDefault();
        dragging = true;
        startX = e.clientX;
        startW = panel.offsetWidth;
        handle.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
      });

      document.addEventListener('mousemove', (e) => {
        if (!dragging) return;
        const dx = startX - e.clientX;
        const newW = Math.max(250, Math.min(800, startW + dx));
        panel.style.width = newW + 'px';
        panel.style.transition = 'none';
      });

      document.addEventListener('mouseup', () => {
        if (!dragging) return;
        dragging = false;
        handle.classList.remove('dragging');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        panel.style.transition = '';
      });
    })();