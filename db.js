const { MongoClient } = require('mongodb');
const readline = require('readline');

const uri = 'mongodb+srv://Username:<db_password>@cluster0.lljrzhn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

const dbName = "escola";
const collectionName = "alunos";

const client = new MongoClient(uri);

// Interface para leitura de entrada do usuário
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Função para fazer perguntas ao usuário
function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

// Função para inserir um novo aluno
async function inserirAluno(collection) {
    console.log("\n--- INSERIR NOVO ALUNO ---");
    
    const nome = await question("Digite o nome do aluno: ");
    const matricula = await question("Digite a matrícula: ");
    const curso = await question("Digite o curso: ");
    const ativoInput = await question("O aluno está ativo? (s/n): ");
    const ativo = ativoInput.toLowerCase() === 's' || ativoInput.toLowerCase() === 'sim';
    
    const novoAluno = {
        nome: nome,
        matricula: matricula,
        curso: curso,
        ativo: ativo
    };
    
    try {
        const result = await collection.insertOne(novoAluno);
        console.log(`✅ Aluno inserido com sucesso! ID: ${result.insertedId}`);
    } catch (error) {
        console.log("❌ Erro ao inserir aluno:", error.message);
    }
}

// Função para buscar alunos
async function buscarAlunos(collection) {
    console.log("\n--- BUSCAR ALUNOS ---");
    console.log("1. Buscar todos os alunos");
    console.log("2. Buscar por nome");
    console.log("3. Buscar por matrícula");
    console.log("4. Buscar por curso");
    console.log("5. Buscar apenas alunos ativos");
    
    const opcao = await question("Escolha uma opção (1-5): ");
    
    try {
        let query = {};
        let alunos = [];
        
        switch(opcao) {
            case '1':
                alunos = await collection.find({}).toArray();
                break;
            case '2':
                const nomeBusca = await question("Digite o nome para buscar: ");
                query = { nome: { $regex: nomeBusca, $options: 'i' } };
                alunos = await collection.find(query).toArray();
                break;
            case '3':
                const matriculaBusca = await question("Digite a matrícula para buscar: ");
                query = { matricula: matriculaBusca };
                alunos = await collection.find(query).toArray();
                break;
            case '4':
                const cursoBusca = await question("Digite o curso para buscar: ");
                query = { curso: { $regex: cursoBusca, $options: 'i' } };
                alunos = await collection.find(query).toArray();
                break;
            case '5':
                query = { ativo: true };
                alunos = await collection.find(query).toArray();
                break;
            default:
                console.log("❌ Opção inválida!");
                return;
        }
        
        if (alunos.length === 0) {
            console.log("❌ Nenhum aluno encontrado!");
        } else {
            console.log(`\n✅ Encontrados ${alunos.length} aluno(s):`);
            alunos.forEach((aluno, index) => {
                console.log(`\n${index + 1}. ID: ${aluno._id}`);
                console.log(`   Nome: ${aluno.nome}`);
                console.log(`   Matrícula: ${aluno.matricula}`);
                console.log(`   Curso: ${aluno.curso}`);
                console.log(`   Ativo: ${aluno.ativo ? 'Sim' : 'Não'}`);
            });
        }
    } catch (error) {
        console.log("❌ Erro ao buscar alunos:", error.message);
    }
}

// Função para atualizar aluno
async function atualizarAluno(collection) {
    console.log("\n--- ATUALIZAR ALUNO ---");
    
    const matricula = await question("Digite a matrícula do aluno a ser atualizado: ");
    
    try {
        // Buscar o aluno primeiro
        const alunoExistente = await collection.findOne({ matricula: matricula });
        
        if (!alunoExistente) {
            console.log("❌ Aluno não encontrado!");
            return;
        }
        
        console.log("\nAluno encontrado:");
        console.log(`Nome: ${alunoExistente.nome}`);
        console.log(`Matrícula: ${alunoExistente.matricula}`);
        console.log(`Curso: ${alunoExistente.curso}`);
        console.log(`Ativo: ${alunoExistente.ativo ? 'Sim' : 'Não'}`);
        
        console.log("\nDigite os novos dados (deixe em branco para manter o valor atual):");
        
        const novoNome = await question(`Nome atual (${alunoExistente.nome}): `);
        const novoCurso = await question(`Curso atual (${alunoExistente.curso}): `);
        const novoAtivoInput = await question(`Ativo atual (${alunoExistente.ativo ? 'Sim' : 'Não'}): `);
        
        const updateData = {};
        
        if (novoNome.trim() !== '') updateData.nome = novoNome;
        if (novoCurso.trim() !== '') updateData.curso = novoCurso;
        if (novoAtivoInput.trim() !== '') {
            updateData.ativo = novoAtivoInput.toLowerCase() === 's' || novoAtivoInput.toLowerCase() === 'sim';
        }
        
        if (Object.keys(updateData).length === 0) {
            console.log("❌ Nenhuma alteração foi feita!");
            return;
        }
        
        const result = await collection.updateOne(
            { matricula: matricula },
            { $set: updateData }
        );
        
        if (result.modifiedCount > 0) {
            console.log("✅ Aluno atualizado com sucesso!");
        } else {
            console.log("❌ Nenhuma alteração foi feita!");
        }
        
    } catch (error) {
        console.log("❌ Erro ao atualizar aluno:", error.message);
    }
}

