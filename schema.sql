-- Hub de Estudos · TI2 PUC Minas · Esquema do banco de dados
-- PostgreSQL (Supabase). Gerado a partir do modelo conceitual (images/00-08 do repositório).

-- ======================================================================
-- 1. Usuários e preferências
-- ======================================================================
CREATE TABLE usuario (
  id_usuario integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  nome varchar(100) NOT NULL,
  email_institucional varchar(150) NOT NULL,
  senha varchar(255) NOT NULL,
  matricula varchar(20) NOT NULL,
  curso varchar(100) NOT NULL,
  periodo smallint,
  turno varchar(10),
  data_cadastro date NOT NULL DEFAULT CURRENT_DATE,
  link_calendario varchar(255),
  administrador boolean NOT NULL DEFAULT false,
  CONSTRAINT pk_usuario PRIMARY KEY (id_usuario),
  CONSTRAINT uq_usuario_email_institucional UNIQUE (email_institucional),
  CONSTRAINT uq_usuario_matricula UNIQUE (matricula),
  CONSTRAINT ck_usuario_nome CHECK (char_length(trim(nome)) > 0),
  CONSTRAINT ck_usuario_email_institucional CHECK (email_institucional ~* '^[^@\s]+@([a-z0-9-]+\.)*pucminas\.br$'),
  CONSTRAINT ck_usuario_periodo CHECK (periodo BETWEEN 1 AND 12),
  CONSTRAINT ck_usuario_turno CHECK (turno IN ('manhã', 'tarde', 'noite'))
);
COMMENT ON TABLE usuario IS 'Pessoa cadastrada no Hub. O cargo (aluno, monitor, professor) é definido por turma, em turma_usuario.';

CREATE TABLE preferencia (
  id_usuario integer NOT NULL,
  tema_interface varchar(10) NOT NULL DEFAULT 'sistema',
  tamanho_fonte varchar(10) NOT NULL DEFAULT 'médio',
  densidade varchar(12) NOT NULL DEFAULT 'padrão',
  idioma varchar(5) NOT NULL DEFAULT 'pt-BR',
  visibilidade_perfil varchar(10) NOT NULL DEFAULT 'turmas',
  mostrar_online boolean NOT NULL DEFAULT true,
  alto_contraste boolean NOT NULL DEFAULT false,
  reduzir_animacoes boolean NOT NULL DEFAULT false,
  leitor_tela boolean NOT NULL DEFAULT false,
  atalhos_teclado boolean NOT NULL DEFAULT false,
  foco_reforcado boolean NOT NULL DEFAULT false,
  verificacao_duas_etapas boolean NOT NULL DEFAULT false,
  CONSTRAINT pk_preferencia PRIMARY KEY (id_usuario),
  CONSTRAINT fk_preferencia_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE,
  CONSTRAINT ck_preferencia_tema_interface CHECK (tema_interface IN ('claro', 'escuro', 'sistema')),
  CONSTRAINT ck_preferencia_tamanho_fonte CHECK (tamanho_fonte IN ('pequeno', 'médio', 'grande')),
  CONSTRAINT ck_preferencia_densidade CHECK (densidade IN ('compacta', 'padrão', 'confortável')),
  CONSTRAINT ck_preferencia_idioma CHECK (idioma IN ('pt-BR', 'en-US', 'es-ES')),
  CONSTRAINT ck_preferencia_visibilidade_perfil CHECK (visibilidade_perfil IN ('pública', 'turmas', 'privada'))
);
COMMENT ON TABLE preferencia IS 'Preferências de interface e acessibilidade (1:1 com usuário, entidade fraca).';

CREATE TABLE preferencia_notificacao (
  id_usuario integer NOT NULL,
  tipo_notificacao varchar(20) NOT NULL,
  aviso_app boolean NOT NULL DEFAULT true,
  aviso_email boolean NOT NULL DEFAULT false,
  CONSTRAINT pk_preferencia_notificacao PRIMARY KEY (id_usuario, tipo_notificacao),
  CONSTRAINT fk_preferencia_notificacao_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE,
  CONSTRAINT ck_preferencia_notificacao_tipo_notificacao CHECK (tipo_notificacao IN ('nova dúvida', 'nova resposta', 'nova mensagem', 'nova nota', 'novo evento', 'nova enquete', 'enquete encerrada', 'comunicado'))
);
COMMENT ON TABLE preferencia_notificacao IS 'Como o usuário quer ser avisado de cada tipo de notificação (entidade fraca).';

-- ======================================================================
-- 2. Matérias, turmas e cargos
-- ======================================================================
CREATE TABLE materia (
  id_materia integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  nome varchar(100) NOT NULL,
  sigla varchar(20) NOT NULL,
  creditos smallint NOT NULL,
  CONSTRAINT pk_materia PRIMARY KEY (id_materia),
  CONSTRAINT uq_materia_sigla UNIQUE (sigla),
  CONSTRAINT ck_materia_nome CHECK (char_length(trim(nome)) > 0),
  CONSTRAINT ck_materia_creditos CHECK (creditos > 0)
);
COMMENT ON TABLE materia IS 'Disciplina do curso.';

