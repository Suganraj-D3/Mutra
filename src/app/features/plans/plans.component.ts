import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';

interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit{
  selectedPlanId: string = 'free';
  activationCode: string = '';
  showCodeInput: boolean = false;
  pendingPlanId: string = '';
  errorMessage: string = '';
  plans: Plan[] = [
    { id: 'free', name: 'Free', price: '$0', features: ['Video tutorials', 'Live streaming'],icon: 'pi pi-gift'},
    { id: 'pro', name: 'Pro', price: '$19', features: ['Video tutorials', 'Live streaming', 'Post Notes'], recommended: true,icon: 'pi pi-tag' },
    { id: 'vip', name: 'VIP', price: '$49', features: ['All features included', 'Priority support'],recommended: true,icon: 'pi pi-ticket' }
  ];

  constructor(private authService: AuthService) {}


  ngOnInit() {
    this.authService.currentPlan$.subscribe(plan => {
      console.log("Plan is: "+  plan);
      this.selectedPlanId = plan;
    });
  }

  selectPlan(id: string) {
    if (id === 'free') {
      this.selectedPlanId = id;
      this.showCodeInput = false;
      this.authService.updatePlan('free');
      return;
    }
    this.pendingPlanId = id;
    this.showCodeInput = true;
    this.activationCode = '';
    this.errorMessage = '';
  }

  verifyAndActivate() {
  const currentUser = this.authService.getUserName();
  const requiredCode = currentUser + "code123";
  
  if (this.activationCode === requiredCode) {
    this.selectedPlanId = this.pendingPlanId;
    this.authService.updatePlan(this.selectedPlanId);
    
    this.showCodeInput = false;
    this.errorMessage = '';
    alert(`Plan ${this.pendingPlanId.toUpperCase()} activated successfully!`);
  } else {
    this.errorMessage = 'Invalid activation code for this user.';
  }
}

  cancelActivation() {
    this.showCodeInput = false;
    this.pendingPlanId = '';
  }
}