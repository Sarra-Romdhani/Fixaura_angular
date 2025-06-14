import { Routes } from '@angular/router';
import { LoginComponent } from './fixaura/login/login.component';
import { ChooseServicePageComponent } from './fixaura/choose-service-page/choose-service-page.component';
import { NotificationsPageComponent } from './fixaura/notifications-page/notifications-page.component';
import { ReservationsPageComponent } from './fixaura/reservations-page/reservations-page.component';
import { HomeScreenPrestataireComponent } from './fixaura/home-screen-prestataire/home-screen-prestataire.component';
import { ChatbotDiscussionPageComponent } from './fixaura/chatbot-discussion-page/chatbot-discussion-page.component';
import { MapComponent } from './fixaura/map/map.component';
import { MessagesScreenComponent } from './fixaura/messages-screen/messages-screen.component';
import { MessagesDiscussionComponent } from './fixaura/messages-discussion-component/messages-discussion-component.component';
import { ServiceComponent } from './fixaura/service/service.component';
import { PublicationComponent } from './fixaura/publication/publication.component';
import { ProfilePageComponent } from './fixaura/profile-page/profile-page.component';
import { InfoPersoComponent } from './fixaura/info-perso/info-perso.component';
import { HistoryComponent } from './fixaura/history/history.component';
import { FactureListComponent } from './fixaura/facture/facture-list.component';
import { FactureDetailsComponent } from './fixaura/facture/facture-details.component';
import { ReserveComponent } from './fixaura/reserve/reserve.component';
import { PlanningDayComponent } from './fixaura/planning-day/planning-day.component';
import { ApplianceDetailsComponent } from './fixaura/appliance-details/appliance-details.component';
import { ApplianceInputComponent } from './fixaura/appliance-input/appliance-input.component';
import { AppliancesListComponent } from './fixaura/appliances-list/appliances-list.component';
import { ApplianceUpdateComponent } from './fixaura/appliance-update/appliance-update.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard/admin-dashboard.component';
import { ClientAdminComponent } from './admin-dashboard/client-admin/client-admin.component';
import { PrestataireAdminComponent } from './admin-dashboard/prestataire-admin/prestataire-admin.component';
import { AuthGuard } from './services/auth.guard';
import { LoginAdminComponent } from './admin-dashboard/login-admin/login-admin.component';

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
  { path: '**', redirectTo: '/login' }



];
