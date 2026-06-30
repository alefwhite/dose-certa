# 💊 Dose Certa - Calculadora de Dosagem de Medicamentos

**Dose Certa** é uma aplicação web moderna e responsiva desenvolvida em HTML, CSS e JavaScript vanilla, projetada para auxiliar pacientes (e tutores de pets!) no cálculo preciso da quantidade de comprimidos necessária para um tratamento médico. Com um design minimalista baseado em princípios de *glassmorphism* e acessibilidade, a aplicação calcula desde a dose exata (em frações) até o número de embalagens inteiras necessárias para completar o ciclo de tratamento.

🔗 **Acesse a aplicação online:** [https://alefwhite.github.io/dose-certa/](https://alefwhite.github.io/dose-certa/)

---

## ✨ Principais Funcionalidades

- **Cálculo Preciso de Dosagem**
  - Selecione a fração do comprimido (Inteiro, 3/4, Metade ou 1/4) com preview dinâmico em SVG.
  - Defina a duração do tratamento (ex: 7 dias, 15 dias).

- **Esquema de Frequência Dinâmico (Novidade!)**
  - Escolha entre esquemas predefinidos: **1x ao dia (Dose Única)**, **2x ao dia (Manhã/Noite)** ou **Por intervalo (De X em X horas)**.
  - O cálculo da frequência diária é feito de forma automática ao informar o intervalo de horas (ex: de 8 em 8 horas calcula 3x ao dia).
  - Permite controle manual livre mudando o esquema dinamicamente para **Personalizado** se o usuário interagir com o stepper de frequência.

- **Sugestão de Horário de Início e Cronograma 24h (Novidade!)**
  - Defina a hora da primeira dose.
  - O sistema calcula e exibe em tempo real o cronograma estimado das tomadas nas primeiras 24 horas.
  - **Detector de Madrugada (🌙)**: Horários calculados no período noturno (das 23h às 6h) são destacados com coloração especial e ícone de lua, alertando o usuário para mudar o início caso queira evitar tomadas na madrugada.

- **Tipo de Paciente: Pessoa ou Pet (Novidade!)**
  - Permite classificar o paciente como **Humano (👤)** ou **Pet (🐾)**.
  - Atualiza automaticamente os emojis, rótulos e formatação das informações na tela, no PDF e no WhatsApp.

- **Cálculo Automático de Embalagens**
  - Calcula a quantidade exata necessária de comprimidos.
  - Exibe a quantidade arredondada para comprimidos inteiros a serem comprados para garantir a dosagem fracionada.

- **Interface Glassmorphism & Compatibilidade**
  - Design premium e minimalista.
  - Layout totalmente responsivo (mobile, tablet e desktop).
  - Compartilhamento de resumo estruturado no WhatsApp com um único clique.
  - Impressão profissional adaptada para PDF (ocultando formulários e botões desnecessários).

- **Acessibilidade (A11y)**
  - Atributos ARIA em botões e seletores interativos.
  - Navegação via teclado e compatibilidade com leitores de tela.

---

## 🎨 Design System

### Paleta de Cores

| Cor | Uso | Hex Code |
|-----|-----|----------|
| **Primary** | Botões, links, focos ativos | `#0ea5e9` (Sky Blue) |
| **Secondary** | Sucesso, status ativo normal | `#10b981` (Emerald Green) |
| **Accent** | Destaques adicionais, inputs ativos | `#6366f1` (Indigo) |
| **Warning / Night** | Alertas, doses de madrugada | `#d97706` / `#fffbeb` (Amber) |
| **Background Gradient** | Fundo dinâmico decorativo | `#f0f9ff` → `#ecfdf5` |
| **Glass Card** | Card central principal | `rgba(255, 255, 255, 0.7)` |
| **Text Main** | Textos e rótulos principais | `#1e293b` |
| **Text Muted** | Textos de ajuda secundários | `#64748b` |

### Tipografia

- **Títulos**: 'Outfit' - 500-800 (moderno e impactante)
- **Corpo**: 'Inter' - 400-600 (legível e limpo)

---

## 🛠️ Arquitetura do Código

### Estrutura de Arquivos

```
dose-certa/
├── index.html              # Estrutura HTML semântica
├── style.css               # Estilos CSS (inclui design system e print layouts)
└── script.js               # Lógica JavaScript Vanilla
```

### Componentes de Interface

1. **Background Decorations**: Blobs desfocados flutuantes que criam sensação de profundidade.
2. **Calculator Form**:
   - **Fraction Grid**: Botões interativos com SVGs ilustrativos das partes dos comprimidos.
   - **Schedule Selector**: Botões segmentados modernos para a escolha de horário do medicamento.
   - **Time Suggester**: Campo de hora de início e container de pré-visualização das tomadas calculadas.
   - **Details Accordion**: Seção expansível para informações adicionais de identificação do paciente e medicamento.
3. **Results Content**:
   - **Rounded Value**: Indicador em destaque do número de comprimidos inteiros a adquirir.
   - **24h Recommended Schedule**: Tabela visual com os horários e avisos de madrugada para conforto do paciente.
   - **Action Bar**: Atalhos para salvar em PDF (impressão profissional) ou enviar via WhatsApp.

---

## 🔌 Lógica de Execução

### Automação de Frequência
Quando o usuário seleciona as opções automáticas:
- **1x ao dia**: Frequência é definida para `1`.
- **2x ao dia**: Frequência é definida para `2`.
- **Por intervalo**: Libera o input numérico. Se o usuário informa $X$ horas, a frequência é calculada por $F = \text{Math.round}(24 / X)$, limitando a frequência final entre `1` e `24` vezes ao dia.
- Qualquer alteração manual no stepper de frequência desativa o cálculo dinâmico e muda o seletor para **Personalizado**.

### Cronograma de Tomadas
A lógica lê a hora inicial (`HH:MM`) e calcula os instantes de tomadas com base no intervalo de horas (derivado da frequência ou diretamente informado no campo de horas). As tomadas que possuem a hora pertencente à faixa das 23h às 5h são marcadas com a classe CSS `.night-dose` para alertar o usuário sobre possíveis perturbações do sono.

### Tipo de Paciente
O botão ativa a variável de estado `selectedPatientType` (`human` ou `pet`). Na rotina de formatação de string (usada no WhatsApp e na impressão):
- Se `human`: Utiliza-se a legenda *"Paciente"* e o emoji `👤`.
- Se `pet`: Utiliza-se a legenda *"Paciente (Pet)"* e o emoji `🐾`.

---

## ⚡ Como Usar

1. Clone o repositório ou baixe os arquivos.
2. Abra o arquivo `index.html` em qualquer navegador web moderno.
3. Insira as informações do tratamento.
4. Visualize os horários projetados e faça os ajustes necessários no horário de início.
5. Clique em **Calcular** para obter os totais.
6. Compartilhe o resultado ou gere o PDF de prescrição.

### Exemplo de Uso (Pet)

- **Paciente**: Rex (🐾 Pet)
- **Medicamento**: Prednisona 20mg
- **Fração**: Metade (1/2)
- **Horário de início**: 08:00
- **Esquema de frequência**: Por intervalo (De 12 em 12 horas) -> Frequência sugerida: 2 vezes ao dia
- **Duração**: 10 dias

**Resultados Gerados**:
- **Cronograma de Doses (Próximas 24h)**: `08:00`, `20:00` (Status: diurno confortável ✓)
- **Total Exato**: 10 comprimidos
- **Comprar**: 10 comprimidos inteiros
- **WhatsApp**: Envia a mensagem formatada contendo `🐾 Paciente (Pet): Rex` e os horários das tomadas.

---

## 🧪 Casos de Testes Executados

- [x] Selecionar tipo de paciente Pet, digitar o nome e conferir o ícone `🐾` no WhatsApp e PDF.
- [x] Inserir intervalo de 8 horas e conferir se calcula frequência diária igual a 3.
- [x] Iniciar tratamento de 8 em 8 horas às 08:00 e verificar se exibe `08:00`, `16:00` e `00:00` (esta última com 🌙).
- [x] Modificar o horário de início para sumir com o ícone de madrugada (ex: iniciando às 06:00, tomadas às `06:00`, `14:00`, `22:00`).
- [x] Ajustar a frequência manualmente com o botão `+` e garantir que o esquema alterne para **Personalizado** na mesma hora.
- [x] Testar a funcionalidade de limpeza do formulário para verificar se os estados padrão (Humano, 1x ao dia, 08:00) retornam com sucesso.