CREATE TABLE materia_apelido (
  id_materia integer NOT NULL,
  apelido varchar(30) NOT NULL,
  CONSTRAINT pk_materia_apelido PRIMARY KEY (id_materia, apelido),
  CONSTRAINT fk_materia_apelido_id_materia FOREIGN KEY (id_materia) REFERENCES materia (id_materia) ON DELETE CASCADE,
  CONSTRAINT ck_materia_apelido_apelido CHECK (char_length(trim(apelido)) > 0)
);
COMMENT ON TABLE materia_apelido IS 'Apelidos usados na busca (atributo multivalorado de matéria: ''calc'' → Cálculo I).';

CREATE TABLE turma (
  id_turma integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_materia integer NOT NULL,
  identificacao varchar(20) NOT NULL,
  semestre_letivo char(6) NOT NULL,
  turno varchar(10) NOT NULL,
  total_aulas smallint NOT NULL,
  frequencia_minima numeric(5,2) NOT NULL DEFAULT 75,
  nota_aprovacao numeric(5,2) NOT NULL DEFAULT 60,
  CONSTRAINT pk_turma PRIMARY KEY (id_turma),
  CONSTRAINT fk_turma_id_materia FOREIGN KEY (id_materia) REFERENCES materia (id_materia) ON DELETE RESTRICT,
  CONSTRAINT uq_turma_id_materia_semestre_letivo_identificacao UNIQUE (id_materia, semestre_letivo, identificacao),
  CONSTRAINT ck_turma_semestre_letivo CHECK (semestre_letivo ~ '^[0-9]{4}/[12]$'),
  CONSTRAINT ck_turma_turno CHECK (turno IN ('manhã', 'tarde', 'noite')),
  CONSTRAINT ck_turma_total_aulas CHECK (total_aulas > 0),
  CONSTRAINT ck_turma_frequencia_minima CHECK (frequencia_minima BETWEEN 0 AND 100),
  CONSTRAINT ck_turma_nota_aprovacao CHECK (nota_aprovacao BETWEEN 0 AND 100)
);
COMMENT ON TABLE turma IS 'Oferta de uma matéria em um semestre, com a regra de aprovação.';

CREATE TABLE turma_usuario (
  id_turma integer NOT NULL,
  id_usuario integer NOT NULL,
  cargo varchar(10) NOT NULL DEFAULT 'aluno',
  situacao varchar(12) NOT NULL DEFAULT 'cursando',
  faltas smallint NOT NULL DEFAULT 0,
  data_entrada date NOT NULL DEFAULT CURRENT_DATE,
  origem varchar(10) NOT NULL DEFAULT 'manual',
  CONSTRAINT pk_turma_usuario PRIMARY KEY (id_turma, id_usuario),
  CONSTRAINT fk_turma_usuario_id_turma FOREIGN KEY (id_turma) REFERENCES turma (id_turma) ON DELETE CASCADE,
  CONSTRAINT fk_turma_usuario_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE,
  CONSTRAINT ck_turma_usuario_cargo CHECK (cargo IN ('aluno', 'monitor', 'professor')),
  CONSTRAINT ck_turma_usuario_situacao CHECK (situacao IN ('cursando', 'aprovado', 'reprovado', 'trancado')),
  CONSTRAINT ck_turma_usuario_faltas CHECK (faltas >= 0),
  CONSTRAINT ck_turma_usuario_origem CHECK (origem IN ('manual', 'csv', 'canvas'))
);
COMMENT ON TABLE turma_usuario IS 'Participação do usuário na turma (relacionamento N:N ''participa''). Define o cargo na turma.';

CREATE TABLE historico_cargo (
  id_historico integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_turma integer NOT NULL,
  id_usuario integer NOT NULL,
  id_alterado_por integer NOT NULL,
  cargo_anterior varchar(10) NOT NULL,
  cargo_novo varchar(10) NOT NULL,
  data_hora timestamptz NOT NULL DEFAULT now(),
  meio varchar(10) NOT NULL,
  CONSTRAINT pk_historico_cargo PRIMARY KEY (id_historico),
  CONSTRAINT fk_historico_cargo_id_turma FOREIGN KEY (id_turma) REFERENCES turma (id_turma) ON DELETE CASCADE,
  CONSTRAINT fk_historico_cargo_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_historico_cargo_id_alterado_por FOREIGN KEY (id_alterado_por) REFERENCES usuario (id_usuario) ON DELETE RESTRICT,
  CONSTRAINT ck_historico_cargo_cargo_anterior CHECK (cargo_anterior IN ('aluno', 'monitor', 'professor')),
  CONSTRAINT ck_historico_cargo_cargo_novo CHECK (cargo_novo IN ('aluno', 'monitor', 'professor')),
  CONSTRAINT ck_historico_cargo_meio CHECK (meio IN ('página', 'csv')),
  CONSTRAINT ck_historico_cargo_regra1 CHECK (cargo_novo <> cargo_anterior)
);
COMMENT ON TABLE historico_cargo IS 'Registro de cada troca de cargo feita por professor ou administrador.';

