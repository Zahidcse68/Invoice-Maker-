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

### 4. Create a Standalone Desktop Executable
If you want to package this app into a double-clickable Windows `.exe`, Mac `.app`, or Linux `.AppImage`, we have integrated `electron-builder` to handle this automatically:

1. Make sure your dependencies are installed (`npm install`).
2. Run the build command:
   ```bash
   npm run build:desktop
   ```
3. Once the build finishes, look inside the newly created `release` folder in your project directory. 
4. You will find your standalone setup executable there! You can share this file or install it on your computer.
