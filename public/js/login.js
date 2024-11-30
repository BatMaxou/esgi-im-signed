const form = document.querySelector(".login__form");
const errors = document.querySelector(".login__errors");

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const email = event.target.email.value;
    const password = event.target.password.value;
    
    const response = await fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const token = JSON.parse(await response.text()).token ?? null;
        document.cookie =`token=${token}`;
        window.location.href = "/";
    } else {
        errors.textContent = "Identifiants incorrects";
    }
});
