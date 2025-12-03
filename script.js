const codes = document.querySelectorAll(".code");

// focus first box automatically
codes[0].focus();

codes.forEach((code, index) => {

    code.addEventListener("keydown", (e) => {

        // typing forward movement (“0–9” keys)
        if (e.key >= 0 && e.key <= 9) {

            code.value = "";  // clear before writing

            setTimeout(() => {
                if (index < 5) {
                    codes[index + 1].focus();
                }
            }, 10);
        }

        // backspace behavior
        if (e.key === "Backspace") {
            code.value = "";

            setTimeout(() => {
                if (index > 0) {
                    codes[index - 1].focus();
                }
            }, 10);
        }
    });
});
