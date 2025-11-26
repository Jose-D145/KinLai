from django.db import models
from django.utils import timezone

# ----------------------------------------------------------------------
# 1. Tabelas Base (Escola, Faixa)
# ----------------------------------------------------------------------

# --- NOVO MODELO ABSTRATO ---
class AuditModel(models.Model):
    """
    Modelo abstrato para adicionar campos de auditoria e Soft Delete.
    """
    data_inclusao = models.DateTimeField(default=timezone.now, editable=False)
    data_desativacao = models.DateTimeField(null=True, blank=True, verbose_name="Data de Desativação")
    
    class Meta:
        abstract = True # Esta linha diz ao Django para não criar uma tabela para este modelo.
        
    @property
    def is_active(self):
        """ Retorna True se o registro não tiver data de desativação. """
        return self.data_desativacao is None
    
class Escola(AuditModel):
    # ID é automático (Django default)
    nome = models.CharField(max_length=255)
    endereco = models.TextField(verbose_name="Endereço")
    telefone = models.CharField(max_length=20)
    email = models.EmailField()
    data_fundacao = models.DateField(verbose_name="Data Fundação")

    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name = "Escola"
        verbose_name_plural = "Escolas"

class Faixa(AuditModel):
    escola = models.ForeignKey(Escola, on_delete=models.CASCADE)
    cor = models.CharField(max_length=50)
    grau = models.CharField(max_length=50)
    tempo_medio_graduacao = models.IntegerField(help_text="Tempo em dias que o aluno deve permanecer nesta faixa.")

# NOVO CAMPO DE ELEGIBILIDADE PARA INSTRUTOR
    elegivel_instrutor = models.BooleanField(
        default=False, 
        verbose_name="Elegível para Instrutor",
        help_text="Define se alunos nesta faixa podem ser promovidos a instrutor."
    )
    
    def __str__(self):
        return f"{self.cor} - {self.grau} ({self.escola.nome})"
    
    class Meta:
        verbose_name = "Faixa/Graduação"
        verbose_name_plural = "Faixas/Graduações"

# ----------------------------------------------------------------------
# 2. Tabelas de Cadastro de Pessoas (Diretoria, Aluno, Instrutor)
# ----------------------------------------------------------------------

class Diretoria(AuditModel):
    escola = models.ForeignKey(Escola, on_delete=models.CASCADE)
    nome = models.CharField(max_length=255)
    cargo = models.CharField(max_length=100)
    endereco = models.TextField()
    telefone = models.CharField(max_length=20)
    email = models.EmailField()

    def __str__(self):
        return f"{self.nome} ({self.cargo})"
    
    class Meta:
        verbose_name = "Membro da Diretoria"
        verbose_name_plural = "Diretoria"

class Aluno(AuditModel):
    escola = models.ForeignKey(Escola, on_delete=models.CASCADE)
    faixa_atual = models.ForeignKey(Faixa, on_delete=models.SET_NULL, null=True, blank=True, related_name='alunos_na_faixa')
    nome = models.CharField(max_length=255)
    data_inicio = models.DateField()
    tipo = models.CharField(max_length=50, help_text="Tipo de Mensalidade/Inscrição") 
    situacao_financeira = models.CharField(max_length=50) 
    
    # Campo 'id Faixa' do diagrama mapeado para 'faixa_atual'
    
    def __str__(self):
        return self.nome
    
    class Meta:
        verbose_name = "Aluno"
        verbose_name_plural = "Alunos"


class Instrutor(AuditModel):
    # O instrutor é um Aluno promovido
    aluno = models.OneToOneField(Aluno, on_delete=models.CASCADE, primary_key=True) 
    escola = models.ForeignKey(Escola, on_delete=models.CASCADE)
    diretoria = models.ForeignKey(Diretoria, on_delete=models.SET_NULL, null=True, blank=True)
    # ID_Aluno do diagrama mapeado para OneToOneField
    
    def __str__(self):
        return f"Instrutor: {self.aluno.nome}"
    
    class Meta:
        verbose_name = "Instrutor"
        verbose_name_plural = "Instrutores"

# ----------------------------------------------------------------------
# 3. Tabelas de Processos e Logística
# ----------------------------------------------------------------------

