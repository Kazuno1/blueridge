/* ===== Stepper controller ===== */
function setStepper(selector, step) {
  const el = document.querySelector(selector);
  if (!el) return;
  const count = Number(el.dataset.count || 5);
  const s = Math.min(Math.max(1, step), count);

  el.querySelectorAll('.brm-step').forEach(node => {
    const n = Number(node.dataset.step);
    node.classList.toggle('brm-step--complete', n < s);
    node.classList.toggle('brm-step--current', n === s);
  });

  // update progress bar width
  const wrap = el.querySelector('.brm-stepper__wrap');
  const progress = el.querySelector('.brm-stepper__progress');
  const first = wrap.querySelector('.brm-step[data-step="1"] .brm-step__dot');
  const curr  = wrap.querySelector(`.brm-step[data-step="${s}"] .brm-step__dot`);
  if (first && curr) {
    const left = first.getBoundingClientRect().left + first.offsetWidth/2;
    const right = curr.getBoundingClientRect().left + curr.offsetWidth/2;
    const baseLeft = wrap.getBoundingClientRect().left;
    progress.style.width = Math.max(0, right - left) + 'px';
    progress.style.left  = (left - baseLeft) + 'px';
  }
  el.dataset.step = s;
}

window.addEventListener('load', () => {
  const el = document.querySelector('#intakeStepper');
  if (!el) return;
  const initial = Number(el.dataset.step || 1);
  setStepper('#intakeStepper', initial);

  const params = new URLSearchParams(location.search);
  if (params.has('step')) setStepper('#intakeStepper', Number(params.get('step')));

  /* ===== Goal card logic ===== */
  const form = document.getElementById('goalForm');
  const submit = document.getElementById('goalSubmit');

  if (form && submit) {
    // enable button once any radio chosen
    form.addEventListener('change', () => {
      const checked = form.querySelector('input[type="radio"]:checked');
      submit.disabled = !checked;
    });

    // handle submit: advance to next step
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // here you could read the answer:
      // const value = form.querySelector('input[type="radio"]:checked').value;

      setStepper('#intakeStepper', 2);          // go to "Preliminary"
      // optionally scroll to top of the stepper
      document.getElementById('intakeStepper')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // navigate to the preliminary page after a short delay so the user sees the step change
      setTimeout(() => {
        window.location.href = 'preliminary.html';
      }, 250);
    });
  }
});



// expose to window if you need to control the step from other scripts
window.setIntakeStep = n => setStepper('#intakeStepper', n);