CREATE TABLE horario_atendimento (
  id_horario integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_turma integer NOT NULL,
  id_monitor integer NOT NULL,
  dia_semana smallint NOT NULL,
  hora_inicio time NOT NULL,
  hora_fim time NOT NULL,
  CONSTRAINT pk_horario_atendimento PRIMARY KEY (id_horario),
  CONSTRAINT fk_horario_atendimento_id_turma FOREIGN KEY (id_turma) REFERENCES turma (id_turma) ON DELETE CASCADE,
  CONSTRAINT fk_horario_atendimento_id_monitor FOREIGN KEY (id_monitor) REFERENCES usuario (id_usuario) ON DELETE CASCADE,
  CONSTRAINT ck_horario_atendimento_dia_semana CHECK (dia_semana BETWEEN 1 AND 7),
  CONSTRAINT ck_horario_atendimento_regra1 CHECK (hora_fim > hora_inicio)
);
COMMENT ON TABLE horario_atendimento IS 'Horário semanal em que um monitor atende uma turma.';

-- ======================================================================
-- 3. Canvas, notas e calendário
-- ======================================================================
CREATE TABLE integracao_canvas (
  id_usuario integer NOT NULL,
  token varchar(255) NOT NULL,
  autorizado boolean NOT NULL DEFAULT false,
  situacao varchar(10) NOT NULL DEFAULT 'ativa',
  ultima_sincronizacao timestamptz,
  url_feed varchar(255),
  CONSTRAINT pk_integracao_canvas PRIMARY KEY (id_usuario),
  CONSTRAINT fk_integracao_canvas_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE,
  CONSTRAINT ck_integracao_canvas_situacao CHECK (situacao IN ('ativa', 'pausada', 'expirada', 'revogada'))
);
COMMENT ON TABLE integracao_canvas IS 'Conexão do usuário com o Canvas (0 ou 1 por usuário, entidade fraca).';

CREATE TABLE atividade_avaliativa (
  id_atividade integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_turma integer NOT NULL,
  nome varchar(150) NOT NULL,
  valor numeric(5,2) NOT NULL,
  origem varchar(10) NOT NULL DEFAULT 'manual',
  CONSTRAINT pk_atividade_avaliativa PRIMARY KEY (id_atividade),
  CONSTRAINT fk_atividade_avaliativa_id_turma FOREIGN KEY (id_turma) REFERENCES turma (id_turma) ON DELETE CASCADE,
  CONSTRAINT ck_atividade_avaliativa_nome CHECK (char_length(trim(nome)) > 0),
  CONSTRAINT ck_atividade_avaliativa_valor CHECK (valor > 0 AND valor <= 100),
  CONSTRAINT ck_atividade_avaliativa_origem CHECK (origem IN ('canvas', 'manual'))
);
COMMENT ON TABLE atividade_avaliativa IS 'Atividade que vale pontos em uma turma (''compõe'').';

CREATE TABLE nota (
  id_atividade integer NOT NULL,
  id_usuario integer NOT NULL,
  pontos_obtidos numeric(5,2) NOT NULL,
  origem varchar(10) NOT NULL DEFAULT 'manual',
  CONSTRAINT pk_nota PRIMARY KEY (id_atividade, id_usuario),
  CONSTRAINT fk_nota_id_atividade FOREIGN KEY (id_atividade) REFERENCES atividade_avaliativa (id_atividade) ON DELETE CASCADE,
  CONSTRAINT fk_nota_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE,
  CONSTRAINT ck_nota_pontos_obtidos CHECK (pontos_obtidos >= 0),
  CONSTRAINT ck_nota_origem CHECK (origem IN ('canvas', 'manual'))
);
COMMENT ON TABLE nota IS 'Nota de um usuário em uma atividade (relacionamento N:N ''recebe nota'').';

