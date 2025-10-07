# 🧪 Guia de Teste - Sistema CRUD MongoDB

## 📋 Pré-requisitos

### Opção 1: MongoDB Local (Recomendado)
1. **Instalar MongoDB Community Server:**
   - Baixe em: https://www.mongodb.com/try/download/community
   - Instale seguindo as instruções
   - Inicie o serviço MongoDB

2. **Verificar se está rodando:**
   ```bash
   mongod --version
   ```

### Opção 2: MongoDB Atlas (Cloud)
1. Configure a senha correta no arquivo `db.js`
2. Substitua `<db_password>` pela senha real do seu usuário

## 🚀 Como Executar

### Para MongoDB Local:
```bash
node db-local.js
```

### Para MongoDB Atlas:
```bash
node db.js
```

## 🧪 Cenários de Teste

### 1. **Teste de Conexão**
- ✅ Deve conectar ao MongoDB
- ✅ Deve inserir dados de exemplo automaticamente
- ✅ Deve mostrar o menu principal

### 2. **Teste CREATE (Inserir)**
- Escolha opção `1`
- Digite dados de teste:
  - Nome: "Pedro Oliveira"
  - Matrícula: "2023004"
  - Curso: "Análise e Desenvolvimento de Sistemas"
  - Ativo: "s"
- ✅ Deve mostrar mensagem de sucesso com ID

### 3. **Teste READ (Buscar)**
- Escolha opção `2`
- Teste cada sub-opção:

#### 3.1 Buscar todos os alunos
- Escolha `1`
- ✅ Deve mostrar todos os alunos (incluindo os de exemplo)

#### 3.2 Buscar por nome
- Escolha `2`
- Digite: "Mariana"
- ✅ Deve encontrar "Mariana Silva"

#### 3.3 Buscar por matrícula
- Escolha `3`
- Digite: "2023001"
- ✅ Deve encontrar apenas o aluno com essa matrícula

#### 3.4 Buscar por curso
- Escolha `4`
- Digite: "Software"
- ✅ Deve encontrar alunos com "Software" no curso

#### 3.5 Buscar alunos ativos
- Escolha `5`
- ✅ Deve mostrar apenas alunos com ativo: true

### 4. **Teste UPDATE (Atualizar)**
- Escolha opção `3`
- Digite matrícula: "2023001"
- ✅ Deve mostrar dados do aluno
- Teste atualizações:
  - Nome: "Mariana Silva Santos"
  - Curso: "Engenharia de Software e IA"
  - Ativo: "n"
- ✅ Deve confirmar atualização
- Verifique com busca para confirmar mudanças

### 5. **Teste DELETE (Deletar)**
- Escolha opção `4`
- Digite matrícula: "2023003"
- ✅ Deve mostrar dados do aluno
- Confirme com "s"
- ✅ Deve confirmar exclusão
- Verifique com busca que o aluno foi removido

### 6. **Teste de Validação**
- Tente inserir aluno com matrícula duplicada
- Tente buscar aluno inexistente
- Tente atualizar aluno inexistente
- Tente deletar aluno inexistente
- ✅ Deve mostrar mensagens de erro apropriadas

## 🔍 Verificação Manual no MongoDB

### Para MongoDB Local:
```bash
# Conectar ao MongoDB
mongosh

# Usar o banco
use escola

# Ver todos os alunos
db.alunos.find().pretty()

# Contar alunos
db.alunos.countDocuments()

# Buscar por nome
db.alunos.find({nome: /Mariana/i})

# Buscar ativos
db.alunos.find({ativo: true})
```

### Para MongoDB Atlas:
- Use o MongoDB Compass ou interface web
- Conecte com sua string de conexão
- Navegue até a coleção "alunos" no banco "escola"

## 🐛 Troubleshooting

### Erro de Conexão:
- Verifique se MongoDB está rodando
- Para local: `mongod --version`
- Para Atlas: verifique string de conexão e credenciais

### Erro de Autenticação:
- Para Atlas: configure senha correta
- Para local: remova autenticação ou configure usuário

### Erro de Permissão:
- Verifique se tem acesso ao banco/coleção
- Para Atlas: verifique IP whitelist

## 📊 Resultados Esperados

Após todos os testes, você deve ter:
- ✅ Conexão estabelecida
- ✅ Dados de exemplo inseridos
- ✅ CRUD funcionando completamente
- ✅ Validações funcionando
- ✅ Interface amigável
- ✅ Tratamento de erros adequado

## 🎯 Teste Final

Execute uma sequência completa:
1. Inserir 2 novos alunos
2. Buscar todos os alunos
3. Atualizar 1 aluno
4. Deletar 1 aluno
5. Buscar novamente para verificar
6. Sair do sistema

Se tudo funcionar, o sistema está pronto para uso! 🎉
