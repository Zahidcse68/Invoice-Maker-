# Custom Invoice Generator

This is a complete, standalone invoice generator app built with React, Tailwind CSS, and Vite. All data is processed entirely in your browser — no backend or database is required, for complete privacy.

## How to run this software locally on your computer

### 1. Prerequisites
You need to install **Node.js** on your computer. 
- Download it here: [https://nodejs.org/](https://nodejs.org/) (Choose the LTS version).

### 2. Setup
After downloading and extracting this project's ZIP file:
1. Open your terminal (Command Prompt / PowerShell on Windows, Terminal on Mac).
2. Use the `cd` command to navigate to the extracted folder:
   ```bash
   cd path/to/your/extracted/folder
   ```
3. Install the necessary project dependencies by running:
   ```bash
   npm install
   ```

### 3. Start the App
Once installation is complete, you have two options to run the app:

**Option A: Run in Web Browser**
```bash
npm run dev
```
The terminal will give you a local URL (usually `http://localhost:5173` or `http://localhost:3000`). Open that URL in your web browser.

**Option B: Run as Desktop App**
```bash
npm run dev:desktop
```
This will automatically start the background server and open a dedicated Desktop Application window for the Invoice Generator!

***

### (Optional) Create a Standalone Desktop Executable
If you want to package this web app into a double-clickable Windows `.exe` or Mac `.app`, the easiest way is using **Nativefier**:

1. While the app is running (via `npm run dev`), open a new terminal window.
2. Install Nativefier globally:
   ```bash
   npm install -g nativefier
   ```
3. Generate the desktop app:
   ```bash
   nativefier "http://localhost:3000" --name "MyInvoiceApp"
   ```
This will create a dedicated desktop application folder containing your standalone executable!
