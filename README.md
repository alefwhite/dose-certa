# 💊 Dose Certa - Calculadora de Dosagem de Medicamentos

**Dose Certa** é uma aplicação web moderna e responsiva desenvolvida em HTML, CSS e JavaScript vanilla, projetada para auxiliar pacientes no cálculo preciso da quantidade de comprimidos necessária para um tratamento médico. Com um design minimalista baseado em princípios de *glassmorphism* e acessibilidade, a aplicação calcula desde a dose exata (em frações) até o número de embalagens inteiras necessárias para completar o ciclo de tratamento.

---

## ✨ Principais Funcionalidades

- **Cálculo Preciso de Dosagem**
  - Insira a fração do comprimido (1, 3/4, 1/2, 1/4)
  - Defina a frequência de ingestão (ex: 3 vezes ao dia)
  - Informe a duração do tratamento (ex: 10 dias)

- **Cálculo Automático de Embalagens**
  - Calcula automaticamente a quantidade exata de comprimidos necessários
  - Arredonda para cima, mostrando quantos comprimidos inteiros comprar

- **Interface Intuitiva (Glassmorphism)**
  - Design limpo com fundo gradiente decorativo
  - Card central em vidro com efeito *blur*
  - Paleta de cores frias (azul e verde menta)

- **Compatibilidade Total**
  - Design 100% responsivo para celular, tablet e desktop
  - Otimizado para toque (mobile) e clique (desktop)
  - Modo de impressão profissional para prescrições

- **Acessibilidade (A11y)**
  - ARIA labels em todos os elementos interativos
  - Foco visual claro em botões e campos
  - Rádio buttons para seleção de fração
  - Suporte a leitores de tela

- **Opcional: Identificação do Tratamento**
  - Campos opcionais para nome do paciente e medicamento
  - Exibidos apenas se preenchidos
  - Incluídos automaticamente no resumo de impressão

---

## 🎨 Design System

### Paleta de Cores

| Cor | Uso | Hex Code |
|-----|-----|----------|
| **Primary** | Botões, links, foco | `#0ea5e9` (Sky Blue) |
| **Secondary** | Destaques, ícones | `#10b981` (Emerald Green) |
| **Accent** | Input ativa | `#6366f1` (Indigo) |
| **Background Gradient** | Fundo decorativo | `#f0f9ff` → `#ecfdf5` |
| **Glass Card** | Card principal | `rgba(255, 255, 255, 0.7)` |
| **Text Main** | Textos principais | `#1e293b` |
| **Text Muted** | Textos secundários | `#64748b` |

### Tipografia

- **Títulos**: 'Outfit' - 700-800 (moderno e impactante)
- **Corpo**: 'Inter' - 400-600 (legível e limpo)

### Dimensões e Espaçamento

- **Card Radius**: `24px`
- **Spacing**: Base de `8px` (1rem)
- **Transition**: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` (suave)

---

## 🛠️ Arquitetura do Código

### Estrutura de Arquivos

```


dose-certa/
├── index.html              # Estrutura HTML semântica
├── style.css               # Estilos CSS (inclui design system)
└── script.js               # Lógica JavaScriptVanilla

```

### Componentes do HTML

1. **Background Decorations**: Blobs decorativos com animação de flutuação.
2. **Header**: Logo SVG animado, título e subtítulo.
3. **Calculator Card**: Contêiner principal com design glassmorphism.
   - **Fraction Picker**: Botões interativos com visualização SVG de frações.
   - **Input Controls**: Stepper buttons e campos de texto.
   - **Optional Details**: Seção colapsável para informações opcionais.
4. **Results Panel**: Exibição dos resultados calculados.
   - **Print Only Summary**: Seção oculta na UI mas visível na impressão.
   - **Print Buttons**: Exportação PDF (nativo) e compartilhamento.

---

## 🔌 Lógica de Execução

### Seleção de Fração
Os botões de fração utilizam um *custom radio group* que:
1. Atualiza a variável `selectedFraction` no JavaScript
2. Altera estilos CSS para indicar seleção
3. Atualiza o visual dos SVGs para mostrar a fração correta

### Cálculo Automático
Ao clicar em **Calcular**: 
1. Obtém valores dos inputs
2. Calcula dose exata: `doseExata = (selectedFraction * frequencia * duracao) / 1`
3. Calcula compra: `totalRounded = ceil(doseExata)`
4. Exibe resultados no painel

### Impressão Responsiva
O arquivo `style.css` contém media queries para:
- Ocultar elementos não essenciais na impressão (background, botões de ação)
- Exibir summary textual com nome do paciente/medicamento
- Converter inputs para texto estático

### Export PDF Nativo
Ao clicar em **Salvar/Exportar**:
- O app não gera PDF via biblioteca
- Usa **Window Print API** para abrir o diálogo nativo do navegador
- É totalmente compatível com todas as versões modernas de navegadores

---

## ⚡ Como Usar

1. Clone o repositório
2. Abra o arquivo `index.html` em qualquer navegador web moderno
3. Preencha as informações necessárias
4. Clique em **Calcular**
5. Visualize os resultados e opção de exportar

### Exemplo de Uso

**Paciente**: Maria Silva
**Medicamento**: Losartana
**Fração**: Metade (1/2)
**Frequência**: 2 vezes ao dia
**Duração**: 15 dias

**Resultado**:
- Dose exata: 15 comprimidos
- Para comprar: 15 comprimidos inteiros

---

## 📱 Otimização Mobile

- **Touch-Friendly**: Botões grandes (`> 44px` touch target)
- **Spacing**: Margens generosas para evitar toques acidentais
- **Grid Responsivo**: 2 colunas no desktop, 1 coluna no mobile
- **Visual Feedback**: Animações suaves e estados `:active` claros

## 💻 Otimização Desktop

- **Grid Expandido**: 2 colunas para seleção de fração
- **Layout**: Card central alinhado horizontalmente
- **Tipografia**: Títulos maiores para impacto
- **Micro-interações**: Hover states detalhados

## 🎯 Acessibilidade (A11y)

- **Controle de Foco**: Sempre visível e claro
- **Semântica HTML5**: Uso de `<section>`, `<header>`, `<main>`
- **ARIA Attributes**: `role="radiogroup"`, `aria-checked`, `aria-expanded`
- **Visuais**: Alto contraste de texto e estados ativos
- **Print**: `@media print` para documentos acessíveis

---

## 🧪 Testes Recomendados

### Testes Funcionais
- [ ] Selecionar cada fração e calcular
- [ ] Preencher e limpar campos opcionais
- [ ] Testar com valores extremos (ex: 100 dias)
- [ ] Verificar cálculo decimal (ex: 0.75 × 2 × 5)

### Testes de Responsividade
- [ ] Visualizar em celular (1080×1920)
- [ ] Visualizar em tablet (1024×768)
- [ ] Visualizar em desktop (1920×1080)
- [ ] Redimensionar janela do navegador

### Testes de Acessibilidade
- [ ] Navegar com teclado (Tab, Enter, Space)
- [ ] Usar leitor de tela (VoiceOver, NVDA)
- [ ] Verificar contraste de cores
- [ ] Testar com zoom do navegador