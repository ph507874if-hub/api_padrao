const API_URL = "http://127.0.0.1:5000";

// Pega o ID direto da URL (ex: ?id=1)
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("id");

// 1. Quando a página carregar, busca os dados do usuário na API
window.addEventListener("DOMContentLoaded", async () => {
    if (!userId) {
        alert("ID do usuário não encontrado na URL!");
        return;
    }

    try {
        console.log(userId)
        const response = await fetch(`${API_URL}/usuarios/${userId}`);
        if (!response.ok) throw new Error("Erro ao buscar dados do usuário.");

        const usuario = await response.json();

        console.log(usuario)

        // Preenche os campos do formulário com os dados vindos do banco
        document.getElementById("id").value = usuario.id;
        document.getElementById("nome").value = usuario.nome;
        document.getElementById("email").value = usuario.email;
        document.getElementById("idade").value = usuario.idade;
        document.getElementById("altura").value = usuario.altura;

    } catch (error) {
        console.error("Erro:", error);
        alert("Não foi possível carregar os dados: " + error.message);
    }
});

// 2. Quando clicar em salvar alterações do formulário
document.getElementById("formEditar").addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que a página recarregue sozinha

    const dadosAtualizados = {
        nome: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        idade: parseInt(document.getElementById("idade").value, 10),
        altura: parseFloat(document.getElementById("altura").value)
    };

    try {
        const response = await fetch(`${API_URL}/usuarios/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dadosAtualizados)
        });

        if (!response.ok) throw new Error("Erro ao atualizar o usuário.");

        const resultado = await response.json();
        alert(resultado.mensagem || "Usuário atualizado com sucesso!");

        // Redireciona de volta para a lista
        window.location.href = "usuarios.html";

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao salvar: " + error.message);
    }
});