class Programa(AuditModel):
    escola = models.ForeignKey(Escola, on_delete=models.CASCADE)
    faixa_alvo = models.ForeignKey(Faixa, on_delete=models.SET_NULL, null=True, blank=True, help_text="Faixa requerida para o programa")
    atividade = models.CharField(max_length=255)
    tempo_medio_aprendizado = models.CharField(max_length=100)

    def __str__(self):
        return self.atividade
    
    class Meta:
        verbose_name = "Programa de Treinamento"
        verbose_name_plural = "Programas de Treinamento"

class Equipamento(AuditModel):
    descricao = models.CharField(max_length=255)
    faixa_necessaria = models.ForeignKey(Faixa, on_delete=models.SET_NULL, null=True, blank=True)
    # Mantido o nome 'Kati' conforme o diagrama, mas pode ser Quantidade
    kati = models.CharField(max_length=100, help_text="Kati, Kata ou Quantidade necessária.") 

    def __str__(self):
        return self.descricao
    
    class Meta:
        verbose_name = "Equipamento"
        verbose_name_plural = "Equipamentos"

# ----------------------------------------------------------------------
# 4. Tabelas de Eventos (Calendário, Aulas, Graduação)
# ----------------------------------------------------------------------

class CalendarioAula(AuditModel):
    faixa_alvo = models.ForeignKey(Faixa, on_delete=models.CASCADE, help_text="Nível/Faixa dos alunos esperados nesta aula")
    data_aula = models.DateTimeField()
    vagas = models.IntegerField(default=1)

    def __str__(self):
        return f"Aula de Faixa {self.faixa_alvo.cor} em {self.data_aula.strftime('%d/%m %H:%M')}"
    
    class Meta:
        verbose_name = "Calendário de Aula"
        verbose_name_plural = "Calendário de Aulas"

class Aula(AuditModel):
    # ID_EquipeTécnica mapeado para Instrutor
    instrutor = models.ForeignKey(Instrutor, on_delete=models.SET_NULL, null=True, blank=True)
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE)
    programa = models.ForeignKey(Programa, on_delete=models.SET_NULL, null=True, blank=True)
    calendario = models.ForeignKey(CalendarioAula, on_delete=models.CASCADE)
    
    # Campo para registrar a presença
    presenca = models.BooleanField(default=False) 

    def __str__(self):
        return f"Presença de {self.aluno.nome} na aula {self.calendario.id}"
    
    class Meta:
        verbose_name = "Registro de Aula"
        verbose_name_plural = "Registros de Aulas"

class Graduacao(AuditModel):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE)
    faixa_nova = models.ForeignKey(Faixa, on_delete=models.CASCADE, related_name='graduacoes_concedidas')
    data_graduacao = models.DateField(default=timezone.now)
    aprovado = models.BooleanField(default=False)
    motivo = models.TextField(blank=True, null=True, help_text="Feedback ou motivo da reprovação/aprovação")

    def __str__(self):
        status = "APROVADO" if self.aprovado else "REPROVADO"
        return f"Graduação de {self.aluno.nome} para {self.faixa_nova.cor} ({status})"
    
    class Meta:
        verbose_name = "Graduação"
        verbose_name_plural = "Histórico de Graduações"

class OcorrenciaAula(AuditModel): # Herda as datas de inclusão/desativação
    # Foreign Key para a sessão de aula específica (Attendance)
    aula = models.ForeignKey('Aula', on_delete=models.CASCADE, 
                             related_name='ocorrencias_detalhes')
    
    # O instrutor que registrou a ocorrência (FK)
    instrutor = models.ForeignKey('Instrutor', on_delete=models.SET_NULL, null=True, blank=True)
    
    # Campos de Avaliação
    APROVEITAMENTO_CHOICES = [(i, i) for i in range(1, 6)]

    compareceu = models.BooleanField(default=False, verbose_name="Compareceu à Aula")
    
    aproveitamento = models.IntegerField(
        choices=APROVEITAMENTO_CHOICES,
        default=3, 
        verbose_name="Aproveitamento (1-5)"
    )
    comportamento = models.CharField(max_length=50, 
                                     default="Normal", 
                                     verbose_name="Comportamento")
    
    observacoes = models.TextField(blank=True, null=True, verbose_name="Observações Adicionais")
    
    class Meta:
        verbose_name = "Ocorrência da Aula"
        verbose_name_plural = "Ocorrências das Aulas"

    def __str__(self):
        return f"Ocorrência Aula {self.aula.id} - Instrutor: {self.instrutor.aluno.nome if self.instrutor else 'N/A'}"
