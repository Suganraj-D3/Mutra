import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  private planSub!: Subscription;

  constructor(private readonly authService: AuthService) {}

  ngOnInit() {
    this.planSub = this.authService.currentPlan$.subscribe(plan => {
      this.generateMenu(plan);
    });
  }

  generateMenu(currentPlan: string) {
    const isAdmin = this.authService.hasRole('admin');

    const menuItems: MenuItem[] = [
      {
        label: 'Main',
        items: [
          { label: 'Video tutorials', icon: 'pi pi-video', routerLink: '/videotutorials' },
          { label: 'Live streaming', icon: 'pi pi-chart-bar', routerLink: '/livestreaming' }
        ]
      },
      {
        label: 'User',
        items: [
          { label: 'Courses', icon: 'pi pi-hourglass', routerLink: '/courses' },
          { label: 'Technical Details', icon: 'pi pi-external-link', url: 'http://localhost:4201/'}
        ]
      }
    ];

    if (currentPlan === 'pro') {
      menuItems[0].items?.push({ 
        label: 'Notes', 
        icon: 'pi pi-pencil', 
        routerLink: '/notes' 
      });
    }
    
    if(currentPlan === 'vip'){
      menuItems[0].items?.push({ 
        label: 'Notes', 
        icon: 'pi pi-pencil', 
        routerLink: '/notes' 
      },
      { 
        label: 'Bookings', 
        icon: 'pi pi-calendar-plus', 
        routerLink: '/bookings' 
      });
    }

    if (isAdmin) {
      menuItems[1].items?.push({
        label: 'Users Management',
        icon: 'pi pi-users',
        routerLink: '/admin'
      });
    }

    menuItems.push({
      label: 'Additional',
      items: [{ label: 'Plan Selector', icon: 'pi pi-sitemap', routerLink: '/plans' }]
    });

    this.items = menuItems;
  }

  ngOnDestroy() {
    if (this.planSub) this.planSub.unsubscribe();
  }
}