CREATE TABLE evento (
  id_evento integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_turma integer NOT NULL,
  id_atividade integer,
  titulo varchar(150) NOT NULL,
  tipo varchar(12) NOT NULL,
  data date NOT NULL,
  hora time,
  local varchar(100),
  origem varchar(10) NOT NULL DEFAULT 'hub',
  CONSTRAINT pk_evento PRIMARY KEY (id_evento),
  CONSTRAINT fk_evento_id_turma FOREIGN KEY (id_turma) REFERENCES turma (id_turma) ON DELETE CASCADE,
  CONSTRAINT fk_evento_id_atividade FOREIGN KEY (id_atividade) REFERENCES atividade_avaliativa (id_atividade) ON DELETE SET NULL,
  CONSTRAINT uq_evento_id_atividade UNIQUE (id_atividade),
  CONSTRAINT ck_evento_titulo CHECK (char_length(trim(titulo)) > 0),
  CONSTRAINT ck_evento_tipo CHECK (tipo IN ('prova', 'entrega', 'aula', 'aulão', 'monitoria', 'outro')),
  CONSTRAINT ck_evento_origem CHECK (origem IN ('canvas', 'hub'))
);
COMMENT ON TABLE evento IS 'Item do calendário de uma turma (''agenda''); pode corresponder a uma atividade.';

CREATE TABLE entrega (
  id_evento integer NOT NULL,
  id_usuario integer NOT NULL,
  progresso smallint NOT NULL DEFAULT 0,
  situacao varchar(12) NOT NULL DEFAULT 'pendente',
  CONSTRAINT pk_entrega PRIMARY KEY (id_evento, id_usuario),
  CONSTRAINT fk_entrega_id_evento FOREIGN KEY (id_evento) REFERENCES evento (id_evento) ON DELETE CASCADE,
  CONSTRAINT fk_entrega_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE,
  CONSTRAINT ck_entrega_progresso CHECK (progresso BETWEEN 0 AND 100),
  CONSTRAINT ck_entrega_situacao CHECK (situacao IN ('pendente', 'em andamento', 'entregue', 'atrasada'))
);
COMMENT ON TABLE entrega IS 'Progresso de cada usuário em um evento de entrega (relacionamento N:N ''entrega'').';

-- ======================================================================
-- 4. Temas e conteúdos
-- ======================================================================
CREATE TABLE tema (
  id_tema integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_materia integer NOT NULL,
  titulo varchar(100) NOT NULL,
  ordem smallint NOT NULL,
  CONSTRAINT pk_tema PRIMARY KEY (id_tema),
  CONSTRAINT fk_tema_id_materia FOREIGN KEY (id_materia) REFERENCES materia (id_materia) ON DELETE CASCADE,
  CONSTRAINT uq_tema_id_materia_ordem UNIQUE (id_materia, ordem),
  CONSTRAINT ck_tema_titulo CHECK (char_length(trim(titulo)) > 0),
  CONSTRAINT ck_tema_ordem CHECK (ordem > 0)
);
COMMENT ON TABLE tema IS 'Assunto dentro de uma matéria, em ordem de estudo (''organiza'').';

CREATE TABLE usuario_tema (
  id_usuario integer NOT NULL,
  id_tema integer NOT NULL,
  situacao varchar(12) NOT NULL DEFAULT 'não iniciado',
  data_atualizacao timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pk_usuario_tema PRIMARY KEY (id_usuario, id_tema),
  CONSTRAINT fk_usuario_tema_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_usuario_tema_id_tema FOREIGN KEY (id_tema) REFERENCES tema (id_tema) ON DELETE CASCADE,
  CONSTRAINT ck_usuario_tema_situacao CHECK (situacao IN ('não iniciado', 'estudando', 'concluído'))
);
COMMENT ON TABLE usuario_tema IS 'Progresso do usuário em um tema (relacionamento N:N ''estuda'').';

CREATE TABLE conteudo (
  id_conteudo integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_materia integer NOT NULL,
  id_tema integer,
  id_autor integer NOT NULL,
  id_revisor integer,
  titulo varchar(150) NOT NULL,
  descricao text,
  tipo varchar(12) NOT NULL,
  palavras_chave text[] NOT NULL DEFAULT '{}',
  data_publicacao timestamptz NOT NULL DEFAULT now(),
  nome_arquivo varchar(150) NOT NULL,
  formato varchar(10) NOT NULL,
  tamanho_mb numeric(7,2) NOT NULL,
  endereco_arquivo varchar(255) NOT NULL,
  CONSTRAINT pk_conteudo PRIMARY KEY (id_conteudo),
  CONSTRAINT fk_conteudo_id_materia FOREIGN KEY (id_materia) REFERENCES materia (id_materia) ON DELETE RESTRICT,
  CONSTRAINT fk_conteudo_id_tema FOREIGN KEY (id_tema) REFERENCES tema (id_tema) ON DELETE SET NULL,
  CONSTRAINT fk_conteudo_id_autor FOREIGN KEY (id_autor) REFERENCES usuario (id_usuario) ON DELETE RESTRICT,
  CONSTRAINT fk_conteudo_id_revisor FOREIGN KEY (id_revisor) REFERENCES usuario (id_usuario) ON DELETE SET NULL,
  CONSTRAINT ck_conteudo_titulo CHECK (char_length(trim(titulo)) > 0),
  CONSTRAINT ck_conteudo_tipo CHECK (tipo IN ('estudo', 'exercício', 'projeto', 'prova')),
  CONSTRAINT ck_conteudo_formato CHECK (formato IN ('PDF', 'HTML', 'DOCX', 'PPTX', 'PNG', 'JPG', 'MP4', 'ZIP')),
  CONSTRAINT ck_conteudo_tamanho_mb CHECK (tamanho_mb > 0),
  CONSTRAINT ck_conteudo_regra1 CHECK (id_revisor IS NULL OR id_revisor <> id_autor)
);
COMMENT ON TABLE conteudo IS 'Material de estudo publicado no Hub.';

