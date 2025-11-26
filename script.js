//your JS code here. If required.
const inputs = document.querySelectorAll(".code");

        inputs[0].focus();

        inputs.forEach((input, index) => {
            input.addEventListener("input", (e) => {
                const value = e.target.value;

                if (value.length === 1 && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
            });

            input.addEventListener("keydown", (e) => {
                if (e.key === "Backspace") {
                    if (input.value === "" && index > 0) {
                        inputs[index - 1].focus();
                        inputs[index - 1].value = "";
                    }
                }
            });
        });