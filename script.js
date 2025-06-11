const music = document.getElementById("bg-music");
const toggleBtn = document.getElementById("music-toggle");
const terminalOutput = document.getElementById("terminal-output");
const commandInput = document.getElementById("command-input");

let commandHistory = [];
let historyIndex = 0;
let currentDir = "/";

const fileSystem = {
  "/": ["profile.jpg", "music.mp3", "index.html", "secrets/"],
  "/secrets": ["notes.txt"]
};

const fileContents = {
  "/secrets/notes.txt": "Beware what you seek in the dark.\nEverything left buried doesn't want to be found."
};

window.addEventListener("load", () => {
  music.volume = 0.5;
  if (localStorage.getItem("loggedIn") === "true") {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("enter-screen").classList.remove("hidden");
  }
});

toggleBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    toggleBtn.textContent = "PAUSE";
    printLine("Music playing");
  } else {
    music.pause();
    toggleBtn.textContent = "MUSIC";
    printLine("Music paused");
  }
});

commandInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const command = this.value.trim();
    commandHistory.push(command);
    historyIndex = commandHistory.length;
    processCommand(command);
    this.value = "";
  } else if (e.key === "ArrowUp") {
    if (historyIndex > 0) {
      historyIndex--;
      this.value = commandHistory[historyIndex];
    }
  } else if (e.key === "ArrowDown") {
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      this.value = commandHistory[historyIndex];
    } else {
      this.value = "";
    }
  }
});

function printLine(text) {
  terminalOutput.textContent += `${text}\n`;
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function processCommand(cmd) {
  const prompt = `user@grave:${currentDir}$`;
  let output = `${prompt} ${cmd}\n`;
  const args = cmd.trim().split(" ");
  const base = args[0].toLowerCase();

  switch (base) {
    case "help":
      output += "Available commands: help, whoami, ls, clear, music, exit, pwd, cd, cat, ascii, lat, grave, telegram, discord, doxbin, logout, sudo rm -rf /";
      break;
    case "whoami":
      output += "grave";
      break;
    case "ls":
      output += fileSystem[currentDir]?.join("  ") || "";
      break;
    case "pwd":
      output += currentDir;
      break;
    case "cd":
      const target = args[1];
      if (!target) {
        output += "Usage: cd <directory>";
        break;
      }
      if (target === "..") {
        currentDir = "/";
      } else {
        const newPath = currentDir === "/" ? `/${target.replace(/\/$/, "")}` : `${currentDir}/${target}`;
        if (fileSystem[newPath]) {
          currentDir = newPath;
        } else {
          output += `No such directory: ${target}`;
        }
      }
      break;
    case "cat":
      const file = args[1];
      if (!file) {
        output += "Usage: cat <file>";
        break;
      }
      const fullPath = currentDir === "/" ? `/${file}` : `${currentDir}/${file}`;
      output += fileContents[fullPath] || `No such file: ${file}`;
      break;
    case "music":
      if (music.paused) {
        music.play();
        output += "Music playing";
        toggleBtn.textContent = "PAUSE";
      } else {
        music.pause();
        output += "Music paused";
        toggleBtn.textContent = "MUSIC";
      }
      break;
    case "clear":
      terminalOutput.textContent = "";
      return;
    case "exit":
      output += "Exiting...\n[Session terminated]";
      setTimeout(() => location.reload(), 1000);
      break;
    case "logout":
      output += "[+] Session cleared.\n[+] Logging out...";
      localStorage.removeItem("loggedIn");
      setTimeout(() => location.reload(), 1500);
      break;
    case "telegram":
      window.open("https://t.me/expule", "_blank");
      output += "Opening Telegram...";
      break;
    case "discord":
      window.open("https://discord.com/users/expule", "_blank");
      output += "Opening Discord...";
      break;
    case "doxbin":
      window.open("https://doxbin.com/user/lucent", "_blank");
      output += "Opening Doxbin...";
      break;
    case "ascii":
      output += "𝖌𝖗𝖆𝖛𝖊.𝖑𝖆𝖙";
      break;
    case "lat":
      output += "  _      _____ _____ \n | |    |_   _|_   _|\n | |     | |   | |  \n | |___  | |   | |  \n |_____| |_|   |_|   (lost after thought)";
      break;
    case "grave":
      output += "   ____ ____      _    __     __ ______ \n  / ___|  _ \\\\    / \\\\   \\\\ \\\\   / /|  _ \\\\ \\\n | |  _| | | |  / _ \\\\   \\\\ \\\\ / / | | | | |\n | |_| | |_| | / ___ \\\\   \\\\ V /  | |_| | |\n  \\\\____|____/ /_/   \\\\_\\\\   \\\\_/   |____/|_|";
      break;
    case "sudo":
      if (args[1] === "rm" && args[2] === "-rf" && args[3] === "/") {
        document.querySelector(".terminal").classList.add("red-alert");
        let count = 0;
        const wipe = setInterval(() => {
          terminalOutput.textContent += `deleting /dev/null${count++}...\n`;
          terminalOutput.scrollTop = terminalOutput.scrollHeight;
          if (count > 10) {
            clearInterval(wipe);
            terminalOutput.textContent += "SYSTEM FAILURE. Goodbye.\n";
            commandInput.disabled = true;
          }
        }, 200);
        return;
      }
    default:
      output += `Command not found: ${cmd}`;
  }

  terminalOutput.textContent += output + "\n";
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// 🔒 Anti-inspect protection
window.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  alert("Right-click is disabled.");
});

window.addEventListener("keydown", function (e) {
  if (
    e.key === "F12" ||
    (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
    (e.ctrlKey && e.key.toUpperCase() === "U")
  ) {
    e.preventDefault();
    alert("DevTools are disabled.");
  }
// Autoplay background music on login
window.addEventListener("load", () => {
  const audio = new Audio("ty-i-ia.mp3");
  audio.loop = true;
  audio.volume = 0.6;

  // Try to autoplay immediately
  audio.play().catch(() => {
    // Wait for user interaction if autoplay fails
    document.body.addEventListener("click", () => audio.play(), { once: true });
  });
});
});