CREATE TABLE usuario_conteudo (
  id_usuario integer NOT NULL,
  id_conteudo integer NOT NULL,
  favorito boolean NOT NULL DEFAULT false,
  situacao varchar(12) NOT NULL DEFAULT 'não iniciado',
  data_ultima_interacao timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pk_usuario_conteudo PRIMARY KEY (id_usuario, id_conteudo),
  CONSTRAINT fk_usuario_conteudo_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_usuario_conteudo_id_conteudo FOREIGN KEY (id_conteudo) REFERENCES conteudo (id_conteudo) ON DELETE CASCADE,
  CONSTRAINT ck_usuario_conteudo_situacao CHECK (situacao IN ('não iniciado', 'estudando', 'concluído'))
);
COMMENT ON TABLE usuario_conteudo IS 'Favorito e progresso do usuário em um conteúdo (relacionamento N:N ''interage'').';

CREATE TABLE acesso_conteudo (
  id_acesso bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_usuario integer NOT NULL,
  id_conteudo integer NOT NULL,
  data_hora timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pk_acesso_conteudo PRIMARY KEY (id_acesso),
  CONSTRAINT fk_acesso_conteudo_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_acesso_conteudo_id_conteudo FOREIGN KEY (id_conteudo) REFERENCES conteudo (id_conteudo) ON DELETE CASCADE
);
COMMENT ON TABLE acesso_conteudo IS 'Cada abertura de um conteúdo por um usuário (base para relatórios).';

CREATE TABLE comentario (
  id_comentario integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_conteudo integer NOT NULL,
  id_usuario integer NOT NULL,
  texto varchar(1000) NOT NULL,
  data timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pk_comentario PRIMARY KEY (id_comentario),
  CONSTRAINT fk_comentario_id_conteudo FOREIGN KEY (id_conteudo) REFERENCES conteudo (id_conteudo) ON DELETE CASCADE,
  CONSTRAINT fk_comentario_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE,
  CONSTRAINT ck_comentario_texto CHECK (char_length(trim(texto)) > 0)
);
COMMENT ON TABLE comentario IS 'Comentário de um usuário em um conteúdo.';

-- ======================================================================
-- 5. Dúvidas e monitoria
-- ======================================================================
CREATE TABLE duvida (
  id_duvida integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  numero integer NOT NULL,
  id_autor integer NOT NULL,
  id_turma integer,
  id_tema integer,
  tipo varchar(20) NOT NULL,
  assunto varchar(150) NOT NULL,
  descricao text NOT NULL,
  data_hora_abertura timestamptz NOT NULL DEFAULT now(),
  situacao varchar(20) NOT NULL DEFAULT 'na fila',
  resolveu boolean,
  CONSTRAINT pk_duvida PRIMARY KEY (id_duvida),
  CONSTRAINT fk_duvida_id_autor FOREIGN KEY (id_autor) REFERENCES usuario (id_usuario) ON DELETE RESTRICT,
  CONSTRAINT fk_duvida_id_turma FOREIGN KEY (id_turma) REFERENCES turma (id_turma) ON DELETE SET NULL,
  CONSTRAINT fk_duvida_id_tema FOREIGN KEY (id_tema) REFERENCES tema (id_tema) ON DELETE SET NULL,
  CONSTRAINT uq_duvida_numero UNIQUE (numero),
  CONSTRAINT ck_duvida_numero CHECK (numero > 0),
  CONSTRAINT ck_duvida_tipo CHECK (tipo IN ('dúvida de matéria', 'pedido de material', 'problema no site')),
  CONSTRAINT ck_duvida_assunto CHECK (char_length(trim(assunto)) > 0),
  CONSTRAINT ck_duvida_descricao CHECK (char_length(trim(descricao)) > 0),
  CONSTRAINT ck_duvida_situacao CHECK (situacao IN ('na fila', 'aguardando resposta', 'respondida', 'resolvida', 'fechada')),
  CONSTRAINT ck_duvida_regra1 CHECK (tipo <> 'dúvida de matéria' OR id_turma IS NOT NULL),
  CONSTRAINT ck_duvida_regra2 CHECK (situacao <> 'resolvida' OR resolveu IS TRUE)
);
COMMENT ON TABLE duvida IS 'Dúvida aberta por um usuário; pode ir para a fila de uma turma e se referir a um tema.';

