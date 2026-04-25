/**
 * Search History Component
 * Student: BoLi
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 Phase 3c
 * Description: Displays recent search history with quick access
 */

import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { StorageService3c } from '../services/storage.service.3c';

@Component({
  selector: 'app-search-history',
  template: `
    <div class="search-history" *ngIf="history.length > 0">
      <div class="history-header">
        <ion-label>Recent Searches</ion-label>
        <ion-button fill="clear" size="small" (click)="clearHistory()">
          Clear All
        </ion-button>
      </div>
      
      <ion-chip *ngFor="let term of history; let i = index"
                (click)="selectTerm(term)">
        <ion-icon name="time-outline"></ion-icon>
        <ion-label>{{ term }}</ion-label>
        <ion-icon name="close-circle" (click)="removeTerm(i); $event.stopPropagation()"></ion-icon>
      </ion-chip>
    </div>
  `,
  styles: [`
    .search-history {
      padding: 8px 16px;
    }
    
    .history-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    ion-chip {
      margin: 4px;
      --background: #f0f0f0;
    }
    
    ion-icon {
      margin-right: 4px;
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class SearchHistoryComponent implements OnInit {
  @Output() termSelected = new EventEmitter<string>();

  history: string[] = [];

  constructor(private storageService: StorageService3c) {}

  async ngOnInit(): Promise<void> {
    await this.loadHistory();
  }

  async loadHistory(): Promise<void> {
    this.history = await this.storageService.getSearchHistory();
  }

  selectTerm(term: string): void {
    this.termSelected.emit(term);
  }

  async removeTerm(index: number): Promise<void> {
    this.history.splice(index, 1);
    await this.storageService.saveSearchHistory(this.history);
  }

  async clearHistory(): Promise<void> {
    await this.storageService.clearSearchHistory();
    this.history = [];
  }
}
