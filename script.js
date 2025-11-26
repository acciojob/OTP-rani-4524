const inputs = document.querySelectorAll(".code");

    inputs.forEach((input, index) => {

      input.addEventListener("input", (e) => {
        let value = e.target.value;

        // allow only digits
        if (!/^[0-9]$/.test(value)) {
          e.target.value = "";
          return;
        }

        // move forward
        if (value && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace") {
          // if empty, move backward
          if (input.value === "" && index > 0) {
            inputs[index - 1].focus();
            inputs[index - 1].value = "";
          }
        }
      });
    });