CREATE TABLE resposta (
  id_resposta integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_duvida integer NOT NULL,
  id_autor integer NOT NULL,
  texto text NOT NULL,
  data_hora timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pk_resposta PRIMARY KEY (id_resposta),
  CONSTRAINT fk_resposta_id_duvida FOREIGN KEY (id_duvida) REFERENCES duvida (id_duvida) ON DELETE CASCADE,
  CONSTRAINT fk_resposta_id_autor FOREIGN KEY (id_autor) REFERENCES usuario (id_usuario) ON DELETE RESTRICT,
  CONSTRAINT ck_resposta_texto CHECK (char_length(trim(texto)) > 0)
);
COMMENT ON TABLE resposta IS 'Resposta dada a uma dúvida (''tem'' / ''responde'').';

CREATE TABLE duvida_util (
  id_duvida integer NOT NULL,
  id_usuario integer NOT NULL,
  CONSTRAINT pk_duvida_util PRIMARY KEY (id_duvida, id_usuario),
  CONSTRAINT fk_duvida_util_id_duvida FOREIGN KEY (id_duvida) REFERENCES duvida (id_duvida) ON DELETE CASCADE,
  CONSTRAINT fk_duvida_util_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE
);
COMMENT ON TABLE duvida_util IS 'Usuários que marcaram a dúvida como útil (relacionamento N:N ''marca útil'').';

-- ======================================================================
-- 6. Enquetes e aulões
-- ======================================================================
CREATE TABLE enquete (
  id_enquete integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_turma integer NOT NULL,
  id_criador integer NOT NULL,
  id_evento integer,
  titulo varchar(150) NOT NULL,
  situacao varchar(10) NOT NULL DEFAULT 'ativa',
  data_abertura timestamptz NOT NULL DEFAULT now(),
  data_encerramento timestamptz,
  CONSTRAINT pk_enquete PRIMARY KEY (id_enquete),
  CONSTRAINT fk_enquete_id_turma FOREIGN KEY (id_turma) REFERENCES turma (id_turma) ON DELETE CASCADE,
  CONSTRAINT fk_enquete_id_criador FOREIGN KEY (id_criador) REFERENCES usuario (id_usuario) ON DELETE RESTRICT,
  CONSTRAINT fk_enquete_id_evento FOREIGN KEY (id_evento) REFERENCES evento (id_evento) ON DELETE SET NULL,
  CONSTRAINT uq_enquete_id_evento UNIQUE (id_evento),
  CONSTRAINT ck_enquete_titulo CHECK (char_length(trim(titulo)) > 0),
  CONSTRAINT ck_enquete_situacao CHECK (situacao IN ('rascunho', 'ativa', 'encerrada')),
  CONSTRAINT ck_enquete_regra1 CHECK (data_encerramento IS NULL OR data_encerramento > data_abertura)
);
COMMENT ON TABLE enquete IS 'Enquete aberta em uma turma (''abre''), criada por um usuário (''cria'').';

CREATE TABLE opcao_enquete (
  id_opcao integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_enquete integer NOT NULL,
  id_tema integer,
  texto varchar(150) NOT NULL,
  CONSTRAINT pk_opcao_enquete PRIMARY KEY (id_opcao),
  CONSTRAINT fk_opcao_enquete_id_enquete FOREIGN KEY (id_enquete) REFERENCES enquete (id_enquete) ON DELETE CASCADE,
  CONSTRAINT fk_opcao_enquete_id_tema FOREIGN KEY (id_tema) REFERENCES tema (id_tema) ON DELETE SET NULL,
  CONSTRAINT uq_opcao_enquete_id_enquete_texto UNIQUE (id_enquete, texto),
  CONSTRAINT ck_opcao_enquete_texto CHECK (char_length(trim(texto)) > 0)
);
COMMENT ON TABLE opcao_enquete IS 'Opção de voto de uma enquete (''oferece''); pode se referir a um tema (''sobre'').';

CREATE TABLE voto (
  id_usuario integer NOT NULL,
  id_opcao integer NOT NULL,
  data_hora timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pk_voto PRIMARY KEY (id_usuario, id_opcao),
  CONSTRAINT fk_voto_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE,
  CONSTRAINT fk_voto_id_opcao FOREIGN KEY (id_opcao) REFERENCES opcao_enquete (id_opcao) ON DELETE CASCADE
);
COMMENT ON TABLE voto IS 'Voto de um usuário em uma opção (relacionamento N:N ''vota'').';