// Função para deletar aluno
async function deletarAluno(collection) {
    console.log("\n--- DELETAR ALUNO ---");
    
    const matricula = await question("Digite a matrícula do aluno a ser deletado: ");
    
    try {
        // Buscar o aluno primeiro
        const alunoExistente = await collection.findOne({ matricula: matricula });
        
        if (!alunoExistente) {
            console.log("❌ Aluno não encontrado!");
            return;
        }
        
        console.log("\nAluno encontrado:");
        console.log(`Nome: ${alunoExistente.nome}`);
        console.log(`Matrícula: ${alunoExistente.matricula}`);
        console.log(`Curso: ${alunoExistente.curso}`);
        console.log(`Ativo: ${alunoExistente.ativo ? 'Sim' : 'Não'}`);
        
        const confirmacao = await question("\n⚠️  Tem certeza que deseja deletar este aluno? (s/n): ");
        
        if (confirmacao.toLowerCase() === 's' || confirmacao.toLowerCase() === 'sim') {
            const result = await collection.deleteOne({ matricula: matricula });
            
            if (result.deletedCount > 0) {
                console.log("✅ Aluno deletado com sucesso!");
            } else {
                console.log("❌ Erro ao deletar aluno!");
            }
        } else {
            console.log("❌ Operação cancelada!");
        }
        
    } catch (error) {
        console.log("❌ Erro ao deletar aluno:", error.message);
    }
}

// Função principal do menu
async function menuPrincipal(collection) {
    while (true) {
        console.log("\n" + "=".repeat(50));
        console.log("           SISTEMA DE GESTÃO DE ALUNOS");
        console.log("=".repeat(50));
        console.log("1. Inserir novo aluno");
        console.log("2. Buscar alunos");
        console.log("3. Atualizar aluno");
        console.log("4. Deletar aluno");
        console.log("5. Sair");
        console.log("=".repeat(50));
        
        const opcao = await question("Escolha uma opção (1-5): ");
        
        switch(opcao) {
            case '1':
                await inserirAluno(collection);
                break;
            case '2':
                await buscarAlunos(collection);
                break;
            case '3':
                await atualizarAluno(collection);
                break;
            case '4':
                await deletarAluno(collection);
                break;
            case '5':
                console.log("\n👋 Obrigado por usar o sistema! Até logo!");
                return;
            default:
                console.log("❌ Opção inválida! Escolha entre 1 e 5.");
        }
        
        // Pausa antes de mostrar o menu novamente
        await question("\nPressione Enter para continuar...");
    }
}

// Função principal
async function run() {
    try {
        await client.connect();
        console.log("✅ Conectado com sucesso ao servidor MongoDB Atlas!");
        
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        // Inserir alguns dados de exemplo se a coleção estiver vazia
        const count = await collection.countDocuments();
        if (count === 0) {
            console.log("\n📝 Inserindo dados de exemplo...");
            const alunosExemplo = [
                {
                    nome: "Mariana Silva",
                    matricula: "2023001",
                    curso: "Engenharia de Software",
                    ativo: true
                },
                {
                    nome: "João Santos",
                    matricula: "2023002",
                    curso: "Ciência da Computação",
                    ativo: true
                },
                {
                    nome: "Ana Costa",
                    matricula: "2023003",
                    curso: "Sistemas de Informação",
                    ativo: false
                }
            ];
            
            await collection.insertMany(alunosExemplo);
            console.log("✅ Dados de exemplo inseridos!");
        }
        
        // Iniciar o menu principal
        await menuPrincipal(collection);
        
    } catch (e) {
        console.error("❌ Ocorreu um erro: ", e);
    } finally {
        await client.close();
        rl.close();
        console.log("\n🔌 Conexão fechada.");
    }
}

run();