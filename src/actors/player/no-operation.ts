import { Actor } from 'excalibur';
import { UITool, UIToolManager } from '../../interface/ui-tool';
export class NoOperation extends Actor implements UITool{
  initUITool(uiManager: UIToolManager): boolean {
    return true;
  }
  getName(): string {
    return this.name;
  }
  activeUITool(): boolean {
          return true;
  }
  deactivateUITool(): void {
  }
  constructor() {
    super({
      name:"noop",
    });
  }
}