-- ======================================================================
-- 7. Mensagens e notificações
-- ======================================================================
CREATE TABLE conversa (
  id_conversa integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  tipo varchar(6) NOT NULL,
  topico varchar(100),
  data_criacao timestamptz NOT NULL DEFAULT now(),
  id_turma integer,
  CONSTRAINT pk_conversa PRIMARY KEY (id_conversa),
  CONSTRAINT fk_conversa_id_turma FOREIGN KEY (id_turma) REFERENCES turma (id_turma) ON DELETE CASCADE,
  CONSTRAINT ck_conversa_tipo CHECK (tipo IN ('direta', 'sala')),
  CONSTRAINT ck_conversa_regra1 CHECK ((tipo = 'sala' AND id_turma IS NOT NULL) OR (tipo = 'direta' AND id_turma IS NULL))
);
COMMENT ON TABLE conversa IS 'Conversa direta entre usuários ou sala de uma turma (''sala de'').';

CREATE TABLE participante_conversa (
  id_conversa integer NOT NULL,
  id_usuario integer NOT NULL,
  data_ultima_leitura timestamptz,
  CONSTRAINT pk_participante_conversa PRIMARY KEY (id_conversa, id_usuario),
  CONSTRAINT fk_participante_conversa_id_conversa FOREIGN KEY (id_conversa) REFERENCES conversa (id_conversa) ON DELETE CASCADE,
  CONSTRAINT fk_participante_conversa_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE
);
COMMENT ON TABLE participante_conversa IS 'Participantes da conversa e até onde cada um leu (relacionamento N:N ''participa'').';

CREATE TABLE mensagem (
  id_mensagem bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_conversa integer NOT NULL,
  id_remetente integer NOT NULL,
  texto varchar(2000) NOT NULL,
  data_hora timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pk_mensagem PRIMARY KEY (id_mensagem),
  CONSTRAINT fk_mensagem_id_conversa FOREIGN KEY (id_conversa) REFERENCES conversa (id_conversa) ON DELETE CASCADE,
  CONSTRAINT fk_mensagem_id_remetente FOREIGN KEY (id_remetente) REFERENCES usuario (id_usuario) ON DELETE RESTRICT,
  CONSTRAINT ck_mensagem_texto CHECK (char_length(trim(texto)) > 0)
);
COMMENT ON TABLE mensagem IS 'Mensagem enviada em uma conversa (''envia'' / ''contém'').';

CREATE TABLE comunicado (
  id_comunicado integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_remetente integer NOT NULL,
  assunto varchar(150) NOT NULL,
  texto text NOT NULL,
  data_hora timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pk_comunicado PRIMARY KEY (id_comunicado),
  CONSTRAINT fk_comunicado_id_remetente FOREIGN KEY (id_remetente) REFERENCES usuario (id_usuario) ON DELETE RESTRICT,
  CONSTRAINT ck_comunicado_assunto CHECK (char_length(trim(assunto)) > 0),
  CONSTRAINT ck_comunicado_texto CHECK (char_length(trim(texto)) > 0)
);
COMMENT ON TABLE comunicado IS 'Aviso enviado por um usuário a vários destinatários (''remete'').';

CREATE TABLE destinatario_comunicado (
  id_comunicado integer NOT NULL,
  id_usuario integer NOT NULL,
  lido boolean NOT NULL DEFAULT false,
  arquivado boolean NOT NULL DEFAULT false,
  CONSTRAINT pk_destinatario_comunicado PRIMARY KEY (id_comunicado, id_usuario),
  CONSTRAINT fk_destinatario_comunicado_id_comunicado FOREIGN KEY (id_comunicado) REFERENCES comunicado (id_comunicado) ON DELETE CASCADE,
  CONSTRAINT fk_destinatario_comunicado_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE
);
COMMENT ON TABLE destinatario_comunicado IS 'Quem recebeu o comunicado e o que fez com ele (relacionamento N:N ''recebe'').';

CREATE TABLE notificacao (
  id_notificacao bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_usuario integer NOT NULL,
  tipo varchar(12) NOT NULL,
  texto varchar(255) NOT NULL,
  data_hora timestamptz NOT NULL DEFAULT now(),
  lida boolean NOT NULL DEFAULT false,
  referencia_tipo varchar(12),
  referencia_id integer,
  CONSTRAINT pk_notificacao PRIMARY KEY (id_notificacao),
  CONSTRAINT fk_notificacao_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE,
  CONSTRAINT ck_notificacao_tipo CHECK (tipo IN ('resposta', 'mensagem', 'nota', 'evento', 'aulão', 'enquete', 'comunicado', 'conteúdo')),
  CONSTRAINT ck_notificacao_texto CHECK (char_length(trim(texto)) > 0),
  CONSTRAINT ck_notificacao_referencia_tipo CHECK (referencia_tipo IN ('dúvida', 'conversa', 'evento', 'conteúdo', 'enquete', 'comunicado', 'atividade')),
  CONSTRAINT ck_notificacao_regra1 CHECK ((referencia_tipo IS NULL) = (referencia_id IS NULL))
);
COMMENT ON TABLE notificacao IS 'Aviso para um usuário (''notifica''), com referência ao item que o gerou.';

