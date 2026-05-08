# 🔐 SchoolManager: MS3 - TeacherService

## 1. Visão Geral do Projeto
O SchoolManager é um sistema de gestão escolar desenvolvido para digitalizar e acelerar processos administrativos e acadêmicos de escolas. O foco está na produtividade da secretaria e dos professores. 

O sistema possui uma arquitetura baseada em **microsserviços**, utilizando um API Gateway como ponto de entrada (validando tokens gerados por este serviço) e comunicação híbrida (HTTP/REST para requisições síncronas e RabbitMQ para operações assíncronas). O ecossistema completo conta com 6 microsserviços isolados com seus próprios bancos de dados (MariaDB).

---

## 2. Sobre o TeacherService (MS3)
Este repositório contém exclusivamente o código do MS3 – TeacherService. Ele atua como a base para a gestão de professores e coordenadores, mantendo os seus perfis, vínculos com utilizadores do AuthService e as disciplinas que cada um está habilitado a lecionar.

**Domínio:** Professores, coordenadores e habilitações disciplinares.

### Responsabilidades Principais
* **Cadastro e Gestão de Professores/Coordenadores:** CRUD completo dos perfis docentes, incluindo nome, CPF, e-mail e status (ativo, inativo, excluído).
* **Vinculação com Autenticação:** Armazenamento do user_id (chave estrangeira lógica para o AuthService), permitindo associar um professor ao seu respectivo utilizador no sistema de identidade.
* **Habilitação por Disciplina:** Gestão das disciplinas que cada professor está apto a lecionar, através da tabela de associação teacher_disciplines. (Nota: as disciplinas são gerenciadas pelo **MS4 – ClassesService**.)

### Banco de Dados
Este microsserviço possui seu domínio de dados totalmente isolado, utilizando uma instância de **MariaDB** dedicada apenas às tabelas de usuários, senhas encriptadas e permissões.

---

## 3. Padrão de Commits

Para mantermos o histórico limpo e rastreável, este projeto utiliza a especificação conforme os exemplos abaixo.

**Formato:** `<tipo>: <mensagem curta>`

**Tipos permitidos:**
- `feat`: Nova funcionalidade (ex: criação de nova rota de login).
- `fix`: Correção de bug (ex: ajuste na expiração do token).
- `chore`: Configurações, dependências e estrutura (ex: setup do banco MariaDB).
- `docs`: Atualização de documentação (ex: melhorias neste README).
- `refactor`: Refatoração de código sem alterar regra de negócio.
- `style`: Formatação de código (linting, prettier).
- `test`: Criação/alteração de testes de segurança ou unitários.

---

# 📡 Endpoints da API

## 👨‍🏫 Teachers (ADMIN)

| Método | Endpoint                          | Descrição                                      | Auth | Body |
|--------|----------------------------------|-----------------------------------------------|------|------|
| GET    | `/teachers/listTeachers`         | Lista professores (com paginação e filtros)   | ✅   | — |
| GET    | `/teachers/listTeacherById/{id}` | Busca professor por ID                        | ✅   | — |
| POST   | `/teachers/createTeacher`        | Cria novo professor                           | ✅   | teacher_name, teacher_cpf, teacher_email, user_id, teacher_status |
| PUT    | `/teachers/updateTeacher/{id}`   | Atualiza dados do professor                   | ✅   | teacher_name, teacher_cpf, teacher_email, teacher_status |
| DELETE | `/teachers/deleteTeacher/{id}`   | Deleta professor (lógico)                     | ✅   | — |

---

## 📚 Teacher Disciplines (ADMIN)

| Método | Endpoint                                          | Descrição                                      | Auth | Body |
|--------|--------------------------------------------------|-----------------------------------------------|------|------|
| POST   | `/teachers/linkDiscipline/{id}`                  | Vincula disciplina ao professor               | ✅   | discipline_id |
| DELETE | `/teachers/unlinkDiscipline/{id}/{disciplineId}` | Remove vínculo professor-disciplina           | ✅   | — |

---

## 🔌 Endpoints Internos (Service-to-Service, sem JWT)

Endpoints públicos consumidos por outros microsserviços.

| Método | Endpoint                            | Consumidor | Finalidade                                                                |
|--------|-------------------------------------|------------|---------------------------------------------------------------------------|
| GET    | `/teachers/byUser/{userId}`         | MS1        | Enriquece o JWT no login com `teacher_id` quando role=TEACHER             |
| GET    | `/teachers/byCpf/{cpf}`             | MS1        | Validação prévia ao criar usuário — checa se CPF já existe no MS3         |
| GET    | `/teachers/byEmail/{email}`         | MS1        | Validação prévia ao criar usuário — checa se e-mail já existe no MS3      |
| GET    | `/teachers/disciplines/{teacherId}` | MS4        | Lista disciplinas habilitadas, usado ao alocar professor em turma         |

---

## ❤️ Health Check

| Método | Endpoint   | Descrição                  | Auth |
|--------|-----------|---------------------------|------|
| GET    | `/health` | Verifica status da API     | ❌   |

---

## 📨 Eventos RabbitMQ (Consumer)

| Evento        | Routing Key    | Ação no MS3                                                                      | Idempotência                                  |
|---------------|----------------|----------------------------------------------------------------------------------|-----------------------------------------------|
| `UserCreated` | `user.created` | Se o payload contém `teacher_name` e `teacher_cpf`, cria o professor via `teacherService.createTeacher` independente da `role` (ADMIN/TEACHER — coordenadores também podem lecionar). Sem esses campos, apenas faz log e ignora. | `EMAIL_ALREADY_EXISTS` ou `CPF_ALREADY_EXISTS` → ignora |
| `UserDeleted` | `user.deleted` | Busca professor por `user_id` e executa soft-delete (`teacher_status = 2`).      | `TEACHER_NOT_FOUND` → ignora                  |