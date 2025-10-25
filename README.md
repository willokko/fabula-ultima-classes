# Fabula Ultima - Classes Viewer

Um site moderno e responsivo para visualizar classes de RPG do sistema Fabula Ultima.

## 🎮 Funcionalidades

- **Grid de Cards Responsivo**: Visualize todas as classes em cards elegantes
- **Modal de Detalhes**: Clique em qualquer classe para ver informações completas
- **Design Moderno**: Interface bonita com gradientes e animações suaves
- **Mobile-First**: Funciona perfeitamente em desktop, tablet e mobile
- **Dinâmico**: Adicione novas classes no JSON e elas aparecem automaticamente

## 🚀 Como Usar

### Visualizar Classes
1. Abra o arquivo `index.html` em seu navegador
2. Navegue pelos cards de classes
3. Clique em qualquer classe para ver detalhes completos

### Criar Nova Classe (Admin)
1. Clique no botão "Nova Classe" no header ou acesse `admin.html`
2. Preencha o formulário com as informações da classe
3. Adicione as habilidades clicando em "+ Adicionar Habilidade"
4. Clique em "Gerar JSON" para visualizar o resultado
5. Copie o JSON gerado e adicione manualmente no arquivo `json/classes.json`

## 📝 Adicionar Novas Classes

Para adicionar uma nova classe, edite o arquivo `json/classes.json` e adicione um novo objeto no array `classes`:

```json
{
    "nome": "Nome da Classe",
    "icon": "icons/seu-icone.png",
    "imagem": "img/sua-imagem.png",
    "livro": "principal",
    "resumo": "Descrição da classe...",
    "beneficio_gratis": "+5 HP",
    "skills": [
        {
            "nome": "NOME DA SKILL",
            "sl": 0,
            "descricao": "Descrição da habilidade..."
        }
    ]
}
```

## 🎨 Tecnologias

- HTML5
- CSS3 (com TailwindCSS)
- JavaScript (Vanilla)
- Google Fonts (Cinzel & Inter)

## 📱 Compatibilidade

- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Mobile Browsers