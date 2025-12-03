const codes = document.querySelectorAll(".code");

codes[0].focus();

codes.forEach((code, idx) => {

    code.addEventListener("keydown", (e) => {

        // allow only numbers and backspace
        if (e.key >= 0 && e.key <= 9) {
            code.value = "";
            setTimeout(() => {
                if (idx < 5) {
                    codes[idx + 1].focus();
                }
            }, 10);
        }

        if (e.key === "Backspace") {
            code.value = "";
            setTimeout(() => {
                if (idx > 0) {
                    codes[idx - 1].focus();
                }
            }, 10);
        }
    });

});
