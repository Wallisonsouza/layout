import { Project } from "./Project";
import { Runtime } from "./Runtime";
import { WindowEntity } from "./Window";

const container = document.getElementById("desktop")!;

function main() {
  const project = new Project();

  project.layouts.add({
    id: "quadrants",
    name: "4 Quadrantes",
    slots: [
      { id: "tl", rect: { x: 0, y: 0, width: 0.5, height: 0.5 } },
      { id: "tr", rect: { x: 0.5, y: 0, width: 0.5, height: 0.5 } },
      { id: "bl", rect: { x: 0, y: 0.5, width: 0.5, height: 0.5 } },
      { id: "br", rect: { x: 0.5, y: 0.5, width: 0.5, height: 0.5 } },
    ]
  });

  project.layouts.add({
    id: "unreal-editor",
    name: "Unreal Editor",
    slots: [
      { id: "outliner", rect: { x: 0, y: 0, width: 0.18, height: 0.6 } },
      { id: "details", rect: { x: 0, y: 0.6, width: 0.18, height: 0.4 } },

      { id: "viewport", rect: { x: 0.18, y: 0, width: 0.62, height: 0.7 } },
      { id: "content", rect: { x: 0.18, y: 0.7, width: 0.62, height: 0.3 } },

      { id: "blueprint", rect: { x: 0.8, y: 0, width: 0.2, height: 1 } }
    ]
  });

  project.layouts.add({
    id: "vscode-pro",
    name: "VS Code Pro",
    slots: [
      { id: "explorer", rect: { x: 0, y: 0, width: 0.18, height: 1 } },

      { id: "editor", rect: { x: 0.18, y: 0, width: 0.62, height: 0.7 } },
      { id: "terminal", rect: { x: 0.18, y: 0.7, width: 0.62, height: 0.3 } },

      { id: "outline", rect: { x: 0.8, y: 0, width: 0.2, height: 1 } }
    ]
  });

  project.layouts.add({
    id: "game-dev-full",
    name: "Game Dev Full",
    slots: [
      { id: "assets", rect: { x: 0, y: 0, width: 0.2, height: 1 } },

      { id: "editor", rect: { x: 0.2, y: 0, width: 0.4, height: 0.6 } },
      { id: "preview", rect: { x: 0.6, y: 0, width: 0.4, height: 0.6 } },

      { id: "console", rect: { x: 0.2, y: 0.6, width: 0.8, height: 0.4 } }
    ]
  });



  project.layouts.add({
    id: "unity-classic",
    name: "Unity Classic",
    slots: [
      { id: "hierarchy", rect: { x: 0, y: 0, width: 0.18, height: 0.6 } },
      { id: "project", rect: { x: 0, y: 0.6, width: 0.18, height: 0.4 } },

      { id: "scene", rect: { x: 0.18, y: 0, width: 0.52, height: 0.6 } },
      { id: "game", rect: { x: 0.18, y: 0.6, width: 0.52, height: 0.4 } },

      { id: "inspector", rect: { x: 0.7, y: 0, width: 0.3, height: 1 } }
    ]
  });


  project.layouts.add({
    id: "master",
    name: "Master + Sidebar",
    slots: [
      { id: "main", rect: { x: 0, y: 0, width: 0.7, height: 1 } },
      { id: "side", rect: { x: 0.7, y: 0, width: 0.3, height: 1 } },
    ]
  });

  project.layouts.add({
    id: "columns",
    name: "3 Colunas",
    slots: [
      { id: "c1", rect: { x: 0, y: 0, width: 0.333, height: 1 } },
      { id: "c2", rect: { x: 0.333, y: 0, width: 0.333, height: 1 } },
      { id: "c3", rect: { x: 0.666, y: 0, width: 0.334, height: 1 } },
    ]
  });
  
  project.windows.add(
    new WindowEntity("Janela A", { x: 0, y: 0, width: 200, height: 200 },)
  );

  project.windows.add(
    new WindowEntity("Janela B", { x: 0, y: 0, width: 200, height: 200 })
  );

  project.windows.add(
    new WindowEntity("Janela C", { x: 0, y: 0, width: 200, height: 200 })
  );

  project.windows.add(
    new WindowEntity("Janela D", { x: 0, y: 0, width: 200, height: 200 })
  );

  const runtime = new Runtime(project, container);

  runtime.applyLayout("quadrants");
  runtime.start();





  createLayoutButtons(project, runtime);
  window.addEventListener("resize", () => { runtime.applyLayout("quadrants") })
}

window.onload = main;

function createLayoutButtons(project: Project, runtime: Runtime) {
  const bar = document.createElement("div");
  bar.className = "layout-bar";

  const buttons: HTMLButtonElement[] = [];

  for (const layout of project.layouts.get_iterator()) {
    const btn = document.createElement("button");
    btn.textContent = layout.name;

    btn.onclick = () => {
      runtime.applyLayout(layout.id);

      // ✅ estado visual ativo
      for (const b of buttons) b.classList.remove("active");
      btn.classList.add("active");
    };

    buttons.push(btn);
    bar.appendChild(btn);
  }

  // ✅ marca o primeiro como ativo
  if (buttons[0]) buttons[0].classList.add("active");

  document.body.appendChild(bar);
}
