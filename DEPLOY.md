# Como Hospedar no GitHub Pages

## Passo 1: Instalar Git
1. Acesse: https://git-scm.com/download/win
2. Baixe e instale o Git for Windows
3. Durante a instalação, aceite as opções padrão

## Passo 2: Criar Repositório no GitHub
1. Acesse: https://github.com
2. Faça login (ou crie uma conta se não tiver)
3. Clique em "New repository" (botão verde)
4. Nome do repositório: `moneyflow-app` (ou qualquer nome que preferir)
5. Deixe como **Público**
6. **NÃO** marque "Initialize with README"
7. Clique em "Create repository"

## Passo 3: Subir o Projeto (Execute no PowerShell)

Abra o PowerShell nesta pasta e execute:

```powershell
# Navegar para a pasta
cd "c:\Users\USER\OneDrive\Desktop\hackathon"

# Inicializar Git
git init

# Adicionar todos os arquivos
git add .

# Fazer commit inicial
git commit -m "Initial commit - MoneyFlow App"

# Adicionar repositório remoto (SUBSTITUA SEU-USUARIO pelo seu username do GitHub)
git remote add origin https://github.com/SEU-USUARIO/moneyflow-app.git

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

## Passo 4: Configurar GitHub Pages

1. No repositório do GitHub, clique em **Settings**
2. No menu lateral, clique em **Pages**
3. Em "Source", selecione: **Deploy from a branch**
4. Em "Branch", selecione: **main** e pasta **/root**
5. Clique em **Save**

## Passo 5: Acessar o Site

Aguarde 2-3 minutos e seu site estará disponível em:
```
https://SEU-USUARIO.github.io/moneyflow-app/demo/
```

**Importante:** Como os arquivos estão na pasta `demo/`, você precisa adicionar `/demo/` no final da URL.

## Alternativa: Mover Arquivos para Raiz

Se quiser que o site fique em `https://SEU-USUARIO.github.io/moneyflow-app/` sem o `/demo/`:

```powershell
# Mover arquivos da pasta demo para raiz
Move-Item -Path "demo\*" -Destination "." -Force

# Remover pasta demo vazia
Remove-Item -Path "demo" -Recurse -Force

# Commit e push
git add .
git commit -m "Move files to root"
git push
```

## Atualizar o Site Depois

Sempre que fizer alterações:

```powershell
git add .
git commit -m "Descrição das alterações"
git push
```

O site será atualizado automaticamente em alguns minutos!

---

## Troubleshooting

### Se der erro de autenticação:
1. No GitHub, vá em Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Clique em "Generate new token (classic)"
3. Marque: `repo` e `workflow`
4. Gere o token e copie
5. Use este token como senha quando o Git pedir

### Se o site não carregar:
1. Verifique se está acessando com `/demo/` no final
2. Ou mova os arquivos para a raiz (instruções acima)
3. Aguarde alguns minutos após o push
4. Limpe o cache do navegador (Ctrl+Shift+R)
