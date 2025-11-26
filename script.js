/*
 Robust OTP focus handler for 6 single-digit inputs.
 Works well with Cypress (.type and .type('{backspace}')).
*/

(function () {
  // select all inputs with class "code"
  const inputs = Array.from(document.querySelectorAll('.code'));

  if (!inputs.length) return;

  // helper: focus safely (some test runners can need a tiny delay)
  function safeFocus(el) {
    // blur first to ensure focus change is clean, then focus
    try { el.blur && el.blur(); } catch (_) {}
    // small async tick: improves reliability in some automated runners
    setTimeout(() => {
      try { el.focus && el.focus(); } catch (_) {}
    }, 0);
  }

  // ensure input is a single digit 0-9; keep only last digit in case user pastes
  function normalizeDigit(value) {
    if (!value) return '';
    // keep only digits
    const digits = value.replace(/\D/g, '');
    // if user pasted many digits, keep only the last one (mimics native single-char input)
    return digits.length ? digits[digits.length - 1] : '';
  }

  inputs.forEach((input, idx) => {
    // ensure attributes are correct for focusability
    input.setAttribute('inputmode', 'numeric'); // mobile numeric keyboard
    input.setAttribute('autocomplete', 'one-time-code'); // helpful but optional
    input.setAttribute('maxlength', '1');

    // INPUT event: fires after value change (typing / paste)
    input.addEventListener('input', (e) => {
      const raw = e.target.value;
      const digit = normalizeDigit(raw);

      // set normalized single digit back (or empty if invalid)
      e.target.value = digit;

      // if valid digit typed & not last input => focus next
      if (digit !== '' && idx < inputs.length - 1) {
        safeFocus(inputs[idx + 1]); // use safeFocus to avoid race
      }
      // if last box typed, keep focus there (Cypress won't expect move)
    });

    // KEYDOWN event: runs *before* value changes — ideal for backspace handling
    input.addEventListener('keydown', (e) => {
      const key = e.key;

      if (key === 'Backspace') {
        // If current input has value, let the browser clear it (do nothing else).
        // If empty and not first input => move to previous and clear it.
        if (input.value === '' && idx > 0) {
          // prevent default so browser doesn't try anything weird
          e.preventDefault();

          // clear previous input and move focus there
          inputs[idx - 1].value = '';
          safeFocus(inputs[idx - 1]);
        }
        // If current has a value, allow normal deletion behaviour.
      } else if (key === 'ArrowLeft') {
        // optional: let left arrow move to previous
        if (idx > 0) {
          e.preventDefault();
          safeFocus(inputs[idx - 1]);
        }
      } else if (key === 'ArrowRight') {
        // optional: right arrow to next
        if (idx < inputs.length - 1) {
          e.preventDefault();
          safeFocus(inputs[idx + 1]);
        }
      } else {
        // For any other key, do nothing here: 'input' handler will normalize.
      }
    });

    // Optional: on paste - if user pastes full OTP, spread digits
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const paste = (e.clipboardData || window.clipboardData).getData('text') || '';
      const digits = paste.replace(/\D/g, '').split('');
      if (!digits.length) return;

      // fill current and subsequent inputs with digits from paste
      let i = idx;
      digits.forEach((d) => {
        if (i < inputs.length) {
          inputs[i].value = d;
          i += 1;
        }
      });

      // focus the next empty input or last one
      const nextIndex = Math.min(i, inputs.length - 1);
      safeFocus(inputs[nextIndex]);
    });
  });

  // Optional: expose function to read joined OTP (useful for submitting)
  window.getOtpValue = function () {
    return inputs.map((n) => n.value || '').join('');
  };
})();