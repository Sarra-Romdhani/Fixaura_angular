import { Routes } from '@angular/router';
import { LoginComponent } from './fixaura/prestataire/login/login.component';
import { ChooseServicePageComponent } from './fixaura/prestataire/choose-service-page/choose-service-page.component';
import { NotificationsPageComponent } from './fixaura/prestataire/notifications-page/notifications-page.component';
import { ReservationsPageComponent } from './fixaura/prestataire/reservations-page/reservations-page.component';
import { HomeScreenPrestataireComponent } from './fixaura/prestataire/home-screen-prestataire/home-screen-prestataire.component';
import { ChatbotDiscussionPageComponent } from './fixaura/prestataire/chatbot-discussion-page/chatbot-discussion-page.component';
import { MapComponent } from './fixaura/prestataire/map/map.component';
import { MessagesScreenComponent } from './fixaura/prestataire/messages-screen/messages-screen.component';
import { MessagesDiscussionComponent } from './fixaura/prestataire/messages-discussion-component/messages-discussion-component.component';
import { ServiceComponent } from './fixaura/prestataire/service/service.component';
import { PublicationComponent } from './fixaura/prestataire/publication/publication.component';
import { ProfilePageComponent } from './fixaura/prestataire/profile-page/profile-page.component';
import { InfoPersoComponent } from './fixaura/prestataire/info-perso/info-perso.component';
import { HistoryComponent } from './fixaura/prestataire/history/history.component';
import { FactureListComponent } from './fixaura/prestataire/facture/facture-list.component';
import { FactureDetailsComponent } from './fixaura/prestataire/facture/facture-details.component';
import { ReserveComponent } from './fixaura/prestataire/reserve/reserve.component';
import { PlanningDayComponent } from './fixaura/prestataire/planning-day/planning-day.component';
import { ApplianceDetailsComponent } from './fixaura/prestataire/appliance-details/appliance-details.component';
import { ApplianceInputComponent } from './fixaura/prestataire/appliance-input/appliance-input.component';
import { AppliancesListComponent } from './fixaura/prestataire/appliances-list/appliances-list.component';
import { ApplianceUpdateComponent } from './fixaura/prestataire/appliance-update/appliance-update.component';
import { AdminDashboardComponent } from './fixaura/admin-dashboard/admin-dashboard/admin-dashboard.component';
import { ClientAdminComponent } from './fixaura/admin-dashboard/client-admin/client-admin.component';
import { PrestataireAdminComponent } from './fixaura/admin-dashboard/prestataire-admin/prestataire-admin.component';
import { AuthGuard } from './fixaura/services/auth.guard';
import { LoginAdminComponent } from './fixaura/admin-dashboard/login-admin/login-admin.component';

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
  // { path: 'login', component: LoginComponent },
  // { path: 'home/:userId', component: HomeScreenPrestataireComponent },
  // { path: 'choose-service/:userId', component: ChooseServicePageComponent },
  // { path: 'notifications/:userId', component: NotificationsPageComponent },
  // { path: 'reservations/:userId', component: ReservationsPageComponent },
  // { path: 'chatbot/:userId', component: ChatbotDiscussionPageComponent },
  // { path: 'messages/:userId', component: MessagesScreenComponent },
  // { path: 'messages/discussion/:userId/:receiverId', component: MessagesDiscussionComponent },
  // { path: 'map/:reservationId/:userId', component: MapComponent },
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: '**', redirectTo: '/login' }
  { path: 'login', component: LoginComponent },
  { path: 'home/:userId', component: HomeScreenPrestataireComponent },
  { path: 'choose-service/:userId', component: ChooseServicePageComponent },
  { path: 'notifications/:userId', component: NotificationsPageComponent },
  { path: 'reservations/:userId', component: ReservationsPageComponent },
  { path: 'chatbot/:userId', component: ChatbotDiscussionPageComponent },
  { path: 'messages/:userId', component: MessagesScreenComponent },
  { path: 'messages/discussion/:userId/:receiverId', component: MessagesDiscussionComponent },
  { path: 'map/:userId/:reservationId', component: MapComponent },
 // { path: 'profile/:userId/', component: PrestataireComponent },
  { path: 'publications/:userId', component: PublicationComponent },
  // { path: 'publications/:userId', component: PublicationComponent },
   // { path: 'services/:userId', component: ServiceComponent,},
{ path: 'profile/:userId', component: ProfilePageComponent },
{ path: 'info-perso/:userId', component: InfoPersoComponent }, 
{ path: 'history/:prestataireId', component: HistoryComponent },
//{ path: 'factures/:prestataireId', component: FactureListComponent },
  //{ path: 'factures/detail/:id', component: FactureDetailComponent },
// {  path: 'prestataire/:prestataireId/factures',   component: FactureListComponent  },
{ path: 'factures/:id', component: FactureListComponent },
{ path: 'factures/:prestataireId/:factureId', component: FactureDetailsComponent },
  { path: 'planning-day/:prestataireId', component: PlanningDayComponent },
  { path: 'reserve/:prestataireId', component: ReserveComponent }, 
{ path: 'reserve/:prestataireId', component: ReserveComponent },
  { path: 'planning-day/:prestataireId', component: PlanningDayComponent },
{ path: 'appliances/:userId', component: AppliancesListComponent },
  { path: 'appliances/:userId/details/:id', component: ApplianceDetailsComponent },
  { path: 'appliances/:userId/add', component: ApplianceInputComponent },
{ path: 'appliances/:userId/update/:id', component: ApplianceUpdateComponent },

// {
//     path: 'admin',
//     component: AdminDashboardComponent,
//   },
  // { path: 'clients', component: ClientAdminComponent },
  // { path: 'prestataires', component: PrestataireAdminComponent },
  //  { path: 'admin/login', component: LoginAdminComponent },
  // { path: 'admin/dashboard', component: AdminDashboardComponent }, // Placeholder for 
{ path: 'clients', component: ClientAdminComponent, canActivate: [AuthGuard] },
  { path: 'prestataires', component: PrestataireAdminComponent, canActivate: [AuthGuard] },
  { path: 'admin/login', component: LoginAdminComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  //{ path: '**', redirectTo: '/login' },





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
