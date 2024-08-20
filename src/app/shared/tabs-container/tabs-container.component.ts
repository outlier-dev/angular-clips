import {Component, ContentChildren, AfterContentInit, QueryList} from '@angular/core';
import {TabComponent} from "../tab/tab.component";
import {tap} from "rxjs";

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrl: './tabs-container.component.scss'
})
export class TabsContainerComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs?: QueryList<TabComponent>;

  activeClasses = 'bg-indigo-400 hover:text-white text-white';
  unActiveClasses = 'hover:text-indigo-400';

  ngAfterContentInit() {
    const activeTabs = this.tabs?.filter(el => el.active)

    if (!activeTabs || activeTabs.length === 0) {
      this.selectTab(this.tabs!.first)
    }
  }

  selectTab(tab: TabComponent) {
    this.tabs?.forEach( tab => {
      tab.active = false;
    });
    tab.active = true;

    return false
  }
}
