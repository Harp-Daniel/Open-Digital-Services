import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SidebarService {
    isCollapsed = signal(false);

    toggleCollapse() {
        this.isCollapsed.update(v => !v);
    }

    setCollapsed(value: boolean) {
        this.isCollapsed.set(value);
    }
}
