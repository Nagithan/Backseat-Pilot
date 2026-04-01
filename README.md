# Backseat Pilot 🚀

**Babysit your AI-IDE with help from web-based LLMs.**

**Backseat Pilot** is a VS Code / Google Antigravity extension designed to **easily generate structured prompts** with code context and instructions. 
No more copy-pasting dozens of files manually. 
Select, configure, and send.

---

## ✨ Features

### 👶 Babysit your AI-IDE with help from web-based LLMs.
- **Quota reached ? Tired of paying for API usage ?** Use a web-based LLM to babysit your cheap AI-IDE model.
- **Use the model you want** : Gemini Pro, GPT, Claude, etc.

### 📋 Generate customizable structured prompts 
- **Preprompt** : eg: "you are a senior developer..."
- **Instruction** : eg: "Audit the code for bugs..."
- **File context** : select files from the explorer to add them to the prompt.
- **Final instruction** : eg: "answer in a prompt format, ready to be pasted into an AI assistant IDE"

### 🧠 Prompt Templates
Get the best results from LLMs with expert-curated templates:
- **Bug audit**: Audit your code for bugs.
- **Bug follow up**: Is the bug resolved ? Any regression ?
- **Create tests**: Create tests for your code.
 Or create your own instructions ! You can save them for easy later use.

### ⚡ Explorer
- Navigate your project with a searchable tree view. 
- Select files to copy to the clipboard.

### 📊 Real-time Token Metrics
- Token counting with color-coding helps you stay within your model's context limits.

---

## 🔧 How to install

### Installation from .vsix file
1. Download the latest .vsix file from the [releases](https://github.com/Nagithan/Backseat-Pilot/releases) page.
2. Open VS Code (or Google Antigravity).
3. Navigate to the extensions panel.
4. Click on the "..." button in the top-right corner of the Extensions panel.
5. Select "Install from VSIX..." from the dropdown menu.
6. Navigate to the downloaded .vsix file and select it.
7. Click "Install".

### (hard mode) Installation from source code
1. Clone the repository / Download the source code and open the folder in VS Code (or Google Antigravity).
2. Open the terminal tab.
3. Run `npm install -g @vscode/vsce` to install vsce (if not already installed).
4. Run `vsce package` to create a .vsix file.
5. Follow the installation steps above to install the .vsix file.

## 🚀 How to use Backseat Pilot

1. **Install Backseat Pilot** (see above).
2. **Open the Backseat Pilot tab** by clicking on the rocket icon in the Activity Bar (the left sidebar).
3. **Choose a template** (e.g., "Bug audit") or write your own instructions.
4. **Select files** you want to add to the prompt.
5. **Click Copy and paste** 
6. Go to your web version of your favorite LLM and paste the prompt !
7. With the default `Final instructions`, the web based LLM will generate a prompt ready to be pasted into an AI assistant IDE (Antigravity, Copilot, etc).

---

## 🛡️ Privacy & Performance

- **Local Only**: Everything happens locally on your machine.
- **Read Only**: The extension does not modify your files.
- **No Telemetry**: It does not collect any data.
- **Efficient**: Optimized for large projects and complex file structures.
- **No Dependencies**: It does not require any external dependencies.

Exclude files from the Backseat Pilot explorer via `settings.json`:

| Setting | Type | Default | Description |
|:---|:---|:---|:---|
| `backseat-pilot.excludePatterns` | `array` | `[...]` | Glob patterns to exclude (e.g., `**/node_modules/**`, `**/.git/**`). |


---

If you find this tool useful, please leave a ⭐ on GitHub!