/**
 * Loading Skeleton Component
 * Student: BoLi
 * Course: PROG2005 Programming Mobile Systems
 * Assessment: A3 Part1 Phase 3c
 * Description: Skeleton loading animation for better UX
 */

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-loading-skeleton',
  template: `
    <div class="skeleton-container">
      <ion-skeleton-text 
        *ngFor="let item of skeletonItems" 
        [animated]="animated"
        [style.width]="width"
        [style.height]="height">
      </ion-skeleton-text>
    </div>
  `,
  styles: [`
    .skeleton-container {
      padding: 16px;
    }
    
    ion-skeleton-text {
      margin-bottom: 12px;
      border-radius: 8px;
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class LoadingSkeletonComponent {
  @Input() count = 5;
  @Input() animated = true;
  @Input() width = '100%';
  @Input() height = '60px';

  skeletonItems: number[] = [];

  ngOnInit(): void {
    this.skeletonItems = Array(this.count).fill(0).map((_, i) => i);
  }
}
