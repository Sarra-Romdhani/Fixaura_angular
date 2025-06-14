import { Routes } from '@angular/router';
import { LoginComponent } from './fixaura/login/login.component';
import { ChooseServicePageComponent } from './fixaura/client/choose-service-page/choose-service-page.component';
import { authGuard } from './gaurd/auth.guard';
import { Signup1Component } from './fixaura/signup/signup1/signup1.component';
import { Signup2Component } from './fixaura/signup/signup2/signup2.component';
import { Signup3Component } from './fixaura/signup/signup3/signup3.component';
import { Step1Component } from './fixaura/forget-password/step1/step1.component';
import { Step2Component } from './fixaura/forget-password/step2/step2.component';
import { Step3Component } from './fixaura/forget-password/step3/step3.component';
import { HomeComponent } from './fixaura/client/Home Client/home/home.component';
import { TopBarHomeComponent } from './fixaura/client/Home Client/top-bar-home/top-bar-home.component';
import { MessageComponent } from './fixaura/client/Home Client/message/message.component';
import { DiscuterAvecAiComponent } from './fixaura/client/Home Client/discuter-avec-ai/discuter-avec-ai.component';
import { ReservationsComponent } from './fixaura/client/Home Client/reservations/reservations.component';
import { BottomNavigationBarClientComponent } from './fixaura/client/bottom-navigation-bar-client/bottom-navigation-bar-client.component';
import { ClientComponent } from './fixaura/client/client.component';
import { SearchComponent } from './fixaura/client/search/search.component';
import { ProfileComponent } from './fixaura/client/profile/profile.component';
import { HistoriqueComponent } from './fixaura/client/historique/historique.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { 
        path: 'choose-service/:id',
        component: ChooseServicePageComponent ,
        canActivate : [authGuard]
    },
    { path: 'first step', component: Signup1Component },
    { path: 'second step', component: Signup2Component },
    { path: 'final step', component: Signup3Component },
    { path: 'enter email', component: Step1Component },
    { path: 'enter code', component: Step2Component },
    { path: 'update password', component: Step3Component },
    {
        path: 'client',
        component: ClientComponent,
        children: [
            {
                path: 'top-bar-home',
                component: TopBarHomeComponent,
                children: [
                    { path: '', component: HomeComponent },
                    { path: 'home', component: HomeComponent },
                    { path: 'reservation', component: ReservationsComponent },
                    { path: 'message', component: MessageComponent },
                    { path: 'discuter-avec-ai', component: DiscuterAvecAiComponent },
                    { path: '', redirectTo: 'home', pathMatch: 'full' }
                ]
            },
            { path:'recherche',component:SearchComponent},
            { path:'profile',component:ProfileComponent},
        ]
    },
    { path:'historique',component:HistoriqueComponent},
    { path: 'bottom navigation bar', component: BottomNavigationBarClientComponent },
    { path:'bottom navigation bar',component:BottomNavigationBarClientComponent},
    { path: '**', redirectTo: '/login' },
];
