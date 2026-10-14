const API_URL = "http://127.0.0.1:5000";

async function criarUsuario() {

    try {

        let forNome = document.getElementById('usuario_nome').value
        let forEmail = document.getElementById('usuario_email').value
        let forIdade = parseInt(document.getElementById('usuario_idade').value)
        let forAltura = parseFloat(document.getElementById('usuario_altura').value)


        const response = await fetch(`${API_URL}/usuarios`, {

            method: "POST",

            headers: {"Content-Type": "application/json"},

            body: JSON.stringify({
                nome: forNome,
                email: forEmail,
                idade: forIdade,
                altura: forAltura
            })

        })


        if (!response.ok) throw new Error("Erro ao cadastrar usuário");
        const resultado = await response.json();
        alert(resultado.mensagem);
    } catch (error) {
        alert("Erro: " + error.message);
    }

}