-- ======================================================================
-- 8. Avaliações do Hub
-- ======================================================================
CREATE TABLE avaliacao_hub (
  id_avaliacao integer GENERATED ALWAYS AS IDENTITY NOT NULL,
  id_usuario integer NOT NULL,
  nota smallint NOT NULL,
  categoria varchar(12) NOT NULL DEFAULT 'geral',
  comentario varchar(1000),
  data date NOT NULL DEFAULT CURRENT_DATE,
  CONSTRAINT pk_avaliacao_hub PRIMARY KEY (id_avaliacao),
  CONSTRAINT fk_avaliacao_hub_id_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario) ON DELETE CASCADE,
  CONSTRAINT ck_avaliacao_hub_nota CHECK (nota BETWEEN 1 AND 5),
  CONSTRAINT ck_avaliacao_hub_categoria CHECK (categoria IN ('geral', 'calendário', 'chat', 'matérias', 'conteúdos', 'dúvidas', 'notificações'))
);
COMMENT ON TABLE avaliacao_hub IS 'Avaliação da plataforma feita por um usuário (''avalia'').';

-- Índices nas chaves estrangeiras que não são início de uma PK/UNIQUE
CREATE INDEX ix_turma_usuario_id_usuario ON turma_usuario (id_usuario);
CREATE INDEX ix_historico_cargo_id_turma ON historico_cargo (id_turma);
CREATE INDEX ix_historico_cargo_id_usuario ON historico_cargo (id_usuario);
CREATE INDEX ix_historico_cargo_id_alterado_por ON historico_cargo (id_alterado_por);
CREATE INDEX ix_horario_atendimento_id_turma ON horario_atendimento (id_turma);
CREATE INDEX ix_horario_atendimento_id_monitor ON horario_atendimento (id_monitor);
CREATE INDEX ix_atividade_avaliativa_id_turma ON atividade_avaliativa (id_turma);
CREATE INDEX ix_nota_id_usuario ON nota (id_usuario);
CREATE INDEX ix_evento_id_turma ON evento (id_turma);
CREATE INDEX ix_entrega_id_usuario ON entrega (id_usuario);
CREATE INDEX ix_usuario_tema_id_tema ON usuario_tema (id_tema);
CREATE INDEX ix_conteudo_id_materia ON conteudo (id_materia);
CREATE INDEX ix_conteudo_id_tema ON conteudo (id_tema);
CREATE INDEX ix_conteudo_id_autor ON conteudo (id_autor);
CREATE INDEX ix_conteudo_id_revisor ON conteudo (id_revisor);
CREATE INDEX ix_usuario_conteudo_id_conteudo ON usuario_conteudo (id_conteudo);
CREATE INDEX ix_acesso_conteudo_id_usuario ON acesso_conteudo (id_usuario);
CREATE INDEX ix_acesso_conteudo_id_conteudo ON acesso_conteudo (id_conteudo);
CREATE INDEX ix_comentario_id_conteudo ON comentario (id_conteudo);
CREATE INDEX ix_comentario_id_usuario ON comentario (id_usuario);
CREATE INDEX ix_duvida_id_autor ON duvida (id_autor);
CREATE INDEX ix_duvida_id_turma ON duvida (id_turma);
CREATE INDEX ix_duvida_id_tema ON duvida (id_tema);
CREATE INDEX ix_resposta_id_duvida ON resposta (id_duvida);
CREATE INDEX ix_resposta_id_autor ON resposta (id_autor);
CREATE INDEX ix_duvida_util_id_usuario ON duvida_util (id_usuario);
CREATE INDEX ix_enquete_id_turma ON enquete (id_turma);
CREATE INDEX ix_enquete_id_criador ON enquete (id_criador);
CREATE INDEX ix_opcao_enquete_id_tema ON opcao_enquete (id_tema);
CREATE INDEX ix_voto_id_opcao ON voto (id_opcao);
CREATE INDEX ix_conversa_id_turma ON conversa (id_turma);
CREATE INDEX ix_participante_conversa_id_usuario ON participante_conversa (id_usuario);
CREATE INDEX ix_mensagem_id_conversa ON mensagem (id_conversa);
CREATE INDEX ix_mensagem_id_remetente ON mensagem (id_remetente);
CREATE INDEX ix_comunicado_id_remetente ON comunicado (id_remetente);
CREATE INDEX ix_destinatario_comunicado_id_usuario ON destinatario_comunicado (id_usuario);
CREATE INDEX ix_notificacao_id_usuario ON notificacao (id_usuario);
CREATE INDEX ix_avaliacao_hub_id_usuario ON avaliacao_hub (id_usuario);
