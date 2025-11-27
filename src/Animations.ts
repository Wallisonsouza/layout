
// import { Mathf } from "./Mathf";
// import type { WindowEntity } from "./Window";

// export class Animations {

//   public static animateWindow(window: WindowEntity, speed: number) {
//     if (!window.animTarget) return;

//     window.rect.x = Mathf.lerp(window.rect.x, window.animTarget.x, speed);
//     window.rect.y = Mathf.lerp(window.rect.y, window.animTarget.y, speed);
//     window.rect.width = Mathf.lerp(window.rect.width, window.animTarget.width, speed);
//     window.rect.height = Mathf.lerp(window.rect.height, window.animTarget.height, speed);

//     if (
//       Math.abs(window.rect.x - window.animTarget.x) < 0.5 &&
//       Math.abs(window.rect.y - window.animTarget.y) < 0.5 &&
//       Math.abs(window.rect.width - window.animTarget.width) < 0.5 &&
//       Math.abs(window.rect.height - window.animTarget.height) < 0.5
//     ) {
//       window.rect = { ...window.animTarget };
//       window.animTarget = undefined;
//     }
//   }
// }